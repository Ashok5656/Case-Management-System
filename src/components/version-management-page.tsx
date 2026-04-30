import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Time, 
  Undo, 
  View, 
  Compare,
  OverflowMenuVertical,
  CheckmarkFilled,
  WarningAltFilled,
  CircleDash,
  Information,
  Portfolio,
  Identification,
  Flash,
  Settings,
  User,
  Money,
  Enterprise,
  Document
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import { CarbonPaginationFooter } from "./carbon-pagination-footer";
import { useSortableData } from "../hooks/use-sortable-data";
import { SortableHeader } from "./ui/sortable-header";

interface VersionHistoryItem {
  version: string;
  modifiedAt: string;
  modifiedBy: string;
  changeLog: string;
  status: "Active" | "Archived" | "Draft";
}

interface ScenarioVersion {
  id: string;
  name: string;
  currentVersion: string;
  lastModified: string;
  modifiedBy: string;
  status: "Active" | "Inactive" | "Draft";
  workspace: string;
  history: VersionHistoryItem[];
}

const MOCK_VERSION_DATA: ScenarioVersion[] = [
  {
    id: "SCN-1082",
    name: "High Value Transaction Pattern",
    currentVersion: "v2.4",
    lastModified: "2024-12-16 10:45 AM",
    modifiedBy: "Rajesh Kumar",
    status: "Active",
    workspace: "Account",
    history: [
      { version: "v2.4", modifiedAt: "2024-12-16 10:45 AM", modifiedBy: "Rajesh Kumar", changeLog: "Updated threshold to $50,000", status: "Active" },
      { version: "v2.3", modifiedAt: "2024-11-20 02:15 PM", modifiedBy: "Sarah Johnson", changeLog: "Fixed false positive on corporate accounts", status: "Archived" }
    ]
  },
  {
    id: "SCN-1081",
    name: "Velocity Check - Card",
    currentVersion: "v1.8",
    lastModified: "2024-12-15 03:20 PM",
    modifiedBy: "Sarah Johnson",
    status: "Active",
    workspace: "Card",
    history: [
      { version: "v1.8", modifiedAt: "2024-12-15 03:20 PM", modifiedBy: "Sarah Johnson", changeLog: "Added MCC exclusions", status: "Active" }
    ]
  },
  {
    id: "SCN-1080",
    name: "Geographic Anomaly Detection",
    currentVersion: "v3.1",
    lastModified: "2024-12-14 09:12 AM",
    modifiedBy: "Sarah Johnson",
    status: "Inactive",
    workspace: "Transaction",
    history: [
      { version: "v3.1", modifiedAt: "2024-12-14 09:12 AM", modifiedBy: "Sarah Johnson", changeLog: "Disabled due to API latency", status: "Draft" }
    ]
  },
  {
    id: "SCN-1079",
    name: "Account Dormancy Alert",
    currentVersion: "v1.0",
    lastModified: "2024-12-12 01:30 PM",
    modifiedBy: "Emma Davis",
    status: "Draft",
    workspace: "Account",
    history: [
      { version: "v1.0", modifiedAt: "2024-12-12 01:30 PM", modifiedBy: "Emma Davis", changeLog: "Initial draft", status: "Draft" }
    ]
  },
  {
    id: "SCN-1078",
    name: "Structured Deposit Monitor",
    currentVersion: "v2.1",
    lastModified: "2024-12-10 11:20 AM",
    modifiedBy: "Michael Chen",
    status: "Active",
    workspace: "Transaction",
    history: [
      { version: "v2.1", modifiedAt: "2024-12-10 11:20 AM", modifiedBy: "Michael Chen", changeLog: "Refined structuring patterns", status: "Active" }
    ]
  },
  {
    id: "SCN-1077",
    name: "Rapid Withdrawal Sequence",
    currentVersion: "v1.5",
    lastModified: "2024-12-08 04:45 PM",
    modifiedBy: "Sarah Johnson",
    status: "Active",
    workspace: "Card",
    history: [
      { version: "v1.5", modifiedAt: "2024-12-08 04:45 PM", modifiedBy: "Sarah Johnson", changeLog: "Updated timeout parameters", status: "Active" }
    ]
  },
  {
    id: "SCN-1076",
    name: "Merchant Category Deviation",
    currentVersion: "v4.0",
    lastModified: "2024-12-05 02:10 PM",
    modifiedBy: "Rajesh Kumar",
    status: "Active",
    workspace: "Card",
    history: [
      { version: "v4.0", modifiedAt: "2024-12-05 02:10 PM", modifiedBy: "Rajesh Kumar", changeLog: "Full rewrite for v4", status: "Active" }
    ]
  },
  {
    id: "SCN-1075",
    name: "KYC Information Update Frequency",
    currentVersion: "v1.2",
    lastModified: "2024-12-01 09:00 AM",
    modifiedBy: "Emma Davis",
    status: "Active",
    workspace: "Customer",
    history: [
      { version: "v1.2", modifiedAt: "2024-12-01 09:00 AM", modifiedBy: "Emma Davis", changeLog: "Added PII change tracking", status: "Active" }
    ]
  },
  {
    id: "SCN-1074",
    name: "Inter-Account Transfer Chain",
    currentVersion: "v2.0",
    lastModified: "2024-11-28 11:15 AM",
    modifiedBy: "Michael Chen",
    status: "Inactive",
    workspace: "Account",
    history: [
      { version: "v2.0", modifiedAt: "2024-11-28 11:15 AM", modifiedBy: "Michael Chen", changeLog: "Deprecated in favor of SCN-2000", status: "Archived" }
    ]
  },
  {
    id: "SCN-1073",
    name: "Sanctioned Entity Screen",
    currentVersion: "v5.2",
    lastModified: "2024-11-25 03:30 PM",
    modifiedBy: "Admin User",
    status: "Active",
    workspace: "Organization",
    history: [
      { version: "v5.2", modifiedAt: "2024-11-25 03:30 PM", modifiedBy: "Admin User", changeLog: "Updated OFAC list integration", status: "Active" }
    ]
  },
  {
    id: "SCN-1072",
    name: "ATM Location Discrepancy",
    currentVersion: "v1.1",
    lastModified: "2024-11-20 01:20 PM",
    modifiedBy: "Sarah Johnson",
    status: "Draft",
    workspace: "Card",
    history: [
      { version: "v1.1", modifiedAt: "2024-11-20 01:20 PM", modifiedBy: "Sarah Johnson", changeLog: "Refining geo-fencing", status: "Draft" }
    ]
  },
  {
    id: "SCN-1071",
    name: "Wire Transfer Source Consistency",
    currentVersion: "v2.3",
    lastModified: "2024-11-15 10:00 AM",
    modifiedBy: "Rajesh Kumar",
    status: "Active",
    workspace: "Transaction",
    history: [
      { version: "v2.3", modifiedAt: "2024-11-15 10:00 AM", modifiedBy: "Rajesh Kumar", changeLog: "Added SWIFT code validation", status: "Active" }
    ]
  }
];

