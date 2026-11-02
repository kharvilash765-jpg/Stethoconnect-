import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeSecurityShield } from './lib/securityShield';

// Initialize DevTools security & console sanitization
initializeSecurityShield();

createRoot(document.getElementById('root')!).render(<App />);
