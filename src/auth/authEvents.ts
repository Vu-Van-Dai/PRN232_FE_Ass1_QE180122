export const AUTH_LOGOUT_EVENT = "auth:logout" as const;

export function emitAuthLogoutEvent() {
  try {
    window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
  } catch {
    // ignore (SSR / older browsers)
  }
}
