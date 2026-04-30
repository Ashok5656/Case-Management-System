import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageHeader from "./page-header";
import svgPaths from "../imports/svg-j8yenkawvu";
import { cn } from "./ui/utils";
import { Clari5Loader } from "./clari5-loader";
import { SuccessDialog } from "./success-dialog";
import { ChangesSummaryDialog } from "./changes-summary-dialog";

interface Rule {
  id: string;
  eventType: string;
  condition: string;
  keyFields: string[];
}

const EVENT_TYPES = ["FT_ACCOUNTXN", "FT_CARD_TXN", "NFT_LOGIN", "NFT_REGISTRATION"];

const EVENT_KEY_FIELDS: Record<string, string[]> = {
  "FT_ACCOUNTXN": ["account_id", "tran_amount", "currency", "source_system"],
  "FT_CARD_TXN": ["card_number", "terminal_id", "merchant_id", "cvv_status"],
  "NFT_LOGIN": ["user_id", "ip_address", "device_id", "browser_fingerprint"],
  "NFT_REGISTRATION": ["email", "phone_number", "session_id", "referral_code"],
};

// Portal component for dropdowns to avoid clipping
function PortalDropdown({ 
  triggerRef, 
  isOpen, 
  onClose, 
  children,
  width 
}: { 
  triggerRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}) {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[100]" onClick={onClose} />
      <div 
        className="fixed z-[101] bg-white border border-[#E0E0E0] rounded-[8px] shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        style={{ 
          top: coords.top + 4, 
          left: coords.left, 
          width: width || coords.width,
          maxHeight: '240px'
        }}
      >
        {children}
      </div>
    </>,
    document.body
  );
}

interface Workspace {
  id: string;
  name: string;
  keyEntity: string;
  color: string;
}

