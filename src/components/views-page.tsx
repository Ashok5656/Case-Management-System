import React, { useState, useMemo } from "react";
import { 
  Search, 
  ChevronDown, 
  Add, 
  View,
  Edit,
  Checkmark,
  TrashCan,
  Table,
  ChartBar,
  ChartLine,
  ChartRadar,
  DataCategorization,
  Filter,
  Layers,
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
export interface ViewItem {
  id: string;
  name: string;
  viewType: "OOTB" | "Custom";
  sourceTable: string;
  conditions: string;
  description?: string;
  selectedColumns?: string[];
  scenarioCount: number;
  createdBy: string;
  createdOn: string;
  status: "Verified" | "Rejected" | "Draft" | "Pending Approval";
}

// --- INITIAL CONSTANTS ---
export const OOTB_VIEWS: ViewItem[] = [
  { 
    id: "v1", 
    name: "High Risk Countries", 
    viewType: "OOTB", 
    sourceTable: "Blacklist Scenario-wise", 
    conditions: "Entity_Type = COUNTRY AND Risk_Score > 80", 
    description: "System-managed view identifying transactions from jurisdictions with strategic AML/CFT deficiencies as defined by FATF and regional regulatory bodies. This view is automatically updated based on the latest compliance circulars.",
    selectedColumns: ["Entity_Type", "Entity_Value", "Violation_Count", "Last_Seen", "Risk_Reason", "Confidence_Score", "Source_List"],
    scenarioCount: 5, 
    createdBy: "System", 
    createdOn: "2024-01-01",
    status: "Verified"
  },
  { 
    id: "v4", 
    name: "Suspicious Merchants", 
    viewType: "OOTB", 
    sourceTable: "Blacklist Scenario-wise", 
    conditions: "Entity_Type = MERCHANT AND Violation_Count > 10", 
    description: "Aggregated real-time monitoring of Merchant IDs (MIDs) that have crossed the threshold for suspicious activity across the merchant acquiring network. Includes flagging for high chargeback ratios and rapid velocity bursts.",
    selectedColumns: ["Entity_Type", "Entity_Value", "Violation_Count", "Risk_Reason", "Investigation_Status", "Internal_Notes"],
    scenarioCount: 8, 
    createdBy: "System", 
    createdOn: "2024-01-01",
    status: "Verified"
  },
  { 
    id: "v5", 
    name: "Sanctioned Entity Monitor", 
    viewType: "OOTB", 
    sourceTable: "Blacklist Global", 
    conditions: "Status = 'ACTIVE' AND Source = 'OFAC'", 
    description: "Global master view synchronizing active entities from OFAC SDN list, UN Sanctions, and EU Enforcement lists. Designed for hard-stop filtering during the transaction authorization phase.",
    selectedColumns: ["Entity_Type", "Entity_Value", "Risk_Level", "Status", "Source_List", "Reason"],
    scenarioCount: 12, 
    createdBy: "System", 
    createdOn: "2023-12-15",
    status: "Verified"
  }
];

export const CUSTOM_VIEWS: ViewItem[] = [
  { 
    id: "v2", 
    name: "Trusted Corporate Cards", 
    viewType: "Custom", 
    sourceTable: "Whitelist Scenario-wise", 
    conditions: "Entity_Type = CARD AND Customer_Segment = 'ENTERPRISE'", 
    description: "Whitelisted card numbers belonging to verified enterprise accounts to bypass low-priority velocity alerts.",
    selectedColumns: ["Entity_Type", "Entity_Value", "Scenarios", "Status", "Expiry_Date", "Reason"],
    scenarioCount: 0, 
    createdBy: "John Doe", 
    createdOn: "2024-11-15",
    status: "Verified"
  },
  { 
    id: "v3", 
    name: "VIP Customer Accounts", 
    viewType: "Custom", 
    sourceTable: "Whitelist Scenario-wise", 
    conditions: "Entity_Type = ACCOUNT AND Balance > 100000", 
    description: "Monitoring view for high-net-worth individual accounts requiring white-glove alert handling and specialized risk scoring.",
    selectedColumns: ["Entity_Type", "Entity_Value", "Created_At", "Updated_At", "Created_By", "Reason"],
    scenarioCount: 3, 
    createdBy: "Jane Smith", 
    createdOn: "2024-10-20",
    status: "Verified"
  }
];

export const DRAFT_VIEWS: ViewItem[] = [
  { 
    id: "vd1", 
    name: "Predictive Fraud Trends", 
    viewType: "Custom", 
    sourceTable: "fraud_ml_output", 
    conditions: "Probability > 0.85 AND ..", 
    scenarioCount: 2, 
    createdBy: "Rajesh Kumar", 
    createdOn: "2025-01-10",
    status: "Draft"
  }
];

export const PENDING_VIEWS: ViewItem[] = [
  { 
    id: "vp1", 
    name: "Executive Risk Scorecard", 
    viewType: "Custom", 
    sourceTable: "enterprise_risk_index", 
    conditions: "Dept = 'EXEC' AND ..", 
    scenarioCount: 4, 
    createdBy: "Amit Shah", 
    createdOn: "2025-01-25",
    status: "Pending Approval"
  },
  {
    id: "vp2",
    name: "Legacy_Audit_View",
    viewType: "Custom",
    sourceTable: "old_logs_2023",
    conditions: "all",
    scenarioCount: 0,
    createdBy: "Rajesh Kumar",
    createdOn: "2025-01-20",
    status: "Rejected"
  }
];


function ViewsTableContent({ 
  data, 
  onViewData, 
  onEditConfig,
  onViewConfig,
  onCreateView, 
  onDelete,
  showDelete = true,
  isOOTB = false
}: { 
  data: ViewItem[], 
  onViewData: (id: string) => void, 
  onEditConfig: (id: string) => void,
  onViewConfig: (id: string) => void,
  onCreateView: () => void,
  onDelete?: (id: string) => void,
  showDelete?: boolean,
  isOOTB?: boolean
}) {
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesType = typeFilter === "all" || item.viewType.toLowerCase() === typeFilter.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sourceTable.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [data, typeFilter, searchTerm]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className="flex flex-col flex-1 w-full bg-white mt-0 overflow-hidden space-y-4">
        <div className="flex-none flex items-center justify-between bg-white h-[48px] px-0 gap-4">
          <div className="flex items-center gap-4 h-full">
              <div className="relative w-[300px] h-full flex items-center">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search size={16} />
                </div>
                <input 
                   type="text" 
                   placeholder="Search views..." 
                   value={searchTerm}
                   onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                   className="w-full h-full pl-12 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
                />
              </div>
          </div>
          <div className="flex items-center h-full">
              <Button 
                onClick={onCreateView}
                className="h-[48px] rounded-sm bg-[#2A53A0] hover:bg-[#1e3c75] text-white flex items-center gap-2 px-6 text-[14px] font-medium border-0 shadow-sm transition-colors"
              >
                <Add size={20} /> Add Custom View
              </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="flex-1 bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
                <thead>
                    <tr className="bg-[#F0F0F0] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                        <th className="px-4 border-b border-[#e0e0e0] w-[180px] align-middle whitespace-nowrap">
                            <SortableHeader column="name" label="View Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[90px] align-middle whitespace-nowrap text-left">
                            <SortableHeader column="viewType" label="View Type" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[180px] align-middle whitespace-nowrap">
                            <SortableHeader column="sourceTable" label="Source Table" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[250px] align-middle whitespace-nowrap">
                            <SortableHeader column="conditions" label="Conditions" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[100px] align-middle whitespace-nowrap text-center">
                            <SortableHeader column="scenarioCount" label="Scenarios" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[120px] align-middle whitespace-nowrap">
                            <SortableHeader column="createdBy" label="Created By" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[110px] align-middle whitespace-nowrap">
                            <SortableHeader column="createdOn" label="Created On" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className={cn("px-4 border-b border-[#e0e0e0] text-left align-middle select-none", isOOTB ? "w-[80px]" : "w-[120px]")}>
                            <span className="text-[14px] font-medium text-[#2A53A0] ml-1">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {paginatedData.length > 0 ? paginatedData.map((row) => (
                    <tr key={row.id} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
                        <td className="px-4 align-middle">
                            <span className="text-[14px] text-[#161616] font-semibold block truncate cursor-pointer hover:text-[#2A53A0]" onClick={() => onViewData(row.id)} title={row.name}>{row.name}</span>
                        </td>
                        <td className="px-4 align-middle">
                            <Badge className={cn(
                               "text-[10px] font-medium px-2 py-0 rounded-sm border-0 uppercase h-[20px] flex items-center justify-center whitespace-nowrap w-fit",
                               row.viewType === "OOTB" ? "bg-[#e5f6ff] text-[#0066cc]" : "bg-[#fff2e5] text-[#cc6600]"
                             )}>
                               {row.viewType}
                             </Badge>
                        </td>
                        <td className="px-4 align-middle">
                             <span className="text-[14px] text-[#161616] block truncate" title={row.sourceTable}>{row.sourceTable}</span>
                        </td>
                        <td className="px-4 align-middle">
                             <span className="text-[14px] text-[#525252] font-mono block truncate" title={row.conditions}>{row.conditions}</span>
                        </td>
                        <td className="px-4 align-middle text-center">
                            <div className="flex items-center justify-center gap-1.5">
                               <button className="text-[14px] text-[#161616] font-normal underline underline-offset-4 decoration-[#161616]/30 hover:decoration-[#161616]">
                                 {row.scenarioCount}
                               </button>
                               <Launch size={14} className="text-[#2A53A0]" />
                            </div>
                        </td>
                        <td className="px-4 align-middle text-[13px] text-[#161616] truncate">
                             {row.createdBy}
                        </td>
                        <td className="px-4 align-middle text-[13px] text-[#161616]">
                             {row.createdOn}
                        </td>
                        <td className="px-4 align-middle text-left">
                           <div className="flex items-center justify-start gap-3">
                              {/* View Action - Redirects to unified Details page */}
                              <button 
                                className="w-[28px] h-[28px] min-w-[28px] min-h-[28px] flex items-center justify-center bg-[#edf5ff] hover:bg-[#d0e2ff] rounded-md transition-colors text-[#0043ce] shrink-0" 
                                title="View Details" 
                                onClick={() => onViewData(row.id)}
                              >
                                  <View size={16} />
                              </button>

                              {/* Edit Action - Only for Custom */}
                              {row.viewType === "Custom" ? (
                                <>
                                  <button 
                                    className="w-[28px] h-[28px] min-w-[28px] min-h-[28px] flex items-center justify-center bg-[#f6f2ff] hover:bg-[#e8daff] rounded-md transition-colors text-[#8a3ffc] shrink-0" 
                                    title="Edit Configuration" 
                                    onClick={() => onEditConfig(row.id)}
                                  >
                                      <Edit size={16} />
                                  </button>
                                  {showDelete && (
                                    <button 
                                      className="w-[28px] h-[28px] min-w-[28px] min-h-[28px] flex items-center justify-center bg-[#fff1f1] hover:bg-[#ffd7d9] rounded-md transition-colors text-[#da1e28] shrink-0" 
                                      title="Delete" 
                                      onClick={() => onDelete?.(row.id)}
                                    >
                                        <TrashCan size={16} />
                                    </button>
                                  )}
                                </>
                              ) : null}
                           </div>
                        </td>
                    </tr>
                    )) : (
                      <tr>
                        <td colSpan={8} className="h-48 text-center text-gray-500 text-sm">No views matching your criteria were found.</td>
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

export function ViewsPage({ 
  breadcrumbs, 
  onBreadcrumbNavigate,
  initialTab = "ootb",
  ootbViews,
  customViews,
  draftViews,
  pendingViews,
  onDeleteView,
}: { 
  breadcrumbs: any[], 
  onBreadcrumbNavigate: (path: string) => void,
  initialTab?: string,
  ootbViews: ViewItem[],
  customViews: ViewItem[],
  draftViews: ViewItem[],
  pendingViews: ViewItem[],
  onDeleteView: (id: string, tab: string) => void,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [viewToDelete, setViewToDelete] = useState<{id: string, name: string, tab: string} | null>(null);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleOpenDeleteConfirm = (id: string, tab: string) => {
    let list = tab === "ootb" ? ootbViews : tab === "custom" ? customViews : tab === "draft" ? draftViews : pendingViews;
    let name = list.find(v => v.id === id)?.name || "";
    setViewToDelete({ id, name, tab });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (viewToDelete) {
      onDeleteView(viewToDelete.id, viewToDelete.tab);
      setDeleteConfirmOpen(false);
      setViewToDelete(null);
    }
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    const path = `views-management-views:${val}`;
    onBreadcrumbNavigate(path);
  };

  const handleViewAction = (id: string) => {
    // Both View Data and View Configuration are shown in the Detail page
    onBreadcrumbNavigate(`views-management-views:data-${id}:${activeTab}`);
  };

  const handleEditAction = (id: string) => {
    onBreadcrumbNavigate(`views-management-views:edit-${id}:${activeTab}`);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col p-0 overflow-hidden">
       <PageHeader 
         title="View Management" 
         breadcrumbs={breadcrumbs} 
         onBreadcrumbNavigate={onBreadcrumbNavigate} 
       />
       <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-1 flex flex-col gap-0 overflow-hidden">
          <div className="bg-white border-b border-gray-100 px-4 sticky top-0 z-10 flex-none">
              <TabsList className="bg-transparent p-0 w-full justify-start border-b border-[#e0e0e0] flex h-[48px] rounded-none">
                 <TabsTrigger value="ootb" className={cn("relative h-full rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold")}>
                    <div className="flex items-center gap-2">
                      <span>OOTB Views</span>
                      <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{ootbViews.length}</Badge>
                    </div>
                 </TabsTrigger>
                 <TabsTrigger value="custom" className={cn("relative h-full rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold")}>
                    <div className="flex items-center gap-2">
                      <span>Custom Views</span>
                      <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{customViews.length}</Badge>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <TabsContent value="ootb" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <ViewsTableContent 
                  data={ootbViews} 
                  onViewData={(id) => onBreadcrumbNavigate(`views-management-views:data-${id}:${activeTab}`)} 
                  onViewConfig={(id) => onBreadcrumbNavigate(`views-management-views:config-${id}:${activeTab}`)}
                  onEditConfig={() => {}} // No edit for OOTB
                  onCreateView={() => onBreadcrumbNavigate(`views-management-views:create:${activeTab}`)} 
                  showDelete={false} 
                  isOOTB={true} 
                />
            </TabsContent>
            <TabsContent value="custom" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <ViewsTableContent 
                  data={customViews} 
                  onViewData={(id) => onBreadcrumbNavigate(`views-management-views:data-${id}:${activeTab}`)} 
                  onViewConfig={(id) => onBreadcrumbNavigate(`views-management-views:config-${id}:${activeTab}`)}
                  onEditConfig={(id) => onBreadcrumbNavigate(`views-management-views:edit-${id}:${activeTab}`)}
                  onCreateView={() => onBreadcrumbNavigate(`views-management-views:create:${activeTab}`)} 
                  onDelete={(id) => handleOpenDeleteConfirm(id, "custom")} 
                />
            </TabsContent>
          </div>
       </Tabs>

       {/* Delete Confirmation Dialog */}
       <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[400px] p-0 border-0 rounded-lg overflow-hidden">
             <div className="bg-[#fff1f1] px-6 py-4 flex items-center gap-3">
                <TrashCan size={24} className="text-[#da1e28]" />
                <DialogTitle className="text-[#161616] text-[18px] font-semibold">Confirm Deletion</DialogTitle>
                 <DialogDescription className="sr-only">Confirm the deletion of this view configuration.</DialogDescription>
             </div>
             <div className="px-6 py-8">
                <p className="text-[14px] text-[#525252] leading-relaxed">
                   Are you sure you want to delete view <span className="font-bold text-[#161616]">"{viewToDelete?.name}"</span>? 
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
