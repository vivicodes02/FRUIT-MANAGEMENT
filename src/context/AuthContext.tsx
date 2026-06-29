import { createContext, useContext, useState } from "react";
import { Navigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

/* ── Provider ─────────────────────────────────────── */
export function AuthProvider({ children }: { children: React.ReactNode }) {

  /* Initialise from localStorage so a page refresh keeps the session.
     Key "isLoggedIn" matches what Login.tsx writes:
       localStorage.setItem("isLoggedIn", "true")              */
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  /* login() is available if you want to call it from other components.
     Login.tsx sets localStorage directly, so this also stays in sync. */
  const login = (_email: string, _password: string) => {
    localStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
  };

  /* logout() clears the flag and collapses state — Sidebar calls this */
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ── Guard — wrap every protected <Route> in App.tsx ─ */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  /* <Navigate> is the correct declarative redirect — never call
     navigate() directly during render (causes React Router warning) */
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}