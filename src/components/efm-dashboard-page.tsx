import { useState } from "react";
import { PieChart, BarChart } from "@mui/x-charts";
import { Renew, Settings, Maximize, ChevronSort, CaretLeft, CaretRight } from "@carbon/icons-react";
import { cn } from "./ui/utils";
import PageHeader from "./page-header";

interface EFMDashboardPageProps {
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
}

// ── data ──────────────────────────────────────────────────────────────────────

const statusWiseData = [
  { name: "RESOLVED",                value: 1010, color: "#2A53A0" },
  { name: "CLARIFICATION-RECEIVED",  value: 75,   color: "#4578C4" },
  { name: "CLARIFICATION-REQUESTED", value: 25,   color: "#6D9FE3" },
  { name: "RE-OPENED",               value: 14,   color: "#1A3870" },
  { name: "CREATED",                 value: 1,    color: "#A3BFE8" },
];

const SCENARIO_COLORS = [
  "#0043CE","#198038","#F1C21B","#DA1E28","#8A3FFC",
  "#00539A","#009D9A","#FF832B","#6929C4","#007D79",
  "#D02670","#0072C3","#A56EFF","#24A148","#E56B1F",
];

const scenarioWiseData = [
  { name: "S1",  value: 4 },  { name: "S2",  value: 2 },
  { name: "S3",  value: 6 },  { name: "S4",  value: 1 },
  { name: "S5",  value: 5 },  { name: "S6",  value: 3 },
  { name: "S7",  value: 2 },  { name: "S8",  value: 7 },
  { name: "S9",  value: 4 },  { name: "S10", value: 1 },
  { name: "S11", value: 3 },  { name: "S12", value: 5 },
  { name: "S13", value: 2 },  { name: "S14", value: 6 },
  { name: "S15", value: 3 },
].map((d, i) => ({ ...d, color: SCENARIO_COLORS[i] }));

const latestAlertsToday = [
  {
    entityId: "A_F_000000916",
    alertId: "RDE-1845",
    entityName: "CUSTOMER",
    summary: "RDE-1845-1|000000916|CROS...",
    score: 650,
    status: "CREATED",
    created: "28",
  },
  {
    entityId: "P_F_567885432799",
    alertId: "EFM-7668",
    entityName: "PAYMENTCARD",
    summary: "EFM-7668-1|567885432799|FRD...",
    score: 600,
    status: "CREATED",
    created: "28",
  },
  {
    entityId: "C_F_000000916",
    alertId: "EFM-7666",
    entityName: "CUSTOMER",
    summary: "EFM-7666-2|000000916|INT...",
    score: 900,
    status: "CREATED",
    created: "28",
  },
  {
    entityId: "E_F_7676",
    alertId: "EFM-7667",
    entityName: "TERMINAL",
    summary: "EFM-7667-1|7676|DORMANT_T...",
    score: 700,
    status: "CREATED",
    created: "28",
  },
  {
    entityId: "A_F_0100001234513",
    alertId: "EFM-7665",
    entityName: "ACCOUNT",
    summary: "EFM-7665-9|0100001234513|AC...",
    score: 550,
    status: "CREATED",
    created: "28",
  },
  {
    entityId: "C_F_000000380",
    alertId: "AML-7750",
    entityName: "CUSTOMER",
    summary: "AML-7750-1|000000380|STRCT...",
    score: 480,
    status: "CREATED",
    created: "28",
  },
];

const bankOfKigaliAlerts = [
  {
    entityId: "A_F_000000916",
    alertId: "RDE-1845-1",
    entityName: "CUSTOMER",
    summary: "RDE-1845-1|000000916|CROS...",
    score: 650,
    status: "CREATED",
  },
  {
    entityId: "A_F_0100001234513",
    alertId: "EFM-7665-9",
    entityName: "ACCOUNT",
    summary: "EFM-7665-9|0100001234513|...",
    score: 550,
    status: "CREATED",
  },
  {
    entityId: "A_F_0100001234513",
    alertId: "EFM-7665-6",
    entityName: "ACCOUNT",
    summary: "EFM-7665-6|0100001234513|...",
    score: 500,
    status: "CREATED",
  },
  {
    entityId: "C_F_000000946",
    alertId: "RDE-1844-2",
    entityName: "CUSTOMER",
    summary: "RDE-1844-2|000000946|DFS_R...",
    score: 700,
    status: "CREATED",
  },
  {
    entityId: "C_F_absd4345",
    alertId: "RDE-1843-1",
    entityName: "CUSTOMER",
    summary: "RDE-1843-1|absd4345|DFS_R...",
    score: 700,
    status: "CREATED",
  },
  {
    entityId: "U_F_user112",
    alertId: "EFM-7664-1",
    entityName: "USER",
    summary: "EFM-7664-1|user112|ANOMALY...",
    score: 620,
    status: "CREATED",
  },
];

