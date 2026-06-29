
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import PageLayout from "../components/PageLayout";
import {
  MdPerson, MdLock, MdNotifications, MdStorefront,
  MdPeople, MdSecurity, MdBackup, MdClose,
  MdEdit, MdDelete, MdAdd, MdWarning, MdCheck,
  MdVisibility, MdVisibilityOff, MdSave,
} from "react-icons/md";
import { FaAppleAlt } from "react-icons/fa";

/* ────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────── */
type UserRole   = "Admin" | "Manager" | "Sales Staff" | "Warehouse";
type UserStatus = "Active" | "Inactive";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  phone: string;
}

/* ────────────────────────────────────────────────────
   MOCK DATA
──────────────────────────────────────────────────── */
const initialUsers: SystemUser[] = [
  { id: "USR-001", name: "Admin User",     email: "admin@fruit.com",    role: "Admin",         status: "Active",   lastLogin: "2025-07-05", phone: "0712 345 678" },
  { id: "USR-002", name: "Jane Mwangi",    email: "jane@fruit.com",     role: "Manager",       status: "Active",   lastLogin: "2025-07-04", phone: "0756 789 012" },
  { id: "USR-003", name: "Ali Hassan",     email: "ali@fruit.com",      role: "Sales Staff",   status: "Active",   lastLogin: "2025-07-05", phone: "0789 234 567" },
  { id: "USR-004", name: "Grace Njeri",    email: "grace@fruit.com",    role: "Warehouse",     status: "Active",   lastLogin: "2025-07-03", phone: "0744 456 789" },
  { id: "USR-005", name: "David Ochieng",  email: "david@fruit.com",    role: "Sales Staff",   status: "Inactive", lastLogin: "2025-06-20", phone: "0733 555 888" },
];

const roleBadge: Record<UserRole, string> = {
  Admin:         "bg-purple-100 text-purple-700",
  Manager:       "bg-blue-100 text-blue-700",
  "Sales Staff": "bg-orange-100 text-orange-700",
  Warehouse:     "bg-green-100 text-green-700",
};

const EMPTY_USER: Omit<SystemUser, "id"> = {
  name: "", email: "", role: "Sales Staff",
  status: "Active", lastLogin: "—", phone: "",
};

type SettingsTab =
  | "general"
  | "users"
  | "notifications"
  | "security"
  | "business"
  | "backup";

const tabs: { id: SettingsTab; label: string; Icon: React.ElementType }[] = [
  { id: "general",       label: "General",        Icon: MdStorefront    },
  { id: "users",         label: "Users",           Icon: MdPeople        },
  { id: "notifications", label: "Notifications",   Icon: MdNotifications },
  { id: "security",      label: "Security",        Icon: MdSecurity      },
  { id: "business",      label: "Business Info",   Icon: FaAppleAlt      },
  { id: "backup",        label: "Backup & Data",   Icon: MdBackup        },
];

/* ────────────────────────────────────────────────────
   USER MODAL
──────────────────────────────────────────────────── */
interface UserModalProps {
  initial: Partial<SystemUser> & Omit<SystemUser, "id">;
  mode: "add" | "edit";
  darkMode: boolean;
  onSave: (user: SystemUser) => void;
  onClose: () => void;
}

