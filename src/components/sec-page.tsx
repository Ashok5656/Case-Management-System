import React, { useState, useMemo } from "react";
import { 
  Search, 
  ChevronDown, 
  Add, 
  View as ViewIcon,
  Edit,
  TrashCan,
  ViewOff,
  Play,
  Launch
} from "@carbon/icons-react";
import PageHeader from "./page-header";
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
export interface SECItem {
  id: string;
  name: string;
  customEvent: string;
  linkedScenarios: number;
  status: "Active" | "Inactive";
  lastModifiedDate: string;
  lastModifiedBy: string;
  description?: string;
  createdBy?: string;
  createdDate?: string;
  conditionExpression?: string;
  conditions?: any[];
  selectedFields?: string[];
  category?: "ootb" | "custom";
}

// --- INITIAL CONSTANTS ---
export const OOTB_SEC: SECItem[] = [
  { 
    id: "s1", 
    name: "Standard 2FA Enforcement", 
    customEvent: "CE_AuthEvent", 
    linkedScenarios: 12, 
    status: "Active", 
    lastModifiedDate: "10/01/2024 09:30", 
    lastModifiedBy: "System",
    description: "Enforces two-factor authentication for all authentication events tagged as high-risk or cross-border.",
    createdBy: "System",
    createdDate: "01/01/2024",
    conditionExpression: "auth_type = '2FA' AND risk_score > 70",
    selectedFields: ["auth_type", "risk_score", "user_id"],
    conditions: [
      { id: "c1", leftBracket: "none", field: "auth_type", operator: "=", value: "'2FA'", rightBracket: "none", logicalOperator: "AND" },
      { id: "c2", leftBracket: "none", field: "risk_score", operator: ">", value: "70", rightBracket: "none", logicalOperator: "AND" }
    ],
    category: "ootb"
  },
  { 
    id: "s2", 
    name: "Base Encryption Policy", 
    customEvent: "CE_SystemEvent", 
    linkedScenarios: 8, 
    status: "Active", 
    lastModifiedDate: "12/01/2024 11:45", 
    lastModifiedBy: "System",
    description: "Ensures all system-level events meet the minimum encryption standards defined in the global security policy.",
    createdBy: "System",
    createdDate: "01/01/2024",
    conditionExpression: "encryption_level = 'AES256' AND protocol = 'TLS1.3'",
    selectedFields: ["encryption_level", "protocol"],
    conditions: [
      { id: "c3", leftBracket: "none", field: "encryption_level", operator: "=", value: "'AES256'", rightBracket: "none", logicalOperator: "AND" },
      { id: "c4", leftBracket: "none", field: "protocol", operator: "=", value: "'TLS1.3'", rightBracket: "none", logicalOperator: "AND" }
    ],
    category: "ootb"
  }
];

