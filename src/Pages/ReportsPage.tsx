/* ────────────────────────────────────────────────────
   ReportsPage.tsx
   Path: src/Pages/ReportsPage.tsx
   Route: /reports
──────────────────────────────────────────────────── */
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import PageLayout from "../components/PageLayout";
import {
  MdAssessment, MdTrendingUp, MdAttachMoney,
  MdInventory2, MdStorefront, MdPeople,
  MdDownload, MdSearch, MdClose, MdFilterList,
  MdCalendarToday, MdArrowUpward, MdArrowDownward,
  MdCheckCircle, MdWarning, MdBarChart,
} from "react-icons/md";
import { FaAppleAlt, FaCarrot } from "react-icons/fa";

/* ────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────── */
type ReportType = "Sales" | "Revenue" | "Inventory" | "Market" | "Employees";
type Period     = "Daily" | "Weekly" | "Monthly" | "Yearly";

interface ReportEntry {
  id: string;
  title: string;
  type: ReportType;
  period: Period;
  dateGenerated: string;
  dateRange: string;
  generatedBy: string;
  status: "Ready" | "Processing";
  records: number;
  summary: string;
}

/* ────────────────────────────────────────────────────
   MOCK REPORT DATA
──────────────────────────────────────────────────── */
const initialReports: ReportEntry[] = [
  { id: "RPT-001", title: "Monthly Sales Report",        type: "Sales",     period: "Monthly", dateGenerated: "2025-07-01", dateRange: "Jun 1–30, 2025",    generatedBy: "Admin User", status: "Ready",      records: 124, summary: "Total 124 orders processed. Revenue TSH 2,340,000. Top item: Mangoes." },
  { id: "RPT-002", title: "Weekly Revenue Summary",      type: "Revenue",   period: "Weekly",  dateGenerated: "2025-07-01", dateRange: "Jun 23–30, 2025",   generatedBy: "Admin User", status: "Ready",      records: 38,  summary: "Weekly revenue TSH 640,000. 12% increase from previous week." },
  { id: "RPT-003", title: "Inventory Stock Report",      type: "Inventory", period: "Monthly", dateGenerated: "2025-06-30", dateRange: "Jun 2025",          generatedBy: "Admin User", status: "Ready",      records: 18,  summary: "18 SKUs tracked. 4 items below minimum stock level. Reorder needed." },
  { id: "RPT-004", title: "Market Listings Overview",    type: "Market",    period: "Monthly", dateGenerated: "2025-06-28", dateRange: "Jun 2025",          generatedBy: "Admin User", status: "Ready",      records: 8,   summary: "8 active listings across 4 markets. 3 featured. Avg price TSH 4,100." },
  { id: "RPT-005", title: "Daily Sales — July 4",        type: "Sales",     period: "Daily",   dateGenerated: "2025-07-04", dateRange: "Jul 4, 2025",       generatedBy: "Admin User", status: "Ready",      records: 6,   summary: "6 sales recorded. Revenue TSH 148,000. 2 pending orders." },
  { id: "RPT-006", title: "Yearly Revenue Report",       type: "Revenue",   period: "Yearly",  dateGenerated: "2025-07-01", dateRange: "Jan–Dec 2024",      generatedBy: "Admin User", status: "Ready",      records: 980, summary: "Annual revenue TSH 14,200,000. 22% growth YoY. Fruits outperformed vegetables." },
  { id: "RPT-007", title: "Employee Activity Report",    type: "Employees", period: "Monthly", dateGenerated: "2025-07-01", dateRange: "Jun 2025",          generatedBy: "Admin User", status: "Ready",      records: 5,   summary: "5 staff active. 3 sales staff, 1 warehouse, 1 admin. No absentees." },
  { id: "RPT-008", title: "Q2 Inventory Analysis",       type: "Inventory", period: "Yearly",  dateGenerated: "2025-07-02", dateRange: "Apr–Jun 2025",      generatedBy: "Admin User", status: "Ready",      records: 22,  summary: "Quarterly stock movement. Mangoes highest turnover. Spinach lowest margin." },
  { id: "RPT-009", title: "Weekly Market Prices",        type: "Market",    period: "Weekly",  dateGenerated: "2025-07-03", dateRange: "Jun 30–Jul 6, 2025",generatedBy: "Admin User", status: "Processing", records: 0,   summary: "Report is being generated. Please check back later." },
];

