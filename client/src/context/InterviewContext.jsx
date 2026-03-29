import { createContext, useContext, useReducer, useCallback } from 'react';

const InterviewContext = createContext(null);

const initialState = {
  // Session config
  role: '',
  difficulty: 'medium',
  persona: 'standard',
  totalQuestions: 5,

  // Session state
  sessionId: null,
  status: 'idle', // idle | loading | active | evaluating | complete | error

  // Current question
  currentQuestion: null,
  questionNumber: 0,

  // Results
  answers: [],
  currentFeedback: null,

  // Error
  error: null,
};

function interviewReducer(state, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, ...action.payload };

    case 'START_SESSION':
      return { ...state, status: 'loading', error: null };

    case 'SESSION_STARTED':
      return {
        ...state,
        status: 'active',
        sessionId: action.payload.sessionId,
        currentQuestion: action.payload.currentQuestion,
        questionNumber: 1,
        answers: [],
        currentFeedback: null,
        error: null,
      };

    case 'SUBMIT_ANSWER':
      return { ...state, status: 'evaluating', error: null };

    case 'ANSWER_EVALUATED':
      return {
        ...state,
        status: action.payload.isComplete ? 'complete' : 'active',
        currentFeedback: action.payload.evaluation,
        answers: [
          ...state.answers,
          {
            question: state.currentQuestion,
            answer: action.payload.userAnswer,
            evaluation: action.payload.evaluation,
          },
        ],
        currentQuestion: action.payload.nextQuestion,
        questionNumber: action.payload.isComplete
          ? state.questionNumber
          : state.questionNumber + 1,
      };

    case 'NEXT_QUESTION':
      return { ...state, currentFeedback: null };

    case 'SET_ERROR':
      return { ...state, status: 'error', error: action.payload };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

export function InterviewProvider({ children }) {
  const [state, dispatch] = useReducer(interviewReducer, initialState);

  const setConfig = useCallback((config) => {
    dispatch({ type: 'SET_CONFIG', payload: config });
  }, []);

  const startSession = useCallback(() => {
    dispatch({ type: 'START_SESSION' });
  }, []);

  const sessionStarted = useCallback((data) => {
    dispatch({ type: 'SESSION_STARTED', payload: data });
  }, []);

  const submitAnswer = useCallback(() => {
    dispatch({ type: 'SUBMIT_ANSWER' });
  }, []);

  const answerEvaluated = useCallback((data) => {
    dispatch({ type: 'ANSWER_EVALUATED', payload: data });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value = {
    ...state,
    setConfig,
    startSession,
    sessionStarted,
    submitAnswer,
    answerEvaluated,
    nextQuestion,
    setError,
    reset,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}

export default InterviewContext;