export const CUSTOM_SEC: SECItem[] = [
  { 
    id: "sc1", 
    name: "High Value Transaction Check", 
    customEvent: "CE_AccountTransaction", 
    linkedScenarios: 5, 
    status: "Active", 
    lastModifiedDate: "15/12/2024 14:30", 
    lastModifiedBy: "Jane Smith",
    description: "Monitors transaction amounts and types to identify potentially fraudulent high-value wire transfers.",
    createdBy: "John Doe",
    createdDate: "10/12/2024",
    conditionExpression: "transaction_amount > 10000 AND transaction_type = 'WIRE_TRANSFER'",
    selectedFields: ["transaction_amount", "transaction_type", "currency_code"],
    conditions: [
      { id: "c5", leftBracket: "none", field: "transaction_amount", operator: ">", value: "10000", rightBracket: "none", logicalOperator: "AND" },
      { id: "c6", leftBracket: "none", field: "transaction_type", operator: "=", value: "'WIRE_TRANSFER'", rightBracket: "none", logicalOperator: "AND" }
    ],
    category: "custom"
  },
  { 
    id: "sc2", 
    name: "Cross Border Transaction", 
    customEvent: "CE_AccountTransaction", 
    linkedScenarios: 3, 
    status: "Active", 
    lastModifiedDate: "14/12/2024 10:15", 
    lastModifiedBy: "Mike Johnson",
    description: "Security control for monitoring and validating transactions originating from or destined for high-risk jurisdictions.",
    createdBy: "Mike Johnson",
    createdDate: "12/12/2024",
    conditionExpression: "destination_country != source_country AND risk_level = 'High'",
    selectedFields: ["destination_country", "source_country", "risk_level"],
    conditions: [
      { id: "c7", leftBracket: "none", field: "destination_country", operator: "!=", value: "source_country", rightBracket: "none", logicalOperator: "AND" },
      { id: "c8", leftBracket: "none", field: "risk_level", operator: "=", value: "'High'", rightBracket: "none", logicalOperator: "AND" }
    ],
    category: "custom"
  },
  { 
    id: "sc3", 
    name: "Multiple Failed Login Attempts", 
    customEvent: "CE_LoginEvent", 
    linkedScenarios: 0, 
    status: "Inactive", 
    lastModifiedDate: "10/12/2024 09:00", 
    lastModifiedBy: "Sarah Williams",
    description: "Detects rapid sequential failed login attempts from a single IP address within a short timeframe.",
    createdBy: "Sarah Williams",
    createdDate: "05/12/2024",
    conditionExpression: "failed_attempts > 5 AND time_window < 300",
    selectedFields: ["failed_attempts", "time_window"],
    conditions: [
      { id: "c9", leftBracket: "none", field: "failed_attempts", operator: ">", value: "5", rightBracket: "none", logicalOperator: "AND" },
      { id: "c10", leftBracket: "none", field: "time_window", operator: "<", value: "300", rightBracket: "none", logicalOperator: "AND" }
    ],
    category: "custom"
  },
  { 
    id: "sc4", 
    name: "Rapid Card Transactions", 
    customEvent: "CE_CardTransaction", 
    linkedScenarios: 2, 
    status: "Active", 
    lastModifiedDate: "12/12/2024 16:45", 
    lastModifiedBy: "John Doe",
    description: "Monitors card transaction frequency to prevent card testing and automated brute-force attacks on card systems.",
    createdBy: "John Doe",
    createdDate: "08/12/2024",
    conditionExpression: "transaction_count > 3 AND time_interval < 60",
    selectedFields: ["transaction_count", "time_interval"],
    conditions: [
      { id: "c11", leftBracket: "none", field: "transaction_count", operator: ">", value: "3", rightBracket: "none", logicalOperator: "AND" },
      { id: "c12", leftBracket: "none", field: "time_interval", operator: "<", value: "60", rightBracket: "none", logicalOperator: "AND" }
    ],
    category: "custom"
  }
];

// Draft and Pending are removed from interface usage in SECPage but kept for types if needed elsewhere
export const DRAFT_SEC: any[] = [];
export const PENDING_SEC: any[] = [];


