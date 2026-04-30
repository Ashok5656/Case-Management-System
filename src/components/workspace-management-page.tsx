import React, { useState, useMemo } from "react";
import { 
  Search, 
  Activity, 
  Flow, 
  Information, 
  ArrowsVertical,
  Power,
  Add,
  Close,
  ChevronDown,
  Settings,
  CheckmarkFilled
} from "@carbon/icons-react";
import { Key as LucideKey } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { WorkspaceTableFooter } from "./workspace-table-footer";
import PageHeader from "./page-header";
import imgClari5Loader from "figma:asset/4695cc06ada82390ec617ae2b76764d7dd803fe5.png";

// SVG Paths for Success Dialog
const successIconPaths = {
  checkmark: "M28.2255 12.5397L26.7024 10.9733C26.6714 10.9401 26.6338 10.9138 26.5921 10.8959C26.5503 10.878 26.5053 10.869 26.4599 10.8694C26.4144 10.8682 26.3692 10.8768 26.3273 10.8948C26.2855 10.9127 26.248 10.9395 26.2175 10.9733L15.6598 21.609L11.8178 17.767C11.7866 17.7341 11.749 17.708 11.7073 17.6901C11.6656 17.6722 11.6207 17.663 11.5754 17.663C11.53 17.663 11.4852 17.6722 11.4435 17.6901C11.4018 17.708 11.3642 17.7341 11.3329 17.767L9.79254 19.3074C9.75963 19.3395 9.73347 19.3779 9.71561 19.4203C9.69775 19.4627 9.68855 19.5082 9.68855 19.5542C9.68855 19.6002 9.69775 19.6457 9.71561 19.6881C9.73347 19.7304 9.75963 19.7688 9.79254 19.8009L14.6389 24.6473C14.9014 24.9343 15.2633 25.1107 15.6511 25.1408C16.0311 25.1076 16.3869 24.9402 16.6547 24.6685H16.6673L28.2381 13.0332C28.2971 12.9638 28.3284 12.8751 28.3261 12.7841C28.3238 12.693 28.288 12.606 28.2255 12.5397Z",
  circle: "M18 2.42277C21.602 2.42496 25.0919 3.67589 27.875 5.96246C30.6582 8.24904 32.5626 11.4298 33.2637 14.9629C33.9648 18.496 33.4193 22.163 31.7201 25.339C30.0209 28.515 27.2731 31.0038 23.9449 32.3812C20.6167 33.7586 16.9138 33.9395 13.4671 32.8931C10.0205 31.8467 7.04318 29.6377 5.04247 26.6425C3.04176 23.6472 2.14138 20.0509 2.49471 16.4663C2.84804 12.8817 4.43323 9.53039 6.98024 6.98338C8.42406 5.53205 10.1415 4.38164 12.0331 3.59879C13.9247 2.81594 15.9528 2.41622 18 2.42277ZM18 1.54947e-07C14.4399 1.54947e-07 10.9598 1.05568 7.99974 3.03355C5.03966 5.01141 2.73255 7.82263 1.37018 11.1117C0.00779901 14.4008 -0.348661 18.02 0.345873 21.5116C1.04041 25.0033 2.75474 28.2106 5.27208 30.7279C7.78943 33.2453 10.9967 34.9596 14.4884 35.6541C17.98 36.3487 21.5992 35.9922 24.8883 34.6298C28.1774 33.2674 30.9886 30.9603 32.9665 28.0003C34.9443 25.0402 36 21.5601 36 18C36.0003 15.6361 35.5349 13.2953 34.6305 11.1113C33.726 8.92733 32.4001 6.9429 30.7286 5.27139C29.0571 3.59987 27.0727 2.27401 24.8887 1.36954C22.7047 0.465062 20.3639 -0.000310018 18 1.54947e-07Z"
};

// --- DATA TYPES ---
export interface WorkspaceItem {
  id: string;
  name: string;
  keyEntity: string;
  status: boolean;
  scenarios: number;
  color: string;
  description: string;
  scenariosList: string[];
  relatedEvents: string[];
  isNew?: boolean;
}

