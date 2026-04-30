import { useState, useMemo } from "react";
import { 
  CheckmarkFilled, 
  Document, 
  Tag,
  SettingsAdjust,
  Chat,
  Information
} from "@carbon/icons-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TemplateItem } from "./templates-page";
import PageHeader from "./page-header";
import { cn } from "./ui/utils";

interface TemplateUsePageProps {
  template: TemplateItem | undefined;
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
  onBack: () => void;
  onCreateScenario: (template: TemplateItem, config: any) => void;
}

const ENTITY_CONFIGS: Record<string, { 
  events: string[], 
  ipvs: string[], 
  views: string[], 
  tags: string[],
  params: string[],
  alert: string 
}> = {
  Customer: {
    events: ["FT_Transaction", "FT_AccountTransaction", "NF_Login", "NF_PasswordChange", "NF_ProfileUpdate", "NF_BeneficiaryAdded", "NF_AccountOpened", "NF_CustomerCreated"],
    ipvs: ["CUSTOMER_ID", "CUSTOMER_RISK_SCORE", "CUSTOMER_SEGMENT", "ACCOUNT_ID", "ACCOUNT_BALANCE", "ACCOUNT_TYPE", "TRANSACTION_AMOUNT", "TRANSACTION_CHANNEL", "TRANSACTION_TYPE", "CARD_NUMBER", "CARD_TYPE", "CARD_LIMIT", "BENEFICIARY_ID", "BENEFICIARY_ACCOUNT", "DEVICE_ID", "MERCHANT_ID", "MERCHANT_CATEGORY_CODE", "CHANNEL_NAME"],
    views: ["VW_CUSTOMER_PROFILE_CHANGES", "VW_CUSTOMER_TRANSACTION_SUMMARY", "VW_CUSTOMER_RISK_INDICATORS", "VW_ACCOUNT_ACTIVITY_SUMMARY", "VW_ACCOUNT_BALANCE_HISTORY", "VW_CARD_TRANSACTION_PATTERNS", "VW_BENEFICIARY_LIST", "VW_BENEFICIARY_ACTIVITY", "VW_TRANSACTION_DETAILS"],
    tags: ["Customer-Level", "Multi-Event"],
    params: ["Lookback Period (Days)", "Threshold Amount (USD)", "Deviation Percentage (%)", "Minimum Transaction Count"],
    alert: "Potential suspicious activity detected for Customer {CUSTOMER_ID}. High volume of transactions ({TXN_COUNT}) observed within {LOOKBACK_PERIOD} days, exceeding threshold of {THRESHOLD_AMOUNT}."
  },
  Account: {
    events: ["FT_AccountTransaction", "EV_AccountStatusChange"],
    ipvs: ["ACCOUNT_ID", "ACCOUNT_BALANCE", "ACCOUNT_TYPE"],
    views: ["VW_ACCOUNT_ACTIVITY_SUMMARY", "VW_ACCOUNT_BALANCE_HISTORY"],
    tags: ["Account-Level"],
    params: ["Balance Deviation (%)", "Time Window (Hours)"],
    alert: "Account {ACCOUNT_ID} balance dropped by {DEVIATION}% within {TIME_WINDOW} hours."
  },
  Card: {
    events: ["FT_CardPayment", "NF_CardIssued"],
    ipvs: ["CARD_NUMBER", "CARD_TYPE", "CARD_LIMIT"],
    views: ["VW_CARD_TRANSACTION_PATTERNS"],
    tags: ["Card-Fraud"],
    params: ["Velocity Count", "Merchant Category Exclusion"],
    alert: "Card {CARD_NUMBER} exceeded velocity limit of {LIMIT} transactions in 24 hours."
  },
  "Non-Customer": {
    events: ["NF_GuestAccess", "FT_OneTimePayment"],
    ipvs: ["SESSION_ID", "IP_ADDRESS", "PAYMENT_METHOD"],
    views: ["VW_GUEST_ACTIVITY"],
    tags: ["Non-Customer"],
    params: ["Session Timeout", "Access Frequency"],
    alert: "Unidentified user session {SESSION_ID} showing anomalous access patterns."
  },
  Beneficiary: {
    events: ["NF_BeneficiaryAdded", "FT_Transfer"],
    ipvs: ["BENEFICIARY_ID", "BENEFICIARY_ACCOUNT", "IBAN"],
    views: ["VW_BENEFICIARY_ACTIVITY", "VW_BENEFICIARY_LIST"],
    tags: ["Beneficiary-Level"],
    params: ["New Beneficiary Window", "Country Risk Score"],
    alert: "Beneficiary {BENEFICIARY_ID} received funds from multiple unrelated accounts."
  },
  Transaction: {
    events: ["FT_Transaction"],
    ipvs: ["TRANSACTION_AMOUNT", "TRANSACTION_CHANNEL"],
    views: ["VW_TRANSACTION_DETAILS"],
    tags: ["Transaction-Level"],
    params: ["Amount Upper Limit", "Channel Risk Weight"],
    alert: "Transaction for {AMOUNT} on channel {CHANNEL} identified as high risk."
  },
  "Payment Card": {
    events: ["FT_CardPayment"],
    ipvs: ["CARD_TOKEN", "EXPIRY_DATE", "CVV_RESULT"],
    views: ["VW_CARD_AUTHORIZATIONS"],
    tags: ["Payment-Card"],
    params: ["Retry Limit", "MCC Verification"],
    alert: "Payment card {CARD_TOKEN} authorization failed multiple times at {MERCHANT}."
  },
  Merchant: {
    events: ["FT_MerchantPayment"],
    ipvs: ["MERCHANT_ID", "MERCHANT_CATEGORY_CODE"],
    views: ["VW_MERCHANT_ACTIVITY"],
    tags: ["Merchant-Level"],
    params: ["Settlement Delay (Minutes)", "Refund Ratio Threshold"],
    alert: "Merchant {MERCHANT_ID} refund ratio {RATIO} exceeds allowable threshold."
  },
  Device: {
    events: ["NF_DeviceChange"],
    ipvs: ["DEVICE_ID", "IP_ADDRESS"],
    views: ["VW_DEVICE_HISTORY"],
    tags: ["Device-Level"],
    params: ["Geo-Velocity (km/h)", "OS Version White-list"],
    alert: "Device {DEVICE_ID} login from new location {GEO} too soon after previous session."
  },
  Channel: {
    events: ["FT_ChannelTransaction"],
    ipvs: ["CHANNEL_ID", "CHANNEL_TYPE", "API_ENDPOINT"],
    views: ["VW_CHANNEL_HEALTH", "VW_CHANNEL_VOLUME"],
    tags: ["Channel-Level"],
    params: ["Max Concurrent Sessions", "Latency Threshold"],
    alert: "Channel {CHANNEL_ID} volume spike detected outside normal hours."
  },
  "External Entity": {
    events: ["FT_ExternalTransfer"],
    ipvs: ["EXTERNAL_ID", "INSTITUTION_NAME", "COUNTRY_CODE"],
    views: ["VW_EXTERNAL_ENTITY_FLOWS"],
    tags: ["External-Entity"],
    params: ["Reporting Jurisdiction", "Exposure Limit"],
    alert: "External Entity {EXTERNAL_ID} from {COUNTRY} exceeded exposure threshold."
  }
};

