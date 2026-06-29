/* ────────────────────────────────────────────────────
   Sidebar.tsx
   Path: src/components/Sidebar.tsx
──────────────────────────────────────────────────── */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdInventory2,
  MdBarChart,
  MdStorefront,
  MdAssessment,
  MdSettings,
  MdLogout,
  MdChevronLeft,
  MdChevronRight,
  MdWarning,
} from "react-icons/md";
import { FaAppleAlt } from "react-icons/fa";

/* ── TYPE ─────────────────────────────────────────── */
export type ActivePage =
  | "dashboard"
  | "inventory"
  | "sales"
  | "market"
  | "reports";

interface SidebarProps {
  darkMode: boolean;
  /* kept for backwards compat */
  activePage?: ActivePage;
  onNavigate?: (page: ActivePage) => void;
}

/* ── NAV ITEMS with paths ─────────────────────────── */
const mainNav = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard", Icon: MdDashboard  },
  { id: "inventory", label: "Inventory", path: "/inventory", Icon: MdInventory2 },
  { id: "sales",     label: "Sales",     path: "/sales",     Icon: MdBarChart   },
  { id: "market",    label: "Market",    path: "/market",    Icon: MdStorefront },
  { id: "reports",   label: "Reports",   path: "/reports",   Icon: MdAssessment },
] as const;

/* ── LOGOUT CONFIRM MODAL ─────────────────────────── */
interface LogoutModalProps {
  darkMode: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function LogoutModal({ darkMode, onConfirm, onCancel }: LogoutModalProps) {
  const overlay = "fixed inset-0 z-50 flex items-center justify-center";
  const bg      = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-100";
  const text    = darkMode ? "text-white"   : "text-gray-800";
  const subText = darkMode ? "text-gray-400": "text-gray-500";

  return (
    /* ── MODAL OVERLAY ────────────────────────────── */
    <div className={overlay}>

      {/* Dim backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal box */}
      <div className={`relative z-10 w-full max-w-sm mx-4 rounded-2xl border shadow-2xl p-6 ${bg}`}>

        {/* Warning icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <MdWarning className="text-red-500 text-3xl" />
          </div>
        </div>

        {/* Message */}
        <h3 className={`text-lg font-bold text-center mb-1 ${text}`}>
          Log Out
        </h3>
        <p className={`text-sm text-center mb-6 ${subText}`}>
          Are you sure you want to log out of FruitIMS?<br />
          Your session will end.
        </p>

        {/* Actions */}
        <div className="flex gap-3">

          {/* Cancel */}
          <button
            onClick={onCancel}
            className={`
              flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all
              ${darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-orange-200 text-gray-600 hover:bg-orange-50"}
            `}
          >
            Cancel
          </button>

          {/* Confirm logout */}
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-400 text-white text-sm font-semibold hover:from-red-600 hover:to-red-500 transition-all shadow-sm"
          >
            Yes, Log Out
          </button>

        </div>
      </div>
      {/* ── END MODAL BOX ─────────────────────────── */}

    </div>
    /* ── END MODAL OVERLAY ────────────────────────── */
  );
}

/* ── SIDEBAR COMPONENT ────────────────────────────── */
export default function Sidebar({ darkMode }: SidebarProps) {
  const [collapsed,     setCollapsed]     = useState(false);
  const [showLogoutBox, setShowLogoutBox] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* Theme tokens */
  const bg      = darkMode ? "bg-gray-900"       : "bg-white";
  const border  = darkMode ? "border-gray-800"   : "border-orange-100";
  const text    = darkMode ? "text-gray-300"     : "text-gray-600";
  const subText = darkMode ? "text-gray-500"     : "text-gray-400";
  const hover   = darkMode ? "hover:bg-gray-800" : "hover:bg-orange-50";
  const active  = "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200";

  /* ── Logout confirmed ───────────────────────────── */
  const handleLogoutConfirm = () => {
    localStorage.removeItem("isLoggedIn");
    setShowLogoutBox(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* ── LOGOUT CONFIRM MODAL (portal-style) ─────── */}
      {showLogoutBox && (
        <LogoutModal
          darkMode={darkMode}
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutBox(false)}
        />
      )}

      {/* ── SIDEBAR WRAPPER ───────────────────────── */}
      <aside
        className={`
          ${bg} ${border} border-r flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-[220px]"}
          h-screen flex-shrink-0 relative
        `}
      >

        {/* ── BRAND ─────────────────────────────────── */}
        <div className={`flex items-center gap-3 px-4 py-5 ${border} border-b flex-shrink-0`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0 shadow">
            <FaAppleAlt className="text-white text-base" />
          </div>
          {!collapsed && (
            <span className={`font-bold text-base tracking-tight ${darkMode ? "text-white" : "text-gray-800"}`}>
              FruitIMS
            </span>
          )}
        </div>
        {/* ── END BRAND ───────────────────────────── */}


        {/* ── MAIN NAVIGATION ───────────────────────── */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">

          {!collapsed && (
            <p className={`text-[10px] uppercase tracking-widest font-semibold px-3 mb-2 ${subText}`}>
              Main Menu
            </p>
          )}

          {mainNav.map(({ id, label, path, Icon }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                title={collapsed ? label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-150
                  ${isActive ? active : `${text} ${hover}`}
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon className={`text-xl flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                {!collapsed && <span>{label}</span>}
              </button>
            );
          })}

        </nav>
        {/* ── END MAIN NAVIGATION ─────────────────── */}


        {/* ── BOTTOM — settings + logout ──────────── */}
        <div className={`px-2 py-4 border-t ${border} space-y-1 flex-shrink-0`}>

          {/* Settings — navigates to /settings */}
          <button
            onClick={() => navigate("/settings")}
            title={collapsed ? "Settings" : undefined}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-150
              ${location.pathname === "/settings" ? active : `${text} ${hover}`}
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <MdSettings className={`text-xl flex-shrink-0 ${location.pathname === "/settings" ? "text-white" : ""}`} />
            {!collapsed && <span>Settings</span>}
          </button>

          {/* Logout — opens confirm modal */}
          <button
            onClick={() => setShowLogoutBox(true)}
            title={collapsed ? "Log Out" : undefined}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-150
              text-red-400 hover:bg-red-50 hover:text-red-600
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <MdLogout className="text-xl flex-shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>

        </div>
        {/* ── END BOTTOM ──────────────────────────── */}


        {/* ── COLLAPSE TOGGLE ─────────────────────── */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            absolute -right-3 top-[72px]
            w-6 h-6 rounded-full border
            flex items-center justify-center
            text-xs shadow-sm transition-colors z-10
            ${darkMode
              ? "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
              : "bg-white border-orange-200 text-orange-500 hover:bg-orange-50"}
          `}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
        </button>
        {/* ── END COLLAPSE TOGGLE ─────────────────── */}

      </aside>
      {/* ── END SIDEBAR ─────────────────────────────── */}
    </>
  );
}