import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiVolume2 } from 'react-icons/fi';
import { useInterview } from '../context/InterviewContext';
import api from '../services/api';

export default function InterviewPage() {
  const navigate = useNavigate();
  const {
    sessionId, currentQuestion, questionNumber, status,
    submitAnswer, answerEvaluated, nextQuestion, setError, error, reset,
    totalQuestions, answers, currentFeedback
  } = useInterview();

  const [answer, setAnswer] = useState('');

  const handleTextSubmit = async () => {
    if (!answer.trim()) return;
    submitAnswer();

    try {
      const data = await api.evaluateAnswer(sessionId, currentQuestion.id, answer);
      answerEvaluated({
        evaluation: data.evaluation,
        nextQuestion: data.nextQuestion,
        isComplete: data.progress.isComplete,
        userAnswer: answer,
      });
      setAnswer('');
    } catch (err) {
      setError(err.message);
    }
  };

  const isLastQuestion = answers.length + (currentFeedback ? 0 : 1) >= totalQuestions;

  const handleContinue = () => {
    if (answers.length >= totalQuestions) {
      navigate(`/summary/${sessionId}`);
    } else {
      nextQuestion();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Virtual Interview</h1>
        </div>
      </div>

      {status === 'error' ? (
        <div className="card p-8 bg-red-50 border-red-200 text-center flex flex-col items-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Oops! Something went wrong.</h2>
          <p className="text-red-500 mb-6">{error || 'Failed to process answer.'}</p>
          <button onClick={() => reset()} className="btn-outline border-red-200 text-red-600 hover:bg-red-100">Reset Session</button>
        </div>
      ) : status === 'evaluating' ? (
        <div className="flex flex-col items-center justify-center p-20 text-indigo-600">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="font-semibold">Evaluating your answer...</p>
        </div>
      ) : currentFeedback ? (
        <div className="card p-8 bg-slate-50 border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Feedback Saved</h2>
          <p className="text-slate-600 mb-6">Your answer was evaluated successfully. The details will be shown in the final summary.</p>
          <button onClick={handleContinue} className="btn-primary">
            {answers.length >= totalQuestions ? 'Complete Interview' : 'Next Question'}
          </button>
        </div>
      ) : currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: Questions Panel */}
          <div className="flex flex-col gap-6">
            <div className="card p-6 h-full flex flex-col">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div
                    key={i}
                    className={`text-center py-2 rounded-full text-sm font-semibold border ${
                      i + 1 < questionNumber ? 'bg-indigo-50 border-indigo-200 text-indigo-600' :
                      i + 1 === questionNumber ? 'bg-indigo-600 border-indigo-600 text-white' :
                      'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    Question #{i + 1}
                  </div>
                ))}
              </div>

              <div className="flex-1 mt-4">
                <h3 className="text-lg text-slate-800 font-medium leading-relaxed">
                  {currentQuestion.text}
                </h3>
                
                <button
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
                    window.speechSynthesis.speak(utterance);
                  }}
                  className="mt-4 flex items-center gap-2 text-indigo-600 font-semibold cursor-pointer py-2 hover:bg-slate-50 w-full justify-center rounded-lg border border-transparent hover:border-indigo-100 transition-colors"
                >
                  <FiVolume2 className="text-xl" /> Click here to listen
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-800 text-sm">
              <p><strong>Pro Tip:</strong> Take your time to think through the problem before typing your solution.</p>
            </div>
          </div>
          {/* RIGHT: Answer Input Area */}
          <div className="flex flex-col gap-6">
            <div className="card p-6 flex flex-col gap-4">
              <div className="text-center relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-2 text-xs text-slate-400 uppercase font-medium">Your Answer</span>
              </div>
              
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows="14"
                className="input-field resize-none bg-slate-50"
              />
              
              <button 
                onClick={handleTextSubmit} 
                disabled={!answer.trim()}
                className="btn-primary w-full py-3 mt-1"
              >
                Submit Answer For Grading
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
