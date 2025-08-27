// src/context/AuthContext.js
import { createContext, useContext } from "react";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext); //Es como un hook para usar useAuth en vez de useContext(AuthContext) en el navBar;