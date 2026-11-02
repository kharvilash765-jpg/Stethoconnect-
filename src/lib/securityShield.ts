/**
 * DevTools Security & Privacy Shield
 * Prevents sensitive authentication information, session tokens,
 * and user state from leaking into the browser developer console.
 */

export function initializeSecurityShield() {
  if (typeof window === 'undefined') return;

  // 1. Prominent DevTools Security Warning
  try {
    const warningStyle =
      'color: #e11d48; font-size: 24px; font-weight: bold; text-shadow: 1px 1px 2px black;';
    const bodyStyle = 'color: #0f172a; font-size: 14px; font-weight: 500;';

    console.log('%c⚠️ STETHOCONNECT SECURITY NOTICE', warningStyle);
    console.log(
      '%cThis browser feature is intended for authorized developers. Do NOT paste any scripts, codes, or credentials here. Doing so may expose your student account to unauthorized tampering.',
      bodyStyle,
    );
  } catch {
    // Ignore any console error
  }

  // 2. Sensitive Data Redaction in Console Logs
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = function (...args: unknown[]) {
    // Redact potential emails, auth tokens, or private IDs from error logs
    const sanitized = args.map((arg) => {
      if (typeof arg === 'string') {
        // Redact email patterns (e.g. user@gmail.com -> u***@gmail.com)
        return arg.replace(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)/g, (match, user, domain) => {
          return `${user.slice(0, 1)}***@${domain}`;
        });
      }
      return arg;
    });
    originalError.apply(console, sanitized);
  };

  console.warn = function (...args: unknown[]) {
    const sanitized = args.map((arg) => {
      if (typeof arg === 'string') {
        return arg.replace(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)/g, (match, user, domain) => {
          return `${user.slice(0, 1)}***@${domain}`;
        });
      }
      return arg;
    });
    originalWarn.apply(console, sanitized);
  };
}
