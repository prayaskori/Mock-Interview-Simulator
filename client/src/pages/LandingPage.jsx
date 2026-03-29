import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiBriefcase, FiAperture } from 'react-icons/fi';
import { useInterview } from '../context/InterviewContext';
import api from '../services/api';

const PERSONAS = [
  { id: 'standard', title: 'Standard', desc: 'Balanced & professional' },
  { id: 'tough', title: 'Strict Tech Lead', desc: 'No-nonsense, deep technical dive' },
  { id: 'friendly', title: 'Friendly Mentor', desc: 'Supportive & collaborative' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { setConfig, startSession, sessionStarted, setError } = useInterview();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [persona, setPersona] = useState('standard');
  const [isStarting, setIsStarting] = useState(false);
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    api.getSessions(10).then(setRecentSessions).catch(() => {});
  }, []);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!role) return;
    setIsStarting(true);
    // Passing persona to the config and backend
    setConfig({ role, difficulty, persona, totalQuestions: 5 });
    startSession();

    try {
      const data = await api.startSession(role, difficulty, 5, persona);
      sessionStarted(data);
      navigate('/interview');
    } catch (err) {
      setError(err.message);
      setIsStarting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight">Interview Hub</h1>
          <p className="text-slate-500 mt-2 text-lg">Configure and conquer your AI-driven technical interviews.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <FiPlus /> New Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white col-span-1 md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 -m-8 opacity-10">
            <FiAperture className="w-64 h-64 text-[#0d9488]" />
          </div>
          <h2 className="text-2xl font-bold mb-4 relative z-10">Why settle for standard prep?</h2>
          <p className="text-slate-300 mb-6 max-w-md relative z-10">
            Select an AI persona like "Strict Tech Lead" or "Friendly Mentor" to practice adapting to different interview styles and get dynamic, tailored feedback.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#0d9488] px-4 py-1.5 rounded-full text-sm font-semibold relative z-10 shadow-lg">
            ⭐ Premium Feature
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="card card-hover flex flex-col items-center justify-center p-10 bg-white border-dashed border-2 border-slate-300 cursor-pointer min-h-[220px]"
        >
          <div className="w-16 h-16 bg-[#ccfbf1] text-[#0d9488] rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">
            <FiPlus />
          </div>
          <span className="font-bold text-xl text-slate-700">Start Interview</span>
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-6 flex items-center gap-2"><FiBriefcase /> Recent History</h2>
        {recentSessions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 text-lg">Your simulation history is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentSessions.map((session) => (
              <div key={session.id} className="card p-6 flex flex-col justify-between border-l-4" style={{borderLeftColor: session.status === 'completed' ? '#0d9488' : '#f59e0b'}}>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{session.role}</h3>
                  <div className="flex gap-2 text-sm text-slate-500 font-medium mb-4">
                    <span className="capitalize">{session.difficulty}</span>
                    <span>•</span>
                    <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {session.status === 'completed' ? (
                  <button
                    onClick={() => navigate(`/summary/${session.id}`)}
                    className="btn-outline w-full text-[#0d9488] border-[#0d9488]"
                  >
                    View Analytics Snapshot
                  </button>
                ) : (
                  <button className="btn-outline w-full opacity-50 cursor-not-allowed">In Progress</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900">Configure Simulation</h2>
              <p className="text-slate-500 mt-1">Customize the AI's behavior and the technical domain.</p>
            </div>
            
            <form onSubmit={handleStart} className="p-8 space-y-6 bg-slate-50/50">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Target Role</label>
                  <select required value={role} onChange={(e) => setRole(e.target.value)} className="input-field cursor-pointer font-medium">
                    <option value="" disabled>Select Target Position...</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="ML Engineer">Machine Learning Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Technical Difficulty</label>
                  <select required value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="input-field cursor-pointer capitalize font-medium">
                    <option value="easy">Entry / Junior</option>
                    <option value="medium">Mid-Level</option>
                    <option value="hard">Senior / Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Interviewer Persona ✨</label>
                  <select required value={persona} onChange={(e) => setPersona(e.target.value)} className="input-field cursor-pointer font-medium border-[#0d9488] bg-[#ccfbf1]/20">
                    {PERSONAS.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline" disabled={isStarting}>
                  Cancel
                </button>
                <button type="submit" disabled={isStarting || !role} className="btn-primary">
                  {isStarting ? 'Engaging AI...' : 'Initialize System'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
