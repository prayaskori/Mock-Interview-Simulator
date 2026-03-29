const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const interviewRoutes = require('./routes/interviewRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mode: process.env.OPENAI_API_KEY ? 'ai' : 'mock',
    timestamp: new Date().toISOString() 
  });
});

// Routes
app.use('/api', interviewRoutes);

// Error handling
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Interview Simulator API running on http://localhost:${PORT}`);
    console.log(`📋 Mode: ${process.env.OPENAI_API_KEY ? '🤖 AI (OpenAI)' : '🎭 Mock (no API key)'}\n`);
  });
}

module.exports = app;
