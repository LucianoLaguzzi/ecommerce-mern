// src/context/AuthProvider.jsx
import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const STORAGE_KEY = "auth";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { _id, name, email, isAdmin }
  const [token, setToken] = useState(null); // string
  const [loadingAuth, setLoadingAuth] = useState(true); // <- NUEVO

  // Hidratar desde localStorage al arrancar
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved?.token) {
        setUser(saved.user);
        setToken(saved.token);
        axios.defaults.headers.common.Authorization = `Bearer ${saved.token}`;
      }
    } catch {
      // ignorar errores de parseo
    }
    setLoadingAuth(false);
  }, []);

  // Login flexible
  const login = (...args) => {
    let u, t;

    if (args.length === 1 && args[0]) {
      const payload = args[0];
      if (payload.user && payload.token) {
        u = payload.user;
        t = payload.token;
      } else if (payload.token) {
        const { token: tok, ...rest } = payload;
        u = rest;
        t = tok;
      }
    } else if (args.length === 2) {
      u = args[0];
      t = args[1];
    }

    if (!t || !u) return;

    setUser(u);
    setToken(t);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, token: t }));
    axios.defaults.headers.common.Authorization = `Bearer ${t}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    delete axios.defaults.headers.common.Authorization;
  };

  const value = useMemo(
    () => ({ user, token, login, logout, loadingAuth }),
    [user, token, loadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
