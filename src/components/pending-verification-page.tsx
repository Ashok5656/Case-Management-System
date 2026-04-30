import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  ChevronRight, 
  CheckmarkOutline,
  Information,
  Portfolio,
  Identification,
  Flash,
  Settings,
  User,
  Money,
  Enterprise,
  Document,
  Filter,
  ChevronDown,
  Flow,
  Catalog,
  Security,
  View,
  VirtualMachine,
  Calendar,
  Workspace
} from "@carbon/icons-react";
import PageHeader from "./page-header";
import { Badge } from "./ui/badge";
import { CarbonPaginationFooter } from "./carbon-pagination-footer";
import { useSortableData } from "../hooks/use-sortable-data";
import { SortableHeader } from "./ui/sortable-header";
import { cn } from "./ui/utils";

interface PendingVerificationPageProps {
  scenarios: any[];
  events: any[];
  udvs: any[];
  secs: any[];
  views: any[];
  virtualEnvs: any[];
  workspaces?: any[];
  settings?: any[];
  initialTab?: string;
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
  onVerifyScenario: (id: string) => void;
  onRejectScenario: (id: string, comment: string) => void;
  onVerifyEvent: (id: string) => void;
  onRejectEvent: (id: string, comment: string) => void;
  onVerifyUDV: (id: string) => void;
  onRejectUDV: (id: string, comment: string) => void;
  onVerifySEC: (id: string) => void;
  onRejectSEC: (id: string, comment: string) => void;
  onVerifyView: (id: string) => void;
  onRejectView: (id: string, comment: string) => void;
  onVerifyVirtualEnv: (id: string) => void;
  onRejectVirtualEnv: (id: string, comment: string) => void;
  onVerifyWorkspace?: (id: string) => void;
  onRejectWorkspace?: (id: string, comment: string) => void;
  onVerifySettings?: (id: string) => void;
  onRejectSettings?: (id: string, comment: string) => void;
}

const ARTIFACT_TYPES = [
  { id: "all", label: "All Artifacts" },
  { id: "scenario", label: "Scenario", icon: Flow },
  { id: "event", label: "Event", icon: Flash },
  { id: "udv", label: "UDV", icon: Catalog },
  { id: "sec", label: "SEC", icon: Security },
  { id: "view", label: "View", icon: View },
  { id: "virtual-se", label: "Virtual SE", icon: VirtualMachine },
  { id: "workspace", label: "Workspace", icon: Workspace },
  { id: "settings", label: "Settings", icon: Settings },
];

const WORKSPACES = [
  { id: "all", label: "All Workspaces" },
  { id: "Account", label: "Account" },
  { id: "Card", label: "Card" },
  { id: "Transaction", label: "Transaction" },
  { id: "Terminal", label: "Terminal" },
  { id: "Beneficiary", label: "Beneficiary" },
  { id: "ATM", label: "ATM" },
  { id: "Customer", label: "Customer" },
  { id: "Organization", label: "Organization" },
];

const getWorkspaceIcon = (workspace: string) => {
  switch (workspace) {
    case "Account": return Portfolio;
    case "Card": return Identification;
    case "Transaction": return Flash;
    case "Terminal": return Settings;
    case "Beneficiary": return User;
    case "ATM": return Money;
    case "Customer": return User;
    case "Organization": return Enterprise;
    default: return Document;
  }
};

const getWorkspaceColor = (workspace: string) => {
  switch (workspace) {
    case "Account": return "text-[#002D9C] bg-[#D0E2FF]";
    case "Card": return "text-[#491D8B] bg-[#E8DAFF]";
    case "Transaction": return "text-[#004144] bg-[#D9FBFB]";
    case "Terminal": return "text-[#161616] bg-[#E0E0E0]";
    case "Beneficiary": return "text-[#750E13] bg-[#FFD7E1]";
    case "ATM": return "text-[#002D9C] bg-[#D0E2FF]";
    case "Customer": return "text-[#491D8B] bg-[#E8DAFF]";
    case "Organization": return "text-[#004144] bg-[#D9FBFB]";
    default: return "text-[#2A53A0] bg-[#f0f4f9]";
  }
};

const getArtifactBadgeStyle = (type: string) => {
  switch (type) {
    case "scenario": return "text-[#491D8B] bg-[#F6F2FF] border-[#E8DAFF]";
    case "event": return "text-[#005D5D] bg-[#F1FBFA] border-[#A7F0BA]";
    case "udv": return "text-[#002D9C] bg-[#EDF5FF] border-[#D0E2FF]";
    case "sec": return "text-[#750E13] bg-[#FFF1F1] border-[#FFD7E1]";
    case "view": return "text-[#161616] bg-[#F4F4F4] border-[#E0E0E0]";
    case "virtual-se": return "text-[#004144] bg-[#D9FBFB] border-[#3DDBD9]";
    case "workspace": return "text-[#2A53A0] bg-[#EAF2FF] border-[#D0E2FF]";
    default: return "text-[#525252] bg-[#f4f4f4] border-[#e0e0e0]";
  }
};

