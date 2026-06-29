import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* Context providers */
import { AuthProvider, RequireAuth } from "./context/AuthContext";
import { ThemeProvider }             from "./context/ThemeContext";

/* Pages */
import Login        from "./auth/Login";
import Dashboard    from "./components/Dashboard";
import InventoryPage from "./Pages/InventoryPage";
import SalesPage     from "./Pages/SalesPage";
import SettingsPage  from "./Pages/Settings";
import MarketPage    from "./Pages/MarketPage";
import ReportsPage   from "./Pages/ReportsPage";

import "./index.css";

function App() {
  return (
    /* ThemeProvider wraps everything so darkMode persists across routes */
    <ThemeProvider>
      <Router>
        {/* AuthProvider is inside Router so RequireAuth can use useNavigate */}
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

            <Route path="/inventory" element={<RequireAuth><InventoryPage /></RequireAuth>} />

            <Route path="/sales" element={<RequireAuth><SalesPage /></RequireAuth>} />

            <Route path="/market" element={<RequireAuth><MarketPage /></RequireAuth>} />

            <Route path="/reports" element={<RequireAuth><ReportsPage /></RequireAuth>} />

            <Route path="/settings" element={ <RequireAuth><SettingsPage /></RequireAuth> } />

            {/* ── FALLBACK — unknown paths go to login ── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;