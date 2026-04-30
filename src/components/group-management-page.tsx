import { useState, useMemo } from "react";
import { 
  Search, 
  Edit, 
  Group, 
  TrashCan, 
  ChevronDown,
  Information,
  Add,
  Portfolio
} from "@carbon/icons-react";
import PageHeader from "./page-header";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CarbonPaginationFooter } from "./carbon-pagination-footer";
import { useSortableData } from "../hooks/use-sortable-data";
import { SortableHeader } from "./ui/sortable-header";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";
import { LinkedScenariosDialog } from "./linked-scenarios-dialog";

interface GroupItem {
  id: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  description: string;
  scenarios: number;
  access: string;
}

const INITIAL_GROUP_DATA: GroupItem[] = [
  { 
    id: "g1", 
    name: "EFM", 
    isDefault: true, 
    isActive: true,
    description: "Enterprise Fraud Management - Default group for all fraud scenarios", 
    scenarios: 142, 
    access: "All SAT users (default)" 
  },
  { 
    id: "g2", 
    name: "AML", 
    isDefault: false, 
    isActive: true,
    description: "Anti-Money Laundering scenarios and monitoring", 
    scenarios: 87, 
    access: "15 users, 3 roles" 
  },
  { 
    id: "g3", 
    name: "KYC", 
    isDefault: false, 
    isActive: true,
    description: "Know Your Customer verification and compliance", 
    scenarios: 54, 
    access: "12 users, 2 roles" 
  },
  { 
    id: "g4", 
    name: "Card Fraud", 
    isDefault: false, 
    isActive: true,
    description: "Credit and debit card fraud detection scenarios", 
    scenarios: 96, 
    access: "22 users, 3 roles" 
  },
  { 
    id: "g5", 
    name: "Internal Fraud", 
    isDefault: false, 
    isActive: true,
    description: "Employee and internal threat monitoring", 
    scenarios: 31, 
    access: "8 users, 2 roles" 
  },
  { 
    id: "g6", 
    name: "Compliance", 
    isDefault: false, 
    isActive: true,
    description: "Regulatory compliance and audit reporting group", 
    scenarios: 42, 
    access: "10 users, 2 roles" 
  },
  { 
    id: "g7", 
    name: "Risk Assessment", 
    isDefault: false, 
    isActive: true,
    description: "Enterprise-wide risk calculation and assessment", 
    scenarios: 68, 
    access: "18 users, 4 roles" 
  },
  { 
    id: "g8", 
    name: "Transaction Monitoring", 
    isDefault: false, 
    isActive: true,
    description: "Real-time transaction analysis and flagging", 
    scenarios: 112, 
    access: "25 users, 5 roles" 
  },
  { 
    id: "g9", 
    name: "Customer Onboarding", 
    isDefault: false, 
    isActive: true,
    description: "New customer risk profile and validation", 
    scenarios: 27, 
    access: "6 users, 1 role" 
  },
  { 
    id: "g10", 
    name: "Cybersecurity", 
    isDefault: false, 
    isActive: true,
    description: "Cyber threat detection and digital security monitoring", 
    scenarios: 73, 
    access: "20 users, 4 roles" 
  },
];

