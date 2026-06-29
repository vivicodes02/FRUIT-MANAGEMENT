/* ────────────────────────────────────────────────────
   InventoryPage.tsx
   Path: src/Pages/InventoryPage.tsx
   Route: /inventory
──────────────────────────────────────────────────── */
import { useState, type JSX } from "react";
import { useTheme } from "../context/ThemeContext";
import PageLayout from "../components/PageLayout";
import {
  MdAdd, MdSearch, MdEdit, MdDelete, MdClose,
  MdInventory2, MdWarning, MdCheckCircle, MdFilterList,
} from "react-icons/md";
import { FaAppleAlt, FaCarrot, FaLeaf } from "react-icons/fa";
import { GiStrawberry, GiGrapes, GiBanana, GiOrange } from "react-icons/gi";

/* ────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────── */
interface InventoryItem {
  id: string;
  name: string;
  category: "Fruit" | "Vegetable";
  quantity: number;
  unit: string;
  price: number;        /* TSH per unit */
  minStock: number;
  supplier: string;
  expiryDate: string;
}

/* ────────────────────────────────────────────────────
   INITIAL DATA
──────────────────────────────────────────────────── */
const initialItems: InventoryItem[] = [
  { id: "INV-001", name: "Mangoes",      category: "Fruit",     quantity: 3,   unit: "kg",  price: 3500,  minStock: 10, supplier: "Kilimanjaro Farms",  expiryDate: "2025-07-10" },
  { id: "INV-002", name: "Strawberries", category: "Fruit",     quantity: 11,  unit: "kg",  price: 8000,  minStock: 15, supplier: "Arusha Berry Co.",   expiryDate: "2025-07-05" },
  { id: "INV-003", name: "Oranges",      category: "Fruit",     quantity: 45,  unit: "kg",  price: 2000,  minStock: 20, supplier: "Coast Citrus Ltd.",  expiryDate: "2025-07-20" },
  { id: "INV-004", name: "Bananas",      category: "Fruit",     quantity: 60,  unit: "bunch",price: 1500, minStock: 30, supplier: "Moshi Agri",        expiryDate: "2025-07-08" },
  { id: "INV-005", name: "Grapes",       category: "Fruit",     quantity: 7,   unit: "kg",  price: 12000, minStock: 10, supplier: "Import Direct",     expiryDate: "2025-07-06" },
  { id: "INV-006", name: "Carrots",      category: "Vegetable", quantity: 80,  unit: "kg",  price: 1200,  minStock: 25, supplier: "Iringa Veg Farm",   expiryDate: "2025-07-15" },
  { id: "INV-007", name: "Tomatoes",     category: "Vegetable", quantity: 50,  unit: "kg",  price: 1800,  minStock: 30, supplier: "Morogoro Fresh",    expiryDate: "2025-07-09" },
  { id: "INV-008", name: "Spinach",      category: "Vegetable", quantity: 5,   unit: "bundle",price: 800, minStock: 10, supplier: "Local Market",      expiryDate: "2025-07-04" },
];

/* Category icon map */
const itemIcon: Record<string, JSX.Element> = {
  Mangoes:      <FaAppleAlt   className="text-orange-400" />,
  Strawberries: <GiStrawberry className="text-red-400"    />,
  Oranges:      <GiOrange     className="text-orange-500" />,
  Bananas:      <GiBanana     className="text-yellow-400" />,
  Grapes:       <GiGrapes     className="text-purple-400" />,
  Carrots:      <FaCarrot     className="text-orange-500" />,
  Tomatoes:     <FaAppleAlt   className="text-red-500"    />,
  Spinach:      <FaLeaf       className="text-green-500"  />,
};

const categories = ["All", "Fruit", "Vegetable"] as const;
type CategoryFilter = typeof categories[number];

const EMPTY: InventoryItem = {
  id: "", name: "", category: "Fruit", quantity: 0,
  unit: "kg", price: 0, minStock: 0, supplier: "", expiryDate: "",
};

