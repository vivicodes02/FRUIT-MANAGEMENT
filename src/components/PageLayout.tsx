import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Sidebar, { type ActivePage } from "./Sidebar";
import Topbar from "./Topbar";

interface PageLayoutProps {
  pageTitle: string;
  activePage: ActivePage | "settings";
  children: React.ReactNode;
}

export default function PageLayout({ pageTitle, activePage, children }: PageLayoutProps) {
  const { darkMode, toggleDark } = useTheme();
  const navigate = useNavigate();
  const bg = darkMode ? "bg-gray-950" : "bg-orange-50/40";

  const handleNavigate = (page: ActivePage) => {
    navigate(page === "dashboard" ? "/dashboard" : `/${page}`);
  };

  return (
    /* ── APP SHELL ──────────────────────────────────
       h-screen + overflow-hidden locks the viewport.
       Sidebar and Topbar never scroll.
    ─────────────────────────────────────────────── */
    <div className={`flex h-screen overflow-hidden ${bg}`}>

      {/* ── SIDEBAR — static, full height ─────────── */}
      <Sidebar
        activePage={activePage as ActivePage}
        darkMode={darkMode}
        onNavigate={handleNavigate}
      />

      {/* ── MAIN COLUMN ───────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Topbar — static, never scrolls */}
        <Topbar
          darkMode={darkMode}
          onToggleDark={toggleDark}
          pageTitle={pageTitle}
        />

        {/* ── SCROLLABLE CONTENT — only this scrolls ── */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        {/* ── END SCROLLABLE CONTENT ────────────────── */}

      </div>
      {/* ── END MAIN COLUMN ───────────────────────── */}

    </div>
  );
}