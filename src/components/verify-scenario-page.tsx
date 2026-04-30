import React, { useState } from "react";
import { 
  CheckmarkFilled, 
  CloseFilled, 
  Warning, 
  Settings, 
  Information,
  Chat,
  Flow,
  Flash,
  Email,
  Alarm,
  View,
  TrafficEvent
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import PageHeader from "./page-header";
import { toast } from "sonner@2.0.3";
import { Textarea } from "./ui/textarea";

interface VerifyScenarioPageProps {
  scenario: any;
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

export function VerifyScenarioPage({ scenario, breadcrumbs, onBack, onApprove, onReject, onBreadcrumbNavigate }: VerifyScenarioPageProps) {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock detailed scenario data for verification
  const scenarioDetails = {
    triggers: [
      { event: "ACH_TRANSFER_SUBMITTED", type: "Transaction", status: "UNCHANGED" },
      { event: "WIRE_TRANSFER_INITIATED", type: "Transaction", status: "ADDED" }
    ],
    preconditions: [
      { field: "Account Status", operator: "EQUALS", value: "ACTIVE", status: "UNCHANGED" },
      { field: "KYC Level", operator: "GREATER_THAN", value: "1", status: "MODIFIED", before: "0" }
    ],
    conditions: [
      { logic: "Velocity Check", description: "Number of transfers in last 24h", operator: ">", value: "10", status: "MODIFIED", before: "5" },
      { logic: "Amount Check", description: "Aggregate amount in last 24h", operator: ">", value: "50,000", status: "UNCHANGED" },
      { logic: "Country Check", description: "Beneficiary bank country is high risk", operator: "IN", value: "FATF_LIST", status: "ADDED" }
    ],
    actions: [
      { type: "Generate Alert", priority: "High", queue: "Fraud Investigation", status: "UNCHANGED" },
      { type: "Hold Transaction", duration: "4 Hours", status: "ADDED" }
    ],
    messages: [
      { channel: "SMS", template: "ALERT_CUSTOMER_FRAUD", language: "English", status: "MODIFIED", before: "STD_NOTIFICATION" },
      { channel: "Email", template: "SUSPICIOUS_ACTIVITY_ADVISORY", language: "Multiple", status: "UNCHANGED" }
    ]
  };

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
          title="Verify Scenario"
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        {/* METADATA BAR (Basic Info) */}
        <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 whitespace-nowrap pr-4">
                <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider">Scenario ID:</span>
                <span className="text-[13px] font-bold text-[#2A53A0]">{scenario?.id}</span>
            </div>
            <div className="w-[1px] h-3 bg-gray-300 flex-none" />
            <div className="flex items-center gap-2 whitespace-nowrap px-4">
                <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider">Name:</span>
                <span className="text-[13px] font-bold text-[#161616]">{scenario?.name}</span>
            </div>
            <div className="w-[1px] h-3 bg-gray-300 flex-none" />
            <div className="flex items-center gap-2 whitespace-nowrap px-4">
                <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider">Risk Weight:</span>
                <Badge className={cn(
                  "border-0 font-bold rounded-sm px-2 h-5 text-[10px] uppercase",
                  scenario?.riskWeight > 80 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                )}>{scenario?.riskWeight}</Badge>
            </div>
            <div className="w-[1px] h-3 bg-gray-300 flex-none" />
            <div className="flex items-center gap-2 px-4 min-w-0 flex-1">
                <span className="text-[11px] font-medium text-[#525252] uppercase tracking-wider whitespace-nowrap">Description:</span>
                <span className="text-[13px] text-[#161616] truncate italic">"{scenario?.description}"</span>
            </div>
        </div>

        {/* ACTION BAR */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
           <div className="flex items-center gap-2 text-[#525252]">
              <Information size={16} className="text-[#2A53A0]" />
              <span className="text-[13px]">Mandatory logic verification and audit trail required for production promotion.</span>
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

          {/* 2. TRIGGERS SECTION */}
          <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flash size={20} className="text-[#2A53A0]" />
                <h3 className="text-[15px] font-bold text-[#161616]">Detection Triggers</h3>
              </div>
              <Badge className="bg-white border border-gray-200 text-[#525252] px-3 py-1 text-[11px] font-bold uppercase">{scenarioDetails.triggers.length} Active</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6">Triggering Event</th>
                    <th className="px-6">Category Type</th>
                    <th className="px-6 text-center">Version Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioDetails.triggers.map((item, idx) => (
                    <tr key={idx} className="h-[46px] border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 text-[13px] font-semibold text-[#161616]">{item.event}</td>
                      <td className="px-6 text-[13px] text-[#525252]">{item.type}</td>
                      <td className="px-6 text-center">
                        <Badge className={cn(
                          "rounded-sm font-bold text-[10px] px-2 py-0.5 uppercase",
                          item.status === "ADDED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        )}>{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. PRECONDITIONS SECTION */}
          <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center gap-2">
              <Settings size={20} className="text-[#2A53A0]" />
              <h3 className="text-[15px] font-bold text-[#161616]">Execution Pre-Conditions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6">Target Field</th>
                    <th className="px-6">Operator</th>
                    <th className="px-6">Required Value</th>
                    <th className="px-6 text-center">Change Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioDetails.preconditions.map((item, idx) => (
                    <tr key={idx} className="h-[46px] border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 text-[13px] font-semibold text-[#161616]">{item.field}</td>
                      <td className="px-6 text-[13px] font-mono text-[#525252]">{item.operator}</td>
                      <td className="px-6 text-[13px] text-[#161616]">
                        {item.status === "MODIFIED" && <span className="text-red-500 line-through mr-2">{item.before}</span>}
                        <span className={cn(item.status === "MODIFIED" && "text-green-600 font-bold")}>{item.value}</span>
                      </td>
                      <td className="px-6 text-center">
                        <Badge className={cn(
                          "rounded-sm font-bold text-[10px] px-2 py-0.5 uppercase",
                          item.status === "MODIFIED" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
                        )}>{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. CONDITIONS SECTION */}
          <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center gap-2">
              <Flow size={20} className="text-[#2A53A0]" />
              <h3 className="text-[15px] font-bold text-[#161616]">Scenario Logic & Thresholds</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6">Logic Point</th>
                    <th className="px-6">Comparison</th>
                    <th className="px-6">Threshold Value</th>
                    <th className="px-6 text-center">Audit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioDetails.conditions.map((item, idx) => (
                    <tr key={idx} className="h-[56px] border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#161616]">{item.logic}</span>
                          <span className="text-[11px] text-[#525252] leading-tight">{item.description}</span>
                        </div>
                      </td>
                      <td className="px-6 text-[13px] font-mono text-[#525252]">{item.operator}</td>
                      <td className="px-6 text-[13px] font-semibold text-[#161616]">
                        {item.status === "MODIFIED" && <span className="text-red-500 line-through mr-2">{item.before}</span>}
                        <span className={cn(item.status === "MODIFIED" ? "text-green-600 font-bold" : item.status === "ADDED" ? "text-blue-600 font-bold" : "")}>
                          {item.value}
                        </span>
                      </td>
                      <td className="px-6 text-center">
                        <Badge className={cn(
                          "rounded-sm font-bold text-[10px] px-2 py-0.5 uppercase",
                          item.status === "MODIFIED" ? "bg-orange-100 text-orange-700" : item.status === "ADDED" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                        )}>{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. ACTIONS SECTION */}
          <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center gap-2">
              <Alarm size={20} className="text-[#2A53A0]" />
              <h3 className="text-[15px] font-bold text-[#161616]">Outcome Actions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6">Execution Outcome</th>
                    <th className="px-6">Parameters & Routing</th>
                    <th className="px-6 text-center">Change Detection</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioDetails.actions.map((item, idx) => (
                    <tr key={idx} className="h-[46px] border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 text-[13px] font-semibold text-[#161616]">{item.type}</td>
                      <td className="px-6 text-[13px] text-[#525252]">
                        {item.priority && `Priority: ${item.priority}`}
                        {item.duration && `Hold: ${item.duration}`}
                        {item.queue && ` | Queue: ${item.queue}`}
                      </td>
                      <td className="px-6 text-center">
                        <Badge className={cn(
                          "rounded-sm font-bold text-[10px] px-2 py-0.5 uppercase",
                          item.status === "ADDED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        )}>{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. MESSAGES SECTION */}
          <div className="bg-white border border-gray-200 rounded-[8px] shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-[#F4F4F4] border-b border-gray-200 flex items-center gap-2">
              <Email size={20} className="text-[#2A53A0]" />
              <h3 className="text-[15px] font-bold text-[#161616]">Notification Templates</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white h-[40px] text-[11px] font-bold text-[#525252] uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6">Communication Channel</th>
                    <th className="px-6">Template Configuration</th>
                    <th className="px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioDetails.messages.map((item, idx) => (
                    <tr key={idx} className="h-[46px] border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 text-[13px] font-semibold text-[#161616]">{item.channel}</td>
                      <td className="px-6 text-[13px] text-[#525252]">
                        {item.status === "MODIFIED" && <span className="text-red-500 line-through mr-2">{item.before}</span>}
                        <span className={cn(item.status === "MODIFIED" && "text-[#2A53A0] font-bold")}>{item.template}</span>
                        <span className="ml-2 text-[11px] bg-gray-100 px-1.5 rounded text-[#525252]">[{item.language || "English"}]</span>
                      </td>
                      <td className="px-6 text-center">
                        <Badge className={cn(
                          "rounded-sm font-bold text-[10px] px-2 py-0.5 uppercase",
                          item.status === "MODIFIED" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
                        )}>{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* WARNING BANNER AT BOTTOM */}
          <div className="bg-[#fffbe6] p-5 border-l-4 border-[#f1c21b] rounded-r-[8px] flex gap-4 shadow-sm">
            <Warning size={24} className="text-[#856404] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[14px] font-bold text-[#856404]">Production Activation Warning</h4>
              <p className="text-[12px] text-[#856404] leading-relaxed">
                By approving this scenario, you authorize the immediate deployment of these logic changes to the production detection engine. This action is irreversible and will impact live transaction monitoring.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loader */}
      {isLoading && <Clari5Loader />}

      {/* APPROVAL SUCCESS MODAL */}
      {isApproveModalOpen && (
        <SuccessDialog 
          title="Success"
          message={`Scenario Successfully\nApproved`}
          onContinue={() => {
            setIsApproveModalOpen(false);
            onApprove(scenario.id, comment);
          }}
        />
      )}

      {/* REJECTION SUCCESS MODAL */}
      {isRejectModalOpen && (
        <SuccessDialog 
          title="Rejected"
          message={`Scenario Successfully\nRejected`}
          onContinue={() => {
            setIsRejectModalOpen(false);
            onReject(scenario.id, comment);
          }}
        />
      )}
    </div>
  );
}
