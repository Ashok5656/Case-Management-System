import React, { useState, useMemo } from "react";
import { 
  Information,
  Checkmark,
  CheckmarkFilled,
  Table,
  Search,
  Filter,
  Close,
  ChevronDown,
  Calendar,
  StringText,
  Hashtag,
  View,
  Building,
  UserAvatar,
  Document,
  Time,
  Flash,
  Portfolio,
  Earth,
  Launch,
  ChartBar
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import PageHeader from "./page-header";

interface CreateViewPageProps {
  onBack: () => void;
  breadcrumbs: any[];
  onBreadcrumbNavigate: (path: string) => void;
  title?: string;
  initialData?: any;
  onCreate?: (data: any) => void;
  onSaveDraft?: (data: any) => void;
  readOnly?: boolean;
}

// Column with types
interface ColumnDef {
  name: string;
  type: "Number" | "Text" | "Date" | "enum" | "text" | "number" | "date";
}

const TABLE_COLUMNS: Record<string, ColumnDef[]> = {
  "Whitelist Global": [
    { name: "Entity_Type", type: "enum" },
    { name: "Entity_Value", type: "text" },
    { name: "Created_By", type: "text" },
    { name: "Expiry_Date", type: "date" },
    { name: "Reason", type: "text" },
    { name: "Status", type: "enum" },
    { name: "Created_At", type: "date" },
    { name: "Updated_At", type: "date" }
  ],
  "Blacklist Global": [
    { name: "Entity_Type", type: "enum" },
    { name: "Entity_Value", type: "text" },
    { name: "Risk_Level", type: "number" },
    { name: "Created_By", type: "text" },
    { name: "Expiry_Date", type: "date" },
    { name: "Status", type: "enum" },
    { name: "Reason", type: "text" },
    { name: "Source_List", type: "text" }
  ],
  "Whitelist Scenario-wise": [
    { name: "Entity_Type", type: "enum" },
    { name: "Entity_Value", type: "text" },
    { name: "Scenarios", type: "text" },
    { name: "Scenario_Group", type: "text" },
    { name: "Status", type: "enum" },
    { name: "Created_At", type: "date" },
    { name: "Updated_At", type: "date" },
    { name: "Created_By", type: "text" },
    { name: "Expiry_Date", type: "date" },
    { name: "Reason", type: "text" },
    { name: "Source_System", type: "text" }
  ],
  "Blacklist Scenario-wise": [
    { name: "Entity_Type", type: "enum" },
    { name: "Entity_Value", type: "text" },
    { name: "Scenarios", type: "text" },
    { name: "Violation_Count", type: "number" },
    { name: "Last_Seen", type: "date" },
    { name: "Risk_Reason", type: "text" },
    { name: "Source_List", type: "text" },
    { name: "Confidence_Score", type: "number" },
    { name: "Matched_Keywords", type: "text" },
    { name: "Investigation_Status", type: "enum" },
    { name: "Internal_Notes", type: "text" }
  ],
  "Transactions": [
    { name: "TXN_ID", type: "Number" },
    { name: "AMOUNT", type: "Number" },
    { name: "CURRENCY", type: "Text" },
    { name: "SENDER_ID", type: "Number" },
    { name: "RECEIVER_ID", type: "Number" },
    { name: "CHANNEL", type: "Text" },
    { name: "TIMESTAMP", type: "Date" },
    { name: "STATUS", type: "Text" },
    { name: "MCC", type: "Text" }
  ],
  "Customers": [
    { name: "CUST_ID", type: "Number" },
    { name: "FULL_NAME", type: "Text" },
    { name: "EMAIL", type: "Text" },
    { name: "PHONE", type: "Text" },
    { name: "KYC_STATUS", type: "Text" },
    { name: "COUNTRY", type: "Text" },
    { name: "SEGMENT", type: "Text" },
    { name: "CREATED_ON", type: "Date" }
  ],
  "Accounts": [
    { name: "ACC_NO", type: "Text" },
    { name: "CUST_ID", type: "Number" },
    { name: "TYPE", type: "Text" },
    { name: "BALANCE", type: "Number" },
    { name: "CURRENCY", type: "Text" },
    { name: "BRANCH_CODE", type: "Text" },
    { name: "OPENED_DATE", type: "Date" }
  ],
  "Merchants": [
    { name: "MID", type: "Text" },
    { name: "BUSINESS_NAME", type: "Text" },
    { name: "CATEGORY", type: "Text" },
    { name: "CITY", type: "Text" },
    { name: "COUNTRY", type: "Text" },
    { name: "SETTLEMENT_ACC", type: "Text" },
    { name: "ONBOARDING_DATE", type: "Date" }
  ]
};

const PII_LEVELS = [
  { value: "None", label: "Non-PII", color: "bg-[#F4F4F4] text-[#525252]" },
  { value: "PII", label: "PII", color: "bg-[#EDF5FF] text-[#0043CE]" },
  { value: "Sensitive", label: "Sensitive", color: "bg-[#FFF1F1] text-[#DA1E28]" },
];

export function CreateViewPage({ 
  onBack, 
  breadcrumbs, 
  onBreadcrumbNavigate,
  title = "Create Custom View",
  initialData,
  onCreate,
  onSaveDraft,
  readOnly = false
}: CreateViewPageProps) {
  const [viewName, setViewName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [sourceTable, setSourceTable] = useState<string>(initialData?.sourceTable || "");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
    if (initialData?.selectedColumns && initialData.selectedColumns.length > 0) {
      return initialData.selectedColumns;
    }
    // Fallback: if sourceTable is known but no columns selected, pick first 6
    if (initialData?.sourceTable && TABLE_COLUMNS[initialData.sourceTable]) {
      return TABLE_COLUMNS[initialData.sourceTable].slice(0, 6).map(c => c.name);
    }
    return [];
  });
  const [piiMapping, setPiiMapping] = useState<Record<string, string>>(initialData?.piiMapping || {});
  
  // Success states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);

  const handleCancel = () => {
    if (onBack) onBack();
  };

  const handleSubmit = () => {
    setShowSuccessModal(true);
  };

  const handleSaveDraft = () => {
    setShowDraftModal(true);
  };

  const handleFinalSubmit = () => {
    setShowSuccessModal(false);
    if (!viewName || !sourceTable) return;
    
    if (onCreate) {
      onCreate({
        id: initialData?.id,
        name: viewName,
        viewName: viewName,
        description,
        sourceTable,
        selectedColumns,
        piiMapping,
        status: "Pending Approval", // Ensure status is set for verification
        artifactType: "view",
        conditions: selectedColumns.length > 0 ? `SELECT ${selectedColumns.slice(0, 2).join(", ")}...` : "None"
      });
    } else {
      onBack();
    }
  };

  const handleFinalSaveDraft = () => {
    setShowDraftModal(false);
    if (!viewName) return;

    if (onSaveDraft) {
      onSaveDraft({
        id: initialData?.id,
        name: viewName,
        viewName: viewName,
        description,
        sourceTable,
        selectedColumns,
        piiMapping,
        status: "Draft",
        artifactType: "view",
        conditions: selectedColumns.length > 0 ? `SELECT ${selectedColumns.slice(0, 2).join(", ")}...` : "None"
      });
    } else {
      onBack();
    }
  };

  const currentColumns = useMemo(() => {
    return sourceTable ? TABLE_COLUMNS[sourceTable] || [] : [];
  }, [sourceTable]);

  const displayedColumns = useMemo(() => {
    if (readOnly) {
      return currentColumns.filter(col => selectedColumns.includes(col.name));
    }
    return currentColumns;
  }, [currentColumns, readOnly, selectedColumns]);

  const toggleColumn = (colName: string) => {
    if (readOnly) return;
    setSelectedColumns(prev => 
      prev.includes(colName) ? prev.filter(c => c !== colName) : [...prev, colName]
    );
  };

  const handleDeselectAll = () => {
    if (readOnly) return;
    setSelectedColumns([]);
  };

  const handleSelectAll = () => {
    if (readOnly) return;
    setSelectedColumns(currentColumns.map(c => c.name));
  };

  const getStatusBadge = (status: string) => {
    const baseStyles = "h-[28px] flex items-center justify-center rounded-full font-bold text-[10px] px-3 w-fit whitespace-nowrap border-0 uppercase gap-1.5";
    switch (status) {
      case "Verified": return (
        <span className={cn(baseStyles, "bg-[#DEFBE6] text-[#198038]")}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#198038]" />
          Verified
        </span>
      );
      case "Rejected": return (
        <span className={cn(baseStyles, "bg-[#FFF1F1] text-[#DA1E28]")}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#DA1E28]" />
          Rejected
        </span>
      );
      case "Draft": return (
        <span className={cn(baseStyles, "bg-[#F4F4F4] text-[#525252]")}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#525252]" />
          Draft
        </span>
      );
      case "Pending Approval": return (
        <span className={cn(baseStyles, "bg-[#FFF9E5] text-[#B28600]")}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#B28600]" />
          Pending
        </span>
      );
      default: return <span className={cn(baseStyles, "bg-gray-100 text-gray-700")}>{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden relative font-['Inter']">
      {/* Top Navigation */}
      <div className="flex-none">
        <PageHeader 
          title={readOnly ? `View Details: ${viewName}` : (initialData?.id ? `Edit View: ${viewName}` : title)}
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        {readOnly && (
          <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center h-[52px] overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 whitespace-nowrap pr-4 border-r border-gray-200 h-4 self-center flex-none">
              <span className="text-[12px] font-bold text-[#525252] tracking-wider uppercase">View ID:</span>
              <span className="text-[13px] font-semibold text-[#161616]">{initialData?.id || "V-NEW"}</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
              <span className="text-[12px] font-bold text-[#525252] tracking-wider uppercase">Type:</span>
              <Badge className="bg-[#f4f4f4] text-[#161616] border-0 px-3 h-[28px] text-[11px] font-medium rounded-md flex items-center gap-1.5">
                <View size={14} className="text-[#2A53A0]" />
                {initialData?.viewType || "Custom"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
              <span className="text-[12px] font-bold text-[#525252] tracking-wider uppercase">Source Table:</span>
              <div className="flex items-center gap-1.5">
                <Table size={14} className="text-[#2A53A0]" />
                <span className="text-[13px] font-semibold text-[#161616]">{sourceTable}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap px-4 flex-none">
              <span className="text-[12px] font-bold text-[#525252] tracking-wider uppercase">Status:</span>
              <div className="flex items-center h-[28px]">
                {getStatusBadge(initialData?.status || "Draft")}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 w-full h-full">
          <div className="w-full p-4 flex flex-col gap-4 max-w-full">
            
            {readOnly ? (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg bg-gray-50/30 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-100 bg-white">
                    <h3 className="text-[12px] font-bold text-[#2A53A0] uppercase tracking-wider">View Configuration</h3>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
                      {[
                        { label: "View Name", value: viewName, icon: Document },
                        { label: "Source Table", value: sourceTable, icon: Table },
                        { label: "Created By", value: initialData?.createdBy || "Current User", icon: UserAvatar },
                        { label: "Created Date", value: initialData?.createdOn || "2024-02-12", icon: Calendar },
                        { label: "Scenario Count", value: initialData?.scenarioCount?.toString() || "0", icon: ChartBar },
                        { label: "Last Modified", value: "2024-02-12 14:30", icon: Time },
                      ].map((field, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between min-h-[36px] border-b border-gray-50 group hover:bg-gray-50/50 transition-colors px-1"
                        >
                          <span className="text-[12px] text-gray-500 font-medium shrink-0">{field.label}</span>
                          <div className="flex items-center gap-2 min-w-0 ml-4">
                            {field.icon && <field.icon size={13} className="text-[#2A53A0] opacity-40 shrink-0" />}
                            <div className="text-[13px] text-[#161616] font-semibold truncate text-right">
                              {field.value || <span className="text-gray-300 font-normal italic">null</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg bg-gray-50/30 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-100 bg-white">
                    <h3 className="text-[12px] font-bold text-[#2A53A0] uppercase tracking-wider">Logic & Governance</h3>
                  </div>
                  <div className="p-4 bg-white space-y-4">
                    <div className="flex items-start gap-3">
                      <Flash size={16} className="text-[#2A53A0] mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <span className="text-[12px] text-gray-500 font-medium uppercase tracking-tighter">View Conditions</span>
                        <p className="text-[13px] text-[#161616] font-mono bg-gray-50 p-3 rounded border border-gray-100 w-full">
                          {initialData?.conditions || "SELECT * FROM " + sourceTable}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pt-2">
                      <Information size={16} className="text-[#2A53A0] mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <span className="text-[12px] text-gray-500 font-medium uppercase tracking-tighter">Business Description</span>
                        <p className="text-[13px] text-[#161616] font-medium leading-relaxed">
                          {description || "No business description provided for this view."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg bg-gray-50/30 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Table size={16} className="text-[#2A53A0]" />
                      <h3 className="text-[12px] font-bold text-[#2A53A0] uppercase tracking-wider">
                        Selected Columns ({selectedColumns.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium italic">Output schema configuration</span>
                  </div>
                  
                  <div className="p-6 bg-[#FBFCFD]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {displayedColumns.map((col) => {
                        const Icon = col.type === "number" || col.type === "Number" ? Hashtag : col.type === "date" || col.type === "Date" ? Calendar : StringText;
                        return (
                          <div 
                            key={col.name}
                            className="p-4 bg-white border border-[#E0E0E0] rounded-[8px] hover:border-[#2A53A0]/40 hover:shadow-sm transition-all group flex items-start gap-4 relative overflow-hidden"
                          >
                            <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#2A53A0] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-10 h-10 rounded-[6px] bg-[#F4F7FB] flex items-center justify-center shrink-0 group-hover:bg-[#E5F1FF] transition-colors">
                              <Icon size={20} className="text-[#2A53A0]" />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[14px] font-bold text-[#161616] truncate group-hover:text-[#2A53A0] transition-colors">
                                  {col.name}
                                </span>
                                {piiMapping[col.name] && piiMapping[col.name] !== "None" && (
                                  <Badge className={cn(
                                    "border-0 h-5 px-1.5 text-[9px] font-bold uppercase rounded-[4px]",
                                    PII_LEVELS.find(l => l.value === piiMapping[col.name])?.color || "bg-gray-100"
                                  )}>
                                    {piiMapping[col.name]}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-[#525252] uppercase tracking-wider bg-[#F4F4F4] px-2 py-0.5 rounded-[2px]">
                                  {col.type}
                                </span>
                                <span className="text-[11px] text-[#8D8D8D]">Field ID: {col.name.toLowerCase().replace(/\s+/g, '_')}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-gray-400 italic text-[12px]">
                  <Information size={14} />
                  <span>This view is utilized across {initialData?.scenarioCount || 'all'} active detection scenarios for data isolation.</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[16px] font-medium text-[#161616]">
                    View Name <span className="text-[#DA1E28]">*</span>
                  </label>
                  <div className="flex flex-col gap-1">
                    <Input 
                      placeholder="Enter view name" 
                      value={viewName}
                      maxLength={100}
                      onChange={(e) => setViewName(e.target.value)}
                      className="!h-[46px] border-[#E0E0E0] rounded-[8px] text-[16px] px-4 w-full placeholder:text-[#8D8D8D] bg-white focus:ring-0 focus:border-[#2A53A0]"
                    />
                    <div className="flex justify-end">
                      <span className="text-[12px] text-[#525252]">{viewName.length}/100</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[16px] font-medium text-[#161616]">
                    Description
                  </label>
                  <div className="flex flex-col gap-1">
                    <textarea 
                      placeholder="Enter description (optional)" 
                      value={description}
                      maxLength={500}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full min-h-[120px] p-4 border border-[#E0E0E0] rounded-[8px] text-[16px] outline-none resize-none placeholder:text-[#8D8D8D] bg-white focus:border-[#2A53A0]"
                    />
                    <div className="flex justify-end">
                      <span className="text-[12px] text-[#525252]">{description.length}/500</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[16px] font-medium text-[#161616]">
                    Source Table <span className="text-[#DA1E28]">*</span>
                  </label>
                  <Select 
                    value={sourceTable} 
                    onValueChange={(val) => {
                      setSourceTable(val);
                      setSelectedColumns([]);
                    }}
                  >
                    <SelectTrigger className="!h-[46px] border-[#E0E0E0] rounded-[8px] text-[16px] px-4 w-full flex items-center justify-between bg-white">
                      <SelectValue placeholder="Select source table" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#E0E0E0] shadow-lg">
                      <SelectGroup>
                        <SelectLabel className="px-4 py-2 text-[12px] font-bold text-[#525252] uppercase tracking-wider">Lookup Tables</SelectLabel>
                        <SelectItem value="Whitelist Scenario-wise">Whitelist Scenario-wise</SelectItem>
                        <SelectItem value="Blacklist Scenario-wise">Blacklist Scenario-wise</SelectItem>
                        <SelectItem value="Whitelist Global">Whitelist Global</SelectItem>
                        <SelectItem value="Blacklist Global">Blacklist Global</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="px-4 py-2 text-[12px] font-bold text-[#525252] uppercase tracking-wider">Core Tables</SelectLabel>
                        <SelectItem value="Transactions">Transactions</SelectItem>
                        <SelectItem value="Customers">Customers</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Table size={20} className="text-[#2A53A0]" />
                    <h3 className="text-[18px] font-semibold text-[#161616]">Select Columns</h3>
                  </div>
                  
                  <div className="border border-[#E0E0E0] rounded-[8px] bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-4 border-b border-[#E0E0E0]">
                      <div className="bg-[#edf5ff] px-3 py-1.5 rounded-[4px]">
                        <span className="text-[13px] font-semibold text-[#2A53A0]">
                          {selectedColumns.length} of {currentColumns.length} columns selected
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={handleSelectAll}
                          className="text-[14px] font-medium text-[#2A53A0] hover:underline"
                        >
                          Select All
                        </button>
                        <div className="w-[1px] h-3 bg-[#E0E0E0]"></div>
                        <button 
                          onClick={handleDeselectAll}
                          className="text-[14px] font-medium text-[#2A53A0] hover:underline"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col overflow-y-auto">
                      {!sourceTable ? (
                        <div className="p-12 text-center bg-white">
                          <p className="text-[16px] text-[#8D8D8D] font-medium">Select a source table first to configure columns</p>
                        </div>
                      ) : (
                        <div className="flex flex-col max-h-[500px] overflow-y-auto">
                          {currentColumns.map((col) => {
                            const isActive = selectedColumns.includes(col.name);
                            const currentPii = piiMapping[col.name] || "None";
                            const piiLevel = PII_LEVELS.find(l => l.value === currentPii) || PII_LEVELS[0];
                            
                            return (
                              <div 
                                key={col.name}
                                onClick={() => toggleColumn(col.name)}
                                className={cn(
                                  "flex items-center gap-4 px-4 py-2 border-b border-[#F4F4F4] last:border-0 hover:bg-[#F8F9FB] transition-colors cursor-pointer group h-[64px]"
                                )}
                              >
                                <div className={cn(
                                  "w-[20px] h-[20px] border rounded-[2px] flex items-center justify-center transition-colors shrink-0",
                                  isActive ? "bg-[#2A53A0] border-[#2A53A0]" : "bg-white border-[#C6C6C6] group-hover:border-[#8D8D8D]"
                                )}>
                                  {isActive && <Checkmark size={14} className="text-white" />}
                                </div>
                                <div className="flex items-center justify-between flex-1 min-w-0 gap-4">
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[15px] font-semibold text-[#161616] truncate">{col.name}</span>
                                    <span className="text-[11px] text-[#8D8D8D] font-normal uppercase tracking-wider">{col.type}</span>
                                  </div>
                                  
                                  {isActive && (
                                    <div 
                                      className="flex items-center gap-2"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span className="text-[11px] font-bold text-[#525252] uppercase tracking-tighter">Classification:</span>
                                      <Select 
                                        value={currentPii} 
                                        onValueChange={(val) => setPiiMapping(prev => ({ ...prev, [col.name]: val }))}
                                      >
                                        <SelectTrigger className="h-[36px] w-[130px] border-[#E0E0E0] rounded-[8px] bg-white text-[12px] font-medium">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {PII_LEVELS.map(level => (
                                            <SelectItem key={level.value} value={level.value} className="text-[12px]">
                                              <div className="flex items-center gap-2">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", level.value === "None" ? "bg-gray-400" : level.value === "PII" ? "bg-blue-500" : "bg-red-500")} />
                                                {level.label}
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {readOnly !== true && (
        <div className="flex-none bg-white border-t border-[#E0E0E0] flex items-center h-[80px] px-8 z-50">
          <div className="w-full flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="h-[48px] px-8 bg-white border-[#C6C6C6] text-[#161616] hover:bg-gray-50 rounded-[8px] font-medium text-[14px]"
            >
              Cancel
            </Button>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                className="h-[48px] px-8 bg-white border-[#C6C6C6] text-[#161616] hover:bg-gray-50 rounded-[8px] font-medium text-[14px]"
                onClick={handleSaveDraft}
                disabled={!viewName}
              >
                Save as Draft
              </Button>
              <Button 
                disabled={!viewName || !sourceTable || selectedColumns.length === 0}
                onClick={handleSubmit}
                className="h-[48px] px-10 bg-[#2A53A0] hover:bg-[#1E3C75] text-white rounded-[8px] font-bold transition-colors disabled:bg-[#C6C6C6] disabled:text-white disabled:cursor-not-allowed text-[14px]"
              >
                {initialData?.id ? "Update View" : "Create View"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[400px] overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-[#198038]">
                <CheckmarkFilled size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-[20px] font-bold text-[#161616]">Success!</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Your Custom View <strong>"{viewName}"</strong> has been created and sent for Approval.
                </p>
              </div>
              <div className="pt-2 w-full">
                <Button 
                  className="w-full h-[48px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
                  onClick={handleFinalSubmit}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDraftModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[400px] overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0043CE]">
                <Checkmark size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-[20px] font-bold text-[#161616]">Draft Saved</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Your progress for <strong>"{viewName}"</strong> has been saved to "My Work".
                </p>
              </div>
              <div className="pt-2 w-full flex flex-col gap-2">
                <Button 
                  className="w-full h-[48px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
                  onClick={handleFinalSaveDraft}
                >
                  Go to My Work
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-[48px] border-gray-300 text-gray-600 hover:bg-gray-50 font-bold rounded-[8px] text-[14px]"
                  onClick={() => setShowDraftModal(false)}
                >
                  Continue Editing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
