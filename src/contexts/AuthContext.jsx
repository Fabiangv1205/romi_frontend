import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, tokenStore } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    tokenStore.access = data.accessToken;
    tokenStore.refresh = data.refreshToken;
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    console.log(data)
    tokenStore.access = data.accessToken;
    tokenStore.refresh = data.refreshToken;
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    tokenStore.access = null;
    tokenStore.refresh = null;
    setUser(null);
  };

  const fetchMe = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.user);
    return data.user;
  };

  // Al cargar, si hay tokens intenta recuperar /me
  useEffect(() => {
    (async () => {
      try {
        if (tokenStore.access && tokenStore.refresh) {
          await fetchMe();
        }
      } catch {
        tokenStore.access = null;
        tokenStore.refresh = null;
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  const value = useMemo(() => ({
    user, isAuth: !!user, isAdmin: user?.role === "admin",
    login, register, logout, fetchMe
  }), [user]);

  if (!bootstrapped) return null; 

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
