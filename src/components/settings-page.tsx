import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Settings,
  Search,
  Activity,
  Group,
  Security,
  WarningAlt,
  Renew,
  Add,
  Edit,
  TrashCan,
  UserFollow,
  ChevronDown,
  ChevronRight,
  CheckmarkFilled,
  Email,
} from "@carbon/icons-react";
import PageHeader from "./page-header";

// ── Types ────────────────────────────────────────────────────────────────────

interface ConfigEntry {
  subcategory: string;
  group: string;
  key: string;
  index: string;
  value: string;
  type: "STRING" | "INTEGER" | "BOOLEAN" | "FLOAT";
  dataType: string;
  status: "Active" | "Inactive";
}

interface ConfigService {
  name: string;
  configs: ConfigEntry[];
}

interface ServiceStatus {
  name: string;
  description: string;
  status: "UP" | "DOWN";
  appName: string;
  version: string;
  instance?: string;
  appDescription: string;
  sections: { title: string; rows: { label: string; value: string }[] }[];
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  type: "Supervisor" | "Operator" | "Analyst";
  members: number;
  status: "Active" | "Inactive";
}

interface Mailbox {
  id: string;
  name: string;
  label: string;
}

interface MailboxPriority {
  id: string;
  name: string;
  label: string;
  priority: number;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const CONFIG_SERVICES: ConfigService[] = [
  {
    name: "lea-llm-service",
    configs: [
      { subcategory: "general", group: "general", key: "provider", index: "-", value: "ollama", type: "STRING", dataType: "-", status: "Active" },
      { subcategory: "ollama", group: "ollama", key: "url", index: "-", value: "http://localhost:11434", type: "STRING", dataType: "-", status: "Active" },
      { subcategory: "ollama", group: "ollama", key: "modelName", index: "-", value: "qwen2.5:14b", type: "STRING", dataType: "-", status: "Active" },
      { subcategory: "ollama", group: "ollama", key: "timeoutSeconds", index: "-", value: "180.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "ollama", group: "ollama", key: "maxRetries", index: "-", value: "3.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "ollama", group: "ollama", key: "retryDelayMs", index: "-", value: "1000.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "ollama", group: "ollama", key: "numCtx", index: "-", value: "2048.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "ollama", group: "ollama", key: "numPredict", index: "-", value: "800.000000", type: "INTEGER", dataType: "-", status: "Active" },
    ]
  },
  {
    name: "email-processor",
    configs: [
      { subcategory: "smtp", group: "smtp", key: "host", index: "-", value: "smtp.pnb.co.in", type: "STRING", dataType: "-", status: "Active" },
      { subcategory: "smtp", group: "smtp", key: "port", index: "-", value: "587.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "smtp", group: "smtp", key: "ssl", index: "-", value: "true", type: "BOOLEAN", dataType: "-", status: "Active" },
      { subcategory: "smtp", group: "smtp", key: "username", index: "-", value: "noreply@pnb.co.in", type: "STRING", dataType: "-", status: "Active" },
      { subcategory: "smtp", group: "smtp", key: "connectionTimeout", index: "-", value: "30000.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "imap", group: "imap", key: "host", index: "-", value: "imap.pnb.co.in", type: "STRING", dataType: "-", status: "Active" },
      { subcategory: "imap", group: "imap", key: "port", index: "-", value: "993.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "imap", group: "imap", key: "pollIntervalSeconds", index: "-", value: "60.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "imap", group: "imap", key: "maxFetchCount", index: "-", value: "100.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "imap", group: "imap", key: "markAsRead", index: "-", value: "true", type: "BOOLEAN", dataType: "-", status: "Active" },
      { subcategory: "processing", group: "queue", key: "maxConcurrentJobs", index: "-", value: "10.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "processing", group: "queue", key: "retryAttempts", index: "-", value: "3.000000", type: "INTEGER", dataType: "-", status: "Active" },
    ]
  },
  {
    name: "clerc-ui",
    configs: [
      { subcategory: "app", group: "general", key: "baseUrl", index: "-", value: "http://localhost:3002", type: "STRING", dataType: "-", status: "Active" },
    ]
  },
  {
    name: "extractor",
    configs: [
      { subcategory: "mailbox", group: "imap", key: "host", index: "-", value: "imap.yahoo.com", type: "STRING", dataType: "-", status: "Active" },
      { subcategory: "mailbox", group: "imap", key: "port", index: "-", value: "993.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "mailbox", group: "imap", key: "ssl", index: "-", value: "true", type: "BOOLEAN", dataType: "-", status: "Active" },
      { subcategory: "mailbox", group: "imap", key: "pollIntervalSeconds", index: "-", value: "30.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "extraction", group: "nlp", key: "modelEndpoint", index: "-", value: "http://localhost:8080/extract", type: "STRING", dataType: "-", status: "Active" },
      { subcategory: "extraction", group: "nlp", key: "confidenceThreshold", index: "-", value: "0.750000", type: "FLOAT", dataType: "-", status: "Active" },
      { subcategory: "extraction", group: "nlp", key: "maxTokens", index: "-", value: "4096.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "extraction", group: "nlp", key: "language", index: "-", value: "en", type: "STRING", dataType: "-", status: "Active" },
    ]
  },
  {
    name: "lea-req-processor",
    configs: [
      { subcategory: "routing", group: "rules", key: "defaultMailbox", index: "-", value: "cybercrimecell", type: "STRING", dataType: "-", status: "Active" },
      { subcategory: "routing", group: "rules", key: "priorityEscalationEnabled", index: "-", value: "true", type: "BOOLEAN", dataType: "-", status: "Active" },
      { subcategory: "routing", group: "rules", key: "escalationThresholdHours", index: "-", value: "24.000000", type: "INTEGER", dataType: "-", status: "Active" },
      { subcategory: "processing", group: "workflow", key: "autoExtractEnabled", index: "-", value: "true", type: "BOOLEAN", dataType: "-", status: "Active" },
      { subcategory: "processing", group: "workflow", key: "supervisorApprovalRequired", index: "-", value: "false", type: "BOOLEAN", dataType: "-", status: "Active" },
    ]
  },
];

const MONITORING_SERVICES: ServiceStatus[] = [
  {
    name: "Sentinel Extractor",
    description: "Sentinel Email extraction and OCR service",
    status: "UP",
    appName: "Sentinel Extractor",
    version: "1.0.0",
    appDescription: "Read emails from configured mailbox(es), applies OCR and extracts raw text from the email + attachment(s)",
    sections: [
      {
        title: "Extractor Configuration",
        rows: [
          { label: "Mailboxes", value: "1" },
          { label: "Poll Interval", value: "PT30S" },
          { label: "Scheduling", value: "Enabled" },
          { label: "Table Config", value: "config/table-extraction.yml" },
          { label: "MailGuard Config", value: "config/test-config.json" },
        ]
      },
      {
        title: "Email Counts by Mailbox",
        rows: [
          { label: "Total", value: "-" },
          { label: "dnkadaba", value: "1" },
        ]
      },
      {
        title: "Java Runtime",
        rows: [
          { label: "Version", value: "17.0.12" },
          { label: "Vendor", value: "Red Hat, Inc." },
          { label: "Runtime", value: "OpenJDK Runtime Environment" },
        ]
      }
    ]
  },
  {
    name: "Sentinel EmailProcessor",
    description: "Sentinel Email processing and AI/NLP analysis service",
    status: "UP",
    appName: "Sentinel Email Processor",
    version: "1.0.0",
    instance: "default",
    appDescription: "Multi-instance email processing service with AI/NLP analysis",
    sections: [
      {
        title: "Processing Statistics",
        rows: [
          { label: "Pending", value: "0" },
          { label: "Today", value: "0" },
          { label: "Total", value: "1" },
          { label: "Avg Time", value: "36.57s" },
          { label: "Rate", value: "0/min" },
        ]
      },
      {
        title: "Java Runtime",
        rows: [
          { label: "Version", value: "17.0.12" },
          { label: "Vendor", value: "Red Hat, Inc." },
          { label: "Runtime", value: "OpenJDK Runtime Environment" },
        ]
      },
      {
        title: "Operating System",
        rows: [
          { label: "OS", value: "Linux" },
          { label: "Version", value: "5.14.0-503.31.1.el9_5.x86_64" },
        ]
      }
    ]
  }
];

const USER_GROUPS: UserGroup[] = [
  { id: "1", name: "www", description: "xxx", type: "Supervisor", members: 1, status: "Active" },
  { id: "2", name: "qq", description: "qq", type: "Operator", members: 0, status: "Active" },
  { id: "3", name: "Supervisors edit", description: "xxxx", type: "Supervisor", members: 0, status: "Active" },
];

const MAILBOXES: Mailbox[] = [
  { id: "1", name: "ACCOUNT_FREEZE - INBOX", label: "ACCOUNT_FREEZE - INBOX" },
  { id: "2", name: "ACCOUNT_HOLDER_DETAILS - INBOX", label: "ACCOUNT_HOLDER_DETAILS - INBOX" },
  { id: "3", name: "ACCOUNT_OPENING_FORMS - INBOX", label: "ACCOUNT_OPENING_FORMS - INBOX" },
  { id: "4", name: "ACCOUNT_STATEMENT - INBOX", label: "ACCOUNT_STATEMENT - INBOX" },
  { id: "5", name: "ACCOUNT_UNFREEZE - INBOX", label: "ACCOUNT_UNFREEZE - INBOX" },
  { id: "6", name: "CYBER_CRIME - INBOX", label: "CYBER_CRIME - INBOX" },
  { id: "7", name: "LEGAL_NOTICE - INBOX", label: "LEGAL_NOTICE - INBOX" },
];

const MAILBOX_PRIORITIES: MailboxPriority[] = [
  { id: "1", name: "ACCOUNT_FREEZE - INBOX", label: "ACCOUNT_FREEZE - INBOX", priority: 5 },
  { id: "2", name: "ACCOUNT_HOLDER_DETAILS - INBOX", label: "ACCOUNT_HOLDER_DETAILS - INBOX", priority: 5 },
  { id: "3", name: "ACCOUNT_OPENING_FORMS - INBOX", label: "ACCOUNT_OPENING_FORMS - INBOX", priority: 5 },
  { id: "4", name: "ACCOUNT_STATEMENT - INBOX", label: "ACCOUNT_STATEMENT - INBOX", priority: 5 },
  { id: "5", name: "ACCOUNT_UNFREEZE - INBOX", label: "ACCOUNT_UNFREEZE - INBOX", priority: 5 },
  { id: "6", name: "CYBER_CRIME - INBOX", label: "CYBER_CRIME - INBOX", priority: 2 },
  { id: "7", name: "LEGAL_NOTICE - INBOX", label: "LEGAL_NOTICE - INBOX", priority: 1 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const typeColors: Record<string, string> = {
  STRING: "bg-[#edf5ff] text-[#0043ce]",
  INTEGER: "bg-[#f2e8ff] text-[#6929c4]",
  BOOLEAN: "bg-[#defbe6] text-[#0e6027]",
  FLOAT: "bg-[#fff1f1] text-[#a2191f]",
};

const groupTypeColors: Record<string, string> = {
  Supervisor: "bg-[#f2e8ff] text-[#6929c4]",
  Operator: "bg-[#edf5ff] text-[#0043ce]",
  Analyst: "bg-[#defbe6] text-[#0e6027]",
};

function getPriorityLabel(p: number): { label: string; className: string } {
  if (p === 1) return { label: "1 - CRITICAL", className: "bg-[#a2191f] text-white" };
  if (p <= 3) return { label: `${p} - HIGH`, className: "bg-[#fff1f1] text-[#a2191f]" };
  if (p <= 6) return { label: `${p} - MEDIUM`, className: "bg-[#fdf1c2] text-[#8a5c00]" };
  return { label: `${p} - LOW`, className: "bg-[#defbe6] text-[#0e6027]" };
}

// ── Tab components ─────────────────────────────────────────────────────────────

const EMPTY_CONFIG_FORM = {
  category: "", subcategory: "", configGroup: "", arrayIndex: "",
  configKey: "", valueType: "STRING", dataType: "", value: "",
  description: "", encrypted: false,
};

function ConfigurationsTab({ onAddConfig }: { onAddConfig: () => void }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "lea-llm-service": true });

  const filteredServices = CONFIG_SERVICES.map(svc => ({
    ...svc,
    configs: svc.configs.filter(c =>
      !search ||
      c.key.toLowerCase().includes(search.toLowerCase()) ||
      c.value.toLowerCase().includes(search.toLowerCase()) ||
      c.subcategory.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(svc => !search || svc.configs.length > 0);

  return (
    <div className="flex flex-col h-full">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-3 p-4">

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-[#161616]">Configuration List</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  className="pl-9 pr-3 border border-[#e0e0e0] bg-white text-[13px] text-[#161616] placeholder:text-[#a8a8a8] outline-none focus:ring-1 focus:ring-[#2A53A0]"
                  style={{ height: "46px", width: "280px", borderRadius: "8px" }}
                  placeholder="Search configurations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525252]" />
              </div>
              <button className="flex items-center gap-2 px-4 border border-[#e0e0e0] bg-white text-[13px] text-[#161616] hover:bg-[#e8e8e8] transition-colors" style={{ height: "46px", borderRadius: "8px" }}>
                <Renew size={14} />
                Clear Cache
              </button>
              <button onClick={onAddConfig} className="flex items-center gap-2 px-4 bg-[#2A53A0] text-white text-[13px] hover:bg-[#1d3d7a] transition-colors" style={{ height: "46px", borderRadius: "8px" }}>
                <Add size={14} />
                Add Configuration
              </button>
            </div>
          </div>

        {filteredServices.map(svc => (
          <div key={svc.name} className="border border-[#e0e0e0] rounded-lg overflow-hidden">
            {/* Service group header */}
            <button
              onClick={() => setExpanded(prev => ({ ...prev, [svc.name]: !prev[svc.name] }))}
              className="w-full flex items-center gap-2 px-4 py-3 bg-white hover:bg-[#f4f4f4] transition-colors text-left"
            >
              {expanded[svc.name]
                ? <ChevronDown size={14} className="text-[#525252]" />
                : <ChevronRight size={14} className="text-[#525252]" />
              }
              <Settings size={14} className="text-[#2A53A0]" />
              <span className="text-[13px] font-semibold text-[#161616]">{svc.name}</span>
              <span className="text-[12px] text-[#525252]">({svc.configs.length} configs)</span>
            </button>

            {expanded[svc.name] && (
              <table className="w-full border-collapse border-t border-[#e0e0e0]">
                <thead>
                  <tr className="bg-[#f4f4f4] border-b border-[#e0e0e0]">
                    {["SUBCATEGORY", "GROUP", "KEY", "INDEX", "VALUE", "TYPE", "DATA TYPE", "STATUS", "ACTIONS"].map(col => (
                      <th key={col} className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#525252] uppercase tracking-wide whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {svc.configs.map((cfg, i) => (
                    <tr key={i} className="border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors">
                      <td className="px-4 py-2.5 text-[13px] text-[#161616]">{cfg.subcategory}</td>
                      <td className="px-4 py-2.5 text-[13px] text-[#161616]">{cfg.group}</td>
                      <td className="px-4 py-2.5 text-[13px] text-[#161616] font-medium">{cfg.key}</td>
                      <td className="px-4 py-2.5 text-[13px] text-[#525252]">{cfg.index}</td>
                      <td className="px-4 py-2.5 text-[13px] text-[#161616] max-w-[200px] truncate">{cfg.value}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${typeColors[cfg.type] ?? "bg-[#e8e8e8] text-[#525252]"}`}>
                          {cfg.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[13px] text-[#525252]">{cfg.dataType}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-[11px] px-2 py-0.5 rounded-sm font-medium bg-[#defbe6] text-[#0e6027]">
                          {cfg.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <button
                            title="Edit"
                            className="flex items-center justify-center rounded-lg transition-colors hover:opacity-80"
                            style={{ width: "32px", height: "32px", backgroundColor: "#edf2ff" }}
                          >
                            <Edit size={14} style={{ color: "#3451b2" }} />
                          </button>
                          <button
                            title="Delete"
                            className="flex items-center justify-center rounded-lg transition-colors hover:opacity-80"
                            style={{ width: "32px", height: "32px", backgroundColor: "#fff1f1" }}
                          >
                            <TrashCan size={14} style={{ color: "#a2191f" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

function MonitoringTab() {
  const [lastUpdated] = useState(() => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0] bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[#2A53A0]" />
          <span className="text-[14px] font-semibold text-[#161616]">Service Monitoring</span>
          <span className="text-[12px] text-[#525252]">Last updated: {lastUpdated}</span>
        </div>
        <button className="flex items-center gap-2 h-9 px-4 border border-[#e0e0e0] bg-white text-[13px] text-[#161616] rounded hover:bg-[#e8e8e8] transition-colors">
          <Renew size={14} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {MONITORING_SERVICES.map(svc => (
          <div key={svc.name} className="border border-[#e0e0e0] rounded bg-white">
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-[#525252]" />
                <div>
                  <div className="text-[14px] font-semibold text-[#161616]">{svc.name}</div>
                  <div className="text-[12px] text-[#525252]">{svc.description}</div>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[12px] font-semibold ${svc.status === "UP" ? "bg-[#defbe6] text-[#0e6027]" : "bg-[#fff1f1] text-[#a2191f]"}`}>
                <CheckmarkFilled size={12} />
                {svc.status}
              </div>
            </div>

            {/* Application info */}
            <div className="px-4 py-3 border-b border-[#e0e0e0]">
              <p className="text-[12px] font-semibold text-[#161616] mb-1.5">Application</p>
              <div className="text-[12px] text-[#525252] space-y-0.5">
                <div><span className="text-[#161616]">Name:</span> {svc.appName}</div>
                <div><span className="text-[#161616]">Version:</span> {svc.version}</div>
                {svc.instance && <div><span className="text-[#161616]">Instance:</span> {svc.instance}</div>}
                <div><span className="text-[#161616]">Description:</span> {svc.appDescription}</div>
              </div>
            </div>

            {/* Sections */}
            {svc.sections.map(section => (
              <div key={section.title} className="px-4 py-3 border-b border-[#e0e0e0] last:border-b-0">
                <p className="text-[12px] font-semibold text-[#161616] mb-1.5">{section.title}</p>
                <div className={`text-[12px] text-[#525252] ${section.rows.length > 3 ? "grid grid-cols-2 gap-x-4 gap-y-0.5" : "space-y-0.5"}`}>
                  {section.rows.map(row => (
                    <div key={row.label}>
                      <span className="text-[#161616]">{row.label}:</span> {row.value}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function UserGroupsTab() {
  const [search, setSearch] = useState("");
  const filtered = USER_GROUPS.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0] bg-white shrink-0">
        <div className="relative w-64">
          <input
            className="w-full h-9 pl-9 pr-3 border border-[#e0e0e0] bg-white text-[13px] placeholder:text-[#a8a8a8] outline-none focus:ring-1 focus:ring-[#2A53A0] rounded"
            placeholder="Search groups..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Settings size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525252]" />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 h-9 px-4 border border-[#e0e0e0] bg-white text-[13px] text-[#161616] rounded hover:bg-[#e8e8e8] transition-colors">
            <Renew size={14} />
            Refresh
          </button>
          <button className="flex items-center gap-2 h-9 px-4 bg-[#2A53A0] text-white text-[13px] rounded hover:bg-[#1d3d7a] transition-colors">
            <Add size={14} />
            New Group
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f4f4f4] border-b border-[#e0e0e0]">
              {["GROUP NAME", "DESCRIPTION", "TYPE", "MEMBERS", "STATUS", "ACTIONS"].map(col => (
                <th key={col} className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#525252] uppercase tracking-wide whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(group => (
              <tr key={group.id} className="border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Security size={14} className="text-[#6929c4]" />
                    <span className="text-[13px] font-medium text-[#161616]">{group.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#525252]">{group.description}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${groupTypeColors[group.type]}`}>
                    {group.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-[13px] text-[#525252]">
                    <Group size={14} />
                    <span>{group.members} members</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-sm font-medium bg-[#defbe6] text-[#0e6027]">
                    {group.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button className="p-1.5 hover:bg-[#e0e0e0] rounded transition-colors" title="Add members">
                      <UserFollow size={14} className="text-[#525252]" />
                    </button>
                    <button className="p-1.5 hover:bg-[#e0e0e0] rounded transition-colors" title="Edit">
                      <Edit size={14} className="text-[#525252]" />
                    </button>
                    <button className="p-1.5 hover:bg-[#fff1f1] rounded transition-colors" title="Delete">
                      <TrashCan size={14} className="text-[#a2191f]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PermissionsTab() {
  const [selectedMailbox, setSelectedMailbox] = useState<Mailbox | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Security size={20} className="text-[#6929c4]" />
          <div>
            <p className="text-[14px] font-semibold text-[#161616]">Mailbox Permissions</p>
            <p className="text-[12px] text-[#525252]">Manage which groups can access each mailbox</p>
          </div>
        </div>
        <button className="flex items-center gap-2 h-9 px-4 bg-[#6929c4] text-white text-[13px] rounded hover:bg-[#491d8b] transition-colors">
          <Add size={14} />
          Grant Permission
        </button>
      </div>

      {/* Dual panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: mailbox list */}
        <div className="w-72 border-r border-[#e0e0e0] overflow-y-auto">
          <p className="px-4 py-2.5 text-[11px] font-semibold text-[#525252] uppercase tracking-wide border-b border-[#e0e0e0] bg-[#f4f4f4]">
            Mailboxes
          </p>
          {MAILBOXES.map(mb => (
            <button
              key={mb.id}
              onClick={() => setSelectedMailbox(mb)}
              className={`w-full text-left px-4 py-3 border-b border-[#e0e0e0] transition-colors ${selectedMailbox?.id === mb.id ? "bg-[#edf5ff] border-l-2 border-l-[#2A53A0]" : "hover:bg-[#f4f4f4]"}`}
            >
              <div className="flex items-center gap-2">
                <Email size={14} className="text-[#525252] shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-[#161616]">{mb.name.split(" - ")[0]}</p>
                  <p className="text-[11px] text-[#525252]">{mb.label}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right: permissions detail */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          {selectedMailbox ? (
            <div className="w-full max-w-lg text-left">
              <p className="text-[14px] font-semibold text-[#161616] mb-1">{selectedMailbox.name}</p>
              <p className="text-[12px] text-[#525252] mb-4">Groups with access to this mailbox</p>
              <div className="border border-[#e0e0e0] rounded">
                <div className="px-4 py-8 text-center text-[13px] text-[#525252]">
                  No group permissions configured for this mailbox.
                </div>
              </div>
            </div>
          ) : (
            <>
              <Email size={48} className="text-[#c6c6c6] mb-4" />
              <p className="text-[16px] text-[#525252] font-medium">Select a mailbox</p>
              <p className="text-[13px] text-[#a8a8a8] mt-1">Select a mailbox to view its permissions</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PrioritiesTab() {
  const [priorities, setPriorities] = useState<MailboxPriority[]>(MAILBOX_PRIORITIES);

  const updatePriority = (id: string, value: number) => {
    setPriorities(prev => prev.map(p => p.id === id ? { ...p, priority: value } : p));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <WarningAlt size={20} className="text-[#f1c21b]" />
          <div>
            <p className="text-[14px] font-semibold text-[#161616]">Mailbox Priority Settings</p>
            <p className="text-[12px] text-[#525252]">Set priority levels for each mailbox (1 = Critical, 10 = Low)</p>
          </div>
        </div>
        <button className="flex items-center gap-2 h-9 px-4 border border-[#e0e0e0] bg-white text-[13px] text-[#161616] rounded hover:bg-[#e8e8e8] transition-colors">
          <Renew size={14} />
          Refresh
        </button>
      </div>

      {/* Priority legend */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#e0e0e0] bg-white shrink-0">
        <p className="text-[12px] font-semibold text-[#525252] mr-1">Priority Levels</p>
        <span className="text-[11px] px-2.5 py-0.5 rounded-sm font-semibold bg-[#a2191f] text-white">1 - CRITICAL</span>
        <span className="text-[11px] px-2.5 py-0.5 rounded-sm font-semibold bg-[#fff1f1] text-[#a2191f]">2-3 - HIGH</span>
        <span className="text-[11px] px-2.5 py-0.5 rounded-sm font-semibold bg-[#fdf1c2] text-[#8a5c00]">4-6 - MEDIUM</span>
        <span className="text-[11px] px-2.5 py-0.5 rounded-sm font-semibold bg-[#defbe6] text-[#0e6027]">7-10 - LOW</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f4f4f4] border-b border-[#e0e0e0]">
              {["MAILBOX", "CURRENT PRIORITY", "SET PRIORITY", "ACTIONS"].map(col => (
                <th key={col} className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#525252] uppercase tracking-wide whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {priorities.map(item => {
              const { label, className } = getPriorityLabel(item.priority);
              return (
                <tr key={item.id} className="border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Email size={14} className="text-[#525252] shrink-0" />
                      <div>
                        <p className="text-[13px] font-medium text-[#161616]">{item.name.split(" - ")[0]}</p>
                        <p className="text-[11px] text-[#525252]">{item.label}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-sm font-semibold ${className}`}>
                      {label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={item.priority}
                        onChange={e => updatePriority(item.id, Number(e.target.value))}
                        className="w-36 accent-[#2A53A0]"
                      />
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={item.priority}
                        onChange={e => updatePriority(item.id, Math.min(10, Math.max(1, Number(e.target.value))))}
                        className="w-14 h-8 border border-[#e0e0e0] rounded text-center text-[13px] text-[#161616] outline-none focus:ring-1 focus:ring-[#2A53A0]"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1.5 h-8 px-3 border border-[#e0e0e0] rounded text-[12px] text-[#161616] hover:bg-[#e8e8e8] transition-colors">
                      <Edit size={12} />
                      Save
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Settings Page ────────────────────────────────────────────────────────

type TabId = "configurations" | "monitoring" | "user-groups" | "permissions" | "priorities";

const TABS: { id: TabId; label: string; icon: React.ComponentType<any> }[] = [
  { id: "configurations", label: "Configurations", icon: Settings },
  { id: "monitoring", label: "Monitoring", icon: Activity },
  { id: "user-groups", label: "User Groups", icon: Group },
  { id: "permissions", label: "Permissions", icon: Security },
  { id: "priorities", label: "Priorities", icon: WarningAlt },
];

interface Props {
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
}

export function SettingsPage({ breadcrumbs, onBreadcrumbNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("configurations");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_CONFIG_FORM });

  const openAddDialog = () => { setForm({ ...EMPTY_CONFIG_FORM }); setShowAddDialog(true); };
  const closeAddDialog = () => setShowAddDialog(false);
  const setField = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="flex flex-col h-full bg-white">
      <PageHeader
        title="Settings"
        breadcrumbs={breadcrumbs}
        onBreadcrumbNavigate={onBreadcrumbNavigate}
      />

      {/* Tabs */}
      <div className="flex border-b border-[#e0e0e0] bg-white shrink-0 px-4">
        {TABS.map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 text-[13px] font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-[#2A53A0] text-[#2A53A0]"
                  : "border-transparent text-[#525252] hover:text-[#161616] hover:bg-[#f4f4f4]"
              }`}
            >
              <TabIcon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "configurations" && <ConfigurationsTab onAddConfig={openAddDialog} />}
        {activeTab === "monitoring" && <MonitoringTab />}
        {activeTab === "user-groups" && <UserGroupsTab />}
        {activeTab === "permissions" && <PermissionsTab />}
        {activeTab === "priorities" && <PrioritiesTab />}
      </div>

      {/* Add Configuration Dialog — portalled to document.body to escape all stacking contexts */}
      {showAddDialog && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(22,22,22,0.7)" }}
          onClick={e => { if (e.target === e.currentTarget) closeAddDialog(); }}
        >
          <div
            className="flex flex-col"
            style={{ width: "min(860px, 96vw)", maxHeight: "92vh", backgroundColor: "#ffffff", boxShadow: "0 12px 48px rgba(0,0,0,0.4)", borderRadius: "8px", overflow: "hidden" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between shrink-0" style={{ backgroundColor: "#2A53A0", padding: "20px 24px", minHeight: "72px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#ffffff", margin: 0 }}>Create New Configuration</h2>
              <button onClick={closeAddDialog} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px", display: "flex", color: "#ffffff" }}>
                <Close size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#f4f4f4", padding: "24px" }}>
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "24px" }}>

                {/* Row 1: Category + Subcategory */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "6px" }}>
                      Category <span style={{ color: "#a2191f" }}>*</span>
                    </label>
                    <input type="text" value={form.category} onChange={e => setField("category", e.target.value)} placeholder="e.g., email-processor, extractor"
                      style={{ width: "100%", height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "6px" }}>
                      Subcategory <span style={{ color: "#a2191f" }}>*</span>
                    </label>
                    <input type="text" value={form.subcategory} onChange={e => setField("subcategory", e.target.value)} placeholder="e.g., ml-processing, llm"
                      style={{ width: "100%", height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>

                {/* Row 2: Config Group + Array Index */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "6px" }}>
                      Config Group <span style={{ fontSize: "12px", fontWeight: 400, color: "#525252" }}>(optional)</span>
                    </label>
                    <input type="text" value={form.configGroup} onChange={e => setField("configGroup", e.target.value)} placeholder="e.g., ACCOUNT_FREEZE, tabular-data"
                      style={{ width: "100%", height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "6px" }}>
                      Array Index <span style={{ fontSize: "12px", fontWeight: 400, color: "#525252" }}>(optional)</span>
                    </label>
                    <input type="text" value={form.arrayIndex} onChange={e => setField("arrayIndex", e.target.value)} placeholder="0, 1, 2..."
                      style={{ width: "100%", height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>

                {/* Row 3: Config Key (full width) */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "6px" }}>
                    Config Key <span style={{ color: "#a2191f" }}>*</span>
                  </label>
                  <input type="text" value={form.configKey} onChange={e => setField("configKey", e.target.value)} placeholder="e.g., pattern, priority, enabled"
                    style={{ width: "100%", height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", boxSizing: "border-box" }} />
                </div>

                {/* Row 4: Value Type + Data Type */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "6px" }}>
                      Value Type <span style={{ color: "#a2191f" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <select value={form.valueType} onChange={e => setField("valueType", e.target.value)}
                        style={{ width: "100%", height: "40px", padding: "0 36px 0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", appearance: "none", cursor: "pointer", boxSizing: "border-box" }}>
                        {["STRING", "INTEGER", "BOOLEAN", "DECIMAL", "DATE", "ARRAY_ELEMENT"].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#525252" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "6px" }}>
                      Data Type <span style={{ fontSize: "12px", fontWeight: 400, color: "#525252" }}>(optional)</span>
                    </label>
                    <input type="text" value={form.dataType} onChange={e => setField("dataType", e.target.value)} placeholder="e.g., REGEX, EMAIL, URL, DURATION"
                      style={{ width: "100%", height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>

                {/* Row 5: Value (full width) */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "6px" }}>
                    Value <span style={{ color: "#a2191f" }}>*</span>
                  </label>
                  <textarea value={form.value} onChange={e => setField("value", e.target.value)} placeholder="Enter configuration value..." rows={3}
                    style={{ width: "100%", padding: "10px 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.5 }} />
                </div>

                {/* Row 6: Description */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "6px" }}>
                    Description <span style={{ fontSize: "12px", fontWeight: 400, color: "#525252" }}>(optional)</span>
                  </label>
                  <textarea value={form.description} onChange={e => setField("description", e.target.value)} placeholder="Description of this configuration" rows={3}
                    style={{ width: "100%", padding: "10px 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.5 }} />
                </div>

                {/* Row 7: Encrypted checkbox */}
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.encrypted} onChange={e => setField("encrypted", e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#2A53A0", cursor: "pointer" }} />
                  <span style={{ fontSize: "13px", color: "#161616" }}>Encrypted (for sensitive data)</span>
                </label>

              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0" style={{ borderTop: "1px solid #e0e0e0" }}>
              <button onClick={closeAddDialog}
                style={{ flex: 1, height: "64px", backgroundColor: "#f4f4f4", border: "none", borderRight: "1px solid #e0e0e0", fontSize: "14px", fontWeight: 400, color: "#2A53A0", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f4f4f4")}>
                Cancel
              </button>
              <button onClick={closeAddDialog}
                className="flex items-center justify-center gap-2"
                style={{ flex: 1, height: "64px", backgroundColor: "#2A53A0", border: "none", fontSize: "14px", fontWeight: 400, color: "#ffffff", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1d3d7a")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2A53A0")}>
                <Save size={16} />
                Create
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
