import React from 'react';
import { Check, X, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

export function calculatePasswordStrength(password = '') {
  const criteria = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'Contains a number (0-9)', met: /[0-9]/.test(password) },
    { label: 'Contains special symbol (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) }
  ];

  const score = criteria.filter(c => c.met).length;

  let label = 'Very Weak';
  let color = 'bg-rose-500';
  let textColor = 'text-rose-600';
  let border = 'border-rose-200';
  let percentage = (score / criteria.length) * 100;

  if (score === 0) {
    label = 'Enter Password';
    color = 'bg-slate-200';
    textColor = 'text-slate-400';
    percentage = 0;
  } else if (score <= 2) {
    label = 'Weak';
    color = 'bg-rose-500';
    textColor = 'text-rose-600';
  } else if (score === 3) {
    label = 'Fair';
    color = 'bg-amber-500';
    textColor = 'text-amber-600';
  } else if (score === 4) {
    label = 'Good';
    color = 'bg-[#0038FF]';
    textColor = 'text-[#0038FF]';
  } else if (score === 5) {
    label = 'Strong';
    color = 'bg-emerald-500';
    textColor = 'text-emerald-600';
  }

  return { criteria, score, label, color, textColor, border, percentage, isStrong: score >= 4 };
}

export default function PasswordStrengthChecker({ password = '', showCriteria = true }) {
  if (!password) return null;

  const { criteria, score, label, color, textColor, percentage, isStrong } = calculatePasswordStrength(password);

  return (
    <div className="space-y-2 mt-2 pt-1 animate-in fade-in duration-200">
      {/* Strength Bar & Label */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-500 flex items-center gap-1 font-bold">
          {isStrong ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Shield className="w-3.5 h-3.5 text-slate-400" />}
          Security Level:
        </span>
        <span className={`font-bold ${textColor} uppercase tracking-wider`}>
          {label} ({score}/5)
        </span>
      </div>

      {/* Segmented Meter */}
      <div className="grid grid-cols-5 gap-1.5 h-1.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= level ? color : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Criteria Checklist */}
      {showCriteria && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1.5 text-[10px] font-mono">
          {criteria.map((c, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-1.5 transition-colors ${
                c.met ? 'text-emerald-700 font-semibold' : 'text-slate-400'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${
                c.met ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
              }`}>
                {c.met ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
              </span>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
