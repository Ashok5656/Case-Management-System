import svgPaths from "../imports/svg-6bcrq02oaf";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Add,
  Edit,
  TrashCan,
  Tag,
  ArrowLeft,
  Download,
  Calculation,
  Function,
  Information,
  Locked,
  View,
  SettingsAdjust,
  ChevronDown,
  ChevronUp,
  Compare,
  Checkmark,
  CheckmarkFilled,
  ArrowRight,
  Close,
  Send
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { CarbonPaginationFooter } from "./carbon-pagination-footer";
import { EventItem } from "./events-page";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { useSortableData } from "../hooks/use-sortable-data";
import { SortableHeader } from "./ui/sortable-header";
import { toast } from "sonner@2.0.3";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import { AddDerivedFieldsDialog } from "./add-derived-fields-dialog";
import { AddFieldDialog } from "./add-field-dialog";
import { EditFieldDialog } from "./edit-field-dialog";
import { ViewFieldDetailsDialog } from "./view-field-details-dialog";
import { ConfigureDerivedFieldDialog } from "./configure-derived-field-dialog";
import { MappingTabContent } from "./mapping-tab-content";
import PageHeader from "./page-header";

import { AddTabDialog } from "./add-tab-dialog";
import { CompareTabsDialog } from "./compare-tabs-dialog";

// --- DATA ---
interface TabItem {
  id: string;
  name: string;
  description: string;
}

const INITIAL_MAPPING_TABS: TabItem[] = [
  { id: "upi", name: "Fund Transfer - UPI", description: "Unified Payments Interface configuration" },
  { id: "neft", name: "Fund Transfer - NEFT", description: "National Electronic Funds Transfer configuration" },
  { id: "rtgs", name: "Fund Transfer - RTGS", description: "Real Time Gross Settlement configuration" },
  { id: "imps", name: "Fund Transfer - IMPS", description: "Immediate Payment Service configuration" },
];

interface FieldItem {
  id: string;
  fieldName: string;
  type: "Default" | "Custom";
  isDerived?: boolean;
  sourceMapping: string;
  dataType: "String" | "Date time" | "Double" | "Integer" | "Boolean" | "Decimal";
  constraints: string;
}

const ALL_FIELDS: FieldItem[] = [
  { id: "s1", fieldName: "tenant_id", type: "Default", sourceMapping: "\"ICICI\"", dataType: "String", constraints: "-" },
  { id: "s2", fieldName: "event_name", type: "Default", sourceMapping: "\"FT_AcctTxn\"", dataType: "String", constraints: "-" },
  { id: "s3", fieldName: "event_id", type: "Default", sourceMapping: "eventID", dataType: "String", constraints: "-" },
  { id: "s4", fieldName: "event_timestamp", type: "Default", sourceMapping: "event_TS", dataType: "String", constraints: "-" },
  { id: "s5", fieldName: "event_arrival_timestamp", type: "Default", sourceMapping: "AUTO:TIMESTAMP", dataType: "String", constraints: "-" },
  { id: "s6", fieldName: "transaction_amount", type: "Default", sourceMapping: "payload.transaction.amount", dataType: "String", constraints: "-" },
  { id: "s7", fieldName: "merchant_name", type: "Default", sourceMapping: "merchant.name", dataType: "String", constraints: "-" },
  { id: "s8", fieldName: "card_number_masked", type: "Default", sourceMapping: "{card_number}", dataType: "String", constraints: "-" },
  { id: "c1", fieldName: "custom_status", type: "Custom", sourceMapping: "status_code", dataType: "String", constraints: "-" },
  { id: "c2", fieldName: "transaction_risk_index", type: "Custom", isDerived: true, sourceMapping: "(base_score) * (multiplier)", dataType: "String", constraints: "Calculated risk metric" },
  { id: "c2-2", fieldName: "avg_transaction_value", type: "Custom", isDerived: true, sourceMapping: "sum(amount) / count(*)", dataType: "Double", constraints: "30-day rolling average" },
  { id: "c3", fieldName: "full_name", type: "Custom", sourceMapping: "first_name", dataType: "String", constraints: "-" },
  { id: "c4", fieldName: "amount_usd", type: "Custom", sourceMapping: "amount", dataType: "String", constraints: "-" },
];

