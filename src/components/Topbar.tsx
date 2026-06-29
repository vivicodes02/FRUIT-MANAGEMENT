/* ────────────────────────────────────────────────────
   Topbar.tsx
   Path: src/components/Topbar.tsx
──────────────────────────────────────────────────── */
import { useState, useRef, useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdNotifications, MdSunny, MdNightlight,
  MdPerson, MdSearch, MdClose, MdInventory2,
  MdTrendingUp, MdStorefront, MdAssessment,
  MdDashboard, MdEdit, MdLock, MdCheckCircle,
  MdWarning, MdInfo, MdArrowBack,
} from "react-icons/md";

/* ────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────── */
interface TopbarProps {
  darkMode: boolean;
  onToggleDark: () => void;
  pageTitle: string;
}

type NotifType = "warn" | "success" | "info";

interface Notification {
  id: number;
  text: string;
  detail: string;
  time: string;
  unread: boolean;
  type: NotifType;
}

/* ────────────────────────────────────────────────────
   SEARCH INDEX
──────────────────────────────────────────────────── */
const searchIndex = [
  { label: "Dashboard Overview",   path: "/dashboard", section: "Dashboard",  Icon: MdDashboard  },
  { label: "Revenue Summary",      path: "/dashboard", section: "Dashboard",  Icon: MdDashboard  },
  { label: "Low Stock Alerts",     path: "/dashboard", section: "Dashboard",  Icon: MdDashboard  },
  { label: "Recent Sales",         path: "/dashboard", section: "Dashboard",  Icon: MdDashboard  },
  { label: "Inventory List",       path: "/inventory", section: "Inventory",  Icon: MdInventory2 },
  { label: "Add Inventory Item",   path: "/inventory", section: "Inventory",  Icon: MdInventory2 },
  { label: "Stock Levels",         path: "/inventory", section: "Inventory",  Icon: MdInventory2 },
  { label: "Fruit Categories",     path: "/inventory", section: "Inventory",  Icon: MdInventory2 },
  { label: "Expiry Tracking",      path: "/inventory", section: "Inventory",  Icon: MdInventory2 },
  { label: "Sales Overview",       path: "/sales",     section: "Sales",      Icon: MdTrendingUp },
  { label: "New Sale Order",       path: "/sales",     section: "Sales",      Icon: MdTrendingUp },
  { label: "Sales History",        path: "/sales",     section: "Sales",      Icon: MdTrendingUp },
  { label: "Top Selling Products", path: "/sales",     section: "Sales",      Icon: MdTrendingUp },
  { label: "Market Listings",      path: "/market",    section: "Market",     Icon: MdStorefront },
  { label: "Add Market Listing",   path: "/market",    section: "Market",     Icon: MdStorefront },
  { label: "Price Management",     path: "/market",    section: "Market",     Icon: MdStorefront },
  { label: "Sales Report",         path: "/reports",   section: "Reports",    Icon: MdAssessment },
  { label: "Inventory Report",     path: "/reports",   section: "Reports",    Icon: MdAssessment },
  { label: "Revenue Report",       path: "/reports",   section: "Reports",    Icon: MdAssessment },
  { label: "Export Reports",       path: "/reports",   section: "Reports",    Icon: MdAssessment },
];

/* ────────────────────────────────────────────────────
   NOTIFICATIONS DATA
──────────────────────────────────────────────────── */
const initialNotifications: Notification[] = [
  { id: 1, text: "Low stock: Mangoes",       detail: "Only 3 units of Mangoes remain in the warehouse. Reorder soon to avoid stockouts and losing sales.",  time: "2m ago",  unread: true,  type: "warn"    },
  { id: 2, text: "New sale — TSH 420,000",   detail: "Order ORD-006 has been recorded successfully for TSH 420,000. Customer payment is confirmed.",         time: "18m ago", unread: true,  type: "success" },
  { id: 3, text: "Inventory sync completed", detail: "All inventory records have been synced successfully. Everything is up to date as of this moment.",      time: "1h ago",  unread: false, type: "info"    },
  { id: 4, text: "Low stock: Blueberries",   detail: "Only 11 units of Blueberries remain in the warehouse. Consider placing a new order with the supplier.", time: "3h ago",  unread: false, type: "warn"    },
  { id: 5, text: "Report generated",         detail: "Monthly revenue report for June 2025 is ready. You can download it from the Reports section.",         time: "5h ago",  unread: false, type: "success" },
];

