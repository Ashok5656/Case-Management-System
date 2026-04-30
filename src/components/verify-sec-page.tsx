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
  Security,
  Layers,
  ContainerSoftware,
  Activity,
  ChevronRight,
  Calendar,
  User,
  Time,
  Flow,
  Launch,
  Table
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import PageHeader from "./page-header";
import { toast } from "sonner@2.0.3";
import { Textarea } from "./ui/textarea";

interface VerifySECPageProps {
  sec: any;
  breadcrumbs: any[];
  onBack: () => void;
  onVerify: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
  onBreadcrumbNavigate: (path: string) => void;
}

export function VerifySECPage({ sec, breadcrumbs, onBack, onVerify, onReject, onBreadcrumbNavigate }: VerifySECPageProps) {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  
  // Mock SEC logic changes
  const conditionChanges = [
    {
      property: "Condition Logic",
      before: "txn_amount > 500 AND channel = 'ATM'",
      after: "txn_amount > 1000 AND (channel = 'ATM' OR channel = 'POS')",
      status: "MODIFIED"
    },
    {
      property: "Filter Set",
      before: "Global_Standard",
      after: "High_Risk_Standard_v2",
      status: "MODIFIED"
    }
  ];

  const fieldMappings = [
    {
      name: "customer_id",
      source: "CE_Transaction.cust_identifier",
      before: { mapping: "Direct", type: "String", pii: "PII" },
      after: { mapping: "Direct", type: "String", pii: "PII" },
      status: "UNCHANGED"
    },
    {
      name: "risk_score",
      source: "CE_Transaction.calculated_risk",
      before: { mapping: "—", type: "—", pii: "—" },
      after: { mapping: "Aggregated", type: "BigDecimal", pii: "None" },
      status: "ADDED"
    },
    {
      name: "merchant_category",
      source: "CE_Transaction.mcc",
      before: { mapping: "Lookup", type: "String", pii: "None" },
      after: { mapping: "Direct", type: "String", pii: "None" },
      status: "MODIFIED"
    }
  ];

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
    onReject(sec.id, comment);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden font-['Inter']">
      {/* PERSISTENT HEADER REGION */}
      <div className="flex-none bg-white z-20 border-b border-gray-200">
        <PageHeader 
          title="Verify SEC"
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        {/* METADATA BAR */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center h-[52px]">
            <div className="flex items-center gap-2 whitespace-nowrap pr-4 border-r border-gray-200 h-4 self-center">
                <span className="text-[12px] font-normal text-[#525252]">SEC Name:</span>
                <span className="text-[13px] font-semibold text-[#161616]">{sec?.name || sec?.controlName || "Untitled Control"}</span>
            </div>
            
            <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center">
                <span className="text-[12px] font-normal text-[#525252]">Status:</span>
                <Badge className="bg-[#fdf4cf] text-[#856404] hover:bg-[#fdf4cf] border-0 font-medium rounded-full px-2.5 h-6 text-[11px] tracking-tight">Pending Approval</Badge>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center">
                <span className="text-[12px] font-normal text-[#525252]">Event:</span>
                <Badge className="bg-[#d0e2ff] text-[#0043ce] hover:bg-[#d0e2ff] border-0 font-medium rounded-full px-2.5 h-6 text-[11px] font-mono">{sec?.customEvent || "N/A"}</Badge>
            </div>

            <div className="flex items-center gap-2 min-w-0 flex-1 pl-4">
                <span className="text-[12px] font-normal text-[#525252] whitespace-nowrap">Description:</span>
                <span className="text-[13px] text-[#161616] truncate font-normal" title={sec?.description}>
                  {sec?.description || "No description provided."}
                </span>
            </div>
        </div>

        {/* ACTION BAR */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
           <div className="flex items-center gap-2">
              <Information size={16} className="text-[#2A53A0]" />
              <span className="text-[13px] text-[#525252]">Review the semantic event logic and field selections before finalizing the verification.</span>
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
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f4f7fb]">
        
        {/* COMMENT SECTION */}
        <div className="bg-white border border-[#e0e0e0] rounded-[8px] shadow-sm overflow-hidden p-6">
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

        {/* LOGIC CONFIGURATION SECTION */}
        <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings size={20} className="text-[#2A53A0]" />
              <h3 className="text-[15px] font-bold text-[#161616]">SEC Logic Configuration</h3>
              <Badge className="bg-orange-100 text-orange-700 border-0 ml-2 font-bold px-2 py-0 h-5">2 changes</Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f0f0f0] h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider">
                  <th className="px-6 border-b border-gray-200 w-1/4">Configuration Property</th>
                  <th className="px-6 border-b border-gray-200 text-center bg-red-50/50">Before</th>
                  <th className="px-6 border-b border-gray-200 text-center bg-green-50/50">After</th>
                  <th className="px-6 border-b border-gray-200 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {conditionChanges.map((item, idx) => (
                  <tr key={idx} className="h-[56px] border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 align-middle font-medium text-[#161616] text-[14px]">{item.property}</td>
                    <td className="px-6 align-middle text-center bg-red-50/20">
                      <span className="text-red-600 line-through text-[14px] font-mono">{item.before}</span>
                    </td>
                    <td className="px-6 align-middle text-center bg-green-50/20">
                      <span className="text-green-700 font-bold text-[14px] font-mono">{item.after}</span>
                    </td>
                    <td className="px-6 align-middle text-center">
                      <Badge className="bg-orange-50 text-orange-600 border border-orange-200 rounded-sm font-bold text-[10px] px-2">MODIFIED</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FIELDS CONFIGURATION SECTION */}
        <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DataView size={20} className="text-[#2A53A0]" />
              <h3 className="text-[15px] font-bold text-[#161616]">Field Selection Comparison</h3>
              <Badge className="bg-emerald-100 text-emerald-700 border-0 ml-2 font-bold px-2 py-0 h-5">3 fields</Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f0f0f0] h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider">
                  <th className="px-6 border-b border-gray-200" colSpan={2}>Semantic Field Details</th>
                  <th className="px-6 border-b border-gray-200 text-center bg-red-50/50" colSpan={3}>Before</th>
                  <th className="px-6 border-b border-gray-200 text-center bg-green-50/50" colSpan={3}>After</th>
                  <th className="px-6 border-b border-gray-200 text-center">Status</th>
                </tr>
                <tr className="bg-[#f8f9fa] h-[32px] text-[10px] font-bold text-[#8d8d8d] uppercase border-b border-gray-200">
                  <th className="px-6 border-r border-gray-100">Alias</th>
                  <th className="px-6 border-r border-gray-100">Source Path</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-red-50/30">Mapping</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-red-50/30">Type</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-red-50/30">PII</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-green-50/30">Mapping</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-green-50/30">Type</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-green-50/30">PII</th>
                  <th className="px-6 text-center">Change</th>
                </tr>
              </thead>
              <tbody>
                {fieldMappings.map((field, idx) => (
                  <tr key={idx} className="h-[72px] border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 align-middle border-r border-gray-100">
                      <span className="text-[14px] font-bold text-[#161616]">{field.name}</span>
                    </td>
                    <td className="px-6 align-middle border-r border-gray-100">
                      <span className="text-[12px] text-[#525252] font-mono leading-tight block">{field.source}</span>
                    </td>
                    
                    {/* BEFORE COLS */}
                    <td className="px-4 align-middle text-center bg-red-50/10 border-r border-gray-100">
                      <span className={cn("text-[13px]", field.before.mapping !== "—" && "text-red-500 line-through")}>{field.before.mapping}</span>
                    </td>
                    <td className="px-4 align-middle text-center bg-red-50/10 border-r border-gray-100">
                      <span className={cn("text-[11px] font-mono", field.before.type !== "—" && "text-red-500 line-through")}>{field.before.type}</span>
                    </td>
                    <td className="px-4 align-middle text-center bg-red-50/10 border-r border-gray-100">
                      {field.before.pii !== "—" && (
                         <Badge variant="outline" className={cn("rounded-sm font-bold text-[9px] uppercase", field.before.pii === "PII" ? "text-red-400 border-red-200" : "text-gray-400 border-gray-200")}>
                           {field.before.pii}
                         </Badge>
                      )}
                      {field.before.pii === "—" && <span className="text-gray-300">—</span>}
                    </td>

                    {/* AFTER COLS */}
                    <td className="px-4 align-middle text-center bg-green-50/10 border-r border-gray-100">
                      <span className="text-[13px] font-bold text-green-700">{field.after.mapping}</span>
                    </td>
                    <td className="px-4 align-middle text-center bg-green-50/10 border-r border-gray-100">
                      <span className="text-[11px] font-mono font-bold text-green-700">{field.after.type}</span>
                    </td>
                    <td className="px-4 align-middle text-center bg-green-50/10 border-r border-gray-100">
                      <Badge className={cn(
                        "rounded-sm font-bold text-[9px] border uppercase",
                        field.after.pii === "None" ? "bg-gray-100 text-gray-600" : (field.after.pii === "PII" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700")
                      )}>
                        {field.after.pii}
                      </Badge>
                    </td>

                    {/* STATUS COL */}
                    <td className="px-6 align-middle text-center">
                      {field.status === "MODIFIED" && <Badge className="bg-orange-50 text-orange-600 border border-orange-200 rounded-sm font-bold text-[10px]">MODIFIED</Badge>}
                      {field.status === "ADDED" && <Badge className="bg-green-50 text-green-600 border border-green-200 rounded-sm font-bold text-[10px]">+ ADDED</Badge>}
                      {field.status === "UNCHANGED" && <Badge className="bg-gray-50 text-gray-500 border border-gray-200 rounded-sm font-bold text-[10px]">UNCHANGED</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
               "Expanding the semantic check to include POS transactions and adding a risk score aggregation from the core event. This will allow for more granular fraud detection rules in the next sprint."
             </p>
             <div className="flex items-center gap-2 pt-2 text-[11px] text-[#0043ce] font-medium">
               <span>Submitted by Rajesh Kumar</span>
               <span>•</span>
               <span>Yesterday, 4:45 PM</span>
             </div>
           </div>
        </div>

        <div className="bg-[#fffbe6] p-4 border-l-4 border-[#f1c21b] rounded-r-[8px] flex gap-3 mb-6 text-left">
          <Warning size={20} className="text-[#856404] flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#856404] leading-relaxed font-medium">
            Semantic Event Collections define how detection logic interprets raw data. Ensure all mappings and condition logic align with the business requirement document before activation.
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
                <h2 className="text-[20px] font-bold text-[#161616]">SEC Verified!</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  The semantic collection <strong>"{sec?.name || sec?.controlName}"</strong> has been approved and moved to the Active inventory.
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
                    onVerify(sec.id, comment);
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
