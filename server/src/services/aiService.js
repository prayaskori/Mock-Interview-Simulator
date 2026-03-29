const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

// Development override: forcefully bypass invalid cached API keys 
const USE_MOCK = true;

let openai = null;
if (!USE_MOCK) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// ─── Mock Data ───────────────────────────────────────────────

const MOCK_QUESTIONS = {
  'Software Engineer': {
    easy: [
      'What is the difference between a stack and a queue? Explain with real-world examples.',
      'Explain the concept of time complexity. What does O(n) mean?',
      'What is the difference between an array and a linked list?',
      'Explain the concept of version control and why Git is commonly used.',
      'What is the difference between HTTP and HTTPS?',
      'Describe what a REST API is and its key principles.',
      'What is the purpose of a database index?',
    ],
    medium: [
      'Explain the SOLID principles with examples. Which principle do you find most important and why?',
      'How would you design a URL shortening service like bit.ly? Walk me through the high-level architecture.',
      'Explain the differences between SQL and NoSQL databases. When would you choose one over the other?',
      'What are microservices? Compare the advantages and disadvantages versus a monolithic architecture.',
      'Explain how a hash table works internally, including collision handling strategies.',
      'What is the CAP theorem and how does it apply to distributed systems?',
      'Describe the Observer design pattern and provide a practical use case.',
    ],
    hard: [
      'Design a distributed rate limiter that works across multiple server instances. How would you handle clock skew?',
      'Explain how you would build a real-time collaborative editing system like Google Docs. What consistency model would you use?',
      'How would you design a system to handle millions of concurrent WebSocket connections? Discuss scaling strategies.',
      'Explain the internals of a B+ tree and why it is preferred for database indexing over a binary search tree.',
      'Design a fault-tolerant message queue system. How would you handle exactly-once delivery?',
    ],
  },
  'ML Engineer': {
    easy: [
      'What is the difference between supervised and unsupervised learning? Give examples of each.',
      'Explain what overfitting is and how you can prevent it.',
      'What is the bias-variance tradeoff?',
      'Explain the difference between classification and regression.',
      'What is cross-validation and why is it useful?',
      'What are features in machine learning?',
      'Explain what a confusion matrix is.',
    ],
    medium: [
      'Explain the architecture of a Transformer model. Why has it become dominant in NLP?',
      'How would you handle class imbalance in a classification problem? Compare at least three techniques.',
      'Explain the difference between batch normalization and layer normalization. When would you use each?',
      'Describe the training pipeline for deploying an ML model to production. What monitoring would you set up?',
      'Explain gradient descent and its variants (SGD, Adam, RMSprop). How do you choose the learning rate?',
      'What is transfer learning and when is it most effective?',
      'Explain the concept of attention mechanism in neural networks.',
    ],
    hard: [
      'Design an end-to-end ML system for real-time fraud detection at scale. How would you handle concept drift?',
      'Explain the mathematics behind backpropagation through a Transformer\'s multi-head attention layer.',
      'How would you design a recommendation system that handles cold-start problems for both users and items?',
      'Explain the differences between GANs, VAEs, and diffusion models. When would you choose each?',
      'Design an MLOps pipeline that supports A/B testing, canary deployments, and automatic rollback.',
    ],
  },
  'Data Scientist': {
    easy: [
      'What is the difference between mean, median, and mode? When would you prefer one over the others?',
      'Explain what a p-value is in simple terms.',
      'What is the difference between correlation and causation?',
      'Explain what a histogram shows and when to use one.',
      'What is the purpose of data normalization?',
      'What is the difference between population and sample in statistics?',
      'Explain what an outlier is and how to detect one.',
    ],
    medium: [
      'Explain A/B testing methodology. How would you determine sample size and statistical significance?',
      'How would you handle missing data in a large dataset? Compare at least four different imputation strategies.',
      'Explain the difference between L1 and L2 regularization. When would you use Elastic Net?',
      'Describe the process of feature engineering. How do you decide which features to create or select?',
      'Explain Principal Component Analysis (PCA) and when it should be used.',
      'What is the difference between parametric and non-parametric tests?',
      'Explain the concept of statistical power and how it relates to sample size.',
    ],
    hard: [
      'Design an experimentation platform for a company running hundreds of A/B tests simultaneously. How would you handle the multiple comparisons problem?',
      'Explain Bayesian inference and how it differs from frequentist statistics. Design a Bayesian A/B testing framework.',
      'How would you build a causal inference pipeline to measure the true impact of a marketing campaign?',
      'Design a data pipeline architecture that handles both real-time streaming and batch processing at petabyte scale.',
      'Explain how you would use propensity score matching for observational studies. What are the key assumptions?',
    ],
  },
};

const MOCK_FEEDBACK = [
  {
    strengths: [
      'Good understanding of core concepts',
      'Clear and structured explanation',
      'Relevant examples provided',
    ],
    weaknesses: [
      'Could go deeper into edge cases',
      'Missing some advanced considerations',
    ],
    suggestions: [
      'Consider discussing trade-offs more explicitly',
      'Add real-world implementation examples',
      'Practice explaining with diagrams or step-by-step walkthroughs',
    ],
  },
  {
    strengths: [
      'Excellent practical approach',
      'Strong problem-solving methodology',
      'Good use of technical terminology',
    ],
    weaknesses: [
      'Could mention scalability concerns',
      'Missing discussion of alternative approaches',
    ],
    suggestions: [
      'Compare multiple solutions before picking one',
      'Discuss time and space complexity',
      'Connect concepts to industry best practices',
    ],
  },
  {
    strengths: [
      'Solid theoretical foundation',
      'Good communication skills',
      'Logical flow of ideas',
    ],
    weaknesses: [
      'Answer could be more concise',
      'Needs more specific examples',
    ],
    suggestions: [
      'Structure your answer using the STAR method',
      'Practice timed responses',
      'Relate abstract concepts to concrete implementations',
    ],
  },
];

