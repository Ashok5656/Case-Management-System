import React, { useState } from "react";
import { 
  ArrowLeft, 
  CheckmarkFilled, 
  CloseFilled, 
  Warning, 
  Settings, 
  Code,
  Tag,
  Checkmark,
  Information,
  DataView,
  Chat,
  Catalog,
  Layers,
  ContainerSoftware,
  Activity,
  ChevronRight,
  Calendar,
  User,
  Time,
  Flow,
  Launch
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import PageHeader from "./page-header";
import { toast } from "sonner@2.0.3";
import { Textarea } from "./ui/textarea";

interface VerifyUDVPageProps {
  udv: any;
  breadcrumbs: any[];
  onBack: () => void;
  onVerify: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
  onBreadcrumbNavigate: (path: string) => void;
}

export function VerifyUDVPage({ udv, breadcrumbs, onBack, onVerify, onReject, onBreadcrumbNavigate }: VerifyUDVPageProps) {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  
  const handleApproveAction = () => {
    if (!comment.trim()) {
      toast.error("Please provide a comment before approving.");
      return;
    }
    setIsApproveModalOpen(true);
  };

  const handleRejectAction = () => {
    if (!comment.trim()) {
      toast.error("Please provide a comment explaining the rejection.");
      return;
    }
    onReject(udv.id, comment);
  };

  // Mock data for consistent look
  const scenarioCount = udv?.usedInScenarioCount || 4;
  const masterScenarios = [
    { title: "High Value Card Transaction - Online", description: "Detects high-value online card transactions above threshold to identify potential fraud on premium purchases" },
    { title: "Rapid Transaction Velocity Check", description: "Monitors transaction frequency and velocity patterns to catch card testing and rapid-fire fraud attempts" },
    { title: "Cross-Border Transaction Anomaly", description: "Identifies unusual cross-border transaction patterns that deviate from customer normal behavior" },
    { title: "New Merchant First Transaction", description: "Flags first-time transactions with new merchants that may indicate compromised card usage" }
  ];

  const typeLabel = udv?.category === "default" ? "IPV" : "UDV";
  const typeDescription = udv?.category === "default" 
    ? "This Internal Processing Variable (IPV) is utilized to track real-time behavioral shifts in transaction patterns. It serves as a primary input for multiple risk-based detection scenarios."
    : "This User Defined Variable (UDV) is a custom attribute created for specific business logic or localized risk assessment patterns.";

  // Default config if missing to ensure Method Parameters section appears
  const methodConfig = udv?.config || {
    method: "AGGREGATION",
    targetField: "transaction_amount",
    timePeriod: "90 days",
    channel: "Online",
    amount: "> 1000"
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden font-['Inter']">
      {/* PERSISTENT HEADER REGION */}
      <div className="flex-none bg-white z-20 border-b border-gray-200">
        <PageHeader 
          title="Verify UDV"
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        {/* METADATA BAR */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center h-[52px]">
            <div className="flex items-center gap-2 whitespace-nowrap pr-4 border-r border-gray-200 h-4 self-center">
                <span className="text-[12px] font-normal text-[#525252]">UDV Name:</span>
                <span className="text-[13px] font-semibold text-[#161616]">{udv?.name || "Untitled Variable"}</span>
            </div>
            
            <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center">
                <span className="text-[12px] font-normal text-[#525252]">Status:</span>
                <Badge className="bg-[#fdf4cf] text-[#856404] hover:bg-[#fdf4cf] border-0 font-medium rounded-full px-2.5 h-6 text-[11px] tracking-tight">Pending Approval</Badge>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center">
                <span className="text-[12px] font-normal text-[#525252]">Category:</span>
                <Badge className="bg-[#d0e2ff] text-[#0043ce] hover:bg-[#d0e2ff] border-0 font-medium rounded-full px-2.5 h-6 text-[11px]">{udv?.category || "Transaction"}</Badge>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center">
                <span className="text-[12px] font-normal text-[#525252]">PII Class:</span>
                <Badge className={cn(
                  "border-0 font-medium rounded-full px-2.5 h-6 text-[11px] uppercase",
                  (udv?.piiClassification || "None") === "None" ? "bg-gray-100 text-gray-600" : (udv?.piiClassification === "PII" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700")
                )}>
                  {udv?.piiClassification || "None"}
                </Badge>
            </div>

            <div className="flex items-center gap-2 min-w-0 flex-1 pl-4">
                <span className="text-[12px] font-normal text-[#525252] whitespace-nowrap">Description:</span>
                <span className="text-[13px] text-[#161616] truncate font-normal" title={udv?.description}>
                  {udv?.description || "No description provided."}
                </span>
            </div>
        </div>

        {/* ACTION BAR */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
           <div className="flex items-center gap-2">
              <Information size={16} className="text-[#2A53A0]" />
              <span className="text-[13px] text-[#525252]">Review the variable logic and dependencies before finalizing the verification.</span>
           </div>
           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="h-[46px] px-6 border-gray-300 text-[#da1e28] hover:bg-red-50 font-semibold rounded-[8px] text-[14px]"
                onClick={handleRejectAction}
              >
                <CloseFilled size={18} className="mr-2" /> Reject
              </Button>
              <Button 
                className="h-[46px] px-8 bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-semibold rounded-[8px] shadow-sm text-[14px]"
                onClick={handleApproveAction}
              >
                <CheckmarkFilled size={18} className="mr-2" /> Approve
              </Button>
           </div>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        
        {/* COMMENT SECTION */}
        <div className="bg-white border border-[#e0e0e0] rounded-[8px] shadow-sm overflow-hidden p-4">
          <div className="flex items-center gap-2 mb-3">
            <Chat size={18} className="text-[#2A53A0]" />
            <h3 className="text-[14px] font-bold text-[#161616]">Review Comments</h3>
            <span className="text-[11px] text-red-500 font-medium">* Required for action</span>
          </div>
          <Textarea 
            placeholder="Enter your verification notes, approval justification, or rejection reasons here..."
            className="min-h-[100px] text-[14px] border-gray-300 focus:ring-[#2A53A0] focus:border-[#2A53A0] rounded-sm resize-none bg-white"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Variable Specification Section */}
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden text-left">
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
              <p className="text-[14px] text-[#525252] leading-relaxed font-medium">
                {udv?.description || typeDescription}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Created On</span>
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#161616]">
                  <Calendar size={14} className="text-[#2A53A0]" />
                  {udv?.createdDate || udv?.createdOn || "June 15, 2023"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Created By</span>
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#161616]">
                  <User size={14} className="text-[#2A53A0]" />
                  {udv?.createdBy || "Core-Engine"}
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
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden text-left">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
            <div className="p-2 rounded-md bg-blue-50 text-[#2A53A0]">
              <Code size={20} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#161616]">Internal Processing Logic</h3>
              <p className="text-[12px] text-gray-400 mt-0.5">Computational formula for real-time attribute extraction</p>
            </div>
          </div>
          <div className="p-6 bg-white">
            <div className="bg-[#1e1e1e] border border-gray-800 p-8 rounded-[12px] relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-gray-600 select-none tracking-widest bg-black/20 rounded-bl-lg">SQL EXPRESSION</div>
              <div className="text-[14px] font-mono leading-relaxed tabular-nums overflow-x-auto no-scrollbar">
                <div className="flex gap-6">
                  <span className="text-gray-600 w-6 text-right select-none">1</span>
                  <p className="text-white whitespace-pre">{udv?.logic || "SELECT * FROM transactions WHERE amount > 1000"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Method Parameters Section */}
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden text-left">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
            <div className="p-2 rounded-md bg-emerald-50 text-emerald-600">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#161616]">Method Parameters</h3>
              <p className="text-[12px] text-gray-400 mt-0.5">Configured input values for {methodConfig.method || "computation"}</p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {Object.entries(methodConfig).filter(([key]) => key !== 'method').map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-[12px] font-bold text-[#161616] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <span className="text-[#DA1E28]">*</span>
                    <Badge className="bg-gray-100 text-gray-500 border-0 text-[10px] px-2 py-0 h-4 font-mono uppercase">STRING</Badge>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-[8px] h-[46px] flex items-center px-4 text-[14px] font-medium text-[#161616]">
                    {value as string || "ALL"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scenarios Mapped Section */}
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden text-left">
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
            <div className="grid grid-cols-2 gap-4">
              {masterScenarios.map((scenario, idx) => (
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
            </div>
          </div>
        </div>

        {/* SUBMISSION COMMENTS SECTION */}
        <div className="bg-[#f0f7ff] border border-[#d0e2ff] rounded-[8px] p-6 shadow-sm flex gap-4 text-left">
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2A53A0] shrink-0 shadow-sm border border-[#d0e2ff]">
             <Tag size={20} />
           </div>
           <div className="space-y-1">
             <h4 className="text-[14px] font-bold text-[#161616]">Submission Context</h4>
             <p className="text-[13px] text-[#002d9c] font-medium leading-relaxed italic">
               "Updated logic to include real-time transaction monitoring flags. Added dependency for high-risk country lookup table to improve detection accuracy."
             </p>
             <div className="flex items-center gap-2 pt-2 text-[11px] text-[#0043ce] font-medium">
               <span>Submitted by {udv?.createdBy || "Rajesh Kumar"}</span>
               <span>•</span>
               <span>{udv?.createdOn || "Yesterday, 4:45 PM"}</span>
             </div>
           </div>
        </div>

        <div className="bg-[#fffbe6] p-4 border-l-4 border-[#f1c21b] rounded-r-[8px] flex gap-3 mb-6 text-left">
          <Warning size={20} className="text-[#856404] flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#856404] leading-relaxed font-medium">
            Carefully review the variable logic for performance bottlenecks and syntax errors. Once approved, this UDV will be available for all monitoring scenarios and analytics views.
          </p>
        </div>
      </div>

      {/* APPROVAL SUCCESS MODAL */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[400px] overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-[#198038]">
                <CheckmarkFilled size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-[20px] font-bold text-[#161616]">UDV Verified!</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  The UDV <strong>"{udv?.name}"</strong> has been approved and moved to the Active inventory.
                </p>
                <div className="bg-[#f4f4f4] p-3 rounded-md mt-2 text-left">
                  <span className="text-[11px] text-[#525252] font-semibold block mb-1">FINAL COMMENT:</span>
                  <p className="text-[13px] text-[#161616] italic line-clamp-3">"{comment}"</p>
                </div>
              </div>
              <div className="pt-2 w-full">
                <Button 
                  className="w-full h-[46px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
                  onClick={() => {
                    setIsApproveModalOpen(false);
                    onVerify(udv.id, comment);
                  }}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
