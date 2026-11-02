import { useStore } from '@/store/useStore';
import { LoginView } from '@/components/auth/LoginView';
import { CreateProfileView } from '@/components/auth/CreateProfileView';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export function Onboarding() {
  const { authUser, authLoading, state } = useStore();

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Logo size="lg" className="mb-4" />
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-teal-600 dark:text-teal-400" />
          <span>Connecting to Firebase...</span>
        </div>
      </div>
    );
  }

  // 1. If user is not yet logged in with Google, show clean Login screen with Google Auth
  if (!authUser) {
    return <LoginView />;
  }

  // 2. Once logged in with Google, if profile not completed in Firestore yet, show Create Profile view
  const profile = state.profiles.find((p) => p.id === authUser.uid);
  if (!profile) {
    return <CreateProfileView />;
  }

  // Profile exists; will enter AppShell
  return null;
}
