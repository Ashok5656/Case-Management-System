import React, { useState, useMemo } from "react";
import { 
  Search, 
  ChevronDown, 
  Add, 
  View,
  Edit,
  Checkmark,
  Information,
  CheckmarkFilled,
  Time,
  User,
  TrashCan,
  Portfolio,
  Identification,
  Flash,
  Settings,
  Money,
  Enterprise,
  Document,
  Flow,
  Variable,
  DataCategorization,
  Code,
  Function,
  Tag,
  Launch
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner@2.0.3";
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
import { ScenariosDialog } from "./scenarios-dialog";
import { INITIAL_SCENARIO_DATA } from "./scenarios-data";

// --- DATA TYPES ---
export interface UDVItem {
  id: string;
  name: string;
  description: string;
  type: "Decimal" | "Boolean" | "Date" | "Integer" | "String" | "List" | "Array";
  entity: "Card" | "Transaction" | "Merchant" | "Customer" | "Account" | "System";
  mappedToEvent?: string;
  usedInScenarioCount?: number;
  category?: "default" | "custom" | "draft" | "pending";
  status: "Verified" | "Rejected" | "Draft" | "Pending Approval";
  lastModified?: string;
  createdDate?: string;
  createdBy?: string;
  defaultValue?: string;
  config?: {
    method: string | null;
    amount: string;
    channel: string;
    timePeriod: string;
    targetField: string;
    type?: string;
    subtype?: string;
  };
}

// --- INITIAL CONSTANTS ---
export const OOTB_UDV: UDVItem[] = [
  { 
    id: "u1", 
    category: "default", 
    name: "CARD_TXNAMT_DAILY_AVG_90D", 
    description: "Average daily transaction amount over the last 90 days", 
    type: "Decimal", 
    entity: "Card", 
    mappedToEvent: "Card Transaction", 
    usedInScenarioCount: 12, 
    status: "Verified",
    config: {
      method: "avg",
      amount: "ALL",
      channel: "ALL",
      timePeriod: "90d",
      targetField: "TRANSACTION_AMOUNT"
    }
  },
  { 
    id: "u2", 
    category: "default", 
    name: "CARD_IPCOUNTRY_IS_BLACKLISTED", 
    description: "Flag indicating if the IP country is in the blacklist", 
    type: "Boolean", 
    entity: "Transaction", 
    mappedToEvent: "Card Transaction", 
    usedInScenarioCount: 8, 
    status: "Verified" 
  },
  { 
    id: "u6", 
    category: "default", 
    name: "CARD_TXNAMT_MAX_7D", 
    description: "Maximum transaction amount in the last 7 days", 
    type: "Decimal", 
    entity: "Card", 
    mappedToEvent: "Card Transaction", 
    usedInScenarioCount: 5, 
    status: "Verified",
    config: {
      method: "max",
      amount: "ALL",
      channel: "ALL",
      timePeriod: "7d",
      targetField: "TRANSACTION_AMOUNT"
    }
  },
  { 
    id: "u9", 
    category: "default", 
    name: "ATM_TXN_COUNT_24H", 
    description: "Number of ATM withdrawals in the last 24 hours", 
    type: "Integer", 
    entity: "Card", 
    mappedToEvent: "ATM Transaction", 
    usedInScenarioCount: 9, 
    status: "Verified",
    config: {
      method: "count",
      amount: "ALL",
      channel: "ATM",
      timePeriod: "24h",
      targetField: ""
    }
  },
  { 
    id: "u10", 
    category: "default", 
    name: "MERCHANT_CATEGORY_RISK_SCORE", 
    description: "Risk score based on merchant category code (MCC)", 
    type: "Decimal", 
    entity: "Merchant", 
    mappedToEvent: "Card Transaction", 
    usedInScenarioCount: 4, 
    status: "Verified" 
  },
  { 
    id: "u11", 
    category: "default", 
    name: "CUSTOMER_KYC_VERIFICATION_STATUS", 
    description: "Current verification level of the customer profile", 
    type: "String", 
    entity: "Customer", 
    mappedToEvent: "Account Event", 
    usedInScenarioCount: 3, 
    status: "Verified" 
  },
  { 
    id: "u12", 
    category: "default", 
    name: "DEVICE_FINGERPRINT_MATCH_SCORE", 
    description: "Score comparing current device to known customer devices", 
    type: "Decimal", 
    entity: "System", 
    mappedToEvent: "Login Event", 
    usedInScenarioCount: 6, 
    status: "Verified" 
  },
  { 
    id: "u13", 
    category: "default", 
    name: "ACCOUNT_BALANCE_THRESHOLD_FLAG", 
    description: "Flag indicating if balance is below safety threshold", 
    type: "Boolean", 
    entity: "Account", 
    mappedToEvent: "System Event", 
    usedInScenarioCount: 2, 
    status: "Verified" 
  },
];

export const CUSTOM_UDV: UDVItem[] = [
  { 
    id: "uc1", 
    category: "custom", 
    name: "CARD_HIGH_VALUE_ONLINE_TXN_COUNT_7D", 
    description: "Count of high-value online transactions in last 7 days (>$1000)", 
    type: "Integer", 
    entity: "Customer", 
    mappedToEvent: "Card Transaction", 
    usedInScenarioCount: 5, 
    status: "Verified",
    createdDate: "January 10, 2024",
    createdBy: "John Smith",
    config: {
      method: "CARD_TXNCOUNT",
      amount: ">1000",
      channel: "ONLINE",
      timePeriod: "7D",
      type: "PURCHASE",
      subtype: "ALL",
      targetField: "TRANSACTION_AMOUNT"
    }
  },
  { 
    id: "uc2", 
    category: "custom", 
    name: "CARD_ATM_WITHDRAWAL_SUM_24H", 
    description: "Sum of ATM withdrawal amounts in last 24 hours", 
    type: "Decimal", 
    entity: "Account", 
    mappedToEvent: "Card Transaction", 
    usedInScenarioCount: 6, 
    status: "Verified" 
  },
  { 
    id: "uc3", 
    category: "custom", 
    name: "CARD_NEW_MERCHANT_SPEND_30D", 
    description: "Total spend at new merchants in last 30 days", 
    type: "Decimal", 
    entity: "Customer", 
    mappedToEvent: "Card Transaction", 
    usedInScenarioCount: 4, 
    status: "Rejected" 
  },
  { 
    id: "uc4", 
    category: "custom", 
    name: "CARD_TOP5_HIGH_RISK_MERCHANTS", 
    description: "Top 5 merchants by transaction count in last 90 days", 
    type: "Array", 
    entity: "Merchant", 
    mappedToEvent: "Card Transaction", 
    usedInScenarioCount: 3, 
    status: "Verified" 
  },
  { 
    id: "uc5", 
    category: "custom", 
    name: "CARD_INTERNATIONAL_TXN_DAILY_AVG", 
    description: "Daily average of international transaction volume", 
    type: "Decimal", 
    entity: "Account", 
    mappedToEvent: "Card Transaction", 
    usedInScenarioCount: 4, 
    status: "Verified" 
  },
  { 
    id: "uc6", 
    category: "custom", 
    name: "CARD_P99_TXNAMT_ONLINE_6M", 
    description: "99th percentile transaction amount for online purchases in last 6 months", 
    type: "Decimal", 
    entity: "Customer", 
    mappedToEvent: "Card Transaction", 
    usedInScenarioCount: 3, 
    status: "Verified" 
  },
  { 
    id: "uc7", 
    category: "custom", 
    name: "CARD_NEW_COUNTRY_SPEND_7D", 
    description: "Total spend in new countries in last 7 days", 
    type: "Decimal", 
    entity: "Card", 
    mappedToEvent: "Card Transaction", 
    usedInScenarioCount: 2, 
    status: "Verified" 
  }
];

export const DRAFT_UDV: UDVItem[] = [
  { 
    id: "ud1", 
    category: "draft", 
    name: "NEW_KYC_STATUS", 
    description: "Drafted variable for upcoming KYC integration update", 
    type: "String", 
    entity: "Customer", 
    status: "Draft" 
  },
  {
    id: "ud2",
    category: "draft",
    name: "CARD_LARGE_TXN_DRAFT",
    description: "Drafting a new velocity check for card transactions",
    type: "Decimal",
    entity: "Card",
    mappedToEvent: "Card Transaction",
    status: "Draft",
    config: {
      method: "sum",
      amount: ">5000",
      channel: "ALL",
      timePeriod: "24h",
      targetField: "TRANSACTION_AMOUNT"
    }
  }
];

export const PENDING_UDV: UDVItem[] = [
  { id: "up1", category: "pending", name: "AML_VELOCITY_CHECK", description: "Verification pending for high-frequency transfer counter", type: "Integer", entity: "Transaction", status: "Pending Approval" },
  { id: "up2", category: "pending", name: "HIGH_RISK_ENTITY_SCAN", description: "Scan for entities marked as high risk in external databases", type: "Boolean", entity: "System", status: "Rejected" }
];


function UDVTableContent({ 
  data, 
  onNavigate, 
  onCreateUDV, 
  onDelete,
  actionType = "view",
  showDelete = true
}: { 
  data: UDVItem[], 
  onNavigate: (id: string) => void, 
  onCreateUDV: () => void,
  onDelete?: (id: string) => void,
  actionType?: "view" | "edit" | "verify",
  showDelete?: boolean
}) {
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [entityFilter, setEntityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isScenariosDialogOpen, setIsScenariosDialogOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<{name: string, count: number} | null>(null);

  const handleOpenScenarios = (name: string, count: number) => {
    setSelectedVariable({ name, count });
    setIsScenariosDialogOpen(true);
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "Decimal": return "text-[#002D9C] bg-[#D0E2FF]";
      case "Boolean": return "text-[#004144] bg-[#D9FBFB]";
      case "Date": return "text-[#9F1853] bg-[#FFD7E1]";
      case "Integer": return "text-[#491D8B] bg-[#E8DAFF]";
      case "String": return "text-[#005D5D] bg-[#9EF0F0]";
      case "List": return "text-[#161616] bg-[#E0E0E0]";
      case "Array": return "text-[#A2191F] bg-[#FFD7E1]";
      default: return "text-[#2A53A0] bg-[#f0f4f9]";
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case "Card": return Identification;
      case "Transaction": return Flash;
      case "Merchant": return Enterprise;
      case "Customer": return User;
      case "Account": return Portfolio;
      case "System": return Settings;
      default: return Document;
    }
  };

  const getEntityStyle = (entity: string) => {
    switch (entity) {
      case "Account": return "text-[#198038] bg-[#defbe6]";
      case "Card": return "text-[#002D9C] bg-[#D0E2FF]";
      case "Transaction": return "text-[#004144] bg-[#D9FBFB]";
      case "System": return "text-[#161616] bg-[#E0E0E0]";
      case "Merchant": return "text-[#856404] bg-[#fff9e5]";
      case "Customer": return "text-[#491D8B] bg-[#E8DAFF]";
      default: return "text-[#2A53A0] bg-[#f0f4f9]";
    }
  };

  const getEventBadgeStyle = (event: string) => {
    if (!event || event === "N/A") return "text-[#525252] bg-[#f4f4f4]";
    if (event.includes("Transaction")) return "text-[#005d5d] bg-[#9ef0f0]";
    if (event.includes("Event")) return "text-[#8a3ffc] bg-[#f6f2ff]";
    return "text-[#002d9c] bg-[#d0e2ff]";
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesEntity = entityFilter === "all" || item.entity.toLowerCase() === entityFilter.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesEntity && matchesSearch;
    });
  }, [data, entityFilter, searchTerm]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className="flex flex-col flex-1 w-full bg-white mt-0 overflow-hidden space-y-4">
        <div className="flex-none flex items-center justify-between bg-white h-[48px] px-0 gap-4">
          <div className="flex items-center gap-4 h-full">
              <div className="relative w-[300px] h-[46px] flex items-center self-center">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search variables..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full h-full pl-12 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
                />
              </div>
              
              <div className="flex items-center h-[46px] self-center">
                <div className="relative h-full flex items-center">
                   <select 
                     value={entityFilter}
                     onChange={(e) => { setEntityFilter(e.target.value); setCurrentPage(1); }}
                     className="bg-white border border-gray-300 rounded-[8px] h-full px-4 pr-10 text-[14px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[160px]"
                   >
                       <option value="all">All Entities</option>
                       <option value="card">Card</option>
                       <option value="transaction">Transaction</option>
                       <option value="merchant">Merchant</option>
                       <option value="customer">Customer</option>
                       <option value="account">Account</option>
                   </select>
                   <div className="absolute right-3 pointer-events-none text-gray-500">
                      <ChevronDown size={16} />
                   </div>
                </div>
              </div>
          </div>
          <div className="flex items-center h-full">
              <Button 
                onClick={onCreateUDV}
                className="h-[48px] rounded-[8px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white flex items-center gap-2 px-6 text-[14px] font-medium border-0 shadow-sm transition-colors"
              >
                <Add size={20} /> Add Custom UDV
              </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="flex-1 hover-scroll bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#F0F0F0] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                        <th className="px-4 border-b border-[#e0e0e0] w-[20%] align-middle whitespace-nowrap">
                            <SortableHeader column="name" label="Variable Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap">
                            <SortableHeader column="type" label="Data Type" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap">
                            <SortableHeader column="entity" label="Entity" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[25%] align-middle whitespace-nowrap">
                            <SortableHeader column="description" label="Description" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[15%] align-middle whitespace-nowrap">
                            <SortableHeader column="mappedToEvent" label="Mapped To Event" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap text-center">
                            <SortableHeader column="usedInScenarioCount" label="Used In Scenario" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold justify-center" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[10%] text-left align-middle select-none">
                            <span className="text-[14px] font-semibold text-[#2A53A0] ml-1">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {paginatedData.length > 0 ? paginatedData.map((row) => (
                    <tr key={row.id} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
                        <td className="px-4 align-middle">
                            <div className="max-w-[180px]">
                                <span className="text-[14px] text-[#161616] font-normal block truncate" title={row.name}>{row.name}</span>
                            </div>
                        </td>
                        <td className="px-4 align-middle">
                            <div className={cn(
                                "inline-flex items-center px-3 h-[28px] rounded-md text-[11px] font-medium whitespace-nowrap w-fit",
                                getTypeStyle(row.type)
                            )}>
                                <span>{row.type}</span>
                            </div>
                        </td>
                        <td className="px-4 align-middle">
                            <div className={cn(
                                "inline-flex items-center gap-2 px-3 h-[28px] rounded-md text-[11px] font-medium whitespace-nowrap w-fit",
                                getEntityStyle(row.entity)
                            )}>
                                {(() => {
                                    const Icon = getEntityIcon(row.entity);
                                    return <Icon size={12} className="shrink-0" />;
                                })()}
                                <span>{row.entity}</span>
                            </div>
                        </td>
                        <td className="px-4 align-middle">
                            <div className="max-w-[220px]">
                                <span className="text-[14px] text-[#161616] font-normal block truncate" title={row.description}>{row.description}</span>
                            </div>
                        </td>
                        <td className="px-4 align-middle">
                            <div className="max-w-[140px]">
                                <div className={cn(
                                    "inline-flex items-center px-3 h-[24px] rounded-md text-[11px] font-medium whitespace-nowrap w-fit truncate",
                                    getEventBadgeStyle(row.mappedToEvent || "N/A")
                                )}>
                                    <span>{row.mappedToEvent || "N/A"}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-4 align-middle text-center">
                            <div 
                              className="flex items-center justify-center gap-1.5 text-[13px] text-[#2A53A0] font-medium cursor-pointer hover:underline"
                              onClick={() => handleOpenScenarios(row.name, row.usedInScenarioCount || 0)}
                            >
                                <span>{row.usedInScenarioCount || 0}</span>
                                <Launch size={14} />
                            </div>
                        </td>
                        <td className="px-4 align-middle text-left">
                           <div className="flex items-center justify-start gap-3">
                              {actionType === "verify" && (
                                <button className="w-[28px] h-[28px] flex items-center justify-center bg-[#defbe6] hover:bg-[#c8f7d4] rounded-md transition-colors text-[#198038]" title="Verify Variable" onClick={() => onNavigate(row.id)}>
                                    <Checkmark size={16} />
                                </button>
                              )}
                              {actionType === "view" && (
                                <button className="w-[28px] h-[28px] flex items-center justify-center bg-[#edf5ff] hover:bg-[#d0e2ff] rounded-md transition-colors text-[#0043ce]" title="View Details" onClick={() => onNavigate(row.id)}>
                                    <View size={16} />
                                </button>
                              )}
                              {actionType === "edit" && (
                                <button className="w-[28px] h-[28px] flex items-center justify-center bg-[#f6f2ff] hover:bg-[#e8daff] rounded-md transition-colors text-[#8a3ffc]" title="Edit Draft" onClick={() => onNavigate(row.id)}>
                                    <Edit size={16} />
                                </button>
                              )}
                              {showDelete && (
                                <button className="w-[28px] h-[28px] flex items-center justify-center bg-[#fff1f1] hover:bg-[#ffd7d9] rounded-md transition-colors text-[#da1e28]" title="Delete" onClick={() => onDelete?.(row.id)}>
                                    <TrashCan size={16} />
                                </button>
                              )}
                           </div>
                        </td>
                    </tr>
                    )) : (
                      <tr>
                        <td colSpan={7} className="h-48 text-center text-gray-500 text-sm">No variables matching your criteria were found.</td>
                      </tr>
                    )}
                </tbody>
            </table>
          </div>

          <CarbonPaginationFooter pageSize={pageSize} setPageSize={setPageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={sortedData.length} />
        </div>

        <ScenariosDialog 
          isOpen={isScenariosDialogOpen}
          onOpenChange={setIsScenariosDialogOpen}
          variableName={selectedVariable?.name || ""}
          count={selectedVariable?.count || 0}
          scenarios={INITIAL_SCENARIO_DATA.map(s => ({
            title: s.name,
            description: s.description
          }))}
        />
    </div>
  );
}

