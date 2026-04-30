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
  Chat
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import { BreadcrumbNav } from "./breadcrumb-nav";
import PageHeader from "./page-header";
import { toast } from "sonner@2.0.3";
import { Textarea } from "./ui/textarea";

interface VerifyEventPageProps {
  event: any;
  breadcrumbs: any[];
  onBack: () => void;
  onApprove: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
  onBreadcrumbNavigate: (path: string) => void;
}

import imgClari5Loader from "figma:asset/f00e65b2786f070bfa2a235a2ec971d7f5109221.png";

const Clari5Loader = () => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#333333]/50">
    <div className="bg-white w-[211px] h-[100px] rounded-[8px] flex flex-col items-center justify-center gap-2 relative shadow-lg">
      <div className="w-[46px] h-[46px] animate-spin">
        <img src={imgClari5Loader} alt="Loading..." className="w-full h-full object-contain" />
      </div>
      <p className="text-[#333333] text-[16px] font-normal font-sans">Loading....</p>
    </div>
  </div>
);

const SuccessDialog = ({ onContinue, title, message }: { onContinue: () => void, title: string, message: string }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#333333]/50 animate-in fade-in duration-300">
    <div className="bg-white w-[360px] h-[260px] rounded-[8px] overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-300">
      <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-4 px-6 text-center">
        {/* Checkmark Icon */}
        <div className="mb-4">
          <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
            <path 
              d="M18 0C8.06 0 0 8.06 0 18C0 27.94 8.06 36 18 36C27.94 36 36 27.94 36 18C36 8.06 27.94 0 18 0ZM18 33.12C9.66 33.12 2.88 26.34 2.88 18C2.88 9.66 9.66 2.88 18 2.88C26.34 2.88 33.12 9.66 33.12 18C33.12 26.34 26.34 33.12 18 33.12Z" 
              fill="#2A53A0" 
            />
            <path 
              d="M25.74 11.16L15.48 21.42L10.26 16.2L8.28 18.18L15.48 25.38L27.72 13.14L25.74 11.16Z" 
              fill="#2A53A0" 
            />
          </svg>
        </div>
        
        <h2 className="text-[#2A53A0] text-[20px] font-medium mb-2">{title}</h2>
        <div className="text-[#767676] text-[16px] leading-[1.6]">
          {message.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
      
      <button 
        onClick={onContinue}
        className="h-[55px] w-full bg-[#2A53A0] hover:bg-[#1e3c75] text-white text-[16px] font-normal transition-colors flex items-center justify-center"
      >
        Continue
      </button>
    </div>
  </div>
);

export function VerifyEventPage({ event, breadcrumbs, onBack, onApprove, onReject, onBreadcrumbNavigate }: VerifyEventPageProps) {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Use real data from the event object, fall back to default empty if not available
  const fieldChanges = event?.fieldChanges || [
    {
      name: "No changes detected",
      description: "-",
      before: { type: "—", pii: "—", constraint: "—" },
      after: { type: "—", pii: "—", constraint: "—" },
      status: "UNCHANGED"
    }
  ];

  // We'll keep mock config changes for now as they are not explicitly part of the event details edit yet
  const configChanges = [
    {
      property: "Batch Enabled",
      before: "Disabled",
      after: "Enabled",
      status: "MODIFIED"
    }
  ];

  const handleApproveAction = () => {
    if (!comment.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsApproveModalOpen(true);
    }, 2000);
  };

  const handleRejectAction = () => {
    if (!comment.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsRejectModalOpen(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* PERSISTENT HEADER REGION */}
      <div className="flex-none bg-white z-20 border-b border-gray-100">
        <PageHeader 
          title="Verify Event"
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        {/* METADATA BAR */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center">
            <div className="flex items-center gap-2 whitespace-nowrap pr-4">
                <span className="text-[12px] font-normal text-[#525252]">Event Name:</span>
                <span className="text-[13px] font-semibold text-[#161616]">{event?.eventName || "Untitled Event"}</span>
            </div>
            
            <div className="w-[1px] h-4 bg-gray-300 flex-none" />
            
            <div className="flex items-center gap-2 whitespace-nowrap px-4">
                <span className="text-[12px] font-normal text-[#525252]">Status:</span>
                <Badge className="bg-[#fdf4cf] text-[#856404] hover:bg-[#fdf4cf] border-0 font-medium rounded-full px-2.5 h-6 text-[11px] tracking-tight">Pending Review</Badge>
            </div>

            <div className="w-[1px] h-4 bg-gray-300 flex-none" />

            <div className="flex items-center gap-2 whitespace-nowrap px-4">
                <span className="text-[12px] font-normal text-[#525252]">Type:</span>
                <Badge className="bg-[#d0e2ff] text-[#0043ce] hover:bg-[#d0e2ff] border-0 font-medium rounded-full px-2.5 h-6 text-[11px]">Financial Transaction</Badge>
            </div>

            <div className="w-[1px] h-4 bg-gray-300 flex-none" />

            <div className="flex items-center gap-2 min-w-0 flex-1 pl-4">
                <span className="text-[12px] font-normal text-[#525252] whitespace-nowrap">Description:</span>
                <span className="text-[13px] text-[#161616] truncate font-normal" title={event?.description}>
                  {event?.description || "No description provided."}
                </span>
            </div>
        </div>

        {/* ACTION BAR */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
           <div className="flex items-center gap-2">
              <Information size={16} className="text-[#2A53A0]" />
              <span className="text-[13px] text-[#525252]">Review the changes below before finalizing the verification.</span>
           </div>
           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                disabled={!comment.trim() || isLoading}
                className={cn(
                  "h-[46px] px-6 border-gray-300 font-semibold rounded-[8px] text-[14px]",
                  !comment.trim() ? "text-gray-400 bg-gray-50 border-gray-200" : "text-[#da1e28] hover:bg-red-50"
                )}
                onClick={handleRejectAction}
              >
                <CloseFilled size={18} className="mr-2" /> Reject
              </Button>
              <Button 
                disabled={!comment.trim() || isLoading}
                className={cn(
                  "h-[46px] px-8 font-semibold rounded-[8px] shadow-sm text-[14px]",
                  !comment.trim() 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border-0" 
                    : "bg-[#2A53A0] hover:bg-[#1e3c75] text-white"
                )}
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

        {/* EVENT CONFIGURATION SECTION */}
        <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings size={20} className="text-[#2A53A0]" />
              <h3 className="text-[15px] font-bold text-[#161616]">Event Configuration</h3>
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
                {configChanges.map((item, idx) => (
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
              <h3 className="text-[15px] font-bold text-[#161616]">Fields Mapping Comparison</h3>
              <Badge className="bg-orange-100 text-orange-700 border-0 ml-2 font-bold px-2 py-0 h-5">
                {fieldChanges.filter((f: any) => f.status !== 'UNCHANGED').length} changes
              </Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f0f0f0] h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider">
                  <th className="px-6 border-b border-gray-200" colSpan={2}>Field Name</th>
                  <th className="px-6 border-b border-gray-200 text-center bg-red-50/50" colSpan={3}>Before</th>
                  <th className="px-6 border-b border-gray-200 text-center bg-green-50/50" colSpan={3}>After</th>
                  <th className="px-6 border-b border-gray-200 text-center">Status</th>
                </tr>
                <tr className="bg-[#f8f9fa] h-[32px] text-[10px] font-bold text-[#8d8d8d] uppercase border-b border-gray-200">
                  <th className="px-6 border-r border-gray-100">Name</th>
                  <th className="px-6 border-r border-gray-100">Info</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-red-50/30">Type</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-red-50/30">PII</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-red-50/30">Constraint</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-green-50/30">Type</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-green-50/30">PII</th>
                  <th className="px-4 border-r border-gray-100 text-center bg-green-50/30">Constraint</th>
                  <th className="px-6 text-center">Change</th>
                </tr>
              </thead>
              <tbody>
                {fieldChanges.map((field, idx) => (
                  <tr key={idx} className="h-[72px] border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 align-middle border-r border-gray-100">
                      <span className="text-[14px] font-bold text-[#161616]">{field.name}</span>
                    </td>
                    <td className="px-6 align-middle border-r border-gray-100 min-w-[200px]">
                      <span className="text-[12px] text-[#525252] leading-tight block">{field.description}</span>
                    </td>
                    
                    {/* BEFORE COLS */}
                    <td className="px-4 align-middle text-center bg-red-50/10 border-r border-gray-100">
                      <span className={cn("text-[13px] font-mono", field.before?.type && field.before?.type !== "—" && "text-red-500 line-through")}>{field.before?.type || "—"}</span>
                    </td>
                    <td className="px-4 align-middle text-center bg-red-50/10 border-r border-gray-100">
                      {field.before?.pii && field.before?.pii !== "—" && (
                        <Badge variant="outline" className={cn("rounded-sm font-bold text-[10px]", field.before.pii === "YES" ? "text-red-400 border-red-200" : "text-gray-400 border-gray-200")}>
                          {field.before.pii}
                        </Badge>
                      )}
                      {(!field.before?.pii || field.before?.pii === "—") && <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 align-middle text-center bg-red-50/10 border-r border-gray-100">
                      <span className={cn("text-[11px] font-mono", field.before?.constraint && field.before?.constraint !== "—" && "text-red-500 line-through")}>{field.before?.constraint || "—"}</span>
                    </td>

                    {/* AFTER COLS */}
                    <td className="px-4 align-middle text-center bg-green-50/10 border-r border-gray-100">
                      <span className="text-[13px] font-mono font-bold text-green-700">{field.after?.type || "—"}</span>
                    </td>
                    <td className="px-4 align-middle text-center bg-green-50/10 border-r border-gray-100">
                      {field.after?.pii && field.after?.pii !== "—" ? (
                        <Badge className={cn("rounded-sm font-bold text-[10px] border", field.after.pii === "YES" ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200")}>
                          {field.after.pii}
                        </Badge>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 align-middle text-center bg-green-50/10 border-r border-gray-100">
                      <span className="text-[11px] font-mono font-bold text-green-700">{field.after?.constraint || "—"}</span>
                    </td>

                    {/* STATUS COL */}
                    <td className="px-6 align-middle text-center">
                      {(field.status === "MODIFIED" || field.status === "EDIT" || field.status === "CONFIG") && <Badge className="bg-orange-50 text-orange-600 border border-orange-200 rounded-sm font-bold text-[10px]">MODIFIED</Badge>}
                      {(field.status === "ADDED" || field.status === "ADD") && <Badge className="bg-green-50 text-green-600 border border-green-200 rounded-sm font-bold text-[10px]">+ ADDED</Badge>}
                      {(field.status === "REMOVED" || field.status === "DELETE") && <Badge className="bg-red-50 text-red-600 border border-red-200 rounded-sm font-bold text-[10px]">- REMOVED</Badge>}
                      {field.status === "UNCHANGED" && <Badge className="bg-gray-50 text-gray-500 border border-gray-200 rounded-sm font-bold text-[10px]">UNCHANGED</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUBMISSION COMMENTS SECTION */}
        <div className="bg-[#f0f7ff] border border-[#d0e2ff] rounded-[8px] p-6 shadow-sm flex gap-4">
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2A53A0] shrink-0 shadow-sm border border-[#d0e2ff]">
             <Tag size={20} />
           </div>
           <div className="space-y-1">
             <h4 className="text-[14px] font-bold text-[#161616]">Submission Context</h4>
             <p className="text-[13px] text-[#002d9c] leading-relaxed italic">
               "Added beneficiary account field as per the new cross-border transaction mandate. Also updated the batch frequency to 2 hours for better reconciliation speed."
             </p>
             <div className="flex items-center gap-2 pt-2 text-[11px] text-[#0043ce] font-medium">
               <span>Submitted by Rajesh Kumar</span>
               <span>•</span>
               <span>Yesterday, 4:45 PM</span>
             </div>
           </div>
        </div>

        <div className="bg-[#fffbe6] p-4 border-l-4 border-[#f1c21b] rounded-r-[8px] flex gap-3 mb-6">
          <Warning size={20} className="text-[#856404] flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#856404] leading-relaxed">
            Please verify the technical identifiers and data types carefully. Once approved, these changes will be live and will impact all dependent scenarios and monitoring rules.
          </p>
        </div>
      </div>

      {/* Loader */}
      {isLoading && <Clari5Loader />}

      {/* APPROVAL SUCCESS MODAL */}
      {isApproveModalOpen && (
        <SuccessDialog 
          title="Success"
          message={`Event Successfully\nApproved`}
          onContinue={() => {
            setIsApproveModalOpen(false);
            onApprove(event.id, comment);
          }}
        />
      )}

      {/* REJECTION SUCCESS MODAL */}
      {isRejectModalOpen && (
        <SuccessDialog 
          title="Rejected"
          message={`Event Successfully\nRejected`}
          onContinue={() => {
            setIsRejectModalOpen(false);
            onReject(event.id, comment);
          }}
        />
      )}
    </div>
  );
}
