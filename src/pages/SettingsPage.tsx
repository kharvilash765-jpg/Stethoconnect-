import { ChevronRight, ShieldCheck, Info, Scale, Shield, Users, Database, Moon, Sun, type LucideIcon } from 'lucide-react';
import { LEGAL_DOCUMENTS, FOUNDERS } from '@/content/legalPages';
import { useStore } from '@/store/useStore';

const LEGAL_ICONS: Record<string, LucideIcon> = {
  disclaimer: Info,
  'privacy-policy': Shield,
  'terms-and-conditions': Scale,
  'student-safety-policy': ShieldCheck,
  'community-guidelines': Users,
};

export function SettingsPage() {
  const { firebaseConnected, theme, toggleTheme } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">Platform Settings</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Preferences, theme, campus guidelines, and cloud infrastructure for StethoConnect.
        </p>
      </div>

      {/* Theme Settings Box */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
          <span>Appearance & Theme</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </h2>
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Theme</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Easy on the eyes during late night study sessions and campus browsing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm"
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </section>

      {/* Cloud Infrastructure */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Database className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          Cloud Infrastructure
        </h2>
        <div className="rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 p-4 border border-teal-100 dark:border-teal-900/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  firebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {firebaseConnected
                  ? 'Firebase Firestore & Auth Connected'
                  : 'Connecting to Firebase...'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Zero mock/dummy records. 100% authentic Google Cloud Firebase infrastructure.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-600 text-white shadow-sm">
            Live Cloud
          </span>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Founded and maintained by <span className="font-semibold text-slate-800 dark:text-slate-200">{FOUNDERS}</span>.
        </p>
      </section>

      {/* Legal & Policies */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h2 className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
          Campus Guidelines & Legal Terms
        </h2>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {LEGAL_DOCUMENTS.map((doc) => {
            const Icon = LEGAL_ICONS[doc.slug] || Info;
            return (
              <li key={doc.slug}>
                <a
                  href={`#/legal/${doc.slug}`}
                  className="group flex items-center gap-4 px-6 py-4 transition hover:bg-teal-50/60 dark:hover:bg-slate-800/60"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 transition group-hover:bg-teal-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">{doc.title}</span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{doc.description}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-teal-600" />
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
