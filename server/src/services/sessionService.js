const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSession(role, difficulty, totalQuestions = 5) {
  return prisma.session.create({
    data: {
      role,
      difficulty,
      totalQuestions,
      status: 'active',
    },
  });
}

async function getSession(sessionId) {
  return prisma.session.findUnique({
    where: { id: sessionId },
    include: { questions: { orderBy: { questionNumber: 'asc' } } },
  });
}

async function addQuestion(sessionId, questionNumber, text) {
  return prisma.question.create({
    data: {
      sessionId,
      questionNumber,
      text,
    },
  });
}

async function updateAnswer(questionId, answer, evaluation) {
  return prisma.question.update({
    where: { id: questionId },
    data: {
      userAnswer: answer,
      score: evaluation.score,
      strengths: JSON.stringify(evaluation.strengths),
      weaknesses: JSON.stringify(evaluation.weaknesses),
      suggestions: JSON.stringify(evaluation.suggestions),
      answeredAt: new Date(),
    },
  });
}

async function completeSession(sessionId) {
  const session = await getSession(sessionId);
  
  if (!session) throw new Error('Session not found');

  const answeredQuestions = session.questions.filter(q => q.score !== null);
  const totalScore = answeredQuestions.reduce((sum, q) => sum + q.score, 0);
  const overallScore = answeredQuestions.length > 0
    ? Math.round((totalScore / answeredQuestions.length) * 10) / 10
    : 0;

  return prisma.session.update({
    where: { id: sessionId },
    data: {
      status: 'completed',
      overallScore,
    },
    include: { questions: { orderBy: { questionNumber: 'asc' } } },
  });
}

async function getSessionSummary(sessionId) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { questions: { orderBy: { questionNumber: 'asc' } } },
  });

  if (!session) return null;

  const questions = session.questions.map(q => ({
    id: q.id,
    questionNumber: q.questionNumber,
    text: q.text,
    userAnswer: q.userAnswer,
    score: q.score,
    strengths: q.strengths ? JSON.parse(q.strengths) : [],
    weaknesses: q.weaknesses ? JSON.parse(q.weaknesses) : [],
    suggestions: q.suggestions ? JSON.parse(q.suggestions) : [],
  }));

  const answeredQuestions = questions.filter(q => q.score !== null);
  const allStrengths = answeredQuestions.flatMap(q => q.strengths);
  const allWeaknesses = answeredQuestions.flatMap(q => q.weaknesses);
  const allSuggestions = answeredQuestions.flatMap(q => q.suggestions);

  return {
    id: session.id,
    role: session.role,
    difficulty: session.difficulty,
    status: session.status,
    overallScore: session.overallScore,
    totalQuestions: session.totalQuestions,
    answeredQuestions: answeredQuestions.length,
    createdAt: session.createdAt,
    questions,
    overallFeedback: {
      strengths: [...new Set(allStrengths)].slice(0, 5),
      weaknesses: [...new Set(allWeaknesses)].slice(0, 5),
      suggestions: [...new Set(allSuggestions)].slice(0, 5),
    },
  };
}

async function getRecentSessions(limit = 10) {
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { questions: { orderBy: { questionNumber: 'asc' } } },
  });

  return sessions.map(s => ({
    id: s.id,
    role: s.role,
    difficulty: s.difficulty,
    status: s.status,
    overallScore: s.overallScore,
    totalQuestions: s.totalQuestions,
    answeredQuestions: s.questions.filter(q => q.score !== null).length,
    createdAt: s.createdAt,
  }));
}

module.exports = {
  createSession,
  getSession,
  addQuestion,
  updateAnswer,
  completeSession,
  getSessionSummary,
  getRecentSessions,
};