/* ────────────────────────────────────────────────────
   ADD / EDIT MODAL
──────────────────────────────────────────────────── */
interface ItemModalProps {
  item: InventoryItem;
  mode: "add" | "edit";
  darkMode: boolean;
  onSave: (item: InventoryItem) => void;
  onClose: () => void;
}

function ItemModal({ item, mode, darkMode, onSave, onClose }: ItemModalProps) {
  const [form, setForm] = useState<InventoryItem>(item);

  const card    = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-100";
  const text    = darkMode ? "text-white"    : "text-gray-800";
  const subText = darkMode ? "text-gray-400" : "text-gray-500";
  const divider = darkMode ? "border-gray-700" : "border-orange-100";
  const inputCl = `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
      : "bg-orange-50 border-orange-200 text-gray-700 placeholder-gray-400"
  }`;

  const set = (key: keyof InventoryItem, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.name || !form.supplier || !form.expiryDate) return;
    const id = mode === "add"
      ? "INV-" + String(Date.now()).slice(-4)
      : form.id;
    onSave({ ...form, id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative z-10 w-full max-w-lg mx-4 rounded-2xl border shadow-2xl overflow-hidden ${card}`}>

        {/* Header */}
        <div className={`px-6 py-4 border-b ${divider} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <MdInventory2 className="text-orange-500 text-xl" />
            <span className={`text-sm font-bold ${text}`}>
              {mode === "add" ? "Add New Item" : "Edit Item"}
            </span>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-orange-50 text-gray-400"}`}>
            <MdClose />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">

          {/* Name */}
          <div className="col-span-2">
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Item Name</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCl} placeholder="e.g. Mangoes" />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value as "Fruit" | "Vegetable")} className={inputCl}>
              <option value="Fruit">Fruit</option>
              <option value="Vegetable">Vegetable</option>
            </select>
          </div>

          {/* Unit */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Unit</label>
            <select value={form.unit} onChange={(e) => set("unit", e.target.value)} className={inputCl}>
              {["kg", "g", "bunch", "crate", "box", "piece", "bundle"].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Quantity</label>
            <input type="number" min={0} value={form.quantity} onChange={(e) => set("quantity", +e.target.value)} className={inputCl} />
          </div>

          {/* Min Stock */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Min Stock Alert</label>
            <input type="number" min={0} value={form.minStock} onChange={(e) => set("minStock", +e.target.value)} className={inputCl} />
          </div>

          {/* Price */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Price (TSH / unit)</label>
            <input type="number" min={0} value={form.price} onChange={(e) => set("price", +e.target.value)} className={inputCl} />
          </div>

          {/* Expiry */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Expiry Date</label>
            <input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} className={inputCl} />
          </div>

          {/* Supplier */}
          <div className="col-span-2">
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${subText}`}>Supplier</label>
            <input value={form.supplier} onChange={(e) => set("supplier", e.target.value)} className={inputCl} placeholder="Supplier name" />
          </div>

        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${divider} flex gap-3`}>
          <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-orange-200 text-gray-600 hover:bg-orange-50"}`}>
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow">
            {mode === "add" ? "Add Item" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   DELETE CONFIRM MODAL
──────────────────────────────────────────────────── */
function DeleteModal({ name, darkMode, onConfirm, onClose }: { name: string; darkMode: boolean; onConfirm: () => void; onClose: () => void }) {
  const card  = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-100";
  const text  = darkMode ? "text-white" : "text-gray-800";
  const sub   = darkMode ? "text-gray-400" : "text-gray-500";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full max-w-sm mx-4 rounded-2xl border shadow-2xl p-6 ${card}`}>
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <MdWarning className="text-red-500 text-3xl" />
          </div>
        </div>
        <h3 className={`text-base font-bold text-center mb-1 ${text}`}>Delete Item</h3>
        <p className={`text-sm text-center mb-6 ${sub}`}>
          Are you sure you want to delete <span className="font-semibold text-orange-500">{name}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-orange-200 text-gray-600 hover:bg-orange-50"}`}>
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-400 text-white text-sm font-semibold hover:from-red-600 hover:to-red-500 transition-all shadow">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   INVENTORY PAGE
──────────────────────────────────────────────────── */
export default function InventoryPage() {
  const { darkMode } = useTheme();

  const [items,        setItems]        = useState<InventoryItem[]>(initialItems);
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState<CategoryFilter>("All");
  const [modal,        setModal]        = useState<{ mode: "add" | "edit"; item: InventoryItem } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);

  /* ── Filter logic ─────────────────────────────── */
  const filtered = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || item.category === catFilter;
    return matchSearch && matchCat;
  });

  /* ── CRUD handlers ────────────────────────────── */
  const handleSave = (saved: InventoryItem) => {
    setItems((prev) =>
      modal?.mode === "add"
        ? [...prev, saved]
        : prev.map((i) => (i.id === saved.id ? saved : i))
    );
    setModal(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  /* ── Stat counts ──────────────────────────────── */
  const totalItems   = items.length;
  const lowStockCount = items.filter((i) => i.quantity <= i.minStock).length;
  const fruitCount   = items.filter((i) => i.category === "Fruit").length;
  const vegCount     = items.filter((i) => i.category === "Vegetable").length;

  /* ── Theme tokens ─────────────────────────────── */
  const text    = darkMode ? "text-white"        : "text-gray-800";
  const subText = darkMode ? "text-gray-400"     : "text-gray-500";
  const cardBg  = darkMode ? "bg-gray-800"       : "bg-white";
  const border  = darkMode ? "border-gray-700"   : "border-orange-100";
  const inputBg = darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                           : "bg-orange-50 border-orange-200 text-gray-700 placeholder-gray-400";
  const rowHov  = darkMode ? "hover:bg-gray-700" : "hover:bg-orange-50/40";
  const thStyle = `text-xs uppercase tracking-wide font-semibold py-3 px-4 ${subText}`;
  const tdStyle = `py-3 px-4 text-sm ${text}`;

  return (
    <PageLayout pageTitle="Inventory" activePage="inventory">
      <section className="p-5 sm:p-7 space-y-6">

        {/* ── PAGE HEADING ────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className={`text-2xl font-bold ${text}`}>Inventory</h2>
            <p className={`text-sm mt-1 ${subText}`}>
              Track and manage your fruits & vegetables stock.
            </p>
          </div>
          {/* Add button */}
          <button
            onClick={() => setModal({ mode: "add", item: EMPTY })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow"
          >
            <MdAdd className="text-lg" />
            Add Item
          </button>
        </div>
        {/* ── END HEADING ───────────────────────── */}


        {/* ── STAT CARDS ──────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Items",  value: totalItems,    color: "from-orange-500 to-amber-400", Icon: MdInventory2   },
            { label: "Low Stock",    value: lowStockCount, color: "from-red-500 to-orange-400",   Icon: MdWarning      },
            { label: "Fruits",       value: fruitCount,    color: "from-amber-500 to-yellow-400", Icon: FaAppleAlt     },
            { label: "Vegetables",   value: vegCount,      color: "from-green-500 to-emerald-400",Icon: FaLeaf         },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} className={`${cardBg} rounded-2xl border ${border} p-4 flex items-center gap-3 shadow-sm`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow flex-shrink-0`}>
                <Icon className="text-white text-lg" />
              </div>
              <div>
                <p className={`text-xl font-bold leading-none ${text}`}>{value}</p>
                <p className={`text-xs mt-0.5 ${subText}`}>{label}</p>
              </div>
            </div>
          ))}
        </div>
        {/* ── END STAT CARDS ────────────────────── */}


        {/* ── SEARCH + FILTER BAR ─────────────────── */}
        <div className={`${cardBg} rounded-2xl border ${border} px-4 py-3 flex flex-wrap items-center gap-3`}>

          {/* Search input */}
          <div className={`flex items-center gap-2 flex-1 min-w-[180px] px-3 py-2 rounded-xl border text-sm ${inputBg}`}>
            <MdSearch className="text-orange-400 text-base flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID or supplier…"
              className="bg-transparent outline-none flex-1 placeholder-gray-400 text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <MdClose className="text-gray-400 hover:text-orange-500 text-sm" />
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-2">
            <MdFilterList className={`text-base ${subText}`} />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  catFilter === cat
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow"
                    : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-orange-50 text-gray-600 hover:bg-orange-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Result count */}
          <span className={`text-xs ${subText}`}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>

        </div>
        {/* ── END SEARCH BAR ────────────────────── */}


        {/* ── INVENTORY TABLE ─────────────────────── */}
        <div className={`${cardBg} rounded-2xl border ${border} shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th className={`${thStyle} text-left`}>ID</th>
                  <th className={`${thStyle} text-left`}>Item</th>
                  <th className={`${thStyle} text-left`}>Category</th>
                  <th className={`${thStyle} text-right`}>Qty</th>
                  <th className={`${thStyle} text-right`}>Price (TSH)</th>
                  <th className={`${thStyle} text-left`}>Supplier</th>
                  <th className={`${thStyle} text-left`}>Expiry</th>
                  <th className={`${thStyle} text-center`}>Status</th>
                  <th className={`${thStyle} text-center`}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={`py-12 text-center text-sm ${subText}`}>
                      No items match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    const isLow     = item.quantity <= item.minStock;
                    const isExpiring = new Date(item.expiryDate) <=
                      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

                    return (
                      <tr key={item.id} className={`border-b ${border} ${rowHov} transition-colors`}>

                        {/* ID */}
                        <td className={`${tdStyle} font-mono text-xs text-orange-500`}>{item.id}</td>

                        {/* Name + icon */}
                        <td className={tdStyle}>
                          <div className="flex items-center gap-2">
                            <span className="text-base flex-shrink-0">
                              {itemIcon[item.name] ?? <MdInventory2 className="text-gray-400" />}
                            </span>
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </td>

                        {/* Category badge */}
                        <td className={tdStyle}>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            item.category === "Fruit"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {item.category}
                          </span>
                        </td>

                        {/* Quantity */}
                        <td className={`${tdStyle} text-right font-semibold ${isLow ? "text-red-500" : ""}`}>
                          {item.quantity} {item.unit}
                        </td>

                        {/* Price */}
                        <td className={`${tdStyle} text-right`}>
                          {item.price.toLocaleString()}
                        </td>

                        {/* Supplier */}
                        <td className={`${tdStyle} max-w-[140px] truncate`}>{item.supplier}</td>

                        {/* Expiry */}
                        <td className={`${tdStyle} ${isExpiring ? "text-red-500 font-semibold" : ""}`}>
                          {item.expiryDate}
                        </td>

                        {/* Status badge */}
                        <td className={`${tdStyle} text-center`}>
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-red-100 text-red-700">
                              <MdWarning className="text-xs" /> Low
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">
                              <MdCheckCircle className="text-xs" /> OK
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className={`${tdStyle} text-center`}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setModal({ mode: "edit", item })}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors"
                              title="Edit"
                            >
                              <MdEdit className="text-base" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
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
        </div>
        {/* ── END TABLE ─────────────────────────── */}

      </section>

      {/* ── ADD / EDIT MODAL ──────────────────────── */}
      {modal && (
        <ItemModal
          item={modal.item}
          mode={modal.mode}
          darkMode={darkMode}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* ── DELETE CONFIRM MODAL ──────────────────── */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          darkMode={darkMode}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

    </PageLayout>
  );
}