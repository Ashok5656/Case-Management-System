import React, { useState } from "react";
import { 
  ArrowLeft, 
  CheckmarkFilled, 
  CloseFilled, 
  Warning, 
  Settings, 
  Table,
  Tag,
  Checkmark,
  Information,
  DataView,
  Chat,
  Document,
  Building,
  Calendar,
  UserAvatar,
  View,
  DataTable
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import PageHeader from "./page-header";
import { toast } from "sonner@2.0.3";
import { Textarea } from "./ui/textarea";

interface VerifyViewPageProps {
  view: any;
  breadcrumbs: any[];
  onBack: () => void;
  onApprove: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
  onBreadcrumbNavigate: (path: string) => void;
}

export function VerifyViewPage({ view, breadcrumbs, onBack, onApprove, onReject, onBreadcrumbNavigate }: VerifyViewPageProps) {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  
  // Mock comparison data for a View
  const configChanges = [
    {
      property: "View Name",
      before: "Draft View Alpha",
      after: view?.viewName || view?.name || "Untitled View",
      status: "UNCHANGED"
    },
    {
      property: "Source Table",
      before: "Transactions_Staging",
      after: view?.sourceTable || "Transactions",
      status: "MODIFIED"
    },
    {
      property: "Category",
      before: "System",
      after: "Custom",
      status: "MODIFIED"
    }
  ];

  const columnChanges = [
    {
      name: "TXN_ID",
      type: "Number",
      before: "Included",
      after: "Included",
      pii: "None",
      status: "UNCHANGED"
    },
    {
      name: "AMOUNT",
      type: "Number",
      before: "Excluded",
      after: "Included",
      pii: "None",
      status: "ADDED"
    },
    {
      name: "CURRENCY",
      type: "Text",
      before: "Included",
      after: "Included",
      pii: "None",
      status: "UNCHANGED"
    },
    {
      name: "SENDER_ID",
      type: "Number",
      before: "—",
      after: "Included",
      pii: "PII",
      status: "ADDED"
    },
    {
      name: "STATUS",
      type: "Text",
      before: "Included",
      after: "Excluded",
      pii: "None",
      status: "REMOVED"
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
    onReject(view.id, comment);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden font-['Inter']">
      {/* PERSISTENT HEADER REGION */}
      <div className="flex-none bg-white z-20 border-b border-gray-100">
        <PageHeader 
          title="Verify Custom View"
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        {/* METADATA BAR */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center h-[52px]">
            <div className="flex items-center gap-2 whitespace-nowrap pr-4">
                <span className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">View Name:</span>
                <span className="text-[13px] font-semibold text-[#161616]">{view?.viewName || view?.name || "Untitled View"}</span>
            </div>
            
            <div className="w-[1px] h-4 bg-gray-300 flex-none" />
            
            <div className="flex items-center gap-2 whitespace-nowrap px-4">
                <span className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Status:</span>
                <Badge className="bg-[#FFF9E5] text-[#B28600] hover:bg-[#FFF9E5] border-0 font-bold rounded-full px-3 h-[26px] text-[10px] tracking-tight uppercase">Pending Review</Badge>
            </div>

            <div className="w-[1px] h-4 bg-gray-300 flex-none" />

            <div className="flex items-center gap-2 whitespace-nowrap px-4">
                <span className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Source:</span>
                <Badge className="bg-[#EDF5FF] text-[#0043CE] hover:bg-[#EDF5FF] border-0 font-bold rounded-full px-3 h-[26px] text-[10px] uppercase">{view?.sourceTable || "Transactions"}</Badge>
            </div>

            <div className="w-[1px] h-4 bg-gray-300 flex-none" />

            <div className="flex items-center gap-2 min-w-0 flex-1 pl-4">
                <span className="text-[12px] font-bold text-[#525252] uppercase tracking-wider whitespace-nowrap">Description:</span>
                <span className="text-[13px] text-[#161616] truncate font-medium" title={view?.description}>
                  {view?.description || "No description provided."}
                </span>
            </div>
        </div>

        {/* ACTION BAR */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white h-[70px]">
           <div className="flex items-center gap-2">
              <Information size={16} className="text-[#2A53A0]" />
              <span className="text-[13px] text-[#525252] font-medium">Review the architectural changes and schema mappings below.</span>
           </div>
           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="h-[46px] px-6 border-gray-300 text-[#DA1E28] hover:bg-red-50 font-bold rounded-[8px] text-[14px]"
                onClick={handleRejectAction}
              >
                <CloseFilled size={18} className="mr-2" /> Reject View
              </Button>
              <Button 
                className="h-[46px] px-8 bg-[#2A53A0] hover:bg-[#1E3C75] text-white font-bold rounded-[8px] shadow-sm text-[14px]"
                onClick={handleApproveAction}
              >
                <CheckmarkFilled size={18} className="mr-2" /> Approve & Activate
              </Button>
           </div>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FBFCFD]">
        
        {/* COMMENT SECTION */}
        <div className="bg-white border border-[#E0E0E0] rounded-[8px] shadow-sm overflow-hidden p-5">
          <div className="flex items-center gap-2 mb-4">
            <Chat size={18} className="text-[#2A53A0]" />
            <h3 className="text-[15px] font-bold text-[#161616]">Verification Notes</h3>
            <span className="text-[11px] text-[#DA1E28] font-bold uppercase ml-auto">* Mandatory for processing</span>
          </div>
          <Textarea 
            placeholder="Document your review findings, security compliance check results, or rejection justifications..."
            className="min-h-[120px] text-[15px] border-gray-300 focus:ring-[#2A53A0] focus:border-[#2A53A0] rounded-sm resize-none bg-white p-4 leading-relaxed"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* VIEW CONFIGURATION SECTION */}
          <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-[#2A53A0]" />
                <h3 className="text-[15px] font-bold text-[#161616]">Metadata Comparison</h3>
              </div>
              <Badge className="bg-[#FFF9E5] text-[#B28600] border-0 font-bold px-2 py-0 h-5 text-[10px]">2 CHANGES</Badge>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FA] h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider">
                    <th className="px-6 border-b border-gray-200">Property</th>
                    <th className="px-6 border-b border-gray-200 text-center bg-red-50/30">Previous</th>
                    <th className="px-6 border-b border-gray-200 text-center bg-green-50/30">Proposed</th>
                  </tr>
                </thead>
                <tbody>
                  {configChanges.map((item, idx) => (
                    <tr key={idx} className="h-[56px] border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 align-middle font-semibold text-[#161616] text-[13px]">{item.property}</td>
                      <td className="px-6 align-middle text-center bg-red-50/10">
                        <span className={cn("text-[13px] font-medium", item.status === "MODIFIED" ? "text-red-600 line-through" : "text-gray-400")}>{item.before}</span>
                      </td>
                      <td className="px-6 align-middle text-center bg-green-50/10">
                        <span className={cn("text-[13px] font-bold", item.status === "MODIFIED" ? "text-green-700" : "text-[#161616]")}>{item.after}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SUBMISSION COMMENTS SECTION */}
          <div className="bg-[#EDF5FF] border border-[#D0E2FF] rounded-[8px] p-6 shadow-sm flex flex-col gap-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2A53A0] shrink-0 shadow-sm border border-[#D0E2FF]">
                 <Tag size={20} />
               </div>
               <div className="flex flex-col">
                 <h4 className="text-[15px] font-bold text-[#161616]">Submission Justification</h4>
                 <div className="flex items-center gap-2 text-[11px] text-[#0043CE] font-bold uppercase tracking-wider">
                   <span>Rajesh Kumar</span>
                   <span>•</span>
                   <span>Feb 15, 2026, 04:45 PM</span>
                 </div>
               </div>
             </div>
             <div className="flex-1 bg-white/60 p-4 rounded-lg border border-white/50">
               <p className="text-[14px] text-[#002D9C] leading-relaxed italic font-medium">
                 "Refined the Transaction View to include 'AMOUNT' and 'SENDER_ID' for better AML tracking. Removed legacy 'STATUS' field which is now deprecated in the downstream core table schema."
               </p>
             </div>
             <div className="bg-white/80 p-3 rounded-md flex items-center gap-2">
               <Warning size={16} className="text-[#856404]" />
               <span className="text-[11px] font-bold text-[#856404] uppercase">Impact: 12 Active Scenarios</span>
             </div>
          </div>
        </div>

        {/* SCHEMA COMPARISON SECTION */}
        <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DataTable size={20} className="text-[#2A53A0]" />
              <h3 className="text-[15px] font-bold text-[#161616]">Schema & Column Selection Comparison</h3>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-700 rounded border border-green-100 text-[10px] font-bold uppercase">
                 <Checkmark size={12} /> 2 Additions
               </div>
               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 text-red-700 rounded border border-red-100 text-[10px] font-bold uppercase">
                 <CloseFilled size={12} /> 1 Removal
               </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider">
                  <th className="px-6 border-b border-gray-200 w-[20%]">Field Identification</th>
                  <th className="px-6 border-b border-gray-200 w-[12%]">Data Type</th>
                  <th className="px-6 border-b border-gray-200 w-[12%] text-center">PII</th>
                  <th className="px-6 border-b border-gray-200 text-center bg-red-50/30 w-[18%]">Previous Selection</th>
                  <th className="px-6 border-b border-gray-200 text-center bg-green-50/30 w-[18%]">Proposed Selection</th>
                  <th className="px-6 border-b border-gray-200 text-center w-[20%]">Action Status</th>
                </tr>
              </thead>
              <tbody>
                {columnChanges.map((col, idx) => (
                  <tr key={idx} className="h-[64px] border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 align-middle">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-[#161616]">{col.name}</span>
                        <span className="text-[11px] text-[#8D8D8D]">sys_v_col_{col.name.toLowerCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 align-middle">
                      <Badge variant="outline" className="rounded-[4px] font-bold text-[10px] text-[#525252] border-gray-300 uppercase">
                        {col.type}
                      </Badge>
                    </td>
                    <td className="px-6 align-middle text-center">
                      <Badge className={cn(
                        "border-0 px-2 h-5 text-[10px] font-bold uppercase rounded-sm",
                        col.pii === "None" ? "bg-gray-100 text-gray-500" : col.pii === "PII" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                      )}>
                        {col.pii || "None"}
                      </Badge>
                    </td>
                    
                    {/* BEFORE */}
                    <td className="px-6 align-middle text-center bg-red-50/5">
                      <span className={cn(
                        "text-[13px] font-medium",
                        col.status === "REMOVED" ? "text-red-600 font-bold" : (col.before === "—" ? "text-gray-300" : "text-gray-500")
                      )}>
                        {col.before}
                      </span>
                    </td>

                    {/* AFTER */}
                    <td className="px-6 align-middle text-center bg-green-50/5">
                      <span className={cn(
                        "text-[13px] font-bold",
                        col.status === "ADDED" ? "text-green-700" : (col.after === "Excluded" ? "text-gray-400" : "text-[#161616]")
                      )}>
                        {col.after}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 align-middle text-center">
                      {col.status === "ADDED" && <Badge className="bg-[#DEFBE6] text-[#198038] border border-[#A7F0BA] rounded-sm font-bold text-[10px] px-2 py-0.5">NEW ADDITION</Badge>}
                      {col.status === "REMOVED" && <Badge className="bg-[#FFF1F1] text-[#DA1E28] border border-[#FFD7D9] rounded-sm font-bold text-[10px] px-2 py-0.5">DE-SELECTED</Badge>}
                      {col.status === "UNCHANGED" && <Badge className="bg-gray-50 text-gray-500 border border-gray-200 rounded-sm font-bold text-[10px] px-2 py-0.5 italic">PERSISTED</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#FFFBE6] p-5 border-l-4 border-[#F1C21B] rounded-r-[8px] flex gap-4">
          <Warning size={24} className="text-[#856404] flex-shrink-0" />
          <div className="space-y-1">
            <h5 className="text-[14px] font-bold text-[#856404]">Schema Integrity Advisory</h5>
            <p className="text-[13px] text-[#856404] leading-relaxed">
              Verify that the newly added columns 'AMOUNT' and 'SENDER_ID' do not contain PII unless explicitly marked for encryption at the ingestion layer. Approving this view will re-initialize the data cache for all associated real-time scenarios.
            </p>
          </div>
        </div>
      </div>

      {/* APPROVAL SUCCESS MODAL */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[400px] overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-[#DEFBE6] rounded-full flex items-center justify-center text-[#198038]">
                <CheckmarkFilled size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-[20px] font-bold text-[#161616]">Verification Complete</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                  The View <strong>"{view?.viewName || view?.name}"</strong> has been successfully verified and moved to the active inventory.
                </p>
                <div className="bg-[#F4F4F4] p-4 rounded-md mt-4 text-left border border-gray-200">
                  <span className="text-[11px] text-[#525252] font-bold block mb-1 uppercase tracking-tighter">Reviewer Comment:</span>
                  <p className="text-[13px] text-[#161616] italic font-medium leading-snug">"{comment}"</p>
                </div>
              </div>
              <div className="pt-4 w-full">
                <Button 
                  className="w-full h-[50px] bg-[#2A53A0] hover:bg-[#1E3C75] text-white font-bold rounded-[8px] text-[15px] shadow-lg"
                  onClick={() => {
                    setIsApproveModalOpen(false);
                    onApprove(view.id, comment);
                  }}
                >
                  Return to My Work
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
