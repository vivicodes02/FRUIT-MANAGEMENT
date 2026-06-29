
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import PageLayout from "../components/PageLayout";
import {
  MdAdd, MdSearch, MdEdit, MdDelete, MdClose,
  MdStorefront, MdFilterList, MdWarning,
  MdCheckCircle, MdPause, MdTrendingUp,
  MdAttachMoney, MdStar, MdStarBorder,
} from "react-icons/md";
import { FaAppleAlt, FaCarrot, FaLeaf, FaTruck } from "react-icons/fa";
import { GiStrawberry, GiGrapes, GiBanana, GiOrange } from "react-icons/gi";

/* ────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────── */
type ListingStatus  = "Active" | "Inactive" | "Out of Stock";
type SupplyCategory = "Fruit" | "Vegetable";

interface MarketListing {
  id: string;
  name: string;
  category: SupplyCategory;
  pricePerUnit: number;
  unit: string;
  availableQty: number;
  supplier: string;
  supplierPhone: string;
  market: string;           /* market/location name */
  deliveryAvailable: boolean;
  status: ListingStatus;
  featured: boolean;
  dateAdded: string;
}

/* ────────────────────────────────────────────────────
   INITIAL DATA
──────────────────────────────────────────────────── */
const initialListings: MarketListing[] = [
  { id: "MKT-001", name: "Mangoes",      category: "Fruit",     pricePerUnit: 3500,  unit: "kg",    availableQty: 200, supplier: "Kilimanjaro Farms",  supplierPhone: "0712 345 678", market: "Kariakoo Market",   deliveryAvailable: true,  status: "Active",       featured: true,  dateAdded: "2025-06-15" },
  { id: "MKT-002", name: "Strawberries", category: "Fruit",     pricePerUnit: 8000,  unit: "kg",    availableQty: 50,  supplier: "Arusha Berry Co.",   supplierPhone: "0756 789 012", market: "Mwenge Market",     deliveryAvailable: true,  status: "Active",       featured: true,  dateAdded: "2025-06-18" },
  { id: "MKT-003", name: "Oranges",      category: "Fruit",     pricePerUnit: 2000,  unit: "kg",    availableQty: 500, supplier: "Coast Citrus Ltd.",  supplierPhone: "0789 234 567", market: "Tandale Market",    deliveryAvailable: false, status: "Active",       featured: false, dateAdded: "2025-06-20" },
  { id: "MKT-004", name: "Bananas",      category: "Fruit",     pricePerUnit: 1500,  unit: "bunch", availableQty: 300, supplier: "Moshi Agri",        supplierPhone: "0744 456 789", market: "Kariakoo Market",   deliveryAvailable: true,  status: "Active",       featured: false, dateAdded: "2025-06-22" },
  { id: "MKT-005", name: "Grapes",       category: "Fruit",     pricePerUnit: 12000, unit: "kg",    availableQty: 0,   supplier: "Import Direct",     supplierPhone: "0733 555 888", market: "Mlimani City",      deliveryAvailable: true,  status: "Out of Stock", featured: false, dateAdded: "2025-06-25" },
  { id: "MKT-006", name: "Carrots",      category: "Vegetable", pricePerUnit: 1200,  unit: "kg",    availableQty: 800, supplier: "Iringa Veg Farm",   supplierPhone: "0722 111 333", market: "Tandale Market",    deliveryAvailable: false, status: "Active",       featured: false, dateAdded: "2025-06-28" },
  { id: "MKT-007", name: "Tomatoes",     category: "Vegetable", pricePerUnit: 1800,  unit: "kg",    availableQty: 400, supplier: "Morogoro Fresh",    supplierPhone: "0766 777 999", market: "Mwenge Market",     deliveryAvailable: true,  status: "Active",       featured: true,  dateAdded: "2025-07-01" },
  { id: "MKT-008", name: "Spinach",      category: "Vegetable", pricePerUnit: 800,   unit: "bundle",availableQty: 100, supplier: "Local Market Co.",  supplierPhone: "0711 222 444", market: "Kariakoo Market",   deliveryAvailable: false, status: "Inactive",     featured: false, dateAdded: "2025-07-02" },
];

