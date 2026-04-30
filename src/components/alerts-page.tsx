import { useState } from "react";
import {
  ChevronSort,
  Renew,
  Filter,
  Tools,
  CaretLeft,
  CaretRight,
} from "@carbon/icons-react";
import { cn } from "./ui/utils";
import PageHeader from "./page-header";

interface AlertsPageProps {
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
}

type AlertStatus =
  | "CREATED"
  | "CLOSED"
  | "CLARIFICATION-RECEIVED"
  | "RESOLVED"
  | "RE-OPENED"
  | "CLARIFICATION-REQUESTED";

interface AlertRow {
  entityId: string;
  alertId: string;
  entityName: string;
  summary: string;
  score: number;
  status: AlertStatus;
  createdOn: string;
  receivedAt: string;
  caseId: string;
}

const ML_PATTERNS: [string, string, string][] = [
  ["#DA1E28", "#F1C21B", "#198038"],
  ["#DA1E28", "#198038", "#F1C21B"],
  ["#F1C21B", "#198038", "#DA1E28"],
  ["#198038", "#DA1E28", "#F1C21B"],
  ["#F1C21B", "#DA1E28", "#198038"],
];

const alertsData: AlertRow[] = [
  { entityId: "A_F_0100001234513", alertId: "CB-373-1", entityName: "ACCOUNT", summary: "CB-373-1|0100001234513|AC ...", score: 500, status: "CREATED", createdOn: "28 Apr 2026 11:53:23", receivedAt: "28 Apr 2026 11:54:42", caseId: "CB-373" },
  { entityId: "A_F_0100001234513", alertId: "CB-372-1", entityName: "ACCOUNT", summary: "CB-372-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "24 Apr 2026 15:07:08", receivedAt: "24 Apr 2026 15:08:04", caseId: "CB-372" },
  { entityId: "A_F_0100001234513", alertId: "CB-371-1", entityName: "ACCOUNT", summary: "CB-371-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "24 Apr 2026 14:47:34", receivedAt: "24 Apr 2026 14:48:39", caseId: "CB-371" },
  { entityId: "A_F_1004004877411", alertId: "CB-370-1", entityName: "ACCOUNT", summary: "CB-370-1|1004004877411|AC ...", score: 500, status: "CLOSED", createdOn: "24 Apr 2026 13:47:32", receivedAt: "24 Apr 2026 13:50:14", caseId: "CB-370" },
  { entityId: "A_F_0100001234516", alertId: "CB-368-1", entityName: "ACCOUNT", summary: "CB-368-1|0100001234516|AC ...", score: 500, status: "CLOSED", createdOn: "24 Apr 2026 13:47:31", receivedAt: "24 Apr 2026 13:49:18", caseId: "CB-368" },
  { entityId: "A_F_1004075887", alertId: "CB-369-1", entityName: "ACCOUNT", summary: "CB-369-1|1004075887|ACCT ...", score: 500, status: "CLOSED", createdOn: "24 Apr 2026 13:47:35", receivedAt: "24 Apr 2026 13:49:30", caseId: "CB-369" },
  { entityId: "A_F_0100001234513", alertId: "CB-367-1", entityName: "ACCOUNT", summary: "CB-367-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "22 Apr 2026 16:07:02", receivedAt: "22 Apr 2026 16:07:26", caseId: "CB-367" },
  { entityId: "A_F_0100001234513", alertId: "CB-366-1", entityName: "ACCOUNT", summary: "CB-366-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "22 Apr 2026 14:27:55", receivedAt: "22 Apr 2026 14:29:02", caseId: "CB-366" },
  { entityId: "A_F_0100001234513", alertId: "CB-364-1", entityName: "ACCOUNT", summary: "CB-364-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "21 Apr 2026 13:20:56", receivedAt: "21 Apr 2026 13:40:26", caseId: "CB-364" },
  { entityId: "A_F_0100001234513", alertId: "CB-365-1", entityName: "ACCOUNT", summary: "CB-365-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "22 Apr 2026 13:50:24", receivedAt: "22 Apr 2026 13:50:31", caseId: "CB-365" },
  { entityId: "A_F_0100001234513", alertId: "CB-363-1", entityName: "ACCOUNT", summary: "CB-363-1|0100001234513|AC ...", score: 500, status: "CLARIFICATION-RECEIVED", createdOn: "08 Apr 2026 14:27:51", receivedAt: "08 Apr 2026 14:28:09", caseId: "CB-363" },
  { entityId: "A_F_0100001234513", alertId: "CB-362-1", entityName: "ACCOUNT", summary: "CB-362-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "08 Apr 2026 02:33:09", receivedAt: "08 Apr 2026 02:33:41", caseId: "CB-362" },
  { entityId: "A_F_0100001234513", alertId: "CB-360-1", entityName: "ACCOUNT", summary: "CB-360-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "07 Apr 2026 22:52:03", receivedAt: "07 Apr 2026 22:52:48", caseId: "CB-360" },
  { entityId: "A_F_0100001234513", alertId: "CB-361-1", entityName: "ACCOUNT", summary: "CB-361-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "08 Apr 2026 02:20:56", receivedAt: "08 Apr 2026 02:21:16", caseId: "CB-361" },
  { entityId: "A_F_0100001234513", alertId: "CB-358-1", entityName: "ACCOUNT", summary: "CB-358-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "07 Apr 2026 00:39:14", receivedAt: "07 Apr 2026 00:39:35", caseId: "CB-358" },
  { entityId: "A_F_0100001234513", alertId: "CB-359-1", entityName: "ACCOUNT", summary: "CB-359-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "07 Apr 2026 12:34:16", receivedAt: "07 Apr 2026 12:34:44", caseId: "CB-359" },
  { entityId: "A_F_0100001234513", alertId: "CB-354-1", entityName: "ACCOUNT", summary: "CB-354-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "06 Apr 2026 21:11:46", receivedAt: "06 Apr 2026 21:12:39", caseId: "CB-354" },
  { entityId: "A_F_0100001234513", alertId: "CB-353-1", entityName: "ACCOUNT", summary: "CB-353-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "06 Apr 2026 21:06:22", receivedAt: "06 Apr 2026 21:06:55", caseId: "CB-353" },
  { entityId: "A_F_0100001234513", alertId: "CB-352-1", entityName: "ACCOUNT", summary: "CB-352-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "06 Apr 2026 20:42:25", receivedAt: "06 Apr 2026 20:42:55", caseId: "CB-352" },
  { entityId: "A_F_0100001234513", alertId: "CB-351-1", entityName: "ACCOUNT", summary: "CB-351-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "06 Apr 2026 20:05:42", receivedAt: "06 Apr 2026 20:06:20", caseId: "CB-351" },
  { entityId: "A_F_0100001234513", alertId: "CB-350-2", entityName: "ACCOUNT", summary: "CB-350-2|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "06 Apr 2026 18:35:53", receivedAt: "06 Apr 2026 18:36:40", caseId: "CB-350" },
  { entityId: "A_F_0100001234513", alertId: "CB-350-1", entityName: "ACCOUNT", summary: "CB-350-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "06 Apr 2026 18:01:51", receivedAt: "06 Apr 2026 18:02:03", caseId: "CB-350" },
  { entityId: "A_F_0100001234513", alertId: "CB-356-1", entityName: "ACCOUNT", summary: "CB-356-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "06 Apr 2026 21:23:06", receivedAt: "06 Apr 2026 21:23:26", caseId: "CB-356" },
  { entityId: "A_F_0100001234513", alertId: "CB-355-1", entityName: "ACCOUNT", summary: "CB-355-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "06 Apr 2026 20:20:50", receivedAt: "06 Apr 2026 20:36:09", caseId: "CB-355" },
  { entityId: "A_F_0100001234513", alertId: "CB-357-1", entityName: "ACCOUNT", summary: "CB-357-1|0100001234513|AC ...", score: 500, status: "CLOSED", createdOn: "06 Apr 2026 21:23:06", receivedAt: "06 Apr 2026 21:23:26", caseId: "CB-357" },
];

const TOTAL_ALERTS = 32;
const TOTAL_PAGES = 2;
const CREATED_COUNT = alertsData.filter((a) => a.status === "CREATED").length;
const CLOSED_COUNT = alertsData.filter((a) => a.status === "CLOSED").length;
const CLARIFICATION_COUNT = alertsData.filter(
  (a) => a.status === "CLARIFICATION-RECEIVED" || a.status === "CLARIFICATION-REQUESTED"
).length;

function SortableHeader({ label }: { label: string }) {
  return (
    <th
      style={{ height: "48px", backgroundColor: "#E0E0E0", color: "#2A53A0", fontSize: "16px", fontWeight: 500 }}
      className="px-4 text-left whitespace-nowrap align-middle"
    >
      <div className="flex items-center gap-1.5">
        {label}
        <ChevronSort size={16} style={{ color: "#2A53A0" }} />
      </div>
    </th>
  );
}


function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const styles: Record<AlertStatus, string> = {
    CREATED: "text-[#198038] bg-[#DEFBE6]",
    CLOSED: "text-[#525252] bg-[#E0E0E0]",
    "CLARIFICATION-RECEIVED": "text-white bg-[#0072C3]",
    RESOLVED: "text-white bg-[#0043CE]",
    "RE-OPENED": "text-white bg-[#DA1E28]",
    "CLARIFICATION-REQUESTED": "text-[#161616] bg-[#F1C21B]",
  };
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}

function EntityIdCell({ entityId }: { entityId: string }) {
  return (
    <div className="inline-flex flex-col items-start">
      <span className="inline-block rounded px-2 py-1 text-xs font-medium text-white bg-[#6929C4] whitespace-nowrap leading-tight">
        {entityId}
      </span>
      <span className="text-[10px] text-gray-400 mt-0.5 pl-0.5">Entity Details</span>
    </div>
  );
}

function MLIndicator({ rowIndex }: { rowIndex: number }) {
  const colors = ML_PATTERNS[rowIndex % ML_PATTERNS.length];
  return (
    <div className="flex items-center gap-1">
      {colors.map((color, i) => (
        <span
          key={i}
          className="w-3 h-3 rounded-full inline-block flex-shrink-0"
          style={{ backgroundColor: color }}
          title={color === "#DA1E28" ? "High" : color === "#F1C21B" ? "Medium" : "Low"}
        />
      ))}
    </div>
  );
}

export function AlertsPage({ breadcrumbs, onBreadcrumbNavigate }: AlertsPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [view, setView] = useState<"list" | "details">("list");
  const [refreshMins, setRefreshMins] = useState(5);

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, TOTAL_ALERTS);

  return (
    <div className="flex flex-col h-full bg-white">
      <PageHeader title="Alerts" breadcrumbs={breadcrumbs} onBreadcrumbNavigate={onBreadcrumbNavigate} />

      <div className="flex-1 overflow-hidden p-4 flex flex-col gap-3 bg-white">

        {/* ── Title + badges + toolbar row (OUTSIDE the table card) ── */}
        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
          {/* Left: title + divider + count badges */}
          <span className="text-sm font-bold text-[#161616] whitespace-nowrap">Alert List</span>
          <div className="w-px h-5 bg-gray-400 flex-shrink-0" />
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#525252] text-white whitespace-nowrap">
            Total : {TOTAL_ALERTS}
          </span>
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#DEFBE6] text-[#198038] whitespace-nowrap">
            Created : {CREATED_COUNT}
          </span>
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E0E0E0] text-[#525252] whitespace-nowrap">
            Closed : {CLOSED_COUNT}
          </span>
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#D0E2FF] text-[#0043CE] whitespace-nowrap">
            Clarification : {CLARIFICATION_COUNT}
          </span>

          <div className="flex-1" />

          {/* Right: toolbar controls matching reference */}
          <button className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 text-[#161616] whitespace-nowrap">
            Save Filter
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 text-[#525252]" title="Filter">
            <Filter size={16} />
          </button>
          <div className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded bg-white text-xs text-[#161616] whitespace-nowrap">
            <span>Refresh in</span>
            <select
              value={refreshMins}
              onChange={(e) => setRefreshMins(Number(e.target.value))}
              className="border-none outline-none bg-transparent text-xs text-[#161616] cursor-pointer px-0.5"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={30}>30</option>
            </select>
            <span>mins</span>
          </div>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 text-[#525252]" title="Refresh">
            <Renew size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 text-[#525252]" title="Settings">
            <Tools size={16} />
          </button>
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                view === "list" ? "bg-[#E0E0E0] text-[#161616]" : "bg-white text-[#525252] hover:bg-gray-50"
              )}
            >
              List View
            </button>
            <button
              onClick={() => setView("details")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium border-l border-gray-300 transition-colors whitespace-nowrap",
                view === "details" ? "bg-[#E0E0E0] text-[#161616]" : "bg-white text-[#525252] hover:bg-gray-50"
              )}
            >
              Details View
            </button>
          </div>
        </div>

        {/* ── Carbon DS data table card ── */}
        <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">

          {/* Scrollable table body — thead is sticky inside */}
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full" style={{ tableLayout: "fixed", borderCollapse: "collapse" }}>
              <colgroup>
                <col style={{ width: "14%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "6%" }} />
              </colgroup>
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr>
                  <SortableHeader label="Alert Entity Id" />
                  <SortableHeader label="Alert Id" />
                  <SortableHeader label="Entity Name" />
                  <SortableHeader label="Summary" />
                  <SortableHeader label="Score" />
                  <SortableHeader label="Alert Status" />
                  <SortableHeader label="Created On" />
                  <SortableHeader label="Received At" />
                  <SortableHeader label="Case Id" />
                  <th
                    style={{ height: "48px", backgroundColor: "#E0E0E0", color: "#2A53A0", fontSize: "16px", fontWeight: 500 }}
                    className="px-4 text-left align-middle"
                  >
                    ML
                  </th>
                </tr>
              </thead>
              <tbody>
                {alertsData.map((row, idx) => (
                  <tr
                    key={row.alertId + idx}
                    style={{ height: "46px" }}
                    className="border-b border-[#E0E0E0] hover:bg-[#F5F8FF] transition-colors"
                  >
                    <td className="px-4 overflow-hidden align-middle">
                      <EntityIdCell entityId={row.entityId} />
                    </td>
                    <td className="px-4 overflow-hidden align-middle">
                      <span className="text-[#2A53A0] text-sm font-medium block truncate">{row.alertId}</span>
                    </td>
                    <td className="px-4 overflow-hidden align-middle">
                      <span className="inline-block rounded px-1.5 py-0.5 text-xs text-gray-700 bg-[#E0E0E0] truncate max-w-full">
                        {row.entityName}
                      </span>
                    </td>
                    <td className="px-4 overflow-hidden align-middle">
                      <span className="block truncate text-sm text-[#525252]">{row.summary}</span>
                    </td>
                    <td className="px-4 text-sm text-[#525252] text-center align-middle">{row.score}</td>
                    <td className="px-4 overflow-hidden align-middle">
                      <AlertStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 overflow-hidden align-middle">
                      <span className="block truncate text-xs text-[#525252]">{row.createdOn}</span>
                    </td>
                    <td className="px-4 overflow-hidden align-middle">
                      <span className="block truncate text-xs text-[#525252]">{row.receivedAt}</span>
                    </td>
                    <td className="px-4 overflow-hidden align-middle">
                      <span className="text-[#2A53A0] text-sm font-medium block truncate">{row.caseId}</span>
                    </td>
                    <td className="px-4 align-middle">
                      <MLIndicator rowIndex={idx} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Data Table Footer — 48px white ── */}
          <div
            style={{ height: "48px", backgroundColor: "#ffffff" }}
            className="flex-shrink-0 flex items-stretch border-t border-[#E0E0E0] text-sm text-[#525252]"
          >
            {/* "Items per page:" label */}
            <span className="flex items-center px-4 whitespace-nowrap">Items per page:</span>

            {/* Divider */}
            <div className="w-px bg-[#E0E0E0]" />

            {/* Page-size select */}
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="px-4 bg-white text-sm text-[#161616] border-none outline-none cursor-pointer hover:bg-[#f4f4f4]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            {/* Divider */}
            <div className="w-px bg-[#E0E0E0]" />

            {/* Range text — fills remaining space */}
            <span className="flex items-center flex-1 px-4 whitespace-nowrap">
              {start}–{end} of {TOTAL_ALERTS} items
            </span>

            {/* Page select + "of N pages" */}
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="px-4 bg-white text-sm text-[#161616] border-none outline-none cursor-pointer hover:bg-[#f4f4f4]"
            >
              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="flex items-center pr-4 whitespace-nowrap">of {TOTAL_PAGES} pages</span>

            {/* Divider */}
            <div className="w-px bg-[#E0E0E0]" />

            {/* Prev arrow */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-12 flex items-center justify-center text-[#525252] hover:bg-[#f4f4f4] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <CaretLeft size={16} />
            </button>

            {/* Divider */}
            <div className="w-px bg-[#E0E0E0]" />

            {/* Next arrow */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              disabled={currentPage === TOTAL_PAGES}
              className="w-12 flex items-center justify-center text-[#525252] hover:bg-[#f4f4f4] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <CaretRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AlertsPage;