/* ── Summary metrics ──────────────────────────────── */
const summaryMetrics = [
  { label: "Total Revenue (Jun)",   value: "TSH 2,340,000", change: "+12%", up: true,  Icon: MdAttachMoney, gradient: "from-orange-500 to-amber-400" },
  { label: "Orders (Jun)",          value: "124",           change: "+8%",  up: true,  Icon: MdTrendingUp,  gradient: "from-amber-500 to-yellow-400" },
  { label: "Avg Order Value",       value: "TSH 18,871",    change: "+4%",  up: true,  Icon: MdBarChart,    gradient: "from-yellow-500 to-orange-400" },
  { label: "Low Stock Items",       value: "4",             change: "+2",   up: false, Icon: MdInventory2,  gradient: "from-red-500 to-orange-400"    },
];

/* Top selling items mock */
const topItems = [
  { name: "Mangoes",      revenue: 840000, orders: 32, pct: 92 },
  { name: "Tomatoes",     revenue: 630000, orders: 28, pct: 75 },
  { name: "Oranges",      revenue: 480000, orders: 24, pct: 60 },
  { name: "Strawberries", revenue: 320000, orders: 16, pct: 42 },
  { name: "Carrots",      revenue: 270000, orders: 24, pct: 35 },
];

/* Monthly revenue mock for mini bar chart */
const monthlyRevenue = [
  { month: "Jan", value: 980000 },
  { month: "Feb", value: 1100000 },
  { month: "Mar", value: 1250000 },
  { month: "Apr", value: 1050000 },
  { month: "May", value: 1380000 },
  { month: "Jun", value: 2340000 },
];

const typeMeta: Record<ReportType, { color: string; Icon: React.ElementType }> = {
  Sales:     { color: "bg-orange-100 text-orange-700", Icon: MdTrendingUp  },
  Revenue:   { color: "bg-amber-100 text-amber-700",   Icon: MdAttachMoney },
  Inventory: { color: "bg-blue-100 text-blue-700",     Icon: MdInventory2  },
  Market:    { color: "bg-green-100 text-green-700",   Icon: MdStorefront  },
  Employees: { color: "bg-purple-100 text-purple-700", Icon: MdPeople      },
};

const periods: Period[]     = ["Daily", "Weekly", "Monthly", "Yearly"];
const reportTypes: ReportType[] = ["Sales", "Revenue", "Inventory", "Market", "Employees"];

const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value));

