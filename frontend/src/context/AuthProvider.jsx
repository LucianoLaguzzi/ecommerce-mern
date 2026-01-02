// src/context/AuthProvider.jsx
import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const STORAGE_KEY = "auth";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { _id, name, email, isAdmin }
  const [token, setToken] = useState(null); // string
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

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
    setSessionExpired(false); // clave para limpiar al cerrar la sesion
    localStorage.removeItem(STORAGE_KEY);
    delete axios.defaults.headers.common.Authorization;
  };

  // Interceptor global para capturar token vencido
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url;

        // Ignorar errores del login
        if (url?.includes("/login")) {
          return Promise.reject(error);
        }

        // Token vencido real
        if (status === 401 && token && !sessionExpired) {
          setSessionExpired(true);
        }

        return Promise.reject(error);
      }
    );

    // limpiar interceptor
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token, sessionExpired]);



  useEffect(() => {
    if (!sessionExpired) return;

    import("sweetalert2").then(({ default: Swal }) => {
      Swal.fire({
        icon: "warning",
        title: "Sesión expirada",
        text: "Tu sesión expiró. Por favor iniciá sesión nuevamente.",
        confirmButtonText: "Ir al login",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        logout();
        setSessionExpired(false);
        window.location.href = "/login";
      });
    });
  }, [sessionExpired]);


  const value = useMemo(
    () => ({ user, token, login, logout, setUser, loadingAuth }),
    [user, token, loadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

