import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, loginWithGoogle, loginDemo, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Prefill remembered email if available
  useEffect(() => {
    const remembered = localStorage.getItem('aderno_remember_email');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    const res = await loginWithEmail(email, password, rememberMe);
    setLoading(false);

    if (!res.success) {
      if (res.code === 'auth/invalid-credential' || res.code === 'auth/wrong-password' || res.code === 'auth/user-not-found') {
        setError('Invalid email or password. Please verify your credentials or create a new Super Admin account.');
      } else if (res.code === 'auth/too-many-requests') {
        setError('Too many unsuccessful attempts. Access temporarily locked for safety.');
      } else {
        setError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } else {
      navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (!res.success) {
      if (res.code !== 'auth/popup-closed-by-user') {
        setError(res.error || 'Google authentication encountered an error. Please try again.');
      }
    } else {
      navigate('/');
    }
  };

  const handleDemoSuperAdmin = () => {
    loginDemo('superadmin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#CCFF00] selection:text-slate-900 dot-matrix">
      
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#0038FF]/5 via-transparent to-transparent pointer-events-none" />

      {/* Top Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 mb-6">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <img 
            src="/aderno-logo.svg" 
            alt="Aderno Logo" 
            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
          />
          <span className="text-[10px] font-mono bg-[#0038FF]/10 text-[#0038FF] border border-[#0038FF]/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            COMMAND CENTER
          </span>
        </Link>
        <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Enterprise Authentication
        </h2>
        <p className="mt-1 text-xs text-slate-600 font-sans">
          Log in with your Super Admin credentials or authorized Google enterprise identity.
        </p>
      </div>

      {/* Login Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 relative overflow-hidden">
          
          {/* Tech Corner HUD Marks */}
          <div className="hud-corner-tl" />
          <div className="hud-corner-br" />

          {/* Super Admin Status Pill */}
          <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-slate-500 text-[11px]">ROLE ACCESS:</span>
              <span className="font-mono font-bold text-[#0038FF] text-[11px]">SUPER ADMIN BASE</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
              SECURE TLS
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-tight">{error}</div>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-xs transition-all hover:border-[#0038FF] disabled:opacity-60"
          >
            {/* Official Google G Logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{googleLoading ? 'Connecting to Google Auth...' : 'Continue with Google Account'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                OR SIGN IN WITH PASSWORD
              </span>
            </div>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Work / Enterprise Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@aderno.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038FF] focus:bg-white transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password *
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  Firebase Encrypted
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038FF] focus:bg-white transition-all shadow-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 absolute right-2.5 top-1/2 -translate-y-1/2"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0038FF] focus:ring-[#0038FF] accent-[#0038FF]"
                />
                <span className="text-xs text-slate-600 font-medium">Remember password & session</span>
              </label>

              <span className="text-[11px] font-mono text-[#0038FF] font-semibold">
                OAuth 2.0
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full btn-primary-cyber justify-center text-xs py-2.5 mt-2 shadow-md"
            >
              {loading ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>Authenticating Identity...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Bypass (For QA evaluation) */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleDemoSuperAdmin}
              className="text-xs font-mono text-slate-500 hover:text-[#0038FF] transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0038FF]" />
              <span>Instant Super Admin Test Access (Demo Pass)</span>
            </button>
          </div>

        </div>

        {/* Bottom Signup Navigation */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Need a new Super Admin or Procurement account?{' '}
          <Link to="/signup" className="font-bold text-[#0038FF] hover:underline">
            Register Super Admin &rarr;
          </Link>
        </p>

        {/* Back to Public Website */}
        <p className="mt-2 text-center text-xs text-slate-400 font-mono">
          <a href="https://aderno.net" className="hover:text-slate-700 transition-colors">
            &larr; Return to aderno.net public website
          </a>
        </p>
      </div>

    </div>
  );
}
