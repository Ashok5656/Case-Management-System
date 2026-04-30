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
  Calendar
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScenarioItem } from "./scenarios-data";
import { cn } from "./ui/utils";
import PageHeader from "./page-header";

interface ViewScenarioPageProps {
  scenario: ScenarioItem;
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
  onEdit: (id: string) => void;
  onBack: () => void;
}

export function ViewScenarioPage({ scenario, breadcrumbs, onBreadcrumbNavigate, onEdit, onBack }: ViewScenarioPageProps) {
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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active": return "bg-[#defbe6] text-[#198038] border-[#defbe6]";
      case "Inactive": return "bg-[#f4f4f4] text-[#525252] border-gray-200";
      case "Draft": return "bg-[#EAF2FF] text-[#2A53A0] border-[#EAF2FF]";
      case "Pending": return "bg-[#FFF9E5] text-[#B28600] border-[#FFF9E5]";
      default: return "bg-[#f4f4f4] text-[#525252] border-gray-200";
    }
  };

  const riskLabel = (weight: number) => {
    if (weight === 0) return { label: "Not Set", color: "text-gray-400 bg-gray-50 border-gray-100" };
    if (weight < 30) return { label: "Low Risk", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    if (weight < 70) return { label: "Medium Risk", color: "text-amber-600 bg-amber-50 border-amber-100" };
    return { label: "High Risk", color: "text-rose-600 bg-rose-50 border-rose-100" };
  };

  if (!scenario) return null;

  const WorkspaceIcon = getWorkspaceIcon(scenario.workspace);
  const risk = riskLabel(scenario.riskWeight);

  // Use scenario data if available, otherwise fallback to defaults
  const configDetails = {
    conditions: scenario.conditions || [
      { id: "C1", field: "TXN_AMOUNT", operator: "GREATER_THAN", value: "50,000", type: "Threshold", category: "Amount" },
      { id: "C2", field: "MERCHANT_CATEGORY", operator: "IN", value: "GAMBLING, CRYPTO", type: "Risk List", category: "Risk" },
      { id: "C3", field: "CHANNEL", operator: "EQUALS", value: "MOBILE_APP", type: "Context", category: "Context" },
    ],
    variables: scenario.queryConditions || [
      { name: "AVG_TXN_30D", source: "Customer View", value: "1,240.50" },
      { name: "GEO_LOCATION", source: "Current Event", value: "IP_ADDRESS" },
    ],
    actions: scenario.actions || [
      { id: "A1", type: "Generate Alert", priority: "High", channel: "Dashboard" },
      { id: "A2", type: "Email Notification", recipient: "Compliance Team", frequency: "Instant" },
    ]
  };

  return (
    <div className="flex flex-col h-full bg-white font-['Inter'] overflow-hidden">
      {/* Sticky Header Region */}
      <div className="flex-none bg-white z-20 border-b border-gray-200">
        <PageHeader 
          title={scenario.name}
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        {/* Unified Metadata Bar */}
        <div className="px-6 py-2.5 bg-white border-b border-gray-100 flex items-center gap-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scenario ID</span>
            <span className="text-[13px] font-bold text-[#2A53A0] font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{scenario.id}</span>
          </div>
          <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
            <Badge className={cn("rounded-full px-3 h-6 text-[10px] font-bold border-0 uppercase flex items-center", getStatusStyles(scenario.status))}>
              <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", 
                scenario.status === "Active" ? "bg-[#198038]" : 
                scenario.status === "Pending" ? "bg-[#B28600]" : 
                scenario.status === "Draft" ? "bg-[#2A53A0]" : "bg-gray-400"
              )} />
              {scenario.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Workspace</span>
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#161616]">
              <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center border border-gray-100">
                <WorkspaceIcon size={14} className="text-[#2A53A0]" />
              </div>
              {scenario.workspace}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk weight</span>
            <div className="flex items-center gap-3 flex-1 max-w-[200px]">
              <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-1000", 
                    scenario.riskWeight > 70 ? "bg-rose-500" : 
                    scenario.riskWeight > 30 ? "bg-amber-500" : "bg-emerald-500"
                  )} 
                  style={{ width: `${scenario.riskWeight}%` }} 
                />
              </div>
              <Badge className={cn("px-2 py-0 h-5 text-[10px] font-bold border", risk.color)}>
                {scenario.riskWeight}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-2 bg-white flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#2A53A0]">RK</div>
              <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">SM</div>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Information size={14} />
              <span className="text-[11px] font-medium">Revised {scenario.lastModified} by <span className="text-[#161616] font-bold">{scenario.createdBy || "Administrator"}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-[34px] px-3 border-gray-200 text-[#525252] hover:bg-gray-50 flex items-center gap-2 text-[12px] font-bold rounded-[8px]" onClick={() => {}}>
              <Copy size={14} /> <span>Duplicate</span>
            </Button>
            <Button variant="outline" className="h-[34px] px-3 border-gray-200 text-[#da1e28] hover:bg-red-50 flex items-center gap-2 text-[12px] font-bold rounded-[8px]" onClick={() => {}}>
              <TrashCan size={14} /> <span>Archive</span>
            </Button>
            <div className="w-[1px] h-6 bg-gray-200 mx-1" />
            <Button 
              className="h-[34px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white flex items-center gap-2 px-5 text-[12px] font-bold rounded-[8px] shadow-sm transition-all active:scale-95" 
              onClick={() => onEdit(scenario.id)}
            >
              <Edit size={14} /> Modify Logic
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 hover-scroll">
        <div className="flex flex-col gap-4">
          
          {/* Key Metrics Section */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-[12px] border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Alert Volume</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#2A53A0]">
                  <Activity size={18} />
                </div>
              </div>
              <div className="text-[26px] font-bold text-[#161616] tabular-nums">{scenario.hits}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+12.4%</span>
                <span className="text-[11px] text-gray-400">vs prev period</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-[12px] border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Performance Score</span>
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ChartLine size={18} />
                </div>
              </div>
              <div className="text-[26px] font-bold text-[#161616] tabular-nums">{scenario.performance}%</div>
              <div className="w-full bg-gray-50 h-1.5 rounded-full mt-3 overflow-hidden border border-gray-100">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${scenario.performance}%` }} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-[12px] border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk Grouping</span>
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Portfolio size={18} />
                </div>
              </div>
              <div className="text-[20px] font-bold text-[#161616] truncate">{scenario.group}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <Badge className="bg-purple-50 text-purple-700 text-[9px] font-bold border-0 uppercase">Internal Policy</Badge>
              </div>
            </div>

            <div className="bg-white p-4 rounded-[12px] border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Execution</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <Time size={18} />
                </div>
              </div>
              <div className="text-[20px] font-bold text-[#161616] tabular-nums">{scenario.lastModified}</div>
              <div className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Monitoring Active
              </div>
            </div>
          </div>

          {/* Main Vertical Flow - Full Width Sections */}
          <div className="space-y-4">
            
            {/* Variable Specification Section - Unified Pattern */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                 <div className="p-2 rounded-md bg-purple-50 text-purple-600">
                  <Information size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#161616]">Scenario Specification</h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">Functional details and business documentation</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50/50 p-6 rounded-[12px] border border-gray-100">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Business Description</h4>
                  <p className="text-[14px] text-[#525252] leading-relaxed">
                    {scenario.description || "This detection scenario analyzes real-time transaction streams to identify behavioral anomalies. It leverages multiple processing variables to provide high-precision risk scoring and automated response triggers."}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Modified</span>
                    <div className="flex items-center gap-2 text-[14px] font-bold text-[#161616]">
                      <Calendar size={14} className="text-[#2A53A0]" />
                      {scenario.lastModified || "June 15, 2023"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Owner</span>
                    <div className="flex items-center gap-2 text-[14px] font-bold text-[#161616]">
                      <User size={14} className="text-[#2A53A0]" />
                      {scenario.createdBy || "Core-Engine"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Strategy Cluster</span>
                    <div className="flex items-center gap-2 text-[14px] font-bold text-[#161616]">
                      <Flow size={14} className="text-[#2A53A0]" />
                      {scenario.group || "Standard Detection"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Detection Conditions - Full Width */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-50 text-[#2A53A0]">
                    <Filter size={20} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#161616]">Detection Logic Conditions</h3>
                    <p className="text-[12px] text-gray-400 mt-0.5">Define the rules that trigger this scenario</p>
                  </div>
                </div>
                <Badge className="bg-gray-50 border border-gray-200 text-[11px] font-bold text-gray-500 rounded-md px-3 py-1">
                  {configDetails.conditions.length} ACTIVE RULES
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 h-12 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      <th className="px-6 w-24">Ref ID</th>
                      <th className="px-6">Field Variable</th>
                      <th className="px-6">Operation</th>
                      <th className="px-6">Comparison Value</th>
                      <th className="px-6">Logic Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {configDetails.conditions.map((c: any, idx: number) => (
                      <tr key={idx} className="h-14 hover:bg-gray-50/30 transition-colors group">
                        <td className="px-6">
                          <span className="text-[12px] font-mono font-bold text-[#2A53A0] bg-blue-50 px-2 py-1 rounded">{c.id || `C${idx+1}`}</span>
                        </td>
                        <td className="px-6">
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-[#161616]">{c.field}</span>
                            <span className="text-[11px] text-gray-400 uppercase tracking-tighter">{c.category || 'Standard Field'}</span>
                          </div>
                        </td>
                        <td className="px-6">
                          <span className="text-[13px] font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded border border-indigo-100">{c.operator}</span>
                        </td>
                        <td className="px-6">
                          <span className="text-[14px] font-bold text-[#161616]">{c.value}</span>
                        </td>
                        <td className="px-6">
                          <Badge className="bg-gray-50 text-gray-500 border-0 text-[11px] font-bold px-3 py-1 rounded-full">{c.type || 'Comparison'}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scenario Expression Preview - Full Width */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                 <div className="p-2 rounded-md bg-purple-50 text-purple-600">
                  <Flow size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#161616]">Scenario Expression Preview</h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">Consolidated boolean logic generated by the engine</p>
                </div>
              </div>
              <div className="p-6 bg-white">
                <div className="bg-[#1e1e1e] border border-gray-800 p-8 rounded-[12px] relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-gray-600 select-none tracking-widest bg-black/20 rounded-bl-lg">COMPILED LOGIC</div>
                  <div className="text-[14px] font-mono leading-relaxed tabular-nums">
                    <div className="flex gap-6">
                      <span className="text-gray-600 w-6 text-right select-none">1</span>
                      <p><span className="text-blue-400 font-bold italic">IF</span> <span className="text-white">(</span></p>
                    </div>
                    {configDetails.conditions.map((c: any, i: number) => (
                      <div key={i} className="flex gap-6">
                        <span className="text-gray-600 w-6 text-right select-none">{i + 2}</span>
                        <p className="ml-6">
                           <span className="text-emerald-400">{c.field}</span>
                           <span className="text-white mx-3">{c.operator === 'GREATER_THAN' ? '>' : c.operator === 'EQUALS' ? '==' : c.operator}</span>
                           <span className="text-amber-300">'{c.value}'</span>
                           {i < configDetails.conditions.length - 1 && <span className="text-blue-400 font-bold ml-4">AND</span>}
                        </p>
                      </div>
                    ))}
                    <div className="flex gap-6">
                      <span className="text-gray-600 w-6 text-right select-none">{configDetails.conditions.length + 2}</span>
                      <p><span className="text-white">)</span> <span className="text-purple-400 font-bold ml-2">THEN</span></p>
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-600 w-6 text-right select-none">{configDetails.conditions.length + 3}</span>
                      <p className="ml-6"><span className="text-pink-400 font-bold">TRIGGER_ALERTS</span><span className="text-white">(</span><span className="text-gray-400 italic">...actions</span><span className="text-white">)</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Outputs & Query Dependencies - Row (50/50 or stacked?) - Stacking as requested for "Full Width" */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                 <div className="p-2 rounded-md bg-amber-50 text-amber-600">
                  <Email size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#161616]">Action Outputs</h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">Post-detection workflows and notification routines</p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-3 gap-4">
                {configDetails.actions.map((action: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 p-5 bg-gray-50 border border-gray-100 rounded-[12px] transition-all hover:border-blue-200 hover:shadow-sm group">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#2A53A0] shadow-sm group-hover:scale-110 transition-transform">
                      <CheckmarkFilled size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-bold text-[#161616]">{action.type}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                         <Badge className="bg-blue-50 text-blue-700 border-0 text-[10px] font-bold rounded-md px-2 py-0.5">{action.priority}</Badge>
                         <Badge className="bg-white border border-gray-200 text-[10px] font-bold text-gray-500 rounded-md px-2 py-0.5">{action.channel || action.recipient}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Query Dependencies - Full Width */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                 <div className="p-2 rounded-md bg-emerald-50 text-emerald-600">
                  <DataView size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#161616]">External Query Dependencies</h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">External data sources required for this scenario</p>
                </div>
              </div>
              <div className="p-6">
                {configDetails.variables.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {configDetails.variables.map((v: any, idx: number) => (
                      <div key={idx} className="flex flex-col p-5 bg-white border border-gray-100 rounded-[12px] group transition-all hover:bg-emerald-50/20 hover:border-emerald-100 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[13px] font-bold text-[#161616] font-mono bg-gray-50 px-2 py-1 rounded">{v.field || v.name}</span>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Source</span>
                            <span className="text-[12px] font-semibold text-gray-600">{v.source || v.category}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Expected</span>
                            <span className="text-[13px] font-bold text-[#2A53A0]">{v.value || 'Dynamic'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-[16px] bg-gray-50/30">
                     <p className="text-[14px] text-gray-400 font-medium">No external data queries defined for this detection cycle</p>
                  </div>
                )}
              </div>
            </div>

            {/* Strategic Governance - Full Width */}
            <div className="bg-[#fff9e5] p-6 rounded-[16px] border border-[#f1c21b]/40 flex gap-6 shadow-sm items-start">
              <div className="w-14 h-14 rounded-full bg-white border border-[#f1c21b]/50 flex items-center justify-center text-[#B28600] shrink-0 shadow-lg">
                <Warning size={28} />
              </div>
              <div className="flex-1">
                <h4 className="text-[16px] font-bold text-[#B28600] mb-1">Strategic Governance & Compliance Note</h4>
                <p className="text-[13px] text-[#856404] leading-relaxed font-medium">
                  This scenario is currently enforced in the <strong>Live Production Cluster</strong>. As per internal policy (EFRM-712), any modifications to the underlying logic will trigger an automated stress test and require a secondary audit approval before the new version becomes operational.
                </p>
                <div className="mt-4 flex items-center gap-4 text-[11px] font-bold text-[#B28600]/70 uppercase tracking-widest">
                  <span>Policy ID: P-8122-A</span>
                  <div className="w-1 h-1 rounded-full bg-[#B28600]/30" />
                  <span>Audit Frequency: Continuous</span>
                  <div className="w-1 h-1 rounded-full bg-[#B28600]/30" />
                  <span>Risk Category: Tier 1</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
