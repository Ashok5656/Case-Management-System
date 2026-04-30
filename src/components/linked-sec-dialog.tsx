import React, { useState, useMemo } from "react";
import { 
  Search, 
  Close
} from "@carbon/icons-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "./ui/dialog";
import { cn } from "./ui/utils";

interface Scenario {
  id: string;
  name: string;
  description: string;
}

const MOCK_SCENARIOS: Record<string, Scenario[]> = {
  "1": [
    { id: "S1-1", name: "SEC_ACCOUNT_OPEN_FRAUD_1", description: "Advanced fraud detection for account opening monitoring." },
    { id: "S1-2", name: "SEC_ACCOUNT_OPEN_BEHAVIOR", description: "Behavioral analysis and risk scoring during customer onboarding." },
    { id: "S1-3", name: "SEC_ACCOUNT_OPEN_IDENTITY", description: "Identity verification and duplicate application check." },
    { id: "S1-4", name: "SEC_ACCOUNT_OPEN_VELOCITY", description: "Monitoring for rapid account creation from single IP/device." }
  ],
  "2": [
    { id: "S2-1", name: "SEC_ACH_DUPLICATE_MAP", description: "Mapping check for duplicate transaction field values." },
    { id: "S2-2", name: "SEC_ACH_VELOCITY_CHECK", description: "Real-time velocity checks for automated clearing house payments." },
    { id: "S2-3", name: "SEC_ACH_RECIPIENT_VALIDATION", description: "Verification of high-risk ACH recipient jurisdictions." }
  ],
  "3": [
    { id: "S3-1", name: "SEC_ATM_WITHDRAWAL_LOC", description: "ATM withdrawal monitoring with location anomaly detection." },
    { id: "S3-2", name: "SEC_ATM_VELOCITY_CHECK", description: "Daily withdrawal limit and frequency monitoring." },
    { id: "S3-3", name: "SEC_ATM_SUSPICIOUS_PATTERN", description: "Pattern recognition for structured cash withdrawals." },
    { id: "S3-4", name: "SEC_ATM_DEVICE_TAMPER", description: "Monitoring for potential skimming device behavior patterns." }
  ],
  "4": [
    { id: "S4-1", name: "SEC_BENEFICIARY_REG_FRAUD", description: "New beneficiary registration monitoring for fund transfers." },
    { id: "S4-2", name: "SEC_BENEFICIARY_RISK_SCORING", description: "Risk scoring for new beneficiaries in high-risk zones." },
    { id: "S4-3", name: "SEC_BENEFICIARY_MOD_CHECK", description: "Detection of frequent beneficiary modifications." }
  ],
  "6": [
    { id: "S2", name: "SEC_CARD_TXN_FRAUD_1", description: "Real-time card transaction fraud detection with velocity checks and pattern recognition" },
    { id: "S3", name: "SEC_CARD_TXN_FRAUD_2", description: "Geographic anomaly detection for cross-border card usage and suspicious merchant categories" }
  ],
  "7": [
    { id: "S7-1", name: "SEC_CHECK_DEPOSIT_VERIFY", description: "Remote deposit capture verification and image processing." },
    { id: "S7-2", name: "SEC_CHECK_DUP_DETECTION", description: "Detection of duplicate check deposits via mobile apps." },
    { id: "S7-3", name: "SEC_CHECK_RISK_SCORING", description: "Risk scoring based on deposit amounts and account age." },
    { id: "S7-4", name: "SEC_CHECK_CLEARING_MONITOR", description: "Monitoring for unusual clearing delays or returns." }
  ],
  "8": [
    { id: "S8-1", name: "SEC_LIMIT_MOD_SUSP", description: "Monitoring for suspicious limit modification requests." },
    { id: "S8-2", name: "SEC_LIMIT_VELOCITY", description: "Detection of frequent limit changes within short periods." },
    { id: "S8-3", name: "SEC_LIMIT_POST_TXN", description: "Monitoring high-value transactions following limit increases." }
  ],
  "9": [
    { id: "S9-1", name: "SEC_LOGIN_GEO_ANOMALY", description: "Authentication risk monitoring for unusual login locations." },
    { id: "S9-2", name: "SEC_LOGIN_DEVICE_FINGER", description: "Device fingerprinting and behavioral login pattern analysis." },
    { id: "S9-3", name: "SEC_LOGIN_BRUTE_FORCE", description: "Protection against automated brute-force login attempts." },
    { id: "S9-4", name: "SEC_LOGIN_TIME_ANOMALY", description: "Monitoring for logins outside of typical user activity windows." }
  ],
  "10": [
    { id: "S10-1", name: "SEC_MOBILE_P2P_VEL", description: "Velocity checks for rapid peer-to-peer transfers." },
    { id: "S10-2", name: "SEC_MOBILE_MFA_MONITOR", description: "Monitoring for MFA bypass attempts during P2P transfers." },
    { id: "S10-3", name: "SEC_MOBILE_THIRDPARTY", description: "Integration risk monitoring for third-party P2P services." }
  ],
  "11": [
    { 
      id: "S8", 
      name: "SEC_ADDRESS_CHANGE_FRAUD", 
      description: "Detection of address changes followed by new card issuance or high-value wire transfers" 
    }
  ],
  "13": [
    { 
      id: "S9", 
      name: "SEC_WIRE_TRANSFER_RISK", 
      description: "High-value wire transfer monitoring for unusual recipient jurisdictions and shell company patterns" 
    },
    { 
      id: "S10", 
      name: "SEC_WIRE_VELOCITY_CHECK", 
      description: "Monitoring for rapid succession of wire transfers slightly below reporting thresholds" 
    },
    { 
      id: "S11", 
      name: "SEC_BENEFICIARY_MOD_RISK", 
      description: "Alerting on new beneficiary additions followed immediately by international wire transfers" 
    }
  ],
  "14": [
    { 
      id: "S12", 
      name: "SEC_LOAN_APP_FRAUD", 
      description: "Automated verification of loan application data points against historical identity patterns" 
    }
  ],
  "15": [
    { 
      id: "S13", 
      name: "SEC_DEVICE_BIND_TAKEOVER", 
      description: "Monitoring for new device bindings and subsequent security credential modifications" 
    },
    { 
      id: "S14", 
      name: "SEC_MFA_BYPASS_ATTEMPT", 
      description: "Detection of multiple failed MFA attempts during new device registration phases" 
    }
  ],
  "c1": [
     { id: "SC1", name: "SEC_CRYPTO_WALLET_LINK_1", description: "Custom logic for monitoring links to known high-risk crypto exchanges" }
  ],
  "c4": [
     { id: "SC4", name: "SEC_MERCHANT_DISPUTE_CLUSTER", description: "Identification of merchant dispute clusters indicating potential mass data compromise" },
     { id: "SC4B", name: "SEC_DISPUTE_VELOCITY", description: "Real-time alerts for high volumes of disputes from a single merchant ID" }
  ],
  "c6": [
     { id: "SC6", name: "SEC_HIGH_VEL_LOGIN_BRUTE", description: "Protection against brute-force login attempts detected via high-velocity patterns" }
  ],
  "c7": [
     { id: "SC7", name: "SEC_BULK_PAYROLL_ANOMALY", description: "Monitoring for unusual variations in corporate payroll batch files compared to historical norms" },
     { id: "SC7B", name: "SEC_PAYROLL_NEW_RECIPIENT", description: "Flagging first-time recipients in bulk payroll uploads for manual verification" },
     { id: "SC7C", name: "SEC_PAYROLL_THRESHOLD_HIT", description: "Alerting on individual payroll payments exceeding department-specific thresholds" },
     { id: "SC7D", name: "SEC_PAYROLL_ACCOUNT_CHANGE", description: "Monitoring for bank account changes for existing employees within payroll cycles" }
  ]
};