const getArtifactIcon = (type: string) => {
  return ARTIFACT_TYPES.find(t => t.id === type)?.icon || Document;
};

const getStatusBadge = (status: string = "Pending Approval") => {
  const baseStyles = "h-[28px] flex items-center justify-center rounded-full font-medium text-[11px] px-3 w-fit whitespace-nowrap border-0";
  
  const s = status?.toLowerCase() || "";
  if (s.includes("draft")) {
    return <span className={cn(baseStyles, "bg-[#F4F4F4] text-[#525252]")}>Draft</span>;
  }
  if (s.includes("pending") || s.includes("approval")) {
    return <span className={cn(baseStyles, "bg-[#FFF9E5] text-[#B28600] border border-[#FDEBB2]")}>Pending Approval</span>;
  }
  if (s.includes("verified") || s.includes("active") || s.includes("completed")) {
    return <span className={cn(baseStyles, "bg-[#DEFBE6] text-[#198038] border border-[#A7F0BA]")}>Verified</span>;
  }
  if (s.includes("rejected") || s.includes("reject") || s.includes("inactive")) {
    return <span className={cn(baseStyles, "bg-[#FFF1F1] text-[#DA1E28] border border-[#FFD7D9]")}>Rejected</span>;
  }
  return <span className={cn(baseStyles, "bg-gray-100 text-gray-700")}>{status}</span>;
};

