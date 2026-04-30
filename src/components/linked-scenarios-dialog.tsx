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

// Mock scenario data for each group - matching the scenario counts in INITIAL_GROUP_DATA
const MOCK_GROUP_SCENARIOS: Record<string, Scenario[]> = {
  "g1": [ // EFM - 142 scenarios
    { id: "EFM-1", name: "Account Takeover Detection", description: "Advanced detection of account takeover attempts using behavioral analytics and device fingerprinting" },
    { id: "EFM-2", name: "Transaction Velocity Monitoring", description: "Real-time monitoring of transaction velocity patterns to identify suspicious high-frequency activities" },
    { id: "EFM-3", name: "Card Not Present Fraud", description: "Detection of fraudulent CNP transactions through merchant category analysis and geographic profiling" },
    { id: "EFM-4", name: "Synthetic Identity Fraud", description: "Identification of synthetic identities through credit bureau data cross-referencing and application pattern analysis" },
    { id: "EFM-5", name: "First Party Fraud Detection", description: "Monitoring for first-party fraud indicators including deliberate default patterns and bust-out schemes" },
    { id: "EFM-6", name: "Mule Account Identification", description: "Detection of money mule accounts through rapid fund movement and layering transaction patterns" },
  ],
  "g2": [ // AML - 87 scenarios
    { id: "AML-1", name: "Structuring Detection", description: "Monitoring for transaction structuring patterns designed to evade regulatory reporting thresholds" },
    { id: "AML-2", name: "Layering Activity Analysis", description: "Detection of complex layering schemes involving multiple accounts and rapid fund transfers" },
    { id: "AML-3", name: "Trade-Based Money Laundering", description: "Identification of suspicious trade finance patterns including over/under-invoicing and phantom shipping" },
    { id: "AML-4", name: "Cash Intensive Business Monitoring", description: "Enhanced monitoring of cash-intensive businesses for unusual deposit patterns and velocity" },
    { id: "AML-5", name: "High-Risk Jurisdiction Screening", description: "Real-time screening of transactions involving high-risk jurisdictions and sanctioned territories" },
    { id: "AML-6", name: "PEP Transaction Monitoring", description: "Enhanced due diligence monitoring for Politically Exposed Persons and their immediate family members" },
  ],
  "g3": [ // KYC - 54 scenarios
    { id: "KYC-1", name: "Identity Verification Anomaly", description: "Detection of inconsistencies in identity verification documents and biometric validation" },
    { id: "KYC-2", name: "Beneficial Ownership Screening", description: "Advanced screening for ultimate beneficial ownership structures and shell company indicators" },
    { id: "KYC-3", name: "Enhanced Due Diligence Triggers", description: "Automated triggers for enhanced due diligence based on risk scoring and customer profile changes" },
    { id: "KYC-4", name: "Document Forgery Detection", description: "AI-powered detection of forged or altered identity documents during customer onboarding" },
    { id: "KYC-5", name: "Address Verification Risk", description: "Cross-validation of customer addresses against known drop-shipping and mail-forwarding services" },
    { id: "KYC-6", name: "Negative News Screening", description: "Continuous monitoring of negative news and adverse media mentions for existing customers" },
  ],
  "g4": [ // Card Fraud - 96 scenarios
    { id: "CF-1", name: "Card Testing Detection", description: "Identification of card testing attempts through multiple low-value authorization requests" },
    { id: "CF-2", name: "Geographic Anomaly Detection", description: "Detection of impossible travel patterns and geographic inconsistencies in card usage" },
    { id: "CF-3", name: "Merchant Category Anomaly", description: "Monitoring for unusual merchant category combinations and first-time merchant usage patterns" },
    { id: "CF-4", name: "Contactless Fraud Prevention", description: "Detection of contactless payment fraud through velocity checks and proximity analysis" },
    { id: "CF-5", name: "E-commerce Fraud Scoring", description: "Risk scoring for e-commerce transactions using device intelligence and behavioral biometrics" },
    { id: "CF-6", name: "Card-Not-Present Velocity", description: "Velocity monitoring for CNP transactions across multiple merchants and payment gateways" },
  ],
  "g5": [ // Internal Fraud - 31 scenarios
    { id: "IF-1", name: "Insider Trading Detection", description: "Monitoring employee trading patterns for potential insider trading violations and tipping" },
    { id: "IF-2", name: "Privileged Access Abuse", description: "Detection of abnormal privileged access patterns and unauthorized system modifications" },
    { id: "IF-3", name: "Data Exfiltration Monitoring", description: "Monitoring for unusual data download patterns and unauthorized file transfers by employees" },
    { id: "IF-4", name: "Ghost Employee Detection", description: "Identification of ghost employees through payroll pattern analysis and HR data cross-validation" },
    { id: "IF-5", name: "Expense Report Fraud", description: "Detection of expense report fraud through duplicate claims and vendor validation anomalies" },
    { id: "IF-6", name: "Vendor Kickback Schemes", description: "Monitoring for vendor kickback patterns including invoice manipulation and shell company indicators" },
  ],
  "g6": [ // Compliance - 42 scenarios
    { id: "COMP-1", name: "OFAC Sanctions Screening", description: "Real-time screening against OFAC sanctions lists and specially designated nationals database" },
    { id: "COMP-2", name: "Currency Transaction Reporting", description: "Automated CTR filing for cash transactions exceeding regulatory reporting thresholds" },
    { id: "COMP-3", name: "Suspicious Activity Reporting", description: "AI-assisted SAR generation based on transaction pattern analysis and risk indicators" },
    { id: "COMP-4", name: "Customer Due Diligence Review", description: "Periodic CDD review scheduling and automated risk rating refresh for existing customers" },
    { id: "COMP-5", name: "Large Cash Transaction Monitoring", description: "Monitoring and reporting of large cash transactions across multiple account relationships" },
    { id: "COMP-6", name: "Wire Transfer Compliance", description: "Compliance monitoring for international wire transfers including SWIFT message validation" },
  ],
  "g7": [ // Risk Assessment - 68 scenarios
    { id: "RA-1", name: "Customer Risk Scoring", description: "Dynamic customer risk scoring using machine learning and behavioral pattern analysis" },
    { id: "RA-2", name: "Transaction Risk Rating", description: "Real-time transaction risk rating based on historical patterns and peer group comparisons" },
    { id: "RA-3", name: "Geographic Risk Assessment", description: "Geographic risk scoring for cross-border transactions and high-risk jurisdiction exposure" },
    { id: "RA-4", name: "Product Risk Evaluation", description: "Risk evaluation framework for new product launches and existing product portfolio analysis" },
    { id: "RA-5", name: "Channel Risk Monitoring", description: "Risk assessment across digital channels including mobile banking and third-party integrations" },
    { id: "RA-6", name: "Concentration Risk Analysis", description: "Monitoring for concentration risk across customer segments, geographies, and product types" },
  ],
  "g8": [ // Transaction Monitoring - 112 scenarios
    { id: "TM-1", name: "Real-Time Payment Fraud", description: "Real-time fraud detection for instant payment rails including Zelle, Venmo, and RTP networks" },
    { id: "TM-2", name: "ACH Return Pattern Analysis", description: "Detection of suspicious ACH return patterns indicating account takeover or check kiting" },
    { id: "TM-3", name: "Wire Transfer Risk Monitoring", description: "Enhanced monitoring for wire transfers including beneficiary validation and purpose analysis" },
    { id: "TM-4", name: "Check Deposit Fraud", description: "Detection of check deposit fraud through mobile RDC image analysis and duplicate detection" },
    { id: "TM-5", name: "P2P Transfer Monitoring", description: "Peer-to-peer transfer monitoring for fraud patterns and money laundering typologies" },
    { id: "TM-6", name: "Cross-Channel Transaction Analysis", description: "Analysis of transaction patterns across multiple channels to identify coordinated fraud schemes" },
  ],
  "g9": [ // Customer Onboarding - 27 scenarios
    { id: "CO-1", name: "Application Fraud Detection", description: "Detection of fraudulent applications using device intelligence and identity cross-validation" },
    { id: "CO-2", name: "Duplicate Application Screening", description: "Screening for duplicate applications and identity theft indicators during onboarding" },
    { id: "CO-3", name: "Instant Account Verification", description: "Real-time account verification using open banking APIs and third-party data sources" },
    { id: "CO-4", name: "Initial Deposit Risk Scoring", description: "Risk scoring for initial deposit sources and funding pattern anomaly detection" },
    { id: "CO-5", name: "Digital Identity Validation", description: "Validation of digital identity using blockchain-based credentials and decentralized identifiers" },
    { id: "CO-6", name: "Behavioral Biometrics Profiling", description: "Establishment of behavioral biometric baseline during onboarding for future anomaly detection" },
  ],
  "g10": [ // Cybersecurity - 73 scenarios
    { id: "CS-1", name: "Credential Stuffing Detection", description: "Detection of credential stuffing attacks through login pattern analysis and IP reputation" },
    { id: "CS-2", name: "Session Hijacking Prevention", description: "Monitoring for session hijacking attempts using behavioral analytics and device fingerprinting" },
    { id: "CS-3", name: "API Abuse Detection", description: "Detection of API abuse and scraping attempts through rate limiting and usage pattern analysis" },
    { id: "CS-4", name: "Phishing Campaign Identification", description: "Identification of targeted phishing campaigns and business email compromise attempts" },
    { id: "CS-5", name: "Malware Infection Indicators", description: "Detection of malware infection indicators through anomalous system behavior and network traffic" },
    { id: "CS-6", name: "DDoS Attack Mitigation", description: "Real-time DDoS attack detection and automated mitigation through traffic pattern analysis" },
  ]
};

