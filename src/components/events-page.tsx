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
  Document
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
import { LinkedSecDialog } from "./linked-sec-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "./ui/dialog";

// --- DATA TYPES ---
export interface EventItem {
  id: string;
  eventName: string;
  description: string;
  type: "Financial" | "Non-Financial";
  workspace: string;
  category?: "default" | "custom" | "draft" | "pending";
  linkedSec: number | null; 
  status: "Verified" | "Rejected" | "Drafted" | "Pending Approval";
  statusNote?: string;
  lastModified?: string;
  createdDate?: string;
  createdBy?: string;
  eventTypeLabel?: string;
  fields?: any[];
}

// --- INITIAL CONSTANTS (Exported for App.tsx state initialization) ---
export const OOTB_DATA: EventItem[] = [
  { id: "1", category: "default", eventName: "Account Opening", description: "New account creation events with customer onboarding data", type: "Financial", workspace: "Account", linkedSec: 4, status: "Verified", createdDate: "2024-01-10T09:00:00.000Z", createdBy: "System" },
  { id: "2", category: "default", eventName: "ACH Payment", description: "Automated Clearing House payment processing events", type: "Financial", workspace: "Transaction", linkedSec: 3, status: "Rejected", statusNote: "Duplicate field mapping for 'transaction_id'", createdDate: "2024-01-12T10:30:00.000Z", createdBy: "System" },
  { id: "3", category: "default", eventName: "ATM Withdrawal", description: "ATM cash withdrawal events with location information", type: "Financial", workspace: "ATM", linkedSec: 4, status: "Verified", createdDate: "2024-01-15T14:45:00.000Z", createdBy: "System" },
  { id: "4", category: "default", eventName: "Beneficiary Addition", description: "New beneficiary registration events for fund transfers", type: "Financial", workspace: "Beneficiary", linkedSec: 3, status: "Verified", createdDate: "2024-01-20T11:20:00.000Z", createdBy: "System" },
  { id: "5", category: "default", eventName: "Card Activation", description: "Card activation and issuance events", type: "Financial", workspace: "Card", linkedSec: 4, status: "Verified", createdDate: "2024-02-05T08:15:00.000Z", createdBy: "System" },
  { id: "6", category: "default", eventName: "Card Transaction", description: "Captures all card-based transaction events", type: "Financial", workspace: "Card", linkedSec: 2, status: "Verified", createdDate: "2024-02-10T16:40:00.000Z", createdBy: "System" },
  { id: "7", category: "default", eventName: "Check Deposit", description: "Check deposit events including remote capture", type: "Financial", workspace: "Transaction", linkedSec: 4, status: "Verified", createdDate: "2024-02-15T12:00:00.000Z", createdBy: "System" },
  { id: "8", category: "default", eventName: "Limit Modification", description: "Transaction and daily limit modification events", type: "Financial", workspace: "Account", linkedSec: 3, status: "Verified", createdDate: "2024-03-01T09:30:00.000Z", createdBy: "System" }
];