const notifMeta: Record<NotifType, { icon: JSX.Element; badge: string; headerBg: string; headerIcon: JSX.Element }> = {
  warn: {
    icon:       <MdWarning     className="text-amber-500 text-lg" />,
    badge:      "bg-amber-100 text-amber-700",
    headerBg:   "bg-gradient-to-br from-amber-50 to-orange-50",
    headerIcon: <MdWarning     className="text-amber-500 text-4xl" />,
  },
  success: {
    icon:       <MdCheckCircle className="text-green-500 text-lg" />,
    badge:      "bg-green-100 text-green-700",
    headerBg:   "bg-gradient-to-br from-green-50 to-emerald-50",
    headerIcon: <MdCheckCircle className="text-green-500 text-4xl" />,
  },
  info: {
    icon:       <MdInfo        className="text-blue-400  text-lg" />,
    badge:      "bg-blue-100 text-blue-700",
    headerBg:   "bg-gradient-to-br from-blue-50 to-sky-50",
    headerIcon: <MdInfo        className="text-blue-400  text-4xl" />,
  },
};

const typeLabel: Record<NotifType, string> = {
  warn: "Warning", success: "Success", info: "Info",
};

/* ────────────────────────────────────────────────────
   NOTIFICATIONS MODAL
   Opens directly when the bell icon is clicked.
   Shows the list — click any row to read the full message.
──────────────────────────────────────────────────── */
interface NotifModalProps {
  notifications: Notification[];
  darkMode: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkRead: (id: number) => void;
}

function NotifModal({ notifications, darkMode, onClose, onMarkAllRead, onMarkRead }: NotifModalProps) {
  /* null = list view, Notification = detail view */
  const [detail, setDetail] = useState<Notification | null>(null);

  const card    = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-100";
  const text    = darkMode ? "text-white"    : "text-gray-800";
  const subText = darkMode ? "text-gray-400" : "text-gray-500";
  const rowHov  = darkMode ? "hover:bg-gray-700" : "hover:bg-orange-50";
  const divider = darkMode ? "border-gray-700" : "border-orange-100";
  const unread  = notifications.filter((n) => n.unread).length;

  const openDetail = (n: Notification) => {
    onMarkRead(n.id);
    setDetail(n);
  };

  return (
    /* ── OVERLAY ──────────────────────────────────── */
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* ── MODAL ─────────────────────────────────── */}
      <div className={`relative z-10 w-full max-w-sm mx-4 rounded-2xl border shadow-2xl overflow-hidden ${card}`}>

        {/* ── HEADER ────────────────────────────────── */}
        <div className={`px-5 py-4 border-b ${divider} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {detail && (
              <button
                onClick={() => setDetail(null)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center mr-1 transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-orange-50 text-gray-400"}`}
              >
                <MdArrowBack className="text-base" />
              </button>
            )}
            <MdNotifications className="text-orange-500 text-xl" />
            <span className={`text-sm font-bold ${text}`}>
              {detail ? detail.text : "Notifications"}
            </span>
            {!detail && unread > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                {unread} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mark all read — only on list view */}
            {!detail && unread > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] text-orange-500 hover:underline font-medium"
              >
                Mark all read
              </button>
            )}
            {/* ✕ always visible */}
            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400 hover:text-white" : "hover:bg-orange-50 text-gray-400 hover:text-gray-700"}`}
            >
              <MdClose className="text-base" />
            </button>
          </div>
        </div>
        {/* ── END HEADER ────────────────────────────── */}


        {/* ── LIST VIEW ─────────────────────────────── */}
        {!detail && (
          <ul className="max-h-[360px] overflow-y-auto divide-y divide-orange-50">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => openDetail(n)}
                  className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors ${rowHov} ${
                    n.unread ? (darkMode ? "bg-gray-700/40" : "bg-orange-50/70") : ""
                  }`}
                >
                  <span className="mt-0.5 flex-shrink-0">{notifMeta[n.type].icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold truncate ${text}`}>{n.text}</p>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />}
                    </div>
                    <p className={`text-[10px] mt-0.5 ${subText}`}>{n.time} · click to read</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
        {/* ── END LIST VIEW ─────────────────────────── */}


        {/* ── DETAIL VIEW ───────────────────────────── */}
        {detail && (
          <>
            {/* Coloured band */}
            <div className={`${notifMeta[detail.type].headerBg} px-5 py-5 flex items-center gap-4`}>
              <div className="w-14 h-14 rounded-2xl bg-white/80 shadow flex items-center justify-center flex-shrink-0">
                {notifMeta[detail.type].headerIcon}
              </div>
              <div>
                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${notifMeta[detail.type].badge}`}>
                  {typeLabel[detail.type]}
                </span>
                <p className="text-gray-500 text-[11px] mt-1">{detail.time}</p>
              </div>
            </div>

            {/* Message */}
            <div className="px-5 py-5">
              <p className={`text-sm leading-relaxed ${text}`}>{detail.detail}</p>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => setDetail(null)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-orange-200 text-gray-600 hover:bg-orange-50"}`}
              >
                ← Back
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow"
              >
                Dismiss
              </button>
            </div>
          </>
        )}
        {/* ── END DETAIL VIEW ───────────────────────── */}

      </div>
      {/* ── END MODAL ─────────────────────────────── */}
    </div>
  );
}

