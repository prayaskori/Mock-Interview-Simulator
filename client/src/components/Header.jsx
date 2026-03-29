import { Link, useLocation } from 'react-router-dom';
import { FiMonitor, FiLogOut, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const { user, login, logout } = useAuth();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (email && name) {
      login(email, name);
      setShowLoginModal(false);
    }
  };

  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'ATS Scanner', path: '/ats' },
    { name: 'Questions', path: '/questions' },
    { name: 'Upgrade', path: '/upgrade' },
    { name: 'How it Works', path: '/how-it-works' },
  ];

  return (
    <header className="flex items-center justify-between p-4 px-8 border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
        <FiMonitor className="text-2xl" />
        Preppy.AI
      </Link>

      <nav className="hidden md:flex gap-6">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`font-medium transition-colors hover:text-indigo-600 ${
              path === link.path ? 'text-indigo-600' : 'text-slate-600'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-[#0f172a] tracking-tight ml-2">AceIt.AI</span>
            <img src={user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors font-bold text-sm"
              title="Sign Out"
            >
              <FiLogOut /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f172a] text-white hover:bg-[#0f172a]/90 transition-colors font-bold text-sm shadow-md"
          >
            <FiUser /> Sign In
          </button>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f172a] to-[#0d9488]" />
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <FiX className="text-2xl" />
            </button>
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 text-[#0d9488] font-bold text-2xl mb-1">
                  <FiMonitor />
                  AceIt.AI
                </div>
                <p className="text-slate-500 text-sm">Sign in to track progress.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="input-field py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="input-field py-2"
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-2.5 mt-2">
                  Access Dashboard
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