export const CUSTOM_DATA: EventItem[] = [
  { id: "c1", category: "custom", eventName: "Crypto Wallet Link", description: "Custom event for linking external crypto wallets", type: "Financial", workspace: "Account", linkedSec: 3, status: "Verified", createdDate: "2025-01-10T14:30:00.000Z", createdBy: "Admin User", eventTypeLabel: "Payment", lastModified: "2026-02-04T14:30:00.000Z" },
  { id: "c2", category: "custom", eventName: "Loyalty Point Redemption", description: "Internal loyalty program transaction events", type: "Financial", workspace: "Transaction", linkedSec: 4, status: "Verified", createdDate: "2025-01-12T10:15:00.000Z", createdBy: "Admin User", eventTypeLabel: "Internal", lastModified: "2026-02-04T10:15:00.000Z" },
  { id: "c3", category: "custom", eventName: "Third-party API Access", description: "Logging access via authorized partner APIs", type: "Non-Financial", workspace: "Terminal", linkedSec: 3, status: "Rejected", statusNote: "Unauthorized API scope requested", createdDate: "2025-01-15T16:45:00.000Z", createdBy: "Admin User", eventTypeLabel: "API", lastModified: "2026-02-03T16:45:00.000Z" },
  { id: "c4", category: "custom", eventName: "Merchant Dispute", description: "Manual entry for transaction dispute initiations", type: "Non-Financial", workspace: "Card", linkedSec: 2, status: "Verified", createdDate: "2025-01-20T09:00:00.000Z", createdBy: "Admin User", eventTypeLabel: "Dispute", lastModified: "2025-01-22T09:00:00.000Z" },
  { id: "c5", category: "custom", eventName: "Agentic AI Query", description: "Customer interactions with AI support agents", type: "Non-Financial", workspace: "Terminal", linkedSec: 4, status: "Verified", createdDate: "2025-01-25T11:00:00.000Z", createdBy: "Admin User", eventTypeLabel: "Support", lastModified: "2025-01-26T11:00:00.000Z" },
  { id: "c6", category: "custom", eventName: "High Velocity Login", description: "Automated detection of rapid login attempts", type: "Non-Financial", workspace: "Terminal", linkedSec: 3, status: "Verified", createdDate: "2025-01-28T14:00:00.000Z", createdBy: "Admin User", eventTypeLabel: "Security", lastModified: "2026-02-04T14:00:00.000Z" },
  { id: "c7", category: "custom", eventName: "Bulk Payroll Upload", description: "Corporate batch payroll processing events", type: "Financial", workspace: "Account", linkedSec: 4, status: "Verified", createdDate: "2025-01-29T08:30:00.000Z", createdBy: "Admin User", eventTypeLabel: "Bulk", lastModified: "2026-02-04T08:30:00.000Z" },
  { id: "c8", category: "custom", eventName: "Safe Deposit Access", description: "Physical access logs for branch safe deposits", type: "Non-Financial", workspace: "Terminal", linkedSec: 3, status: "Verified", createdDate: "2025-01-30T17:00:00.000Z", createdBy: "Admin User", eventTypeLabel: "Physical", lastModified: "2026-02-04T17:00:00.000Z" }
];

export const DRAFT_DATA: EventItem[] = [
  { id: "d1", category: "draft", eventName: "International Wire Draft", description: "Pending configuration for high-value offshore transfers", type: "Financial", workspace: "Transaction", linkedSec: null, status: "Drafted" },
  { id: "d2", category: "draft", eventName: "User Profile Sync", description: "Drafted mapping for external LDAP directory integration", type: "Non-Financial", workspace: "Customer", linkedSec: null, status: "Rejected", statusNote: "Field mapping for 'department' is missing or invalid" },
  { id: "d3", category: "draft", eventName: "New Product Launch", description: "Initial setup for upcoming credit product events", type: "Financial", workspace: "Account", linkedSec: null, status: "Drafted" }
];

export const PENDING_DATA: EventItem[] = [
  {
    id: "EVT-CUST-9021",
    category: "pending",
    eventName: "High_Value_Wire_Transfer",
    description: "Verification pending for international high-value transfer schema",
    type: "Financial",
    workspace: "Transaction",
    linkedSec: null,
    status: "Pending Approval"
  },
  {
    id: "EVT-CUST-9020",
    category: "pending",
    eventName: "Swift_Message_Modified",
    description: "Review required for modified Swift message fields mapping",
    type: "Financial",
    workspace: "Transaction",
    linkedSec: null,
    status: "Rejected",
    statusNote: "Incorrect field length for 'SWIFT_ID'"
  },
  {
    id: "EVT-CUST-9019",
    category: "pending",
    eventName: "Login_Location_Anomaly",
    description: "New custom event for tracking geofencing alerts",
    type: "Non-Financial",
    workspace: "Terminal",
    linkedSec: null,
    status: "Pending Approval"
  }
];


export const REFERENCE_DATA = [...OOTB_DATA, ...CUSTOM_DATA, ...DRAFT_DATA];

