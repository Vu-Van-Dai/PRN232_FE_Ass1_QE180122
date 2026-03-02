import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "@/auth/AuthContext";
import type { AuthUser } from "@/types/auth";
import { getMe, login as apiLogin, logout as apiLogout, register as apiRegister } from "@/api/auth";
import { ApiError, getStoredAccessToken, setStoredAccessToken } from "@/api/http";
import { emitAuthLogoutEvent } from "@/auth/authEvents";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredAccessToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const me = await getMe();
      setUser(me);
    } catch (err) {
      // Token invalid/expired -> clear
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        setStoredAccessToken(null);
        setToken(null);
        setUser(null);
        emitAuthLogoutEvent();
      }
    }
  }, [token]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setIsLoading(true);
      await refreshMe();
      if (alive) setIsLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [refreshMe]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setStoredAccessToken(res.accessToken);
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const res = await apiRegister(email, password);
    setStoredAccessToken(res.accessToken);
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    }
    setStoredAccessToken(null);
    setToken(null);
    setUser(null);
    emitAuthLogoutEvent();
  }, []);

  const value = useMemo(
    () => ({ token, user, isLoading, login, register, logout }),
    [token, user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
