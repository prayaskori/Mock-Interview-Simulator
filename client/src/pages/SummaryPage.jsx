import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../services/api';
import { useInterview } from '../context/InterviewContext';

export default function SummaryPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { reset } = useInterview();
  
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.getSessionSummary(sessionId)
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading summary...</div>;
  if (!summary) return <div className="p-12 text-center text-red-500">Failed to load summary.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-8">
      <div className="mb-8 p-8 border border-slate-200 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white shadow-lg text-center">
        <h1 className="text-4xl font-extrabold text-[#0d9488] mb-2">Interview Concluded</h1>
        <p className="text-slate-300 text-lg">
          Your overall system rating: <strong className="text-white text-2xl">{summary.overallScore}/10</strong>
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {summary.questions?.map((q) => {
          const isExpanded = expandedId === q.id;
          return (
            <div key={q.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex gap-4 items-center">
                  <span className="font-semibold text-slate-700">Q{q.questionNumber}.</span>
                  <span className="font-medium text-slate-900">{q.text}</span>
                </div>
                {isExpanded ? <FiChevronUp className="text-slate-500" /> : <FiChevronDown className="text-slate-500" />}
              </button>
              
              {isExpanded && (
                <div className="p-6 border-t border-slate-100 space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-red-500 mb-2">
                      <span>Rating:</span> {q.score}/10
                    </h4>
                    
                    <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                      <strong className="text-red-800 text-sm block mb-1">Your Answer:</strong>
                      <p className="text-red-700 text-sm whitespace-pre-wrap">{q.userAnswer}</p>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] border border-slate-200 p-4 rounded-xl">
                    <strong className="text-[#0d9488] text-sm block mb-3 uppercase tracking-wider">AI Evaluation & Action Items:</strong>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {q.strengths?.length > 0 && (
                        <div>
                          <p className="text-xs font-extrabold text-[#0f172a] uppercase mb-2 border-b border-slate-200 pb-1">Strengths Demonstrated</p>
                          <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                            {q.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {q.weaknesses?.length > 0 && (
                        <div>
                          <p className="text-xs font-extrabold text-red-800 uppercase mb-2 border-b border-red-100 pb-1">Critical Areas to Improve</p>
                          <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                            {q.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => { reset(); navigate('/'); }}
          className="btn-primary"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
