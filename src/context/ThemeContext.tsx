
import { createContext, useContext, useState } from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDark: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/* ── Wrap <Router> with this in main.tsx ─────────── */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark: () => setDarkMode((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}