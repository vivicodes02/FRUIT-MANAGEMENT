
import {
  MdInventory2, MdTrendingUp, MdStorefront,
  MdAttachMoney, MdPeople, MdArrowUpward,
  MdArrowDownward, MdMoreVert,
} from "react-icons/md";
import { useTheme } from "../context/ThemeContext";
import PageLayout from "./PageLayout";

/* ── MOCK DATA ────────────────────────────────────── */
const summaryCards = [
  { id: "revenue",   label: "Total Revenue",    value: "TSH 1,000,000", change: "+12.4%", up: true,  sub: "vs last month",     Icon: MdAttachMoney, gradient: "from-orange-500 to-amber-400"  },
  { id: "sales",     label: "Total Sales",      value: "1,284",         change: "+8.1%",  up: true,  sub: "orders this month", Icon: MdTrendingUp,  gradient: "from-amber-500 to-yellow-400"  },
  { id: "inventory", label: "Inventory Items",  value: "3,047",         change: "-2.3%",  up: false, sub: "units in stock",    Icon: MdInventory2,  gradient: "from-orange-600 to-red-400"    },
  { id: "market",    label: "Market Listings",  value: "218",           change: "+5.0%",  up: true,  sub: "active listings",   Icon: MdStorefront,  gradient: "from-yellow-500 to-orange-400" },
  { id: "employee", label: "Employees",        value: "5",             change: "+2",     up: true,  sub: "active staff",      Icon: MdPeople,      gradient: "from-amber-600 to-orange-500"  },
];

const recentSales = [
  { id: "ORD-001", item: "Mango Box (12kg)",   qty: 5,  amount: "TSH 30,340.00", status: "Completed" },
  { id: "ORD-002", item: "Strawberry Punnet",  qty: 20, amount: "TSH 30,180.00", status: "Pending"   },
  { id: "ORD-003", item: "Lemon Crate (10kg)", qty: 3,  amount: "TSH 3,095.00",  status: "Completed" },
  { id: "ORD-004", item: "Grape Bunch (5kg)",  qty: 8,  amount: "TSH 30,224.00", status: "Shipped"   },
  { id: "ORD-005", item: "Carrot Bag (2kg)",   qty: 15, amount: "TSH 30,112.50", status: "Completed" },
];

const lowStockItems = [
  { name: "Kiwi Fruit",    stock: 4,  max: 100, warn: true  },
  { name: "Blueberries",   stock: 11, max: 150, warn: true  },
  { name: "Passion Fruit", stock: 7,  max: 80,  warn: true  },
  { name: "Pomegranate",   stock: 28, max: 120, warn: false },
];

const statusColor: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Pending:   "bg-amber-100 text-amber-700",
  Shipped:   "bg-blue-100 text-blue-700",
};

/* ── DASHBOARD CONTENT ────────────────────────────── */
function DashboardContent() {
  const { darkMode } = useTheme();

  const text     = darkMode ? "text-white"        : "text-gray-800";
  const subText  = darkMode ? "text-gray-400"     : "text-gray-500";
  const cardBg   = darkMode ? "bg-gray-800"       : "bg-white";
  const border   = darkMode ? "border-gray-700"   : "border-orange-100";
  const rowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-orange-50/50";
  const thStyle  = `text-xs uppercase tracking-wide font-semibold py-2 px-4 ${subText}`;
  const tdStyle  = `py-3 px-4 text-sm ${text}`;

  return (
    <section className="p-5 sm:p-7 space-y-7">

      {/* ── SUMMARY CARDS ───────────────────────────── */}
      <div>
        <h2 className={`text-sm font-semibold uppercase tracking-widest mb-4 ${subText}`}>Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {summaryCards.map(({ id, label, value, change, up, sub, Icon, gradient }) => (
            <div key={id} className={`${cardBg} rounded-2xl border ${border} p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow`}>
                <Icon className="text-white text-lg" />
              </div>
              <div>
                <p className={`text-xl font-bold leading-none ${text}`}>{value}</p>
                <p className={`text-xs mt-1 ${subText}`}>{label}</p>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {up
                  ? <MdArrowUpward className="text-green-500 text-sm flex-shrink-0" />
                  : <MdArrowDownward className="text-red-400 text-sm flex-shrink-0" />}
                <span className={`text-xs font-semibold ${up ? "text-green-500" : "text-red-400"}`}>{change}</span>
                <span className={`text-[10px] ${subText}`}>{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ── END SUMMARY CARDS ─────────────────────── */}


      {/* ── BOTTOM ROW ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Sales Table */}
        <div className={`lg:col-span-2 ${cardBg} rounded-2xl border ${border} shadow-sm overflow-hidden`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${border}`}>
            <h3 className={`text-sm font-bold ${text}`}>Recent Sales</h3>
            <button className="text-xs text-orange-500 hover:underline font-medium">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th className={`${thStyle} text-left`}>Order</th>
                  <th className={`${thStyle} text-left`}>Item</th>
                  <th className={`${thStyle} text-right`}>Qty</th>
                  <th className={`${thStyle} text-right`}>Amount</th>
                  <th className={`${thStyle} text-center`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((row) => (
                  <tr key={row.id} className={`border-b ${border} ${rowHover} transition-colors`}>
                    <td className={`${tdStyle} font-mono text-xs text-orange-500`}>{row.id}</td>
                    <td className={tdStyle}>{row.item}</td>
                    <td className={`${tdStyle} text-right`}>{row.qty}</td>
                    <td className={`${tdStyle} text-right font-semibold`}>{row.amount}</td>
                    <td className={`${tdStyle} text-center`}>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* End Recent Sales */}


        {/* Low Stock Panel */}
        <div className={`${cardBg} rounded-2xl border ${border} shadow-sm overflow-hidden`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${border}`}>
            <h3 className={`text-sm font-bold ${text}`}>Low Stock</h3>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors">
              <MdMoreVert />
            </button>
          </div>
          <ul className="divide-y divide-orange-50 px-5">
            {lowStockItems.map((item) => {
              const pct = Math.round((item.stock / item.max) * 100);
              return (
                <li key={item.name} className="py-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-medium ${text}`}>{item.name}</span>
                    <span className={`text-xs font-semibold ${item.warn ? "text-red-500" : "text-green-600"}`}>
                      {item.stock} left
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-orange-100"}`}>
                    <div
                      className={`h-1.5 rounded-full transition-all ${item.warn ? "bg-gradient-to-r from-red-400 to-orange-400" : "bg-gradient-to-r from-orange-400 to-amber-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className={`text-[10px] mt-1 ${subText}`}>{pct}% remaining</p>
                </li>
              );
            })}
          </ul>
        </div>
        {/* End Low Stock */}

      </div>
      {/* ── END BOTTOM ROW ────────────────────────── */}

    </section>
  );
}

/* ── PAGE EXPORT — mounted at /dashboard in App.tsx ── */
export default function Dashboard() {
  return (
    <PageLayout pageTitle="Dashboard" activePage="dashboard">
      <DashboardContent />
    </PageLayout>
  );
}