export function EventDetailsPage({ breadcrumbs, onBreadcrumbNavigate, event, onSubmit }: { breadcrumbs: any[], onBreadcrumbNavigate: (path: string) => void, event?: EventItem, onSubmit?: (data: any) => void }) {
  const [activeTab, setActiveTab] = useState("fields");
  const [mappingTabs, setMappingTabs] = useState<TabItem[]>(INITIAL_MAPPING_TABS);
  const [mappingSubTab, setMappingSubTab] = useState("upi");
  
  const [isAddTabDialogOpen, setIsAddTabDialogOpen] = useState(false);
  const [isCompareTabsDialogOpen, setIsCompareTabsDialogOpen] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);
  
  const [isDerivedFieldsDialogOpen, setIsDerivedFieldsDialogOpen] = useState(false);
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [isEditFieldDialogOpen, setIsEditFieldDialogOpen] = useState(false);
  const [isConfigureDerivedDialogOpen, setIsConfigureDerivedDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [selectedFieldForView, setSelectedFieldForView] = useState<any>(null);
  const [selectedFieldForEdit, setSelectedFieldForEdit] = useState<any>(null);
  const [selectedFieldForConfigure, setSelectedFieldForConfigure] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [pendingActions, setPendingActions] = useState<{id: string, type: string, field: string, detail: string}[]>([]);
  const [isSubmitConfirmationOpen, setIsSubmitConfirmationOpen] = useState(false);
  
  const addAction = (type: string, field: string, detail: string) => {
    setPendingActions(prev => [
      ...prev, 
      { id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, type, field, detail }
    ]);
  };

  const displayEvent = useMemo(() => event || {
    id: "6", 
    eventName: "Card Transaction",
    status: "Active",
    type: "Financial",
    category: "default",
    linkedSec: 2,
    description: "Captures all card-based transaction events including POS (Point of Sale), ATM withdrawals, e-commerce transactions, and contactless payments."
  }, [event]);

  const isCustomEvent = displayEvent.category === "custom";

  const [fields, setFields] = useState<FieldItem[]>(() => {
    if (event && event.fields) return event.fields;
    return ALL_FIELDS;
  });

  const [initialFields] = useState<FieldItem[]>(() => {
    if (event && event.fields) return [...event.fields];
    return [...ALL_FIELDS];
  });

  const handleFinalSubmit = () => {
    setIsSuccessDialogOpen(false);
    
    // Capture all changes in a manifest
    const manifest = pendingActions.map(a => ({
      name: a.field,
      status: a.type,
      description: a.detail
    }));

    if (onSubmit) {
      onSubmit({
        ...displayEvent,
        fields: fields,
        fieldChanges: manifest,
        status: "Pending Approval",
        description: manifest.length > 0 
          ? `Modified ${manifest.length} fields: ${manifest.map(m => m.name).join(", ")}`
          : displayEvent.description
      });
      // onSubmit (handleCreateEvent) already triggers setActiveItem('pending-verification-main:event')
    } else if (onBreadcrumbNavigate) {
      // Fallback if onSubmit is missing for some reason
      onBreadcrumbNavigate('pending-verification-main:event');
    }
  };

  const filteredFields = useMemo(() => {
    if (!searchTerm) return fields;
    return fields.filter(f => 
      f.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      f.sourceMapping.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [fields, searchTerm]);

  const { items: sortedFields, requestSort, sortConfig } = useSortableData(filteredFields);

  const paginatedFields = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedFields.slice(start, start + pageSize);
  }, [sortedFields, currentPage, pageSize]);

  const existingFieldNames = useMemo(() => fields.map(f => f.fieldName), [fields]);

  const handleAddDerivedFields = (selectedDerivedFields: any[]) => {
    const newFields: FieldItem[] = selectedDerivedFields.map(df => ({
      id: `derived-${df.id}-${Date.now()}`,
      fieldName: df.fieldName,
      type: "Custom",
      isDerived: true, 
      sourceMapping: df.category,
      dataType: "String",
      constraints: "-"
    }));

    setFields(prev => [...prev, ...newFields]);
    newFields.forEach(f => addAction("ADD", f.fieldName, "Derived field added to event"));
    toast.success(`${newFields.length} derived fields added successfully`);
  };

  const handleAddField = (newFieldData: any) => {
    const newField: FieldItem = {
      ...newFieldData,
      isDerived: false
    };
    setFields(prev => [...prev, newField]);
    addAction("ADD", newField.fieldName, "New custom field created");
    toast.success(`Field "${newField.fieldName}" added successfully`);
  };

  const handleUpdateField = (fieldId: string, updatedData: any) => {
    const field = fields.find(f => f.id === fieldId);
    setFields(prev => prev.map(f => f.id === fieldId ? { ...f, ...updatedData } : f));
    if (field) addAction("EDIT", field.fieldName, "Field properties updated");
    toast.success(`Field updated successfully`);
  };

  const handleSaveConfiguration = (fieldId: string, configData: any) => {
    const field = fields.find(f => f.id === fieldId);
    setFields(prev => prev.map(f => f.id === fieldId ? { 
        ...f, 
        profileAssignment: configData.profileAssignment,
        selectedProfiles: configData.selectedProfiles,
        isPii: configData.isPii,
        description: configData.description,
        constraints: configData.isPii ? "PII Required" : f.constraints
    } : f));
    if (field) addAction("CONFIG", field.fieldName, "PII/Profile configuration modified");
    toast.success(`Configuration saved for derived field`);
  };

  const handleDownloadFields = () => {
    const headers = ["Field Name", "Type", "Source / Category", "Data Type", "Description"];
    const rows = fields.map(f => [
      f.fieldName,
      f.type === "Default" ? "System" : (f.isDerived ? "Derived" : "Custom"),
      f.sourceMapping,
      f.dataType,
      f.constraints
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${displayEvent.eventName}_fields.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Field definitions downloaded successfully");
  };

  const handleDeleteField = (id: string) => {
    const field = fields.find(f => f.id === id);
    setFields(prev => prev.filter(f => f.id !== id));
    if (field) addAction("DELETE", field.fieldName, "Field removed from configuration");
    toast.error("Field removed");
  };

  const handleViewField = (row: FieldItem) => {
    const mappedField = {
      id: row.id,
      name: row.fieldName,
      code: row.fieldName.toUpperCase().replace(/\s+/g, "_"),
      dataType: row.dataType,
      type: row.type === "Default" ? "System" : (row.isDerived ? "Derived" : "Custom"),
      sourceMapping: row.sourceMapping,
      sourceType: row.type === "Default" ? "System Field" : (row.isDerived ? "Calculated" : "Input Mapping"),
      constraints: {
        required: row.constraints.toLowerCase().includes("required"),
      }
    };
    setSelectedFieldForView(mappedField);
    setIsViewDetailsDialogOpen(true);
  };

  const handleAddTab = (name: string, description: string, cloneFrom?: string) => {
    const newTabId = name.toLowerCase().replace(/\s+/g, "-");
    const newTab: TabItem = {
      id: newTabId,
      name,
      description: description || (cloneFrom ? `Cloned from ${cloneFrom}` : "New payment configuration tab")
    };
    setMappingTabs(prev => [...prev, newTab]);
    setMappingSubTab(newTabId);
    toast.success(`Tab "${name}" created successfully${cloneFrom ? ` (cloned from ${cloneFrom})` : ''}`);
  };

  return (
    <TooltipProvider>
      <div className="w-full h-full bg-white flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col gap-0">
          <div className="flex-none bg-white z-20 border-b border-gray-100">
            <PageHeader 
              title="Event Details"
              breadcrumbs={breadcrumbs}
              onBack={() => onBreadcrumbNavigate('events')}
              onBreadcrumbNavigate={onBreadcrumbNavigate}
            />
            
            {/* UNIFIED METADATA ROW */}
            <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center h-[64px] overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 whitespace-nowrap pr-4 border-r border-gray-200 h-4 self-center flex-none">
                    <span className="text-[12px] font-normal text-[#525252]">Event Name:</span>
                    <span className="text-[13px] font-semibold text-[#161616]">{displayEvent.eventName}</span>
                </div>
                
                {isCustomEvent ? (
                  <>
                    <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
                        <span className="text-[12px] font-normal text-[#525252]">Type:</span>
                        <Badge className="bg-[#e0f2fe] text-[#0369a1] border-0 font-medium rounded-md px-3 h-[28px] text-[11px] flex items-center justify-center whitespace-nowrap">Payment</Badge>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
                        <span className="text-[12px] font-normal text-[#525252]">Source:</span>
                        <Badge className="bg-[#f0f4f9] text-[#2A53A0] border-0 font-medium rounded-md px-3 h-[28px] text-[11px] flex items-center justify-center whitespace-nowrap">Custom Event</Badge>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
                        <span className="text-[12px] font-normal text-[#525252]">Created Date:</span>
                        <span className="text-[13px] font-semibold text-[#161616]">Jan 10, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
                        <span className="text-[12px] font-normal text-[#525252]">Modified Date:</span>
                        <span className="text-[13px] font-semibold text-[#161616]">Today</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
                        <span className="text-[12px] font-normal text-[#525252]">Source:</span>
                        <Badge className="bg-[#f4f4f4] text-[#161616] border-0 font-medium rounded-md px-3 h-[28px] text-[11px] flex items-center justify-center">Default Event</Badge>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
                        <span className="text-[12px] font-normal text-[#525252]">Status:</span>
                        {displayEvent.status === "Active" ? (
                            <Badge className="bg-[#defbe6] text-[#198038] border-0 font-medium rounded-full px-3 h-[28px] text-[11px] flex items-center justify-center">Active</Badge>
                        ) : (
                            <Badge className="bg-[#f4f4f4] text-[#525252] border-0 font-medium rounded-full px-3 h-[28px] text-[11px] flex items-center justify-center">Inactive</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
                        <span className="text-[12px] font-normal text-[#525252]">Type:</span>
                        {displayEvent.type === "Financial" ? (
                            <Badge className="bg-[#d0e2ff] text-[#0043ce] border-0 font-medium rounded-md px-3 h-[28px] text-[11px] flex items-center justify-center whitespace-nowrap">Financial Transaction</Badge>
                        ) : (
                            <Badge className="bg-[#e8daff] text-[#8a3ffc] border-0 font-medium rounded-md px-3 h-[28px] text-[11px] flex items-center justify-center whitespace-nowrap">Non-Financial</Badge>
                        )}
                    </div>
                  </>
                )}
                
                <div className="flex items-center gap-2 min-w-0 flex-1 pl-4">
                    <span className="text-[12px] font-normal text-[#525252] whitespace-nowrap">Description:</span>
                    <span className="text-[13px] text-[#161616] truncate font-normal" title={displayEvent.description}>{displayEvent.description}</span>
                </div>
            </div>

            <div className="px-4 border-t border-gray-100 flex items-center justify-between bg-white h-[48px]">
                <TabsList className="bg-transparent p-0 w-full justify-start h-full rounded-none border-0">
                  <TabsTrigger value="fields" className={cn("relative h-full flex-1 px-4 text-[14px] font-medium text-[#525252] rounded-none bg-transparent border-b-[2px] border-b-transparent transition-all hover:bg-[#f4f4f4] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold")}>
                    <div className="flex items-center justify-center gap-2"><span>Fields</span><Badge className="bg-gray-100 text-[#525252] border-0 px-2 h-5 min-w-[24px] flex items-center justify-center font-semibold text-[11px] rounded-full">{fields.length}</Badge></div>
                  </TabsTrigger>
                  <TabsTrigger value="mapping" className={cn("relative h-full flex-1 px-4 text-[14px] font-medium text-[#525252] rounded-none bg-transparent border-b-[2px] border-b-transparent transition-all hover:bg-[#f4f4f4] data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold")}>Mapping</TabsTrigger>
                </TabsList>
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-white p-4">
            <TabsContent value="fields" className="h-full focus-visible:outline-none m-0 flex flex-col bg-white rounded-sm border-0">
                <div className="flex-none flex items-center justify-between px-0 h-[48px] mb-4 mt-0">
                  <div className="relative w-[280px] h-full flex items-center">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Search size={18} /></div>
                      <input type="text" placeholder="Search fields..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full h-full pl-11 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] outline-none transition-all placeholder:text-gray-400" />
                  </div>
                  <div className="flex items-center gap-3 h-full">
                    <Button onClick={handleDownloadFields} variant="outline" className="h-[46px] rounded-[8px] border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 flex items-center gap-2 px-5 text-[14px] font-medium transition-colors whitespace-nowrap"><Download size={18} /> Download</Button>
                    <Button onClick={() => setIsDerivedFieldsDialogOpen(true)} variant="outline" className="h-[46px] rounded-[8px] border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 flex items-center gap-2 px-5 text-[14px] font-medium transition-colors whitespace-nowrap"><Calculation size={18} /> Add Derived Field</Button>
                    <Button onClick={() => setIsAddFieldDialogOpen(true)} className="h-[46px] rounded-[8px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white flex items-center gap-2 px-5 text-[14px] font-medium border-0 flex items-center justify-center transition-colors whitespace-nowrap"><Add size={18} /> Add Field</Button>
                    
                    <div className="w-[1px] h-6 bg-gray-200 mx-1" />

                    <Button 
                      onClick={() => setIsSubmitConfirmationOpen(true)}
                      disabled={pendingActions.length === 0}
                      className={cn(
                        "h-[46px] px-6 rounded-[8px] flex items-center gap-2 font-normal text-[14px] transition-all",
                        pendingActions.length > 0 
                          ? "bg-[#2A53A0] hover:bg-[#1A3A7A] text-white shadow-lg shadow-blue-100" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      )}
                    >
                      <Send size={18} /> Save Changes {pendingActions.length > 0 && `(${pendingActions.length})`}
                    </Button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col border border-gray-200 rounded-sm overflow-hidden bg-white">
                  <div className="flex-1 overflow-auto bg-white relative">
                      <table className="w-full text-left border-collapse table-fixed">
                        <thead className="bg-[#F4F4F4] sticky top-0 z-10 border-b border-[#D0D0D0]">
                            <tr className="h-[48px]">
                              <th className="w-[20%] px-4"><SortableHeader column="fieldName" label="Field Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" /></th>
                              <th className="w-[15%] px-4"><SortableHeader column="type" label="Type" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" /></th>
                              <th className="w-[20%] px-4"><SortableHeader column="sourceMapping" label="Source / Category" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" /></th>
                              <th className="w-[12%] px-4"><SortableHeader column="dataType" label="Data Type" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" /></th>
                              <th className="w-[20%] px-4"><SortableHeader column="constraints" label="Description" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold text-[13px]" /></th>
                              <th className="w-[180px] px-4 text-[13px] font-semibold text-[#2A53A0]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E0E0E0]">
                            {paginatedFields.map((row) => (
                              <tr key={row.id} className="h-[46px] hover:bg-[#EDF5FF] transition-colors group">
                                  <td className="px-4 align-middle">
                                    <div className="flex items-center gap-3">
                                      <span className={cn(
                                        row.type === "Default" ? "text-gray-400" : 
                                        row.isDerived ? "text-[#8A3FFC]" : "text-[#0043CE]"
                                      )}>
                                        {row.type === "Default" ? <Locked size={16} /> : (row.isDerived ? <Function size={16} /> : <Tag size={16} />)}
                                      </span>
                                      <span className="text-[14px] text-[#161616] font-normal truncate">{row.fieldName}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 align-middle">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={cn(
                                        "h-[22px] px-2 rounded-sm font-medium text-[11px] tracking-tight border-transparent uppercase", 
                                        row.type === "Default" ? "bg-[#F4F4F4] text-[#525252]" : 
                                        row.isDerived ? "bg-[#E8DAFF] text-[#8A3FFC]" : "bg-[#D0E2FF] text-[#0043CE]"
                                      )}>
                                        {row.type === "Default" ? "System" : (row.isDerived ? "Derived" : "Custom")}
                                      </Badge>
                                    </div>
                                  </td>
                                  <td className="px-4 align-middle"><span className={cn("text-[14px] font-normal truncate block", row.sourceMapping.startsWith('"') ? "text-[#198038]" : "text-[#2A53A0]")}>{row.sourceMapping}</span></td>
                                  <td className="px-4 align-middle"><span className="text-[14px] text-[#161616]">{row.dataType}</span></td>
                                  <td className="px-4 align-middle"><span className="text-[14px] text-[#525252] truncate block">{row.constraints}</span></td>
                                  <td className="px-4 align-middle text-left">
                                    <div className="flex items-center justify-start gap-3">
                                        {row.isDerived ? (
                                          <button 
                                             onClick={() => {
                                                setSelectedFieldForConfigure(row);
                                                setIsConfigureDerivedDialogOpen(true);
                                             }}
                                             className="w-[28px] h-[28px] flex items-center justify-center rounded-md transition-colors bg-[#f6f2ff] hover:bg-[#e8daff] text-[#8a3ffc]"
                                             title="Configure Derived Field"
                                          >
                                             <SettingsAdjust size={16} />
                                          </button>
                                        ) : (
                                          <button 
                                             onClick={() => {
                                                setSelectedFieldForEdit(row);
                                                setIsEditFieldDialogOpen(true);
                                             }}
                                             disabled={row.type === "Default"} 
                                             className={cn("w-[28px] h-[28px] flex items-center justify-center rounded-md transition-colors", row.type === "Default" ? "bg-gray-50 text-gray-200 cursor-not-allowed" : "bg-[#f6f2ff] hover:bg-[#e8daff] text-[#8a3ffc]")}
                                             title={row.type === "Default" ? "System field cannot be edited" : "Edit Field"}
                                          >
                                             <Edit size={16} />
                                          </button>
                                        )}
                                        <button 
                                           disabled={row.type === "Default"} 
                                           className={cn("w-[28px] h-[28px] flex items-center justify-center rounded-md transition-colors", row.type === "Default" ? "bg-gray-50 text-gray-200 cursor-not-allowed" : "bg-[#fff1f1] hover:bg-[#ffd7d9] text-[#da1e28]")}
                                           title="Delete Field"
                                           onClick={() => handleDeleteField(row.id)}
                                        >
                                           <TrashCan size={16} />
                                        </button>
                                    </div>
                                  </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                  </div>
                  {filteredFields.length > 10 ? (
                    <CarbonPaginationFooter pageSize={pageSize} setPageSize={setPageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={filteredFields.length} />
                  ) : (
                    <div className="flex-none h-[48px] bg-[#f4f4f4] border-t border-[#D0D0D0] px-6 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#161616]">{filteredFields.length}</span> fields found
                        </div>
                      </div>
                      <div className="text-[12px] text-gray-400">
                        Last updated: 28/01/2026
                      </div>
                    </div>
                  )}
                </div>
            </TabsContent>
            <TabsContent value="mapping" className="h-full m-0 bg-white rounded-sm border border-gray-200 overflow-hidden">
               {isCustomEvent ? (
                  <MappingTabContent 
                    customTabs={mappingTabs.map(t => ({ id: t.id, label: t.name }))} 
                    activeTabId={mappingSubTab}
                    onTabChange={setMappingSubTab}
                    onNavigate={onBreadcrumbNavigate}
                    onAction={addAction}
                  />
               ) : (
                  <MappingTabContent onNavigate={onBreadcrumbNavigate} onAction={addAction} />
               )}
            </TabsContent>
          </div>
        </Tabs>

        {/* DIALOGS */}
        <AddTabDialog 
            open={isAddTabDialogOpen} 
            onOpenChange={setIsAddTabDialogOpen} 
            onAdd={handleAddTab} 
            existingTabs={mappingTabs.map(t => ({ id: t.id, name: t.name }))}
        />
        <CompareTabsDialog 
            open={isCompareTabsDialogOpen} 
            onOpenChange={setIsCompareTabsDialogOpen} 
            tabs={mappingTabs}
        />
        <AddDerivedFieldsDialog open={isDerivedFieldsDialogOpen} onOpenChange={setIsDerivedFieldsDialogOpen} onAdd={handleAddDerivedFields} existingFieldNames={existingFieldNames} />
        <AddFieldDialog open={isAddFieldDialogOpen} onOpenChange={setIsAddFieldDialogOpen} onAdd={handleAddField} />
        <EditFieldDialog open={isEditFieldDialogOpen} onOpenChange={setIsEditFieldDialogOpen} onUpdate={handleUpdateField} field={selectedFieldForEdit} />
        <ConfigureDerivedFieldDialog open={isConfigureDerivedDialogOpen} onOpenChange={setIsConfigureDerivedDialogOpen} onSave={handleSaveConfiguration} field={selectedFieldForConfigure} />
        <ViewFieldDetailsDialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen} field={selectedFieldForView} />

        {/* Submit Confirmation Dialog */}
        <Dialog open={isSubmitConfirmationOpen} onOpenChange={setIsSubmitConfirmationOpen}>
          <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] p-0 gap-0 border-0 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[110] [&>button]:hidden">
            <DialogHeader className="flex-none flex flex-row items-center justify-between px-[30px] h-[64px] border-b border-gray-100 bg-[#2A53A0] space-y-0">
              <div className="flex items-center gap-3">
                 <DialogTitle className="text-[20px] font-normal text-white">Review and Submit Changes</DialogTitle>
              </div>
              <button onClick={() => setIsSubmitConfirmationOpen(false)} className="p-1.5 hover:bg-white/10 rounded-[4px] transition-colors text-white">
                <Close size={20} />
              </button>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto max-h-[60vh] bg-white">
              <div className="px-[30px] py-6 space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-100 rounded-[8px]">
                  <Information size={24} className="text-[#2A53A0] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[14px] text-[#2A53A0] font-semibold">Ready to promote changes?</p>
                    <p className="text-[13px] text-[#2A53A0]/80">Please review the <span className="font-bold underline">{pendingActions.length}</span> actions below before submitting for verification.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest px-1">Performed Actions</p>
                  <div className="border border-gray-100 rounded-[8px] divide-y divide-gray-50 overflow-hidden">
                    {pendingActions.map((action) => (
                      <div key={action.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            action.type === "ADD" ? "bg-green-50 text-green-600" :
                            action.type === "EDIT" ? "bg-blue-50 text-blue-600" :
                            action.type === "DELETE" ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
                          )}>
                            {action.type === "ADD" ? <Add size={16} /> :
                             action.type === "EDIT" ? <Edit size={16} /> :
                             action.type === "DELETE" ? <TrashCan size={16} /> : <PlayFilled size={16} />}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-[#161616]">{action.field}</p>
                            <p className="text-[12px] text-gray-500">{action.detail}</p>
                          </div>
                        </div>
                        <div className="px-2.5 py-1 rounded-sm bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:bg-white transition-colors">
                          {action.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-none flex items-stretch h-[64px] bg-[#f4f4f4] border-t border-gray-200 gap-0">
              <button 
                  type="button"
                  className="w-1/2 bg-[#F4F4F4] hover:bg-[#e8e8e8] text-[#2A53A0] text-[14px] font-medium transition-colors border-r border-gray-200"
                  onClick={() => setIsSubmitConfirmationOpen(false)}
              >
                  Continue Editing
              </button>
              <button 
                  type="button"
                  onClick={() => {
                    setIsSubmitConfirmationOpen(false);
                    setIsSuccessDialogOpen(true);
                  }}
                  className="w-1/2 bg-[#2A53A0] hover:bg-[#1A3A7A] text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
              >
                  Confirm and Submit <Checkmark size={18} />
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Confirmation Modal */}
        <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
          <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] p-0 gap-0 border-0 rounded-[8px] overflow-hidden bg-white shadow-2xl flex flex-col z-[200] [&>button]:hidden">
            <div className="flex flex-col items-center justify-center pt-[32px] pb-0 text-center">
              {/* Checkmark Circle Icon */}
              <div className="w-[36px] h-[36px] mb-[20px]">
                <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
                  <path d={svgPaths.p3903a780} fill="#2A53A0" />
                  <path d={svgPaths.p3ad3b700} fill="#2A53A0" />
                </svg>
              </div>
              
              {/* Updated Title */}
              <h2 className="text-[20px] font-medium text-[#2A53A0] leading-[1.4] mb-[12px]">
                Updated
              </h2>
              
              {/* Subtitle */}
              <p className="text-[16px] font-normal text-[#767676] leading-[1.6] mb-[32px] px-[24px]">
                Event Details Updated<br />Successfully
              </p>
            </div>

            {/* Continue Button */}
            <button 
              onClick={handleFinalSubmit}
              className="w-full h-[64px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white text-[16px] font-normal rounded-bl-[8px] rounded-br-[8px] transition-colors flex items-center justify-center"
            >
              Continue
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}