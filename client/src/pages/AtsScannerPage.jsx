import { useState } from 'react';
import { FiFileText, FiTarget, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';

export default function AtsScannerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() || !jobDescription.trim()) return;
    
    setIsScanning(true);
    setError('');
    
    try {
      const data = await api.scanResume(resumeText, jobDescription);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to scan resume');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight">ATS Resume Scanner</h1>
        <p className="text-slate-500 mt-2 text-lg">See how your resume stacks up against the job description before you apply.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="card p-6 bg-white border-slate-200">
          <form onSubmit={handleScan} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <FiFileText /> Paste Your Resume Text
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your plain text resume here..."
                className="input-field h-48 resize-none text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <FiTarget /> Paste the Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                className="input-field h-32 resize-none text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isScanning || !resumeText || !jobDescription}
              className="btn-primary"
            >
              {isScanning ? 'Scanning with AI...' : 'Scan Resume'}
            </button>
            {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}
          </form>
        </div>

        {/* Results Panel */}
        <div className="card p-6 bg-slate-50 border-slate-200">
          {!result && !isScanning && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <FiCheckCircle className="text-5xl mb-4 opacity-50" />
              <p>Your analysis will appear here</p>
            </div>
          )}

          {isScanning && (
            <div className="h-full flex flex-col items-center justify-center text-[#0d9488]">
              <div className="w-12 h-12 border-4 border-[#ccfbf1] border-t-[#0d9488] rounded-full animate-spin mb-4" />
              <p className="font-semibold animate-pulse">Analyzing Keywords & Structure...</p>
            </div>
          )}

          {result && !isScanning && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold p-4 rounded-xl border ${result.matchPercentage >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                  {result.matchPercentage}%
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Match Score</h3>
                  <p className="text-slate-500 text-sm">Target &gt; 75% for best chances</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Executive Summary</h4>
                <p className="text-sm text-slate-600">{result.summary}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-700 mb-2 flex items-center gap-1"><FiCheckCircle/> Strengths</h4>
                  <ul className="list-disc pl-4 text-sm text-slate-600 space-y-1">
                    {result.strengths?.map((s,i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-red-100">
                  <h4 className="font-bold text-red-700 mb-2 flex items-center gap-1"><FiAlertCircle/> Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords?.map((k,i) => (
                      <span key={i} className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded border border-red-200">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#ccfbf1]/30 p-4 rounded-xl border border-[#0d9488]/30">
                <h4 className="font-bold text-[#0f766e] mb-2">Actionable Feedback</h4>
                <ul className="list-disc pl-4 text-sm text-[#0f172a] space-y-1 font-medium">
                  {result.actionableFeedback?.map((f,i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
