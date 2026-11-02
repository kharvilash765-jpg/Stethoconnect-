import { useContext } from 'react';
import { StoreContext, type StoreContextValue } from '@/store/storeContext';

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}