/* ────────────────────────────────────────────────────
   REPORT DETAIL MODAL
──────────────────────────────────────────────────── */
function ReportDetailModal({
  report, darkMode, onClose,
}: { report: ReportEntry; darkMode: boolean; onClose: () => void }) {
  const card    = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-100";
  const text    = darkMode ? "text-white" : "text-gray-800";
  const sub     = darkMode ? "text-gray-400" : "text-gray-500";
  const divider = darkMode ? "border-gray-700" : "border-orange-100";
  const meta    = typeMeta[report.type];
  const InfoRow = ({ label, val }: { label: string; val: string | number }) => (
    <div className={`flex items-center justify-between py-2.5 border-b ${divider} last:border-0`}>
      <span className={`text-xs font-semibold uppercase tracking-wide ${sub}`}>{label}</span>
      <span className={`text-sm font-medium ${text}`}>{val}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full max-w-md mx-4 rounded-2xl border shadow-2xl overflow-hidden ${card}`}>

        {/* Header */}
        <div className={`px-6 py-4 border-b ${divider} flex items-start justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.color}`}>
              <meta.Icon className="text-xl" />
            </div>
            <div>
              <p className={`text-sm font-bold leading-tight ${text}`}>{report.title}</p>
              <p className={`text-[11px] ${sub}`}>{report.dateRange}</p>
            </div>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-xl flex items-center justify-center ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-orange-50 text-gray-400"}`}>
            <MdClose />
          </button>
        </div>

        {/* Details */}
        <div className="px-6 py-4">
          <InfoRow label="Report ID"      val={report.id}            />
          <InfoRow label="Type"           val={report.type}          />
          <InfoRow label="Period"         val={report.period}        />
          <InfoRow label="Records"        val={report.records}       />
          <InfoRow label="Generated By"   val={report.generatedBy}   />
          <InfoRow label="Date Generated" val={report.dateGenerated} />
          <InfoRow label="Status"         val={report.status}        />
        </div>

        {/* Summary */}
        <div className="px-6 pb-4">
          <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${sub}`}>Summary</p>
          <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${darkMode ? "bg-gray-700 text-gray-300" : "bg-orange-50 text-gray-700"}`}>
            {report.summary}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 pb-5 flex gap-3 border-t ${divider} pt-4`}>
          <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-orange-200 text-gray-600 hover:bg-orange-50"}`}>
            Close
          </button>
          {report.status === "Ready" && (
            <button className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 flex items-center justify-center gap-2 shadow">
              <MdDownload /> Download
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   REPORTS PAGE
──────────────────────────────────────────────────── */
export default function ReportsPage() {
  const { darkMode } = useTheme();

  const [search,       setSearch]       = useState("");
  const [typeFilter,   setTypeFilter]   = useState<ReportType | "All">("All");
  const [periodFilter, setPeriodFilter] = useState<Period | "All">("All");
  const [activeReport, setActiveReport] = useState<ReportEntry | null>(null);

  /* ── Filter ───────────────────────────────────── */
  const filtered = initialReports.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
    const matchType   = typeFilter   === "All" || r.type   === typeFilter;
    const matchPeriod = periodFilter === "All" || r.period === periodFilter;
    return matchSearch && matchType && matchPeriod;
  });

  /* ── Theme ────────────────────────────────────── */
  const text    = darkMode ? "text-white"        : "text-gray-800";
  const subText = darkMode ? "text-gray-400"     : "text-gray-500";
  const cardBg  = darkMode ? "bg-gray-800"       : "bg-white";
  const border  = darkMode ? "border-gray-700"   : "border-orange-100";
  const inputBg = darkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
    : "bg-orange-50 border-orange-200 text-gray-700 placeholder-gray-400";
  const rowHov  = darkMode ? "hover:bg-gray-700" : "hover:bg-orange-50/40";
  const skelBg  = darkMode ? "bg-gray-700"       : "bg-orange-50";
  const thStyle = `text-xs uppercase tracking-wide font-semibold py-3 px-4 ${subText}`;
  const tdStyle = `py-3 px-4 text-sm ${text}`;

  return (
    <PageLayout pageTitle="Reports" activePage="reports">
      <section className="p-5 sm:p-7 space-y-6">

        {/* ── HEADING ───────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className={`text-2xl font-bold ${text}`}>Reports</h2>
            <p className={`text-sm mt-1 ${subText}`}>
              View and download sales, revenue, inventory and market reports.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${subText}`}>Last updated: Jul 5, 2025</span>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow">
              <MdDownload className="text-lg" /> Export All
            </button>
          </div>
        </div>


        {/* ── SUMMARY METRICS ───────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {summaryMetrics.map(({ label, value, change, up, Icon, gradient }) => (
            <div key={label} className={`${cardBg} rounded-2xl border ${border} p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow`}>
                <Icon className="text-white text-lg" />
              </div>
              <div>
                <p className={`text-lg font-bold leading-none ${text}`}>{value}</p>
                <p className={`text-xs mt-1 ${subText}`}>{label}</p>
              </div>
              <div className="flex items-center gap-1">
                {up
                  ? <MdArrowUpward  className="text-green-500 text-sm flex-shrink-0" />
                  : <MdArrowDownward className="text-red-400 text-sm flex-shrink-0"  />}
                <span className={`text-xs font-semibold ${up ? "text-green-500" : "text-red-400"}`}>{change}</span>
                <span className={`text-[10px] ${subText}`}>vs last period</span>
              </div>
            </div>
          ))}
        </div>


        {/* ── ANALYTICS ROW ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Monthly Revenue Bar Chart */}
          <div className={`${cardBg} rounded-2xl border ${border} shadow-sm p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold ${text}`}>Monthly Revenue (2025)</h3>
              <span className={`text-xs ${subText}`}>TSH</span>
            </div>
            <div className="flex items-end gap-2 h-36">
              {monthlyRevenue.map(({ month, value }) => {
                const pct = Math.round((value / maxRevenue) * 100);
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <span className={`text-[10px] font-semibold ${text}`}>
                      {(value / 1000000).toFixed(1)}M
                    </span>
                    <div className="w-full flex items-end" style={{ height: "80px" }}>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-orange-500 to-amber-400 transition-all"
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className={`text-[10px] ${subText}`}>{month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Selling Items */}
          <div className={`${cardBg} rounded-2xl border ${border} shadow-sm p-5`}>
            <h3 className={`text-sm font-bold mb-4 ${text}`}>Top Selling Items (Jun 2025)</h3>
            <ul className="space-y-3">
              {topItems.map((item) => (
                <li key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${text}`}>{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${subText}`}>{item.orders} orders</span>
                      <span className="text-xs font-semibold text-orange-500">
                        TSH {item.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={`w-full h-1.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-orange-100"}`}>
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
        {/* ── END ANALYTICS ROW ─────────────────────── */}


        {/* ── SEARCH + FILTER BAR ───────────────────── */}
        <div className={`${cardBg} rounded-2xl border ${border} px-4 py-3 flex flex-wrap items-center gap-3`}>

          {/* Search */}
          <div className={`flex items-center gap-2 flex-1 min-w-[180px] px-3 py-2 rounded-xl border text-sm ${inputBg}`}>
            <MdSearch className="text-orange-400 text-base flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports by title, ID or type…"
              className="bg-transparent outline-none flex-1 placeholder-gray-400 text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <MdClose className="text-gray-400 hover:text-orange-500 text-sm" />
              </button>
            )}
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <MdFilterList className={`text-base ${subText}`} />
            {(["All", ...reportTypes] as const).map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  typeFilter === t
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow"
                    : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-orange-50 text-gray-600 hover:bg-orange-100"
                }`}
              >{t}</button>
            ))}
          </div>

          {/* Period filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <MdCalendarToday className={`text-base ${subText}`} />
            {(["All", ...periods] as const).map((p) => (
              <button key={p} onClick={() => setPeriodFilter(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  periodFilter === p
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow"
                    : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-orange-50 text-gray-600 hover:bg-orange-100"
                }`}
              >{p}</button>
            ))}
          </div>

          <span className={`text-xs ${subText}`}>
            {filtered.length} report{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>


        {/* ── REPORTS TABLE ─────────────────────────── */}
        <div className={`${cardBg} rounded-2xl border ${border} shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th className={`${thStyle} text-left`}>ID</th>
                  <th className={`${thStyle} text-left`}>Title</th>
                  <th className={`${thStyle} text-center`}>Type</th>
                  <th className={`${thStyle} text-center`}>Period</th>
                  <th className={`${thStyle} text-left`}>Date Range</th>
                  <th className={`${thStyle} text-right`}>Records</th>
                  <th className={`${thStyle} text-center`}>Status</th>
                  <th className={`${thStyle} text-center`}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={`py-12 text-center text-sm ${subText}`}>
                      No reports match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((report) => {
                    const meta = typeMeta[report.type];
                    return (
                      <tr
                        key={report.id}
                        className={`border-b ${border} ${rowHov} transition-colors cursor-pointer`}
                        onClick={() => setActiveReport(report)}
                      >
                        {/* ID */}
                        <td className={`${tdStyle} font-mono text-xs text-orange-500 font-semibold`}>
                          {report.id}
                        </td>

                        {/* Title */}
                        <td className={tdStyle}>
                          <p className="font-medium leading-tight">{report.title}</p>
                          <p className={`text-[11px] mt-0.5 ${subText}`}>By {report.generatedBy} · {report.dateGenerated}</p>
                        </td>

                        {/* Type badge */}
                        <td className={`${tdStyle} text-center`}>
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${meta.color}`}>
                            <meta.Icon className="text-xs" />
                            {report.type}
                          </span>
                        </td>

                        {/* Period badge */}
                        <td className={`${tdStyle} text-center`}>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                            {report.period}
                          </span>
                        </td>

                        {/* Date range */}
                        <td className={`${tdStyle} text-xs`}>{report.dateRange}</td>

                        {/* Records */}
                        <td className={`${tdStyle} text-right font-semibold`}>
                          {report.status === "Processing" ? "—" : report.records}
                        </td>

                        {/* Status */}
                        <td className={`${tdStyle} text-center`}>
                          {report.status === "Ready" ? (
                            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                              <MdCheckCircle className="text-xs" /> Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                              <MdWarning className="text-xs" /> Processing
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className={`${tdStyle} text-center`} onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setActiveReport(report)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors"
                              title="View Report"
                            >
                              <MdAssessment className="text-base" />
                            </button>
                            {report.status === "Ready" && (
                              <button
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
                                title="Download"
                              >
                                <MdDownload className="text-base" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {filtered.length > 0 && (
            <div className={`px-5 py-3 border-t ${border} flex items-center justify-between`}>
              <span className={`text-xs ${subText}`}>{filtered.length} reports shown</span>
              <span className={`text-xs ${subText}`}>
                Ready:{" "}
                <span className="text-green-500 font-semibold">
                  {filtered.filter((r) => r.status === "Ready").length}
                </span>
                {" "}· Processing:{" "}
                <span className="text-amber-500 font-semibold">
                  {filtered.filter((r) => r.status === "Processing").length}
                </span>
              </span>
            </div>
          )}
        </div>
        {/* ── END TABLE ─────────────────────────────── */}

      </section>

      {/* ── REPORT DETAIL MODAL ───────────────────── */}
      {activeReport && (
        <ReportDetailModal
          report={activeReport}
          darkMode={darkMode}
          onClose={() => setActiveReport(null)}
        />
      )}

    </PageLayout>
  );
}