/* ────────────────────────────────────────────────────
   PROFILE MODAL
──────────────────────────────────────────────────── */
interface ProfileModalProps {
  darkMode: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function ProfileModal({ darkMode, onClose, onLogout }: ProfileModalProps) {
  const [tab,     setTab]     = useState<"profile" | "password">("profile");
  const [name,    setName]    = useState("Admin User");
  const [email,   setEmail]   = useState("admin@fruit.com");
  const [saved,   setSaved]   = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passMsg, setPassMsg] = useState("");

  const card    = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-100";
  const text    = darkMode ? "text-white"    : "text-gray-800";
  const subText = darkMode ? "text-gray-400" : "text-gray-500";
  const divider = darkMode ? "border-gray-700" : "border-orange-100";
  const inputCl = `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
      : "bg-orange-50 border-orange-200 text-gray-700 placeholder-gray-400"
  }`;
  const tabActive   = "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow";
  const tabInactive = darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-orange-50";

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleChangePassword = () => {
    if (!oldPass || !newPass || !confirm) { setPassMsg("Please fill all fields."); return; }
    if (newPass !== confirm)              { setPassMsg("New passwords do not match."); return; }
    if (newPass.length < 6)              { setPassMsg("Password must be at least 6 characters."); return; }
    setPassMsg("✓ Password updated successfully.");
    setOldPass(""); setNewPass(""); setConfirm("");
    setTimeout(() => setPassMsg(""), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative z-10 w-full max-w-md mx-4 rounded-2xl border shadow-2xl overflow-hidden ${card}`}>

        {/* ── HEADER ──────────────────────────────── */}
        <div className={`px-6 py-4 border-b ${divider} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow">
              <MdPerson className="text-white text-lg" />
            </div>
            <div>
              <p className={`text-sm font-bold leading-tight ${text}`}>{name}</p>
              <p className={`text-[11px] ${subText}`}>{email}</p>
            </div>
          </div>
          {/* ✕ Exit button */}
          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400 hover:text-white" : "hover:bg-orange-50 text-gray-400 hover:text-gray-700"}`}
            aria-label="Close profile"
          >
            <MdClose className="text-lg" />
          </button>
        </div>
        {/* ── END HEADER ────────────────────────── */}

        {/* Tabs */}
        <div className={`flex gap-1 p-3 border-b ${divider}`}>
          {(["profile", "password"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${tab === t ? tabActive : tabInactive}`}
            >
              {t === "profile" ? <MdEdit className="text-sm" /> : <MdLock className="text-sm" />}
              {t === "profile" ? "My Profile" : "Change Password"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {tab === "profile" && (
            <>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputCl} placeholder="Your name" />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Email Address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCl} type="email" placeholder="your@email.com" />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Role</label>
                <input value="Administrator" readOnly className={`${inputCl} opacity-60 cursor-not-allowed`} />
              </div>
              <button onClick={handleSave}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow"
              >
                {saved ? "✓ Saved!" : "Save Changes"}
              </button>
            </>
          )}
          {tab === "password" && (
            <>
              {(["Current Password", "New Password", "Confirm New Password"] as const).map((lbl, i) => {
                const vals    = [oldPass,    newPass,    confirm   ];
                const setters = [setOldPass, setNewPass, setConfirm];
                return (
                  <div key={lbl}>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>{lbl}</label>
                    <input type="password" value={vals[i]} onChange={(e) => setters[i](e.target.value)} placeholder="••••••••" className={inputCl} />
                  </div>
                );
              })}
              {passMsg && <p className={`text-xs font-medium ${passMsg.startsWith("✓") ? "text-green-500" : "text-red-500"}`}>{passMsg}</p>}
              <button onClick={handleChangePassword}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow"
              >
                Update Password
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          {/* Explicit Close button in footer */}
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-orange-200 text-gray-600 hover:bg-orange-50"}`}
          >
            Close
          </button>
          <button onClick={onLogout}
            className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-all"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   TOPBAR COMPONENT
──────────────────────────────────────────────────── */
export default function Topbar({ darkMode, onToggleDark, pageTitle }: TopbarProps) {
  const [query,         setQuery]         = useState("");
  const [showResults,   setShowResults]   = useState(false);
  const [showNotif,     setShowNotif]     = useState(false);  // ← now opens modal directly
  const [showProfile,   setShowProfile]   = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const navigate  = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  /* Close search on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = query.trim().length > 0
    ? searchIndex.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.section.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const markOneRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, unread: false } : n)
    );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/", { replace: true });
  };

  /* Theme tokens */
  const bg      = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-orange-100";
  const text    = darkMode ? "text-white"                  : "text-gray-800";
  const subText = darkMode ? "text-gray-400"               : "text-gray-500";
  const inputBg = darkMode ? "bg-gray-800 text-gray-300"   : "bg-orange-50 text-gray-600";
  const dropBg  = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-100";
  const dropHov = darkMode ? "hover:bg-gray-700"           : "hover:bg-orange-50";
  const iconBtn = darkMode
    ? "text-gray-400 hover:text-white hover:bg-gray-800"
    : "text-gray-500 hover:text-orange-500 hover:bg-orange-50";

  return (
    <>
      {/* ── NOTIFICATIONS MODAL (opens directly on bell click) ── */}
      {showNotif && (
        <NotifModal
          notifications={notifications}
          darkMode={darkMode}
          onClose={() => setShowNotif(false)}
          onMarkAllRead={markAllRead}
          onMarkRead={markOneRead}
        />
      )}

      {/* ── PROFILE MODAL ─────────────────────────── */}
      {showProfile && (
        <ProfileModal
          darkMode={darkMode}
          onClose={() => setShowProfile(false)}
          onLogout={handleLogout}
        />
      )}

      {/* ── TOPBAR ────────────────────────────────── */}
      <header className={`${bg} border-b px-5 sm:px-7 py-3 flex items-center justify-between gap-4 sticky top-0 z-30`}>

        {/* LEFT */}
        <div>
          <h1 className={`text-lg sm:text-xl font-bold ${text}`}>{pageTitle}</h1>
          <p className={`text-xs hidden sm:block ${subText}`}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* ── SEARCH ────────────────────────────── */}
          <div ref={searchRef} className="relative hidden md:block">
            <div className={`flex items-center gap-2 ${inputBg} rounded-xl px-3 py-2 text-sm`}>
              <MdSearch className="text-orange-400 text-base flex-shrink-0" />
              <input
                type="text"
                value={query}
                placeholder="Search pages..."
                onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                className="bg-transparent outline-none w-36 lg:w-48 placeholder-gray-400 text-sm"
              />
              {query && (
                <button onClick={() => { setQuery(""); setShowResults(false); }}>
                  <MdClose className="text-gray-400 hover:text-orange-500 text-sm" />
                </button>
              )}
            </div>

            {showResults && results.length > 0 && (
              <div className={`absolute left-0 top-12 w-72 rounded-2xl border shadow-xl ${dropBg} overflow-hidden z-50`}>
                <p className={`px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest font-semibold ${subText}`}>
                  Results for "{query}"
                </p>
                <ul className="pb-2">
                  {results.map((item, i) => (
                    <li key={i}>
                      <button
                        onClick={() => { navigate(item.path); setQuery(""); setShowResults(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${dropHov}`}
                      >
                        <item.Icon className="text-orange-400 text-base flex-shrink-0" />
                        <div>
                          <p className={`text-sm font-medium ${text}`}>{item.label}</p>
                          <p className={`text-[10px] ${subText}`}>{item.section}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showResults && query.trim().length > 0 && results.length === 0 && (
              <div className={`absolute left-0 top-12 w-72 rounded-2xl border shadow-xl ${dropBg} px-4 py-5 text-center z-50`}>
                <p className={`text-sm ${subText}`}>No results for "<span className="font-medium">{query}</span>"</p>
              </div>
            )}
          </div>
          {/* ── END SEARCH ────────────────────────── */}

          {/* Dark / Light toggle */}
          <button onClick={onToggleDark} title={darkMode ? "Light mode" : "Dark mode"}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${iconBtn}`}
          >
            {darkMode ? <MdSunny className="text-lg" /> : <MdNightlight className="text-lg" />}
          </button>

          {/* ── BELL ICON — opens modal directly ────── */}
          <button
            onClick={() => { setShowNotif(true); setShowProfile(false); }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors relative ${iconBtn}`}
            aria-label="Notifications"
          >
            <MdNotifications className="text-lg" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {/* ── END BELL ──────────────────────────── */}

          {/* ── PROFILE BUTTON ────────────────────── */}
          <button
            onClick={() => { setShowProfile(true); setShowNotif(false); }}
            className="w-9 h-9 rounded-xl overflow-hidden border-2 border-orange-300 hover:border-orange-500 transition-colors flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-orange-400 to-amber-500"
            aria-label="Profile"
          >
            <MdPerson className="text-white text-lg" />
          </button>

        </div>

      </header>
    </>
  );
}