import PageHeader from "./page-header";

export function UDVPage({ 
  breadcrumbs, 
  onBreadcrumbNavigate,
  initialTab = "ootb",
  ootbUDV,
  customUDV,
  draftUDV,
  pendingUDV,
  onDeleteUDV
}: { 
  breadcrumbs: any[], 
  onBreadcrumbNavigate: (path: string) => void,
  initialTab?: string,
  ootbUDV: UDVItem[],
  customUDV: UDVItem[],
  draftUDV: UDVItem[],
  pendingUDV: UDVItem[],
  onDeleteUDV: (id: string, tab: string) => void
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [udvToDelete, setUdvToDelete] = useState<{id: string, name: string, tab: string} | null>(null);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleOpenDeleteConfirm = (id: string, tab: string) => {
    let list = tab === "ootb" ? ootbUDV : tab === "custom" ? customUDV : tab === "draft" ? draftUDV : pendingUDV;
    let name = list.find(u => u.id === id)?.name || "";
    setUdvToDelete({ id, name, tab });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (udvToDelete) {
      onDeleteUDV(udvToDelete.id, udvToDelete.tab);
      setDeleteConfirmOpen(false);
      setUdvToDelete(null);
    }
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    const path = val === "custom" ? "udv-custom" : "udv";
    onBreadcrumbNavigate(path);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col p-0 overflow-hidden">
       <PageHeader 
         title="UDV Inventory" 
         breadcrumbs={breadcrumbs} 
         onBreadcrumbNavigate={onBreadcrumbNavigate} 
       />
       <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-1 flex flex-col gap-0 overflow-hidden">
          <div className="bg-white border-b border-gray-100 px-4 sticky top-0 z-10 flex-none">
              <TabsList className="bg-transparent p-0 w-full justify-start border-b border-[#e0e0e0] flex h-[48px] rounded-none">
                 <TabsTrigger value="ootb" className={cn("relative h-full flex-1 rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold flex items-center justify-center")}>
                    <div className="flex items-center gap-2">
                      <span>Available IPVs</span>
                      <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{ootbUDV.length}</Badge>
                    </div>
                 </TabsTrigger>
                 <TabsTrigger value="custom" className={cn("relative h-full flex-1 rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold flex items-center justify-center")}>
                    <div className="flex items-center gap-2">
                      <span>Custom UDV</span>
                      <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{customUDV.length}</Badge>
                    </div>
                 </TabsTrigger>
              </TabsList>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <TabsContent value="ootb" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <UDVTableContent data={ootbUDV} onNavigate={(id) => onBreadcrumbNavigate(`udv-details-${id}`)} onCreateUDV={() => onBreadcrumbNavigate("udv-create")} showDelete={false} />
            </TabsContent>
            <TabsContent value="custom" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <UDVTableContent data={customUDV} onNavigate={(id) => onBreadcrumbNavigate(`udv-details-${id}`)} onCreateUDV={() => onBreadcrumbNavigate("udv-create")} onDelete={(id) => handleOpenDeleteConfirm(id, "custom")} actionType="view" />
            </TabsContent>
          </div>
       </Tabs>

       {/* Delete Confirmation Dialog */}
       <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[400px] p-0 border-0 rounded-lg overflow-hidden">
             <div className="bg-[#fff1f1] px-6 py-4 flex items-center gap-3">
                <TrashCan size={24} className="text-[#da1e28]" />
                <DialogTitle className="text-[#161616] text-[18px] font-semibold">Confirm Deletion</DialogTitle>
                 <DialogDescription className="sr-only">Confirm the deletion of this UDV configuration.</DialogDescription>
             </div>
             <div className="px-6 py-8">
                <p className="text-[14px] text-[#525252] leading-relaxed">
                   Are you sure you want to delete <span className="font-bold text-[#161616]">"{udvToDelete?.name}"</span>? 
                   This action cannot be undone and may affect scenarios using this variable.
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
