/* ────────────────────────────────────────────────────
   SalesPage.tsx
   Path: src/Pages/SalesPage.tsx
   Route: /sales
──────────────────────────────────────────────────── */
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import PageLayout from "../components/PageLayout";
import {
  MdAdd, MdSearch, MdEdit, MdDelete, MdClose,
  MdTrendingUp, MdAttachMoney, MdReceipt,
  MdFilterList, MdWarning, MdCheckCircle,
  MdPending, MdLocalShipping,
} from "react-icons/md";
import { FaAppleAlt, FaCarrot, FaLeaf } from "react-icons/fa";
import { GiStrawberry, GiGrapes, GiBanana, GiOrange } from "react-icons/gi";

/* ────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────── */
type SaleStatus = "Completed" | "Pending" | "Shipped" | "Cancelled";

interface SaleItem {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  item: string;
  category: "Fruit" | "Vegetable";
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
  status: SaleStatus;
  paymentMethod: "Cash" | "M-Pesa" | "Bank Transfer";
}

/* ────────────────────────────────────────────────────
   INITIAL DATA
──────────────────────────────────────────────────── */
const initialSales: SaleItem[] = [
  { id: "ORD-001", date: "2025-07-01", customerName: "Amina Hassan",    customerPhone: "0712 345 678", item: "Mangoes",      category: "Fruit",     quantity: 12,  unit: "kg",    pricePerUnit: 3500,  total: 42000,  status: "Completed", paymentMethod: "Cash"          },
  { id: "ORD-002", date: "2025-07-02", customerName: "John Mwangi",     customerPhone: "0756 789 012", item: "Strawberries", category: "Fruit",     quantity: 5,   unit: "kg",    pricePerUnit: 8000,  total: 40000,  status: "Pending",   paymentMethod: "M-Pesa"        },
  { id: "ORD-003", date: "2025-07-02", customerName: "Fatuma Ali",      customerPhone: "0789 234 567", item: "Carrots",      category: "Vegetable", quantity: 20,  unit: "kg",    pricePerUnit: 1200,  total: 24000,  status: "Shipped",   paymentMethod: "Bank Transfer" },
  { id: "ORD-004", date: "2025-07-03", customerName: "Peter Kimani",    customerPhone: "0744 456 789", item: "Oranges",      category: "Fruit",     quantity: 30,  unit: "kg",    pricePerUnit: 2000,  total: 60000,  status: "Completed", paymentMethod: "Cash"          },
  { id: "ORD-005", date: "2025-07-03", customerName: "Grace Njoroge",   customerPhone: "0722 111 333", item: "Spinach",      category: "Vegetable", quantity: 10,  unit: "bundle",pricePerUnit: 800,   total: 8000,   status: "Completed", paymentMethod: "M-Pesa"        },
  { id: "ORD-006", date: "2025-07-04", customerName: "David Ochieng",   customerPhone: "0733 555 888", item: "Bananas",      category: "Fruit",     quantity: 15,  unit: "bunch", pricePerUnit: 1500,  total: 22500,  status: "Pending",   paymentMethod: "Cash"          },
  { id: "ORD-007", date: "2025-07-04", customerName: "Zainab Mbeki",    customerPhone: "0711 222 444", item: "Grapes",       category: "Fruit",     quantity: 8,   unit: "kg",    pricePerUnit: 12000, total: 96000,  status: "Shipped",   paymentMethod: "Bank Transfer" },
  { id: "ORD-008", date: "2025-07-05", customerName: "Samuel Karimi",   customerPhone: "0766 777 999", item: "Tomatoes",     category: "Vegetable", quantity: 25,  unit: "kg",    pricePerUnit: 1800,  total: 45000,  status: "Cancelled", paymentMethod: "M-Pesa"        },
];

/* ── helpers ──────────────────────────────────────── */
const statusMeta: Record<SaleStatus, { label: string; classes: string; Icon: React.ElementType }> = {
  Completed: { label: "Completed", classes: "bg-green-100 text-green-700",  Icon: MdCheckCircle   },
  Pending:   { label: "Pending",   classes: "bg-amber-100 text-amber-700",  Icon: MdPending       },
  Shipped:   { label: "Shipped",   classes: "bg-blue-100 text-blue-700",    Icon: MdLocalShipping },
  Cancelled: { label: "Cancelled", classes: "bg-red-100 text-red-600",      Icon: MdWarning       },
};

const itemIcon: Record<string, React.ReactNode> = {
  Mangoes:      <FaAppleAlt   className="text-orange-400" />,
  Strawberries: <GiStrawberry className="text-red-400"    />,
  Oranges:      <GiOrange     className="text-orange-500" />,
  Bananas:      <GiBanana     className="text-yellow-400" />,
  Grapes:       <GiGrapes     className="text-purple-400" />,
  Carrots:      <FaCarrot     className="text-orange-500" />,
  Tomatoes:     <FaAppleAlt   className="text-red-500"    />,
  Spinach:      <FaLeaf       className="text-green-500"  />,
};