// ─── AI Service ──────────────────────────────────────────────

const PERSONA_PROMPTS = {
  standard: 'You are a balanced, professional senior technical interviewer.',
  tough: 'You are a strict, no-nonsense Senior Staff Engineer who demands highly optimal, edge-case-proof answers. You do not sugarcoat feedback.',
  friendly: 'You are a warm, supportive engineering mentor who seeks to guide the candidate and highlight their potential while providing constructive tips.'
};

async function generateQuestion(role, difficulty, previousQuestions = [], persona = 'standard') {
  if (USE_MOCK) {
    return generateMockQuestion(role, difficulty, previousQuestions);
  }

  const prevQList = previousQuestions.length > 0
    ? `\n\nPreviously asked questions (DO NOT repeat these):\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
    : '';
  
  const personaContext = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.standard;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    messages: [
      {
        role: 'system',
        content: `${personaContext} Generate a single interview question that tests the candidate's knowledge and problem-solving ability. The question should be challenging but appropriate for the ${difficulty} level for a ${role} position. Return ONLY the question text, nothing else.${prevQList}`,
      },
      {
        role: 'user',
        content: `Generate a ${difficulty} level interview question for a ${role} position.`,
      },
    ],
  });

  return response.choices[0].message.content.trim();
}

async function evaluateAnswer(question, answer, role, persona = 'standard') {
  if (USE_MOCK) {
    return evaluateMockAnswer(answer);
  }

  const personaContext = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.standard;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: `${personaContext} You are evaluating a candidate's answer for a ${role} position. Evaluate the answer thoroughly and provide structured feedback matching your persona's tone.

You MUST respond with valid JSON in this exact format:
{
  "score": <number 0-10>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Score guide: 0-3 = Poor, 4-5 = Below Average, 6-7 = Good, 8-9 = Very Good, 10 = Excellent.
Provide 2-4 items for each array. Be specific and constructive.`,
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nCandidate's Answer: ${answer}`,
      },
    ],
  });

  const content = response.choices[0].message.content.trim();
  
  try {
    return JSON.parse(content);
  } catch {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI evaluation response');
  }
}

// ─── Mock implementations ────────────────────────────────────

function generateMockQuestion(role, difficulty, previousQuestions) {
  const questions = MOCK_QUESTIONS[role]?.[difficulty] || MOCK_QUESTIONS['Software Engineer']['medium'];
  const available = questions.filter(q => !previousQuestions.includes(q));
  
  if (available.length === 0) {
    return questions[Math.floor(Math.random() * questions.length)];
  }
  
  return available[Math.floor(Math.random() * available.length)];
}

function evaluateMockAnswer(answer) {
  const wordCount = answer.trim().split(/\s+/).length;
  let baseScore;

  if (wordCount < 10) baseScore = 3;
  else if (wordCount < 30) baseScore = 5;
  else if (wordCount < 60) baseScore = 6.5;
  else if (wordCount < 120) baseScore = 7.5;
  else baseScore = 8;

  // Add some randomness
  const score = Math.min(10, Math.max(1, baseScore + (Math.random() * 2 - 1)));
  const roundedScore = Math.round(score * 10) / 10;

  const feedback = MOCK_FEEDBACK[Math.floor(Math.random() * MOCK_FEEDBACK.length)];

  return {
    score: roundedScore,
    ...feedback,
  };
}

function scanMockResume(resumeText) {
  return JSON.stringify({
    matchPercentage: resumeText.length > 50 ? 85 : 40,
    missingKeywords: ['Redux', 'System Design', 'CI/CD'],
    summary: 'The candidate demonstrates basic understanding but lacks deeper architectural keywords.',
    strengths: ['Clear formatting', 'Basic skills listed'],
    actionableFeedback: ['Add more metrics to your impact statements.', 'Highlight specific cloud providers used.']
  });
}

async function scanResume(resumeText, jobDescription) {
  if (USE_MOCK) {
    return scanMockResume(resumeText);
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: `You are an expert Applicant Tracking System (ATS) and Senior Technical Recruiter. Analyze the provided resume against the provided job description. 
        
You MUST respond with valid JSON in this exact format:
{
  "matchPercentage": 75,
  "missingKeywords": ["Docker", "Kubernetes", "Microservices"],
  "summary": "Strong backend experience but missing containerization skills.",
  "strengths": ["Clear progression of roles", "Strong database optimization mentioned"],
  "actionableFeedback": ["Add quantifiable metrics to your most recent role", "Include specific cloud provider names if you used them"]
}`
      },
      {
        role: 'user',
        content: `Job Description:\n${jobDescription}\n\nResume Content:\n${resumeText}`
      }
    ]
  });

  return response.choices[0].message.content.trim();
}

module.exports = { generateQuestion, evaluateAnswer, scanResume };
