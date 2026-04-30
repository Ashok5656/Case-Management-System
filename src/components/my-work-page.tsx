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
  TrashCan,
  Edit,
  Launch,
  Undo,
  ViewFilled,
  WarningFilled,
  Time,
  Hourglass,
  CheckmarkFilled,
  CloseFilled,
  CloudUpload,
  Purchase,
  Chat,
  Add,
  CircleFilled,
  Copy,
  ViewMode_2,
  Close
} from "@carbon/icons-react";
import PageHeader from "./page-header";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CarbonPaginationFooter } from "./carbon-pagination-footer";
import { useSortableData } from "../hooks/use-sortable-data";
import { SortableHeader } from "./ui/sortable-header";
import { cn } from "./ui/utils";

interface MyWorkPageProps {
  draftScenarios: any[];
  draftEvents: any[];
  draftUDV: any[];
  draftSEC: any[];
  draftViews: any[];
  draftVirtualEnvs: any[];
  onSelectScenario: (id: string) => void;
  onSelectEvent: (id: string) => void;
  onSelectUDV: (id: string) => void;
  onSelectSEC: (id: string) => void;
  onSelectView: (id: string) => void;
  onSelectVirtualEnv: (id: string) => void;
  onViewScenarioDetails: (id: string) => void;
  onViewEventDetails: (id: string) => void;
  onViewUDVDetails: (id: string) => void;
  onViewSECDetails: (id: string) => void;
  onViewViewDetails: (id: string) => void;
  onDeleteDraft: (type: string, id: string) => void;
  initialTab?: string;
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
}