// --- MOCK DATA (All 11 Workspaces) ---
export const INITIAL_WORKSPACE_DATA: WorkspaceItem[] = [
  { 
    id: "ws1", 
    name: "Account", 
    keyEntity: "ACCT_ID", 
    status: true, 
    scenarios: 45, 
    color: "#0062ff",
    description: "Monitor account-level activities including balance changes, status updates, and transaction patterns across all account types.",
    scenariosList: ["Unusual account balance fluctuations", "Multiple failed login attempts", "Sudden high-value transactions"],
    relatedEvents: ["Account Created", "Balance Updated", "Status Changed", "Login Event"]
  },
  { 
    id: "ws2", 
    name: "Customer", 
    keyEntity: "CUST_ID", 
    status: true, 
    scenarios: 67, 
    color: "#198038",
    description: "Tracking customer profile changes, identity verification attempts, and overall relationship health for individual entities.",
    scenariosList: ["Address change frequency", "Identity document expiry", "Name mismatch on transfers"],
    relatedEvents: ["Profile Updated", "KYC Verified", "Document Uploaded"]
  },
  { 
    id: "ws3", 
    name: "Non-Customer", 
    keyEntity: "ENTITY_ID", 
    status: true, 
    scenarios: 12, 
    color: "#525252",
    description: "Management of entities that interact with the system without a formal account, such as one-time beneficiaries or external senders.",
    scenariosList: ["Blacklisted entity match", "High velocity from unknown source", "Sanction list hits"],
    relatedEvents: ["Entity Flagged", "External Link Created"]
  },
  { 
    id: "ws4", 
    name: "Branch", 
    keyEntity: "BRANCH_CODE", 
    status: true, 
    scenarios: 23, 
    color: "#ff832b",
    description: "Analysis of geographic performance and risk distribution across physical branch locations and regional hubs.",
    scenariosList: ["Abnormal branch cash volume", "Operating hour anomalies", "Staff override frequency"],
    relatedEvents: ["Vault Audit", "Staff Login", "Cash Reconciled"]
  },
  { 
    id: "ws5", 
    name: "User (Staff)", 
    keyEntity: "USER_ID", 
    status: true, 
    scenarios: 34, 
    color: "#6f3d3d",
    description: "Internal audit monitoring for staff activities, administrative overrides, and sensitive data access logs.",
    scenariosList: ["Unauthorized report access", "Bulk data export", "Credential sharing detection"],
    relatedEvents: ["Admin Access", "Password Reset", "Data Exported"]
  },
  { 
    id: "ws6", 
    name: "Transaction", 
    keyEntity: "TXN_ID", 
    status: true, 
    scenarios: 128, 
    color: "#005d5d",
    description: "Real-time flow analysis for all financial movements, including cross-border, internal, and ATM transactions.",
    scenariosList: ["Rapid sequence transfers", "Round-amount transactions", "Layering pattern detection"],
    relatedEvents: ["Funds Received", "Settlement Done", "Reversal Triggered"]
  },
  { 
    id: "ws7", 
    name: "Loan", 
    keyEntity: "LOAN_ID", 
    status: true, 
    scenarios: 15, 
    color: "#8a3ffc",
    description: "Monitoring loan applications, disbursement cycles, and repayment patterns for potential fraud or delinquency.",
    scenariosList: ["Income inflation detection", "Early repayment anomalies", "Multiple concurrent applications"],
    relatedEvents: ["Loan Applied", "Disbursement Made", "Repayment Received"]
  },
  { 
    id: "ws8", 
    name: "Mortgage", 
    keyEntity: "MTG_ID", 
    status: true, 
    scenarios: 8, 
    color: "#fa4d56",
    description: "Long-term credit facility monitoring focusing on asset valuation shifts and complex ownership structures.",
    scenariosList: ["Property value manipulation", "Straw buyer patterns", "Abnormal interest rate overrides"],
    relatedEvents: ["Valuation Completed", "Title Transfer", "Rate Locked"]
  },
  { 
    id: "ws9", 
    name: "Credit Card", 
    keyEntity: "CC_ID", 
    status: true, 
    scenarios: 92, 
    color: "#007d79",
    description: "High-velocity monitoring for card-not-present transactions and geometric spending anomalies.",
    scenariosList: ["Small test transactions", "Geographic jumping", "High-risk merchant activity"],
    relatedEvents: ["Authorization Request", "Chargeback Initiated", "Limit Increased"]
  },
  { 
    id: "ws10", 
    name: "Merchant", 
    keyEntity: "MID", 
    status: true, 
    scenarios: 41, 
    color: "#ff7eb6",
    description: "Acquiring network monitoring for merchant categories, chargeback ratios, and settlement delays.",
    scenariosList: ["Factoring detection", "Mismatched MCC volume", "Sudden turnover spike"],
    relatedEvents: ["Settlement Processed", "Merchant Onboarded", "Terminal Added"]
  },
  { 
    id: "ws11", 
    name: "Insurance", 
    keyEntity: "POL_ID", 
    status: true, 
    scenarios: 0,
    color: "#33b1ff",
    description: "Policy lifecycle monitoring including claims velocity and premium payment source verification.",
    scenariosList: ["Beneficiary change frequency", "Claims within cooling-off period", "Premium paid by third-party"],
    relatedEvents: ["Policy Issued", "Claim Filed", "Premium Received"]
  }
];

