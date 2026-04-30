import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronSort,
  Upload,
  Launch,
  ArrowLeft,
  Edit,
  CaretLeft,
  CaretRight,
  Document,
  List,
  Activity,
} from "@carbon/icons-react";
import { cn } from "./ui/utils";
import {
  casesData,
  CaseRow,
  intelligenceData,
  accountsData,
  entityCasesData,
} from "./cases-page";

interface CaseDetailPageProps {
  caseId: string;
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
  onAlertClick?: (alertId: string) => void;
}

// ── helpers ────────────────────────────────────────────────────────────────────

function CaseStatusBadge({ status }: { status: string }) {
  const isCreated = status === "CREATED";
  const isReopened = status === "REOPENED";
  const bg = isCreated ? "#DCFCE7" : isReopened ? "#D0E2FF" : "#F4F4F4";
  const color = isCreated ? "#16A34A" : isReopened ? "#0043CE" : "#6F6F6F";
  return (
    <span
      className="inline-block rounded-full px-4 py-1 text-sm font-medium whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      {status}
    </span>
  );
}

function DetailField({
  label,
  value,
  link,
}: {
  label: string;
  value?: string;
  link?: boolean;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      <span style={{ fontSize: 12, color: "#6F6F6F", fontWeight: 400, lineHeight: "16px" }}>
        {label}
      </span>
      {link ? (
        <span
          style={{ fontSize: 14, color: "#2A53A0", fontWeight: 400, lineHeight: "20px" }}
          className="cursor-pointer hover:underline"
        >
          {value ?? "—"}
        </span>
      ) : (
        <span style={{ fontSize: 14, color: "#161616", fontWeight: 400, lineHeight: "20px" }}>
          {value ?? "—"}
        </span>
      )}
    </div>
  );
}

function AlertEntityBadge({ id }: { id: string }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#EDE7FF] text-[#6929C4] whitespace-nowrap">
      {id}
    </span>
  );
}

function AlertIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex flex-col items-center gap-0.5">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="#525252">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2zM6.5 5h3a.5.5 0 0 1 .5.5v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a.5.5 0 0 1 .5-.5zm0 1v.5a1 1 0 0 0 2 0V6h-2zM8 9.5a2.5 2.5 0 0 1 2.5 2.5H5.5A2.5 2.5 0 0 1 8 9.5z" />
        </svg>
        <span className="w-2.5 h-2.5 rounded-full bg-[#DA1E28] inline-block" />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="#525252">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2zM6.5 5h3a.5.5 0 0 1 .5.5v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a.5.5 0 0 1 .5-.5zm0 1v.5a1 1 0 0 0 2 0V6h-2zM8 9.5a2.5 2.5 0 0 1 2.5 2.5H5.5A2.5 2.5 0 0 1 8 9.5z" />
        </svg>
        <span className="w-2.5 h-2.5 rounded-full bg-[#DA1E28] inline-block" />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="#525252">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2zM6.5 5h3a.5.5 0 0 1 .5.5v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a.5.5 0 0 1 .5-.5zm0 1v.5a1 1 0 0 0 2 0V6h-2zM8 9.5a2.5 2.5 0 0 1 2.5 2.5H5.5A2.5 2.5 0 0 1 8 9.5z" />
        </svg>
        <span className="w-2.5 h-2.5 rounded-full bg-[#F1C21B] inline-block" />
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function CaseDetailPage({
  caseId,
  breadcrumbs,
  onBreadcrumbNavigate,
  onAlertClick,
}: CaseDetailPageProps) {
  const caseData: CaseRow | undefined = casesData.find(
    (c) => c.caseId === caseId
  );

  const caseIdx = casesData.findIndex((c) => c.caseId === caseId);
  const totalCases = casesData.length;

  const [caseDetailsOpen, setCaseDetailsOpen] = useState(true);
  const [alertListOpen, setAlertListOpen] = useState(true);
  const [activityOpen, setActivityOpen] = useState(true);
  const [detailTab, setDetailTab] = useState<"case" | "entity">("case");
  const [entityTab, setEntityTab] = useState<"Intelligence" | "Accounts" | "Cases">("Intelligence");
  const [activityTab, setActivityTab] = useState<"Comments" | "Attachments" | "Audit History" | "Inbox Response">("Comments");
  const [commentText, setCommentText] = useState("");

  const goBack = () => onBreadcrumbNavigate("home-cases");
  const goToPrev = () => {
    if (caseIdx > 0) onBreadcrumbNavigate(`case-detail-${casesData[caseIdx - 1].caseId}`);
  };
  const goToNext = () => {
    if (caseIdx < totalCases - 1) onBreadcrumbNavigate(`case-detail-${casesData[caseIdx + 1].caseId}`);
  };

  if (!caseData) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 flex items-center justify-center text-sm text-[#525252]">
          Case not found: {caseId}
        </div>
      </div>
    );
  }

  const alerts = caseData.alertList ?? [];
  const avatarInitials = caseId.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "CA";

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── Custom two-row top header ── */}
      <div className="flex-shrink-0 bg-white border-b border-[#E0E0E0] shadow-sm">

        {/* Row 1: Back | Title | Breadcrumb */}
        <div className="relative flex items-center px-5" style={{ height: 52 }}>
          {/* Left: Back */}
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm text-[#525252] hover:text-[#161616] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {/* Center: Page title */}
          <span className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-[#161616] pointer-events-none whitespace-nowrap">
            View Case Details
          </span>

          {/* Right: Breadcrumb */}
          <div className="ml-auto flex items-center gap-2 text-sm font-normal">
            <button
              onClick={() => onBreadcrumbNavigate("home-cases")}
              className="text-[#2A53A0] hover:text-[#1e3a70] transition-colors"
            >
              Cases
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-[#161616]">Case Details</span>
          </div>
        </div>

        {/* Row 2: Entity info | Edit + Nav */}
        <div className="flex items-center px-5 border-t border-[#E0E0E0]" style={{ height: 60 }}>
          {/* Left: Avatar + Case Id + Status */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: "#2A53A0" }}
            >
              {avatarInitials}
            </div>

            {/* Case Id */}
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6F6F6F] font-medium uppercase tracking-wide">Case Id</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-sm font-semibold text-[#161616]">{caseId}</span>
                <ChevronDown size={14} className="text-[#525252]" />
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-[#E0E0E0]" />

            {/* Status */}
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6F6F6F] font-medium uppercase tracking-wide">Status</span>
              <div className="mt-0.5">
                <span className={cn(
                  "inline-block px-3 py-0.5 rounded-full text-xs font-semibold",
                  caseData.caseStatus === "CREATED"
                    ? "bg-[#DEFBE6] text-[#198038]"
                    : "bg-[#E0E0E0] text-[#525252]"
                )}>
                  {caseData.caseStatus === "CREATED" ? "Active" : caseData.caseStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Right: navigation */}
          <div className="flex items-center gap-3">

            {/* Prev */}
            <button
              onClick={goToPrev}
              disabled={caseIdx <= 0}
              className="w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded bg-white hover:bg-[#F4F4F4] text-[#525252] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <CaretLeft size={16} />
            </button>

            {/* Count */}
            <span className="px-3 text-sm text-[#525252] whitespace-nowrap">
              {caseIdx + 1} of {totalCases}
            </span>

            {/* Next */}
            <button
              onClick={goToNext}
              disabled={caseIdx >= totalCases - 1}
              className="w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded bg-white hover:bg-[#F4F4F4] text-[#525252] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <CaretRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">

        {/* ── Case Details accordion panel ── */}
        <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
          {/* Panel header */}
          <button
            onClick={() => setCaseDetailsOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-4 bg-white hover:bg-[#F9F9F9] transition-colors border-b border-[#E0E0E0] text-left"
            style={{ height: caseDetailsOpen ? 48 : 50 }}
          >
            <Document size={16} className="text-[#2A53A0] flex-shrink-0" />
            <span className="flex-1 text-sm font-semibold text-[#161616]">Case Details</span>
            {caseDetailsOpen
              ? <ChevronDown size={16} className="text-[#525252]" />
              : <ChevronRight size={16} className="text-[#525252]" />}
          </button>

          {caseDetailsOpen && (
            <>
              {/* Tab bar */}
              <div className="flex border-b border-[#E0E0E0] bg-white px-4">
                {(["case", "entity"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDetailTab(t)}
                    className={cn(
                      "px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors",
                      detailTab === t
                        ? "border-[#2A53A0] text-[#2A53A0]"
                        : "border-transparent text-[#525252] hover:text-[#161616]"
                    )}
                  >
                    {t === "case" ? "Case Details" : "Entity Details"}
                  </button>
                ))}
              </div>

              {/* Case Details tab */}
              {detailTab === "case" && (
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    <DetailField label="Type"             value={caseData.caseType ?? "CASE"} />
                    <DetailField label="Case Status"      value={caseData.caseStatus} />
                    <DetailField label="Resolution Type"  value={caseData.resolutionType ?? "N/A"} />
                    <DetailField label="Case Entity Id"   value={caseData.caseEntityId} link />
                    <DetailField label="Case Entity Name" value={caseData.caseEntityName.split("–")[0]?.trim()} />
                    <DetailField label="Reporter"         value={caseData.reporter ?? "CXPS"} />
                    <DetailField label="Case Entity Score" value={String(caseData.caseEntityScore ?? "—")} />
                    <DetailField label="Assignee"          value={caseData.assignee} />
                    <DetailField label="Created By"        value={caseData.createdBy ?? "SYSTEM"} />
                    <DetailField label="Created On"        value={caseData.createdOn} />
                    <DetailField label="Updated By"        value={caseData.updatedBy ?? "SYSTEM"} />
                    <DetailField label="Resolved On"       value={caseData.resolvedOn ?? "—"} />
                    <DetailField label="Closed On"         value={caseData.closedOn ?? "—"} />
                  </div>
                </div>
              )}

              {/* Entity Details tab */}
              {detailTab === "entity" && (
                <div>
                  <div className="flex border-b border-[#E0E0E0] px-4 bg-white">
                    {(["Intelligence", "Accounts", "Cases"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setEntityTab(t)}
                        className={cn(
                          "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                          entityTab === t
                            ? "border-[#161616] text-[#161616] font-semibold"
                            : "border-transparent text-[#525252] hover:text-[#161616]"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {entityTab === "Intelligence" && (
                    <div className="overflow-auto">
                      <table className="w-full" style={{ borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ height: "48px", backgroundColor: "#E0E0E0" }}>
                            {["factname", "score", "computed", "cTRS", "wlmatches", "cRCvalue", "str", "source"].map((h) => (
                              <th key={h} className="px-4 text-left text-sm font-medium whitespace-nowrap align-middle" style={{ color: "#2A53A0" }}>
                                <div className="flex items-center gap-1">
                                  {h}<ChevronSort size={14} style={{ color: "#2A53A0" }} />
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {intelligenceData.map((row, i) => (
                            <tr key={i} style={{ height: "46px" }} className="border-b border-[#E0E0E0] hover:bg-[#F5F8FF] transition-colors">
                              <td className="px-4 text-sm text-[#161616] font-mono">{row.factname}</td>
                              <td className="px-4 text-sm text-[#161616]">{row.score}</td>
                              <td className="px-4 text-sm text-[#525252] whitespace-nowrap">{row.computed}</td>
                              <td className="px-4 text-sm text-[#525252]">{row.cTRS}</td>
                              <td className="px-4 text-sm text-[#525252]">{row.wlmatches}</td>
                              <td className="px-4 text-sm text-[#525252]">{row.cRCvalue}</td>
                              <td className="px-4 text-sm text-[#525252]">{row.str}</td>
                              <td className="px-4 text-sm text-[#161616]">{row.source}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {entityTab === "Accounts" && (
                    <div className="p-4">
                      <div className="border border-[#E0E0E0] rounded overflow-hidden">
                        <table className="w-full" style={{ borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ height: "48px", backgroundColor: "#E0E0E0" }}>
                              {["acctId", "name", "openedDate", "acctType", "schemeCode", "acctStatus"].map((h) => (
                                <th key={h} className="px-4 text-left text-sm font-medium whitespace-nowrap align-middle" style={{ color: "#2A53A0" }}>
                                  <div className="flex items-center gap-1">
                                    {h}<ChevronSort size={14} style={{ color: "#2A53A0" }} />
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {accountsData.map((row, i) => (
                              <tr key={i} style={{ height: "46px" }} className="border-b border-[#E0E0E0] hover:bg-[#F5F8FF] transition-colors">
                                <td className="px-4 text-sm text-[#2A53A0] cursor-pointer hover:underline font-mono">{row.acctId}</td>
                                <td className="px-4 text-sm text-[#161616]">{row.name}</td>
                                <td className="px-4 text-sm text-[#525252]">{row.openedDate}</td>
                                <td className="px-4 text-sm text-[#161616]">{row.acctType}</td>
                                <td className="px-4 text-sm text-[#525252]">{row.schemeCode}</td>
                                <td className="px-4 text-sm text-[#198038]">{row.acctStatus}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {entityTab === "Cases" && (
                    <div className="p-4">
                      <div className="border border-[#E0E0E0] rounded overflow-hidden">
                        <table className="w-full" style={{ borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ height: "48px", backgroundColor: "#E0E0E0" }}>
                              {["caseId", "module", "openedDate"].map((h) => (
                                <th key={h} className="px-4 text-left text-sm font-medium whitespace-nowrap align-middle" style={{ color: "#2A53A0" }}>
                                  <div className="flex items-center gap-1">
                                    {h}<ChevronSort size={14} style={{ color: "#2A53A0" }} />
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {entityCasesData.map((row, i) => (
                              <tr key={i} style={{ height: "46px" }} className="border-b border-[#E0E0E0] hover:bg-[#F5F8FF] transition-colors">
                                <td className="px-4 text-sm text-[#2A53A0] cursor-pointer hover:underline">{row.caseId}</td>
                                <td className="px-4 text-sm text-[#161616]">{row.module}</td>
                                <td className="px-4 text-sm text-[#525252]">{row.openedDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Alert List accordion panel ── */}
        <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
          <button
            onClick={() => setAlertListOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-4 bg-white hover:bg-[#F9F9F9] transition-colors border-b border-[#E0E0E0] text-left"
            style={{ height: alertListOpen ? 48 : 50 }}
          >
            <List size={16} className="text-[#2A53A0] flex-shrink-0" />
            <span className="flex-1 text-sm font-semibold text-[#161616]">Alert List</span>
            {alertListOpen
              ? <ChevronDown size={16} className="text-[#525252]" />
              : <ChevronRight size={16} className="text-[#525252]" />}
          </button>

          {alertListOpen && (
            <div className="p-4">
              <div style={{ border: "1px solid #E0E0E0", borderRadius: 8, overflow: "hidden" }}>
              <table className="w-full" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "17%" }} />
                </colgroup>
                <thead>
                  <tr style={{ height: "48px", backgroundColor: "#E0E0E0" }}>
                    {["Alert Id", "Scenario / Fact Name", "Indication of Fraud", "Alert Entity Id", "Alert Score", "Alert Status", "Indicator"].map((h) => (
                      <th key={h} className="px-4 text-left text-sm font-medium whitespace-nowrap align-middle overflow-hidden text-ellipsis" style={{ color: "#2A53A0" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alerts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-5 text-sm text-[#6F6F6F] text-center">
                        No alerts linked to this case.
                      </td>
                    </tr>
                  ) : (
                    alerts.map((a) => (
                      <tr key={a.alertId} style={{ height: "46px" }} className="border-b border-[#E0E0E0] hover:bg-[#F5F8FF] transition-colors">
                        <td className="px-4">
                          <span
                            className="text-sm text-[#0043CE] font-medium cursor-pointer hover:underline whitespace-nowrap"
                            onClick={() => onAlertClick?.(a.alertId)}
                          >
                            {a.alertId}
                          </span>
                        </td>
                        <td className="px-4">
                          <span className="text-sm text-[#161616] block overflow-hidden text-ellipsis whitespace-nowrap" title={a.scenarioFactName}>
                            {a.scenarioFactName}
                          </span>
                        </td>
                        <td className="px-4">
                          <span className="text-sm text-[#161616]">{a.indicationOfFraud}</span>
                        </td>
                        <td className="px-4">
                          {a.alertEntityId ? (
                            <AlertEntityBadge id={a.alertEntityId} />
                          ) : (
                            <span className="text-sm text-[#525252]">—</span>
                          )}
                        </td>
                        <td className="px-4">
                          <span className="text-sm font-semibold text-[#161616]">{a.alertScore}</span>
                        </td>
                        <td className="px-4">
                          <span className={cn(
                            "inline-block px-2 py-0.5 rounded text-xs font-semibold",
                            a.alertStatus === "CREATED" ? "bg-[#198038] text-white"
                            : a.alertStatus === "REOPENED" ? "bg-[#0043CE] text-white"
                            : "bg-[#525252] text-white"
                          )}>
                            {a.alertStatus}
                          </span>
                        </td>
                        <td className="px-4">
                          <AlertIndicator />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Footer */}
              <div style={{ height: 40 }} className="flex items-center px-4 border-t border-[#E0E0E0] bg-white text-sm text-[#525252]">
                Total alerts:
                <span className="font-semibold text-[#2A53A0] ml-1">{alerts.length}</span>
              </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Activity Details accordion panel ── */}
        <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center bg-white border-b border-[#E0E0E0]" style={{ height: activityOpen ? 48 : 50 }}>
            <button
              onClick={() => setActivityOpen((o) => !o)}
              className="flex items-center gap-3 px-4 hover:bg-[#F9F9F9] transition-colors flex-1 text-left h-full"
            >
              <Activity size={16} className="text-[#2A53A0] flex-shrink-0" />
              <span className="flex-1 text-sm font-semibold text-[#161616]">Activity Details</span>
              {activityOpen
                ? <ChevronDown size={16} className="text-[#525252]" />
                : <ChevronRight size={16} className="text-[#525252]" />}
            </button>
            <div className="pr-3 flex-shrink-0">
              <button className="w-8 h-8 flex items-center justify-center bg-[#2A53A0] text-white rounded hover:bg-[#1A3870] transition-colors" title="Upload">
                <Upload size={14} />
              </button>
            </div>
          </div>

          {activityOpen && (
            <div>
              {/* Tabs */}
              <div className="flex border-b border-[#E0E0E0] bg-white px-4">
                {(["Comments", "Attachments", "Audit History", "Inbox Response"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivityTab(tab)}
                    className={cn(
                      "px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap",
                      activityTab === tab
                        ? "border-[#2A53A0] text-[#2A53A0]"
                        : "border-transparent text-[#525252] hover:text-[#161616]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {activityTab === "Comments" && (
                  <div className="space-y-3">
                    <div className="border border-[#E0E0E0] rounded overflow-hidden">
                      {/* Rich text toolbar */}
                      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[#E0E0E0] flex-wrap">
                        <select className="text-xs border border-[#C6C6C6] rounded px-2 py-1 mr-2 text-[#161616] outline-none bg-white cursor-pointer hover:bg-gray-50">
                          <option>Normal</option>
                          <option>Heading 1</option>
                          <option>Heading 2</option>
                          <option>Heading 3</option>
                        </select>
                        {[
                          { label: "B", title: "Bold", cls: "font-bold" },
                          { label: "I", title: "Italic", cls: "italic" },
                          { label: "U", title: "Underline", cls: "underline" },
                        ].map((btn) => (
                          <button
                            key={btn.title}
                            title={btn.title}
                            className={cn("w-7 h-7 flex items-center justify-center text-sm text-[#161616] hover:bg-[#E0E0E0] rounded transition-colors", btn.cls)}
                          >
                            {btn.label}
                          </button>
                        ))}
                        <button title="Link" className="w-7 h-7 flex items-center justify-center hover:bg-[#E0E0E0] rounded transition-colors">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                            <path d="M6 10l4-4M5 7.5a2.5 2.5 0 003.5 3.5l1.5-1.5A2.5 2.5 0 006.5 6L5 7.5z" />
                            <path d="M10 8.5a2.5 2.5 0 00-3.5-3.5L5 6.5A2.5 2.5 0 009.5 10L11 8.5z" />
                          </svg>
                        </button>
                        <button title="Blockquote" className="w-7 h-7 flex items-center justify-center text-sm text-[#161616] hover:bg-[#E0E0E0] rounded font-serif transition-colors">
                          "
                        </button>
                        <button title="Ordered List" className="w-7 h-7 flex items-center justify-center hover:bg-[#E0E0E0] rounded transition-colors">
                          <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                            <rect x="6" y="3" width="8" height="1.5" rx="0.5" />
                            <rect x="6" y="7" width="8" height="1.5" rx="0.5" />
                            <rect x="6" y="11" width="8" height="1.5" rx="0.5" />
                            <text x="1.5" y="5" fontSize="4" fill="currentColor">1</text>
                            <text x="1.5" y="9" fontSize="4" fill="currentColor">2</text>
                            <text x="1.5" y="13" fontSize="4" fill="currentColor">3</text>
                          </svg>
                        </button>
                        <button title="Unordered List" className="w-7 h-7 flex items-center justify-center hover:bg-[#E0E0E0] rounded transition-colors">
                          <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                            <circle cx="3" cy="4" r="1.2" />
                            <rect x="6" y="3" width="8" height="1.5" rx="0.5" />
                            <circle cx="3" cy="8" r="1.2" />
                            <rect x="6" y="7" width="8" height="1.5" rx="0.5" />
                            <circle cx="3" cy="12" r="1.2" />
                            <rect x="6" y="11" width="8" height="1.5" rx="0.5" />
                          </svg>
                        </button>
                        <button title="Code" className="w-7 h-7 flex items-center justify-center text-xs font-mono text-[#161616] hover:bg-[#E0E0E0] rounded transition-colors">
                          {"</>"}
                        </button>
                      </div>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment"
                        rows={4}
                        className="w-full px-4 py-3 text-sm text-[#161616] placeholder-[#A8A8A8] italic resize-none outline-none bg-white"
                        style={{ fontStyle: commentText ? "normal" : "italic" }}
                      />
                    </div>
                    <button
                      disabled
                      style={{ height: 46, borderRadius: 8, fontSize: 15, fontWeight: 400 }}
                      className="flex items-center gap-2 px-5 bg-[#2A53A0] text-white opacity-40 cursor-not-allowed"
                    >
                      Add Comment
                      <Launch size={14} />
                    </button>
                  </div>
                )}
                {activityTab === "Attachments" && (
                  <div className="text-sm text-[#525252] py-4 text-center">No attachments found.</div>
                )}
                {activityTab === "Audit History" && (
                  <div className="text-sm text-[#525252] py-4 text-center">No audit history available.</div>
                )}
                {activityTab === "Inbox Response" && (
                  <div className="text-sm text-[#525252] py-4 text-center">No inbox responses.</div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