interface VersionManagementPageProps {
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
}

import PageHeader from "./page-header";

export function VersionManagementPage({ breadcrumbs, onBreadcrumbNavigate }: VersionManagementPageProps) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [workspaceFilter, setWorkspaceFilter] = useState("all");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return MOCK_VERSION_DATA.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWorkspace = workspaceFilter === "all" || item.workspace === workspaceFilter;
      return matchesSearch && matchesWorkspace;
    });
  }, [searchTerm, workspaceFilter]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData);

  const selectedScenario = useMemo(() => 
    MOCK_VERSION_DATA.find(s => s.id === selectedScenarioId), 
    [selectedScenarioId]
  );

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

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className="flex flex-col h-full bg-white font-['Inter'] overflow-hidden">
      <PageHeader 
        title="Version Management" 
        breadcrumbs={breadcrumbs} 
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
      />
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Search and Action Bar - Matching Templates Page Style */}
      <div className="flex-none flex items-center justify-between bg-white h-[48px] mb-4">
        <div className="flex items-center gap-4 h-full">
          <div className="relative w-[300px] h-[46px] flex items-center">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Search scenarios by ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-12 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
            />
          </div>
          
          <div className="flex items-center h-full">
            <div className="relative h-[46px] flex items-center">
               <select 
                 value={workspaceFilter}
                 onChange={(e) => setWorkspaceFilter(e.target.value)}
                 className="bg-white border border-gray-300 rounded-[8px] h-full px-4 pr-10 text-[14px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[240px]"
               >
                 <option value="all">All Workspaces</option>
                 <option value="Account">Account</option>
                 <option value="Card">Card</option>
                 <option value="Transaction">Transaction</option>
               </select>
               <div className="absolute right-3 pointer-events-none text-gray-500">
                  <ChevronDown size={16} />
               </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center h-full gap-2">
           <div className="flex items-center gap-2 px-4 h-full bg-[#EAF2FF] border border-[#D0E2FF] rounded-[8px]">
              <Information size={18} className="text-[#2A53A0]" />
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-[#2A53A0] font-bold">Audit Policy</span>
                <span className="text-[12px] text-[#2A53A0] font-bold">Auto-Archiving: ON</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 border border-gray-200 rounded-[8px] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#F4F4F4] h-[48px] border-b border-gray-200">
                <th className="px-4 w-[32%] text-left">
                  <SortableHeader column="name" label="Scenario Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px]" />
                </th>
                <th className="px-4 w-[12%] text-left">
                  <SortableHeader column="workspace" label="Workspace" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px]" />
                </th>
                <th className="px-4 w-[10%] text-center">
                  <SortableHeader column="currentVersion" label="Version" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px] justify-center" />
                </th>
                <th className="px-4 w-[14%] text-left">
                  <SortableHeader column="lastModified" label="Updated At" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px]" />
                </th>
                <th className="px-4 w-[12%] text-left">
                  <SortableHeader column="modifiedBy" label="Updated By" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px]" />
                </th>
                <th className="px-4 w-[10%] text-center">
                  <SortableHeader column="status" label="Status" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px] justify-center" />
                </th>
                <th className="px-4 w-[10%] text-left">
                  <span className="text-[14px] font-semibold text-[#2A53A0]">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((scenario) => (
                <tr 
                  key={scenario.id} 
                  onClick={() => setSelectedScenarioId(scenario.id)}
                  className={cn(
                    "h-[46px] border-b border-gray-100 transition-colors cursor-pointer",
                    selectedScenarioId === scenario.id ? "bg-[#F0F7FF] border-l-4 border-l-[#2A53A0]" : "hover:bg-gray-50"
                  )}
                >
                  <td className={cn("px-4", selectedScenarioId === scenario.id ? "pl-3" : "px-4")}>
                    <span className="text-[14px] font-normal text-[#161616] truncate block">{scenario.name}</span>
                  </td>
                  <td className="px-4">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 h-[28px] rounded-md text-[11px] font-medium whitespace-nowrap w-fit",
                      getWorkspaceColor(scenario.workspace)
                    )}>
                      {(() => {
                        const Icon = getWorkspaceIcon(scenario.workspace);
                        return <Icon size={12} className="shrink-0" />;
                      })()}
                      <span>{scenario.workspace}</span>
                    </div>
                  </td>
                  <td className="px-4 text-center">
                    <Badge className="bg-[#EAF2FF] text-[#2A53A0] border border-[#D0E2FF] font-medium text-[11px] h-6 px-2.5 rounded-sm">
                      {scenario.currentVersion}
                    </Badge>
                  </td>
                  <td className="px-4">
                    <span className="text-[14px] text-[#161616] font-normal font-mono">{scenario.lastModified}</span>
                  </td>
                  <td className="px-4">
                    <span className="text-[14px] text-[#161616] font-normal">{scenario.modifiedBy}</span>
                  </td>
                  <td className="px-4 text-center">
                    <Badge className={cn(
                      "rounded-full font-medium text-[11px] px-3 border-0 uppercase h-[28px] flex items-center justify-center whitespace-nowrap",
                      scenario.status === "Active" ? "bg-[#DEFBE6] text-[#198038]" : 
                      scenario.status === "Draft" ? "bg-[#EAF2FF] text-[#2A53A0]" : "bg-[#F4F4F4] text-[#525252]"
                    )}>
                      {scenario.status}
                    </Badge>
                  </td>
                  <td className="px-4">
                    <div className="flex items-center justify-start gap-2">
                      <button 
                        className="w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#E6F6F4] hover:bg-[#D1EBE7] rounded-[8px] transition-colors text-[#005D5D]" 
                        title="View History"
                      >
                        <Time size={16} />
                      </button>
                      <button 
                        className="w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F2F0FF] hover:bg-[#E1DBFF] rounded-[8px] transition-colors text-[#6929C4]" 
                        title="Compare Versions"
                      >
                        <Compare size={16} />
                      </button>
                      <button 
                        className="w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#FFF1F1] hover:bg-[#FFD7D9] rounded-[8px] transition-colors text-[#DA1E28]" 
                        title="Rollback Version"
                      >
                        <Undo size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CarbonPaginationFooter 
          pageSize={pageSize} 
          setPageSize={setPageSize} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          totalItems={sortedData.length} 
        />
      </div>

      {/* Version History Detail View */}
      <div className="mt-4 flex flex-col gap-4">
        {selectedScenario ? (
          <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Time size={18} className="text-[#2A53A0]" />
                <h3 className="text-[14px] font-bold text-[#161616]">Version History: {selectedScenario.name}</h3>
                <Badge className="bg-white border border-gray-300 text-gray-600 font-mono text-[10px]">
                  {selectedScenario.id}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[12px] text-[#2A53A0] hover:underline font-bold uppercase tracking-wider">Compare All Versions</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white h-[36px] border-b border-gray-100">
                    <th className="px-4 text-[11px] font-bold text-[#2A53A0] uppercase tracking-wider w-[10%]">Version</th>
                    <th className="px-4 text-[11px] font-bold text-[#2A53A0] uppercase tracking-wider w-[18%]">Date & Time</th>
                    <th className="px-4 text-[11px] font-bold text-[#2A53A0] uppercase tracking-wider w-[15%]">Modifier</th>
                    <th className="px-4 text-[11px] font-bold text-[#2A53A0] uppercase tracking-wider w-[32%]">Change Log</th>
                    <th className="px-4 text-[11px] font-bold text-[#2A53A0] uppercase tracking-wider w-[10%] text-center">Status</th>
                    <th className="px-4 text-[11px] font-bold text-[#2A53A0] uppercase tracking-wider w-[15%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedScenario.history.map((rev, idx) => (
                    <tr key={idx} className="h-[42px] hover:bg-gray-50 transition-colors">
                      <td className="px-4">
                        <span className="text-[13px] font-bold text-[#2A53A0]">{rev.version}</span>
                      </td>
                      <td className="px-4">
                        <span className="text-[12px] text-gray-600 font-mono">{rev.modifiedAt}</span>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 font-bold">
                            {rev.modifiedBy.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-[12px] text-[#161616] font-medium">{rev.modifiedBy}</span>
                        </div>
                      </td>
                      <td className="px-4">
                        <span className="text-[12px] text-gray-500 truncate block max-w-[400px]" title={rev.changeLog}>{rev.changeLog}</span>
                      </td>
                      <td className="px-4 text-center">
                        <Badge className={cn(
                          "rounded-full font-medium text-[11px] px-2 border-0 uppercase h-[22px] flex items-center justify-center whitespace-nowrap inline-flex mx-auto",
                          rev.status === "Active" ? "bg-[#DEFBE6] text-[#198038]" : 
                          rev.status === "Draft" ? "bg-[#EAF2FF] text-[#2A53A0]" : "bg-[#F4F4F4] text-[#525252]"
                        )}>
                          {rev.status}
                        </Badge>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-[11px] text-[#2A53A0] font-bold hover:underline">View Config</button>
                          <span className="text-gray-300">|</span>
                          <button className="text-[11px] text-[#2A53A0] font-bold hover:underline">Restore</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium">Showing {selectedScenario.history.length} historical versions for audit compliance</span>
              <button className="flex items-center gap-1.5 text-[11px] text-[#2A53A0] font-bold hover:underline">
                <Information size={14} />
                Download Audit Trail
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#f8f9fa] border border-dashed border-gray-300 rounded-[8px] p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 mb-3 shadow-sm border border-gray-200">
               <View size={24} />
            </div>
            <h4 className="text-[14px] font-bold text-[#161616]">Select a scenario to view version history</h4>
            <p className="text-[12px] text-[#525252] max-w-[400px]">History shows audit logs, configuration diffs, and promotion metadata for all historical releases of the selected scenario.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
