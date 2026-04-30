import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Upload,
  Launch,
  CaretLeft,
  CaretRight,
  Analytics,
  UserProfile,
  NetworkEnterprise,
  Document,
  Activity,
} from "@carbon/icons-react";
import { cn } from "./ui/utils";
import { casesData, CaseAlert, CaseRow } from "./cases-page";

interface AlertDetailPageProps {
  alertId: string;
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
}

// ── helpers ────────────────────────────────────────────────────────────────────

function AlertDetailField({ label, value, badge, badgeColor }: {
  label: string;
  value?: string;
  badge?: boolean;
  badgeColor?: "purple" | "gray";
}) {
  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      <span style={{ fontSize: 12, color: "#6F6F6F", fontWeight: 400, lineHeight: "16px" }}>
        {label}
      </span>
      {badge ? (
        <span className={cn(
          "inline-block px-2.5 py-0.5 rounded text-xs font-semibold self-start",
          badgeColor === "purple"
            ? "bg-[#EDE7FF] text-[#6929C4]"
            : "bg-[#E0E0E0] text-[#393939]"
        )}>
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

// static sample comments
const SAMPLE_COMMENTS = [
  { initials: "OS", name: "ONE SUPER", time: "30 April 2026 14:47:02.000", text: "Alert reviewed. No further action required at this time." },
  { initials: "OS", name: "ONE SUPER", time: "30 April 2026 14:45:58.000", text: "Escalated for additional review." },
];

// ── main component ────────────────────────────────────────────────────────────

export function AlertDetailPage({
  alertId,
  breadcrumbs,
  onBreadcrumbNavigate,
}: AlertDetailPageProps) {
  // Find alert across all cases
  let alertData: CaseAlert | undefined;
  let parentCaseId = "";
  let caseData: CaseRow | undefined;
  for (const c of casesData) {
    const found = (c.alertList ?? []).find((a) => a.alertId === alertId);
    if (found) { alertData = found; parentCaseId = c.caseId; caseData = c; break; }
  }

  // All alerts flat list for prev/next
  const allAlerts: { alert: CaseAlert; caseId: string }[] = casesData.flatMap((c) =>
    (c.alertList ?? []).map((a) => ({ alert: a, caseId: c.caseId }))
  );
  const alertIdx = allAlerts.findIndex((x) => x.alert.alertId === alertId);
  const totalAlerts = allAlerts.length;

  const [activeTab, setActiveTab] = useState<"alert" | "evidence" | "link">("alert");
  const [caseDetailsOpen, setCaseDetailsOpen] = useState(true);
  const [alertDetailsOpen, setAlertDetailsOpen] = useState(true);
  const [activityOpen, setActivityOpen] = useState(true);
  const [activityTab, setActivityTab] = useState<"Comments" | "Attachments" | "Audit History">("Comments");
  const [commentText, setCommentText] = useState("");

  const goBack = () => onBreadcrumbNavigate(parentCaseId ? `case-detail-${parentCaseId}` : "home-cases");
  const goToPrev = () => {
    if (alertIdx > 0) onBreadcrumbNavigate(`alert-detail-${allAlerts[alertIdx - 1].alert.alertId}`);
  };
  const goToNext = () => {
    if (alertIdx < totalAlerts - 1) onBreadcrumbNavigate(`alert-detail-${allAlerts[alertIdx + 1].alert.alertId}`);
  };

  if (!alertData) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center text-sm text-[#525252]">
        Alert not found: {alertId}
      </div>
    );
  }

  const TOP_TABS = [
    { key: "alert",    label: "Alert",                  sub: "Case details and alert details",    Icon: Analytics },
    { key: "evidence", label: "Evidence Details",        sub: "Detailed Evidence for Alert",       Icon: UserProfile },
    { key: "link",     label: "Advanced Link Analysis",  sub: "Head over for Link Analysis",       Icon: NetworkEnterprise },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── Top section ── */}
      <div className="flex-shrink-0 bg-white border-b border-[#E0E0E0] shadow-sm">

        {/* Row 1: Back | Title | Breadcrumb */}
        <div className="relative flex items-center px-5" style={{ height: 52 }}>
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm text-[#525252] hover:text-[#161616] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <span className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-[#161616] pointer-events-none whitespace-nowrap">
            View Alert Details
          </span>

          <div className="ml-auto flex items-center gap-2 text-sm font-normal">
            {parentCaseId && (
              <>
                <button
                  onClick={() => onBreadcrumbNavigate(`case-detail-${parentCaseId}`)}
                  className="text-[#2A53A0] hover:text-[#1e3a70] transition-colors"
                >
                  {parentCaseId}
                </button>
                <span className="text-gray-300">/</span>
              </>
            )}
            <span className="text-[#161616]">Alert Details</span>
          </div>
        </div>

        {/* Row 1.5: Alert ID + Status + Nav */}
        <div className="flex items-center px-5 border-t border-[#E0E0E0]" style={{ height: 60 }}>
          {/* Left: Alert ID + Status */}
          <div className="flex items-center gap-4">
            {/* Alert ID */}
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6F6F6F] font-medium uppercase tracking-wide">Alert Id</span>
              <span className="text-sm font-semibold text-[#161616] mt-0.5">{alertId}</span>
            </div>

            <div className="w-px h-8 bg-[#E0E0E0]" />

            {/* Status */}
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6F6F6F] font-medium uppercase tracking-wide">Status</span>
              <span
                className="inline-block rounded-full px-3 py-0.5 text-xs font-semibold mt-0.5 whitespace-nowrap"
                style={
                  alertData.alertStatus === "CREATED"
                    ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                    : alertData.alertStatus === "REOPENED"
                    ? { backgroundColor: "#D0E2FF", color: "#0043CE" }
                    : { backgroundColor: "#F4F4F4", color: "#6F6F6F" }
                }
              >
                {alertData.alertStatus}
              </span>
            </div>
          </div>

          <div className="flex-1" />

          {/* Right: Prev / Count / Next */}
          <div className="flex items-center gap-0">
            <button
              onClick={goToPrev}
              disabled={alertIdx <= 0}
              className="w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded bg-white hover:bg-[#F4F4F4] text-[#525252] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <CaretLeft size={16} />
            </button>
            <span className="px-3 text-sm text-[#525252] whitespace-nowrap">
              {alertIdx + 1} of {totalAlerts}
            </span>
            <button
              onClick={goToNext}
              disabled={alertIdx >= totalAlerts - 1}
              className="w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded bg-white hover:bg-[#F4F4F4] text-[#525252] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <CaretRight size={16} />
            </button>
          </div>
        </div>

        {/* Row 2: Three top navigation tabs */}
        <div className="flex border-t border-[#E0E0E0]">
          {TOP_TABS.map(({ key, label, sub, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex-1 flex items-center gap-3 px-5 py-3 border-r border-[#E0E0E0] last:border-r-0 transition-colors text-left",
                activeTab === key
                  ? "bg-[#EAF1FF] border-b-2 border-b-[#2A53A0]"
                  : "bg-white hover:bg-[#F4F4F4] border-b-2 border-b-transparent"
              )}
            >
              <Icon size={20} className={activeTab === key ? "text-[#2A53A0]" : "text-[#525252]"} />
              <div>
                <p className={cn("text-sm font-semibold leading-tight", activeTab === key ? "text-[#2A53A0]" : "text-[#161616]")}>
                  {label}
                </p>
                <p className="text-[11px] text-[#6F6F6F] mt-0.5">{sub}</p>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* ── Page body ── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">

        {/* ── Case Details accordion panel ── */}
        {caseData && (
          <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
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
              <div className="p-4">
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                  <AlertDetailField label="Case Id"           value={caseData.caseId} />
                  <AlertDetailField label="Type"              value={caseData.caseType ?? "CASE"} />
                  <AlertDetailField label="Case Status"       value={caseData.caseStatus} />
                  <AlertDetailField label="Resolution Type"   value={caseData.resolutionType ?? "N/A"} />
                  <AlertDetailField label="Case Entity Id"    value={caseData.caseEntityId} />
                  <AlertDetailField label="Case Entity Name"  value={caseData.caseEntityName.split("–")[0]?.trim()} />
                  <AlertDetailField label="Reporter"          value={caseData.reporter ?? "CXPS"} />
                  <AlertDetailField label="Case Entity Score" value={String(caseData.caseEntityScore ?? "—")} />
                  <AlertDetailField label="Assignee"          value={caseData.assignee} />
                  <AlertDetailField label="Created By"        value={caseData.createdBy ?? "SYSTEM"} />
                  <AlertDetailField label="Created On"        value={caseData.createdOn} />
                  <AlertDetailField label="Updated By"        value={caseData.updatedBy ?? "SYSTEM"} />
                  <AlertDetailField label="Resolved On"       value={caseData.resolvedOn ?? "—"} />
                  <AlertDetailField label="Closed On"         value={caseData.closedOn ?? "—"} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Alert Details accordion panel ── */}
        <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
          <button
            onClick={() => setAlertDetailsOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-4 bg-white hover:bg-[#F9F9F9] transition-colors border-b border-[#E0E0E0] text-left"
            style={{ height: alertDetailsOpen ? 48 : 50 }}
          >
            <Document size={16} className="text-[#2A53A0] flex-shrink-0" />
            <span className="flex-1 text-sm font-semibold text-[#161616]">Alert Details</span>
            {alertDetailsOpen
              ? <ChevronDown size={16} className="text-[#525252]" />
              : <ChevronRight size={16} className="text-[#525252]" />}
          </button>

          {alertDetailsOpen && (
            <div className="p-4">
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <AlertDetailField label="Alert Id"                 value={alertData.alertId} />
                <AlertDetailField label="Alert Score"              value={String(alertData.alertScore)} />
                <AlertDetailField label="Indication of Fraud"      value={alertData.indicationOfFraud} />
                <AlertDetailField label="Scenario / Fact Name"     value={alertData.scenarioFactName} />
                <AlertDetailField label="Assignee"                 value={alertData.assignee ?? "ONE SUPER"} />
                <AlertDetailField label="Summary"                  value={alertData.alertSummary ?? "—"} />
                <AlertDetailField label="Entity Name"              value={alertData.entityName} badge badgeColor="gray" />
                <AlertDetailField label="Alert Entity Id"          value={alertData.alertEntityId} badge badgeColor="purple" />
                <AlertDetailField label="Alert Status"             value={alertData.alertStatus} />
                <AlertDetailField label="Risk Level"               value={alertData.riskLevel ?? "—"} />
                <AlertDetailField label="Source"                   value={alertData.source ?? "Finacle Core"} />
                <AlertDetailField label="Suppress Duration"        value={alertData.suppressDuration ?? "—"} />
                <AlertDetailField label="Suppress Duration Timing" value={alertData.suppressDurationTiming ?? "—"} />
                <AlertDetailField label="Monetary Value"           value={alertData.monetaryValue ?? "—"} />
                <AlertDetailField label="Created On"               value={alertData.createdOn ?? "—"} />
                <AlertDetailField label="Received At"              value={alertData.receivedAt ?? "—"} />
                <AlertDetailField label="Consolidated Report"      value={alertData.consolidatedReport ?? "—"} />
                <AlertDetailField label="Benefit Realised"         value={alertData.benefitRealised ?? "—"} />
                <AlertDetailField label="Loss Averted"             value={alertData.lossAverted ?? "—"} />
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
              <div className="flex border-b border-[#E0E0E0] bg-white">
                {(["Comments", "Attachments", "Audit History"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivityTab(tab)}
                    className={cn(
                      "px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap",
                      activityTab === tab
                        ? "border-[#161616] text-[#161616]"
                        : "border-transparent text-[#525252] hover:text-[#161616]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-4">
                {activityTab === "Comments" && (
                  <>
                    {/* Editor */}
                    <div className="border border-[#E0E0E0] rounded overflow-hidden">
                      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[#E0E0E0] flex-wrap">
                        <select className="text-xs border border-[#C6C6C6] rounded px-2 py-1 mr-2 text-[#161616] outline-none bg-white cursor-pointer">
                          <option>Normal</option>
                          <option>Heading 1</option>
                          <option>Heading 2</option>
                        </select>
                        {[{ label: "B", cls: "font-bold" }, { label: "I", cls: "italic" }, { label: "U", cls: "underline" }].map((b) => (
                          <button key={b.label} className={cn("w-7 h-7 flex items-center justify-center text-sm text-[#161616] hover:bg-[#E0E0E0] rounded transition-colors", b.cls)}>
                            {b.label}
                          </button>
                        ))}
                        <button title="Link" className="w-7 h-7 flex items-center justify-center hover:bg-[#E0E0E0] rounded transition-colors">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                            <path d="M6 10l4-4M5 7.5a2.5 2.5 0 003.5 3.5l1.5-1.5A2.5 2.5 0 006.5 6L5 7.5z" />
                            <path d="M10 8.5a2.5 2.5 0 00-3.5-3.5L5 6.5A2.5 2.5 0 009.5 10L11 8.5z" />
                          </svg>
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center text-sm font-serif hover:bg-[#E0E0E0] rounded">"</button>
                        <button title="Ordered List" className="w-7 h-7 flex items-center justify-center hover:bg-[#E0E0E0] rounded transition-colors">
                          <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                            <rect x="6" y="3" width="8" height="1.5" rx="0.5"/><rect x="6" y="7" width="8" height="1.5" rx="0.5"/><rect x="6" y="11" width="8" height="1.5" rx="0.5"/>
                            <text x="1.5" y="5" fontSize="4">1</text><text x="1.5" y="9" fontSize="4">2</text><text x="1.5" y="13" fontSize="4">3</text>
                          </svg>
                        </button>
                        <button title="Unordered List" className="w-7 h-7 flex items-center justify-center hover:bg-[#E0E0E0] rounded transition-colors">
                          <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                            <circle cx="3" cy="4" r="1.2"/><rect x="6" y="3" width="8" height="1.5" rx="0.5"/>
                            <circle cx="3" cy="8" r="1.2"/><rect x="6" y="7" width="8" height="1.5" rx="0.5"/>
                            <circle cx="3" cy="12" r="1.2"/><rect x="6" y="11" width="8" height="1.5" rx="0.5"/>
                          </svg>
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center text-xs font-mono hover:bg-[#E0E0E0] rounded">{"</>"}</button>
                      </div>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment"
                        rows={4}
                        className="w-full px-4 py-3 text-sm text-[#161616] placeholder-[#A8A8A8] resize-none outline-none bg-white"
                        style={{ fontStyle: commentText ? "normal" : "italic" }}
                      />
                    </div>

                    {/* Add Comment button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#2A53A0] text-white text-sm font-medium rounded hover:bg-[#1A3870] transition-colors">
                      Add Comment
                      <Launch size={14} />
                    </button>

                    {/* Comment list */}
                    <div className="space-y-3 pt-2">
                      {SAMPLE_COMMENTS.map((c, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#007D79] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {c.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#161616]">{c.name}</span>
                              <span className="text-xs text-[#6F6F6F]">{c.time}</span>
                            </div>
                            <p className="text-sm text-[#525252] mt-0.5">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {activityTab === "Attachments" && (
                  <div className="text-sm text-[#525252] py-4 text-center">No attachments found.</div>
                )}
                {activityTab === "Audit History" && (
                  <div className="text-sm text-[#525252] py-4 text-center">No audit history available.</div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
