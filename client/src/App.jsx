import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { InterviewProvider } from './context/InterviewContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import InterviewPage from './pages/InterviewPage';
import SummaryPage from './pages/SummaryPage';
import Header from './components/Header';
import AtsScannerPage from './pages/AtsScannerPage';
import QuestionsPage from './pages/QuestionsPage';
import UpgradePage from './pages/UpgradePage';
import HowItWorksPage from './pages/HowItWorksPage';

// Layout wrapper to include the Header 
function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/interview" element={<InterviewPage />} />
              <Route path="/summary/:sessionId" element={<SummaryPage />} />
              <Route path="/ats" element={<AtsScannerPage />} />
              <Route path="/questions" element={<QuestionsPage />} />
              <Route path="/upgrade" element={<UpgradePage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