export function TemplateUsePage({ template, breadcrumbs, onBreadcrumbNavigate, onBack, onCreateScenario }: TemplateUsePageProps) {
  const [targetEntity, setTargetEntity] = useState("Customer");

  const config = useMemo(() => {
    const base = ENTITY_CONFIGS[targetEntity] || ENTITY_CONFIGS.Customer;
    return { ...base, targetEntity };
  }, [targetEntity]);

  const isMatch = template.workspace === targetEntity;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden font-['Inter']">
      {/* PAGE HEADER */}
      <div className="flex-none bg-white z-20 border-b border-gray-100 shadow-sm">
        <PageHeader 
          title="Template Details"
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />
        
        {/* METADATA ROW */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center h-[52px] overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 whitespace-nowrap pr-4 border-r border-gray-200 h-4 self-center flex-none">
                <span className="text-[12px] font-normal text-[#525252]">Template:</span>
                <span className="text-[13px] font-semibold text-[#161616]">{template.name}</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
                <span className="text-[12px] font-normal text-[#525252]">Category:</span>
                <Badge className="bg-[#f0f4f9] text-[#2A53A0] border border-[#d0e2ff] font-medium rounded-full px-2.5 h-6 text-[11px]">{template.category}</Badge>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
                <span className="text-[12px] font-normal text-[#525252]">Workspace:</span>
                <Badge className="bg-[#EAF2FF] text-[#2A53A0] border border-[#d0e2ff] font-semibold rounded-sm px-2 h-[22px] text-[11px]">{template.workspace}</Badge>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
                <span className="text-[12px] font-normal text-[#525252]">Version:</span>
                <Badge className="bg-[#EAF2FF] text-[#2A53A0] border border-[#d0e2ff] font-bold rounded-sm px-2 h-[18px] text-[10px] uppercase">{template.version}</Badge>
            </div>
            <div className="flex items-center gap-2 min-w-0 flex-1 pl-4">
                <span className="text-[12px] font-normal text-[#525252] whitespace-nowrap">Description:</span>
                <span className="text-[13px] text-[#161616] truncate font-normal italic" title={template.description}>
                  {template.description}
                </span>
            </div>
        </div>

        {/* ACTION BAR */}
        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-white h-[64px]">
           <div className="flex items-center gap-2">
              <Information size={16} className={cn("text-[#2A53A0]", !isMatch && "text-[#da1e28]")} />
              <span className={cn("text-[13px]", isMatch ? "text-[#525252]" : "text-[#da1e28] font-medium")}>
                {isMatch 
                  ? "Review configuration and target entity before creating the scenario." 
                  : `Validation Error: Target Entity must match the Template Workspace (${template.workspace}).`}
              </span>
           </div>
           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="h-[46px] px-6 border-gray-300 text-[#525252] hover:bg-gray-50 font-semibold rounded-[8px] text-[14px]"
                onClick={onBack}
              >
                Cancel
              </Button>
              <Button 
                className={cn(
                  "h-[46px] px-8 font-semibold rounded-[8px] shadow-sm text-[14px] transition-colors",
                  isMatch 
                    ? "bg-[#2A53A0] hover:bg-[#1e3c75] text-white" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                )}
                onClick={() => isMatch && onCreateScenario(template, config)}
                disabled={!isMatch}
              >
                Use Template
              </Button>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white p-4">
        <div className="flex flex-col gap-4">
          
          {/* SELECT TARGET ENTITY ROW - EXACT REFERENCE MATCH */}
          <section className="bg-white border border-[#d0e2ff] rounded-[8px] p-4 shadow-sm">
             <div className="flex items-center justify-between gap-8">
                <div className="flex-1 space-y-1">
                   <h2 className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">SELECT TARGET ENTITY</h2>
                   <p className="text-[13px] text-[#525252]">Choose the entity type this scenario will monitor. This selection affects available events, IPVs, and views.</p>
                </div>
                <div className="w-[320px] shrink-0">
                   <Select value={targetEntity} onValueChange={setTargetEntity}>
                       <SelectTrigger className="w-full !h-[46px] bg-white border-[#d0e2ff] rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] text-[14px] font-normal text-[#161616] shadow-sm">
                           <SelectValue placeholder="Select entity" />
                       </SelectTrigger>
                       <SelectContent className="rounded-[8px]">
                           {Object.keys(ENTITY_CONFIGS).map(entity => (
                             <SelectItem key={entity} value={entity} className="text-[14px]">
                               {entity}
                             </SelectItem>
                           ))}
                       </SelectContent>
                   </Select>
                </div>
             </div>
          </section>

          {/* OVERVIEW SECTION */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
               <Document size={18} className="text-[#2A53A0]" />
               <h3 className="text-[15px] font-bold text-[#161616]">Overview</h3>
            </div>

            <div className="space-y-8">
              {/* FULL DESCRIPTION */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-[#525252] uppercase tracking-wider block">FULL DESCRIPTION</label>
                <div className="bg-[#f4f4f4] border border-gray-200 rounded-[8px] p-4 text-[14px] text-[#525252] min-h-[52px] leading-relaxed">
                  {template.description}
                </div>
              </div>

              {/* EVENTS USED */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#525252] uppercase tracking-wider block">EVENTS USED</label>
                <div className="flex flex-wrap gap-2.5">
                  {config.events.map(event => (
                    <div key={event} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0fff4] text-[#198038] border border-[#d4edda] rounded-[4px] text-[12px] font-medium">
                       {event}
                       <CheckmarkFilled size={14} className="opacity-80" />
                    </div>
                  ))}
                </div>
              </div>

              {/* IPVS USED */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#525252] uppercase tracking-wider block">IPVS USED</label>
                <div className="flex flex-wrap gap-2.5">
                  {config.ipvs.map(ipv => (
                    <div key={ipv} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0fff4] text-[#198038] border border-[#d4edda] rounded-[4px] text-[12px] font-medium">
                       {ipv}
                       <CheckmarkFilled size={14} className="opacity-80" />
                    </div>
                  ))}
                </div>
              </div>

              {/* VIEWS USED */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#525252] uppercase tracking-wider block">VIEWS USED</label>
                <div className="flex flex-wrap gap-2.5">
                  {config.views.map(view => (
                    <div key={view} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0fff4] text-[#198038] border border-[#d4edda] rounded-[4px] text-[12px] font-medium">
                       {view}
                       <CheckmarkFilled size={14} className="opacity-80" />
                    </div>
                  ))}
                </div>
              </div>

              {/* TAGS */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#525252] uppercase tracking-wider block">TAGS</label>
                <div className="flex flex-wrap gap-2.5">
                  {config.tags.map(tag => (
                    <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f4f4] text-[#525252] border border-gray-200 rounded-[4px] text-[12px] font-medium">
                       <Tag size={14} className="text-gray-400" />
                       {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CONFIGURABLE PARAMETERS SECTION */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
               <SettingsAdjust size={18} className="text-[#2A53A0]" />
               <h3 className="text-[15px] font-bold text-[#161616]">Configurable Parameters</h3>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-[#525252] uppercase tracking-wider block">PARAMETERS LIST</label>
              <div className="flex flex-wrap gap-2.5">
                {config.params.map(param => (
                  <div key={param} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eaf2ff] text-[#2A53A0] border border-[#d0e2ff] rounded-[4px] text-[12px] font-medium">
                     {param}
                     <CheckmarkFilled size={14} className="opacity-80" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SAMPLE ALERT MESSAGE SECTION */}
          <div className="space-y-8 pb-0">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
               <Chat size={18} className="text-[#2A53A0]" />
               <h3 className="text-[15px] font-bold text-[#161616]">Sample Alert Message</h3>
            </div>
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-[#525252] uppercase tracking-wider block">MESSAGE PREVIEW</label>
              <div className="bg-[#fff9e6] border border-[#ffe58f] rounded-[8px] p-5 text-[14px] text-[#856404] italic leading-relaxed shadow-sm">
                "{config.alert}"
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
