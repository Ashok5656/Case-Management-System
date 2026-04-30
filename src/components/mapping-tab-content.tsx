import React, { useState, useEffect } from "react";
import { 
  Edit, 
  TrashCan, 
  Copy, 
  Download, 
  Upload, 
  Add,
  OverflowMenuVertical,
  TextFill,
  Tag,
  Information,
  WarningAlt,
  Time,
  PlayFilled,
  WarningFilled,
  Help,
  Close,
  Checkmark,
  ArrowRight,
  Send
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { toast } from "sonner@2.0.3";

interface MappingRow {
  id: string;
  fieldName: string;
  sourceMapping: string;
  transformation: string;
  isConstant?: boolean;
}

interface MappingTab {
  id: string;
  label: string;
}

const MAPPING_DATA_BY_TAB: Record<string, MappingRow[]> = {
  default: [
    { id: "m1", fieldName: "tenant_id", sourceMapping: "\"ICICI\"", transformation: "-", isConstant: true },
    { id: "m2", fieldName: "event_name", sourceMapping: "\"FT_AcctTxn\"", transformation: "-", isConstant: true },
    { id: "m3", fieldName: "event_id", sourceMapping: "eventID", transformation: "-" },
    { id: "m4", fieldName: "transaction_amount", sourceMapping: "txn.amount", transformation: "ROUND(amount, 2)" },
    { id: "m5", fieldName: "timestamp", sourceMapping: "txn.created_at", transformation: "TO_ISO8601(timestamp)" },
    { id: "m6", fieldName: "customer_id", sourceMapping: "customer.account_id", transformation: "-" },
    { id: "m7", fieldName: "currency", sourceMapping: "txn.currency_code", transformation: "-" },
    { id: "m8", fieldName: "status", sourceMapping: "txn.lifecycle_status", transformation: "UPPER(status)" },
  ],
  ib: [
    { id: "ib1", fieldName: "tenant_id", sourceMapping: "\"ICICI\"", transformation: "-", isConstant: true },
    { id: "ib2", fieldName: "event_name", sourceMapping: "\"FT_AcctTxn\"", transformation: "-", isConstant: true },
    { id: "ib3", fieldName: "channel_type", sourceMapping: "\"IB\"", transformation: "-", isConstant: true },
    { id: "ib4", fieldName: "login_ip", sourceMapping: "header.client_ip", transformation: "-" },
    { id: "ib5", fieldName: "browser_fingerprint", sourceMapping: "ui.fingerprint", transformation: "-" },
    { id: "ib6", fieldName: "ib_session_id", sourceMapping: "session.id", transformation: "-" },
    { id: "ib7", fieldName: "transaction_amount", sourceMapping: "txn.amount", transformation: "ROUND(amount, 2)" },
    { id: "ib8", fieldName: "beneficiary_name", sourceMapping: "txn.payee.name", transformation: "-" },
  ],
  mb: [
    { id: "mb1", fieldName: "tenant_id", sourceMapping: "\"ICICI\"", transformation: "-", isConstant: true },
    { id: "mb2", fieldName: "event_name", sourceMapping: "\"FT_AcctTxn\"", transformation: "-", isConstant: true },
    { id: "mb3", fieldName: "device_id", sourceMapping: "device.unique_id", transformation: "-" },
    { id: "mb4", fieldName: "app_version", sourceMapping: "app.version_string", transformation: "-" },
    { id: "mb5", fieldName: "os_type", sourceMapping: "device.platform", transformation: "CAPITALIZE(platform)" },
    { id: "mb6", fieldName: "geocoordinates", sourceMapping: "location.coords", transformation: "GEO_HASH(coords)" },
    { id: "mb7", fieldName: "transaction_amount", sourceMapping: "txn.amount", transformation: "ROUND(amount, 2)" },
    { id: "mb8", fieldName: "push_token", sourceMapping: "device.fcm_token", transformation: "-" },
  ],
  cbdc: [
    { id: "cb1", fieldName: "tenant_id", sourceMapping: "\"ICICI\"", transformation: "-", isConstant: true },
    { id: "cb2", fieldName: "event_name", sourceMapping: "\"FT_AcctTxn\"", transformation: "-", isConstant: true },
    { id: "cb3", fieldName: "wallet_id", sourceMapping: "crypto.wallet_address", transformation: "-" },
    { id: "cb4", fieldName: "ledger_address", sourceMapping: "blockchain.account", transformation: "-" },
    { id: "cb5", fieldName: "asset_type", sourceMapping: "\"CBDC\"", transformation: "-", isConstant: true },
    { id: "cb6", fieldName: "blockchain_tx_hash", sourceMapping: "ledger.transaction_id", transformation: "-" },
    { id: "cb7", fieldName: "transaction_amount", sourceMapping: "txn.amount", transformation: "ROUND(amount, 2)" },
    { id: "cb8", fieldName: "consensus_status", sourceMapping: "node.response_code", transformation: "MAP_STATUS(code)" },
  ],
  upi: [
    { id: "upi1", fieldName: "vpa_address", sourceMapping: "payment.vpa", transformation: "-" },
    { id: "upi2", fieldName: "upi_txn_id", sourceMapping: "payment.upi_ref", transformation: "-" },
    { id: "upi3", fieldName: "payer_name", sourceMapping: "customer.name", transformation: "-" },
    { id: "upi4", fieldName: "payee_vpa", sourceMapping: "merchant.vpa", transformation: "-" },
  ],
  neft: [
    { id: "neft1", fieldName: "ifsc_code", sourceMapping: "bank.ifsc", transformation: "UPPER(ifsc)" },
    { id: "neft2", fieldName: "utr_number", sourceMapping: "txn.utr", transformation: "-" },
    { id: "neft3", fieldName: "beneficiary_acc", sourceMapping: "payee.account", transformation: "MASK(acc)" },
  ],
  rtgs: [
    { id: "rtgs1", fieldName: "rtgs_utr", sourceMapping: "txn.rtgs_id", transformation: "-" },
    { id: "rtgs2", fieldName: "priority_flag", sourceMapping: "\"HIGH\"", transformation: "-", isConstant: true },
  ],
  imps: [
    { id: "imps1", fieldName: "mmid", sourceMapping: "customer.mmid", transformation: "-" },
    { id: "imps2", fieldName: "mobile_number", sourceMapping: "customer.mobile", transformation: "-" },
  ]
};

export function MappingTabContent({ 
  customTabs, 
  activeTabId, 
  onTabChange, 
  onNavigate,
  onAction 
}: { 
  customTabs?: MappingTab[], 
  activeTabId?: string, 
  onTabChange?: (id: string) => void, 
  onNavigate?: (path: string) => void,
  onAction?: (type: string, field: string, detail: string) => void
}) {
  const [internalActiveSubTab, setInternalActiveSubTab] = useState("default");
  
  const activeSubTab = activeTabId || internalActiveSubTab;
  const setActiveSubTab = onTabChange || setInternalActiveSubTab;

  const [internalSubTabs, setInternalSubTabs] = useState<MappingTab[]>([
    { id: "default", label: "Default Mapping" },
    { id: "ib", label: "FT_IB_FundsTransfer" },
    { id: "mb", label: "FT_MB_FundsTransfer" },
    { id: "cbdc", label: "FT_CBDC_FundsTransfer" },
  ]);

  const subTabs = customTabs || internalSubTabs;
  const setSubTabs = setInternalSubTabs;

  // Pending changes state
  const [pendingActions, setPendingActions] = useState<{id: string, type: string, field: string, detail: string}[]>([]);
  const [isSubmitConfirmationOpen, setIsSubmitConfirmationOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const addAction = (type: string, field: string, detail: string) => {
    setPendingActions(prev => [
      ...prev, 
      { id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, type, field, detail }
    ]);
    if (onAction) onAction(type, field, detail);
  };

  // Per-tab mapping data state
  const [mappingsByTab, setMappingsByTab] = useState<Record<string, MappingRow[]>>(MAPPING_DATA_BY_TAB);

  // Dialog states for rename
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [tabToRename, setTabToRename] = useState<MappingTab | null>(null);
  const [newTabName, setNewTabName] = useState("");

  // Dialog state for upload
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Dialog states for edit mapping field
  const [isEditMappingDialogOpen, setIsEditMappingDialogOpen] = useState(false);
  const [mappingToEdit, setMappingToEdit] = useState<MappingRow | null>(null);
  const [editFieldName, setEditFieldName] = useState("");
  const [editSourceMapping, setEditSourceMapping] = useState("");
  const [editTransformation, setEditTransformation] = useState("");

  // Dialog states for add mapping field
  const [isAddMappingDialogOpen, setIsAddMappingDialogOpen] = useState(false);
  const [newFieldNameField, setNewFieldNameField] = useState("");
  const [newSourceMappingField, setNewSourceMappingField] = useState("");
  const [newTransformationField, setNewTransformationField] = useState("");

  // Dialog state for batch processing
  const [isBatchProcessingDialogOpen, setIsBatchProcessingDialogOpen] = useState(false);
  const [batchProcessingEnabled, setBatchProcessingEnabled] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  
  // Cron values state
  const [cronMinute, setCronMinute] = useState("0");
  const [cronHour, setCronHour] = useState("2");
  const [cronDay, setCronDay] = useState("*");
  const [cronMonth, setCronMonth] = useState("*");
  const [cronWeekday, setCronWeekday] = useState("*");

  // Dialog states for Create Tab
  const [isCreateTabDialogOpen, setIsCreateTabDialogOpen] = useState(false);
  const [newTabCloneFrom, setNewTabCloneFrom] = useState("empty");
  const [newTabNameField, setNewTabNameField] = useState("");
  const [newTabDescriptionField, setNewTabDescriptionField] = useState("");

  const presets = [
    { label: "Every minute", values: ["*", "*", "*", "*", "*"] },
    { label: "Every 5 minutes", values: ["*/5", "*", "*", "*", "*"] },
    { label: "Every 15 minutes", values: ["*/15", "*", "*", "*", "*"] },
    { label: "Every hour", values: ["0", "*", "*", "*", "*"] },
    { label: "Daily at midnight", values: ["0", "0", "*", "*", "*"] },
  ];

  const applyPreset = (values: string[]) => {
    setCronMinute(values[0]);
    setCronHour(values[1]);
    setCronDay(values[2]);
    setCronMonth(values[3]);
    setCronWeekday(values[4]);
    setShowPresets(false);
    toast.success("Preset schedule applied");
  };

  const currentMappings = mappingsByTab[activeSubTab] || [];

  const handleAddTab = () => {
    setNewTabCloneFrom("empty");
    setNewTabNameField("");
    setNewTabDescriptionField("");
    setIsCreateTabDialogOpen(true);
  };

  const confirmCreateTab = () => {
    if (!newTabNameField.trim()) {
      toast.error("Tab name is required");
      return;
    }
    
    const newId = `mapping-tab-${Date.now()}`;
    const newTab = {
      id: newId,
      label: newTabNameField
    };
    
    setSubTabs(prev => [...prev, newTab]);
    
    // Copy data if cloning
    let initialData: MappingRow[] = [];
    if (newTabCloneFrom !== "empty") {
      initialData = [...(mappingsByTab[newTabCloneFrom] || [])];
    }
    
    setMappingsByTab(prev => ({ ...prev, [newId]: initialData }));
    setIsCreateTabDialogOpen(false);
    setActiveSubTab(newId);
    toast.success(`New mapping configuration "${newTabNameField}" created`);
  };

  const handleRenameTab = (tab: MappingTab) => {
    setTabToRename(tab);
    setNewTabName(tab.label);
    setIsRenameDialogOpen(true);
  };

  const confirmRename = () => {
    if (!tabToRename || !newTabName.trim()) return;
    setSubTabs(prev => prev.map(t => t.id === tabToRename.id ? { ...t, label: newTabName } : t));
    addAction("EDIT", tabToRename.label, `Renamed to ${newTabName}`);
    setIsRenameDialogOpen(false);
    setTabToRename(null);
    toast.success("Mapping view renamed");
  };

  const handleDuplicateTab = (tab: MappingTab) => {
    const newId = `${tab.id}-copy-${Date.now()}`;
    const newTab = {
      id: newId,
      label: `${tab.label} (Copy)`
    };
    setSubTabs(prev => {
      const index = prev.findIndex(t => t.id === tab.id);
      const updated = [...prev];
      updated.splice(index + 1, 0, newTab);
      return updated;
    });
    setMappingsByTab(prev => ({ ...prev, [newId]: [...(prev[tab.id] || [])] }));
    setActiveSubTab(newId);
    addAction("ADD", newTab.label, `Duplicated from ${tab.label}`);
    toast.success(`Duplicated mapping configuration: ${tab.label}`);
  };

  const handleDeleteTab = (tabId: string) => {
    if (subTabs.length <= 1) {
      toast.error("Cannot delete the last mapping configuration");
      return;
    }
    const tab = subTabs.find(t => t.id === tabId);
    setSubTabs(prev => prev.filter(t => t.id !== tabId));
    setMappingsByTab(prev => {
      const updated = { ...prev };
      delete updated[tabId];
      return updated;
    });
    if (activeSubTab === tabId) {
      const currentIndex = subTabs.findIndex(t => t.id === tabId);
      const nextTab = subTabs[currentIndex + 1] || subTabs[currentIndex - 1];
      setActiveSubTab(nextTab.id);
    }
    if (tab) addAction("DELETE", tab.label, "Mapping configuration removed");
    toast.error("Mapping configuration removed");
  };

  // --- FIELD ACTIONS ---
  const handleEditField = (row: MappingRow) => {
    setMappingToEdit(row);
    setEditFieldName(row.fieldName);
    setEditSourceMapping(row.sourceMapping);
    setEditTransformation(row.transformation);
    setIsEditMappingDialogOpen(true);
  };

  const confirmEditField = () => {
    if (!mappingToEdit) return;
    setMappingsByTab(prev => ({
      ...prev,
      [activeSubTab]: prev[activeSubTab].map(m => 
        m.id === mappingToEdit.id 
          ? { ...m, fieldName: editFieldName, sourceMapping: editSourceMapping, transformation: editTransformation } 
          : m
      )
    }));
    addAction("EDIT", editFieldName, `Source: ${editSourceMapping}, Trans: ${editTransformation}`);
    setIsEditMappingDialogOpen(false);
    toast.success(`Updated field: ${editFieldName}`);
  };

  const handleCloneField = (row: MappingRow) => {
    const newField = {
      ...row,
      id: `m-clone-${Date.now()}`,
      fieldName: `${row.fieldName}_copy`
    };
    setMappingsByTab(prev => ({
      ...prev,
      [activeSubTab]: [...prev[activeSubTab], newField]
    }));
    addAction("ADD", newField.fieldName, `Cloned from ${row.fieldName}`);
    toast.success(`Cloned field: ${row.fieldName}`);
  };

  const handleDeleteField = (fieldId: string) => {
    const field = currentMappings.find(m => m.id === fieldId);
    setMappingsByTab(prev => ({
      ...prev,
      [activeSubTab]: prev[activeSubTab].filter(m => m.id !== fieldId)
    }));
    if (field) addAction("DELETE", field.fieldName, "Mapping removed from list");
    toast.error("Field mapping removed");
  };

  const handleAddField = () => {
    setNewFieldNameField("");
    setNewSourceMappingField("");
    setNewTransformationField("-");
    setIsAddMappingDialogOpen(true);
  };

  const confirmAddField = () => {
    if (!newFieldNameField.trim()) {
      toast.error("Field name is required");
      return;
    }
    const newField: MappingRow = {
      id: `m-new-${Date.now()}`,
      fieldName: newFieldNameField,
      sourceMapping: newSourceMappingField || "source.path",
      transformation: newTransformationField || "-"
    };
    setMappingsByTab(prev => ({
      ...prev,
      [activeSubTab]: [...(prev[activeSubTab] || []), newField]
    }));
    addAction("ADD", newFieldNameField, `New mapping added to ${subTabs.find(t => t.id === activeSubTab)?.label}`);
    setIsAddMappingDialogOpen(false);
    toast.success(`Added new field mapping: ${newFieldNameField}`);
  };

  const handleDownloadMappings = () => {
    const headers = ["Field Name", "Source Mapping", "Transformation"];
    const rows = currentMappings.map(m => [
      m.fieldName,
      m.sourceMapping,
      m.transformation
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mapping_${activeSubTab}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Mapping configuration downloaded");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Contained Sub Tabs Navigation */}
      <div className="flex items-center h-[48px] bg-[#e0e0e0] border-b border-[#D0D0D0] flex-none">
        <div className="flex items-center h-full overflow-x-auto scrollbar-hide">
          {subTabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={cn(
                "h-full px-6 text-[14px] flex items-center gap-3 whitespace-nowrap transition-all border-r border-[#D0D0D0] relative group cursor-pointer",
                activeSubTab === tab.id 
                  ? "bg-white text-[#161616] font-semibold border-b-transparent z-10" 
                  : "text-[#525252] hover:bg-[#f4f4f4] bg-[#e0e0e0]"
              )}
            >
              {tab.label}
              {activeSubTab === tab.id && (
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#2A53A0]" />
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div 
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "p-1 rounded-sm transition-opacity flex items-center justify-center hover:bg-gray-100",
                      activeSubTab === tab.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <OverflowMenuVertical size={14} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRenameTab(tab); }}>
                    <TextFill className="mr-2 size-4" /> Rename Mapping
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicateTab(tab); }}>
                    <Copy className="mr-2 size-4" /> Duplicate Mapping
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    disabled={subTabs.length <= 1}
                    className="text-red-600 focus:text-red-600 font-medium"
                    onClick={(e) => { e.stopPropagation(); handleDeleteTab(tab.id); }}
                  >
                    <TrashCan className="mr-2 size-4" /> Delete Mapping
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
          <button 
            onClick={handleAddTab}
            className="h-full px-5 text-[#2A53A0] hover:bg-[#f4f4f4] border-r border-[#D0D0D0] transition-colors flex items-center justify-center"
            title="Add New Mapping Configuration"
          >
            <Add size={20} />
          </button>
        </div>
      </div>

      {/* Toolbar / Metadata Area */}
      <div className="flex items-center justify-between px-4 py-4 bg-white">
        <div>
          <h3 className="text-[14px] font-normal italic">
            <span className="text-[#525252]">Configuration: </span>
            <span className="text-[#161616]">{subTabs.find(t => t.id === activeSubTab)?.label}</span>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-gray-400 mr-4">Last Modified: Today 14:30</span>
          
          {!onAction && (
            <Button 
              onClick={() => setIsSubmitConfirmationOpen(true)}
              disabled={pendingActions.length === 0}
              className={cn(
                "h-[46px] px-6 rounded-[8px] flex items-center gap-2 font-bold text-[14px] transition-all",
                pendingActions.length > 0 
                  ? "bg-[#198038] hover:bg-[#156b2f] text-white shadow-lg shadow-green-100 animate-in fade-in zoom-in-95" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              )}
            >
              <Send size={18} /> Submit Changes {pendingActions.length > 0 && `(${pendingActions.length})`}
            </Button>
          )}

          {!onAction && <div className="w-[1px] h-6 bg-gray-200 mx-2" />}

          <Button 
            variant="outline" 
            onClick={() => setIsUploadDialogOpen(true)}
            className="h-[46px] px-4 border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 flex items-center gap-2 rounded-[8px] text-[13px] font-medium transition-colors"
          >
            <Upload size={16} /> Upload
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownloadMappings}
            className="h-[46px] px-4 border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 flex items-center gap-2 rounded-[8px] text-[13px] font-medium transition-colors"
            title="Download Configuration"
          >
            <Download size={18} /> Download
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsBatchProcessingDialogOpen(true)}
            className="h-[46px] px-4 border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 flex items-center gap-2 rounded-[8px] text-[13px] font-medium transition-colors"
          >
             <div className={cn(
               "w-2 h-2 rounded-full",
               batchProcessingEnabled ? "bg-[#198038] animate-pulse" : "bg-[#da1e28]"
             )} />
             <span>Batch Processing</span>
          </Button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="flex-1 px-4 pb-4 overflow-hidden flex flex-col">
        <div className="flex-1 border border-[#D0D0D0] border-l-[3px] border-l-[#2A53A0] rounded-sm overflow-hidden flex flex-col shadow-sm">
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="bg-[#f4f4f4] sticky top-0 z-10 border-b border-[#D0D0D0]">
                <tr className="h-[48px]">
                  <th className="w-[25%] px-6 text-[13px] font-semibold text-[#2A53A0] align-middle">Field Name</th>
                  <th className="w-[30%] px-6 text-[13px] font-semibold text-[#2A53A0] align-middle">Source Mapping</th>
                  <th className="w-[30%] px-6 text-[13px] font-semibold text-[#2A53A0] align-middle">Transformation</th>
                  <th className="w-[180px] px-6 text-[13px] font-semibold text-[#2A53A0] align-middle text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentMappings.length > 0 ? currentMappings.map((row) => (
                  <tr key={row.id} className="h-[46px] hover:bg-[#F8FBFF] group transition-colors">
                    <td className="px-6 align-middle font-mono text-[13px] text-[#161616] truncate" title={row.fieldName}>{row.fieldName}</td>
                    <td className="px-6 align-middle truncate" title={row.sourceMapping}>
                      <span className={cn(
                        "text-[13px] font-normal",
                        row.isConstant ? "text-[#198038] font-mono" : "text-[#2A53A0]"
                      )}>
                        {row.sourceMapping}
                      </span>
                    </td>
                    <td className="px-6 align-middle truncate" title={row.transformation}>
                      <span className={cn(
                        "text-[13px] font-normal",
                        row.transformation !== "-" ? "text-[#198038] font-mono bg-green-50 px-2 py-0.5 rounded-sm" : "text-gray-300"
                      )}>
                        {row.transformation}
                      </span>
                    </td>
                    <td className="px-6 align-middle text-left">
                      <div className={cn(
                        "flex items-center justify-start gap-3 transition-opacity",
                        activeSubTab === "default" ? "opacity-20 cursor-not-allowed" : "opacity-100"
                      )}>
                        <button 
                          onClick={() => activeSubTab !== "default" && handleEditField(row)}
                          disabled={activeSubTab === "default"}
                          className={cn(
                            "w-[28px] h-[28px] flex items-center justify-center rounded-sm transition-colors border",
                            activeSubTab === "default" 
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                              : "bg-[#f6f2ff] hover:bg-[#e8daff] text-[#8a3ffc] border-[#D0C0FF]"
                          )}
                          title={activeSubTab === "default" ? "Editing disabled for Default Mapping" : "Edit Mapping"}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => activeSubTab !== "default" && handleDeleteField(row.id)}
                          disabled={activeSubTab === "default"}
                          className={cn(
                            "w-[28px] h-[28px] flex items-center justify-center rounded-sm transition-colors border",
                            activeSubTab === "default" 
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                              : "bg-[#fff1f1] hover:bg-[#ffd7d9] text-[#da1e28] border-[#ffd7d9]"
                          )}
                          title={activeSubTab === "default" ? "Deletion disabled for Default Mapping" : "Delete"}
                        >
                          <TrashCan size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="h-48 text-center text-gray-400 text-sm">
                      No field mappings defined for this configuration.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex-none h-[48px] bg-[#f4f4f4] border-t border-[#D0D0D0] px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[12px] text-[#525252]">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#161616]">{currentMappings.length}</span> fields mapped
              </div>
              <div className="w-[1px] h-3 bg-gray-300" />
              <div className="flex items-center gap-1.5 text-[#198038]">
                <span className="font-bold">{currentMappings.filter(m => m.transformation !== "-").length}</span> with transformations
              </div>
            </div>
            <div className="text-[12px] text-gray-400">
              Last updated: 28/01/2026
            </div>
          </div>
        </div>
      </div>

      {/* CREATE NEW TAB DIALOG */}
      <Dialog open={isCreateTabDialogOpen} onOpenChange={setIsCreateTabDialogOpen}>
        <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] p-0 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[100] [&>button]:hidden">
          {/* Header */}
          <DialogHeader className="flex-none flex flex-row items-center justify-between px-[30px] h-[64px] border-b border-gray-100 bg-[#2A53A0] space-y-0">
            <div className="flex items-center gap-3">
               <DialogTitle className="text-[20px] font-normal text-white">Create New Tab</DialogTitle>
               <DialogDescription className="sr-only">
                 Create a new mapping configuration tab by cloning or starting from scratch.
               </DialogDescription>
            </div>
            <button 
              type="button"
              onClick={() => setIsCreateTabDialogOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-[4px] transition-colors text-white"
            >
              <Close size={20} />
            </button>
          </DialogHeader>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto">
            <div className="px-8 py-6 space-y-6">
              <div className="space-y-5">
                {/* Clone From */}
                <div className="space-y-1.5">
                    <Label className="text-[14px] font-semibold text-[#161616]">
                        Clone from
                    </Label>
                    <Select value={newTabCloneFrom} onValueChange={setNewTabCloneFrom}>
                      <SelectTrigger className="w-full h-[46px] bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px]">
                        <SelectValue placeholder="Select source configuration" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-[110]" position="popper" sideOffset={4}>
                        <SelectItem value="empty">Empty for blank tab</SelectItem>
                        {subTabs.map(tab => (
                          <SelectItem key={tab.id} value={tab.id}>{tab.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[12px] text-gray-400 italic">Select source configuration to copy, or Empty for blank tab</p>
                </div>

                {/* Tab Name */}
                <div className="space-y-1.5">
                    <Label className="text-[14px] font-semibold text-[#161616] flex items-center gap-1">
                        Tab Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input 
                          value={newTabNameField}
                          onChange={(e) => setNewTabNameField(e.target.value.slice(0, 50))}
                          placeholder="Enter tab name"
                          className="w-full h-[46px] bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px]"
                      />
                      <div className="flex justify-between mt-1 px-0.5">
                        <p className="text-[11px] text-gray-400">Max 50 characters</p>
                        <p className="text-[11px] text-gray-400">{newTabNameField.length}/50</p>
                      </div>
                    </div>
                </div>

                {/* Tab Description */}
                <div className="space-y-1.5">
                    <Label className="text-[14px] font-semibold text-[#161616]">
                        Tab Description
                    </Label>
                    <div className="relative">
                      <Textarea 
                          value={newTabDescriptionField}
                          onChange={(e) => setNewTabDescriptionField(e.target.value.slice(0, 500))}
                          placeholder="Describe the purpose of this configuration variant"
                          className="w-full min-h-[100px] bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] resize-none"
                      />
                      <div className="flex justify-end mt-1 px-0.5">
                        <p className="text-[11px] text-gray-400">{newTabDescriptionField.length}/500</p>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Consistent with image */}
          <div className="flex-none flex items-stretch h-[64px] bg-[#f4f4f4] border-t border-gray-200 gap-0">
            <button 
                type="button"
                className="w-1/2 bg-[#F4F4F4] hover:bg-[#e8e8e8] text-[#2A53A0] text-[14px] font-medium transition-colors border-r border-gray-200"
                onClick={() => setIsCreateTabDialogOpen(false)}
            >
                Cancel
            </button>
            <button 
                type="button"
                disabled={!newTabNameField.trim()}
                onClick={confirmCreateTab}
                className="w-1/2 bg-[#2A53A0] hover:bg-[#1e3c75] disabled:bg-[#D8DCE3] disabled:text-[#A8B0BD] disabled:cursor-not-allowed text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Checkmark size={18} /> Create Tab
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ADD FIELD DIALOG */}
      <Dialog open={isAddMappingDialogOpen} onOpenChange={setIsAddMappingDialogOpen}>
        <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] p-0 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[100] [&>button]:hidden">
          <DialogHeader className="flex-none flex flex-row items-center justify-between px-[30px] h-[64px] border-b border-gray-100 bg-[#2A53A0] space-y-0">
            <div className="flex items-center gap-3">
               <DialogTitle className="text-[20px] font-normal text-white">Add New Field Mapping</DialogTitle>
               <DialogDescription className="sr-only">
                 Form to define a new field mapping including name, source path and transformation.
               </DialogDescription>
            </div>
            <button 
              type="button"
              onClick={() => setIsAddMappingDialogOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-[4px] transition-colors text-white"
            >
              <Close size={20} />
            </button>
          </DialogHeader>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto max-h-[80vh]">
            <div className="px-[30px] py-6 space-y-6">
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Define a new mapping for <span className="font-semibold text-[#161616]">{subTabs.find(t => t.id === activeSubTab)?.label}</span>. This will determine how data is extracted and transformed during batch processing.
              </p>

              <div className="space-y-5">
                {/* Field Name */}
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616] flex items-center gap-1">
                        Field Name <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                        value={newFieldNameField}
                        onChange={(e) => setNewFieldNameField(e.target.value)}
                        placeholder="e.g., transaction_id"
                        className="w-full h-[46px] bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] font-mono"
                    />
                </div>

                {/* Source Mapping */}
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616]">
                        Source Mapping Path
                    </Label>
                    <Input 
                        value={newSourceMappingField}
                        onChange={(e) => setNewSourceMappingField(e.target.value)}
                        placeholder="e.g., header.message_id"
                        className="w-full h-[46px] bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] font-mono text-[#2A53A0]"
                    />
                </div>

                {/* Transformation */}
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616]">
                        Transformation Expression
                    </Label>
                    <Input 
                        value={newTransformationField}
                        onChange={(e) => setNewTransformationField(e.target.value)}
                        placeholder='Use "-" for direct mapping'
                        className="w-full h-[46px] bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] font-mono text-[#198038]"
                    />
                    <p className="text-[11px] text-gray-400 italic">Use SQL-like syntax (e.g., UPPER(field), ROUND(amount, 2))</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Full Width Buttons strictly matching Model */}
          <div className="flex-none flex items-stretch h-[64px] bg-[#f4f4f4] border-t border-gray-200 gap-0">
            <button 
                type="button"
                className="w-1/2 bg-[#F4F4F4] hover:bg-[#e8e8e8] text-[#2A53A0] text-[14px] font-medium transition-colors"
                onClick={() => setIsAddMappingDialogOpen(false)}
            >
                Cancel
            </button>
            <button 
                type="button"
                disabled={!newFieldNameField.trim()}
                onClick={confirmAddField}
                className={cn(
                  "w-1/2 text-[14px] font-medium transition-all flex items-center justify-center gap-2",
                  newFieldNameField.trim() 
                    ? "bg-[#2A53A0] hover:bg-[#1e3c75] text-white" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed border-none shadow-none"
                )}
            >
                <Checkmark size={18} /> Save Field
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* UPLOAD DIALOG */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] p-0 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[100] [&>button]:hidden">
          {/* Header */}
          <DialogHeader className="flex-none flex flex-row items-center justify-between px-[30px] h-[64px] border-b border-gray-100 bg-[#2A53A0] space-y-0">
            <div className="flex items-center gap-3">
               <DialogTitle className="text-[20px] font-normal text-white">Upload Mapping Configuration</DialogTitle>
               <DialogDescription className="sr-only">
                 Upload mapping file for {subTabs.find(t => t.id === activeSubTab)?.label}
               </DialogDescription>
            </div>
            <button 
              type="button"
              onClick={() => setIsUploadDialogOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-[4px] transition-colors text-white"
            >
              <Close size={20} />
            </button>
          </DialogHeader>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto max-h-[80vh]">
            <div className="px-[30px] py-6 space-y-6">
              <div className="space-y-5">
                {/* Sample Link */}
                <div className="flex justify-end">
                  <button className="flex items-center gap-1.5 text-[12px] text-[#2A53A0] hover:underline font-semibold group transition-all">
                    <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> 
                    Download CSV Template
                  </button>
                </div>

                {/* Dropzone Area */}
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-[8px] p-10 flex flex-col items-center justify-center transition-all cursor-pointer group",
                    uploadedFile 
                      ? "border-[#2A53A0] bg-blue-50/30" 
                      : "border-gray-200 hover:border-[#2A53A0] hover:bg-blue-50/20"
                  )}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && file.name.endsWith('.csv')) {
                      setUploadedFile(file);
                    } else {
                      toast.error("Please upload a valid .csv file");
                    }
                  }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) setUploadedFile(file);
                    };
                    input.click();
                  }}
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                    <Upload size={28} className={cn("transition-colors", uploadedFile ? "text-[#2A53A0]" : "text-gray-400 group-hover:text-[#2A53A0]")} />
                  </div>
                  {uploadedFile ? (
                    <div className="text-center">
                      <p className="text-[15px] font-semibold text-[#161616]">{uploadedFile.name}</p>
                      <p className="text-[12px] text-gray-500 mt-1">{(uploadedFile.size / 1024).toFixed(2)} KB • File ready</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="mt-3 text-[12px] text-red-500 hover:text-red-600 font-medium underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-[16px] font-medium text-[#161616]">Drag and drop CSV file here</p>
                      <p className="text-[14px] text-gray-500 mt-1">or click to browse from your computer</p>
                    </div>
                  )}
                </div>

                {/* Requirements Box */}
                <div className="bg-white border border-gray-200 rounded-[8px] p-5 space-y-4">
                   <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      <Information size={14} />
                      TYPE SPECIFIC CONSTRAINTS
                   </div>
                   <div className="space-y-2">
                    <p className="text-[13px] font-semibold text-[#161616]">File Requirements</p>
                    <ul className="text-[13px] text-gray-600 space-y-1.5 list-disc ml-5">
                      <li>Column Headers: <span className="font-mono text-[#2A53A0]">FieldName, SourceMapping, DataType</span></li>
                      <li>File format must be <span className="font-semibold text-[#161616]">.csv</span></li>
                      <li>Character encoding should be <span className="font-semibold text-[#161616]">UTF-8</span></li>
                    </ul>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-none flex items-stretch h-[64px] bg-[#f4f4f4] border-t border-gray-200 gap-0">
            <button 
                type="button"
                className="w-1/2 bg-[#F4F4F4] hover:bg-[#e8e8e8] text-[#2A53A0] text-[14px] font-medium transition-colors"
                onClick={() => {
                  setIsUploadDialogOpen(false);
                  setUploadedFile(null);
                }}
            >
                Cancel
            </button>
            <button 
                type="button"
                disabled={!uploadedFile}
                onClick={() => {
                  setIsUploadDialogOpen(false);
                  setUploadedFile(null);
                  toast.success("Mapping configuration uploaded successfully");
                }}
                className="w-1/2 bg-[#2A53A0] hover:bg-[#1e3c75] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Checkmark size={18} /> Upload & Apply
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* RENAME DIALOG */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] p-0 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[100] [&>button]:hidden">
          <DialogHeader className="flex-none flex flex-row items-center justify-between px-4 h-[48px] border-b border-gray-100 bg-white space-y-0">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-50 rounded-sm flex items-center justify-center text-[#2A53A0]">
                  <TextFill size={18} />
               </div>
               <div className="flex flex-col text-left">
                 <DialogTitle className="text-[15px] font-semibold text-[#161616]">Rename Mapping View</DialogTitle>
                 <DialogDescription className="sr-only">
                   Update the label for this specific mapping configuration.
                 </DialogDescription>
               </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsRenameDialogOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-sm transition-colors text-gray-500"
            >
              <Close size={20} />
            </button>
          </DialogHeader>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="mapping-name" className="text-[13px] font-semibold text-[#161616]">Configuration Name</Label>
                  <Input
                    id="mapping-name"
                    value={newTabName}
                    onChange={(e) => setNewTabName(e.target.value)}
                    placeholder="Enter mapping name..."
                    className="w-full h-[46px] bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px]"
                    onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
                  />
                  <p className="text-[11px] text-gray-400 italic">This name will appear in the mapping sub-tabs selector.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Consistent 78px height */}
          <div className="flex-none flex items-center justify-end h-[78px] bg-[#f4f4f4] border-t border-gray-200 px-6 gap-3">
            <Button 
                variant="outline"
                className="h-[46px] px-8 rounded-[8px] bg-white hover:bg-gray-100 text-[#525252] border border-gray-300 text-[14px] font-medium transition-colors"
                onClick={() => setIsRenameDialogOpen(false)}
            >
                Cancel
            </Button>
            <Button 
                onClick={confirmRename}
                className="h-[46px] px-10 rounded-[8px] font-medium bg-[#2A53A0] hover:bg-[#1e3c75] text-white border-0 text-[14px] flex items-center gap-2 shadow-sm transition-all"
            >
                Update Name
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT FIELD DIALOG */}
      <Dialog open={isEditMappingDialogOpen} onOpenChange={setIsEditMappingDialogOpen}>
        <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] p-0 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[100] [&>button]:hidden">
          <DialogHeader className="flex-none flex flex-row items-center justify-between px-[30px] h-[64px] border-b border-gray-100 bg-[#2A53A0] space-y-0">
            <div className="flex items-center gap-3">
               <DialogTitle className="text-[20px] font-normal text-white">Edit Field Mapping</DialogTitle>
               <DialogDescription className="sr-only">
                 Modify the source path and transformation logic for this field.
               </DialogDescription>
            </div>
            <button 
              type="button"
              onClick={() => setIsEditMappingDialogOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-[4px] transition-colors text-white"
            >
              <Close size={20} />
            </button>
          </DialogHeader>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto max-h-[80vh]">
            <div className="px-[30px] py-6 space-y-6">
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Update the mapping configuration for <span className="font-semibold text-[#161616]">{editFieldName}</span>. Changes will take effect in the next batch processing cycle.
              </p>

              <div className="space-y-5">
                {/* Field Name */}
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616] flex items-center gap-1">
                        Field Name <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                        value={editFieldName}
                        onChange={(e) => setEditFieldName(e.target.value)}
                        className="w-full h-[46px] bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] font-mono"
                    />
                </div>

                {/* Source Mapping */}
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616]">
                        Source Mapping Path
                    </Label>
                    <Input 
                        value={editSourceMapping}
                        onChange={(e) => setEditSourceMapping(e.target.value)}
                        className="w-full h-[46px] bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] font-mono text-[#2A53A0]"
                    />
                </div>

                {/* Transformation */}
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616]">
                        Transformation Expression
                    </Label>
                    <Input 
                        value={editTransformation}
                        onChange={(e) => setEditTransformation(e.target.value)}
                        className="w-full h-[46px] bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] font-mono text-[#198038]"
                    />
                    <p className="text-[11px] text-gray-500 italic">Use SQL-like expressions for transformations. Use "-" for direct mapping.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Full Width Buttons strictly matching Model */}
          <div className="flex-none flex items-stretch h-[64px] bg-[#f4f4f4] border-t border-gray-200 gap-0">
            <button 
                type="button"
                className="w-1/2 bg-[#F4F4F4] hover:bg-[#e8e8e8] text-[#2A53A0] text-[14px] font-medium transition-colors"
                onClick={() => setIsEditMappingDialogOpen(false)}
            >
                Cancel
            </button>
            <button 
                type="button"
                onClick={confirmEditField}
                className="w-1/2 bg-[#2A53A0] hover:bg-[#1e3c75] text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Checkmark size={18} /> Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* BATCH PROCESSING DIALOG */}
      <Dialog open={isBatchProcessingDialogOpen} onOpenChange={setIsBatchProcessingDialogOpen}>
        <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[850px] p-0 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[100] [&>button]:hidden">
          {/* Header - Matches Add/Edit Field Model */}
          <DialogHeader className="flex-none flex flex-row items-center justify-between px-[30px] h-[64px] border-b border-gray-100 bg-[#2A53A0] space-y-0">
            <div className="flex items-center gap-3">
               <DialogTitle className="text-[20px] font-normal text-white">Batch Processing Configuration</DialogTitle>
               <DialogDescription className="sr-only">
                 Configure automated batch processing for {subTabs.find(t => t.id === activeSubTab)?.label}
               </DialogDescription>
            </div>
            <button 
              type="button"
              onClick={() => setIsBatchProcessingDialogOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-[4px] transition-colors text-white"
            >
              <Close size={20} />
            </button>
          </DialogHeader>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto max-h-[80vh]">
            <div className="px-[30px] py-6 space-y-6">
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Configure automated batch processing for <span className="font-semibold text-[#161616]">{subTabs.find(t => t.id === activeSubTab)?.label}</span>. This will determine how frequently mappings are applied to source data.
              </p>

              {/* Status Banner */}
              <div 
                className={cn(
                  "rounded-[8px] border p-5 flex items-center justify-between transition-colors",
                  batchProcessingEnabled 
                    ? "bg-[#F6FFF2] border-[#A7F0BA]" 
                    : "bg-[#FFFBF0] border-[#F1C21B]/40"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex items-center justify-center",
                    batchProcessingEnabled ? "text-[#198038]" : "text-[#F1C21B]"
                  )}>
                    {batchProcessingEnabled ? <Checkmark size={24} /> : <WarningAlt size={24} />}
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#161616]">Operation Mode</h4>
                    <p className="text-[13px] text-[#525252]">
                      Automated batch processing is currently {batchProcessingEnabled ? "enabled" : "disabled"}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={batchProcessingEnabled}
                  onCheckedChange={(val) => {
                    setBatchProcessingEnabled(val);
                    addAction("CONFIG", "Batch Processing", `Batch processing mode set to ${val ? "Automated" : "Manual"}`);
                  }}
                  className="scale-105"
                />
              </div>

              {/* Conditional Configuration Section */}
              {batchProcessingEnabled ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Time size={18} className="text-[#2A53A0]" />
                      <h4 className="text-[15px] font-bold text-[#161616]">Schedule Configuration (Cron)</h4>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPresets(!showPresets)}
                      className={cn(
                        "h-[32px] text-[11px] px-4 font-semibold rounded-[4px] border-[#2A53A0]/30 transition-all",
                        showPresets 
                          ? "bg-[#2A53A0] text-white hover:bg-[#1e3c75] border-[#2A53A0]" 
                          : "text-[#2A53A0] hover:bg-blue-50"
                      )}
                    >
                      {showPresets ? "Hide Presets" : "Show Presets"}
                    </Button>
                  </div>

                  {showPresets && (
                    <div className="grid grid-cols-1 gap-2 p-4 bg-gray-50 border border-gray-100 rounded-[8px] animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Quick Presets</span>
                        <span className="text-[10px] text-gray-400 italic">Click to apply to schedule</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {presets.map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => applyPreset(preset.values)}
                            className="flex flex-col items-start p-4 bg-white border border-gray-200 rounded-[8px] hover:border-[#2A53A0] hover:shadow-sm transition-all text-left group"
                          >
                            <span className="text-[13px] font-bold text-[#161616] group-hover:text-[#2A53A0]">{preset.label}</span>
                            <span className="text-[11px] font-mono text-gray-400 mt-1">{preset.values.join(" ")}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-5 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[12px] text-[#525252] font-semibold">Minute</Label>
                      <Input 
                        value={cronMinute} 
                        onChange={(e) => setCronMinute(e.target.value)}
                        className="h-[46px] text-center font-mono text-[14px] border-gray-300 rounded-sm"
                        placeholder="0-59"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[12px] text-[#525252] font-semibold">Hour</Label>
                      <Input 
                        value={cronHour} 
                        onChange={(e) => setCronHour(e.target.value)}
                        className="h-[46px] text-center font-mono text-[14px] border-gray-300 rounded-sm"
                        placeholder="0-23"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[12px] text-[#525252] font-semibold">Day</Label>
                      <Input 
                        value={cronDay} 
                        onChange={(e) => setCronDay(e.target.value)}
                        className="h-[46px] text-center font-mono text-[14px] border-gray-300 rounded-sm"
                        placeholder="1-31"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[12px] text-[#525252] font-semibold">Month</Label>
                      <Input 
                        value={cronMonth} 
                        onChange={(e) => setCronMonth(e.target.value)}
                        className="h-[46px] text-center font-mono text-[14px] border-gray-300 rounded-sm"
                        placeholder="1-12"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[12px] text-[#525252] font-semibold">Weekday</Label>
                      <Input 
                        value={cronWeekday} 
                        onChange={(e) => setCronWeekday(e.target.value)}
                        className="h-[46px] text-center font-mono text-[14px] border-gray-300 rounded-sm"
                        placeholder="0-7"
                      />
                    </div>
                  </div>

                  <div className="bg-[#f0f9ff] border border-[#d0e2ff] p-4 rounded-[8px] flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#d0e2ff] rounded-full flex items-center justify-center flex-none">
                       <Information size={20} className="text-[#0043ce]" />
                    </div>
                    <div className="flex flex-col">
                       <p className="text-[13px] text-[#0043ce] font-bold">Computed Schedule:</p>
                       <p className="text-[13px] text-[#0043ce] opacity-90">Runs every day at 2:00 AM UTC (based on current cron string)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 border-dashed rounded-[8px] py-12 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
                  <Time size={32} className="text-gray-300" />
                  <span className="text-[14px] text-gray-500 font-medium italic">Schedule configuration is disabled</span>
                </div>
              )}

              {/* Note Box */}
              <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-[8px] p-5 flex items-start gap-4 shadow-sm">
                <WarningFilled size={20} className="text-[#FFB100] flex-none mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[13px] font-bold text-[#725100]">Schedule Policy Notice:</p>
                  <p className="text-[13px] text-[#725100] leading-relaxed opacity-90 font-medium">
                    Batch processing will execute the field mapping transformations for this region based on the configured schedule. Ensure transformations are optimized for large datasets.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Full Width Buttons strictly matching Add/Edit Field Model */}
          <div className="flex-none flex items-stretch h-[64px] bg-[#f4f4f4] border-t border-gray-200 gap-0">
            <button 
                type="button"
                className="w-1/2 bg-[#F4F4F4] hover:bg-[#e8e8e8] text-[#2A53A0] text-[14px] font-medium transition-colors"
                onClick={() => setIsBatchProcessingDialogOpen(false)}
            >
                Cancel
            </button>
            <button 
                type="button"
                onClick={() => {
                  setIsBatchProcessingDialogOpen(false);
                  toast.success("Batch configuration saved successfully");
                }}
                className="w-1/2 bg-[#2A53A0] hover:bg-[#1e3c75] text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Checkmark size={18} /> Save Configuration
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* SUBMIT CONFIRMATION DIALOG */}
      <Dialog open={isSubmitConfirmationOpen} onOpenChange={setIsSubmitConfirmationOpen}>
        <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] p-0 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[110] [&>button]:hidden">
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
                className="w-1/2 bg-[#198038] hover:bg-[#156b2f] text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Checkmark size={18} /> Confirm and Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* SUCCESS DIALOG */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] p-0 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[120] [&>button]:hidden">
          <div className="p-10 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-[#198038]/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
               <Checkmark size={48} className="text-[#198038]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-[24px] font-bold text-[#161616]">Changes Submitted!</h2>
              <p className="text-[15px] text-gray-500 leading-relaxed max-w-[320px] mx-auto">
                Your mapping configuration has been sent to the <span className="font-bold text-[#161616]">Pending Verification</span> queue for approval.
              </p>
            </div>

            <Button 
                onClick={() => {
                   if (onNavigate) onNavigate("pending-verification-main");
                   setIsSuccessDialogOpen(false);
                }}
                className="w-full h-[54px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white rounded-[8px] text-[16px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all hover:scale-[1.02]"
            >
                Go to Verification Queue <ArrowRight size={20} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