export function KeyConfigurationView({ 
  workspaces,
  approvedConfigs = {},
  breadcrumbs,
  onBreadcrumbNavigate,
  onSubmit
}: { 
  workspaces: Workspace[];
  approvedConfigs?: Record<string, any>;
  breadcrumbs?: any[];
  onBreadcrumbNavigate?: (path: string) => void;
  onSubmit?: (data: any) => void;
}) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaces[0]?.id || "");
  const [keyType, setKeyType] = useState<"default" | "conditional">("default");
  const selectedWorkspace = workspaces.find(w => w.id === selectedWorkspaceId) || workspaces[0];

  const [rules, setRules] = useState<Rule[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(["FT_ACCOUNTXN"]);
  const [isMultiselectOpen, setIsMultiselectOpen] = useState(false);
  const [openKeyFieldId, setOpenKeyFieldId] = useState<string | null>(null);
  
  // Dialog states
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Track original values for comparison
  const [originalKeyType, setOriginalKeyType] = useState<"default" | "conditional">("default");
  const [originalAttributes, setOriginalAttributes] = useState<string[]>(["FT_ACCOUNTXN"]);
  const [originalRules, setOriginalRules] = useState<Rule[]>([]);
  
  const multiselectRef = useRef<HTMLDivElement>(null);
  const ruleKeyRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const attributes = EVENT_TYPES;

  // Load approved configuration when workspace is selected
  useEffect(() => {
    if (selectedWorkspace && approvedConfigs[selectedWorkspace.name]) {
      const config = approvedConfigs[selectedWorkspace.name];
      const configKeyType = config.keyType || "default";
      
      setKeyType(configKeyType);
      setOriginalKeyType(configKeyType);
      
      if (configKeyType === "default" && config.selectedAttributes) {
        setSelectedAttributes(config.selectedAttributes);
        setOriginalAttributes(config.selectedAttributes);
      } else if (configKeyType === "conditional" && config.rules) {
        setRules(config.rules);
        setOriginalRules(config.rules);
      }
      
      setIsDirty(false);
    } else {
      // Reset to defaults if no approved config
      setKeyType("default");
      setSelectedAttributes(["FT_ACCOUNTXN"]);
      setRules([]);
      setOriginalKeyType("default");
      setOriginalAttributes(["FT_ACCOUNTXN"]);
      setOriginalRules([]);
      setIsDirty(false);
    }
  }, [selectedWorkspaceId, selectedWorkspace, approvedConfigs]);

  const toggleAttribute = (attr: string) => {
    setSelectedAttributes(prev => 
      prev.includes(attr) ? prev.filter(a => a !== attr) : [...prev, attr]
    );
    setIsDirty(true);
  };

  // Update rules when workspace changes
  React.useEffect(() => {
    const workspaceSpecificRules: Rule[] = selectedWorkspaceId === "ws-2" ? [
      { id: "r1", eventType: "FT_CARD_TXN", condition: "amount > 1000", keyFields: ["terminal_id"] },
      { id: "r2", eventType: "NFT_LOGIN", condition: "true", keyFields: ["user_id", "ip_address"] }
    ] : [
      { id: "1", eventType: "FT_ACCOUNTXN", condition: "source == \"IB\"", keyFields: ["account_id"] },
      { id: "2", eventType: "FT_CARD_TXN", condition: "channel == \"ATM\"", keyFields: ["card_number", "terminal_id"] }
    ];
    
    setRules(workspaceSpecificRules);
    setIsDirty(false);
  }, [selectedWorkspaceId]);

  const updateRule = (id: string, field: keyof Rule, value: any) => {
    setRules(rules.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        // If eventType changes, reset keyFields since options change
        if (field === "eventType") {
          updated.keyFields = [];
        }
        return updated;
      }
      return r;
    }));
    setIsDirty(true);
  };

  const toggleRuleKeyField = (ruleId: string, field: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    
    const newFields = rule.keyFields.includes(field) 
      ? rule.keyFields.filter(f => f !== field)
      : [...rule.keyFields, field];
    
    updateRule(ruleId, "keyFields", newFields);
  };

  const addRule = () => {
    const newId = (rules.length + 1).toString();
    setRules([...rules, { id: newId, eventType: EVENT_TYPES[0], condition: "", keyFields: [] }]);
    setIsDirty(true);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    setIsDirty(true);
  };

  const handleSubmitClick = () => {
    if (!isDirty) return;
    // Show summary dialog immediately without storing originals
    setShowSummaryDialog(true);
  };

  const handleReset = () => {
    if (!isDirty) return;
    
    // Reset to original values
    setKeyType(originalKeyType);
    setSelectedAttributes([...originalAttributes]);
    setRules([...originalRules]);
    setIsDirty(false);
  };

  const handleCancel = () => {
    // Reset to original values and mark as not dirty
    setKeyType(originalKeyType);
    setSelectedAttributes([...originalAttributes]);
    setRules([...originalRules]);
    setIsDirty(false);
  };

  const handleContinueFromSummary = () => {
    setShowSummaryDialog(false);
    setShowLoader(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setShowLoader(false);
      setShowSuccessDialog(true);
      setIsDirty(false);
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    
    // Create submission data with changes
    const submissionData = {
      workspace: selectedWorkspace,
      keyType: keyType,
      selectedAttributes: keyType === "default" ? selectedAttributes : [],
      rules: keyType === "conditional" ? rules : [],
      changes: getChangeSummary(),
      actionItems: getActionItems(),
      submittedAt: new Date().toISOString(),
      status: "Pending Approval"
    };
    
    // Call onSubmit if provided (to add to pending verification)
    if (onSubmit) {
      onSubmit(submissionData);
    }
    
    // Navigate to pending verification page
    if (onBreadcrumbNavigate) {
      onBreadcrumbNavigate('pending-verification-main:workspace');
    }
  };

  // Generate change summary
  const getChangeSummary = () => {
    const changes: string[] = [];
    
    if (keyType !== originalKeyType) {
      changes.push(`Configuration mode changed from "${originalKeyType === "default" ? "Default Key" : "Conditional Key"}" to "${keyType === "default" ? "Default Key" : "Conditional Key"}"`);
    }
    
    if (keyType === "default") {
      const addedAttrs = selectedAttributes.filter(a => !originalAttributes.includes(a));
      const removedAttrs = originalAttributes.filter(a => !selectedAttributes.includes(a));
      
      if (addedAttrs.length > 0) {
        changes.push(`Added attributes: ${addedAttrs.join(", ")}`);
      }
      if (removedAttrs.length > 0) {
        changes.push(`Removed attributes: ${removedAttrs.join(", ")}`);
      }
    } else {
      const addedRules = rules.filter(r => !originalRules.find(or => or.id === r.id));
      const removedRules = originalRules.filter(or => !rules.find(r => r.id === or.id));
      const modifiedRules = rules.filter(r => {
        const original = originalRules.find(or => or.id === r.id);
        if (!original) return false;
        return original.eventType !== r.eventType || 
               original.condition !== r.condition || 
               JSON.stringify(original.keyFields) !== JSON.stringify(r.keyFields);
      });
      
      if (addedRules.length > 0) {
        changes.push(`Added ${addedRules.length} new conditional rule(s)`);
      }
      if (removedRules.length > 0) {
        changes.push(`Removed ${removedRules.length} conditional rule(s)`);
      }
      if (modifiedRules.length > 0) {
        changes.push(`Modified ${modifiedRules.length} conditional rule(s)`);
      }
    }
    
    return changes.length > 0 ? changes : ["Configuration updated"];
  };

  // Generate detailed action items for summary dialog
  interface ActionItem {
    icon: "settings" | "edit" | "add" | "delete";
    title: string;
    description: string;
    tag: string;
    iconBgColor: string;
    iconColor: string;
  }

  const getActionItems = (): ActionItem[] => {
    const actions: ActionItem[] = [];
    
    if (keyType === "default") {
      const addedAttrs = selectedAttributes.filter(a => !originalAttributes.includes(a));
      const removedAttrs = originalAttributes.filter(a => !selectedAttributes.includes(a));
      
      if (addedAttrs.length > 0) {
        actions.push({
          icon: "add",
          title: `Added Attributes (${addedAttrs.length})`,
          description: addedAttrs.join(", "),
          tag: "ADD",
          iconBgColor: "#EFF6FF",
          iconColor: "#155DFC"
        });
      }
      
      if (removedAttrs.length > 0) {
        actions.push({
          icon: "delete",
          title: `Removed Attributes (${removedAttrs.length})`,
          description: removedAttrs.join(", "),
          tag: "REMOVE",
          iconBgColor: "#FEF2F2",
          iconColor: "#EF4444"
        });
      }

      if (keyType !== originalKeyType) {
        actions.push({
          icon: "settings",
          title: "Configuration Mode Changed",
          description: "Switched from Conditional Key to Default Key",
          tag: "CONFIG",
          iconBgColor: "#F9FAFB",
          iconColor: "#4A5565"
        });
      }
    } else {
      // Conditional Key changes
      const addedRules = rules.filter(r => !originalRules.find(or => or.id === r.id));
      const removedRules = originalRules.filter(or => !rules.find(r => r.id === or.id));
      const modifiedRules = rules.filter(r => {
        const original = originalRules.find(or => or.id === r.id);
        if (!original) return false;
        return original.eventType !== r.eventType || 
               original.condition !== r.condition || 
               JSON.stringify(original.keyFields) !== JSON.stringify(r.keyFields);
      });
      
      addedRules.forEach((rule) => {
        actions.push({
          icon: "add",
          title: rule.eventType,
          description: `New rule with condition: ${rule.condition || "N/A"}`,
          tag: "ADD",
          iconBgColor: "#EFF6FF",
          iconColor: "#155DFC"
        });
      });
      
      modifiedRules.forEach((rule) => {
        actions.push({
          icon: "edit",
          title: rule.eventType,
          description: `Rule properties updated`,
          tag: "EDIT",
          iconBgColor: "#EFF6FF",
          iconColor: "#155DFC"
        });
      });
      
      removedRules.forEach((rule) => {
        actions.push({
          icon: "delete",
          title: rule.eventType,
          description: `Rule removed from configuration`,
          tag: "REMOVE",
          iconBgColor: "#FEF2F2",
          iconColor: "#EF4444"
        });
      });

      if (keyType !== originalKeyType) {
        actions.push({
          icon: "settings",
          title: "Configuration Mode Changed",
          description: "Switched from Default Key to Conditional Key",
          tag: "CONFIG",
          iconBgColor: "#F9FAFB",
          iconColor: "#4A5565"
        });
      }
    }
    
    return actions.length > 0 ? actions : [{
      icon: "settings",
      title: "Configuration Updated",
      description: "Key configuration has been modified",
      tag: "CONFIG",
      iconBgColor: "#F9FAFB",
      iconColor: "#4A5565"
    }];
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden animate-in fade-in duration-500">
      <PageHeader 
        title="Key Configuration" 
        breadcrumbs={breadcrumbs || []} 
        onBack={() => onBreadcrumbNavigate?.('system-configuration-workspace-management')}
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden bg-[#FBFBFB]">
        {/* Section 1: Workspace & Context Selection */}
        <div className="p-4 border-b border-[#E0E0E0] bg-white">
          <div className="flex items-end gap-6">
            <div className="space-y-[8px] w-96">
              <label className="text-[14px] text-[#161616] font-medium block">Select Workspace</label>
              <div className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: selectedWorkspace?.color || "#2A53A0" }} 
                  />
                </div>
                <select 
                  value={selectedWorkspaceId}
                  onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                  className="w-full h-[46px] pl-8 pr-10 bg-white border border-[#C6C6C6] rounded-[8px] text-[14px] appearance-none focus:border-[#2A53A0] outline-none cursor-pointer"
                >
                  {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#525252]">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-[8px]">
              <label className="text-[14px] text-[#161616] font-medium block">Current System Context</label>
              <div className="h-[46px] bg-[#EAF2FF] border border-[#D0E2FF] rounded-[8px] px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Information size={18} className="text-[#0043CE]" />
                  <p className="text-[14px] text-[#161616]">
                    System Default Key: <span className="font-mono font-medium">{selectedWorkspace?.keyEntity.toLowerCase() || "acct_id"}</span>
                  </p>
                </div>
                <div className="bg-[#DEFBE6] text-[#198038] text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <CheckmarkFilled size={12} />
                  Using Default
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 & 3: Main Configuration */}
        <div className="flex-1 p-4 flex flex-col overflow-hidden">
          {/* Main Column: Key Configuration Details */}
          <div className="flex-1 bg-white border border-[#E0E0E0] rounded-[8px] flex flex-col overflow-hidden shadow-sm">
            <div className="p-5 flex-1 space-y-5 overflow-y-auto no-scrollbar">
              {/* Key Type Tabs */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-[16px] text-[#161616] font-semibold">Key Configuration Mode</h3>
                  <p className="text-[12px] text-[#525252]">Choose between default system mapping or custom conditional logic</p>
                </div>
                <div className="flex bg-[#F4F4F4] p-1 rounded-[8px] h-[46px] w-fit">
                  <button 
                    onClick={() => {
                      if (keyType !== "default") {
                        setKeyType("default");
                        setIsDirty(true);
                      }
                    }}
                    className={cn(
                      "px-8 h-full text-[13px] font-medium rounded-[6px] transition-all cursor-pointer",
                      keyType === "default" 
                        ? "bg-[#2A53A0] text-white shadow-sm" 
                        : "text-[#525252] hover:bg-[#E5E5E5]"
                    )}
                  >
                    Default Key
                  </button>
                  <button 
                    onClick={() => {
                      if (keyType !== "conditional") {
                        setKeyType("conditional");
                        setIsDirty(true);
                      }
                    }}
                    className={cn(
                      "px-8 h-full text-[13px] font-medium rounded-[6px] transition-all cursor-pointer",
                      keyType === "conditional" 
                        ? "bg-[#2A53A0] text-white shadow-sm" 
                        : "text-[#525252] hover:bg-[#E5E5E5]"
                    )}
                  >
                    Conditional Key
                  </button>
                </div>
              </div>

              {/* Separator Line */}
              <div className="border-t border-[#E0E0E0] -mx-5" />

              {/* Dynamic Fields */}
              <div key={selectedWorkspaceId}>
                {keyType === "default" ? (
                  <div className="space-y-6">
                    <div className="space-y-[10px] relative">
                      <label className="text-[14px] text-[#161616] font-medium block">
                        Included Key Attributes (Multiselect)
                      </label>
                      <div 
                        ref={multiselectRef}
                        onClick={() => setIsMultiselectOpen(!isMultiselectOpen)}
                        className="w-full min-h-[46px] px-3 py-2 bg-white border border-[#C6C6C6] rounded-[8px] flex flex-wrap gap-2 items-center cursor-pointer focus-within:border-[#2A53A0] outline-none transition-colors"
                      >
                        {selectedAttributes.length === 0 ? (
                          <span className="text-[14px] text-[#A8A8A8]">Select one or more attributes...</span>
                        ) : (
                          selectedAttributes.map(attr => (
                            <div 
                              key={attr} 
                              className="bg-[#EAF2FF] text-[#0043CE] px-2 py-0.5 rounded-[4px] text-[12px] font-medium flex items-center gap-1.5 group"
                            >
                              {attr}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleAttribute(attr);
                                }}
                                className="hover:text-[#DA1E28] transition-colors"
                              >
                                <Close size={12} />
                              </button>
                            </div>
                          ))
                        )}
                        <div className="ml-auto pointer-events-none text-[#525252]">
                          <ChevronDown size={16} className={cn("transition-transform duration-200", isMultiselectOpen && "rotate-180")} />
                        </div>
                      </div>

                      <PortalDropdown
                        triggerRef={multiselectRef}
                        isOpen={isMultiselectOpen}
                        onClose={() => setIsMultiselectOpen(false)}
                      >
                        <div className="max-h-[240px] overflow-y-auto no-scrollbar py-1">
                          {attributes.map(attr => (
                            <div 
                              key={attr}
                              onClick={() => {
                                toggleAttribute(attr);
                              }}
                              className="px-4 py-2 text-[14px] text-[#161616] hover:bg-[#F4F4F4] cursor-pointer flex items-center justify-between"
                            >
                              {attr}
                              {selectedAttributes.includes(attr) && (
                                <CheckmarkFilled size={16} className="text-[#2A53A0]" />
                              )}
                            </div>
                          ))}
                        </div>
                      </PortalDropdown>

                      <p className="text-[12px] text-[#8D8D8D] !mt-1.5">
                        These attributes will be appended to the resolution key string
                      </p>
                    </div>

                    <div className="space-y-[10px]">
                      <label className="text-[14px] text-[#161616] font-medium block">
                        Primary Key Field(s) <span className="text-[#DA1E28]">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={selectedWorkspace?.keyEntity.toLowerCase() || "acct_id"}
                        readOnly
                        className="w-full h-[46px] px-4 bg-[#F4F4F4] border border-[#C6C6C6] rounded-[8px] text-[14px] font-mono text-[#525252] outline-none cursor-not-allowed"
                      />
                      <p className="text-[12px] text-[#8D8D8D] !mt-1.5">
                        System defined primary key for this workspace
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[14px] font-medium text-[#161616]">Conditional Rules</h3>
                      <Button 
                        onClick={addRule}
                        className="h-[36px] px-4 bg-white border border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 flex items-center gap-2 text-[13px] font-medium rounded-[8px]"
                      >
                        <Add size={16} />
                        Add Rule
                      </Button>
                    </div>
                    
                    <div className="border border-[#E0E0E0] rounded-[8px] overflow-hidden bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F4F4F4] border-b border-[#E0E0E0]">
                          <tr>
                            <th className="px-4 py-3 text-[12px] font-semibold text-[#525252] w-16">Priority</th>
                            <th className="px-4 py-3 text-[12px] font-semibold text-[#525252] w-1/4">Event Type</th>
                            <th className="px-4 py-3 text-[12px] font-semibold text-[#525252] w-[20%]">Condition</th>
                            <th className="px-4 py-3 text-[12px] font-semibold text-[#525252]">Key Field(s)</th>
                            <th className="px-4 py-3 text-[12px] font-semibold text-[#525252] w-16 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rules.map((rule, index) => (
                            <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50 group">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Draggable size={16} className="text-[#8D8D8D] cursor-grab" />
                                  <span className="text-[14px] text-[#525252]">{index + 1}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <div className="relative">
                                  <select 
                                    value={rule.eventType}
                                    onChange={(e) => updateRule(rule.id, "eventType", e.target.value)}
                                    className="w-full h-[36px] pl-3 pr-8 bg-white border border-[#C6C6C6] rounded-[6px] text-[13px] outline-none appearance-none cursor-pointer focus:border-[#2A53A0]"
                                  >
                                    {EVENT_TYPES.map(type => (
                                      <option key={type} value={type}>{type}</option>
                                    ))}
                                  </select>
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#525252]">
                                    <ChevronDown size={14} />
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <input 
                                  type="text" 
                                  value={rule.condition}
                                  onChange={(e) => updateRule(rule.id, "condition", e.target.value)}
                                  className="w-full h-[36px] px-3 bg-white border border-[#C6C6C6] rounded-[6px] text-[13px] font-mono outline-none focus:border-[#2A53A0]"
                                />
                              </td>
                              <td className="px-3 py-2 relative">
                                <div 
                                  ref={el => { if (el) ruleKeyRefs.current[rule.id] = el; }}
                                  onClick={() => setOpenKeyFieldId(openKeyFieldId === rule.id ? null : rule.id)}
                                  className="w-full min-h-[36px] px-2 py-1 bg-white border border-[#C6C6C6] rounded-[6px] flex flex-wrap gap-1.5 items-center cursor-pointer focus-within:border-[#2A53A0] outline-none"
                                >
                                  {rule.keyFields.length === 0 ? (
                                    <span className="text-[12px] text-[#A8A8A8]">Select fields...</span>
                                  ) : (
                                    rule.keyFields.map(field => (
                                      <div 
                                        key={field} 
                                        className="bg-[#EAF2FF] text-[#0043CE] px-1.5 py-0.5 rounded-[3px] text-[11px] font-medium flex items-center gap-1 group"
                                      >
                                        {field}
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleRuleKeyField(rule.id, field);
                                          }}
                                          className="hover:text-[#DA1E28] transition-colors"
                                        >
                                          <Close size={10} />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                  <div className="ml-auto text-[#525252]">
                                    <ChevronDown size={14} className={cn("transition-transform duration-200", openKeyFieldId === rule.id && "rotate-180")} />
                                  </div>
                                </div>

                                <PortalDropdown
                                  triggerRef={{ current: ruleKeyRefs.current[rule.id] }}
                                  isOpen={openKeyFieldId === rule.id}
                                  onClose={() => setOpenKeyFieldId(null)}
                                >
                                  <div className="max-h-[180px] overflow-y-auto py-1 no-scrollbar">
                                    {(EVENT_KEY_FIELDS[rule.eventType] || []).map(field => (
                                      <div 
                                        key={field}
                                        onClick={() => toggleRuleKeyField(rule.id, field)}
                                        className="px-3 py-1.5 text-[12px] text-[#161616] hover:bg-[#F4F4F4] cursor-pointer flex items-center justify-between"
                                      >
                                        {field}
                                        {rule.keyFields.includes(field) && (
                                          <CheckmarkFilled size={14} className="text-[#2A53A0]" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </PortalDropdown>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button onClick={() => removeRule(rule.id)} className="w-[28px] h-[28px] flex items-center justify-center text-[#DA1E28] hover:bg-red-50 rounded-[4px]">
                                  <TrashCan size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-[#E0E0E0] bg-[#FBFBFB]">
              <Button 
                variant="ghost" 
                onClick={handleCancel}
                disabled={!isDirty}
                className={cn(
                  "h-[48px] px-8 rounded-[8px] border border-[#C6C6C6] font-normal transition-colors",
                  !isDirty 
                    ? "bg-[#F4F4F4] text-[#A8A8A8] border-[#E0E0E0] cursor-not-allowed" 
                    : "bg-white text-[#525252] hover:bg-gray-100"
                )}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReset}
                disabled={!isDirty}
                className={cn(
                  "h-[48px] px-10 rounded-[8px] font-medium border transition-all active:scale-95",
                  !isDirty 
                    ? "bg-[#F4F4F4] text-[#A8A8A8] border-[#E0E0E0] cursor-not-allowed" 
                    : "bg-white text-[#2A53A0] border-[#2A53A0] hover:bg-[#EAF2FF]"
                )}
              >
                Reset
              </Button>
              <Button 
                onClick={handleSubmitClick}
                disabled={!isDirty}
                className={cn(
                  "h-[48px] px-10 rounded-[8px] font-medium shadow-sm transition-all active:scale-95",
                  !isDirty 
                    ? "bg-[#E0E0E0] text-[#A8A8A8] cursor-not-allowed" 
                    : "bg-[#2A53A0] hover:bg-[#1A3A7A] text-white"
                )}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Dialog */}
      <AnimatePresence>
        {showSummaryDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[510px] bg-white rounded-[4px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] z-[201] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#2A53A0] h-[64px] flex items-center justify-between px-[30px] border-b border-[#F3F4F6]">
                <h2 className="text-[20px] font-normal text-white leading-[30px]">
                  Review and Submit Changes
                </h2>
                <button
                  onClick={() => setShowSummaryDialog(false)}
                  className="w-[32px] h-[32px] rounded-[4px] flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <svg className="w-[20px] h-[20px]" viewBox="0 0 10 10" fill="none">
                    <path d={svgPaths.p1d794e00} fill="white" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="pt-[24px] px-[30px] pb-0">
                {/* Info Banner */}
                <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[8px] p-[17px] mb-[16px] relative">
                  <div className="absolute left-[17px] top-[19px] w-[24px] h-[24px]">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d={svgPaths.p13cb55c0} fill="#2A53A0" />
                      <path d={svgPaths.p3b346600} fill="#2A53A0" />
                      <path d={svgPaths.pc6aaa80} fill="#2A53A0" />
                    </svg>
                  </div>
                  <div className="ml-[40px]">
                    <p className="text-[14px] font-semibold leading-[21px] text-[#2A53A0] mb-0">
                      Ready to promote changes?
                    </p>
                    <p className="text-[13px] leading-[19.5px] text-[rgba(42,83,160,0.8)] mt-0">
                      Please review the <span className="font-bold underline decoration-solid">{getActionItems().length}</span> actions below before submitting for verification.
                    </p>
                  </div>
                </div>

                {/* Performed Actions Section */}
                <div className="mb-[24px]">
                  <p className="text-[12px] font-bold leading-[18px] text-[#99A1AF] tracking-[1.2px] uppercase mb-[8px] ml-[4px]">
                    Performed Actions
                  </p>
                  
                  {/* Actions List */}
                  <div className="border border-[#F3F4F6] rounded-[8px] overflow-hidden">
                    {getActionItems().map((action, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center justify-between px-[16px] h-[72px]",
                          index !== getActionItems().length - 1 && "border-b border-[#F9FAFB]"
                        )}
                      >
                        <div className="flex items-center gap-[12px]">
                          {/* Icon */}
                          <div
                            className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: action.iconBgColor }}
                          >
                            {action.icon === "settings" && (
                              <svg className="w-[16px] h-[16px]" viewBox="0 0 16 16" fill="none">
                                <path d={svgPaths.p19fc4b80} fill={action.iconColor} />
                              </svg>
                            )}
                            {action.icon === "edit" && (
                              <svg className="w-[16px] h-[16px]" viewBox="0 0 16 16" fill="none">
                                <path d="M1 13H15V14H1V13Z" fill={action.iconColor} />
                                <path d={svgPaths.p279f5270} fill={action.iconColor} />
                              </svg>
                            )}
                            {action.icon === "add" && (
                              <svg className="w-[16px] h-[16px]" viewBox="0 0 16 16" fill="none">
                                <path d="M1 13H15V14H1V13Z" fill={action.iconColor} />
                                <path d={svgPaths.p279f5270} fill={action.iconColor} />
                              </svg>
                            )}
                            {action.icon === "delete" && (
                              <svg className="w-[16px] h-[16px]" viewBox="0 0 16 16" fill="none">
                                <path d={svgPaths.p19fc4b80} fill={action.iconColor} />
                              </svg>
                            )}
                          </div>
                          
                          {/* Text */}
                          <div className="flex-1">
                            <p className="text-[14px] font-bold leading-[21px] text-[#161616]">
                              {action.title}
                            </p>
                            <p className="text-[12px] leading-[18px] text-[#6A7282]">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Tag */}
                        <div className="bg-[#F3F4F6] h-[23px] px-[10px] rounded-[4px] flex items-center justify-center shrink-0">
                          <p className="text-[10px] font-bold leading-[15px] text-[#6A7282] tracking-[0.5px] uppercase">
                            {action.tag}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#F4F4F4] h-[64px] border-t border-[#E5E7EB] flex">
                <button
                  onClick={() => setShowSummaryDialog(false)}
                  className="w-[255px] h-full border-r border-[#E5E7EB] flex items-center justify-center text-[14px] font-medium leading-[21px] text-[#2A53A0] hover:bg-[#E5E7EB] transition-colors"
                >
                  Continue Editing
                </button>
                <button
                  onClick={handleContinueFromSummary}
                  className="flex-1 h-full bg-[#2A53A0] flex items-center justify-center gap-[8px] text-[14px] font-medium leading-[21px] text-white hover:bg-[#1A3A7A] transition-colors"
                >
                  Confirm and Submit
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none">
                    <path d={svgPaths.p63e4a00} fill="white" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Loader Dialog */}
      <AnimatePresence>
        {showLoader && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[211px] h-[100px] bg-white rounded-[8px] shadow-2xl z-[201] flex items-center justify-center gap-4"
            >
              <Clari5Loader />
              <span className="text-[16px] text-[#333] font-normal">Loading....</span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[200]"
              onClick={handleCloseSuccess}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] bg-white rounded-[16px] shadow-2xl z-[201] overflow-hidden"
            >
              <div className="flex flex-col items-center pt-[40px] pb-[32px] px-[32px]">
                {/* Primary Color Checkmark Circle */}
                <div className="relative w-[56px] h-[56px] mb-[24px]">
                  <svg className="w-full h-full" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Primary Color Circle */}
                    <circle cx="28" cy="28" r="26" stroke="#2A53A0" strokeWidth="4" fill="none" />
                    {/* Primary Color Checkmark */}
                    <path d="M16 28L24 36L40 20" stroke="#2A53A0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                
                <h3 className="text-[18px] font-semibold text-[#161616] text-center mb-[12px] leading-[1.4]">
                  Configuration Submitted
                </h3>
                
                <p className="text-[14px] text-[#525252] text-center leading-[1.6] font-normal">
                  Your key configuration changes have been submitted and are now pending approval.
                </p>
              </div>

              {/* Continue Button with Primary Color Background */}
              <button
                onClick={handleCloseSuccess}
                className="w-full h-[64px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white text-[16px] font-normal rounded-bl-[16px] rounded-br-[16px] transition-colors flex items-center justify-center"
              >
                Continue
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}