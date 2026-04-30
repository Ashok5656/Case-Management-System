import { useState, useMemo, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  Search, 
  View, 
  ChevronRight, 
  Add,
  ChevronDown,
  Edit,
  TrashCan,
  Portfolio,
  Identification,
  Flash,
  Settings,
  User,
  Money,
  Enterprise,
  Document,
  OverflowMenuVertical,
  Copy,
  Play,
  Archive
} from "@carbon/icons-react";
import PageHeader from "./page-header";
import { Sparkles, Layers, GitBranch, X, ChevronRight as ChevronRightLucide } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CarbonPaginationFooter } from "./carbon-pagination-footer";
import { useSortableData } from "../hooks/use-sortable-data";
import { SortableHeader } from "./ui/sortable-header";
import { cn } from "./ui/utils";
import { ScenarioItem } from "./scenarios-data";

interface ScenarioListPageProps {
  scenarios: ScenarioItem[];
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
  onNewScenario: () => void;
  onBasedOnTemplate: () => void;
  onViewScenario: (id: string) => void;
  onEditScenario: (id: string) => void;
  onDuplicateScenario: (id: string) => void;
}

function ActionMenu({ 
  scenarioId, 
  onView, 
  onEdit, 
  onDuplicate 
}: { 
  scenarioId: string; 
  onView: (id: string) => void; 
  onEdit: (id: string) => void; 
  onDuplicate: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex justify-center" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-[28px] h-[28px] flex items-center justify-center rounded-md bg-[#E5F6F6] text-[#007D79] hover:bg-[#D1EBE7] transition-colors"
      >
        <OverflowMenuVertical size={16} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-[8px] shadow-xl border border-gray-200 z-[100] py-1 overflow-hidden"
          >
            <button 
              onClick={() => { onView(scenarioId); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-gray-700 hover:bg-[#EAF2FF] hover:text-[#2A53A0] transition-colors"
            >
              <View size={16} className="text-gray-400" />
              <span>View Details</span>
            </button>
            <button 
              onClick={() => { onEdit(scenarioId); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-gray-700 hover:bg-[#EAF2FF] hover:text-[#2A53A0] transition-colors"
            >
              <Edit size={16} className="text-gray-400" />
              <span>Edit Scenario</span>
            </button>
            <button 
              onClick={() => { onDuplicate(scenarioId); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-gray-700 hover:bg-[#EAF2FF] hover:text-[#2A53A0] transition-colors"
            >
              <Copy size={16} className="text-gray-400" />
              <span>Duplicate</span>
            </button>
            
            <div className="h-[1px] bg-gray-100 my-1" />
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[#198038] hover:bg-[#DEFBE6] transition-colors">
              <Play size={16} />
              <span>Activate</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition-colors">
              <Archive size={16} className="text-gray-400" />
              <span>Archive</span>
            </button>
            
            <div className="h-[1px] bg-gray-100 my-1" />
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[#DA1E28] hover:bg-[#FFF1F1] transition-colors">
              <TrashCan size={16} />
              <span>Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CreateScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewScenario: () => void;
  onBasedOnTemplate: () => void;
}

function CreateScenarioModal({ isOpen, onClose, onNewScenario, onBasedOnTemplate }: CreateScenarioModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-[540px] bg-white rounded-[16px] shadow-2xl p-8 overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <div className="mb-8">
          <h2 className="text-[24px] font-semibold text-[#161616] mb-1">Create New Scenario</h2>
          <p className="text-[#525252] text-[16px]">Choose how you want to proceed</p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => { onBasedOnTemplate(); onClose(); }}
            className="group flex items-center gap-5 p-5 bg-white border border-gray-100 rounded-[12px] hover:border-[#2A53A0] hover:shadow-md transition-all text-left"
          >
            <div className="w-14 h-14 shrink-0 flex items-center justify-center bg-[#D0E2FF] rounded-[12px] text-[#002D9C]">
              <Layers size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-[18px] font-semibold text-[#161616] mb-0.5">Based on Templates</h3>
              <p className="text-[#525252] text-[14px]">Select from pre-configured scenario patterns</p>
            </div>
            <ChevronRightLucide size={20} className="text-gray-300 group-hover:text-[#2A53A0] transition-colors" />
          </button>

          <button 
            onClick={() => { onNewScenario(); onClose(); }}
            className="group flex items-center gap-5 p-5 bg-white border border-gray-100 rounded-[12px] hover:border-[#2A53A0] hover:shadow-md transition-all text-left"
          >
            <div className="w-14 h-14 shrink-0 flex items-center justify-center bg-[#D9FBFB] rounded-[12px] text-[#004144]">
              <Sparkles size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-[18px] font-semibold text-[#161616] mb-0.5">Create New Scenario</h3>
              <p className="text-[#525252] text-[14px]">Build from scratch with custom settings</p>
            </div>
            <ChevronRightLucide size={20} className="text-gray-300 group-hover:text-[#2A53A0] transition-colors" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function ScenarioListPage({ 
  scenarios, 
  breadcrumbs, 
  onBreadcrumbNavigate, 
  onNewScenario, 
  onBasedOnTemplate,
  onViewScenario,
  onEditScenario,
  onDuplicateScenario
}: ScenarioListPageProps) {
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredData = useMemo(() => {
    return scenarios.filter(item => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [scenarios, statusFilter, searchTerm]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active": return "bg-[#defbe6] text-[#198038] border-0 rounded-full h-[24px] flex items-center justify-center uppercase font-medium text-[11px] px-3";
      case "Inactive": return "bg-[#f4f4f4] text-[#525252] border-0 rounded-full h-[24px] flex items-center justify-center uppercase font-medium text-[11px] px-3";
      case "Draft": return "bg-[#EAF2FF] text-[#2A53A0] border-0 rounded-full h-[24px] flex items-center justify-center uppercase font-medium text-[11px] px-3";
      case "Pending": return "bg-[#FFF9E5] text-[#B28600] border-0 rounded-full h-[24px] flex items-center justify-center uppercase font-medium text-[11px] px-3";
      default: return "bg-[#f4f4f4] text-[#525252] border-0 rounded-full h-[24px] flex items-center justify-center uppercase font-medium text-[11px] px-3";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-['Inter'] overflow-hidden">
      <PageHeader 
        title="Scenario List" 
        breadcrumbs={breadcrumbs} 
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
      />
      <div className="flex-1 flex flex-col p-4 overflow-hidden space-y-4">
        {/* Search and Action Bar */}
        <div className="flex-none flex items-center justify-between bg-white h-[46px] px-0">
          <div className="flex items-center gap-4 h-full">
            <div className="relative w-[300px] h-full flex items-center">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search scenarios..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full h-full pl-12 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
              />
            </div>
            
            <div className="flex items-center h-full">
              <div className="relative h-full flex items-center">
                 <select 
                   value={statusFilter}
                   onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                   className="bg-white border border-gray-300 rounded-sm h-[46px] px-4 pr-10 text-[14px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[200px]"
                 >
                     <option value="all">All Statuses</option>
                     <option value="Active">Active</option>
                     <option value="Inactive">Inactive</option>
                     <option value="Draft">Draft</option>
                 </select>
                 <div className="absolute right-3 pointer-events-none text-gray-500">
                    <ChevronDown size={16} />
                 </div>
              </div>
            </div>
          </div>
          <div className="flex items-center h-full">
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="h-[46px] rounded-sm bg-[#2A53A0] hover:bg-[#1e3c75] text-white flex items-center gap-2 px-6 text-[14px] font-medium border-0 shadow-sm transition-colors"
              >
                <Add size={20} /> Create Scenario
              </Button>
          </div>
        </div>

        <AnimatePresence>
          {isCreateModalOpen && (
            <CreateScenarioModal 
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onNewScenario={onNewScenario}
              onBasedOnTemplate={onBasedOnTemplate}
            />
          )}
        </AnimatePresence>

        {/* Table Section */}
        <div className="flex-1 flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
          <div className="flex-1 hover-scroll overflow-x-hidden bg-white">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-[#F0F0F0] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                  <th className="px-4 border-b border-[#e0e0e0] w-[20%] align-middle whitespace-nowrap text-left">
                    <SortableHeader column="name" label="Scenario Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px]" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[22%] align-middle whitespace-nowrap text-left">
                    <SortableHeader column="description" label="Description" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px]" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[11%] align-middle whitespace-nowrap text-left">
                    <SortableHeader column="workspace" label="Workspace" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px]" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[11%] align-middle whitespace-nowrap text-left">
                    <SortableHeader column="createdBy" label="Created By" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px]" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap text-left">
                    <SortableHeader column="createdOn" label="Created On" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px]" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[11%] align-middle whitespace-nowrap text-left">
                    <SortableHeader column="status" label="Status" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px]" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[9%] align-middle whitespace-nowrap text-right">
                    <SortableHeader column="hits" label="Total Hits" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[14px]" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[6%] text-center align-middle select-none">
                    <span className="text-[14px] font-semibold text-[#2A53A0]">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData.length > 0 ? paginatedData.map((row) => (
                  <tr key={row.id} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
                    <td className="px-4 align-middle">
                      <span className="text-[14px] text-[#161616] font-normal truncate block" title={row.name}>{row.name}</span>
                    </td>
                    <td className="px-4 align-middle">
                      <span className="text-[14px] text-[#161616] font-normal truncate block" title={row.description}>{row.description}</span>
                    </td>
                    <td className="px-4 align-middle">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 h-[28px] rounded-md text-[11px] font-medium whitespace-nowrap w-fit",
                        getWorkspaceColor(row.workspace)
                      )}>
                        {(() => {
                          const Icon = getWorkspaceIcon(row.workspace);
                          return <Icon size={12} className="shrink-0" />;
                        })()}
                        <span>{row.workspace}</span>
                      </div>
                    </td>
                    <td className="px-4 align-middle">
                      <span className="text-[14px] text-[#161616] font-normal truncate block">{row.createdBy || "System"}</span>
                    </td>
                    <td className="px-4 align-middle">
                      <span className="text-[14px] text-[#161616] font-normal font-mono">{row.createdOn || row.lastModified}</span>
                    </td>
                    <td className="px-4 align-middle">
                      <Badge className={cn("whitespace-nowrap font-medium uppercase", getStatusStyles(row.status))}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 align-middle text-right">
                      <span className="text-[14px] text-[#161616] font-normal font-mono">{row.hits}</span>
                    </td>
                    <td className="px-4 align-middle">
                      <ActionMenu 
                        scenarioId={row.id} 
                        onView={onViewScenario}
                        onEdit={onEditScenario}
                        onDuplicate={onDuplicateScenario}
                      />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="h-[100px] text-center text-gray-400 italic">No scenarios found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <CarbonPaginationFooter 
            totalItems={filteredData.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          />
        </div>
      </div>
    </div>
  );
}
