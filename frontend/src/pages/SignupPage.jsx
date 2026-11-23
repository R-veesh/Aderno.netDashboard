import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Cpu,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthChecker, { calculatePasswordStrength } from '../components/PasswordStrengthChecker';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signupWithEmail, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleKey, setRoleKey] = useState('superadmin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Password confirmation check
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordMismatch = confirmPassword && password !== confirmPassword;
  const { isStrong, score } = calculatePasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full administrator name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter a valid work or enterprise email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match. Please verify.');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the Aderno Enterprise Security & Governance Terms.');
      return;
    }

    setLoading(true);
    const res = await signupWithEmail({
      name: name.trim(),
      email: email.trim(),
      password,
      roleKey
    });
    setLoading(false);

    if (!res.success) {
      if (res.code === 'auth/email-already-in-use') {
        setError('This email address is already registered. Please sign in or use another email.');
      } else if (res.code === 'auth/weak-password') {
        setError('The password is too weak. Please use numbers and mixed case letters.');
      } else {
        setError(res.error || 'Failed to register Super Admin account. Please try again.');
      }
    } else {
      navigate('/');
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setGoogleLoading(true);
    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (!res.success) {
      if (res.code !== 'auth/popup-closed-by-user') {
        setError(res.error || 'Google authentication error. Please try again.');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#CCFF00] selection:text-slate-900 dot-matrix">
      
      {/* Top Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 mb-6">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <img 
            src="/aderno-logo.svg" 
            alt="Aderno Logo" 
            className="h-16 sm:h-20 w-auto object-contain group-hover:scale-105 transition-transform" 
          />
        </Link>
        <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Enterprise Account
        </h2>
        <p className="mt-1 text-xs text-slate-600 font-sans">
          Create your enterprise account to access procurement management.
        </p>
      </div>

      {/* Registration Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0 relative z-10">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 relative overflow-hidden">
          
          {/* Tech Corner HUD Marks */}
          <div className="hud-corner-tl" />
          <div className="hud-corner-br" />

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-tight">{error}</div>
            </div>
          )}

          {/* Google Sign In/Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-xs transition-all hover:border-[#0038FF] disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{googleLoading ? 'Creating with Google...' : 'Quick Register with Google Account'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                OR REGISTER WITH EMAIL & STRONG PASSWORD
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name & Role Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Administrator Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038FF] focus:bg-white transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Assigned Authority Role *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={roleKey}
                    onChange={(e) => setRoleKey(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#0038FF] focus:bg-white shadow-xs font-semibold"
                  >
                    <option value="superadmin">Super Administrator (Full Master)</option>
                    <option value="admin">Administrator</option>
                    <option value="procurement">Procurement Manager</option>
                    <option value="finance">Finance Officer</option>
                  </select>
                </div>
              </div>
            </div>

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
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038FF] focus:bg-white transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password Field with Dynamic Strength Checker */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password *
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  Min. 8 characters
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038FF] focus:bg-white transition-all shadow-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time Dynamic Password Strength Checker */}
              <PasswordStrengthChecker password={password} />
            </div>

            {/* Confirm Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Confirm Password *
                </label>
                {confirmPassword && (
                  <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${
                    passwordsMatch ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Passwords Match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        <span>Passwords Do Not Match</span>
                      </>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-type your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all shadow-xs font-mono ${
                    passwordMismatch ? 'border-rose-400 focus:border-rose-500' : passwordsMatch ? 'border-emerald-400 focus:border-emerald-500' : 'border-slate-300 focus:border-[#0038FF]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms and Governance Agreement */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0038FF] focus:ring-[#0038FF] accent-[#0038FF]"
                />
                <span className="text-xs text-slate-600 leading-tight">
                  I agree to enforce organizational spend policies and uphold Aderno cryptographic audit trail compliance.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading || passwordMismatch}
              className="w-full btn-primary-cyber justify-center text-xs py-2.5 mt-2 shadow-md disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>Provisioning Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Bottom Login Navigation */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Already have an existing account?{' '}
          <Link to="/login" className="font-bold text-[#0038FF] hover:underline">
            Sign In &rarr;
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