// --- CUSTOM COMPONENTS ---
function StatCard({ label, value, colorClass, icon: Icon }: { label: string, value: string | number, colorClass: string, icon: any }) {
  return (
    <div className="bg-white border border-gray-200 rounded-[8px] px-4 h-[46px] flex items-center gap-3 transition-shadow">
      <div className={cn("p-1.5 rounded-[4px] bg-gray-50", colorClass.replace('text-', 'text-'))}>
        <Icon size={16} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[14px] text-[#525252] font-normal whitespace-nowrap">{label}</span>
        <span className={cn("text-[16px] font-normal", colorClass)}>{value}</span>
      </div>
    </div>
  );
}

function toTitleCase(str: string) {
  return str.toLowerCase().split(/[_\s]+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function WorkspaceTableRow({ 
  item, 
  onKeyConfig, 
  onSettings,
  onStatusToggle,
  onShowScenarios,
  hasApprovedConfig
}: { 
  item: WorkspaceItem; 
  onKeyConfig: (id: string) => void;
  onSettings: (id: string) => void;
  onStatusToggle: (id: string) => void;
  onShowScenarios: (item: WorkspaceItem) => void;
  hasApprovedConfig?: boolean;
}) {
  const isDeactivationRestricted = item.status && item.scenarios > 0;

  return (
    <tr className="h-[48px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
      <td className="px-6 align-middle">
        <div className="flex items-center gap-2">
          <Badge 
            className="text-[11px] font-medium px-3 h-[28px] rounded-md flex items-center justify-center min-w-[80px] border-0"
            style={{ backgroundColor: `${item.color}15`, color: item.color }}
          >
            {toTitleCase(item.name)}
          </Badge>
          {hasApprovedConfig && (
            <Badge className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 h-[20px] rounded-sm flex items-center gap-1">
              <CheckmarkFilled size={12} />
              CONFIGURED
            </Badge>
          )}
        </div>
      </td>
      <td className="px-4 align-middle">
        <Badge className="bg-[#EDF5FF] text-[#0043CE] text-[11px] font-medium px-3 h-[28px] rounded-full border border-[#D0E2FF] flex items-center justify-center inline-flex min-w-[80px] gap-1.5">
          <LucideKey size={12} />
          {toTitleCase(item.keyEntity)}
        </Badge>
      </td>
      <td className="px-4 align-middle">
        <button onClick={() => onShowScenarios(item)} className="text-[#161616] underline font-medium text-[14px] cursor-pointer outline-none hover:text-[#2A53A0]">
          {item.scenarios}
        </button>
      </td>
      <td className="px-4 align-middle">
        {/* Status Badge - Matching Group Management Page */}
        <Badge className={cn(
          "rounded-full font-medium text-[11px] px-3 border-0 uppercase h-[28px] inline-flex items-center justify-center whitespace-nowrap",
          item.status ? "bg-[#DEFBE6] text-[#198038]" : "bg-[#F4F4F4] text-[#525252]"
        )}>
          {item.status ? "ACTIVE" : "INACTIVE"}
        </Badge>
      </td>
      <td className="px-6 align-middle text-left" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-start gap-3">
          <button 
            className="w-[28px] h-[28px] min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] flex items-center justify-center bg-[#fff0f7] hover:bg-[#ffd6e8] rounded-[8px] transition-colors text-[#d12771] shrink-0" 
            title="Key Configuration" 
            onClick={() => onKeyConfig(item.id)}
          >
            <LucideKey size={16} />
          </button>
          <button 
            className="w-[28px] h-[28px] min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] flex items-center justify-center bg-[#f4f4f4] hover:bg-[#e5e5e5] rounded-[8px] transition-colors text-[#161616] shrink-0" 
            title="Settings" 
            onClick={() => onSettings(item.id)}
          >
            <Settings size={16} />
          </button>
          {/* Carbon Design System Toggle Button */}
          <button
            onClick={() => !isDeactivationRestricted && onStatusToggle(item.id)}
            disabled={isDeactivationRestricted}
            className={cn(
              "relative inline-flex h-[24px] w-[48px] shrink-0 items-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2A53A0] focus:ring-offset-2",
              item.status 
                ? "bg-[#2A53A0] border-[#2A53A0]" 
                : "bg-[#8D8D8D] border-[#8D8D8D]",
              isDeactivationRestricted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
            role="switch"
            aria-checked={item.status}
            title={isDeactivationRestricted ? `Cannot deactivate: ${item.scenarios} linked scenarios` : (item.status ? "Click to Deactivate" : "Click to Activate")}
          >
            <span
              className={cn(
                "inline-block h-[16px] w-[16px] transform rounded-full bg-white transition-transform",
                item.status ? "translate-x-[26px]" : "translate-x-[3px]"
              )}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function WorkspaceManagementPage({ 
  onBreadcrumbNavigate,
  onViewWorkspace,
  onConfigWorkspace,
  onSettingsWorkspace,
  breadcrumbs,
  approvedConfigs = {}
}: { 
  onBreadcrumbNavigate: (path: string) => void,
  onViewWorkspace: (id: string) => void,
  onConfigWorkspace: (id: string) => void,
  onSettingsWorkspace: (id: string) => void,
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[],
  approvedConfigs?: Record<string, any>
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>(INITIAL_WORKSPACE_DATA);
  const [selectedWorkspaceForScenarios, setSelectedWorkspaceForScenarios] = useState<WorkspaceItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [deactivatedWorkspaceName, setDeactivatedWorkspaceName] = useState("");

  const filteredData = useMemo(() => {
    return workspaces.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keyEntity.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, workspaces]);

  const enabledCount = workspaces.filter(i => i.status).length;
  const disabledCount = workspaces.filter(i => !i.status).length;
  const totalScenarios = workspaces.reduce((acc, curr) => acc + curr.scenarios, 0);

  const fullScenariosList = useMemo(() => {
    if (!selectedWorkspaceForScenarios) return [];
    const list = [...selectedWorkspaceForScenarios.scenariosList];
    const totalCount = selectedWorkspaceForScenarios.scenarios;
    if (list.length < totalCount) {
      const diff = totalCount - list.length;
      for (let i = 1; i <= diff; i++) {
        list.push(`${selectedWorkspaceForScenarios.name} classified monitoring pattern ${list.length + 1}`);
      }
    }
    return list;
  }, [selectedWorkspaceForScenarios]);

  const handleStatusToggle = (id: string) => {
    const workspace = workspaces.find(w => w.id === id);
    if (!workspace) return;
    
    // Prevent deactivation if workspace has scenarios
    if (workspace.status && workspace.scenarios > 0) return;
    
    // Only show loader and success dialog for deactivation (active -> inactive)
    if (workspace.status) {
      setDeactivatedWorkspaceName(workspace.name);
      setIsLoading(true);
      
      // Simulate API call with loader
      setTimeout(() => {
        setWorkspaces(prev => prev.map(item => item.id === id ? { ...item, status: false } : item));
        setIsLoading(false);
        setShowSuccessDialog(true);
      }, 1500);
    } else {
      // For activation (inactive -> active), just toggle immediately
      setWorkspaces(prev => prev.map(item => item.id === id ? { ...item, status: true } : item));
    }
  };

  const handleContinueToPendingVerification = () => {
    setShowSuccessDialog(false);
    // Navigate to Pending Verification page with Status change action filter
    // The route will be "pending-verification-main" with status change filter
    onBreadcrumbNavigate("pending-verification-main:workspace");
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden animate-in fade-in duration-500">
      <AnimatePresence>
        {selectedWorkspaceForScenarios && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="h-[64px] bg-[#2A53A0] flex items-center justify-between px-6 text-white shrink-0">
                <h3 className="text-[18px] font-medium tracking-tight">{selectedWorkspaceForScenarios.name} - Active Scenarios</h3>
                <button onClick={() => setSelectedWorkspaceForScenarios(null)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><Close size={24} /></button>
              </div>
              <div className="p-8 overflow-y-auto no-scrollbar flex-1">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {fullScenariosList.length > 0 ? (
                      fullScenariosList.map((scenario, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-[#fbfbfb] border border-[#e0e0e0] rounded-lg hover:border-[#2A53A0] hover:bg-white transition-all group">
                          <div className="w-8 h-8 rounded-full bg-[#EAF2FF] flex items-center justify-center text-[#2A53A0] font-bold text-[12px] group-hover:bg-[#2A53A0] group-hover:text-white transition-colors">{idx + 1}</div>
                          <span className="text-[14px] text-[#161616] font-medium">{scenario}</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-[#8d8d8d] bg-[#fbfbfb] border border-dashed border-[#d0d0d0] rounded-lg">
                        <Information size={32} className="mb-2 opacity-20" />
                        <p className="text-[14px]">No active scenarios configured for this workspace.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="h-[64px] border-t border-[#d0d0d0] flex items-stretch shrink-0 bg-[#f4f4f4]">
                <div className="flex-1 bg-transparent border-r border-[#d0d0d0]" />
                <button onClick={() => setSelectedWorkspaceForScenarios(null)} className="flex-1 bg-[#2A53A0] hover:bg-[#1E3D7A] text-white font-medium text-[15px] transition-colors">Ok</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PageHeader title="Workspace Management" breadcrumbs={breadcrumbs} onBreadcrumbNavigate={onBreadcrumbNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable Content Container */}
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar bg-white">
          <div className="max-w-[1600px] mx-auto space-y-4">
            {/* Stats and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <StatCard label="Enabled" value={enabledCount} colorClass="text-[#198038]" icon={Activity} />
                <StatCard label="Disabled" value={disabledCount} colorClass="text-[#525252]" icon={Activity} />
                <StatCard label="Total Scenarios" value={totalScenarios} colorClass="text-[#2A53A0]" icon={Flow} />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search workspaces..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-[46px] pl-10 pr-4 bg-white border border-[#C6C6C6] rounded-[8px] text-[14px] focus:border-[#2A53A0] outline-none min-w-[320px] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-200 rounded-[8px] overflow-hidden flex flex-col shadow-sm">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-[#F4F4F4] h-[48px] border-b border-[#e0e0e0]">
                      <th className="px-6 text-[15px] font-medium text-[#2A53A0] align-middle">
                        <div className="flex items-center gap-2">
                          <span>Name</span>
                          <ArrowsVertical size={14} className="text-[#525252] cursor-pointer hover:text-[#2A53A0] transition-colors" />
                        </div>
                      </th>
                      <th className="px-4 text-[15px] font-medium text-[#2A53A0] align-middle">
                        <div className="flex items-center gap-2">
                          <span>Entity</span>
                          <ArrowsVertical size={14} className="text-[#525252] cursor-pointer hover:text-[#2A53A0] transition-colors" />
                        </div>
                      </th>
                      <th className="px-4 text-[15px] font-medium text-[#2A53A0] align-middle">Scenarios</th>
                      <th className="px-4 text-[15px] font-medium text-[#2A53A0] align-middle">Status</th>
                      <th className="px-6 text-[15px] font-medium text-[#2A53A0] align-middle text-left w-[160px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <WorkspaceTableRow 
                          key={item.id} 
                          item={item} 
                          onKeyConfig={onConfigWorkspace}
                          onSettings={onSettingsWorkspace} 
                          onStatusToggle={handleStatusToggle}
                          onShowScenarios={setSelectedWorkspaceForScenarios}
                          hasApprovedConfig={!!approvedConfigs[item.name]}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="h-[200px] text-center text-gray-500 italic">No workspaces match your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <WorkspaceTableFooter count={filteredData.length} />
            </div>

            {/* Deactivation Policy Notification - Single Row */}
            <div className="bg-[#2A53A008] border-l-4 border-[#2A53A0] rounded-[2px] px-4 h-[48px] flex items-center gap-3 overflow-hidden no-scrollbar">
              <Information size={18} className="text-[#2A53A0] shrink-0" />
              <div className="flex items-center gap-1 overflow-hidden no-scrollbar">
                <p className="text-[12px] font-medium text-[#2A53A0] whitespace-nowrap">
                  Workspaces with one or more linked scenarios are restricted from being set to <span className="underline decoration-1 font-medium">Inactive</span> status.
                </p>
                <p className="text-[12px] font-normal text-[#2A53A0] whitespace-nowrap hidden lg:block">
                  To deactivate a workspace, ensure all associated scenarios are reassigned or deleted first.
                </p>
              </div>
            </div>
            
            {/* Bottom spacing to ensure scrollability feels natural */}
            <div className="h-4" />
          </div>
        </div>
      </div>

      {/* Success Dialog for Deactivation */}
      {showSuccessDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[8px] shadow-2xl w-[360px] overflow-hidden flex flex-col"
          >
            {/* Success Icon */}
            <div className="pt-8 pb-4 flex justify-center">
              <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
                <path d={successIconPaths.checkmark} fill="#2A53A0" />
                <path d={successIconPaths.circle} fill="#2A53A0" />
              </svg>
            </div>
            
            {/* Success Text */}
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] text-[#2a53a0] text-[20px] text-center mb-4">Success</p>
            
            {/* Description */}
            <div className="px-6 pb-8">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.6] text-[#767676] text-[16px] text-center whitespace-pre-line">
                {`Workspace ${deactivatedWorkspaceName}\nSuccessfully Deactivated`}
              </p>
            </div>
            
            {/* Continue Button */}
            <div className="w-full h-[55px]">
              <button 
                onClick={handleContinueToPendingVerification}
                className="bg-[#2a53a0] hover:bg-[#1E3D7A] w-full h-full rounded-bl-[8px] rounded-br-[8px] transition-colors"
              >
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] text-[16px] text-white">Continue</p>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[8px] shadow-2xl w-[211px] h-[100px] flex items-center justify-center relative"
          >
            <div className="flex items-center gap-3">
              <img 
                alt="Loading" 
                className="w-[46px] h-[46px] animate-spin" 
                src={imgClari5Loader} 
              />
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.8] text-[#333] text-[16px] whitespace-nowrap">
                Loading....
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}