const latestEFMAlerts = [
  {
    entityId: "P_F_567885432799",
    alertId: "EFM-7668",
    entityName: "PAYMENTCARD",
    summary: "EFM-7668-1|56788|...",
    score: 600,
    status: "CREATED",
  },
  {
    entityId: "C_F_000000916",
    alertId: "EFM-7666",
    entityName: "CUSTOMER",
    summary: "EFM-7666-2|000000916|INT...",
    score: 900,
    status: "CREATED",
  },
  {
    entityId: "E_F_7676",
    alertId: "EFM-7667",
    entityName: "TERMINAL",
    summary: "EFM-7667-1|7676|DORMANT_T...",
    score: 700,
    status: "CREATED",
  },
  {
    entityId: "C_F_000000916",
    alertId: "EFM-7666",
    entityName: "CUSTOMER",
    summary: "EFM-7666-1|000000916|CEM...",
    score: 700,
    status: "CREATED",
  },
  {
    entityId: "A_F_0100001234513",
    alertId: "EFM-7665",
    entityName: "ACCOUNT",
    summary: "EFM-7665-9|0100001234...",
    score: 550,
    status: "CREATED",
  },
];

const latestDBBAlerts = [
  {
    entityId: "C_F_000000946",
    alertId: "RDE-1844",
    entityName: "CUSTOMER",
    summary: "RDE-1844-2|000000946|DFS...",
    score: 700,
    status: "CREATED",
  },
  {
    entityId: "C_F_000000946",
    alertId: "RDE-1844",
    entityName: "CUSTOMER",
    summary: "RDE-1844-1|000000946|DFS...",
    score: 700,
    status: "CREATED",
  },
  {
    entityId: "C_F_absd4345",
    alertId: "RDE-1843",
    entityName: "CUSTOMER",
    summary: "RDE-1843-2|lssd4545|DFS_R...",
    score: 700,
    status: "CREATED",
  },
  {
    entityId: "C_F_absd4345",
    alertId: "RDE-1843",
    entityName: "CUSTOMER",
    summary: "RDE-1843-1|lssd4545|DFS_R...",
    score: 700,
    status: "CREATED",
  },
  {
    entityId: "C_F_000000808",
    alertId: "RDE-1842",
    entityName: "CUSTOMER",
    summary: "RDE-1842-2|000000808|DFS...",
    score: 700,
    status: "CREATED",
  },
];

const latestRDAAlerts = [
  {
    entityId: "C_F_000000916",
    alertId: "RDE-1845",
    entityName: "CUSTOMER",
    summary: "RDE-1845-1|000000916|CROS...",
    score: 650,
    status: "CREATED",
  },
  {
    entityId: "C_F_000000946",
    alertId: "RDE-1844",
    entityName: "CUSTOMER",
    summary: "RDE-1844-2|000000946|DFS...",
    score: 700,
    status: "CREATED",
  },
  {
    entityId: "C_F_000000946",
    alertId: "RDE-1844",
    entityName: "CUSTOMER",
    summary: "RDE-1844-1|000000946|DFS...",
    score: 700,
    status: "CREATED",
  },
  {
    entityId: "C_F_absd4345",
    alertId: "RDE-1843",
    entityName: "CUSTOMER",
    summary: "RDE-1843-2|lssd4545|DFS_R...",
    score: 700,
    status: "CREATED",
  },
  {
    entityId: "C_F_absd4345",
    alertId: "RDE-1843",
    entityName: "CUSTOMER",
    summary: "RDE-1843-1|lssd4545|DFS_R...",
    score: 700,
    status: "CREATED",
  },
];

