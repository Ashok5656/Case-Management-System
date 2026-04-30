import React from "react";
import { motion } from "motion/react";
import { 
  Information, 
  Locked, 
  Calendar, 
  UserAvatar, 
  Time, 
  Code, 
  Table, 
  Flash,
  Launch,
  Security
} from "@carbon/icons-react";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import PageHeader from "./page-header";
import { SECItem } from "./sec-page";
import { ScrollArea } from "./ui/scroll-area";

interface ViewSECPageProps {
  sec: SECItem;
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
  onBack: () => void;
}

export function ViewSECPage({ sec, breadcrumbs, onBreadcrumbNavigate, onBack }: ViewSECPageProps) {
  if (!sec) return null;

  const getStatusBadge = (status: string) => {
    const baseStyles = "h-[28px] flex items-center justify-center rounded-full font-bold text-[10px] px-3 w-fit whitespace-nowrap border-0 uppercase gap-1.5";
    switch (status) {
      case "Active": return (
        <span className={cn(baseStyles, "bg-[#DEFBE6] text-[#198038]")}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#198038]" />
          Active
        </span>
      );
      case "Inactive": return (
        <span className={cn(baseStyles, "bg-[#F4F4F4] text-[#525252]")}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#525252]" />
          Inactive
        </span>
      );
      default: return <span className={cn(baseStyles, "bg-gray-100 text-gray-700")}>{status}</span>;
    }
  };

  // Generate Linked Scenarios list based on the count in sec.linkedScenarios
  const scenarioPool = [
    { id: "SCN-1082", name: "High Value Transaction Pattern", status: "Verified", type: "Payment Fraud" },
    { id: "SCN-1081", name: "Velocity Check - Card", status: "Verified", type: "Velocity-Based" },
    { id: "SCN-1080", name: "New Device Geo Anomaly", status: "Verified", type: "Geographic Anomaly" },
    { id: "SCN-1078", name: "ATO Credential Burst", status: "Verified", type: "Account Takeover (ATO)" },
    { id: "SCN-2001", name: "Structuring Pattern Detection", status: "Draft", type: "Structuring" },
    { id: "SCN-2002", name: "Cross-Border Velocity Check", status: "Draft", type: "Velocity-Based" },
    { id: "SCN-2005", name: "Corporate Account Bulk Transfer", status: "Draft", type: "Internal Control" },
    { id: "SCN-2006", name: "High Risk Jurisdiction Wire", status: "Draft", type: "Money Laundering" },
    { id: "SCN-1090", name: "Rapid Onboarding Activity", status: "Pending", type: "Synthetic Identity" },
    { id: "SCN-1091", name: "Unusual ATM Cash-Out", status: "Pending", type: "Cash-Out Fraud" },
    { id: "SCN-1092", name: "Shell Company Wire Transfer", status: "Pending", type: "Money Laundering" },
    { id: "SCN-1094", name: "Multiple Micro-Deposits", status: "Pending", type: "Structuring" },
  ];

  const linkedScenarios = React.useMemo(() => {
    const count = sec.linkedScenarios || 0;
    if (count === 0) return [];
    
    // Cycle through the pool to match the required count
    const items = [];
    for (let i = 0; i < count; i++) {
      const template = scenarioPool[i % scenarioPool.length];
      items.push({
        ...template,
        // If we are cycling, give it a unique-ish ID for the i-th entry
        displayId: i >= scenarioPool.length ? `${template.id}-${Math.floor(i/scenarioPool.length)}` : template.id
      });
    }
    return items;
  }, [sec.linkedScenarios]);

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden relative font-['Inter']">
      {/* Top Navigation */}
      <div className="flex-none">
        <PageHeader 
          title={`SEC Details: ${sec.name}`}
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center h-[52px] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 whitespace-nowrap pr-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-bold text-[#525252] tracking-wider uppercase">SEC ID:</span>
            <span className="text-[13px] font-semibold text-[#161616]">{sec.id.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-bold text-[#525252] tracking-wider uppercase">Event:</span>
            <Badge className="bg-[#f4f4f4] text-[#161616] border-0 px-3 h-[28px] text-[11px] font-medium rounded-md flex items-center gap-1.5 font-mono">
              <Flash size={14} className="text-[#2A53A0]" />
              {sec.customEvent}
            </Badge>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-bold text-[#525252] tracking-wider uppercase">Type:</span>
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#161616]">
              <Security size={14} className="text-[#2A53A0]" />
              {sec.category === "ootb" ? "OOTB Control" : "Custom Control"}
            </div>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 flex-none">
            <span className="text-[12px] font-bold text-[#525252] tracking-wider uppercase">Status:</span>
            <div className="flex items-center h-[28px]">
              {getStatusBadge(sec.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 w-full h-full">
          <div className="w-full py-4 px-4 flex flex-col gap-4 max-w-full">
            
            {/* Control Configuration Card */}
            <div className="border border-gray-200 rounded-lg bg-gray-50/30 overflow-hidden shadow-sm">
              <div className="px-4 py-2 border-b border-gray-100 bg-white">
                <h3 className="text-[12px] font-bold text-[#2A53A0] uppercase tracking-wider">Control Configuration</h3>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
                  {[
                    { label: "SEC Name", value: sec.name, icon: Security },
                    { label: "Custom Event", value: sec.customEvent, icon: Flash },
                    { label: "Created By", value: sec.createdBy || "System", icon: UserAvatar },
                    { label: "Created Date", value: sec.createdDate || "2024-01-01", icon: Calendar },
                    { label: "Linked Scenarios", value: sec.linkedScenarios.toString(), icon: Table },
                    { label: "Last Modified", value: sec.lastModifiedDate, icon: Time },
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

            {/* Logic & Description Card */}
            <div className="border border-gray-200 rounded-lg bg-gray-50/30 overflow-hidden shadow-sm">
              <div className="px-4 py-2 border-b border-gray-100 bg-white">
                <h3 className="text-[12px] font-bold text-[#2A53A0] uppercase tracking-wider">Logic & Governance</h3>
              </div>
              <div className="p-4 bg-white space-y-4">
                <div className="flex items-start gap-3">
                  <Code size={16} className="text-[#2A53A0] mt-0.5 shrink-0" />
                  <div className="space-y-1 w-full">
                    <span className="text-[12px] text-gray-500 font-medium uppercase tracking-tighter">Condition Expression</span>
                    <p className="text-[13px] text-[#161616] font-mono bg-gray-50 p-4 rounded border border-gray-100 w-full whitespace-pre-wrap">
                      {sec.conditionExpression || "No logic defined."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-2 border-t border-gray-50">
                  <Information size={16} className="text-[#2A53A0] mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <span className="text-[12px] text-gray-500 font-medium uppercase tracking-tighter">Business Description</span>
                    <p className="text-[13px] text-[#161616] font-medium leading-relaxed">
                      {sec.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Linked Scenarios Card */}
            <div className="border border-gray-200 rounded-lg bg-gray-50/30 overflow-hidden shadow-sm">
              <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table size={16} className="text-[#2A53A0]" />
                  <h3 className="text-[12px] font-bold text-[#2A53A0] uppercase tracking-wider">
                    Linked Scenarios ({linkedScenarios.length})
                  </h3>
                </div>
                <span className="text-[11px] text-gray-400 font-medium italic">Active detection dependencies</span>
              </div>
              
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {linkedScenarios.map((scenario) => (
                    <div 
                      key={scenario.displayId || scenario.id}
                      className="p-4 bg-white border border-[#E0E0E0] rounded-[8px] hover:border-[#2A53A0]/40 hover:shadow-sm transition-all group flex items-start gap-4 relative overflow-hidden cursor-pointer"
                      onClick={() => onBreadcrumbNavigate(`scenarios-view-${scenario.id}`)}
                    >
                      <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#2A53A0] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-10 h-10 rounded-[6px] bg-[#F4F7FB] flex items-center justify-center shrink-0 group-hover:bg-[#E5F1FF] transition-colors">
                        <Launch size={20} className="text-[#2A53A0]" />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[14px] font-bold text-[#161616] truncate group-hover:text-[#2A53A0] transition-colors">
                          {scenario.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#525252] uppercase tracking-wider bg-[#F4F4F4] px-2 py-0.5 rounded-[2px]">
                            {scenario.id}
                          </span>
                          <span className="text-[11px] text-[#8D8D8D] truncate">{scenario.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {linkedScenarios.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-400 text-[13px] font-medium border-2 border-dashed border-gray-50 rounded-lg">
                      No scenarios currently linked to this security control.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-gray-400 italic text-[12px]">
              <Information size={14} />
              <span>This security control is enforced at the real-time processing layer for all incoming {sec.customEvent} events.</span>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
