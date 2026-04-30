import React, { useState } from "react";
import { 
  CheckmarkFilled, 
  CloseFilled, 
  Information,
  Chat,
  Settings,
  Add,
  Edit,
  TrashCan
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import PageHeader from "./page-header";
import { toast } from "sonner@2.0.3";
import { Textarea } from "./ui/textarea";
import { Clari5Loader } from "./clari5-loader";
import { SuccessDialog } from "./success-dialog";

interface VerifySettingsPageProps {
  settings: any;
  breadcrumbs: any[];
  onBack: () => void;
  onApprove: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
  onBreadcrumbNavigate: (path: string) => void;
}

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

export function VerifySettingsPage({
  settings,
  breadcrumbs,
  onBack,
  onApprove,
  onReject,
  onBreadcrumbNavigate
}: VerifySettingsPageProps) {
  const [comment, setComment] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!settings) {
    return (
      <div className="flex flex-col h-full bg-white">
        <PageHeader 
          title="Verify Settings" 
          breadcrumbs={breadcrumbs} 
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate} 
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Settings configuration not found</p>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    if (!comment.trim()) {
      toast.error("Please add a comment before approving");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsApproveModalOpen(true);
    }, 2000);
  };

  const handleReject = () => {
    if (!comment.trim()) {
      toast.error("Please add a comment before rejecting");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsRejectModalOpen(true);
    }, 2000);
  };

  const fieldChanges = settings.fieldChanges || [];

  return (
    <div className="flex flex-col h-full bg-[#F4F4F4] overflow-hidden font-['Inter']">
      {/* PERSISTENT HEADER REGION */}
      <div className="flex-none bg-white z-20 border-b border-gray-200 shadow-sm">
        <PageHeader 
          title="Verify Settings Configuration" 
          breadcrumbs={breadcrumbs} 
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate} 
        />

        {/* METADATA BAR (Basic Info) */}
        <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 whitespace-nowrap pr-4">
            <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider">Configuration ID:</span>
            <span className="text-[13px] font-bold text-[#2A53A0]">{settings?.id}</span>
          </div>
          <div className="w-[1px] h-3 bg-gray-300 flex-none" />
          <div className="flex items-center gap-2 whitespace-nowrap px-4">
            <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider">Workspace:</span>
            <span className="text-[13px] font-bold text-[#161616]">{settings?.workspaceName}</span>
          </div>
          <div className="w-[1px] h-3 bg-gray-300 flex-none" />
          <div className="flex items-center gap-2 whitespace-nowrap px-4">
            <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider">Configuration Type:</span>
            <Badge className="bg-purple-100 text-purple-700 border-0 font-bold rounded-sm px-2 h-5 text-[10px] uppercase">Settings</Badge>
          </div>
          <div className="w-[1px] h-3 bg-gray-300 flex-none" />
          <div className="flex items-center gap-2 px-4 min-w-0 flex-1">
            <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider whitespace-nowrap">Submitted By:</span>
            <span className="text-[13px] text-[#161616] truncate">{settings?.submittedBy || "Current User"}</span>
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
              onClick={handleReject}
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
              onClick={handleApprove}
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
                {settings?.changes?.length || 0} Changes
              </Badge>
            </div>
            <div className="p-6 space-y-3">
              {settings?.changes && settings.changes.length > 0 ? (
                settings.changes.map((change: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                    <Information size={16} className="text-[#2A53A0] mt-0.5 shrink-0" />
                    <span className="text-[14px] text-[#161616] leading-relaxed">{change}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Settings size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-[13px]">No configuration changes detected</p>
                </div>
              )}
            </div>
          </div>

          {/* 3. DETAILED ACTION ITEMS */}
          {fieldChanges && fieldChanges.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings size={20} className="text-[#2A53A0]" />
                  <h3 className="text-[15px] font-bold text-[#161616]">Detailed Action Items</h3>
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-0 font-bold px-2 py-0.5 text-[10px] uppercase">
                  {fieldChanges.length} {fieldChanges.length === 1 ? 'Action' : 'Actions'}
                </Badge>
              </div>
              <div className="divide-y divide-gray-100">
                {fieldChanges.map((item: any, idx: number) => (
                  <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        {getChangeIcon(item.tag || item.status || "MODIFIED")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[14px] font-bold text-[#161616]">{item.title || item.name}</h4>
                          <Badge className={cn(
                            "text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm",
                            getChangeBadgeStyle(item.tag || item.status || "MODIFIED")
                          )}>
                            {item.tag || item.status || "MODIFIED"}
                          </Badge>
                        </div>
                        <p className="text-[13px] text-[#525252] leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
            onApprove(settings.id, comment);
            // Navigation handled by onApprove
          }}
          title="Configuration Approved"
          message="Settings configuration has been approved."
        />
      )}

      {isRejectModalOpen && (
        <SuccessDialog 
          onContinue={() => {
            setIsRejectModalOpen(false);
            onReject(settings.id, comment);
            onBack();
          }}
          title="Configuration Rejected"
          message="Settings configuration has been rejected."
        />
      )}
    </div>
  );
}