const allStatuses: SaleStatus[] = ["Completed", "Pending", "Shipped", "Cancelled"];
const allItems = ["Mangoes","Strawberries","Oranges","Bananas","Grapes","Carrots","Tomatoes","Spinach"];
const itemCategory: Record<string, "Fruit" | "Vegetable"> = {
  Mangoes: "Fruit", Strawberries: "Fruit", Oranges: "Fruit", Bananas: "Fruit", Grapes: "Fruit",
  Carrots: "Vegetable", Tomatoes: "Vegetable", Spinach: "Vegetable",
};
const itemUnit: Record<string, string> = {
  Mangoes: "kg", Strawberries: "kg", Oranges: "kg", Bananas: "bunch",
  Grapes: "kg", Carrots: "kg", Tomatoes: "kg", Spinach: "bundle",
};
const itemPrice: Record<string, number> = {
  Mangoes: 3500, Strawberries: 8000, Oranges: 2000, Bananas: 1500,
  Grapes: 12000, Carrots: 1200, Tomatoes: 1800, Spinach: 800,
};

const EMPTY_SALE: Omit<SaleItem, "id" | "total"> = {
  date: new Date().toISOString().split("T")[0],
  customerName: "", customerPhone: "",
  item: "Mangoes", category: "Fruit",
  quantity: 1, unit: "kg",
  pricePerUnit: 3500,
  status: "Pending", paymentMethod: "Cash",
};

/* ────────────────────────────────────────────────────
   ADD / EDIT MODAL
──────────────────────────────────────────────────── */
interface SaleModalProps {
  initial: Omit<SaleItem, "id" | "total"> & { id?: string };
  mode: "add" | "edit";
  darkMode: boolean;
  onSave: (sale: SaleItem) => void;
  onClose: () => void;
}

