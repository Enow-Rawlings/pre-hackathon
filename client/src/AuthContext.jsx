import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Restore the session on page refresh
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const save = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const login = async (email, password) =>
    save(await loginUser({ email, password }));

  const register = async (name, email, password) =>
    save(await registerUser({ name, email, password }));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);