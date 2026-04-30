import React from "react";
import { 
  Earth, 
  Purchase, 
  Portfolio, 
  Flash, 
  Email, 
  Phone, 
  Location, 
  User, 
  Document,
  ArrowLeft,
  Information,
  Calendar,
  Tag,
  CheckmarkFilled,
  WarningFilled,
  Building,
  Terminal,
  Identification,
  Timer,
  UserAvatar,
  Chat,
  Launch
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import { LOOKUP_TABLES_DATA } from "./lookup-tables-page";
import PageHeader from "./page-header";

interface FieldGroupProps {
  title: string;
  fields: { label: string; value: string | React.ReactNode; icon?: any }[];
}

function FieldGroup({ title, fields }: FieldGroupProps) {
  return (
    <div className="mb-4 last:mb-0">
      {/* Property Grid - Flat integrated layout without heading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
        {fields.map((field, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between min-h-[36px] border-b border-gray-50 group hover:bg-gray-50/50 transition-colors px-1"
          >
            {/* Minimalist Label */}
            <span className="text-[12px] text-gray-500 font-medium shrink-0">
              {field.label}
            </span>
            
            {/* Value Area */}
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
  );
}

interface LookupTableEntryViewProps {
  entryId: string;
  onBack: () => void;
  onBreadcrumbNavigate: (path: string) => void;
  breadcrumbs: any[];
}

export function LookupTableEntryView({ 
  entryId, 
  onBack,
  onBreadcrumbNavigate,
  breadcrumbs
}: LookupTableEntryViewProps) {
  // Find the item from mock data
  const item = LOOKUP_TABLES_DATA.find(i => i.id === entryId) || LOOKUP_TABLES_DATA[0];

  const getTypeIcon = (type: string) => {
    const t = type.toUpperCase();
    if (t === "COUNTRY") return Earth;
    if (t === "BIN" || t === "CARD") return Purchase;
    if (t === "ACCOUNT") return Portfolio;
    if (t === "IP" || t === "IP_ADDRESS") return Flash;
    if (t === "EMAIL") return Email;
    if (t === "PHONE") return Phone;
    if (t === "LOCATION") return Location;
    if (t === "CUSTOMER") return User;
    if (t === "MERCHANT") return Building;
    if (t === "DEVICE_ID") return Terminal;
    return Document;
  };

  const getStatusBadge = (status: string) => {
    const baseStyles = "h-[28px] flex items-center justify-center rounded-full font-bold text-[10px] px-3 w-fit whitespace-nowrap border-0 uppercase gap-1.5";
    switch (status) {
      case "Verified": return (
        <span className={cn(baseStyles, "bg-[#DEFBE6] text-[#198038]")}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#198038]" />
          Active
        </span>
      );
      case "Rejected": return (
        <span className={cn(baseStyles, "bg-[#FFF1F1] text-[#DA1E28]")}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#DA1E28]" />
          Rejected
        </span>
      );
      case "Draft": return (
        <span className={cn(baseStyles, "bg-[#F4F4F4] text-[#525252]")}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#525252]" />
          Draft
        </span>
      );
      case "Pending Approval": return (
        <span className={cn(baseStyles, "bg-[#FFF9E5] text-[#B28600]")}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#B28600]" />
          Pending
        </span>
      );
      default: return <span className={cn(baseStyles, "bg-gray-100 text-gray-700")}>{status}</span>;
    }
  };

  const Icon = getTypeIcon(item.type);

  return (
    <div className="flex flex-col h-full w-full bg-white font-['Inter'] overflow-hidden">
      {/* Top Navigation */}
      <div className="flex-none">
        <PageHeader 
          title="Record Details"
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        {/* Unified Metadata Bar - Updated to match Reference Image */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center h-[52px] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 whitespace-nowrap pr-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-bold text-[#525252] tracking-wider">Entity ID:</span>
            <span className="text-[13px] font-semibold text-[#161616]">{item.entityId}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-bold text-[#525252] tracking-wider">Entity Type:</span>
            <Badge className="bg-[#f4f4f4] text-[#161616] border-0 px-3 h-[28px] text-[11px] font-medium rounded-md flex items-center gap-1.5">
              <Icon size={14} className="text-[#2A53A0]" />
              {item.type}
            </Badge>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-bold text-[#525252] tracking-wider">Entity Value:</span>
            <div className="text-[13px] font-semibold text-[#161616]">
              {item.value}
            </div>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 flex-none">
            <span className="text-[12px] font-bold text-[#525252] tracking-wider">Status:</span>
            <div className="flex items-center h-[28px]">
              {getStatusBadge(item.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <div className="space-y-4">
          
          {/* Main Details Section - Grouped with Border */}
          <div className="border border-gray-200 rounded-lg bg-gray-50/30 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-100 bg-white">
              <h3 className="text-[12px] font-bold text-[#2A53A0] uppercase tracking-wider">Record Information</h3>
            </div>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
                {[
                  { label: "Start Date", value: item.startDate, icon: Calendar },
                  { label: "End Date", value: item.endDate, icon: Timer },
                  { label: "Created By", value: item.createdBy, icon: UserAvatar },
                  { label: "Created Date", value: item.createdDate, icon: Calendar },
                  { label: "Comments", value: item.comments || "Annual review completed", icon: Chat },
                  { label: "Audit Status", value: item.status === "Verified" ? "Active" : item.status, icon: CheckmarkFilled },
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

          {/* Reason Section - Moved to Last with Border */}
          <div className="border border-gray-200 rounded-lg bg-gray-50/30 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-100 bg-white">
              <h3 className="text-[12px] font-bold text-[#2A53A0] uppercase tracking-wider">Governance Reason</h3>
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-start gap-3">
                <Document size={16} className="text-[#2A53A0] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <span className="text-[12px] text-gray-500 font-medium">Justification / Reason</span>
                  <p className="text-[13px] text-[#161616] font-medium leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scenarios Mapped Section - Consistent Heading Style */}

          {/* Scenarios Mapped Section - Bordered Container Design */}
          {item.scenariosCount && item.scenariosCount > 0 ? (
            <div className="border border-gray-200 rounded-lg bg-gray-50/30 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Earth size={16} className="text-[#2A53A0]" />
                  <h3 className="text-[12px] font-bold text-[#2A53A0] uppercase tracking-wider">
                    Scenarios Mapped ({item.scenariosCount})
                  </h3>
                </div>
                <span className="text-[11px] text-gray-400 font-medium italic">Detection logic currently utilizing this entry</span>
              </div>
              
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { title: "High Value Card Transaction - Online", description: "Detects high-value online card transactions above threshold to identify potential fraud" },
                    { title: "Rapid Transaction Velocity Check", description: "Monitors transaction frequency and velocity patterns to catch card testing" },
                    { title: "Cross-Border Transaction Anomaly", description: "Identifies unusual cross-border transaction patterns that deviate from customer normal behavior" },
                    { title: "New Merchant First Transaction", description: "Flags first-time transactions with new merchants that may indicate compromised card usage" }
                  ].slice(0, item.scenariosCount).map((scenario, idx) => (
                    <div key={idx} className="p-3 bg-gray-50/50 border border-gray-100 rounded-[6px] hover:border-[#2A53A0]/30 hover:bg-white transition-all group flex justify-between items-start">
                      <div className="space-y-1 flex-1 pr-6">
                        <h4 className="text-[13px] font-bold text-[#161616] group-hover:text-[#2A53A0] cursor-pointer flex items-center gap-2">
                          {scenario.title}
                        </h4>
                        <p className="text-[12px] text-[#525252] leading-snug">
                          {scenario.description}
                        </p>
                      </div>
                      <button className="text-gray-300 group-hover:text-[#2A53A0] transition-colors p-1 flex-none">
                        <Launch size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Footer Warning */}
          <div className="pt-6 flex items-center gap-2 text-gray-400 italic text-[12px]">
            <Information size={14} />
            <span>Reference data is utilized for real-time risk assessment across {item.scenariosCount || 'all'} active scenarios.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