const latestTMAlerts = [
  {
    entityId: "A_F_0100001234513",
    alertId: "TM-626",
    entityName: "ACCOUNT",
    summary: "TM-626-1|0100001234513|AC...",
    score: 500,
    status: "CREATED",
  },
  {
    entityId: "A_F_0100001234513",
    alertId: "TM-625",
    entityName: "ACCOUNT",
    summary: "TM-625-1|0100001234513|AC...",
    score: 500,
    status: "CREATED",
  },
  {
    entityId: "A_F_0100001234513",
    alertId: "TM-624",
    entityName: "ACCOUNT",
    summary: "TM-624-1|0100001234513|AC...",
    score: 500,
    status: "CREATED",
  },
  {
    entityId: "A_F_1004004877411",
    alertId: "TM-623",
    entityName: "ACCOUNT",
    summary: "TM-623-1|1004004877411|AC...",
    score: 500,
    status: "CREATED",
  },
  {
    entityId: "A_F_1004007S887",
    alertId: "TM-622",
    entityName: "ACCOUNT",
    summary: "TM-622-1|1004007S887|ACCN...",
    score: 500,
    status: "CREATED",
  },
];

// ── small sub-components ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-block rounded px-2 py-0.5 text-xs font-medium text-[#161616] bg-[#E0E0E0]">
      {status}
    </span>
  );
}

function EntityIdBadge({ id }: { id: string }) {
  return (
    <span className="inline-block rounded px-2 py-1 text-xs font-medium text-white bg-[#6929C4] whitespace-nowrap">
      {id}
    </span>
  );
}

interface AlertRow {
  entityId: string;
  alertId: string;
  entityName: string;
  summary: string;
  score: number;
  status: string;
  created?: string;
}

function CdsHeader({ label }: { label: string }) {
  return (
    <th
      style={{ height: "48px", backgroundColor: "#E0E0E0", color: "#2A53A0", fontSize: "14px", fontWeight: 500 }}
      className="px-3 text-left whitespace-nowrap align-middle"
    >
      <div className="flex items-center gap-1">
        {label}
        <ChevronSort size={14} style={{ color: "#2A53A0" }} />
      </div>
    </th>
  );
}

