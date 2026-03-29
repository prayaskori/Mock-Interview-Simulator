const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Something went wrong',
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      'Network error. Please check if the server is running.',
      0
    );
  }
}

export const api = {
  startSession: (role, difficulty, totalQuestions = 5, persona = 'standard') =>
    request('/start-session', {
      method: 'POST',
      body: JSON.stringify({ role, difficulty, totalQuestions, persona }),
    }),

  evaluateAnswer: (sessionId, questionId, answer, persona = 'standard') =>
    request('/evaluate-answer', {
      method: 'POST',
      body: JSON.stringify({ sessionId, questionId, answer, persona }),
    }),

  getSessionSummary: (sessionId) =>
    request(`/session-summary/${sessionId}`),

  getSessions: (limit = 10) =>
    request(`/sessions?limit=${limit}`),

  scanResume: (resumeText, jobDescription) =>
    request('/ats-scan', {
      method: 'POST',
      body: JSON.stringify({ resumeText, jobDescription }),
    }),

  healthCheck: () =>
    request('/health'),
};

export default api;