interface LinkedSecDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  eventId: string;
  linkedSecCount: number;
}

export function LinkedSecDialog({ isOpen, onClose, eventName, eventId, linkedSecCount }: LinkedSecDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const scenarios = useMemo(() => {
    // Get base scenarios from mock if available
    const baseScenarios = MOCK_SCENARIOS[eventId] || [];
    
    // If we have fewer scenarios than linkedSecCount, we need to generate more to match the count
    // If we have more, we slice to match the count
    if (baseScenarios.length === linkedSecCount) return baseScenarios;
    
    if (baseScenarios.length > linkedSecCount) {
      return baseScenarios.slice(0, linkedSecCount);
    }
    
    // Generate additional generic scenarios to match the requested count
    const result = [...baseScenarios];
    for (let i = baseScenarios.length; i < linkedSecCount; i++) {
      result.push({
        id: `GEN-${eventId}-${i}`,
        name: `SEC_${eventName.toUpperCase().replace(/\s+/g, '_')}_${i + 1}`,
        description: `Standard monitoring scenario for ${eventName} to ensure data integrity and compliance with PII classification standards.`
      });
    }
    return result;
  }, [eventId, eventName, linkedSecCount]);
  
  const filteredScenarios = useMemo(() => {
    if (!searchTerm) return scenarios;
    return scenarios.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [scenarios, searchTerm]);

  const showSearch = scenarios.length > 6;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined} className="max-w-[640px] p-0 border-0 shadow-2xl overflow-hidden rounded-[8px] gap-0 bg-white [&>button]:text-white [&>button]:hover:bg-white/10 [&>button]:top-5 [&>button]:right-5 transition-all">
        <DialogHeader className="h-[64px] shrink-0 flex flex-row items-center justify-between bg-[#2A53A0] space-y-0 px-0 pl-[30px] pr-12">
           <div className="space-y-0.5">
             <DialogTitle className="text-[20px] font-normal text-white leading-tight">
               Linked Sec for {eventName}
             </DialogTitle>
             <DialogDescription className="sr-only">
               Detailed list of security scenarios linked to {eventName}.
             </DialogDescription>
           </div>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f4f4f4]/30">
          {showSearch && (
            <div className="pt-6 pb-2 shrink-0 px-[30px]">
               <div className="relative w-full h-[46px] flex items-center">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search scenarios..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-full pl-10 pr-4 bg-white border border-gray-200 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-400 transition-all"
                  />
               </div>
            </div>
          )}

          <div className="p-[30px] pt-4 max-h-[480px] overflow-y-auto min-h-[200px] hover-scroll">
             <div className="flex flex-col gap-4">
               {filteredScenarios.length > 0 ? filteredScenarios.map((scenario) => (
                  <div key={scenario.id} className="p-4 bg-white border border-gray-200 rounded-[8px] hover:border-[#2A53A0] transition-all group cursor-default">
                     <div className="flex items-start justify-between mb-2">
                        <h4 className="text-[14px] font-semibold text-[#161616] leading-snug">
                          {scenario.name}
                        </h4>
                     </div>
                     <p className="text-[13px] text-[#525252] leading-relaxed">
                       {scenario.description}
                     </p>
                  </div>
               )) : (
                 <div className="h-48 flex flex-col items-center justify-center text-gray-400 bg-white border border-dashed border-gray-300 rounded-[8px]">
                    <Search size={32} className="mb-2 opacity-20" />
                    <p className="text-sm">No scenarios found matching your search.</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        <DialogFooter className="p-0 h-[64px] bg-[#f4f4f4] border-t border-gray-200 flex flex-row items-stretch justify-end shrink-0 gap-0">
          <button 
            onClick={onClose}
            className="w-1/2 h-full bg-[#2A53A0] hover:bg-[#1e3c75] text-white text-[14px] font-medium transition-colors px-8"
          >
            Done
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