function AlertTable({
  rows,
  showCreated = false,
}: {
  rows: AlertRow[];
  showCreated?: boolean;
}) {
  return (
    <div className="overflow-auto">
      <table className="w-full" style={{ tableLayout: "fixed", borderCollapse: "collapse" }}>
        <colgroup>
          <col style={{ width: showCreated ? "21%" : "23%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: showCreated ? "24%" : "28%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "12%" }} />
          {showCreated && <col style={{ width: "9%" }} />}
        </colgroup>
        <thead>
          <tr>
            <CdsHeader label="Alert Entity Id" />
            <CdsHeader label="Alert Id" />
            <CdsHeader label="Entity Name" />
            <CdsHeader label="Summary" />
            <CdsHeader label="Score" />
            <CdsHeader label="Status" />
            {showCreated && <CdsHeader label="Created" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              style={{ height: "46px" }}
              className="border-b border-[#E0E0E0] hover:bg-[#F5F8FF] transition-colors"
            >
              <td className="px-3 overflow-hidden align-middle">
                <EntityIdBadge id={row.entityId} />
              </td>
              <td className="px-3 overflow-hidden align-middle">
                <span className="text-[#2A53A0] text-sm font-medium block truncate">{row.alertId}</span>
              </td>
              <td className="px-3 overflow-hidden align-middle">
                <span className="block truncate text-sm text-[#161616]">{row.entityName}</span>
              </td>
              <td className="px-3 overflow-hidden align-middle">
                <span className="block truncate text-sm text-[#525252]">{row.summary}</span>
              </td>
              <td className="px-3 overflow-hidden align-middle">
                <span className="text-sm text-[#161616]">{row.score}</span>
              </td>
              <td className="px-3 align-middle">
                <StatusBadge status={row.status} />
              </td>
              {showCreated && (
                <td className="px-3 overflow-hidden align-middle">
                  <span className="text-sm text-[#525252]">{row.created}</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniPagination({
  current,
  total,
  pageSize,
  totalPages,
}: {
  current: number;
  total: number;
  pageSize: number;
  totalPages: number;
}) {
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <div
      style={{ height: "48px", backgroundColor: "#ffffff" }}
      className="flex-shrink-0 flex items-stretch border-t border-[#E0E0E0] text-sm text-[#525252]"
    >
      <span className="flex items-center px-3 whitespace-nowrap text-xs">
        {start}–{end} of {total} items
      </span>
      <div className="flex-1" />
      <div className="w-px bg-[#E0E0E0]" />
      <button
        disabled={current === 1}
        className="w-12 flex items-center justify-center text-[#525252] hover:bg-[#f4f4f4] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <CaretLeft size={16} />
      </button>
      <div className="w-px bg-[#E0E0E0]" />
      <button
        disabled={current === totalPages}
        className="w-12 flex items-center justify-center text-[#525252] hover:bg-[#f4f4f4] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <CaretRight size={16} />
      </button>
    </div>
  );
}

function DataCard({
  title,
  showingStart,
  showingEnd,
  total,
  totalPages,
  children,
}: {
  title: string;
  showingStart: number;
  showingEnd: number;
  total: number;
  totalPages: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        <div className="flex items-center gap-2 text-gray-400">
          <button className="hover:text-gray-600 transition-colors">
            <Renew size={16} />
          </button>
          <button className="hover:text-gray-600 transition-colors">
            <Maximize size={16} />
          </button>
        </div>
      </div>
      {children}
      <MiniPagination
        current={1}
        total={total}
        pageSize={showingEnd - showingStart + 1}
        totalPages={totalPages}
      />
    </div>
  );
}

// ── custom legend for pie chart ───────────────────────────────────────────────

const renderCustomLegend = () => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
    {statusWiseData.map((entry) => (
      <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
        <span
          className="inline-block w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <span>
          {entry.name}: {entry.value}
        </span>
      </div>
    ))}
  </div>
);

// ── main component ────────────────────────────────────────────────────────────

export function EFMDashboardPage({
  breadcrumbs,
  onBreadcrumbNavigate,
}: EFMDashboardPageProps) {
  const [refreshInterval, setRefreshInterval] = useState<string>("Off");
  const [scenarioCount, setScenarioCount] = useState<number>(15);

  const total = statusWiseData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col h-full bg-white">
      <PageHeader
        title="Dashboard"
        breadcrumbs={breadcrumbs}
        onBreadcrumbNavigate={onBreadcrumbNavigate}
      />

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Controls row */}
        <div className="flex items-center gap-2 mb-4">
          {/* Left: heading */}
          <span className="font-medium whitespace-nowrap" style={{ fontSize: "21px", color: "#525252" }}>
            EFM Dashboard
          </span>

          <div className="flex-1" />

          {/* Right: controls */}
          <div className="h-[46px] flex items-center gap-1 border border-gray-300 px-3 bg-white" style={{ borderRadius: "8px" }}>
            <span className="text-gray-600 text-sm">Refresh in</span>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="border-none outline-none bg-transparent text-gray-800 text-sm ml-1"
            >
              <option value="Off">Off</option>
              <option value="1">1 min</option>
              <option value="5">5 mins</option>
              <option value="10">10 mins</option>
            </select>
            <span className="text-gray-600 text-sm ml-1">mins</span>
          </div>
          <button
            className="h-[46px] px-4 text-sm border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 whitespace-nowrap"
            style={{ borderRadius: "8px" }}
          >
            Manage Dashboards
          </button>
          <button
            className="h-[46px] w-[46px] flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 text-gray-600"
            style={{ borderRadius: "8px" }}
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Status wise Alert Allocation – MUI donut */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Status wise Alert Allocation
            </h2>
            <div className="relative" style={{ height: 220 }}>
              <PieChart
                series={[{
                  data: statusWiseData.map((d, i) => ({
                    id: i,
                    value: d.value,
                    label: d.name,
                    color: d.color,
                  })),
                  innerRadius: 60,
                  outerRadius: 90,
                  paddingAngle: 2,
                  cornerRadius: 2,
                  cx: "50%",
                  cy: "50%",
                }]}
                height={220}
                slotProps={{ legend: { hidden: true } }}
                tooltip={{ trigger: "item" }}
              />
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
            </div>
            {renderCustomLegend()}
          </div>

          {/* Scenario wise Alert Allocation – MUI bar */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            {/* Panel header with filter */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">
                Scenario wise Alert Allocation
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#525252] whitespace-nowrap">Show scenarios:</span>
                <select
                  value={scenarioCount}
                  onChange={(e) => setScenarioCount(Number(e.target.value))}
                  className="text-xs border border-[#C6C6C6] rounded px-2 py-1 text-[#161616] outline-none bg-white cursor-pointer hover:bg-gray-50"
                >
                  <option value={5}>Top 5</option>
                  <option value={10}>Top 10</option>
                  <option value={15}>All 15</option>
                </select>
              </div>
            </div>
            <BarChart
              series={[{
                data: scenarioWiseData.slice(0, scenarioCount).map(d => d.value),
                label: "Alert Count",
                color: "#2A53A0",
              }]}
              xAxis={[{
                data: scenarioWiseData.slice(0, scenarioCount).map(d => d.name),
                scaleType: "band",
                tickLabelStyle: { fontSize: 10 },
                label: "Scenario Name",
                labelStyle: { fontSize: 11, fontWeight: 500, fill: "#525252" },
              }]}
              yAxis={[{
                tickLabelStyle: { fontSize: 10 },
                label: "Alert Count",
                labelStyle: { fontSize: 11, fontWeight: 500, fill: "#525252" },
              }]}
              barLabel="value"
              height={280}
              margin={{ top: 20, right: 10, left: 40, bottom: 40 }}
              slotProps={{
                legend: { hidden: true },
                barLabel: {
                  style: { fontSize: 11, fontWeight: 600, fill: "#ffffff" },
                },
              }}
              borderRadius={3}
            />
          </div>
        </div>

        {/* Latest Alerts for Today */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800">
              Latest Alerts for Today
            </span>
            <div className="flex items-center gap-2 text-gray-400">
              <button className="hover:text-gray-600 transition-colors">
                <Renew size={16} />
              </button>
              <button className="hover:text-gray-600 transition-colors">
                <Maximize size={16} />
              </button>
            </div>
          </div>
          <AlertTable rows={latestAlertsToday} showCreated />
          <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Showing 1 to 6 of 6 entries
          </div>
        </div>

        {/* Bank of Kigali Alerts */}
        <div className="mb-4">
          <DataCard
            title="Bank of Kigali Alerts"
            showingStart={1}
            showingEnd={6}
            total={71}
            totalPages={12}
          >
            <AlertTable rows={bankOfKigaliAlerts} />
          </DataCard>
        </div>

        {/* 2-column grid for remaining tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Latest EFM Alerts */}
          <DataCard
            title="Latest EFM Alerts"
            showingStart={1}
            showingEnd={5}
            total={792}
            totalPages={159}
          >
            <AlertTable rows={latestEFMAlerts} />
          </DataCard>

          {/* Latest Device and Behavioural Biometric Alerts */}
          <DataCard
            title="Latest Device and Behavioural Biometric Alerts"
            showingStart={1}
            showingEnd={5}
            total={20}
            totalPages={4}
          >
            <AlertTable rows={latestDBBAlerts} />
          </DataCard>

          {/* Latest RDA Alerts */}
          <DataCard
            title="Latest RDA Alerts"
            showingStart={1}
            showingEnd={5}
            total={65}
            totalPages={13}
          >
            <AlertTable rows={latestRDAAlerts} />
          </DataCard>

          {/* Latest Transaction Monitoring Alerts */}
          <DataCard
            title="Latest Transaction Monitoring Alerts"
            showingStart={1}
            showingEnd={5}
            total={34}
            totalPages={7}
          >
            <AlertTable rows={latestTMAlerts} />
          </DataCard>
        </div>
      </div>
    </div>
  );
}

export default EFMDashboardPage;
