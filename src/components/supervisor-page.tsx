import React, { useState } from "react";
import {
  UserAdmin,
  CheckmarkOutline,
  Close,
  Email,
  Filter,
  Search,
  Renew,
  ChevronDown,
  Warning,
  Time,
  Group,
} from "@carbon/icons-react";
import PageHeader from "./page-header";

interface PendingItem {
  id: string;
  type: "Request" | "Response";
  subject: string;
  assignedTo: string;
  mailbox: string;
  receivedDate: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Pending Review" | "Escalated" | "On Hold";
  emailId: string;
}

const MOCK_PENDING: PendingItem[] = [
  {
    id: "SUP-2026-001",
    type: "Request",
    subject: "FW: Cyber Cell Indore Comp. No. 74/23 (Insp. Dinesh verma) Sc- PNB",
    assignedTo: "ops_user_01",
    mailbox: "dnkadaba",
    receivedDate: "08 Apr 2026, 10:34 am",
    priority: "Low",
    status: "Pending Review",
    emailId: "REQ-2026-001"
  },
  {
    id: "SUP-2026-002",
    type: "Request",
    subject: "Account Freeze - Legal Notice No. 2025/CBI/789",
    assignedTo: "ops_user_02",
    mailbox: "cybercrimecell",
    receivedDate: "07 Apr 2026, 02:10 pm",
    priority: "High",
    status: "Escalated",
    emailId: "REQ-2026-002"
  },
  {
    id: "SUP-2026-003",
    type: "Response",
    subject: "RE: Account Statement Request - Customer ID 45678",
    assignedTo: "ops_user_01",
    mailbox: "accountstatement",
    receivedDate: "06 Apr 2026, 09:55 am",
    priority: "Medium",
    status: "On Hold",
    emailId: "RES-2026-003"
  },
  {
    id: "SUP-2026-004",
    type: "Request",
    subject: "Urgent: Court Order for Account Details - Case 9012",
    assignedTo: "Unassigned",
    mailbox: "legal_notice",
    receivedDate: "05 Apr 2026, 04:40 pm",
    priority: "Critical",
    status: "Pending Review",
    emailId: "REQ-2026-004"
  }
];

const SUMMARY_STATS = [
  { label: "Pending Review", value: 2, color: "text-[#f1c21b]", bg: "bg-[#fdf1c2]" },
  { label: "Escalated", value: 1, color: "text-[#a2191f]", bg: "bg-[#fff1f1]" },
  { label: "On Hold", value: 1, color: "text-[#525252]", bg: "bg-[#e8e8e8]" },
  { label: "Total Today", value: 4, color: "text-[#2A53A0]", bg: "bg-[#edf5ff]" },
];

const priorityColors: Record<string, string> = {
  Low: "bg-[#defbe6] text-[#0e6027]",
  Medium: "bg-[#fdf1c2] text-[#8a5c00]",
  High: "bg-[#fff1f1] text-[#a2191f]",
  Critical: "bg-[#a2191f] text-white"
};

const statusColors: Record<string, string> = {
  "Pending Review": "bg-[#fdf1c2] text-[#8a5c00]",
  "Escalated": "bg-[#fff1f1] text-[#a2191f]",
  "On Hold": "bg-[#e8e8e8] text-[#525252]"
};

const typeColors: Record<string, string> = {
  Request: "bg-[#edf5ff] text-[#0043ce]",
  Response: "bg-[#defbe6] text-[#0e6027]"
};

interface Props {
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
}

export function SupervisorPage({ breadcrumbs, onBreadcrumbNavigate }: Props) {
  const [items] = useState<PendingItem[]>(MOCK_PENDING);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-newest");
  const [filterType, setFilterType] = useState<"All" | "Request" | "Response">("All");

  const filtered = items.filter(item => {
    const matchesSearch = !search ||
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.emailId.toLowerCase().includes(search.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <PageHeader
        title="Supervisor"
        breadcrumbs={breadcrumbs}
        onBreadcrumbNavigate={onBreadcrumbNavigate}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-4 border-b border-[#e0e0e0] shrink-0">
        {SUMMARY_STATS.map((stat, i) => (
          <div key={i} className={`flex items-center justify-between px-5 py-4 ${i < 3 ? "border-r border-[#e0e0e0]" : ""}`}>
            <span className="text-[13px] text-[#525252]">{stat.label}</span>
            <span className={`text-[22px] font-semibold ${stat.color} ${stat.bg} w-10 h-10 flex items-center justify-center rounded`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-0 border-b border-[#e0e0e0] bg-white shrink-0">
        <div className="flex-1 flex items-center h-12 px-4 gap-3 border-r border-[#e0e0e0]">
          <Search size={16} className="text-[#525252] shrink-0" />
          <input
            className="flex-1 bg-transparent text-[14px] text-[#161616] placeholder:text-[#a8a8a8] outline-none"
            placeholder="Search by subject, email ID, operator..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Type filter */}
        <div className="flex items-center h-12 border-r border-[#e0e0e0] px-2 gap-1">
          {(["All", "Request", "Response"] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 h-8 rounded text-[12px] font-medium transition-colors ${filterType === t ? "bg-[#2A53A0] text-white" : "text-[#525252] hover:bg-[#e8e8e8]"}`}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Sort */}
        <div className="flex items-center gap-2 px-4 h-12">
          <span className="text-[13px] text-[#525252]">Sort:</span>
          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none text-[13px] text-[#161616] bg-white border border-[#e0e0e0] rounded px-3 py-1 pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2A53A0]"
            >
              <option value="date-newest">Date (Newest First)</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 pointer-events-none text-[#525252]" />
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f4f4f4] border-b border-[#e0e0e0]">
              {["TYPE", "EMAIL ID", "SUBJECT", "ASSIGNED TO", "MAILBOX", "RECEIVED", "PRIORITY", "STATUS", "ACTIONS"].map(col => (
                <th key={col} className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#525252] uppercase tracking-wide whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-[14px] text-[#525252]">
                  No items match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map(item => (
                <tr key={item.id} className="border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${typeColors[item.type]}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-[#2A53A0] font-medium">{item.emailId}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[280px]">
                    <p className="text-[13px] text-[#161616] line-clamp-2">{item.subject}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Group size={13} className="text-[#525252]" />
                      <span className="text-[13px] text-[#161616]">{item.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Email size={13} className="text-[#525252]" />
                      <span className="text-[12px] text-[#525252]">{item.mailbox}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                      <Time size={13} />
                      <span>{item.receivedDate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${priorityColors[item.priority]}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {item.status === "Escalated" && <Warning size={12} className="text-[#a2191f]" />}
                      <span className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        className="flex items-center gap-1 h-7 px-2.5 rounded bg-[#defbe6] text-[#0e6027] text-[11px] font-medium hover:bg-[#a7f0ba] transition-colors"
                        title="Approve"
                      >
                        <CheckmarkOutline size={12} />
                        Approve
                      </button>
                      <button
                        className="flex items-center gap-1 h-7 px-2.5 rounded bg-[#fff1f1] text-[#a2191f] text-[11px] font-medium hover:bg-[#ffd7d9] transition-colors"
                        title="Reject"
                      >
                        <Close size={12} />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