interface LinkedScenariosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupId: string;
  scenarioCount: number;
}

export function LinkedScenariosDialog({ isOpen, onClose, groupName, groupId, scenarioCount }: LinkedScenariosDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const scenarios = useMemo(() => {
    // Get base scenarios from mock if available
    const baseScenarios = MOCK_GROUP_SCENARIOS[groupId] || [];
    
    // If we have fewer scenarios than scenarioCount, we need to generate more to match the count
    // If we have more, we slice to match the count
    if (baseScenarios.length === scenarioCount) return baseScenarios;
    
    if (baseScenarios.length > scenarioCount) {
      return baseScenarios.slice(0, scenarioCount);
    }
    
    // Generate additional generic scenarios to match the requested count
    const result = [...baseScenarios];
    for (let i = baseScenarios.length; i < scenarioCount; i++) {
      result.push({
        id: `${groupId.toUpperCase()}-GEN-${i + 1}`,
        name: `${groupName} Scenario ${i + 1}`,
        description: `Standard fraud detection and monitoring scenario for ${groupName} group to ensure comprehensive coverage across all risk categories.`
      });
    }
    return result;
  }, [groupId, groupName, scenarioCount]);
  
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
               Linked Scenarios for {groupName}
             </DialogTitle>
             <DialogDescription className="sr-only">
               Detailed list of scenarios linked to {groupName} group.
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
