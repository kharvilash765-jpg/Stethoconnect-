import { Home, Rss, User, Users, Sun, Moon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Route } from '@/hooks/useRoute';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/common/Avatar';
import { Logo } from '@/components/common/Logo';

const NAV_ITEMS = [
  { label: 'Feed', href: '#/', icon: Home, match: (r: Route) => r.name === 'home' || r.name === 'post' },
  { label: 'Following', href: '#/following', icon: Rss, match: (r: Route) => r.name === 'following' },
  { label: 'Campus Mates', href: '#/people', icon: Users, match: (r: Route) => r.name === 'people' },
] as const;

interface AppShellProps {
  route: Route;
  children: ReactNode;
}

export function AppShell({ route, children }: AppShellProps) {
  const { state, firebaseConnected, theme, toggleTheme } = useStore();
  const me = state.profiles.find((p) => p.id === state.currentUserId);
  const isOwnProfileRoute = route.name === 'profile' && route.userId === me?.id;
  const myProfileHref = me ? `#/profile/${me.id}` : '#/';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo with live Firebase connection indicator */}
          <div className="flex items-center gap-3">
            <a href="#/" className="flex items-center gap-2 group">
              <Logo size="md" />
            </a>

            <div className="hidden lg:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <span className={`h-2 w-2 rounded-full ${firebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span>{firebaseConnected ? 'Firebase Live' : 'Connecting...'}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main">
            {NAV_ITEMS.map((item) => {
              const active = item.match(route);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 ml-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Profile Avatar / Link */}
            {me && (
              <a
                href={myProfileHref}
                className={`ml-1 flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-bold transition ${
                  isOwnProfileRoute
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 ring-1 ring-teal-400/50'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Avatar name={me.name} seed={me.id} avatarUrl={me.avatar} size="sm" />
                <span className="max-w-[130px] truncate">{me.name}</span>
              </a>
            )}
          </nav>

          {/* Mobile Actions: Dark Mode Toggle + Profile Avatar */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {me && (
              <a href={myProfileHref} aria-label="My profile">
                <Avatar name={me.name} seed={me.id} avatarUrl={me.avatar} size="sm" />
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-28 pt-6 sm:px-6 md:pb-16">{children}</main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md md:hidden"
        aria-label="Main mobile"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
          {NAV_ITEMS.map((item) => {
            const active = item.match(route);
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-bold transition ${
                  active ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : ''}`} />
                {item.label}
              </a>
            );
          })}
          <a
            href={myProfileHref}
            className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-bold transition ${
              isOwnProfileRoute ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <User className={`h-5 w-5 ${isOwnProfileRoute ? 'stroke-[2.5]' : ''}`} />
            Profile
          </a>
        </div>
      </nav>
    </div>
  );
}