export function MyWorkPage({
  draftScenarios,
  draftEvents,
  draftUDV,
  draftSEC,
  draftViews,
  draftVirtualEnvs,
  onSelectScenario,
  onSelectEvent,
  onSelectUDV,
  onSelectSEC,
  onSelectView,
  onSelectVirtualEnv,
  onViewScenarioDetails,
  onViewEventDetails,
  onViewUDVDetails,
  onViewSECDetails,
  onViewViewDetails,
  onDeleteDraft,
  initialTab = "all",
  breadcrumbs,
  onBreadcrumbNavigate
}: MyWorkPageProps) {
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [artifactFilter, setArtifactFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedComment, setSelectedComment] = useState<{name: string, comment: string} | null>(null);

  const ARTIFACT_TYPES = [
    { id: "all", label: "All Artifacts" },
    { id: "scenario", label: "Scenario", icon: Flow },
    { id: "event", label: "Event", icon: Flash },
    { id: "udv", label: "UDV", icon: Catalog },
    { id: "sec", label: "SEC", icon: Security },
    { id: "view", label: "View", icon: View },
    { id: "virtual-se", label: "Virtual SE", icon: VirtualMachine },
  ];

  const STATUS_OPTIONS = [
    { id: "all", label: "All Statuses" },
    { id: "Draft", label: "Draft" },
    { id: "Pending Approval", label: "Pending Approval" },
    { id: "Rejected", label: "Rejected" },
    { id: "Verified", label: "Verified" }
  ];

  const getArtifactIcon = (type: string = "scenario", name: string = "") => {
    switch (type) {
      case "scenario": return Flow;
      case "event": return Flash;
      case "udv": return Catalog;
      case "sec": return Security;
      case "view": return View;
      case "virtual-se": return VirtualMachine;
      default: {
        const lower = name.toLowerCase();
        if (lower.includes("card")) return Purchase;
        if (lower.includes("wire") || lower.includes("money") || lower.includes("fund")) return Money;
        return Catalog;
      }
    }
  };

    const getStatusBadge = (status: string = "Draft") => {
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

  const getCategoryBadge = (category: string = "Custom") => {
    const isOOTB = category.toUpperCase() === "OOTB" || category === "System" || category === "ootb";
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2.5 h-[26px] rounded-md text-[11px] font-medium border w-fit whitespace-nowrap",
        isOOTB 
          ? "bg-[#EDF5FF] text-[#0043CE] border-[#D0E2FF]" 
          : "bg-[#F1FBFA] text-[#005D5D] border-[#A7F0BA]"
      )}>
        {isOOTB ? <Security size={12} /> : <CheckmarkFilled size={12} className="text-green-500" />}
        <span>{isOOTB ? "OOTB" : "Custom"}</span>
      </div>
    );
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case "Mixed": return "bg-[#E8DAFF] text-[#491D8B] border-[#D4BBFF]";
      case "Field Addition": return "bg-[#D9FBFB] text-[#005D5D] border-[#3DDBD9]";
      case "Logic Edit": return "bg-[#D0E2FF] text-[#002D9C] border-[#A6C8FF]";
      case "Threshold Edit": return "bg-[#FFD7E1] text-[#750E13] border-[#FFB3B8]";
      case "Field Selection": return "bg-[#E0E0E0] text-[#161616] border-[#8D8D8D]";
      case "Environment Config": return "bg-[#DEFBE6] text-[#198038] border-[#A7F0BA]";
      default: return "bg-[#E5F6FF] text-[#0043CE] border-[#D0E2FF]";
    }
  };

  const allData = useMemo(() => {
    const formatId = (id: string, type: string) => {
      if (!id) return `SUB-${Math.floor(10000 + Math.random() * 90000)}`;
      if (id.length <= 4) return `SUB-${type.substring(0, 3).toUpperCase()}-${id.toUpperCase()}`;
      return id;
    };

    const pickDiverse = (items: any[], count: number, type: string) => {
      const statuses = ["Draft", "Pending Approval", "Rejected", "Verified"];
      const grouped: Record<string, any[]> = {};
      
      items.forEach(item => {
        const status = item.status === "Drafted" ? "Draft" : (item.status || "Draft");
        if (!grouped[status]) grouped[status] = [];
        grouped[status].push(item);
      });

      const result: any[] = [];
      let added = true;
      while (result.length < count && added) {
        added = false;
        for (const status of statuses) {
          if (grouped[status] && grouped[status].length > 0 && result.length < count) {
            result.push(grouped[status].shift());
            added = true;
          }
        }
        // Check for any other statuses not in the main list
        for (const status in grouped) {
          if (!statuses.includes(status) && grouped[status].length > 0 && result.length < count) {
            result.push(grouped[status].shift());
            added = true;
          }
        }
      }
      return result;
    };

    const scenarioItems = pickDiverse(draftScenarios, 7, "scenario").map((s) => ({ 
      ...s, 
      originalId: s.id,
      id: formatId(s.id, "scenario"),
      artifactType: "scenario", 
      name: s.name, 
      category: s.category || "Custom", 
      changeType: s.changeType || "Mixed", 
      status: s.status === "Drafted" ? "Draft" : (s.status || "Draft"),
      createdOn: s.createdOn || s.date || "2025-01-15",
      lastModified: s.lastModified || s.lastModifiedDate || s.createdOn || s.date || "2025-02-13"
    }));
    const eventItems = pickDiverse(draftEvents, 7, "event").map((e) => ({ 
      ...e, 
      originalId: e.id,
      id: formatId(e.id, "event"),
      artifactType: "event", 
      name: e.eventName || e.name, 
      category: e.category || "Custom", 
      changeType: e.changeType || "Field Addition", 
      status: e.status === "Drafted" ? "Draft" : (e.status || "Draft"),
      createdOn: e.createdOn || e.date || "2025-01-15",
      lastModified: e.lastModified || e.lastModifiedDate || e.createdOn || e.date || "2025-02-13"
    }));
    const udvItems = pickDiverse(draftUDV, 7, "udv").map((u) => ({ 
      ...u, 
      originalId: u.id,
      id: formatId(u.id, "udv"),
      artifactType: "udv", 
      name: u.name, 
      category: u.category || "Custom", 
      changeType: u.changeType || "Logic Edit", 
      status: u.status === "Drafted" ? "Draft" : (u.status || "Draft"),
      createdOn: u.createdOn || u.date || "2025-01-15",
      lastModified: u.lastModified || u.lastModifiedDate || u.createdOn || u.date || "2025-02-13"
    }));
    const secItems = pickDiverse(draftSEC, 7, "sec").map((s) => ({ 
      ...s, 
      originalId: s.id,
      id: formatId(s.id, "sec"),
      artifactType: "sec", 
      name: s.controlName || s.name, 
      category: s.category || "Custom", 
      changeType: s.changeType || "Threshold Edit", 
      status: s.status === "Drafted" ? "Draft" : (s.status || "Draft"),
      createdOn: s.createdOn || s.createdDate || s.date || "2025-01-15",
      lastModified: s.lastModified || s.lastModifiedDate || s.createdOn || s.date || "2025-02-13"
    }));
    const viewItems = pickDiverse(draftViews, 7, "view").map((v) => ({ 
      ...v, 
      originalId: v.id,
      id: formatId(v.id, "view"),
      artifactType: "view", 
      name: v.viewName || v.name, 
      category: v.category || "Custom", 
      changeType: v.changeType || "Field Selection", 
      status: v.status === "Drafted" ? "Draft" : (v.status || "Draft"),
      createdOn: v.createdOn || v.date || "2025-01-15",
      lastModified: v.lastModified || v.lastModifiedDate || v.createdOn || v.date || "2025-02-13"
    }));
    const vEnvItems = pickDiverse(draftVirtualEnvs, 7, "virtual-se").map((v) => ({ 
      ...v, 
      originalId: v.id,
      id: formatId(v.id, "venv"),
      artifactType: "virtual-se", 
      name: v.envName || v.name, 
      category: v.category || "Custom", 
      changeType: v.changeType || "Environment Config", 
      status: v.status === "Drafted" ? "Draft" : (v.status || "Draft"),
      createdOn: v.createdOn || v.date || "2025-01-15",
      lastModified: v.lastModified || v.lastModifiedDate || v.createdOn || v.date || "2025-02-13"
    }));

    return [...scenarioItems, ...eventItems, ...udvItems, ...secItems, ...viewItems, ...vEnvItems];
  }, [draftScenarios, draftEvents, draftUDV, draftSEC, draftViews, draftVirtualEnvs]);

  const filteredData = useMemo(() => {
    return allData.filter(item => {
      const name = item.name || "";
      const description = item.description || "";
      const id = item.id || "";
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArtifact = artifactFilter === "all" || item.artifactType === artifactFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesArtifact && matchesStatus;
    });
  }, [allData, searchTerm, artifactFilter, statusFilter]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData, { key: 'lastModified' as any, direction: 'desc' });

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  useEffect(() => {
    if (initialTab && initialTab !== "all") {
      setArtifactFilter(initialTab);
      setCurrentPage(1);
    }
  }, [initialTab]);

  const handleEdit = (row: any) => {
    const originalId = row.originalId || row.id;
    console.log("Navigating to edit artifact:", row.artifactType, originalId);
    switch (row.artifactType) {
      case "scenario": onSelectScenario(originalId); break;
      case "event": onSelectEvent(originalId); break;
      case "udv": onSelectUDV(originalId); break;
      case "sec": onSelectSEC(originalId); break;
      case "view": onSelectView(originalId); break;
      case "virtual-se": onSelectVirtualEnv(originalId); break;
    }
  };

  const handleView = (row: any) => {
    const originalId = row.originalId || row.id;
    console.log("Navigating to view artifact details:", row.artifactType, originalId);
    switch (row.artifactType) {
      case "scenario": onViewScenarioDetails(originalId); break;
      case "event": onViewEventDetails(originalId); break;
      case "udv": onViewUDVDetails(originalId); break;
      case "sec": onViewSECDetails(originalId); break;
      case "view": onViewViewDetails(originalId); break;
      default: handleEdit(row); break; 
    }
  };

  const renderActions = (row: any) => {
    const status = row.status || "Draft";
    const iconBtnStyle = "w-[28px] h-[28px] flex items-center justify-center rounded-md transition-colors border shadow-sm shrink-0";
    
    // Action Colors
    const colors = {
      edit: "bg-[#EDF5FF] hover:bg-[#D0E2FF] text-[#0043CE] border-[#D0E2FF]",
      delete: "bg-[#FFF1F1] hover:bg-[#FFD7D9] text-[#DA1E28] border-[#FFD7D9]",
      submit: "bg-[#DEFBE6] hover:bg-[#A7F0BA] text-[#198038] border-[#A7F0BA]",
      view: "bg-[#F4F4F4] hover:bg-[#E0E0E0] text-[#161616] border-[#E0E0E0]",
      recall: "bg-[#FFF9E5] hover:bg-[#FDEBB2] text-[#B28600] border-[#FDEBB2]",
      comment: "bg-[#D9FBFB] hover:bg-[#3DDBD9] text-[#007D79] border-[#3DDBD9]",
      clone: "bg-[#F6F2FF] hover:bg-[#E8DAFF] text-[#8A3FFC] border-[#E8DAFF]"
    };

    if (status === "Draft") {
      return (
        <div className="flex items-center gap-1.5">
          <button className={cn(iconBtnStyle, colors.edit)} title="Edit" onClick={() => handleEdit(row)}><Edit size={14} /></button>
          <button className={cn(iconBtnStyle, colors.delete)} title="Delete" onClick={() => onDeleteDraft(row.artifactType, row.id)}><TrashCan size={14} /></button>
          <button className={cn(iconBtnStyle, colors.submit)} title="Submit for Approval"><CloudUpload size={14} /></button>
        </div>
      );
    }

    if (status === "Pending Approval") {
      return (
        <div className="flex items-center gap-1.5">
          <button className={cn(iconBtnStyle, colors.view)} title="View" onClick={() => handleView(row)}><View size={14} /></button>
          <button className={cn(iconBtnStyle, colors.recall)} title="Recall Submission"><Undo size={14} /></button>
        </div>
      );
    }

    if (status === "Rejected") {
      return (
        <div className="flex items-center gap-1.5">
          <button className={cn(iconBtnStyle, colors.view)} title="View" onClick={() => handleView(row)}><View size={14} /></button>
          <button className={cn(iconBtnStyle, colors.edit)} title="Edit" onClick={() => handleEdit(row)}><Edit size={14} /></button>
          <button className={cn(iconBtnStyle, colors.delete)} title="Delete" onClick={() => onDeleteDraft(row.artifactType, row.id)}><TrashCan size={14} /></button>
          <button 
            className={cn(iconBtnStyle, colors.comment)} 
            title="View Rejected Comment"
            onClick={() => setSelectedComment({ name: row.name, comment: row.statusNote || "No rejection comment provided." })}
          >
            <Chat size={14} />
          </button>
        </div>
      );
    }

    if (status === "Verified" || status === "Active" || status === "Inactive" || status === "Completed") {
      return (
        <div className="flex items-center gap-1.5">
          <button className={cn(iconBtnStyle, colors.view)} title="View" onClick={() => handleView(row)}><View size={14} /></button>
          <button className={cn(iconBtnStyle, colors.clone)} title="Clone"><Copy size={14} /></button>
        </div>
      );
    }

    // Fallback for any other status
    return (
      <div className="flex items-center gap-1.5">
        <button className={cn(iconBtnStyle, colors.view)} title="View Detail" onClick={() => handleView(row)}><View size={14} /></button>
      </div>
    );
  };

  const formatDateOnly = (val: string) => {
    if (!val) return "2025-02-13";
    const datePart = val.includes('T') ? val.split('T')[0] : (val.includes(' ') ? val.split(' ')[0] : val);
    if (datePart.includes('/')) {
      const parts = datePart.split('/');
      if (parts.length === 3) {
        // Assume DD/MM/YYYY
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return datePart;
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden font-['Inter'] relative">
      <PageHeader 
        title="My Work" 
        breadcrumbs={breadcrumbs} 
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
      />
      <div className="flex-1 flex flex-col p-4 overflow-hidden space-y-4">
        {/* Unified Filter Bar */}
        <div className="flex-none flex items-center justify-between bg-white h-[48px] px-0 gap-4">
          <div className="flex items-center gap-3 h-full flex-1">
            <div className="relative w-[280px] h-[46px] flex items-center self-center">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"><Search size={16} /></div>
              <input 
                type="text" 
                placeholder="Search your artifacts..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full h-full pl-11 pr-4 bg-white border border-gray-300 rounded-[8px] text-[13px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
              />
            </div>
            <div className="relative h-[46px] flex items-center self-center">
               <select 
                 value={artifactFilter}
                 onChange={(e) => { setArtifactFilter(e.target.value); setCurrentPage(1); }}
                 className="bg-white border border-gray-300 rounded-[8px] h-full px-4 pr-10 text-[13px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[160px] font-medium"
               >
                   {ARTIFACT_TYPES.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
               </select>
               <div className="absolute right-3 pointer-events-none text-gray-500"><ChevronDown size={14} /></div>
            </div>
            <div className="relative h-[46px] flex items-center self-center">
               <select 
                 value={statusFilter}
                 onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                 className="bg-white border border-gray-300 rounded-[8px] h-full px-4 pr-10 text-[13px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[160px] font-medium"
               >
                   {STATUS_OPTIONS.map(status => <option key={status.id} value={status.id}>{status.label}</option>)}
               </select>
               <div className="absolute right-3 pointer-events-none text-gray-500"><ChevronDown size={14} /></div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#525252] shrink-0">
             <Information size={14} className="text-[#2A53A0]" />
             <span className="text-[12px] font-medium">{filteredData.length} Artifacts found</span>
          </div>
        </div>

        {/* Unified Table */}
        <div className="flex-1 flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
          <div className="flex-1 overflow-x-hidden bg-white">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                  <tr className="bg-[#F4F4F4] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                    <th className="px-4 border-b border-[#e0e0e0] w-[11%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="id" label="Submission ID" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[22%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="name" label="Artifact Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[12%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="category" label="Category" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[12%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="changeType" label="Type" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="createdOn" label="Created On" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="lastModified" label="Modified On" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[12%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="status" label="Status" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[11%] text-left align-middle select-none">
                      <span className="text-[13px] font-semibold text-[#2A53A0]">Actions</span>
                    </th>
                  </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData.length > 0 ? paginatedData.map((row) => (
                  <tr key={row.id} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
                    <td className="px-4 align-middle"><span className="text-[13px] text-[#161616] font-medium truncate block">{row.id}</span></td>
                    <td className="px-4 align-middle">
                      <div className="flex items-center gap-2 truncate">
                         {(() => { const Icon = getArtifactIcon(row.artifactType, row.name); return <Icon size={16} className="text-[#2A53A0] shrink-0" />; })()}
                         <div className="flex flex-col min-w-0">
                           <span className="text-[13px] text-[#161616] font-medium truncate" title={row.name}>{row.name}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-4 pr-12 align-middle">
                       <div className="flex">{getCategoryBadge(row.category)}</div>
                    </td>
                    <td className="px-4 align-middle text-left">
                       <div className={cn("inline-flex items-center gap-1.5 px-2 h-[26px] rounded-md text-[11px] font-medium border w-fit whitespace-nowrap", getTypeBadgeStyle(row.changeType))}>
                          <Add size={12} className="shrink-0" />
                          <span className="truncate max-w-[70px]">{row.changeType || "Change"}</span>
                       </div>
                    </td>
                    <td className="px-4 align-middle"><span className="text-[13px] text-[#161616] font-medium whitespace-nowrap">{formatDateOnly(row.createdOn)}</span></td>
                    <td className="px-4 align-middle text-left"><span className="text-[13px] text-[#161616] font-medium whitespace-nowrap">{formatDateOnly(row.lastModified)}</span></td>
                    <td className="px-4 align-middle">{getStatusBadge(row.status)}</td>
                    <td className="px-4 align-middle">{renderActions(row)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="h-[240px] text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                         <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center"><CheckmarkOutline size={40} className="opacity-20" /></div>
                         <p className="text-[15px] font-medium text-gray-600">No artifacts found matching your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <CarbonPaginationFooter totalItems={filteredData.length} pageSize={pageSize} currentPage={currentPage} onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
        </div>
      </div>

      {/* Rejection Comment Modal */}
      {selectedComment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-[8px] shadow-2xl w-full max-w-[500px] overflow-hidden transform animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F4F4F4]">
              <div className="flex items-center gap-2">
                <Chat size={18} className="text-[#DA1E28]" />
                <h3 className="text-[15px] font-bold text-[#161616]">Rejection Comment</h3>
              </div>
              <button 
                onClick={() => setSelectedComment(null)}
                className="text-gray-400 hover:text-[#161616] transition-colors p-1"
              >
                <Close size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Artifact Name</span>
                <p className="text-[14px] font-semibold text-[#161616]">{selectedComment.name}</p>
              </div>
              
              <div className="bg-[#FFF1F1] border border-[#FFD7D9] rounded-[6px] p-4">
                <span className="text-[11px] font-bold text-[#DA1E28] uppercase tracking-widest block mb-2">Reviewer Feedback</span>
                <p className="text-[14px] text-[#161616] leading-relaxed italic">
                  "{selectedComment.comment}"
                </p>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <WarningFilled size={16} className="text-[#DA1E28]" />
                <p className="text-[12px] text-[#525252]">
                  Please address the comments above and resubmit for approval.
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <Button 
                className="h-[36px] px-6 bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-semibold rounded-[4px] text-[13px]"
                onClick={() => setSelectedComment(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
