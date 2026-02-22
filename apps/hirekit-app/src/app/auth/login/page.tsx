'use client';

import { useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);

    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/dashboard');
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
              Hire smarter,<br />not harder.
            </h1>
            <p className="text-lg text-white/70 max-w-md">
              AI-powered recruitment tools that help you find, evaluate, and hire the best talent — all in one platform.
            </p>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
                <i className="ph ph-robot text-xl text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI CV Builder Widget</p>
                <p className="text-white/60 text-sm">Embed on your site, let candidates build CVs with AI assistance</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
                <i className="ph ph-briefcase text-xl text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Job Listings Widget</p>
                <p className="text-white/60 text-sm">Showcase open positions with a beautiful, embeddable widget</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
                <i className="ph ph-chart-line text-xl text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Analytics & Pipeline</p>
                <p className="text-white/60 text-sm">Track applications, schedule interviews, and manage your pipeline</p>
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

            <h1 className="text-2xl font-extrabold text-[#1E293B] mb-2">Welcome back</h1>
            <p className="text-[#64748B] text-[15px] mb-8">Sign in to your HireKit account</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                <i className="ph ph-warning-circle text-lg" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-2">Email</label>
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
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#1E293B]">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <i className="ph ph-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#4F46E5] text-white rounded-xl font-semibold text-sm hover:bg-[#4338CA] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="ph ph-spinner animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <GoogleSignInButton />

            <p className="mt-8 text-sm text-center text-[#64748B]">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function GoogleSignInButton() {
  const [hasGoogle, setHasGoogle] = useState<boolean | null>(null);

  if (hasGoogle === null) {
    getProviders().then((p) => setHasGoogle(!!p?.google));
    return null;
  }

  if (!hasGoogle) return null;

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-[#FAFBFC] text-[#94A3B8] text-xs font-medium">OR</span>
        </div>
      </div>
      <button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all text-sm font-medium text-[#1E293B]"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
          <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
        </svg>
        Continue with Google
      </button>
    </>
  );
}
