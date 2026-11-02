import { useState } from 'react';
import { Building2, Laugh, GraduationCap, Moon, Sun, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Logo } from '@/components/common/Logo';
import { FOUNDERS } from '@/content/legalPages';

export function LoginView() {
  const { signInWithGoogle, theme, toggleTheme } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    setError(null);
    setLoading(true);
    try {
      if (signInWithGoogle) {
        await signInWithGoogle();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('popup-closed-by-user')) {
        setError('Sign-in failed. Please allow popups or check your Google connection.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar with Logo & Dark Mode Toggle */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Logo size="md" />

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 shadow-sm transition"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </header>

      {/* Main Hero & Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-9 shadow-xl shadow-slate-200/50 dark:shadow-black/50 text-center">
            {/* Unique Big Logo Icon */}
            <div className="flex justify-center mb-6">
              <Logo size="xl" showText={false} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome to <span className="text-teal-600 dark:text-teal-400">StethoConnect</span>
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              The ultimate campus social network to connect with your college mates and share campus life.
            </p>

            {/* Core Campus Social Pillars */}
            <div className="my-6 grid grid-cols-3 gap-2 text-left rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col items-center text-center p-1">
                <Building2 className="h-5 w-5 text-teal-600 dark:text-teal-400 mb-1" />
                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-200">Campus Feed</span>
                <span className="text-[10px] text-slate-500">MGM, AIIMS & more</span>
              </div>
              <div className="flex flex-col items-center text-center p-1 border-x border-slate-200 dark:border-slate-700">
                <Laugh className="h-5 w-5 text-teal-600 dark:text-teal-400 mb-1" />
                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-200">Campus Memes</span>
                <span className="text-[10px] text-slate-500">Relatable humor</span>
              </div>
              <div className="flex flex-col items-center text-center p-1">
                <GraduationCap className="h-5 w-5 text-teal-600 dark:text-teal-400 mb-1" />
                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-200">Exam & Notes</span>
                <span className="text-[10px] text-slate-500">Peer help & tips</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 p-3 text-xs text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-left">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Authentication Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-100 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-[0.99] transition disabled:opacity-60"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Signing into Google...' : 'Sign in with Google'}</span>
            </button>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
              Join your campus community to connect with peers, seniors & alumni.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-500 dark:text-slate-600 border-t border-slate-200/60 dark:border-slate-800">
        StethoConnect · Founded by {FOUNDERS} · Student Campus Social Network
      </footer>
    </div>
  );
}