const formatDateOnly = (val: string) => {
  if (!val) return "2025-02-13";
  const datePart = val.includes('T') ? val.split('T')[0] : (val.includes(' ') ? val.split(' ')[0] : val);
  if (datePart.includes('/')) {
    const parts = datePart.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return datePart;
};

export function PendingVerificationPage({ 
  scenarios, 
  events,
  udvs,
  secs,
  views,
  virtualEnvs,
  workspaces = [],
  settings = [],
  initialTab = "all",
  breadcrumbs, 
  onBreadcrumbNavigate, 
  onVerifyScenario, 
  onRejectScenario,
  onVerifyEvent,
  onRejectEvent,
  onVerifyUDV,
  onRejectUDV,
  onVerifySEC,
  onRejectSEC,
  onVerifyView,
  onRejectView,
  onVerifyVirtualEnv,
  onRejectVirtualEnv,
  onVerifyWorkspace,
  onRejectWorkspace,
  onVerifySettings,
  onRejectSettings
}: PendingVerificationPageProps) {
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Initialize from prop directly to ensure immediate tab alignment on redirect
  const [artifactFilter, setArtifactFilter] = useState(initialTab === "all" ? "all" : initialTab);
  const [workspaceFilter, setWorkspaceFilter] = useState("all");

  // Sync state with prop for direct redirection support - force filter change
  useEffect(() => {
    if (initialTab && initialTab !== "all") {
      setArtifactFilter(initialTab);
      setCurrentPage(1);
    }
  }, [initialTab]);

  // Combine all data with artifact type tag and ensure recent pending items are included
  const allData = useMemo(() => {
    const pickDiverse = (items: any[], count: number, type: string) => {
      // Prioritize pending items
      const pendingItems = items.filter(i => (i.status || "").toLowerCase().includes("pending"));
      const otherItems = items.filter(i => !(i.status || "").toLowerCase().includes("pending"));
      
      const result: any[] = [...pendingItems.slice(0, 10)]; // Keep up to 10 most recent pending
      
      const statuses = ["Rejected", "Verified", "Draft"];
      const grouped: Record<string, any[]> = {};
      
      otherItems.forEach(item => {
        const status = item.status || "Draft";
        if (!grouped[status]) grouped[status] = [];
        grouped[status].push(item);
      });

      let added = true;
      while (result.length < count && added) {
        added = false;
        for (const status of statuses) {
          if (grouped[status] && grouped[status].length > 0 && result.length < count) {
            result.push(grouped[status].shift());
            added = true;
          }
        }
      }
      return result;
    };

    const data = [
      ...pickDiverse(scenarios, 8, "scenario").map(s => ({ ...s, artifactType: "scenario", name: s.name, workspace: s.workspace || s.entity || "Transaction", lastModified: s.lastModified || s.lastModifiedDate || s.createdOn || s.date || "2025-02-13" })),
      ...pickDiverse(events, 8, "event").map(e => ({ ...e, artifactType: "event", name: e.eventName || e.name, workspace: e.workspace || e.entity || "Transaction", lastModified: e.lastModified || e.lastModifiedDate || e.createdOn || e.date || "2025-02-13" })),
      ...pickDiverse(udvs, 8, "udv").map(u => ({ ...u, artifactType: "udv", name: u.name, workspace: u.workspace || u.entity || "Transaction", lastModified: u.lastModified || u.lastModifiedDate || u.createdOn || u.date || "2025-02-13" })),
      ...pickDiverse(secs, 8, "sec").map(s => ({ ...s, artifactType: "sec", name: s.controlName || s.name, workspace: s.workspace || s.entity || "Transaction", lastModified: s.lastModified || s.lastModifiedDate || s.createdOn || s.date || "2025-02-13" })),
      ...pickDiverse(views, 8, "view").map(v => ({ ...v, artifactType: "view", name: v.viewName || v.name, workspace: v.workspace || v.entity || "Transaction", lastModified: v.lastModified || v.lastModifiedDate || v.createdOn || v.date || "2025-02-13" })),
      ...pickDiverse(virtualEnvs, 8, "virtual-se").map(v => ({ ...v, artifactType: "virtual-se", name: v.envName || v.name, workspace: v.workspace || v.entity || "Transaction", lastModified: v.lastModified || v.lastModifiedDate || v.createdOn || v.date || "2025-02-13" })),
      ...pickDiverse(workspaces, 8, "workspace").map(w => ({ ...w, artifactType: "workspace", name: w.workspaceName || w.name, workspace: w.workspaceName || w.workspace || "System", lastModified: w.lastModified || w.lastModifiedDate || w.submittedAt || w.date || "2025-02-13" })),
      ...pickDiverse(settings || [], 8, "settings").map(st => ({ ...st, artifactType: "settings", name: `${st.workspaceName || st.name} - Settings`, workspace: st.workspaceName || st.workspace || "System", lastModified: st.lastModified || st.lastModifiedDate || st.submittedAt || st.date || "2025-02-13" })),
    ];
    return data;
  }, [scenarios, events, udvs, secs, views, virtualEnvs, workspaces, settings]);

  const filteredData = useMemo(() => {
    return allData.filter(item => {
      const matchesSearch = (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.id || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesArtifact = artifactFilter === "all" || item.artifactType === artifactFilter;
      
      const itemWorkspace = item.workspace || (item.entity) || "Transaction";
      const matchesWorkspace = workspaceFilter === "all" || itemWorkspace === workspaceFilter;

      return matchesSearch && matchesArtifact && matchesWorkspace;
    });
  }, [allData, searchTerm, artifactFilter, workspaceFilter]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData, { key: 'lastModified' as any, direction: 'desc' });

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden font-['Inter'] relative">
      <PageHeader 
        title="Pending Verification" 
        breadcrumbs={breadcrumbs} 
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
      />
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Unified Filter Bar - Optimized for Density */}
        <div className="flex-none flex items-center justify-between bg-white h-[48px] mb-4 gap-4">
          <div className="flex items-center gap-3 h-full flex-1">
            {/* Search */}
            <div className="relative w-[280px] h-[46px] flex items-center self-center">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search by name, ID or desc..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full h-full pl-11 pr-4 bg-white border border-gray-300 rounded-[8px] text-[13px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
              />
            </div>

            {/* Artifact Filter */}
            <div className="relative h-[46px] flex items-center self-center">
               <select 
                 value={artifactFilter}
                 onChange={(e) => { setArtifactFilter(e.target.value); setCurrentPage(1); }}
                 className="bg-white border border-gray-300 rounded-[8px] h-full px-4 pr-10 text-[13px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[160px] font-medium"
               >
                   {ARTIFACT_TYPES.map(type => (
                     <option key={type.id} value={type.id}>{type.label}</option>
                   ))}
               </select>
               <div className="absolute right-3 pointer-events-none text-gray-500">
                  <ChevronDown size={14} />
               </div>
            </div>

            {/* Workspace Filter */}
            <div className="relative h-[46px] flex items-center self-center">
               <select 
                 value={workspaceFilter}
                 onChange={(e) => { setWorkspaceFilter(e.target.value); setCurrentPage(1); }}
                 className="bg-white border border-gray-300 rounded-[8px] h-full px-4 pr-10 text-[13px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[160px] font-medium"
               >
                   {WORKSPACES.map(ws => (
                     <option key={ws.id} value={ws.id}>{ws.label}</option>
                   ))}
               </select>
               <div className="absolute right-3 pointer-events-none text-gray-500">
                  <ChevronDown size={14} />
               </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#525252] shrink-0">
             <Information size={14} className="text-[#2A53A0]" />
             <span className="text-[12px] font-medium">{filteredData.length} Artifacts found</span>
          </div>
        </div>

        {/* Unified Table Section */}
        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="flex-1 hover-scroll bg-white">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                  <tr className="bg-[#F0F0F0] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                    <th className="px-4 border-b border-[#e0e0e0] w-[20%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="name" label="Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[14%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="artifactType" label="Type" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[14%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="workspace" label="Workspace" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[22%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="description" label="Description" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="lastModified" label="Last Updated" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[12%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="status" label="Status" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[8%] text-center align-middle select-none">
                      <span className="text-[13px] font-semibold text-[#2A53A0]">Actions</span>
                    </th>
                  </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData.length > 0 ? paginatedData.map((row) => (
                  <tr key={row.id} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
                    <td className="px-4 align-middle">
                      <div className="flex items-center gap-2 truncate">
                        {(() => {
                          const Icon = getArtifactIcon(row.artifactType);
                          return <Icon size={16} className="text-[#2A53A0] shrink-0" />;
                        })()}
                        <span className="text-[13px] text-[#161616] font-medium truncate block" title={row.name}>
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 align-middle">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 h-[26px] rounded-md text-[11px] font-medium border",
                        getArtifactBadgeStyle(row.artifactType)
                      )}>
                        {(() => {
                          const Icon = getArtifactIcon(row.artifactType);
                          return <Icon size={12} />;
                        })()}
                        <span>{row.artifactType === 'udv' ? 'UDV' : row.artifactType === 'sec' ? 'SEC' : row.artifactType.charAt(0).toUpperCase() + row.artifactType.slice(1).replace("-", " ")}</span>
                      </div>
                    </td>
                    <td className="px-4 align-middle">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-2.5 h-[26px] rounded-md text-[11px] font-medium whitespace-nowrap",
                        getWorkspaceColor(row.workspace || row.entity || "Transaction")
                      )}>
                        {(() => {
                          const Icon = getWorkspaceIcon(row.workspace || row.entity || "Transaction");
                          return <Icon size={12} className="shrink-0" />;
                        })()}
                        <span>{row.workspace || row.entity || "Transaction"}</span>
                      </div>
                    </td>
                    <td className="px-4 align-middle">
                      <div className="flex flex-col gap-0.5 max-w-full">
                        <span className="text-[13px] text-[#161616] font-medium truncate" title={row.description}>
                          {row.fieldChanges && row.fieldChanges.length > 0 
                            ? `${row.fieldChanges.length} Changes: ${row.fieldChanges.map((c: any) => c.name).join(", ")}` 
                            : (row.description || "Updated configuration")}
                        </span>
                        {row.fieldChanges && row.fieldChanges.length > 0 && (
                          <div className="flex gap-1 overflow-hidden">
                             {row.fieldChanges.slice(0, 2).map((c: any, i: number) => (
                               <Badge key={i} className="bg-blue-50 text-[9px] text-blue-600 border-0 h-4 px-1">{c.status}</Badge>
                             ))}
                             {row.fieldChanges.length > 2 && <span className="text-[9px] text-gray-400">+{row.fieldChanges.length - 2} more</span>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 align-middle">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#161616]">
                        <Calendar size={14} className="text-[#2A53A0] opacity-70" />
                        <span>{formatDateOnly(row.lastModified)}</span>
                      </div>
                    </td>
                    <td className="px-4 align-middle">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="px-4 align-middle">
                      <div className="flex items-center justify-center">
                        <button 
                          className="w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F2F0FF] hover:bg-[#E1DBFF] rounded-md transition-colors text-[#6929C4] border border-[#E1DBFF]" 
                          title="Verify" 
                          onClick={() => {
                            if (row.artifactType === 'scenario') onVerifyScenario(row.id);
                            else if (row.artifactType === 'event') onVerifyEvent(row.id);
                            else if (row.artifactType === 'udv') onVerifyUDV(row.id);
                            else if (row.artifactType === 'sec') onVerifySEC(row.id);
                            else if (row.artifactType === 'view') onVerifyView(row.id);
                            else if (row.artifactType === 'virtual-se') onVerifyVirtualEnv(row.id);
                            else if (row.artifactType === 'workspace' && onVerifyWorkspace) onVerifyWorkspace(row.id);
                            else if (row.artifactType === 'settings' && onVerifySettings) onVerifySettings(row.id);
                          }}
                        >
                          <Security size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="h-[200px] text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                         <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                            <CheckmarkOutline size={40} className="opacity-20" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-[15px] font-medium text-gray-600">No artifacts pending verification</p>
                            <p className="italic text-[13px] text-gray-400">Try adjusting your filters or search term.</p>
                         </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <CarbonPaginationFooter 
            totalItems={filteredData.length}
            pageSize={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setPageSize={(size) => { setPageSize(size); setCurrentPage(1); }}
          />
        </div>
      </div>
    </div>
  );
}