import React, { useState, useMemo } from "react";
import { 
  Search, 
  ChevronDown, 
  Add, 
  Upload,
  View,
  Edit,
  TrashCan,
  Table,
  Launch,
  Identification,
  Portfolio,
  Flash,
  Settings,
  User,
  Money,
  Enterprise,
  Document,
  CheckmarkFilled,
  WarningFilled,
  Earth,
  Purchase,
  Email,
  Phone,
  Location,
  Calendar
} from "@carbon/icons-react";
import PageHeader from "./page-header";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";
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

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { format } from "date-fns";

// --- DATA TYPES ---
export interface LookupTableItem {
  id: string;
  entityId: string;
  type: string;
  value: string;
  reason: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  status: "Verified" | "Rejected" | "Draft" | "Pending Approval";
  listType: "whitelist-global" | "blacklist-global" | "whitelist-scenario" | "blacklist-scenario";
  scenariosCount?: number;
  createdBy: string;
  createdDate: string;
  comments: string;
}

// --- MOCK DATA ---
export const LOOKUP_TABLES_DATA: LookupTableItem[] = [
  // Whitelist Global
  { 
    id: "lt1", 
    entityId: "WL-2024-001", 
    type: "COUNTRY", 
    value: "USA", 
    reason: "Trusted jurisdiction for high-value transactions", 
    dateRange: "01/01/2024, 09:00 -> 31/12/2024, 18:00", 
    startDate: "01/01/2024, 09:00",
    endDate: "31/12/2024, 18:00",
    status: "Verified", 
    listType: "whitelist-global",
    createdBy: "John Doe",
    createdDate: "01/01/2024, 15:30",
    comments: "Annual review completed"
  },
  { 
    id: "lt2", 
    entityId: "WL-2024-002", 
    type: "BIN", 
    value: "411111", 
    reason: "Corporate card program for enterprise customers", 
    dateRange: "15/03/2024, 10:00 -> Ongoing", 
    startDate: "15/03/2024, 10:00",
    endDate: "Ongoing",
    status: "Verified", 
    listType: "whitelist-global",
    createdBy: "Jane Smith",
    createdDate: "14/03/2024, 11:20",
    comments: "Approved by Treasury"
  },
  { 
    id: "lt3", 
    entityId: "WL-2024-003", 
    type: "ACCOUNT", 
    value: "ACC-882190", 
    reason: "Internal payroll funding account", 
    dateRange: "01/01/2024, 00:00 -> Ongoing", 
    startDate: "01/01/2024, 00:00",
    endDate: "Ongoing",
    status: "Verified", 
    listType: "whitelist-global",
    createdBy: "Robert Wilson",
    createdDate: "30/12/2023, 16:45",
    comments: "Operational account"
  },
  { 
    id: "lt3-b", 
    entityId: "WL-2024-004", 
    type: "MERCHANT", 
    value: "AMZN_US_8821", 
    reason: "Pre-approved e-commerce platform for corporate procurement", 
    dateRange: "01/02/2024, 00:00 -> Ongoing", 
    startDate: "01/02/2024, 00:00",
    endDate: "Ongoing",
    status: "Verified", 
    listType: "whitelist-global",
    createdBy: "Alice Brown",
    createdDate: "31/01/2024, 09:00",
    comments: "Verified merchant"
  },
  
  // Blacklist Global
  { 
    id: "lt4", 
    entityId: "BL-2024-001", 
    type: "COUNTRY", 
    value: "PRK", 
    reason: "FATF Non-Cooperative Jurisdiction", 
    dateRange: "01/01/2024, 09:00 -> Ongoing", 
    startDate: "01/01/2024, 09:00",
    endDate: "Ongoing",
    status: "Verified", 
    listType: "blacklist-global",
    createdBy: "Security Team",
    createdDate: "01/01/2024, 00:00",
    comments: "High-risk jurisdiction"
  },
  { 
    id: "lt5", 
    entityId: "BL-2024-002", 
    type: "IP", 
    value: "192.168.1.100", 
    reason: "Flagged for botnet activity in multiple scenarios", 
    dateRange: "05/02/2026, 08:00 -> 05/03/2026, 08:00", 
    startDate: "05/02/2026, 08:00",
    endDate: "05/03/2026, 08:00",
    status: "Verified", 
    listType: "blacklist-global",
    createdBy: "Auto Guard",
    createdDate: "05/02/2026, 07:55",
    comments: "Temporary block"
  },
  { 
    id: "lt6", 
    entityId: "BL-2024-003", 
    type: "EMAIL", 
    value: "temp-user@malicious.com", 
    reason: "Disposable email domain used in account fraud", 
    dateRange: "01/02/2026, 12:00 -> Ongoing", 
    startDate: "01/02/2026, 12:00",
    endDate: "Ongoing",
    status: "Verified", 
    listType: "blacklist-global",
    createdBy: "Fraud Engine",
    createdDate: "01/02/2026, 11:59",
    comments: "Domain blacklist"
  },
  
  // Whitelist Scenario-wise (Based on reference image)
  { 
    id: "lt7", 
    entityId: "WL-SW-001", 
    type: "BIN", 
    value: "411111", 
    scenariosCount: 4, 
    reason: "Trusted issuer BIN for cross-border transactions", 
    dateRange: "01/01/2024, 08:00 -> 31/12/2024, 20:00", 
    startDate: "01/01/2024, 08:00",
    endDate: "31/12/2024, 20:00",
    status: "Verified", 
    listType: "whitelist-scenario",
    createdBy: "Global Ops",
    createdDate: "31/12/2023, 23:59",
    comments: "Scenario-specific exemption"
  },
  { 
    id: "lt8", 
    entityId: "WL-SW-002", 
    type: "MERCHANT", 
    value: "STRIPE_TEST_88", 
    scenariosCount: 2, 
    reason: "QA Testing merchant for scenario validation", 
    dateRange: "15/02/2026, 09:00 -> 15/03/2026, 18:00", 
    startDate: "15/02/2026, 09:00",
    endDate: "15/03/2026, 18:00",
    status: "Verified", 
    listType: "whitelist-scenario",
    createdBy: "QA Analyst",
    createdDate: "14/02/2026, 10:00",
    comments: "Verified for sprint testing"
  },
  { 
    id: "lt8-b", 
    entityId: "WL-SW-003", 
    type: "IP", 
    value: "10.0.0.1", 
    scenariosCount: 3, 
    reason: "Internal VPN gateway for developer access", 
    dateRange: "01/01/2026, 00:00 -> Ongoing", 
    startDate: "01/01/2026, 00:00",
    endDate: "Ongoing",
    status: "Verified", 
    listType: "whitelist-scenario",
    createdBy: "IT Security",
    createdDate: "31/12/2025, 22:00",
    comments: "Permanent internal exemption"
  },
  { 
    id: "lt8-c", 
    entityId: "WL-SW-004", 
    type: "CARD", 
    value: "**** 4444", 
    scenariosCount: 1, 
    reason: "VIP Customer corporate card exemption", 
    dateRange: "10/02/2026, 08:00 -> 10/02/2027, 23:59", 
    startDate: "10/02/2026, 08:00",
    endDate: "10/02/2027, 23:59",
    status: "Verified", 
    listType: "whitelist-scenario",
    createdBy: "Account Mgr",
    createdDate: "09/02/2026, 14:30",
    comments: "High value client"
  },
  { 
    id: "lt9", 
    entityId: "WL-SW-005", 
    type: "EMAIL", 
    value: "support@verified.com", 
    scenariosCount: 5, 
    reason: "Official support channel for partner integration", 
    dateRange: "20/01/2026, 00:00 -> Ongoing", 
    startDate: "20/01/2026, 00:00",
    endDate: "Ongoing",
    status: "Verified", 
    listType: "whitelist-scenario",
    createdBy: "Partner Ops",
    createdDate: "19/01/2026, 11:45",
    comments: "Trusted partner domain"
  },
  
  // Blacklist Scenario-wise (Mirroring the pattern)
  { 
    id: "lt10", 
    entityId: "BL-SW-001", 
    type: "BIN", 
    value: "542211", 
    scenariosCount: 5, 
    reason: "High risk crypto exchange BIN", 
    dateRange: "01/02/2025, 00:00 -> Ongoing", 
    startDate: "01/02/2025, 00:00",
    endDate: "Ongoing",
    status: "Verified", 
    listType: "blacklist-scenario",
    createdBy: "Crypto Team",
    createdDate: "31/01/2025, 12:00",
    comments: "Blocked per policy"
  },
  { 
    id: "lt11", 
    entityId: "BL-SW-002", 
    type: "COUNTRY", 
    value: "SYR", 
    scenariosCount: 3, 
    reason: "Sanctioned region for specific luxury goods scenario", 
    dateRange: "10/02/2026, 00:00 -> Ongoing", 
    startDate: "10/02/2026, 00:00",
    endDate: "Ongoing",
    status: "Verified", 
    listType: "blacklist-scenario",
    createdBy: "Compliance",
    createdDate: "09/02/2026, 16:20",
    comments: "Updated per OFAC"
  },
  { 
    id: "lt12", 
    entityId: "BL-SW-003", 
    type: "IP", 
    value: "203.0.113.42", 
    scenariosCount: 8, 
    reason: "Repeated scraping attempts identified in multiple rules", 
    dateRange: "08/02/2026, 14:00 -> 08/03/2026, 14:00", 
    startDate: "08/02/2026, 14:00",
    endDate: "08/03/2026, 14:00",
    status: "Verified", 
    listType: "blacklist-scenario",
    createdBy: "WAF Auto",
    createdDate: "08/02/2026, 13:55",
    comments: "Aggressive behavior detected"
  },
  { 
    id: "lt13", 
    entityId: "BL-SW-004", 
    type: "MERCHANT", 
    value: "GAMBLE_PRO_INT", 
    scenariosCount: 2, 
    reason: "Unlicensed gambling merchant flagged by risk engine", 
    dateRange: "05/02/2026, 10:00 -> Ongoing", 
    startDate: "05/02/2026, 10:00",
    endDate: "Ongoing",
    status: "Verified", 
    listType: "blacklist-scenario",
    createdBy: "Risk Desk",
    createdDate: "04/02/2026, 09:30",
    comments: "Direct blacklist"
  },
  { 
    id: "lt14", 
    entityId: "BL-SW-005", 
    type: "PHONE", 
    value: "+44 7700 900001", 
    scenariosCount: 4, 
    reason: "Associated with SMS phishing campaign in UK region", 
    dateRange: "10/02/2026, 15:00 -> 10/03/2026, 15:00", 
    startDate: "10/02/2026, 15:00",
    endDate: "10/03/2026, 15:00",
    status: "Verified", 
    listType: "blacklist-scenario",
    createdBy: "Phish Hunter",
    createdDate: "10/02/2026, 14:45",
    comments: "Active investigation"
  }
];

