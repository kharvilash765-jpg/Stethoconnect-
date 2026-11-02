import { Onboarding } from '@/components/auth/Onboarding';
import { AppShell } from '@/components/layout/AppShell';
import { useRoute, type Route } from '@/hooks/useRoute';
import { FollowingPage } from '@/pages/FollowingPage';
import { HomePage } from '@/pages/HomePage';
import { PeoplePage } from '@/pages/PeoplePage';
import { PostPage } from '@/pages/PostPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LegalDocumentPage } from '@/pages/LegalDocumentPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { StoreProvider } from '@/store/StoreProvider';
import { useStore } from '@/store/useStore';

function CurrentPage({ route }: { route: Route }) {
  switch (route.name) {
    case 'following':
      return <FollowingPage />;
    case 'people':
      return <PeoplePage />;
    case 'profile':
      return <ProfilePage userId={route.userId} />;
    case 'post':
      return <PostPage postId={route.postId} />;
    case 'settings':
      return <SettingsPage />;
    case 'legal':
      return <LegalDocumentPage slug={route.slug} />;
    default:
      return <HomePage />;
  }
}

function StethoConnect() {
  const { state, authUser } = useStore();
  const route = useRoute();

  // User enters app ONLY after Google login AND profile creation
  const hasProfile = Boolean(authUser && state.profiles.some((p) => p.id === authUser.uid));

  if (!hasProfile) {
    return <Onboarding />;
  }

  return (
    <AppShell route={route}>
      <CurrentPage route={route} />
    </AppShell>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StethoConnect />
    </StoreProvider>
  );
}