function SECTableContent({ 
  data, 
  onNavigate, 
  onEdit,
  onCreateSEC, 
  onDelete,
  onStatusChange,
  isOOTB = false
}: { 
  data: SECItem[], 
  onNavigate: (id: string) => void, 
  onEdit: (id: string) => void,
  onCreateSEC: () => void,
  onDelete?: (id: string) => void,
  onStatusChange?: (id: string, newStatus: "Active" | "Inactive") => void,
  isOOTB?: boolean
}) {
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.customEvent.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [data, searchTerm]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className="flex flex-col flex-1 w-full bg-white mt-0 overflow-hidden space-y-4 pt-0">
        <div className="flex-none flex items-center justify-between bg-white h-[48px] px-0 gap-4">
          <div className="flex items-center gap-4 h-full">
              <div className="relative w-[300px] h-[46px] flex items-center self-center">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search by name or event..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full h-full pl-12 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
                />
              </div>
          </div>
          <div className="flex items-center h-full">
              <Button 
                onClick={onCreateSEC}
                className="h-[48px] rounded-[8px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white flex items-center gap-2 px-6 text-[14px] font-medium border-0 shadow-sm transition-colors"
              >
                <Add size={20} /> Add Custom SEC
              </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#F0F0F0] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                        <th className="px-4 border-b border-[#e0e0e0] align-middle whitespace-nowrap">
                            <SortableHeader column="name" label="SEC Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] align-middle whitespace-nowrap">
                            <SortableHeader column="customEvent" label="Custom Event" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[140px] align-middle whitespace-nowrap text-center">
                            <SortableHeader column="linkedScenarios" label="Linked Scenarios" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold justify-center" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[120px] align-middle whitespace-nowrap text-center">
                            <SortableHeader column="status" label="Status" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold justify-center" />
                        </th>
                        {!isOOTB && (
                          <th className="px-4 border-b border-[#e0e0e0] w-[180px] align-middle whitespace-nowrap">
                              <SortableHeader column="lastModifiedDate" label="Last Modified" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                          </th>
                        )}
                        <th className="px-4 border-b border-[#e0e0e0] w-[140px] text-left align-middle select-none">
                            <span className="text-[14px] font-semibold text-[#2A53A0] ml-1">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {paginatedData.length > 0 ? paginatedData.map((row) => (
                    <tr key={row.id} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
                        <td className="px-4 align-middle">
                            <span className="text-[14px] text-[#161616] font-normal block truncate" title={row.name}>{row.name}</span>
                        </td>
                        <td className="px-4 align-middle">
                            <span className="text-[14px] text-[#161616] font-normal font-mono">{row.customEvent}</span>
                        </td>
                        <td className="px-4 align-middle text-center">
                            <span className="text-[14px] text-[#161616] font-normal">{row.linkedScenarios}</span>
                        </td>
                        <td className="px-4 align-middle text-center">
                             <div className="flex justify-center">
                               <Badge className={cn(
                                 "text-[11px] font-medium px-3 rounded-full border-0 h-[28px] flex items-center justify-center whitespace-nowrap",
                                 row.status === "Active" ? "bg-[#defbe6] text-[#198038]" : "bg-[#f4f4f4] text-[#525252]"
                               )}>
                                 {row.status}
                               </Badge>
                             </div>
                        </td>
                        {!isOOTB && (
                          <td className="px-4 align-middle">
                              <div className="flex flex-col">
                                 <span className="text-[13px] text-[#161616] font-normal">
                                    {row.lastModifiedDate ? (row.lastModifiedDate.includes(' ') ? row.lastModifiedDate.split(' ')[0] : row.lastModifiedDate) : "2025-02-13"}
                                 </span>
                              </div>
                          </td>
                        )}
                        <td className="px-4 align-middle text-left">
                           <div className="flex items-center justify-start gap-3">
                              <button 
                                className="w-[28px] h-[28px] flex items-center justify-center bg-[#edf5ff] hover:bg-[#d0e2ff] rounded-md transition-colors text-[#0043ce]" 
                                title="View Details" 
                                onClick={() => onNavigate(row.id)}
                              >
                                  <ViewIcon size={16} />
                              </button>
                              
                              {!isOOTB && (
                                <>
                                  <button 
                                    className="w-[28px] h-[28px] flex items-center justify-center bg-[#f6f2ff] hover:bg-[#e8daff] rounded-md transition-colors text-[#8a3ffc]" 
                                    title="Edit SEC" 
                                    onClick={() => onEdit(row.id)}
                                  >
                                      <Edit size={16} />
                                  </button>
                                  
                                  <button 
                                    className={cn(
                                      "w-[28px] h-[28px] flex items-center justify-center rounded-md transition-colors",
                                      row.status === "Active" 
                                        ? "bg-orange-50 text-orange-600 hover:bg-orange-100" 
                                        : "bg-green-50 text-green-600 hover:bg-green-100"
                                    )}
                                    title={row.status === "Active" ? "Deactivate SEC" : "Activate SEC"} 
                                    onClick={() => onStatusChange?.(row.id, row.status === "Active" ? "Inactive" : "Active")}
                                  >
                                      {row.status === "Active" ? <ViewOff size={16} /> : <Play size={16} />}
                                  </button>

                                  <button 
                                    className={cn(
                                      "w-[28px] h-[28px] flex items-center justify-center rounded-md transition-colors",
                                      row.status === "Inactive" 
                                        ? "bg-[#fff1f1] text-[#da1e28] hover:bg-[#ffd7d9]" 
                                        : "bg-gray-50 text-gray-300 cursor-not-allowed"
                                    )} 
                                    title={row.status === "Inactive" ? "Delete SEC" : "Only Inactive SEC can be deleted"} 
                                    disabled={row.status === "Active"}
                                    onClick={() => onDelete?.(row.id)}
                                  >
                                      <TrashCan size={16} />
                                  </button>
                                </>
                              )}
                           </div>
                        </td>
                    </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="h-48 text-center text-gray-400 text-sm">No control matching your criteria were found.</td>
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

export function SECPage({ 
  breadcrumbs, 
  onBreadcrumbNavigate,
  initialTab = "ootb",
  ootbSEC,
  customSEC,
  onDeleteSEC,
  onStatusChangeSEC
}: { 
  breadcrumbs: any[], 
  onBreadcrumbNavigate: (path: string) => void,
  initialTab?: string,
  ootbSEC: SECItem[],
  customSEC: SECItem[],
  onDeleteSEC: (id: string, tab: string) => void,
  onStatusChangeSEC: (id: string, newStatus: "Active" | "Inactive") => void
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [secToDelete, setSecToDelete] = useState<{id: string, name: string, tab: string} | null>(null);

  React.useEffect(() => {
    setActiveTab(initialTab === "draft" || initialTab === "pending" ? "custom" : initialTab);
  }, [initialTab]);

  const handleOpenDeleteConfirm = (id: string, tab: string) => {
    let list = tab === "ootb" ? ootbSEC : customSEC;
    let name = list.find(s => s.id === id)?.name || "";
    setSecToDelete({ id, name, tab });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (secToDelete) {
      onDeleteSEC(secToDelete.id, secToDelete.tab);
      setDeleteConfirmOpen(false);
      setSecToDelete(null);
    }
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    const path = val === "custom" ? "sec-custom" : "sec";
    onBreadcrumbNavigate(path);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col p-0 overflow-hidden font-['Inter']">
       <PageHeader 
         title="SEC Management" 
         breadcrumbs={breadcrumbs} 
         onBreadcrumbNavigate={onBreadcrumbNavigate} 
       />
       <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-1 flex flex-col gap-0 overflow-hidden">
          <div className="bg-white border-b border-gray-100 px-4 sticky top-0 z-10 flex-none">
              <TabsList className="bg-transparent p-0 w-full justify-start border-b border-[#e0e0e0] flex h-[48px] rounded-none">
                 <TabsTrigger value="ootb" className={cn("relative h-full rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold")}>
                    <div className="flex items-center gap-2">
                      <span>OOTB SEC</span>
                      <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{ootbSEC.length}</Badge>
                    </div>
                 </TabsTrigger>
                 <TabsTrigger value="custom" className={cn("relative h-full rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold")}>
                    <div className="flex items-center gap-2">
                      <span>Custom SEC</span>
                      <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{customSEC.length}</Badge>
                    </div>
                 </TabsTrigger>
              </TabsList>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <TabsContent value="ootb" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <SECTableContent data={ootbSEC} onNavigate={(id) => onBreadcrumbNavigate(`sec-details-${id}`)} onEdit={(id) => onBreadcrumbNavigate(`sec-edit-${id}`)} onCreateSEC={() => onBreadcrumbNavigate("sec-create")} isOOTB={true} />
            </TabsContent>
            <TabsContent value="custom" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <SECTableContent data={customSEC} onNavigate={(id) => onBreadcrumbNavigate(`sec-details-${id}`)} onEdit={(id) => onBreadcrumbNavigate(`sec-edit-${id}`)} onCreateSEC={() => onBreadcrumbNavigate("sec-create")} onDelete={(id) => handleOpenDeleteConfirm(id, "custom")} onStatusChange={onStatusChangeSEC} />
            </TabsContent>
          </div>
       </Tabs>

       {/* Delete Confirmation Dialog */}
       <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[400px] p-0 border-0 rounded-lg overflow-hidden">
             <div className="bg-[#fff1f1] px-6 py-4 flex items-center gap-3">
                <TrashCan size={24} className="text-[#da1e28]" />
                <DialogTitle className="text-[#161616] text-[18px] font-semibold">Confirm Deletion</DialogTitle>
                 <DialogDescription className="sr-only">Confirm the deletion of this SEC configuration.</DialogDescription>
             </div>
             <div className="px-6 py-8">
                <p className="text-[14px] text-[#525252] leading-relaxed">
                   Are you sure you want to delete SEC <span className="font-bold text-[#161616]">"{secToDelete?.name}"</span>? 
                   This action cannot be undone.
                </p>
             </div>
             <DialogFooter className="bg-[#f4f4f4] px-6 py-4 flex items-center justify-end gap-3 sm:justify-end">
                <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="text-[#525252] hover:bg-gray-200 h-[48px] px-6">
                   Cancel
                </Button>
                <Button onClick={handleConfirmDelete} className="bg-[#da1e28] hover:bg-[#b21922] text-white h-[48px] px-8 rounded-none">
                   Delete
                </Button>
             </DialogFooter>
          </DialogContent>
       </Dialog>
    </div>
  );
}