function LookupTableContent({ 
  data, 
  onView, 
  onEdit,
  onCreate, 
  onBulkUpload,
  onDelete,
  onBreadcrumbNavigate,
  actionType = "view",
  showDelete = true
}: { 
  data: LookupTableItem[], 
  onView: (id: string) => void, 
  onEdit: (id: string) => void, 
  onCreate: () => void,
  onBulkUpload: () => void,
  onDelete?: (id: string) => void,
  onBreadcrumbNavigate: (path: string) => void,
  actionType?: "view" | "edit" | "verify",
  showDelete?: boolean
}) {
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState<{from?: Date, to?: Date}>({});

  const getTypeIcon = (type: string) => {
    const t = type.toUpperCase();
    if (t === "COUNTRY") return Earth;
    if (t === "BIN" || t === "CARD") return Purchase;
    if (t === "ACCOUNT") return Portfolio;
    if (t === "IP") return Flash;
    if (t === "EMAIL") return Email;
    if (t === "PHONE") return Phone;
    if (t === "LOCATION") return Location;
    if (t === "CUSTOMER") return User;
    return Document;
  };

  const getTypeStyles = (type: string) => {
    const t = type.toUpperCase();
    switch (t) {
      case "COUNTRY": return "bg-[#e0f7ff] text-[#006191] border-[#82cfff]";
      case "BIN": return "bg-[#f1edff] text-[#491d8b] border-[#d4bbff]";
      case "ACCOUNT": return "bg-[#edf5ff] text-[#0043ce] border-[#d0e2ff]";
      case "CUSTOMER": return "bg-[#defbe6] text-[#198038] border-[#a7f0ba]";
      case "MERCHANT": return "bg-[#d9fbfb] text-[#005d5d] border-[#97f1f1]";
      case "IP":
      case "IP_ADDRESS": return "bg-[#fff0f7] text-[#9f1853] border-[#ffd6e8]";
      case "PHONE": return "bg-[#f4f4f4] text-[#525252] border-[#e0e0e0]";
      case "EMAIL": return "bg-[#f7f3f1] text-[#7f3b08] border-[#e8daff]";
      case "DEVICE_ID": return "bg-[#f2f4f8] text-[#4d5358] border-[#d1d5db]";
      case "CARD": return "bg-[#fff1f1] text-[#da1e28] border-[#ffd7d9]";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = 
        item.entityId.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "ALL" || item.type.toUpperCase() === typeFilter.toUpperCase() || (typeFilter === "IP_ADDRESS" && item.type.toUpperCase() === "IP");
      const matchesStatus = statusFilter === "ALL" || (
        statusFilter === "Active" ? item.status === "Verified" :
        statusFilter === "Inactive" ? item.status === "Draft" || item.status === "Pending Approval" :
        statusFilter === "Expired" ? false : true // Mock logic for expired
      );

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data, searchTerm, typeFilter, statusFilter]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const getStatusBadge = (status: string) => {
    const baseStyles = "h-[24px] flex items-center justify-center rounded-full font-medium text-[10px] px-2.5 w-fit whitespace-nowrap border-0 uppercase";
    switch (status) {
      case "Verified": return <span className={cn(baseStyles, "bg-[#DEFBE6] text-[#198038]")}>Active</span>;
      case "Rejected": return <span className={cn(baseStyles, "bg-[#FFF1F1] text-[#DA1E28]")}>Rejected</span>;
      case "Draft": return <span className={cn(baseStyles, "bg-[#F4F4F4] text-[#525252]")}>Draft</span>;
      case "Pending Approval": return <span className={cn(baseStyles, "bg-[#FFF9E5] text-[#B28600]")}>Pending</span>;
      default: return <span className={cn(baseStyles, "bg-gray-100 text-gray-700")}>{status}</span>;
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-white mt-0 overflow-hidden space-y-4">
        <div className="flex-none flex items-center justify-between bg-white h-[48px] px-0 gap-4">
          <div className="flex items-center gap-3 h-full flex-1">
              {/* Search Bar */}
              <div className="relative w-[300px] h-[46px] flex items-center self-center">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search size={16} />
                </div>
                <input 
                   type="text" 
                   placeholder="Search entries..." 
                   value={searchTerm}
                   onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                   className="w-full h-full pl-11 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-400 transition-all"
                />
              </div>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="!h-[46px] w-[160px] bg-white border-gray-300 rounded-[8px] text-[13px] font-medium focus:ring-1 focus:ring-[#2A53A0] px-3 shadow-none self-center">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  {["COUNTRY", "BIN", "ACCOUNT", "CUSTOMER", "MERCHANT", "IP_ADDRESS", "PHONE", "EMAIL", "DEVICE_ID", "CARD"].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="!h-[46px] w-[140px] bg-white border-gray-300 rounded-[8px] text-[13px] font-medium focus:ring-1 focus:ring-[#2A53A0] px-3 shadow-none self-center">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="!h-[46px] px-4 border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-[13px] rounded-[8px] bg-white shadow-none self-center"
                  >
                    <Calendar size={18} />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Select Date Range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range: any) => setDateRange(range || {})}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
          </div>
          <div className="flex items-center h-full gap-3">
              <Button 
                variant="outline"
                onClick={onBulkUpload}
                className="h-[48px] rounded-[8px] border-[#2A53A0] text-[#2A53A0] hover:bg-[#edf5ff] flex items-center gap-2 px-6 text-[14px] font-medium transition-colors"
              >
                <Upload size={20} /> Bulk Upload
              </Button>
              <Button 
                onClick={onCreate}
                className="h-[48px] rounded-[8px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white flex items-center gap-2 px-6 text-[14px] font-medium border-0 shadow-sm transition-colors"
              >
                <Add size={20} /> Add New Entry
              </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="flex-1 bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
                <thead>
                    <tr className="bg-[#F0F0F0] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                        <th className="px-4 border-b border-[#e0e0e0] w-[40px] align-middle text-center">
                            <input type="checkbox" className="rounded-sm border-gray-300" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[12%] align-middle whitespace-nowrap">
                            <SortableHeader column="entityId" label="Entity ID" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap">
                            <SortableHeader column="type" label="Type" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap text-left">
                            <SortableHeader column="value" label="Value" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap">
                            <SortableHeader column="scenariosCount" label="Scenarios" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[20%] align-middle whitespace-nowrap">
                            <SortableHeader column="reason" label="Reason" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[15%] align-middle whitespace-nowrap">
                            <SortableHeader column="dateRange" label="Date Range" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[8%] align-middle whitespace-nowrap text-center">
                            <SortableHeader column="status" label="Status" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-medium justify-center" />
                        </th>
                        <th className="px-4 border-b border-[#e0e0e0] w-[150px] text-left align-middle select-none">
                            <span className="text-[14px] font-medium text-[#2A53A0] ml-1">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {paginatedData.length > 0 ? paginatedData.map((row) => (
                    <tr key={row.id} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
                        <td className="px-4 align-middle text-center">
                            <input type="checkbox" className="rounded-sm border-gray-300" />
                        </td>
                        <td className="px-4 align-middle">
                            <span className="text-[13px] text-[#161616] font-normal block truncate" title={row.entityId}>{row.entityId}</span>
                        </td>
                        <td className="px-4 align-middle">
                            <div className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border text-[10px] font-bold uppercase tracking-wider",
                                getTypeStyles(row.type)
                            )}>
                                {(() => {
                                    const Icon = getTypeIcon(row.type);
                                    return <Icon size={14} />;
                                })()}
                                {row.type}
                            </div>
                        </td>
                        <td className="px-4 align-middle">
                             <span className="text-[13px] text-[#161616] font-normal">{row.value}</span>
                        </td>
                        <td className="px-4 align-middle">
                             <span className={cn(
                                "text-[13px] font-medium",
                                row.scenariosCount ? "text-[#2A53A0] hover:underline cursor-pointer" : "text-[#525252]"
                             )}>
                                {row.scenariosCount ? `${row.scenariosCount} Scenario${row.scenariosCount > 1 ? 's' : ''}` : "—"}
                             </span>
                        </td>
                        <td className="px-4 align-middle">
                             <span className="text-[13px] text-[#161616] block truncate" title={row.reason}>{row.reason}</span>
                        </td>
                        <td className="px-4 align-middle text-[12px] text-[#161616]">
                             <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="shrink-0 opacity-60" />
                                <span className="line-clamp-2">{row.dateRange || "—"}</span>
                             </div>
                        </td>
                        <td className="px-4 align-middle text-center">
                             <div className="flex justify-center">
                                {getStatusBadge(row.status)}
                             </div>
                        </td>
                        <td className="px-4 align-middle text-left">
                           <div className="flex items-center justify-start gap-3">
                              <button 
                                className="w-[28px] h-[28px] min-w-[28px] min-h-[28px] flex items-center justify-center bg-[#edf5ff] hover:bg-[#d0e2ff] rounded-md transition-colors text-[#0043ce] shrink-0" 
                                title="View Details" 
                                onClick={() => onView(row.id)}
                              >
                                  <View size={16} />
                              </button>
                              <button 
                                className="w-[28px] h-[28px] min-w-[28px] min-h-[28px] flex items-center justify-center bg-[#f6f2ff] hover:bg-[#e8daff] rounded-md transition-colors text-[#8a3ffc] shrink-0" 
                                title="Edit Entry" 
                                onClick={() => onEdit(row.id)}
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
                           </div>
                        </td>
                    </tr>
                    )) : (
                    <tr>
                        <td colSpan={8} className="h-48 text-center text-gray-500 text-sm">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Table size={32} className="text-gray-300" />
                                <span>No entries matching your criteria were found.</span>
                            </div>
                        </td>
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

interface CustomTabsTriggerProps {
  value: string;
  label: string;
  count: number;
  badgeVariant?: "blue" | "red" | "gray";
}

function CustomTabsTrigger({ value, label, count, badgeVariant = "gray" }: CustomTabsTriggerProps) {
  const badgeStyles = {
    blue: "bg-[#EAF2FF] text-[#0043CE] data-[state=active]:bg-[#2A53A0] data-[state=active]:text-white",
    red: "bg-[#FFF1F1] text-[#DA1E28] data-[state=active]:bg-[#DA1E28] data-[state=active]:text-white",
    gray: "bg-[#F4F4F4] text-[#525252] data-[state=active]:bg-[#525252] data-[state=active]:text-white"
  };

  return (
    <TabsTrigger 
      value={value} 
      className={cn(
        "relative h-full flex-1 rounded-none bg-transparent px-4 text-[14px] font-medium text-[#525252] border-b-[3px] border-transparent transition-all hover:bg-[#f4f4f4] hover:text-[#161616]",
        "data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-bold flex items-center justify-center gap-2 group"
      )}
    >
      <span>{label}</span>
      <Badge 
        className={cn(
          "border-0 px-2 h-[20px] min-w-[24px] flex items-center justify-center font-bold text-[10px] rounded-full transition-colors",
          badgeStyles[badgeVariant]
        )}
      >
        {count}
      </Badge>
    </TabsTrigger>
  );
}

export function LookupTablesPage({ 
  breadcrumbs, 
  onBreadcrumbNavigate,
  initialTab = "whitelist-global"
}: { 
  breadcrumbs: any[], 
  onBreadcrumbNavigate: (path: string) => void,
  initialTab?: string
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, name: string} | null>(null);

  const tables = LOOKUP_TABLES_DATA;

  const whitelistGlobal = useMemo(() => tables.filter(t => t.listType === "whitelist-global"), [tables]);
  const blacklistGlobal = useMemo(() => tables.filter(t => t.listType === "blacklist-global"), [tables]);
  const whitelistScenario = useMemo(() => tables.filter(t => t.listType === "whitelist-scenario"), [tables]);
  const blacklistScenario = useMemo(() => tables.filter(t => t.listType === "blacklist-scenario"), [tables]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
  };

  const handleDelete = (id: string) => {
    const item = tables.find(t => t.id === id);
    if (item) {
      setItemToDelete({ id: item.id, name: item.entityId });
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = () => {
    toast.success(`Table "${itemToDelete?.name}" successfully deleted.`);
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col p-0 overflow-hidden">
       <PageHeader 
         title="Lookup Tables (Whitelist/Blacklist)" 
         breadcrumbs={breadcrumbs} 
         onBreadcrumbNavigate={onBreadcrumbNavigate} 
       />
       <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-1 flex flex-col gap-0 overflow-hidden">
          <div className="bg-white px-0 sticky top-0 z-10 border-b border-[#e0e0e0] flex-none">
              <TabsList className="bg-transparent p-0 w-full justify-start border-none flex h-[48px] rounded-none">
                 <CustomTabsTrigger 
                   value="whitelist-global" 
                   label="Whitelist Global" 
                   count={whitelistGlobal.length} 
                   badgeVariant="blue" 
                 />
                 <CustomTabsTrigger 
                   value="blacklist-global" 
                   label="Blacklist Global" 
                   count={blacklistGlobal.length} 
                   badgeVariant="red" 
                 />
                 <CustomTabsTrigger 
                   value="whitelist-scenario" 
                   label="Whitelist Scenario-wise" 
                   count={whitelistScenario.length} 
                   badgeVariant="gray" 
                 />
                 <CustomTabsTrigger 
                   value="blacklist-scenario" 
                   label="Blacklist Scenario-wise" 
                   count={blacklistScenario.length} 
                   badgeVariant="gray" 
                 />
              </TabsList>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <TabsContent value="whitelist-global" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <LookupTableContent 
                  data={whitelistGlobal} 
                  onView={(id) => onBreadcrumbNavigate(`views-management-lookup-tables-details-${id}:${activeTab}`)} 
                  onEdit={(id) => onBreadcrumbNavigate(`views-management-lookup-tables-edit-${id}:${activeTab}`)}
                  onCreate={() => onBreadcrumbNavigate(`views-management-lookup-tables-create:${activeTab}`)} 
                  onBulkUpload={() => onBreadcrumbNavigate(`views-management-lookup-tables-bulk-upload:${activeTab}`)}
                  onDelete={handleDelete} 
                  onBreadcrumbNavigate={onBreadcrumbNavigate}
               />
            </TabsContent>
            <TabsContent value="blacklist-global" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <LookupTableContent 
                  data={blacklistGlobal} 
                  onView={(id) => onBreadcrumbNavigate(`views-management-lookup-tables-details-${id}:${activeTab}`)} 
                  onEdit={(id) => onBreadcrumbNavigate(`views-management-lookup-tables-edit-${id}:${activeTab}`)}
                  onCreate={() => onBreadcrumbNavigate(`views-management-lookup-tables-create:${activeTab}`)} 
                  onBulkUpload={() => onBreadcrumbNavigate(`views-management-lookup-tables-bulk-upload:${activeTab}`)}
                  onDelete={handleDelete} 
                  onBreadcrumbNavigate={onBreadcrumbNavigate}
               />
            </TabsContent>
            <TabsContent value="whitelist-scenario" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <LookupTableContent 
                  data={whitelistScenario} 
                  onView={(id) => onBreadcrumbNavigate(`views-management-lookup-tables-details-${id}:${activeTab}`)} 
                  onEdit={(id) => onBreadcrumbNavigate(`views-management-lookup-tables-edit-${id}:${activeTab}`)}
                  onCreate={() => onBreadcrumbNavigate(`views-management-lookup-tables-create:${activeTab}`)} 
                  onBulkUpload={() => onBreadcrumbNavigate(`views-management-lookup-tables-bulk-upload:${activeTab}`)}
                  onDelete={handleDelete} 
                  onBreadcrumbNavigate={onBreadcrumbNavigate}
               />
            </TabsContent>
            <TabsContent value="blacklist-scenario" className="flex-1 flex-col data-[state=active]:flex p-4 focus-visible:outline-none m-0 overflow-hidden">
               <LookupTableContent 
                  data={blacklistScenario} 
                  onView={(id) => onBreadcrumbNavigate(`views-management-lookup-tables-details-${id}:${activeTab}`)} 
                  onEdit={(id) => onBreadcrumbNavigate(`views-management-lookup-tables-edit-${id}:${activeTab}`)}
                  onCreate={() => onBreadcrumbNavigate(`views-management-lookup-tables-create:${activeTab}`)} 
                  onBulkUpload={() => onBreadcrumbNavigate(`views-management-lookup-tables-bulk-upload:${activeTab}`)}
                  onDelete={handleDelete} 
                  onBreadcrumbNavigate={onBreadcrumbNavigate}
               />
            </TabsContent>
          </div>
       </Tabs>

       {/* Delete Confirmation Dialog */}
       <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent aria-describedby={undefined} className="sm:max-w-[400px] p-0 border-0 rounded-lg overflow-hidden">
             <div className="bg-[#fff1f1] px-6 py-4 flex items-center gap-3">
                <TrashCan size={24} className="text-[#da1e28]" />
                <div className="flex flex-col gap-0.5">
                   <DialogTitle className="text-[#161616] text-[18px] font-semibold">Delete Lookup Table</DialogTitle>
                   <DialogDescription className="text-[12px] text-red-600/80">
                     This action cannot be undone.
                   </DialogDescription>
                </div>
             </div>
             <div className="px-6 py-8 text-center">
                <p className="text-[14px] text-[#525252] leading-relaxed">
                   Are you sure you want to delete <span className="font-bold text-[#161616]">"{itemToDelete?.name}"</span>? 
                   This will permanently remove all associated records from the system.
                </p>
             </div>
             <DialogFooter className="bg-[#f4f4f4] px-6 py-4 flex items-center justify-end gap-3 sm:justify-end">
                <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="text-[#525252] hover:bg-gray-200 h-[48px] px-6">
                   Cancel
                </Button>
                <Button onClick={confirmDelete} className="bg-[#da1e28] hover:bg-[#b21922] text-white h-[48px] px-8 rounded-none">
                   Confirm Delete
                </Button>
             </DialogFooter>
          </DialogContent>
       </Dialog>
    </div>
  );
}
