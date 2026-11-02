import { useEffect, useMemo, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'following' }
  | { name: 'people' }
  | { name: 'profile'; userId: string }
  | { name: 'post'; postId: string }
  | { name: 'settings' }
  | { name: 'legal'; slug: string };

export function parseRoute(hash: string): Route {
  const parts = hash.replace(/^#/, '').split('/').filter(Boolean);
  if (parts[0] === 'following') return { name: 'following' };
  if (parts[0] === 'people') return { name: 'people' };
  if (parts[0] === 'profile' && parts[1]) return { name: 'profile', userId: decodeURIComponent(parts[1]) };
  if (parts[0] === 'post' && parts[1]) return { name: 'post', postId: decodeURIComponent(parts[1]) };
  if (parts[0] === 'settings') return { name: 'settings' };
  if (parts[0] === 'legal' && parts[1]) return { name: 'legal', slug: decodeURIComponent(parts[1]) };
  return { name: 'home' };
}

export function useRoute(): Route {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return useMemo(() => parseRoute(hash), [hash]);
}
