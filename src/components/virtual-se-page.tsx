import React, { useState, useMemo } from "react";
import { 
  Search, 
  ChevronDown, 
  Add, 
  View,
  Edit,
  Checkmark,
  TrashCan,
  VirtualMachine,
  Cloud,
  ContainerSoftware,
  Network4,
  Scale,
  Launch
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { CarbonPaginationFooter } from "./carbon-pagination-footer";
import { useSortableData } from "../hooks/use-sortable-data";
import { SortableHeader } from "./ui/sortable-header";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "./ui/dialog";

// --- DATA TYPES ---
export interface VirtualEnvItem {
  id: string;
  name: string;
  description: string;
  type: "Sandbox" | "Staging" | "Production-Mirror" | "Development";
  version: string;
  region: string;
  status: "Verified" | "Rejected" | "Draft" | "Pending Approval";
}

// --- INITIAL CONSTANTS ---
export const OOTB_VIRTUAL_ENVS: VirtualEnvItem[] = [
  { id: "ve1", name: "Standard Sandbox", description: "Base environment for scenario testing and logic validation", type: "Sandbox", version: "v4.2.0", region: "US-East-1", status: "Verified" },
  { id: "ve2", name: "High-Volume Staging", description: "Scale-optimized environment for stress testing transaction flows", type: "Staging", version: "v4.1.8", region: "EU-West-1", status: "Verified" },
  { id: "ve3", name: "Regulatory Compliance Mirror", description: "Read-only production clone for compliance auditing", type: "Production-Mirror", version: "v4.2.0", region: "US-West-2", status: "Verified" }
];

export const CUSTOM_VIRTUAL_ENVS: VirtualEnvItem[] = [
  { id: "vcve1", name: "Regional Latency Test", description: "Custom setup for measuring API response times in APAC", type: "Sandbox", version: "v4.2.1-rc1", region: "AP-South-1", status: "Verified" }
];

export const DRAFT_VIRTUAL_ENVS: VirtualEnvItem[] = [
  { id: "vdve1", name: "Next-Gen ML Sandbox", description: "Drafted configuration for upcoming ML-driven analytics engine", type: "Development", version: "v5.0.0-beta", region: "US-East-1", status: "Draft" }
];

export const PENDING_VIRTUAL_ENVS: VirtualEnvItem[] = [
  { id: "vpve1", name: "Cross-Border Settlement Staging", description: "Verification pending for international settlement simulation", type: "Staging", version: "v4.2.0", region: "EU-Central-1", status: "Pending Approval" },
  { id: "vpve2", name: "Experimental_Neural_Node", description: "Test node for neural network validation", type: "Sandbox", version: "v1.0.0", region: "US-East-1", status: "Rejected" }
];


function VirtualEnvTableContent({ 
  data, 
  onNavigate, 
  onCreateEnv, 
  onDelete,
  actionType = "view",
  showDelete = true
}: { 
  data: VirtualEnvItem[], 
  onNavigate: (id: string) => void, 
  onCreateEnv: () => void,
  onDelete?: (id: string) => void,
  actionType?: "view" | "edit" | "verify",
  showDelete?: boolean
}) {
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return "bg-[#defbe6] text-[#198038]";
      case "Provisioning": return "bg-[#e8daff] text-[#8a3ffc]";
      case "Error": return "bg-[#fff1f1] text-[#da1e28]";
      default: return "bg-[#f4f4f4] text-[#525252]";
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesType = typeFilter === "all" || item.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [data, typeFilter, searchTerm]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className="flex flex-col w-full h-full bg-white mt-0 overflow-hidden space-y-4">
        <div className="flex-none flex items-center justify-between bg-white h-[48px] px-0 gap-4">
          <div className="flex items-center gap-4 h-full">
              <div className="relative w-[300px] h-full flex items-center">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search environments..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full h-full pl-12 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
                />
              </div>
              
              <div className="flex items-center h-full">
                <div className="relative h-full flex items-center">
                   <select 
                     value={typeFilter}
                     onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                     className="bg-white border border-gray-300 rounded-sm h-[48px] px-4 pr-10 text-[14px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[160px]"
                   >
                       <option value="all">All Types</option>
                       <option value="sandbox">Sandbox</option>
                       <option value="staging">Staging</option>
                       <option value="production-mirror">Production Mirror</option>
                       <option value="development">Development</option>
                   </select>
                   <div className="absolute right-3 pointer-events-none text-gray-500">
                      <ChevronDown size={16} />
                   </div>
                </div>
              </div>
          </div>
          <div className="flex items-center h-full">
              <Button 
                onClick={onCreateEnv}
                className="h-[48px] rounded-sm bg-[#2A53A0] hover:bg-[#1e3c75] text-white flex items-center gap-2 px-6 text-[14px] font-medium border-0 shadow-sm transition-colors"
              >
                <Add size={20} /> New Environment
              </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
          <div className="flex-1 hover-scroll bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#F0F0F0] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                        <th className="px-4 border-b border-[#e0e0e0] w-[220px] align-middle whitespace-nowrap">
                            <SortableHeader column="name" label="Environment Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] align-middle whitespace-nowrap">
                            <SortableHeader column="description" label="Description" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[140px] align-middle whitespace-nowrap">
                            <SortableHeader column="type" label="Env Type" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[100px] align-middle whitespace-nowrap text-center">
                            <SortableHeader column="version" label="Version" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold justify-center" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[120px] align-middle whitespace-nowrap">
                            <SortableHeader column="status" label="Status" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[120px] text-left align-middle select-none">
                            <span className="text-[14px] font-semibold text-[#2A53A0] ml-1">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {paginatedData.length > 0 ? paginatedData.map((row) => (
                    <tr key={row.id} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
                        <td className="px-4 align-middle">
                            <div className="flex items-center gap-3">
                                <VirtualMachine size={16} className="text-[#2A53A0]" />
                                <span className="text-[14px] text-[#161616] font-medium block truncate" title={row.name}>{row.name}</span>
                            </div>
                        </td>
                        <td className="px-4 align-middle">
                            <span className="text-[14px] text-[#161616] font-normal block line-clamp-1" title={row.description}>{row.description}</span>
                        </td>
                        <td className="px-4 align-middle">
                            <div className="flex items-center gap-2">
                                <Cloud size={14} className="text-gray-400" />
                                <span className="text-[13px] text-[#161616]">{row.type}</span>
                            </div>
                        </td>
                        <td className="px-4 align-middle text-center">
                            <span className="text-[12px] font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">{row.version}</span>
                        </td>
                        <td className="px-4 align-middle">
                             <Badge className={cn(
                               "text-[11px] font-medium px-3 rounded-full border-0 uppercase h-[28px] flex items-center justify-center whitespace-nowrap w-fit",
                               getStatusBadge(row.status)
                             )}>
                               {row.status}
                             </Badge>
                        </td>
                        <td className="px-4 align-middle text-left">
                           <div className="flex items-center justify-start gap-3">
                              {actionType === "verify" && (
                                <button className="w-[28px] h-[28px] flex items-center justify-center bg-[#defbe6] hover:bg-[#c8f7d4] rounded-md transition-colors text-[#198038]" title="Verify Deployment" onClick={() => onNavigate(row.id)}>
                                    <Checkmark size={16} />
                                </button>
                              )}
                              {actionType === "view" && (
                                <button className="w-[28px] h-[28px] flex items-center justify-center bg-[#edf5ff] hover:bg-[#d0e2ff] rounded-md transition-colors text-[#0043ce]" title="Launch Env" onClick={() => onNavigate(row.id)}>
                                    <Launch size={16} />
                                </button>
                              )}
                              {actionType === "edit" && (
                                <button className="w-[28px] h-[28px] flex items-center justify-center bg-[#f6f2ff] hover:bg-[#e8daff] rounded-md transition-colors text-[#8a3ffc]" title="Edit Config" onClick={() => onNavigate(row.id)}>
                                    <Edit size={16} />
                                </button>
                              )}
                              {showDelete && (
                                <button className="w-[28px] h-[28px] flex items-center justify-center bg-[#fff1f1] hover:bg-[#ffd7d9] rounded-md transition-colors text-[#da1e28]" title="Terminate" onClick={() => onDelete?.(row.id)}>
                                    <TrashCan size={16} />
                                </button>
                              )}
                           </div>
                        </td>
                    </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="h-48 text-center text-gray-500 text-sm">No environments matching your criteria were found.</td>
                      </tr>
                    )}
                </tbody>
            </table>
          </div>

          <CarbonPaginationFooter pageSize={pageSize} setPageSize={setPageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={sortedData.length} />
        </div>
    </div>
  );
}

import PageHeader from "./page-header";

export function VirtualSEPage({ 
  breadcrumbs, 
  onBreadcrumbNavigate,
  initialTab = "ootb",
  ootbVirtualEnvs,
  customVirtualEnvs,
  draftVirtualEnvs,
  pendingVirtualEnvs,
  onDeleteEnv
}: { 
  breadcrumbs: any[], 
  onBreadcrumbNavigate: (path: string) => void,
  initialTab?: string,
  ootbVirtualEnvs: VirtualEnvItem[],
  customVirtualEnvs: VirtualEnvItem[],
  draftVirtualEnvs: VirtualEnvItem[],
  pendingVirtualEnvs: VirtualEnvItem[],
  onDeleteEnv: (id: string, tab: string) => void
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [envToDelete, setEnvToDelete] = useState<{id: string, name: string, tab: string} | null>(null);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleOpenDeleteConfirm = (id: string, tab: string) => {
    let list = tab === "ootb" ? ootbVirtualEnvs : tab === "custom" ? customVirtualEnvs : tab === "draft" ? draftVirtualEnvs : pendingVirtualEnvs;
    let name = list.find(v => v.id === id)?.name || "";
    setEnvToDelete({ id, name, tab });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (envToDelete) {
      onDeleteEnv(envToDelete.id, envToDelete.tab);
      setDeleteConfirmOpen(false);
      setEnvToDelete(null);
    }
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    const path = val === "draft" ? "virtual-se-draft" : 
                 val === "pending" ? "virtual-se-pending" : 
                 val === "custom" ? "virtual-se-custom" : "virtual-se";
    onBreadcrumbNavigate(path);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col p-0 overflow-hidden">
       <PageHeader 
         title="Virtual Simulation Environments" 
         breadcrumbs={breadcrumbs} 
         onBreadcrumbNavigate={onBreadcrumbNavigate} 
       />
       <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col gap-0">
          <div className="bg-white border-b border-gray-100 px-4 sticky top-0 z-10">
              <TabsList className="bg-transparent p-0 w-full justify-start border-b border-[#e0e0e0] flex h-[48px] rounded-none">
                 <TabsTrigger value="ootb" className={cn("relative h-full rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold")}>
                    <div className="flex items-center gap-2">
                      <span>OOTB Environments</span>
                      <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{ootbVirtualEnvs.length}</Badge>
                    </div>
                 </TabsTrigger>
                 <TabsTrigger value="custom" className={cn("relative h-full rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold")}>
                    <div className="flex items-center gap-2">
                      <span>Custom Environments</span>
                      <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{customVirtualEnvs.length}</Badge>
                    </div>
                 </TabsTrigger>
                 <TabsTrigger value="draft" className={cn("relative h-full rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold")}>
                    <div className="flex items-center gap-2">
                      <span>Drafted Configs</span>
                      <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{draftVirtualEnvs.length}</Badge>
                    </div>
                 </TabsTrigger>
                 <TabsTrigger value="pending" className={cn("relative h-full rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold")}>
                    <div className="flex items-center gap-2">
                      <span>Pending Verification</span>
                      <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{pendingVirtualEnvs.length}</Badge>
                    </div>
                 </TabsTrigger>
              </TabsList>
          </div>

          <div className="flex-1 hover-scroll">
            <TabsContent value="ootb" className="h-full p-4 focus-visible:outline-none m-0">
               <VirtualEnvTableContent data={ootbVirtualEnvs} onNavigate={(id) => onBreadcrumbNavigate(`virtual-se-details-${id}`)} onCreateEnv={() => onBreadcrumbNavigate("virtual-se-create")} showDelete={false} />
            </TabsContent>
            <TabsContent value="custom" className="h-full p-4 focus-visible:outline-none m-0">
               <VirtualEnvTableContent data={customVirtualEnvs} onNavigate={(id) => onBreadcrumbNavigate(`virtual-se-details-${id}`)} onCreateEnv={() => onBreadcrumbNavigate("virtual-se-create")} onDelete={(id) => handleOpenDeleteConfirm(id, "custom")} actionType="view" />
            </TabsContent>
            <TabsContent value="draft" className="h-full p-4 focus-visible:outline-none m-0">
               <VirtualEnvTableContent data={draftVirtualEnvs} onNavigate={(id) => onBreadcrumbNavigate(`virtual-se-edit-${id}`)} onCreateEnv={() => onBreadcrumbNavigate("virtual-se-create")} onDelete={(id) => handleOpenDeleteConfirm(id, "draft")} actionType="edit" />
            </TabsContent>
            <TabsContent value="pending" className="h-full p-4 focus-visible:outline-none m-0">
               <VirtualEnvTableContent data={pendingVirtualEnvs} onNavigate={(id) => onBreadcrumbNavigate(`virtual-se-verify-${id}`)} onCreateEnv={() => onBreadcrumbNavigate("virtual-se-create")} onDelete={(id) => handleOpenDeleteConfirm(id, "pending")} actionType="verify" />
            </TabsContent>
          </div>
       </Tabs>

       {/* Delete Confirmation Dialog */}
       <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[400px] p-0 border-0 rounded-lg overflow-hidden">
             <div className="bg-[#fff1f1] px-6 py-4 flex items-center gap-3">
                <TrashCan size={24} className="text-[#da1e28]" />
                <DialogTitle className="text-[#161616] text-[18px] font-semibold">Terminate Environment</DialogTitle>
                 <DialogDescription className="sr-only">Confirm the termination of this virtual environment.</DialogDescription>
             </div>
             <div className="px-6 py-8">
                <p className="text-[14px] text-[#525252] leading-relaxed">
                   Are you sure you want to terminate <span className="font-bold text-[#161616]">"{envToDelete?.name}"</span>? 
                   All simulation data and running processes will be lost.
                </p>
             </div>
             <DialogFooter className="bg-[#f4f4f4] px-6 py-4 flex items-center justify-end gap-3 sm:justify-end">
                <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="text-[#525252] hover:bg-gray-200 h-[48px] px-6">
                   Cancel
                </Button>
                <Button onClick={handleConfirmDelete} className="bg-[#da1e28] hover:bg-[#b21922] text-white h-[48px] px-8 rounded-none">
                   Terminate
                </Button>
             </DialogFooter>
          </DialogContent>
       </Dialog>
    </div>
  );
}
