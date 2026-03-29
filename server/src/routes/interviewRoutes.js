const express = require('express');
const router = express.Router();
const { AppError } = require('../middleware/errorHandler');
const { generateQuestion, evaluateAnswer, scanResume } = require('../services/aiService');
const sessionService = require('../services/sessionService');

// POST /api/start-session
router.post('/start-session', async (req, res, next) => {
  try {
    const { role, difficulty = 'medium', totalQuestions = 5 } = req.body;

    if (!role) {
      throw new AppError('Role is required', 400);
    }

    const validRoles = ['Software Engineer', 'ML Engineer', 'Data Scientist'];
    if (!validRoles.includes(role)) {
      throw new AppError(`Invalid role. Choose from: ${validRoles.join(', ')}`, 400);
    }

    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
      throw new AppError(`Invalid difficulty. Choose from: ${validDifficulties.join(', ')}`, 400);
    }

    // Create session (we don't save persona in DB to avoid migration, we rely on client state)
    const session = await sessionService.createSession(role, difficulty, totalQuestions);

    // Generate first question using persona
    const { persona = 'standard' } = req.body;
    const questionText = await generateQuestion(role, difficulty, [], persona);
    const question = await sessionService.addQuestion(session.id, 1, questionText);

    res.status(201).json({
      sessionId: session.id,
      role: session.role,
      difficulty: session.difficulty,
      totalQuestions: session.totalQuestions,
      currentQuestion: {
        id: question.id,
        questionNumber: 1,
        text: questionText,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/evaluate-answer
router.post('/evaluate-answer', async (req, res, next) => {
  try {
    const { sessionId, questionId, answer } = req.body;

    if (!sessionId || !questionId || !answer) {
      throw new AppError('sessionId, questionId, and answer are required', 400);
    }

    if (answer.trim().length < 5) {
      throw new AppError('Answer must be at least 5 characters long', 400);
    }

    const session = await sessionService.getSession(sessionId);
    if (!session) {
      throw new AppError('Session not found', 404);
    }

    if (session.status !== 'active') {
      throw new AppError('Session is already completed', 400);
    }

    const currentQuestion = session.questions.find(q => q.id === questionId);
    if (!currentQuestion) {
      throw new AppError('Question not found in this session', 404);
    }

    const { persona = 'standard' } = req.body;

    // Evaluate the answer using persona
    const evaluation = await evaluateAnswer(currentQuestion.text, answer, session.role, persona);

    // Save the evaluation
    await sessionService.updateAnswer(questionId, answer, evaluation);

    const answeredCount = session.questions.filter(q => q.score !== null).length + 1;
    const isLastQuestion = answeredCount >= session.totalQuestions;

    let nextQuestion = null;

    if (!isLastQuestion) {
      // Generate next question
      const previousQuestions = session.questions.map(q => q.text);
      const nextQuestionText = await generateQuestion(
        session.role,
        session.difficulty,
        previousQuestions,
        persona
      );
      const newQuestion = await sessionService.addQuestion(
        sessionId,
        answeredCount + 1,
        nextQuestionText
      );
      nextQuestion = {
        id: newQuestion.id,
        questionNumber: answeredCount + 1,
        text: nextQuestionText,
      };
    } else {
      // Complete the session
      await sessionService.completeSession(sessionId);
    }

    res.json({
      evaluation: {
        score: evaluation.score,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        suggestions: evaluation.suggestions,
      },
      progress: {
        answered: answeredCount,
        total: session.totalQuestions,
        isComplete: isLastQuestion,
      },
      nextQuestion,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/session-summary/:sessionId
router.get('/session-summary/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const summary = await sessionService.getSessionSummary(sessionId);

    if (!summary) {
      throw new AppError('Session not found', 404);
    }

    res.json(summary);
  } catch (error) {
    next(error);
  }
});

// GET /api/sessions - Get recent sessions (history)
router.get('/sessions', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const sessions = await sessionService.getRecentSessions(limit);
    res.json(sessions);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ats-scan
// @desc    Scan a resume against a job description
router.post('/ats-scan', async (req, res, next) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      throw new AppError('Both resume and job description text are required', 400);
    }

    const scanResultStr = await scanResume(resumeText, jobDescription);
    let scanResult;
    try {
      scanResult = JSON.parse(scanResultStr);
    } catch(err) {
      console.error('Failed to parse AI ATS response', scanResultStr);
      throw new AppError('Failed to parse ATS evaluation.', 500);
    }

    res.json(scanResult);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