/* ── helpers ──────────────────────────────────────── */
const statusMeta: Record<ListingStatus, { classes: string; Icon: React.ElementType }> = {
  "Active":       { classes: "bg-green-100 text-green-700",  Icon: MdCheckCircle },
  "Inactive":     { classes: "bg-gray-100  text-gray-600",   Icon: MdPause       },
  "Out of Stock": { classes: "bg-red-100   text-red-600",    Icon: MdWarning     },
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

const allItems   = ["Mangoes","Strawberries","Oranges","Bananas","Grapes","Carrots","Tomatoes","Spinach"];
const allMarkets = ["Kariakoo Market","Mwenge Market","Tandale Market","Mlimani City","Tegeta Market","Mbagala Market"];
const allUnits   = ["kg","g","bunch","crate","box","piece","bundle"];

const itemCategory: Record<string, SupplyCategory> = {
  Mangoes: "Fruit", Strawberries: "Fruit", Oranges: "Fruit",
  Bananas: "Fruit", Grapes: "Fruit",
  Carrots: "Vegetable", Tomatoes: "Vegetable", Spinach: "Vegetable",
};

const EMPTY: Omit<MarketListing, "id"> = {
  name: "Mangoes", category: "Fruit", pricePerUnit: 3500, unit: "kg",
  availableQty: 0, supplier: "", supplierPhone: "", market: "Kariakoo Market",
  deliveryAvailable: false, status: "Active", featured: false,
  dateAdded: new Date().toISOString().split("T")[0],
};

/* ────────────────────────────────────────────────────
   ADD / EDIT MODAL
──────────────────────────────────────────────────── */
interface ListingModalProps {
  initial: Partial<MarketListing> & Omit<MarketListing, "id">;
  mode: "add" | "edit";
  darkMode: boolean;
  onSave: (listing: MarketListing) => void;
  onClose: () => void;
}

function ListingModal({ initial, mode, darkMode, onSave, onClose }: ListingModalProps) {
  const [form, setForm] = useState({ ...initial });

  const card    = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-100";
  const text    = darkMode ? "text-white"    : "text-gray-800";
  const sub     = darkMode ? "text-gray-400" : "text-gray-500";
  const divider = darkMode ? "border-gray-700" : "border-orange-100";
  const inputCl = `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${
    darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
             : "bg-orange-50 border-orange-200 text-gray-700 placeholder-gray-400"
  }`;

  const set = <K extends keyof MarketListing>(k: K, v: MarketListing[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleItemChange = (name: string) =>
    setForm((f) => ({ ...f, name, category: itemCategory[name] ?? "Fruit" }));

  const handleSave = () => {
    if (!form.supplier || !form.market) return;
    const id = (initial as MarketListing).id ??
      "MKT-" + String(Date.now()).slice(-4);
    onSave({ ...form, id } as MarketListing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full max-w-lg mx-4 rounded-2xl border shadow-2xl overflow-hidden ${card}`}>

        {/* Header */}
        <div className={`px-6 py-4 border-b ${divider} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <MdStorefront className="text-orange-500 text-xl" />
            <span className={`text-sm font-bold ${text}`}>
              {mode === "add" ? "Add Market Listing" : "Edit Listing"}
            </span>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-xl flex items-center justify-center ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-orange-50 text-gray-400"}`}>
            <MdClose />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">

          {/* Item */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Item</label>
            <select value={form.name} onChange={(e) => handleItemChange(e.target.value)} className={inputCl}>
              {allItems.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>

          {/* Category — read only */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Category</label>
            <input value={form.category} readOnly className={`${inputCl} opacity-60 cursor-not-allowed`} />
          </div>

          {/* Price */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Price (TSH / unit)</label>
            <input type="number" min={0} value={form.pricePerUnit} onChange={(e) => set("pricePerUnit", +e.target.value)} className={inputCl} />
          </div>

          {/* Unit */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Unit</label>
            <select value={form.unit} onChange={(e) => set("unit", e.target.value)} className={inputCl}>
              {allUnits.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>

          {/* Available Qty */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Available Qty</label>
            <input type="number" min={0} value={form.availableQty} onChange={(e) => set("availableQty", +e.target.value)} className={inputCl} />
          </div>

          {/* Market */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Market / Location</label>
            <select value={form.market} onChange={(e) => set("market", e.target.value)} className={inputCl}>
              {allMarkets.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>

          {/* Supplier */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Supplier Name</label>
            <input value={form.supplier} onChange={(e) => set("supplier", e.target.value)} className={inputCl} placeholder="Supplier name" />
          </div>

          {/* Supplier Phone */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Supplier Phone</label>
            <input value={form.supplierPhone} onChange={(e) => set("supplierPhone", e.target.value)} className={inputCl} placeholder="07XX XXX XXX" />
          </div>

          {/* Status */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value as ListingStatus)} className={inputCl}>
              {(["Active","Inactive","Out of Stock"] as ListingStatus[]).map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Date Added */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${sub}`}>Date Added</label>
            <input type="date" value={form.dateAdded} onChange={(e) => set("dateAdded", e.target.value)} className={inputCl} />
          </div>

          {/* Toggles */}
          <div className="col-span-2 flex gap-6">
            {/* Delivery */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => set("deliveryAvailable", !form.deliveryAvailable)}
                className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.deliveryAvailable ? "bg-orange-500" : darkMode ? "bg-gray-600" : "bg-gray-300"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form.deliveryAvailable ? "translate-x-4" : "translate-x-0"}`} />
              </div>
              <span className={`text-xs font-medium ${sub}`}>Delivery Available</span>
            </label>

            {/* Featured */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => set("featured", !form.featured)}
                className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.featured ? "bg-amber-400" : darkMode ? "bg-gray-600" : "bg-gray-300"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-4" : "translate-x-0"}`} />
              </div>
              <span className={`text-xs font-medium ${sub}`}>Featured Listing</span>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${divider} flex gap-3`}>
          <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-orange-200 text-gray-600 hover:bg-orange-50"}`}>
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow">
            {mode === "add" ? "Add Listing" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Delete Confirm ───────────────────────────────── */
function DeleteModal({ id, name, darkMode, onConfirm, onClose }: { id: string; name: string; darkMode: boolean; onConfirm: () => void; onClose: () => void }) {
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
        <h3 className={`text-base font-bold text-center mb-1 ${text}`}>Remove Listing</h3>
        <p className={`text-sm text-center mb-6 ${sub}`}>
          Remove <span className="font-semibold text-orange-500">{name}</span> ({id}) from the market? This cannot be undone.
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
   MARKET PAGE
──────────────────────────────────────────────────── */
export default function MarketPage() {
  const { darkMode } = useTheme();

  const [listings,     setListings]     = useState<MarketListing[]>(initialListings);
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState<SupplyCategory | "All">("All");
  const [statusFilter, setStatusFilter] = useState<ListingStatus | "All">("All");
  const [modal,        setModal]        = useState<{ mode: "add" | "edit"; data: Omit<MarketListing,"id"> & { id?: string } } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MarketListing | null>(null);

  /* ── Filter ───────────────────────────────────── */
  const filtered = listings.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      l.name.toLowerCase().includes(q) ||
      l.supplier.toLowerCase().includes(q) ||
      l.market.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q);
    const matchCat    = catFilter    === "All" || l.category === catFilter;
    const matchStatus = statusFilter === "All" || l.status   === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  /* ── CRUD ─────────────────────────────────────── */
  const handleSave = (listing: MarketListing) => {
    setListings((prev) =>
      modal?.mode === "add"
        ? [...prev, listing]
        : prev.map((l) => (l.id === listing.id ? listing : l))
    );
    setModal(null);
  };

  const toggleFeatured = (id: string) =>
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, featured: !l.featured } : l));

  const handleDelete = () => {
    if (!deleteTarget) return;
    setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  /* ── Stats ────────────────────────────────────── */
  const activeCount  = listings.filter((l) => l.status === "Active").length;
  const featuredCount = listings.filter((l) => l.featured).length;
  const deliveryCount = listings.filter((l) => l.deliveryAvailable).length;
  const outOfStock   = listings.filter((l) => l.status === "Out of Stock").length;

  /* ── Theme ────────────────────────────────────── */
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
    <PageLayout pageTitle="Market" activePage="market">
      <section className="p-5 sm:p-7 space-y-6">

        {/* ── HEADING ───────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className={`text-2xl font-bold ${text}`}>Market</h2>
            <p className={`text-sm mt-1 ${subText}`}>
              Manage market listings, pricing, suppliers and delivery services.
            </p>
          </div>
          <button
            onClick={() => setModal({ mode: "add", data: { ...EMPTY } })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow"
          >
            <MdAdd className="text-lg" /> Add Listing
          </button>
        </div>


        {/* ── STAT CARDS ────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Active Listings",   value: activeCount,   gradient: "from-orange-500 to-amber-400",  Icon: MdStorefront  },
            { label: "Featured",          value: featuredCount, gradient: "from-amber-400 to-yellow-400",  Icon: MdStar        },
            { label: "With Delivery",     value: deliveryCount, gradient: "from-blue-500 to-cyan-400",     Icon: FaTruck       },
            { label: "Out of Stock",      value: outOfStock,    gradient: "from-red-500 to-orange-400",    Icon: MdWarning     },
          ].map(({ label, value, gradient, Icon }) => (
            <div key={label} className={`${cardBg} rounded-2xl border ${border} p-4 flex items-center gap-3 shadow-sm`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow flex-shrink-0`}>
                <Icon className="text-white text-lg" />
              </div>
              <div>
                <p className={`text-xl font-bold leading-none ${text}`}>{value}</p>
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
              placeholder="Search by item, supplier, market or ID…"
              className="bg-transparent outline-none flex-1 placeholder-gray-400 text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <MdClose className="text-gray-400 hover:text-orange-500 text-sm" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <MdFilterList className={`text-base ${subText}`} />
            {(["All", "Fruit", "Vegetable"] as const).map((c) => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  catFilter === c
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow"
                    : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-orange-50 text-gray-600 hover:bg-orange-100"
                }`}
              >{c}</button>
            ))}
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["All", "Active", "Inactive", "Out of Stock"] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === s
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow"
                    : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-orange-50 text-gray-600 hover:bg-orange-100"
                }`}
              >{s}</button>
            ))}
          </div>

          <span className={`text-xs ${subText}`}>
            {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>


        {/* ── LISTINGS TABLE ────────────────────────── */}
        <div className={`${cardBg} rounded-2xl border ${border} shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th className={`${thStyle} text-left`}>ID</th>
                  <th className={`${thStyle} text-left`}>Item</th>
                  <th className={`${thStyle} text-left`}>Market</th>
                  <th className={`${thStyle} text-right`}>Price (TSH)</th>
                  <th className={`${thStyle} text-right`}>Qty</th>
                  <th className={`${thStyle} text-left`}>Supplier</th>
                  <th className={`${thStyle} text-center`}>Delivery</th>
                  <th className={`${thStyle} text-center`}>Featured</th>
                  <th className={`${thStyle} text-center`}>Status</th>
                  <th className={`${thStyle} text-center`}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className={`py-12 text-center text-sm ${subText}`}>
                      No listings match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((listing) => {
                    const meta = statusMeta[listing.status];
                    return (
                      <tr key={listing.id} className={`border-b ${border} ${rowHov} transition-colors`}>

                        {/* ID */}
                        <td className={`${tdStyle} font-mono text-xs text-orange-500 font-semibold`}>{listing.id}</td>

                        {/* Item */}
                        <td className={tdStyle}>
                          <div className="flex items-center gap-2">
                            <span className="text-base flex-shrink-0">
                              {itemIcon[listing.name] ?? <MdStorefront className="text-gray-400" />}
                            </span>
                            <div>
                              <p className="font-medium leading-tight">{listing.name}</p>
                              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${listing.category === "Fruit" ? "text-orange-600 bg-orange-50" : "text-green-600 bg-green-50"}`}>
                                {listing.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Market */}
                        <td className={`${tdStyle} max-w-[130px]`}>
                          <p className="truncate text-xs">{listing.market}</p>
                        </td>

                        {/* Price */}
                        <td className={`${tdStyle} text-right font-bold text-orange-500`}>
                          {listing.pricePerUnit.toLocaleString()}
                          <span className={`text-[10px] font-normal ml-0.5 ${subText}`}>/{listing.unit}</span>
                        </td>

                        {/* Qty */}
                        <td className={`${tdStyle} text-right font-semibold ${listing.availableQty === 0 ? "text-red-500" : ""}`}>
                          {listing.availableQty}
                        </td>

                        {/* Supplier */}
                        <td className={tdStyle}>
                          <p className="text-xs font-medium leading-tight">{listing.supplier}</p>
                          <p className={`text-[10px] ${subText}`}>{listing.supplierPhone}</p>
                        </td>

                        {/* Delivery */}
                        <td className={`${tdStyle} text-center`}>
                          {listing.deliveryAvailable
                            ? <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium"><FaTruck className="text-[10px]" />Yes</span>
                            : <span className={`text-xs ${subText}`}>No</span>}
                        </td>

                        {/* Featured toggle */}
                        <td className={`${tdStyle} text-center`}>
                          <button onClick={() => toggleFeatured(listing.id)} title="Toggle featured">
                            {listing.featured
                              ? <MdStar     className="text-amber-400 text-xl mx-auto" />
                              : <MdStarBorder className={`text-xl mx-auto ${subText}`} />}
                          </button>
                        </td>

                        {/* Status */}
                        <td className={`${tdStyle} text-center`}>
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${meta.classes}`}>
                            <meta.Icon className="text-xs" />
                            {listing.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className={`${tdStyle} text-center`}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setModal({ mode: "edit", data: listing })}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors"
                              title="Edit"
                            >
                              <MdEdit className="text-base" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(listing)}
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

          {/* Footer */}
          {filtered.length > 0 && (
            <div className={`px-5 py-3 border-t ${border} flex items-center justify-between`}>
              <span className={`text-xs ${subText}`}>{filtered.length} listings shown</span>
              <div className="flex items-center gap-4">
                <span className={`text-xs ${subText}`}>
                  Avg price:{" "}
                  <span className="text-orange-500 font-semibold">
                    TSH {Math.round(filtered.reduce((s, l) => s + l.pricePerUnit, 0) / filtered.length).toLocaleString()}
                  </span>
                </span>
                <span className={`text-xs ${subText}`}>
                  Total qty:{" "}
                  <span className={`font-semibold ${text}`}>
                    {filtered.reduce((s, l) => s + l.availableQty, 0).toLocaleString()}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
        {/* ── END TABLE ─────────────────────────────── */}

      </section>

      {/* ── MODALS ────────────────────────────────── */}
      {modal && (
        <ListingModal
          initial={modal.data as Omit<MarketListing,"id"> & { id?: string }}
          mode={modal.mode}
          darkMode={darkMode}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          id={deleteTarget.id}
          name={deleteTarget.name}
          darkMode={darkMode}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

    </PageLayout>
  );
}