export function GroupManagementPage({ 
  onBreadcrumbNavigate,
  breadcrumbs
}: { 
  onBreadcrumbNavigate: (path: string) => void,
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[]
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [groups, setGroups] = useState<GroupItem[]>(INITIAL_GROUP_DATA);
  const [selectedGroupForScenarios, setSelectedGroupForScenarios] = useState<GroupItem | null>(null);

  const filteredData = useMemo(() => {
    return groups.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.access.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, groups]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData, { key: 'name' as any, direction: 'asc' });

  const paginatedData = useMemo(() => {
    // Ensure default group is always at the top of the collection
    const dataWithDefaultPriority = [...sortedData].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });
    
    const start = (currentPage - 1) * pageSize;
    return dataWithDefaultPriority.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleDelete = (id: string, name: string) => {
    if (name === "EFM") {
      toast.error("Default group 'EFM' cannot be deleted.");
      return;
    }
    setGroups(prev => prev.filter(g => g.id !== id));
    toast.success(`Group '${name}' deleted successfully.`);
  };

  const handleEdit = (name: string) => {
    toast.info(`Edit functionality for group '${name}' coming soon.`);
  };

  const handleManageUsers = (name: string) => {
    toast.info(`User management for group '${name}' coming soon.`);
  };

  const handleViewScenarios = (group: GroupItem) => {
    setSelectedGroupForScenarios(group);
  };

  const handleToggleStatus = (id: string, name: string, currentStatus: boolean) => {
    setGroups(prev => prev.map(g => 
      g.id === id ? { ...g, isActive: !currentStatus } : g
    ));
    toast.success(`Group '${name}' ${currentStatus ? 'disabled' : 'enabled'} successfully.`);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden font-['Inter'] relative">
      <PageHeader 
        title="Group Management" 
        breadcrumbs={breadcrumbs} 
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
      />
      <div className="flex-1 flex flex-col p-4 overflow-hidden space-y-4">
        {/* Filter Bar - Exactly matching My Work layout */}
        <div className="flex-none flex items-center justify-between bg-white h-[48px] px-0 gap-4">
          <div className="flex items-center gap-3 h-full flex-1">
            <div className="relative w-[280px] h-full flex items-center">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"><Search size={16} /></div>
              <input 
                type="text" 
                placeholder="Search groups..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full h-full pl-11 pr-4 bg-white border border-gray-300 rounded-[8px] text-[13px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
              />
            </div>
          </div>
          <Button 
              className="h-full bg-[#2A53A0] hover:bg-[#1A3A7A] text-white px-6 rounded-[8px] flex items-center gap-2 text-[13px] font-medium transition-all shrink-0"
              onClick={() => toast.info("Add Group dialog coming soon.")}
          >
              <Add size={18} />
              Create New Group
          </Button>
        </div>

        {/* Unified Table - Matching My Work's h-[46px] row height and styling */}
        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="flex-1 overflow-x-hidden bg-white">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                  <tr className="bg-[#F4F4F4] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                    <th className="px-4 border-b border-[#e0e0e0] w-[16%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="name" label="GroupName" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[35%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="description" label="Description" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="scenarios" label="Scenarios" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[18%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="access" label="Access" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[9%] align-middle whitespace-nowrap text-left">
                      <SortableHeader column="isActive" label="Status" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" />
                    </th>
                    <th className="px-4 border-b border-[#e0e0e0] w-[12%] text-left align-middle select-none">
                      <span className="text-[13px] font-semibold text-[#2A53A0]">Actions</span>
                    </th>
                  </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData.length > 0 ? paginatedData.map((row) => (
                  <tr key={row.id} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
                    <td className="px-4 align-middle">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-[#161616] font-normal truncate">{row.name}</span>
                        {row.isDefault && (
                          <span className="text-[11px] text-[#8D8D8D] font-normal shrink-0">(Default)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 align-middle">
                      <span className="text-[13px] text-[#161616] truncate block" title={row.description}>{row.description}</span>
                    </td>
                    <td className="px-4 align-middle">
                      <button 
                        className="text-[13px] text-[#2A53A0] font-medium hover:underline"
                        onClick={() => handleViewScenarios(row)}
                      >
                        {row.scenarios}
                      </button>
                    </td>
                    <td className="px-4 align-middle">
                      <button 
                        className={cn(
                            "text-[13px] font-medium hover:underline text-left truncate block w-full",
                            row.isDefault ? "text-[#525252] cursor-default no-underline" : "text-[#2A53A0]"
                        )}
                        onClick={() => !row.isDefault && handleManageUsers(row.name)}
                      >
                        {row.access}
                      </button>
                    </td>
                    <td className="px-4 align-middle">
                      {/* Status Badge - Matching Version Management Page */}
                      <Badge className={cn(
                        "rounded-full font-medium text-[11px] px-3 border-0 uppercase h-[28px] inline-flex items-center justify-center whitespace-nowrap",
                        row.isActive ? "bg-[#DEFBE6] text-[#198038]" : "bg-[#F4F4F4] text-[#525252]"
                      )}>
                        {row.isActive ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </td>
                    <td className="px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <button 
                          className="w-[28px] h-[28px] flex items-center justify-center rounded-md bg-[#EDF5FF] hover:bg-[#D0E2FF] text-[#0043CE] border border-[#D0E2FF] transition-colors shadow-sm shrink-0" 
                          title="Edit Group"
                          onClick={() => handleEdit(row.name)}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className={cn(
                              "w-[28px] h-[28px] flex items-center justify-center rounded-md border transition-colors shadow-sm shrink-0",
                              row.isDefault 
                                ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" 
                                : "bg-[#FFF1F1] hover:bg-[#FFD7D9] text-[#DA1E28] border-[#FFD7D9]"
                          )}
                          title={row.isDefault ? "Cannot delete default group" : "Delete Group"}
                          onClick={() => handleDelete(row.id, row.name)}
                          disabled={row.isDefault}
                        >
                          <TrashCan size={14} />
                        </button>
                        {/* Carbon Design System Toggle Button */}
                        <button
                          onClick={() => handleToggleStatus(row.id, row.name, row.isActive)}
                          className={cn(
                            "relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2A53A0] focus:ring-offset-2",
                            row.isActive 
                              ? "bg-[#2A53A0] border-[#2A53A0]" 
                              : "bg-[#8D8D8D] border-[#8D8D8D]"
                          )}
                          role="switch"
                          aria-checked={row.isActive}
                          title={row.isActive ? "Click to Disable" : "Click to Enable"}
                        >
                          <span
                            className={cn(
                              "inline-block h-[16px] w-[16px] transform rounded-full bg-white transition-transform",
                              row.isActive ? "translate-x-[26px]" : "translate-x-[3px]"
                            )}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="h-[240px] text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                         <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center"><Portfolio size={40} className="opacity-20" /></div>
                         <p className="text-[15px] font-medium text-gray-600">No groups found matching your search</p>
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
            onPageChange={setCurrentPage} 
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} 
          />
        </div>
      </div>
      {selectedGroupForScenarios && (
        <LinkedScenariosDialog 
          isOpen={!!selectedGroupForScenarios}
          groupId={selectedGroupForScenarios.id}
          groupName={selectedGroupForScenarios.name}
          scenarioCount={selectedGroupForScenarios.scenarios}
          onClose={() => setSelectedGroupForScenarios(null)}
        />
      )}
    </div>
  );
}