function UserModal({ initial, mode, darkMode, onSave, onClose }: UserModalProps) {
  const [form, setForm] = useState({ ...initial });
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");

  const card    = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-100";
  const text    = darkMode ? "text-white" : "text-gray-800";
  const sub     = darkMode ? "text-gray-400" : "text-gray-500";
  const divider = darkMode ? "border-gray-700" : "border-orange-100";
  const inputCl = `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${
    darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
             : "bg-orange-50 border-orange-200 text-gray-700 placeholder-gray-400"
  }`;

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.email) return;
    const id = (initial as SystemUser).id ?? "USR-" + String(Date.now()).slice(-4);
    onSave({ ...form, id } as SystemUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full max-w-md mx-4 rounded-2xl border shadow-2xl overflow-hidden ${card}`}>

        {/* Header */}
        <div className={`px-6 py-4 border-b ${divider} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <MdPerson className="text-orange-500 text-xl" />
            <span className={`text-sm font-bold ${text}`}>
              {mode === "add" ? "Add New User" : "Edit User"}
            </span>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-xl flex items-center justify-center ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-orange-50 text-gray-400"}`}>
            <MdClose />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">

            {/* Name */}
            <div className="col-span-2">
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Full Name</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCl} placeholder="Full name" />
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Email Address</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCl} placeholder="user@fruit.com" />
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Phone</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCl} placeholder="07XX XXX XXX" />
            </div>

            {/* Role */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Role</label>
              <select value={form.role} onChange={(e) => set("role", e.target.value as UserRole)} className={inputCl}>
                {(["Admin","Manager","Sales Staff","Warehouse"] as UserRole[]).map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value as UserStatus)} className={inputCl}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* Password (add mode only) */}
            {mode === "add" && (
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputCl + " pr-10"}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${sub}`}>
                    {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${divider} flex gap-3`}>
          <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-orange-200 text-gray-600 hover:bg-orange-50"}`}>
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow">
            {mode === "add" ? "Add User" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete confirm ───────────────────────────────── */
function DeleteModal({ name, darkMode, onConfirm, onClose }: { name: string; darkMode: boolean; onConfirm: () => void; onClose: () => void }) {
  const card = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-100";
  const text = darkMode ? "text-white" : "text-gray-800";
  const sub  = darkMode ? "text-gray-400" : "text-gray-500";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full max-w-sm mx-4 rounded-2xl border shadow-2xl p-6 ${card}`}>
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <MdWarning className="text-red-500 text-3xl" />
          </div>
        </div>
        <h3 className={`text-base font-bold text-center mb-1 ${text}`}>Remove User</h3>
        <p className={`text-sm text-center mb-6 ${sub}`}>
          Remove <span className="font-semibold text-orange-500">{name}</span> from the system? They will lose all access.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-orange-200 text-gray-600 hover:bg-orange-50"}`}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow">Remove</button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   TOGGLE SWITCH
──────────────────────────────────────────────────── */
function Toggle({ on, onChange, darkMode }: { on: boolean; onChange: () => void; darkMode: boolean }) {
  return (
    <div onClick={onChange} className={`w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${on ? "bg-orange-500" : darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </div>
  );
}

/* ────────────────────────────────────────────────────
   SETTINGS PAGE
──────────────────────────────────────────────────── */
export default function Settings() {
  const { darkMode, toggleDark } = useTheme();

  const [activeTab,    setActiveTab]    = useState<SettingsTab>("general");
  const [users,        setUsers]        = useState<SystemUser[]>(initialUsers);
  const [userModal,    setUserModal]    = useState<{ mode: "add" | "edit"; data: Omit<SystemUser,"id"> & { id?: string } } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SystemUser | null>(null);
  const [saved,        setSaved]        = useState(false);

  /* General settings state */
  const [bizName,    setBizName]    = useState("FruitIMS");
  const [bizEmail,   setBizEmail]   = useState("info@fruitims.com");
  const [bizPhone,   setBizPhone]   = useState("0700 000 000");
  const [bizAddress, setBizAddress] = useState("Kariakoo, Dar es Salaam");
  const [currency,   setCurrency]   = useState("TSH");
  const [language,   setLanguage]   = useState("English");
  const [timezone,   setTimezone]   = useState("Africa/Dar_es_Salaam");

  /* Notification toggles */
  const [notif, setNotif] = useState({
    lowStock: true, newSale: true, reportReady: false,
    dailyDigest: false, marketPrice: true,
  });

  /* Security settings */
  const [twoFactor,    setTwoFactor]    = useState(false);
  const [sessionLog,   setSessionLog]   = useState(true);
  const [autoLogout,   setAutoLogout]   = useState("30");
  const [oldPass,      setOldPass]      = useState("");
  const [newPass,      setNewPass]      = useState("");
  const [confirmPass,  setConfirmPass]  = useState("");
  const [passMsg,      setPassMsg]      = useState("");

  /* Theme */
  const [compactMode,  setCompactMode]  = useState(false);

  /* Backup */
  const [autoBackup,   setAutoBackup]   = useState(true);
  const [backupFreq,   setBackupFreq]   = useState("Daily");

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleChangePass = () => {
    if (!oldPass || !newPass || !confirmPass) { setPassMsg("Fill all fields."); return; }
    if (newPass !== confirmPass)              { setPassMsg("Passwords do not match."); return; }
    if (newPass.length < 6)                  { setPassMsg("Min 6 characters."); return; }
    setPassMsg("✓ Password updated.");
    setOldPass(""); setNewPass(""); setConfirmPass("");
    setTimeout(() => setPassMsg(""), 3000);
  };

  /* ── Theme ────────────────────────────────────── */
  const text    = darkMode ? "text-white"        : "text-gray-800";
  const subText = darkMode ? "text-gray-400"     : "text-gray-500";
  const cardBg  = darkMode ? "bg-gray-800"       : "bg-white";
  const border  = darkMode ? "border-gray-700"   : "border-orange-100";
  const divider = darkMode ? "border-gray-700"   : "border-orange-100";
  const rowHov  = darkMode ? "hover:bg-gray-700" : "hover:bg-orange-50/40";
  const inputCl = `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${
    darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
             : "bg-orange-50 border-orange-200 text-gray-700 placeholder-gray-400"
  }`;
  const thStyle = `text-xs uppercase tracking-wide font-semibold py-3 px-4 ${subText}`;
  const tdStyle = `py-3 px-4 text-sm ${text}`;

  /* ── Shared section header ────────────────────── */
  const SectionHeader = ({ title, desc }: { title: string; desc: string }) => (
    <div className={`pb-4 mb-4 border-b ${divider}`}>
      <h3 className={`text-base font-bold ${text}`}>{title}</h3>
      <p className={`text-xs mt-0.5 ${subText}`}>{desc}</p>
    </div>
  );

  /* ── Shared field wrapper ─────────────────────── */
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>{label}</label>
      {children}
    </div>
  );

  /* ── Row with toggle ──────────────────────────── */
  const ToggleRow = ({ label, desc, on, onChange }: { label: string; desc: string; on: boolean; onChange: () => void }) => (
    <div className={`flex items-center justify-between py-3 border-b ${divider} last:border-0`}>
      <div>
        <p className={`text-sm font-medium ${text}`}>{label}</p>
        <p className={`text-xs ${subText}`}>{desc}</p>
      </div>
      <Toggle on={on} onChange={onChange} darkMode={darkMode} />
    </div>
  );

  /* ────────────────────────────────────────────────
     TAB CONTENT
  ──────────────────────────────────────────────── */

  /* GENERAL */
  const GeneralTab = () => (
    <div className="space-y-6">
      <SectionHeader title="Appearance" desc="Customize the look of the system." />
      <ToggleRow label="Dark Mode"    desc="Switch between light and dark themes." on={darkMode}    onChange={toggleDark}                          />
      <ToggleRow label="Compact Mode" desc="Reduce spacing for a denser layout."   on={compactMode} onChange={() => setCompactMode(!compactMode)} />

      <SectionHeader title="Regional Settings" desc="Language, currency and timezone preferences." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Currency">
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputCl}>
            {["TSH","USD","EUR","KES","UGX"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Language">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className={inputCl}>
            {["English","Swahili","French"].map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Timezone">
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputCl}>
            {["Africa/Dar_es_Salaam","Africa/Nairobi","Africa/Kampala","UTC"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>
      <button onClick={showSaved} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow">
        <MdSave /> {saved ? "✓ Saved!" : "Save Settings"}
      </button>
    </div>
  );

  /* USERS */
  const UsersTab = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="System Users" desc="Manage who has access to FruitIMS and their roles." />
        <button
          onClick={() => setUserModal({ mode: "add", data: { ...EMPTY_USER } })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow flex-shrink-0 -mt-4"
        >
          <MdAdd /> Add User
        </button>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3">
        {(["Admin","Manager","Sales Staff","Warehouse"] as UserRole[]).map((role) => (
          <span key={role} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${roleBadge[role]}`}>
            {role}: {users.filter((u) => u.role === role).length}
          </span>
        ))}
        <span className="text-xs px-3 py-1.5 rounded-full font-semibold bg-green-100 text-green-700">
          Active: {users.filter((u) => u.status === "Active").length}
        </span>
        <span className="text-xs px-3 py-1.5 rounded-full font-semibold bg-gray-100 text-gray-600">
          Inactive: {users.filter((u) => u.status === "Inactive").length}
        </span>
      </div>

      {/* Users table */}
      <div className={`${cardBg} rounded-2xl border ${border} shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${border}`}>
                <th className={`${thStyle} text-left`}>User</th>
                <th className={`${thStyle} text-left`}>Role</th>
                <th className={`${thStyle} text-left`}>Phone</th>
                <th className={`${thStyle} text-left`}>Last Login</th>
                <th className={`${thStyle} text-center`}>Status</th>
                <th className={`${thStyle} text-center`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={`border-b ${border} ${rowHov} transition-colors`}>
                  <td className={tdStyle}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                        <MdPerson className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-tight">{user.name}</p>
                        <p className={`text-[11px] ${subText}`}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className={tdStyle}>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleBadge[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className={`${tdStyle} text-xs`}>{user.phone}</td>
                  <td className={`${tdStyle} text-xs`}>{user.lastLogin}</td>
                  <td className={`${tdStyle} text-center`}>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className={`${tdStyle} text-center`}>
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setUserModal({ mode: "edit", data: user })}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors">
                        <MdEdit className="text-base" />
                      </button>
                      {user.role !== "Admin" && (
                        <button onClick={() => setDeleteTarget(user)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors">
                          <MdDelete className="text-base" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* NOTIFICATIONS */
  const NotificationsTab = () => (
    <div className="space-y-4">
      <SectionHeader title="Notification Preferences" desc="Choose which events trigger system notifications." />
      <div className={`${cardBg} rounded-2xl border ${border} px-5`}>
        <ToggleRow label="Low Stock Alert"    desc="Notify when an item falls below minimum stock."    on={notif.lowStock}    onChange={() => setNotif((n) => ({ ...n, lowStock: !n.lowStock }))}    />
        <ToggleRow label="New Sale Recorded"  desc="Notify when a new sale order is created."          on={notif.newSale}     onChange={() => setNotif((n) => ({ ...n, newSale: !n.newSale }))}     />
        <ToggleRow label="Report Ready"       desc="Notify when a report finishes generating."          on={notif.reportReady} onChange={() => setNotif((n) => ({ ...n, reportReady: !n.reportReady }))} />
        <ToggleRow label="Daily Digest"       desc="Receive a daily summary email every morning."       on={notif.dailyDigest} onChange={() => setNotif((n) => ({ ...n, dailyDigest: !n.dailyDigest }))} />
        <ToggleRow label="Market Price Alert" desc="Notify when market prices change significantly."    on={notif.marketPrice} onChange={() => setNotif((n) => ({ ...n, marketPrice: !n.marketPrice }))} />
      </div>
      <button onClick={showSaved} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow">
        <MdSave /> {saved ? "✓ Saved!" : "Save Preferences"}
      </button>
    </div>
  );

  /* SECURITY */
  const SecurityTab = () => (
    <div className="space-y-6">
      <SectionHeader title="Security Settings" desc="Protect your account and manage session behaviour." />

      <div className={`${cardBg} rounded-2xl border ${border} px-5`}>
        <ToggleRow label="Two-Factor Authentication" desc="Require a code on every login."               on={twoFactor}  onChange={() => setTwoFactor(!twoFactor)}   />
        <ToggleRow label="Session Activity Log"      desc="Track login sessions and devices."             on={sessionLog} onChange={() => setSessionLog(!sessionLog)} />
      </div>

      <div>
        <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Auto Logout (minutes)</label>
        <select value={autoLogout} onChange={(e) => setAutoLogout(e.target.value)} className={inputCl + " max-w-xs"}>
          {["15","30","60","120","Never"].map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>

      <div className={`${cardBg} rounded-2xl border ${border} p-5`}>
        <h4 className={`text-sm font-bold mb-4 ${text}`}>Change Password</h4>
        <div className="space-y-3 max-w-sm">
          <Field label="Current Password">
            <input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} className={inputCl} placeholder="••••••••" />
          </Field>
          <Field label="New Password">
            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className={inputCl} placeholder="••••••••" />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className={inputCl} placeholder="••••••••" />
          </Field>
          {passMsg && <p className={`text-xs font-medium ${passMsg.startsWith("✓") ? "text-green-500" : "text-red-500"}`}>{passMsg}</p>}
          <button onClick={handleChangePass} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow">
            <MdLock /> Update Password
          </button>
        </div>
      </div>
    </div>
  );

  /* BUSINESS INFO */
  const BusinessTab = () => (
    <div className="space-y-5">
      <SectionHeader title="Business Information" desc="Your company details used across the system." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Business Name">
          <input value={bizName} onChange={(e) => setBizName(e.target.value)} className={inputCl} />
        </Field>
        <Field label="Business Email">
          <input type="email" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} className={inputCl} />
        </Field>
        <Field label="Phone Number">
          <input value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} className={inputCl} />
        </Field>
        <Field label="Address">
          <input value={bizAddress} onChange={(e) => setBizAddress(e.target.value)} className={inputCl} />
        </Field>
      </div>

      {/* System Info */}
      <div className={`${cardBg} rounded-2xl border ${border} divide-y ${divider}`}>
        {[
          { label: "System Version",  value: "v1.0.0" },
          { label: "Database",        value: "PostgreSQL 15" },
          { label: "Environment",     value: "Production" },
          { label: "Last DB Backup",  value: "2025-07-04 03:00 AM" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-3">
            <span className={`text-xs font-semibold uppercase tracking-wide ${subText}`}>{label}</span>
            <span className={`text-sm font-medium ${text}`}>{value}</span>
          </div>
        ))}
      </div>

      <button onClick={showSaved} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow">
        <MdSave /> {saved ? "✓ Saved!" : "Save Business Info"}
      </button>
    </div>
  );

  /* BACKUP */
  const BackupTab = () => (
    <div className="space-y-5">
      <SectionHeader title="Backup & Data Management" desc="Configure automatic backups and manage data." />

      <div className={`${cardBg} rounded-2xl border ${border} px-5`}>
        <ToggleRow label="Automatic Backups" desc="Automatically back up data on the selected schedule." on={autoBackup} onChange={() => setAutoBackup(!autoBackup)} />
      </div>

      <Field label="Backup Frequency">
        <select value={backupFreq} onChange={(e) => setBackupFreq(e.target.value)} className={inputCl + " max-w-xs"}>
          {["Hourly","Daily","Weekly","Monthly"].map((f) => <option key={f}>{f}</option>)}
        </select>
      </Field>

      {/* Backup history */}
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${subText}`}>Backup History</p>
        <div className={`${cardBg} rounded-2xl border ${border} divide-y ${divider}`}>
          {[
            { date: "2025-07-05 03:00 AM", size: "2.4 MB", status: "Success" },
            { date: "2025-07-04 03:00 AM", size: "2.3 MB", status: "Success" },
            { date: "2025-07-03 03:00 AM", size: "2.2 MB", status: "Success" },
            { date: "2025-07-02 03:00 AM", size: "2.1 MB", status: "Failed"  },
          ].map(({ date, size, status }) => (
            <div key={date} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className={`text-xs font-medium ${text}`}>{date}</p>
                <p className={`text-[11px] ${subText}`}>{size}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {status === "Success" ? <MdCheck className="inline" /> : <MdWarning className="inline" />} {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={showSaved} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow">
          <MdSave /> {saved ? "✓ Saved!" : "Save Settings"}
        </button>
        <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-orange-200 text-gray-600 hover:bg-orange-50"}`}>
          <MdBackup /> Backup Now
        </button>
      </div>
    </div>
  );

  const tabContent: Record<SettingsTab, React.ReactNode> = {
    general:       <GeneralTab />,
    users:         <UsersTab />,
    notifications: <NotificationsTab />,
    security:      <SecurityTab />,
    business:      <BusinessTab />,
    backup:        <BackupTab />,
  };

  /* ────────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────────── */
  return (
    <PageLayout pageTitle="Settings" activePage="settings">
      <section className="p-5 sm:p-7 space-y-6">

        {/* ── HEADING ─────────────────────────────── */}
        <div>
          <h2 className={`text-2xl font-bold ${text}`}>Settings</h2>
          <p className={`text-sm mt-1 ${subText}`}>
            Manage system configuration, users, and preferences.
          </p>
        </div>

        {/* ── TAB LAYOUT ──────────────────────────── */}
        <div className="flex gap-6 flex-col lg:flex-row">

          {/* Sidebar tabs */}
          <nav className={`${cardBg} rounded-2xl border ${border} shadow-sm p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible flex-shrink-0 lg:w-52`}>
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === id
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow"
                    : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-orange-50"
                }`}
              >
                <Icon className="text-base flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          {/* Tab content panel */}
          <div className={`flex-1 ${cardBg} rounded-2xl border ${border} shadow-sm p-6`}>
            {tabContent[activeTab]}
          </div>

        </div>
        {/* ── END TAB LAYOUT ──────────────────────── */}

      </section>

      {/* ── USER MODAL ──────────────────────────────── */}
      {userModal && (
        <UserModal
          initial={userModal.data as Omit<SystemUser,"id"> & { id?: string }}
          mode={userModal.mode}
          darkMode={darkMode}
          onSave={(user) => {
            setUsers((prev) =>
              userModal.mode === "add"
                ? [...prev, user]
                : prev.map((u) => (u.id === user.id ? user : u))
            );
            setUserModal(null);
          }}
          onClose={() => setUserModal(null)}
        />
      )}

      {/* ── DELETE MODAL ────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          darkMode={darkMode}
          onConfirm={() => {
            setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
            setDeleteTarget(null);
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}

    </PageLayout>
  );
}