function EventsTableContent({ 
  data, 
  onNavigate, 
  onCreateEvent, 
  onDelete,
  actionType = "view",
  showDelete = true
}: { 
  data: EventItem[], 
  onNavigate: (id: string) => void, 
  onCreateEvent: () => void,
  onDelete?: (id: string) => void,
  actionType?: "view" | "edit" | "verify",
  showDelete?: boolean
}) {
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventForSec, setSelectedEventForSec] = useState<{id: string, name: string, count: number} | null>(null);

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

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesType = typeFilter === "all" || item.type.toLowerCase() === typeFilter;
      const matchesSearch = item.eventName.toLowerCase().includes(searchTerm.toLowerCase()) || 
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
    <div className="flex flex-col flex-1 w-full bg-white mt-0 overflow-hidden space-y-4 pt-0">
        <div className="flex-none flex items-center justify-between bg-white h-[48px] px-0 gap-4">
          <div className="flex items-center gap-4 h-full">
              <div className="relative w-[300px] h-[46px] flex items-center self-center">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full h-full pl-12 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
                />
              </div>
              
              <div className="flex items-center h-[46px] self-center">
                <div className="relative h-full flex items-center">
                   <select 
                     value={typeFilter}
                     onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                     className="bg-white border border-gray-300 rounded-[8px] h-full px-4 pr-10 text-[14px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[160px]"
                   >
                       <option value="all">All Types</option>
                       <option value="financial">Financial</option>
                       <option value="non-financial">Non-Financial</option>
                   </select>
                   <div className="absolute right-3 pointer-events-none text-gray-500">
                      <ChevronDown size={16} />
                   </div>
                </div>
              </div>
          </div>
          <div className="flex items-center h-full">
              <Button 
                onClick={onCreateEvent}
                className="h-[48px] rounded-[8px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white flex items-center gap-2 px-6 text-[14px] font-medium border-0 transition-colors"
              >
                <Add size={20} /> Add Custom Event
              </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="flex-1 hover-scroll bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#F0F0F0] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                        <th className="px-4 border-b border-[#e0e0e0] w-[200px] align-middle whitespace-nowrap">
                            <SortableHeader column="eventName" label="Event Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] align-middle whitespace-nowrap">
                            <span className="text-[14px] font-semibold text-[#2A53A0]">Description</span>
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[140px] align-middle whitespace-nowrap text-left">
                            <SortableHeader column="type" label="Type" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[120px] align-middle whitespace-nowrap text-center">
                            <SortableHeader column="linkedSec" label="Linked Sec" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold justify-center" />
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
                            <span className="text-[14px] text-[#161616] font-normal block truncate" title={row.eventName}>{row.eventName}</span>
                        </td>
                        <td className="px-4 align-middle">
                            <div className="flex flex-col py-1">
                              <span className="text-[14px] text-[#161616] font-normal block line-clamp-1" title={row.description}>{row.description}</span>
                            </div>
                        </td>
                        <td className="px-4 align-middle text-left">
                            <span className={cn(
                              "inline-flex items-center px-3 h-[28px] rounded-md text-[11px] font-medium whitespace-nowrap w-fit",
                              row.type === "Financial" ? "text-[#004144] bg-[#D9FBFB]" : "text-[#161616] bg-[#E0E0E0]"
                            )}>
                              {row.type}
                            </span>
                        </td>
                        <td className="px-4 align-middle text-center">
                            {row.linkedSec !== null ? (
                                <span className="text-[14px] text-[#161616] underline cursor-pointer font-normal" onClick={() => setSelectedEventForSec({ id: row.id, name: row.eventName, count: row.linkedSec || 0 })}>
                                  {row.linkedSec}
                                </span>
                            ) : (
                                <span className="text-gray-400 text-[14px] font-normal">-</span>
                            )}
                        </td>
                        <td className="px-4 align-middle text-left">
                           <div className="flex items-center justify-start gap-3">
                              {actionType === "verify" && (
                                <button className="w-[28px] h-[28px] flex items-center justify-center bg-[#defbe6] hover:bg-[#c8f7d4] rounded-md transition-colors text-[#198038]" title="Verify Event" onClick={() => onNavigate(row.id)}>
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
                        <td colSpan={5} className="h-48 text-center text-gray-500 text-sm">No events matching your criteria were found.</td>
                      </tr>
                    )}
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

        <LinkedSecDialog isOpen={!!selectedEventForSec} onClose={() => setSelectedEventForSec(null)} eventId={selectedEventForSec?.id || ""} eventName={selectedEventForSec?.name || ""} linkedSecCount={selectedEventForSec?.count || 0} />
    </div>
  );
}

