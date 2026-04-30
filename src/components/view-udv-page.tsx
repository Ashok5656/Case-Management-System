import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ChevronRight, 
  ArrowLeft, 
  Edit, 
  Copy, 
  TrashCan, 
  Portfolio, 
  Identification, 
  Flash, 
  Settings, 
  User, 
  Money, 
  Enterprise, 
  Document,
  Time,
  ChartLine,
  Activity,
  Information,
  DataView,
  Filter,
  Flow,
  Email,
  FlashFilled,
  Warning,
  CheckmarkFilled,
  CloseFilled,
  Locked,
  Code,
  Calendar,
  Catalog,
  Launch
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import PageHeader from "./page-header";
import { ScenariosDialog } from "./scenarios-dialog";

interface ViewUDVPageProps {
  udv: any;
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
  onEdit?: (id: string) => void;
  onClose: () => void;
}

export function ViewUDVPage({ udv, breadcrumbs, onBreadcrumbNavigate, onEdit, onClose }: ViewUDVPageProps) {
  const [isScenariosDialogOpen, setIsScenariosDialogOpen] = useState(false);
  
  if (!udv) return null;

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case "Account": return Portfolio;
      case "Card": return Identification;
      case "Transaction": return Flash;
      case "Terminal": return Settings;
      case "Beneficiary": return User;
      case "ATM": return Money;
      case "Customer": return User;
      case "Merchant": return Enterprise;
      case "System": return Settings;
      default: return Document;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active": return "bg-[#defbe6] text-[#198038] border-[#defbe6]";
      case "Inactive": return "bg-[#f4f4f4] text-[#525252] border-gray-200";
      case "Draft": return "bg-[#EAF2FF] text-[#2A53A0] border-[#EAF2FF]";
      case "Pending": return "bg-[#FFF9E5] text-[#B28600] border-[#FFF9E5]";
      default: return "bg-[#defbe6] text-[#198038] border-[#defbe6]"; // Default to Active/IPV status
    }
  };

  const EntityIcon = getEntityIcon(udv.entity);
  
  // Mocked metrics for consistency
  const metrics = [
    { label: "Usage Frequency", value: "High", icon: Activity, color: "text-[#2A53A0]", bg: "bg-blue-50" },
    { label: "Processing Latency", value: "< 2ms", icon: Time, color: "text-emerald-600", bg: "bg-emerald-50" },
    { 
      label: "Scenario Dependency", 
      value: udv.usedInScenarioCount?.toString() || "0", 
      icon: Catalog, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      onClick: () => setIsScenariosDialogOpen(true)
    },
    { label: "Data Freshness", value: "Real-time", icon: ChartLine, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  // Derive formula if not present
  const getFormula = (item: any) => {
    if (item.formula) return item.formula;
    if (item.config) {
      const method = (item.config.method || "VALUE").toUpperCase();
      const field = item.config.targetField || "amount";
      const partition = item.entity === "Card" ? "card_id" : item.entity === "Account" ? "account_id" : "customer_id";
      const period = item.config.timePeriod || "90d";
      const periodLabel = period.replace("d", " days").replace("h", " hours");
      const filters = [];
      if (item.config.channel) filters.push(`channel = '${item.config.channel}'`);
      if (item.config.type) filters.push(`type = '${item.config.type}'`);
      if (item.config.subtype) filters.push(`subtype = '${item.config.subtype}'`);
      if (item.config.amount && item.config.amount !== "ALL") filters.push(`amount ${item.config.amount.includes('>') || item.config.amount.includes('<') ? item.config.amount : `= ${item.config.amount}`}`);
      
      const filterStr = filters.length > 0 ? `\nWHERE ${filters.join('\n  AND ')}` : '';
      
      return `SELECT ${method}(${field.toLowerCase()}) \nFROM transactions \nOVER (PARTITION BY ${partition}, INTERVAL ${period})${filterStr}`;
    }
    return `SELECT ${item.name} FROM schema.events WHERE entity_id = context.id`;
  };

  const masterScenarios = [
    { title: "High Value Card Transaction - Online", description: "Detects high-value online card transactions above threshold to identify potential fraud on premium purchases" },
    { title: "Rapid Transaction Velocity Check", description: "Monitors transaction frequency and velocity patterns to catch card testing and rapid-fire fraud attempts" },
    { title: "Cross-Border Transaction Anomaly", description: "Identifies unusual cross-border transaction patterns that deviate from customer normal behavior" },
    { title: "New Merchant First Transaction", description: "Flags first-time transactions with new merchants that may indicate compromised card usage" },
    { title: "ATM Withdrawal Pattern Alert", description: "Detects abnormal ATM withdrawal patterns including rapid sequential withdrawals and unusual locations" },
    { title: "Card-Not-Present Transaction Risk", description: "Analyzes card-not-present transactions for elevated fraud risk based on multiple risk factors" },
    { title: "Account Takeover Verification", description: "Flags account activity patterns consistent with unauthorized access and potential credential theft" },
    { title: "Suspicious Batch Processing", description: "Monitors for automated batch processing attempts that bypass standard security throttles" }
  ];

  // Logic to show scenarios based on udv.usedInScenarioCount
  // We'll show up to the actual count, using the master list as a pool.
  const scenarioCount = udv.usedInScenarioCount || 0;
  
  // Logic for Type Badge
  const isIPV = udv.category === "default";
  const typeLabel = isIPV ? "IPV" : "UDV";
  const typeIcon = isIPV ? <Locked size={12} /> : <User size={12} />;
  const typeColorClass = isIPV ? "bg-[#defbe6] text-[#198038]" : "bg-[#F6F2FF] text-[#8a3ffc]";
  const typeDescription = isIPV 
    ? "This Internal Processing Variable (IPV) is utilized to track real-time behavioral shifts in transaction patterns. It serves as a primary input for multiple risk-based detection scenarios."
    : "This User Defined Variable (UDV) is a custom attribute created for specific business logic or localized risk assessment patterns.";
  const logicTitle = isIPV ? "Internal Processing Logic" : "User Defined Logic";

  // If count is greater than our master list, we cycle or just show the master list.
  // For UI purposes, we'll show at most 10 items in the detail view to prevent excessive scroll,
  // but we'll label the section with the full count.
  const displayLimit = 10;
  const scenariosToRender = [];
  for (let i = 0; i < Math.min(scenarioCount, displayLimit); i++) {
    scenariosToRender.push(masterScenarios[i % masterScenarios.length]);
  }

  return (
    <div className="flex flex-col h-full bg-white font-['Inter'] overflow-hidden">
      {/* Sticky Header Region */}
      <div className="flex-none bg-white z-20 border-b border-gray-200">
        <PageHeader 
          title="Variable Details"
          breadcrumbs={breadcrumbs}
          onBack={() => {
            const category = udv?.category || "default";
            const targetPath = category === "custom" ? "udv-custom" : category === "draft" ? "udv-draft" : "udv";
            onBreadcrumbNavigate(targetPath);
          }}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        {/* Unified Metadata Bar - Updated to match EventDetailsPage style */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center h-[52px] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 whitespace-nowrap pr-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-normal text-[#525252]">Variable Details:</span>
            <span className="text-[13px] font-semibold text-[#161616]">{udv.name}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-normal text-[#525252]">Type:</span>
            <Badge className={cn("border-0 px-2.5 h-[28px] flex items-center gap-1.5 font-medium text-[11px] rounded-md", typeColorClass)}>
              {typeIcon} {typeLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-normal text-[#525252]">Entity:</span>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#161616]">
              <EntityIcon size={14} className="text-[#2A53A0]" />
              {udv.entity}
            </div>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-normal text-[#525252]">Data Type:</span>
            <Badge className="bg-[#f4f4f4] text-[#161616] border-0 px-3 h-[28px] text-[11px] font-medium rounded-md flex items-center">
              {udv.type}
            </Badge>
          </div>
          {udv.config?.method && (
            <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
              <span className="text-[12px] font-normal text-[#525252]">Method:</span>
              <Badge className="bg-[#EAF2FF] text-[#2A53A0] border-0 px-3 h-[28px] text-[11px] font-medium rounded-md flex items-center">
                {udv.config.method}
              </Badge>
            </div>
          )}
          <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-normal text-[#525252]">Status:</span>
            <Badge className={cn("rounded-full px-3 h-[28px] text-[11px] font-medium border-0 flex items-center", getStatusStyles(udv.status || "Active"))}>
              <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", 
                (udv.status === "Active" || !udv.status) ? "bg-[#198038]" : 
                udv.status === "Pending" ? "bg-[#B28600]" : 
                udv.status === "Draft" ? "bg-[#2A53A0]" : "bg-gray-400"
              )} />
              {udv.status || "Active"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 min-w-0 flex-1 pl-4">
            <span className="text-[12px] font-normal text-[#525252] whitespace-nowrap">Description:</span>
            <span className="text-[13px] text-[#161616] truncate font-normal" title={udv.description || typeDescription}>
              {udv.description || typeDescription}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 hover-scroll">
        <div className="flex flex-col gap-4">
          
          {/* Key Metrics Section */}
          <div className="grid grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <div 
                key={i} 
                className={cn(
                  "bg-white p-4 rounded-[12px] border border-gray-200 shadow-sm transition-all hover:shadow-md h-[120px] flex flex-col justify-between",
                  m.onClick && "cursor-pointer active:scale-[0.98] hover:border-[#2A53A0]/30"
                )}
                onClick={m.onClick}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</span>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", m.bg, m.color)}>
                    <m.icon size={18} />
                  </div>
                </div>
                <div className="text-[26px] font-bold text-[#161616] tabular-nums leading-none mb-1">{m.value}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {/* Variable Specification Section - Unified Pattern */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                 <div className="p-2 rounded-md bg-purple-50 text-purple-600">
                  <Information size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#161616]">Variable Specification</h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">Functional details and business documentation</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50/50 p-6 rounded-[12px] border border-gray-100">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Business Description</h4>
                  <p className="text-[14px] text-[#525252] leading-relaxed">
                    {udv.description || typeDescription}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Created On</span>
                    <div className="flex items-center gap-2 text-[14px] font-bold text-[#161616]">
                      <Calendar size={14} className="text-[#2A53A0]" />
                      {udv.createdDate || "June 15, 2023"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Created By</span>
                    <div className="flex items-center gap-2 text-[14px] font-bold text-[#161616]">
                      <User size={14} className="text-[#2A53A0]" />
                      {udv.createdBy || "Core-Engine"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update Frequency</span>
                    <div className="flex items-center gap-2 text-[14px] font-bold text-[#161616]">
                      <Time size={14} className="text-[#2A53A0]" />
                      Event-Driven (Sync)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logic Section */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                 <div className="p-2 rounded-md bg-blue-50 text-[#2A53A0]">
                  <Code size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#161616]">{logicTitle}</h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">Computational formula for real-time attribute extraction</p>
                </div>
              </div>
              <div className="p-6 bg-white">
                <div className="bg-[#1e1e1e] border border-gray-800 p-8 rounded-[12px] relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-gray-600 select-none tracking-widest bg-black/20 rounded-bl-lg">SQL EXPRESSION</div>
                  <div className="text-[14px] font-mono leading-relaxed tabular-nums overflow-x-auto no-scrollbar">
                    <div className="flex gap-6">
                      <span className="text-gray-600 w-6 text-right select-none">1</span>
                      <p className="text-white whitespace-pre">{getFormula(udv)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configured Parameters Section - Matching Image Fidelity */}
            {udv.config && (
              <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                   <div className="p-2 rounded-md bg-emerald-50 text-emerald-600">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#161616]">Method Parameters</h3>
                    <p className="text-[12px] text-gray-400 mt-0.5">Configured input values for {udv.config.method || "computation"}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    {Object.entries(udv.config).filter(([key]) => key !== 'method').map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-[12px] font-bold text-[#161616] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <span className="text-[#DA1E28]">*</span>
                          <Badge className="bg-gray-100 text-gray-500 border-0 text-[10px] px-2 py-0 h-4 font-mono uppercase">STRING</Badge>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-[8px] h-[46px] flex items-center px-4 text-[14px] font-medium text-[#161616]">
                          {value || "ALL"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Scenarios Mapped Section - Dynamically reflecting the real count */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-amber-50 text-amber-600">
                      <Flow size={20} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-[#161616]">Scenarios Mapped</h3>
                      <p className="text-[12px] text-gray-400 mt-0.5">Detection logic currently utilizing this variable</p>
                    </div>
                 </div>
                 <Badge className="bg-[#EAF2FF] border border-[#2A53A0]/20 text-[11px] font-bold text-[#2A53A0] rounded-md px-3 py-1">
                    {scenarioCount} TOTAL SCENARIOS
                 </Badge>
              </div>
              <div className="p-6">
                {scenariosToRender.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {scenariosToRender.map((scenario, idx) => (
                      <div key={idx} className="p-5 border border-gray-100 rounded-[12px] hover:border-[#2A53A0]/30 hover:bg-blue-50/10 transition-all group flex justify-between items-start">
                        <div className="space-y-1.5 flex-1 pr-6">
                          <h4 className="text-[15px] font-bold text-[#2A53A0] group-hover:underline cursor-pointer">
                            {scenario.title}
                          </h4>
                          <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                            {scenario.description}
                          </p>
                        </div>
                        <button className="text-gray-300 group-hover:text-[#2A53A0] transition-colors p-2 flex-none">
                          <Launch size={20} />
                        </button>
                      </div>
                    ))}
                    {scenarioCount > displayLimit && (
                      <div className="col-span-2 pt-4 text-center">
                        <Button variant="ghost" className="text-[#2A53A0] text-[13px] font-bold hover:bg-blue-50">
                          View {scenarioCount - displayLimit} More Scenarios <ChevronRight size={16} className="ml-1 shrink-0" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-[16px] bg-gray-50/30">
                     <p className="text-[14px] text-gray-400 font-medium">No active scenarios mapped to this processing variable</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScenariosDialog 
        isOpen={isScenariosDialogOpen}
        onOpenChange={setIsScenariosDialogOpen}
        variableName={udv.name}
        count={scenarioCount}
        scenarios={masterScenarios}
      />
    </div>
  );
}
