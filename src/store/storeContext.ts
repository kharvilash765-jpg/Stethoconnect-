import { createContext } from 'react';
import type { User } from 'firebase/auth';
import type { Action } from '@/lib/appReducer';
import type { AppState } from '@/types';

export interface StoreContextValue {
  state: AppState;
  dispatch: (action: Action) => Promise<void> | void;
  storageError: boolean;
  firebaseConnected: boolean;
  authUser: User | null;
  authLoading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  signInWithGoogle?: () => Promise<void>;
  signOutUser?: () => Promise<void>;
}

export const StoreContext = createContext<StoreContextValue | null>(null);