import PageHeader from "./page-header";

export function EventsPage({ 
  breadcrumbs, 
  onBreadcrumbNavigate,
  initialTab = "ootb",
  ootbEvents,
  customEvents,
  draftEvents,
  pendingEvents,
  onDeleteEvent
}: { 
  breadcrumbs: any[], 
  onBreadcrumbNavigate: (path: string) => void,
  initialTab?: string,
  ootbEvents: EventItem[],
  customEvents: EventItem[],
  draftEvents: EventItem[],
  pendingEvents: EventItem[],
  onDeleteEvent: (id: string, tab: string) => void
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<{id: string, name: string, tab: string} | null>(null);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleOpenDeleteConfirm = (id: string, tab: string) => {
    let list = tab === "ootb" ? ootbEvents : tab === "custom" ? customEvents : tab === "draft" ? draftEvents : pendingEvents;
    let name = list.find(e => e.id === id)?.eventName || "";
    setEventToDelete({ id, name, tab });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      onDeleteEvent(eventToDelete.id, eventToDelete.tab);
      setDeleteConfirmOpen(false);
      setEventToDelete(null);
    }
  };

  const ootbCount = ootbEvents.length;
  const customCount = customEvents.length;
  const draftCount = draftEvents.length;
  const pendingCount = pendingEvents.length;

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    const path = val === "custom" ? "events-custom" : "events";
    onBreadcrumbNavigate(path);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col p-0 overflow-hidden">
       <PageHeader 
         title="Events Inventory" 
         breadcrumbs={breadcrumbs} 
         onBreadcrumbNavigate={onBreadcrumbNavigate} 
       />
       <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-1 flex flex-col gap-0 overflow-hidden">
          <div className="bg-white border-b border-gray-100 px-4 sticky top-0 z-10 flex-none">
              <TabsList className="bg-transparent p-0 w-full border-b border-[#e0e0e0] flex h-[48px] rounded-none">
                 <TabsTrigger value="ootb" className={cn("relative h-full flex-1 rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold flex items-center justify-center")}>
                    <div className="flex items-center gap-2">
                       <span>OOTB Events</span>
                       <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{ootbCount}</Badge>
                    </div>
                 </TabsTrigger>
                 <TabsTrigger value="custom" className={cn("relative h-full flex-1 rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[2px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold flex items-center justify-center")}>
                    <div className="flex items-center gap-2">
                       <span>Custom Events</span>
                       <Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{customCount}</Badge>
                    </div>
                 </TabsTrigger>
              </TabsList>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <TabsContent value="ootb" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <EventsTableContent data={ootbEvents} onNavigate={(id) => onBreadcrumbNavigate(`events-details-${id}`)} onCreateEvent={() => onBreadcrumbNavigate("events-create")} showDelete={false} />
            </TabsContent>
            <TabsContent value="custom" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <EventsTableContent data={customEvents} onNavigate={(id) => onBreadcrumbNavigate(`events-details-${id}`)} onCreateEvent={() => onBreadcrumbNavigate("events-create")} onDelete={(id) => handleOpenDeleteConfirm(id, "custom")} />
            </TabsContent>
          </div>
       </Tabs>

       <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent aria-describedby={undefined} className="max-w-[400px]">
             <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>Are you sure you want to delete event "{eventToDelete?.name}"? This action cannot be undone.</DialogDescription>
             </DialogHeader>
             <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleConfirmDelete} className="bg-[#da1e28] hover:bg-[#b91922]">Delete Event</Button>
             </DialogFooter>
          </DialogContent>
       </Dialog>
    </div>
  );
}