function SaleModal({ initial, mode, darkMode, onSave, onClose }: SaleModalProps) {
  const [form, setForm] = useState({ ...initial });

  const card    = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-100";
  const text    = darkMode ? "text-white" : "text-gray-800";
  const sub     = darkMode ? "text-gray-400" : "text-gray-500";
  const divider = darkMode ? "border-gray-700" : "border-orange-100";
  const inputCl = `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${
    darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
             : "bg-orange-50 border-orange-200 text-gray-700 placeholder-gray-400"
  }`;

  const set = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleItemChange = (name: string) => {
    setForm((f) => ({
      ...f,
      item: name,
      category: itemCategory[name] ?? "Fruit",
      unit: itemUnit[name] ?? "kg",
      pricePerUnit: itemPrice[name] ?? 0,
    }));
  };

  const total = form.quantity * form.pricePerUnit;

  const handleSave = () => {
    if (!form.customerName || !form.date) return;
    const id = mode === "add"
      ? "ORD-" + String(Date.now()).slice(-4)
      : (initial.id ?? "ORD-???");
    onSave({ ...form, id, total });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full max-w-lg mx-4 rounded-2xl border shadow-2xl overflow-hidden ${card}`}>

        {/* Header */}
        <div className={`px-6 py-4 border-b ${divider} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <MdReceipt className="text-orange-500 text-xl" />
            <span className={`text-sm font-bold ${text}`}>
              {mode === "add" ? "New Sale Order" : "Edit Sale Order"}
            </span>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-orange-50 text-gray-400"}`}>
            <MdClose />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">

          {/* Customer Name */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Customer Name</label>
            <input value={form.customerName} onChange={(e) => set("customerName", e.target.value)} className={inputCl} placeholder="Full name" />
          </div>

          {/* Phone */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Phone</label>
            <input value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} className={inputCl} placeholder="07XX XXX XXX" />
          </div>

          {/* Date */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Sale Date</label>
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCl} />
          </div>

          {/* Item */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Item</label>
            <select value={form.item} onChange={(e) => handleItemChange(e.target.value)} className={inputCl}>
              {allItems.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Quantity ({form.unit})</label>
            <input type="number" min={1} value={form.quantity} onChange={(e) => set("quantity", +e.target.value)} className={inputCl} />
          </div>

          {/* Price per unit */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Price / {form.unit} (TSH)</label>
            <input type="number" min={0} value={form.pricePerUnit} onChange={(e) => set("pricePerUnit", +e.target.value)} className={inputCl} />
          </div>

          {/* Total — read only */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Total (TSH)</label>
            <div className={`px-3 py-2.5 rounded-xl border text-sm font-bold text-orange-500 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-orange-50 border-orange-200"}`}>
              {total.toLocaleString()}
            </div>
          </div>

          {/* Payment method */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Payment</label>
            <select value={form.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value as SaleItem["paymentMethod"])} className={inputCl}>
              {["Cash", "M-Pesa", "Bank Transfer"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Status */}
          <div className="col-span-2">
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value as SaleStatus)} className={inputCl}>
              {allStatuses.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${divider} flex gap-3`}>
          <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-orange-200 text-gray-600 hover:bg-orange-50"}`}>
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow">
            {mode === "add" ? "Record Sale" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Delete confirm ───────────────────────────────── */
function DeleteModal({ id, darkMode, onConfirm, onClose }: { id: string; darkMode: boolean; onConfirm: () => void; onClose: () => void }) {
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
        <h3 className={`text-base font-bold text-center mb-1 ${text}`}>Delete Sale</h3>
        <p className={`text-sm text-center mb-6 ${sub}`}>
          Remove order <span className="font-semibold text-orange-500">{id}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-orange-200 text-gray-600 hover:bg-orange-50"}`}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-400 text-white text-sm font-semibold hover:from-red-600 hover:to-red-500 transition-all shadow">Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   SALES PAGE
──────────────────────────────────────────────────── */
export default function SalesPage() {
  const { darkMode } = useTheme();

  const [sales,        setSales]        = useState<SaleItem[]>(initialSales);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<SaleStatus | "All">("All");
  const [modal,        setModal]        = useState<{ mode: "add" | "edit"; data: Omit<SaleItem,"total"> & { id?: string } } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SaleItem | null>(null);

  /* ── Filter ───────────────────────────────────── */
  const filtered = sales.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      s.id.toLowerCase().includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      s.item.toLowerCase().includes(q) ||
      s.paymentMethod.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  /* ── CRUD ─────────────────────────────────────── */
  const handleSave = (sale: SaleItem) => {
    setSales((prev) =>
      modal?.mode === "add"
        ? [...prev, sale]
        : prev.map((s) => (s.id === sale.id ? sale : s))
    );
    setModal(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setSales((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  /* ── Summary stats ────────────────────────────── */
  const totalRevenue  = sales.filter((s) => s.status === "Completed").reduce((sum, s) => sum + s.total, 0);
  const totalOrders   = sales.length;
  const pendingCount  = sales.filter((s) => s.status === "Pending").length;
  const shippedCount  = sales.filter((s) => s.status === "Shipped").length;

  /* ── Theme tokens ─────────────────────────────── */
  const text    = darkMode ? "text-white"        : "text-gray-800";
  const subText = darkMode ? "text-gray-400"     : "text-gray-500";
  const cardBg  = darkMode ? "bg-gray-800"       : "bg-white";
  const border  = darkMode ? "border-gray-700"   : "border-orange-100";
  const inputBg = darkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
    : "bg-orange-50 border-orange-200 text-gray-700 placeholder-gray-400";
  const rowHov  = darkMode ? "hover:bg-gray-700" : "hover:bg-orange-50/40";
  const thStyle = `text-xs uppercase tracking-wide font-semibold py-3 px-4 ${subText}`;
  const tdStyle = `py-3 px-4 text-sm ${text}`;

  return (
    <PageLayout pageTitle="Sales" activePage="sales">
      <section className="p-5 sm:p-7 space-y-6">

        {/* ── HEADING ───────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className={`text-2xl font-bold ${text}`}>Sales</h2>
            <p className={`text-sm mt-1 ${subText}`}>
              Record and manage all fruit & vegetable sales orders.
            </p>
          </div>
          <button
            onClick={() => setModal({ mode: "add", data: { ...EMPTY_SALE, id: "" } })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow"
          >
            <MdAdd className="text-lg" /> New Sale
          </button>
        </div>


        {/* ── STAT CARDS ────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue",  value: "TSH " + totalRevenue.toLocaleString(), gradient: "from-orange-500 to-amber-400", Icon: MdAttachMoney   },
            { label: "Total Orders",   value: totalOrders,                             gradient: "from-amber-500 to-yellow-400", Icon: MdReceipt       },
            { label: "Pending",        value: pendingCount,                            gradient: "from-yellow-500 to-orange-400",Icon: MdPending       },
            { label: "Shipped",        value: shippedCount,                            gradient: "from-blue-500 to-cyan-400",    Icon: MdLocalShipping },
          ].map(({ label, value, gradient, Icon }) => (
            <div key={label} className={`${cardBg} rounded-2xl border ${border} p-4 flex items-center gap-3 shadow-sm`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow flex-shrink-0`}>
                <Icon className="text-white text-lg" />
              </div>
              <div>
                <p className={`text-base sm:text-lg font-bold leading-none ${text}`}>{value}</p>
                <p className={`text-xs mt-0.5 ${subText}`}>{label}</p>
              </div>
            </div>
          ))}
        </div>


        {/* ── SEARCH + FILTER BAR ───────────────────── */}
        <div className={`${cardBg} rounded-2xl border ${border} px-4 py-3 flex flex-wrap items-center gap-3`}>

          {/* Search */}
          <div className={`flex items-center gap-2 flex-1 min-w-[180px] px-3 py-2 rounded-xl border text-sm ${inputBg}`}>
            <MdSearch className="text-orange-400 text-base flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, customer, item…"
              className="bg-transparent outline-none flex-1 placeholder-gray-400 text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <MdClose className="text-gray-400 hover:text-orange-500 text-sm" />
              </button>
            )}
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <MdFilterList className={`text-base ${subText}`} />
            {(["All", ...allStatuses] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === s
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow"
                    : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-orange-50 text-gray-600 hover:bg-orange-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <span className={`text-xs ${subText}`}>
            {filtered.length} order{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>


        {/* ── SALES TABLE ───────────────────────────── */}
        <div className={`${cardBg} rounded-2xl border ${border} shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th className={`${thStyle} text-left`}>Order ID</th>
                  <th className={`${thStyle} text-left`}>Date</th>
                  <th className={`${thStyle} text-left`}>Customer</th>
                  <th className={`${thStyle} text-left`}>Item</th>
                  <th className={`${thStyle} text-right`}>Qty</th>
                  <th className={`${thStyle} text-right`}>Total (TSH)</th>
                  <th className={`${thStyle} text-left`}>Payment</th>
                  <th className={`${thStyle} text-center`}>Status</th>
                  <th className={`${thStyle} text-center`}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={`py-12 text-center text-sm ${subText}`}>
                      No sales match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((sale) => {
                    const meta = statusMeta[sale.status];
                    return (
                      <tr key={sale.id} className={`border-b ${border} ${rowHov} transition-colors`}>

                        {/* Order ID */}
                        <td className={`${tdStyle} font-mono text-xs text-orange-500 font-semibold`}>{sale.id}</td>

                        {/* Date */}
                        <td className={`${tdStyle} text-xs`}>{sale.date}</td>

                        {/* Customer */}
                        <td className={tdStyle}>
                          <p className="font-medium leading-tight">{sale.customerName}</p>
                          <p className={`text-[11px] ${subText}`}>{sale.customerPhone}</p>
                        </td>

                        {/* Item */}
                        <td className={tdStyle}>
                          <div className="flex items-center gap-2">
                            <span className="text-base flex-shrink-0">
                              {itemIcon[sale.item] ?? <MdTrendingUp className="text-gray-400" />}
                            </span>
                            <div>
                              <p className="font-medium leading-tight">{sale.item}</p>
                              <p className={`text-[11px] ${subText}`}>{sale.category}</p>
                            </div>
                          </div>
                        </td>

                        {/* Qty */}
                        <td className={`${tdStyle} text-right`}>
                          {sale.quantity} {sale.unit}
                        </td>

                        {/* Total */}
                        <td className={`${tdStyle} text-right font-bold text-orange-500`}>
                          {sale.total.toLocaleString()}
                        </td>

                        {/* Payment */}
                        <td className={`${tdStyle}`}>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            sale.paymentMethod === "Cash"          ? "bg-green-100 text-green-700"  :
                            sale.paymentMethod === "M-Pesa"        ? "bg-purple-100 text-purple-700" :
                                                                     "bg-blue-100 text-blue-700"
                          }`}>
                            {sale.paymentMethod}
                          </span>
                        </td>

                        {/* Status */}
                        <td className={`${tdStyle} text-center`}>
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${meta.classes}`}>
                            <meta.Icon className="text-xs" />
                            {meta.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className={`${tdStyle} text-center`}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setModal({ mode: "edit", data: sale })}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors"
                              title="Edit"
                            >
                              <MdEdit className="text-base" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(sale)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <MdDelete className="text-base" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer — total of filtered */}
          {filtered.length > 0 && (
            <div className={`px-5 py-3 border-t ${border} flex items-center justify-between`}>
              <span className={`text-xs ${subText}`}>{filtered.length} orders shown</span>
              <span className={`text-xs font-semibold ${text}`}>
                Filtered total:{" "}
                <span className="text-orange-500">
                  TSH {filtered.reduce((s, o) => s + o.total, 0).toLocaleString()}
                </span>
              </span>
            </div>
          )}
        </div>
        {/* ── END TABLE ─────────────────────────────── */}

      </section>

      {/* ── MODALS ────────────────────────────────── */}
      {modal && (
        <SaleModal
          initial={modal.data}
          mode={modal.mode}
          darkMode={darkMode}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          id={deleteTarget.id}
          darkMode={darkMode}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

    </PageLayout>
  );
}