import React, { useState } from "react";
import { 
  CheckmarkFilled, 
  CloseFilled, 
  Information,
  Chat,
  Workspace,
  Settings,
  Add,
  Edit,
  TrashCan,
  Locked
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import PageHeader from "./page-header";
import { toast } from "sonner@2.0.3";
import { Textarea } from "./ui/textarea";

interface VerifyWorkspacePageProps {
  workspace: any;
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
        className="h-[64px] w-full bg-[#2A53A0] hover:bg-[#1e3c75] text-white text-[16px] font-normal transition-colors flex items-center justify-center"
      >
        Continue
      </button>
    </div>
  </div>
);

const getChangeIcon = (status: string) => {
  switch (status.toUpperCase()) {
    case "ADD":
    case "ADDED":
      return <Add size={14} className="text-green-700" />;
    case "EDIT":
    case "MODIFIED":
    case "UPDATED":
      return <Edit size={14} className="text-blue-700" />;
    case "REMOVE":
    case "REMOVED":
    case "DELETED":
      return <TrashCan size={14} className="text-red-700" />;
    case "CONFIG":
    case "CONFIGURED":
      return <Settings size={14} className="text-purple-700" />;
    default:
      return <Settings size={14} className="text-gray-700" />;
  }
};

const getChangeBadgeStyle = (status: string) => {
  switch (status.toUpperCase()) {
    case "ADD":
    case "ADDED":
      return "bg-green-100 text-green-700";
    case "EDIT":
    case "MODIFIED":
    case "UPDATED":
      return "bg-blue-100 text-blue-700";
    case "REMOVE":
    case "REMOVED":
    case "DELETED":
      return "bg-red-100 text-red-700";
    case "CONFIG":
    case "CONFIGURED":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export function VerifyWorkspacePage({ workspace, breadcrumbs, onBack, onApprove, onReject, onBreadcrumbNavigate }: VerifyWorkspacePageProps) {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="flex flex-col h-full bg-[#F4F4F4] overflow-hidden font-['Inter']">
      {/* PERSISTENT HEADER REGION */}
      <div className="flex-none bg-white z-20 border-b border-gray-200 shadow-sm">
        <PageHeader 
          title="Verify Workspace Configuration"
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        {/* METADATA BAR (Basic Info) */}
        <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 whitespace-nowrap pr-4">
                <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider">Configuration ID:</span>
                <span className="text-[13px] font-bold text-[#2A53A0]">{workspace?.id}</span>
            </div>
            <div className="w-[1px] h-3 bg-gray-300 flex-none" />
            <div className="flex items-center gap-2 whitespace-nowrap px-4">
                <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider">Workspace:</span>
                <span className="text-[13px] font-bold text-[#161616]">{workspace?.workspaceName}</span>
            </div>
            <div className="w-[1px] h-3 bg-gray-300 flex-none" />
            <div className="flex items-center gap-2 whitespace-nowrap px-4">
                <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider">Configuration Type:</span>
                <Badge className={cn(
                  "border-0 font-bold rounded-sm px-2 h-5 text-[10px] uppercase",
                  workspace?.keyType === "conditional" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                )}>{workspace?.type || "Default Key"}</Badge>
            </div>
            <div className="w-[1px] h-3 bg-gray-300 flex-none" />
            <div className="flex items-center gap-2 px-4 min-w-0 flex-1">
                <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider whitespace-nowrap">Submitted By:</span>
                <span className="text-[13px] text-[#161616] truncate">{workspace?.submittedBy || "Current User"}</span>
            </div>
        </div>

        {/* ACTION BAR */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
           <div className="flex items-center gap-2 text-[#525252]">
              <Information size={16} className="text-[#2A53A0]" />
              <span className="text-[13px]">Mandatory configuration verification and audit trail required for production promotion.</span>
           </div>
           <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                disabled={!comment.trim() || isLoading}
                className={cn(
                  "h-[36px] px-4 border-gray-300 font-bold rounded-[4px] text-[13px]",
                  !comment.trim() ? "text-gray-400 bg-gray-50 border-gray-200" : "text-[#da1e28] hover:bg-red-50"
                )}
                onClick={handleRejectAction}
              >
                <CloseFilled size={16} className="mr-2" /> Reject
              </Button>
              <Button 
                disabled={!comment.trim() || isLoading}
                className={cn(
                  "h-[36px] px-6 font-bold rounded-[4px] shadow-sm text-[13px]",
                  !comment.trim() 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border-0" 
                    : "bg-[#2A53A0] hover:bg-[#1e3c75] text-white"
                )}
                onClick={handleApproveAction}
              >
                <CheckmarkFilled size={16} className="mr-2" /> Approve
              </Button>
           </div>
        </div>
      </div>

      {/* FULL WIDTH SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto bg-[#F4F4F4]">
        <div className="max-w-[1400px] mx-auto p-4 space-y-4">
          
          {/* 1. REVIEWER COMMENTS (NOW AT FIRST) */}
          <div className="bg-white border border-[#e0e0e0] rounded-[8px] shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Chat size={20} className="text-[#2A53A0]" />
                <h3 className="text-[16px] font-bold text-[#161616]">Mandatory Audit Comments</h3>
              </div>
              <Badge className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Required Field</Badge>
            </div>
            <Textarea 
              placeholder="Provide a detailed justification for your verification decision (Approval or Rejection). These notes will be persisted in the audit log."
              className="min-h-[100px] text-[14px] border-gray-300 focus:ring-[#2A53A0] focus:border-[#2A53A0] rounded-sm resize-none bg-white placeholder:text-gray-400"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* 2. CONFIGURATION SUMMARY */}
          <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-[#2A53A0]" />
                <h3 className="text-[15px] font-bold text-[#161616]">Configuration Changes</h3>
              </div>
              <Badge className="bg-white border border-gray-200 text-[#525252] px-3 py-1 text-[11px] font-bold uppercase">
                {workspace?.changes?.length || 0} Changes
              </Badge>
            </div>
            <div className="p-6 space-y-3">
              {workspace?.changes && workspace.changes.length > 0 ? (
                workspace.changes.map((change: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                    <Information size={16} className="text-[#2A53A0] mt-0.5 shrink-0" />
                    <span className="text-[13px] text-[#161616] leading-relaxed">{change}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400 text-[13px]">No configuration changes recorded</div>
              )}
            </div>
          </div>

          {/* 3. DETAILED FIELD CHANGES */}
          {workspace?.fieldChanges && workspace.fieldChanges.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Workspace size={20} className="text-[#2A53A0]" />
                  <h3 className="text-[15px] font-bold text-[#161616]">Field-Level Changes</h3>
                </div>
                <Badge className="bg-white border border-gray-200 text-[#525252] px-3 py-1 text-[11px] font-bold uppercase">
                  {workspace.fieldChanges.length} Fields Modified
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider border-b border-gray-100">
                      <th className="px-6">Field Name</th>
                      <th className="px-6">Change Type</th>
                      <th className="px-6">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspace.fieldChanges.map((item: any, idx: number) => (
                      <tr key={idx} className="h-[46px] border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 text-[13px] font-semibold text-[#161616]">{item.name}</td>
                        <td className="px-6">
                          <Badge className={cn(
                            "rounded-sm font-bold text-[10px] px-2 py-0.5 uppercase inline-flex items-center gap-1",
                            getChangeBadgeStyle(item.status)
                          )}>
                            {getChangeIcon(item.status)}
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-6 text-[13px] text-[#525252]">{item.description || "No description provided"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. KEY ATTRIBUTES (For Default Key) */}
          {workspace?.keyType === "default" && workspace?.selectedAttributes && (
            <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Locked size={20} className="text-[#2A53A0]" />
                  <h3 className="text-[15px] font-bold text-[#161616]">Default Key Attributes</h3>
                </div>
                <Badge className="bg-white border border-gray-200 text-[#525252] px-3 py-1 text-[11px] font-bold uppercase">
                  {workspace.selectedAttributes.length} Selected
                </Badge>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {workspace.selectedAttributes.map((attr: string, idx: number) => (
                    <Badge key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 text-[12px] font-semibold">
                      {attr}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. CONDITIONAL RULES (For Conditional Key) */}
          {workspace?.keyType === "conditional" && workspace?.rules && workspace.rules.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings size={20} className="text-[#2A53A0]" />
                  <h3 className="text-[15px] font-bold text-[#161616]">Conditional Key Rules</h3>
                </div>
                <Badge className="bg-white border border-gray-200 text-[#525252] px-3 py-1 text-[11px] font-bold uppercase">
                  {workspace.rules.length} Rules Defined
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider border-b border-gray-100">
                      <th className="px-6">Priority</th>
                      <th className="px-6">Condition</th>
                      <th className="px-6">Key Attributes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspace.rules.map((rule: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-[13px] font-semibold text-[#161616]">Rule {idx + 1}</td>
                        <td className="px-6 py-3 text-[13px] text-[#525252]">
                          <div className="space-y-1">
                            {rule.conditions?.map((cond: any, cidx: number) => (
                              <div key={cidx} className="text-[12px] bg-gray-50 px-2 py-1 rounded">
                                {cond.field} {cond.operator} {cond.value}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-[13px] text-[#525252]">
                          <div className="flex flex-wrap gap-1">
                            {rule.keyFields?.map((field: string, fidx: number) => (
                              <Badge key={fidx} className="bg-purple-50 text-purple-700 border-0 text-[10px] px-2 py-0.5">
                                {field}
                              </Badge>
                            ))}
                          </div>
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

      {/* Loading Overlay */}
      {isLoading && <Clari5Loader />}

      {/* Success Dialogs */}
      {isApproveModalOpen && (
        <SuccessDialog 
          onContinue={() => {
            setIsApproveModalOpen(false);
            onApprove(workspace.id, comment);
            // onBack is removed - navigation handled by onApprove
          }}
          title="Configuration Approved"
          message="Workspace configuration has been approved."
        />
      )}

      {isRejectModalOpen && (
        <SuccessDialog 
          onContinue={() => {
            setIsRejectModalOpen(false);
            onReject(workspace.id, comment);
            onBack();
          }}
          title="Configuration Rejected"
          message="Workspace configuration has been rejected."
        />
      )}
    </div>
  );
}