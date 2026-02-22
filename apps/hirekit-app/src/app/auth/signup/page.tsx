'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const passwordRules = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special character' },
];

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const allRulesPassed = passwordRules.every((r) => r.test(password));
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!allRulesPassed) {
      setError('Password does not meet all requirements');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }
    if (!consent) {
      setError('You must agree to the terms and privacy policy');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        password,
        companyName: formData.get('companyName'),
      }),
    });

    setLoading(false);
    if (res.ok) {
      router.push('/auth/login?registered=true');
    } else {
      const data = await res.json();
      setError(data.error || 'Signup failed');
    }
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left panel - branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#4F46E5] relative overflow-hidden flex-col justify-between p-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#818CF8] rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#C7D2FE] rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-2xl font-extrabold text-white">HireKit</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Start hiring<br />in minutes.
            </h1>
            <p className="text-lg text-white/70 max-w-md">
              Set up your account, configure your widgets, and start receiving applications today — no coding required.
            </p>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
                <i className="ph ph-lightning text-xl text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Quick Setup</p>
                <p className="text-white/60 text-sm">Get your first widget live in under 5 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
                <i className="ph ph-palette text-xl text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Fully Customizable</p>
                <p className="text-white/60 text-sm">Match your brand colors, fonts, and style perfectly</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
                <i className="ph ph-shield-check text-xl text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">GDPR Compliant</p>
                <p className="text-white/60 text-sm">Built-in consent management and data protection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="flex-1 flex items-center justify-center bg-[#FAFBFC] p-8">
          <div className="w-full max-w-[420px]">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-10 lg:hidden">
              <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-extrabold text-[#4F46E5]">HireKit</span>
            </div>

            <h1 className="text-2xl font-extrabold text-[#1E293B] mb-2">Create your account</h1>
            <p className="text-[#64748B] text-[15px] mb-8">Get started with HireKit for free</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                <i className="ph ph-warning-circle text-lg" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Your Name</label>
                  <div className="relative">
                    <i className="ph ph-user absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="John Smith"
                      className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Company</label>
                  <div className="relative">
                    <i className="ph ph-buildings absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg" />
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="Acme Inc."
                      className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Email</label>
                <div className="relative">
                  <i className="ph ph-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Password</label>
                <div className="relative">
                  <i className="ph ph-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setShowPasswordRules(true)}
                    required
                    placeholder="Create a strong password"
                    className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                  />
                </div>
                {showPasswordRules && password.length > 0 && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg space-y-1.5">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(password);
                      return (
                        <div key={rule.label} className="flex items-center gap-2 text-xs">
                          <i className={`ph ${passed ? 'ph-check-circle text-emerald-500' : 'ph-circle text-slate-300'} text-sm`} />
                          <span className={passed ? 'text-emerald-600' : 'text-[#64748B]'}>{rule.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <i className="ph ph-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat your password"
                    className={`w-full rounded-xl border pl-11 pr-10 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all ${
                      confirmPassword.length > 0 && !passwordsMatch
                        ? 'border-red-300 bg-red-50/50'
                        : 'border-slate-200'
                    }`}
                  />
                  {confirmPassword.length > 0 && (
                    <i className={`ph ${passwordsMatch ? 'ph-check-circle text-emerald-500' : 'ph-x-circle text-red-400'} absolute right-3.5 top-1/2 -translate-y-1/2 text-lg`} />
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                />
                <label htmlFor="consent" className="text-xs text-[#64748B] leading-relaxed">
                  I agree to the{' '}
                  <span className="text-[#4F46E5] font-medium">Terms of Service</span>{' '}
                  and{' '}
                  <span className="text-[#4F46E5] font-medium">Privacy Policy</span>.
                  I consent to HireKit processing my data as described.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !allRulesPassed || !passwordsMatch || !consent}
                className="w-full py-3 bg-[#4F46E5] text-white rounded-xl font-semibold text-sm hover:bg-[#4338CA] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="ph ph-spinner animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="mt-8 text-sm text-center text-[#64748B]">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
