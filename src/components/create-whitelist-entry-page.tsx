import React, { useState, useEffect } from "react";
import { 
  CheckmarkFilled,
  Calendar,
  Close,
  ChevronDown
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { cn } from "./ui/utils";
import { X } from "lucide-react@0.487.0";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import PageHeader from "./page-header";
import { toast } from "sonner@2.0.3";

interface CreateWhitelistEntryPageProps {
  onBack: () => void;
  onBreadcrumbNavigate: (path: string) => void;
  breadcrumbs: any[];
  parentTab?: string;
}

const AVAILABLE_SCENARIOS = [
  "Cross-Border Payment Fraud",
  "High Velocity Transfers",
  "Dormant Account Reactivation",
  "New Device Login",
  "Unusual Merchant Category",
  "Multiple Failed Attempts",
  "Sanctioned Country Interaction",
  "Structuring (Smurfing) Detection",
  "Account Takeover (ATO)",
  "Money Laundering Pattern"
];

export function CreateWhitelistEntryPage({
  onBack,
  onBreadcrumbNavigate,
  breadcrumbs,
  parentTab
}: CreateWhitelistEntryPageProps) {
  const isScenarioWise = parentTab?.includes("scenario");
  
  const [entityId, setEntityId] = useState("");
  const [entityType, setEntityType] = useState("COUNTRY");
  const [entityValue, setEntityValue] = useState("");
  const [reason, setReason] = useState("");
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);
  
  // Current date for default Valid From
  const now = new Date();
  const defaultValidFrom = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const [validFrom, setValidFrom] = useState(defaultValidFrom);
  const [expiryDate, setExpiryDate] = useState("31-12-2099 23:59");
  const [comments, setComments] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCreate = () => {
    if (!entityId || !entityValue || !reason) {
      toast.error("Please fill in all mandatory fields");
      return;
    }
    if (isScenarioWise && selectedScenarios.length === 0) {
      toast.error("Please select at least one scenario");
      return;
    }
    setShowSuccessModal(true);
  };

  const toggleScenario = (scenario: string) => {
    setSelectedScenarios(prev => 
      prev.includes(scenario) 
        ? prev.filter(s => s !== scenario) 
        : [...prev, scenario]
    );
  };

  const handleFinalSuccess = () => {
    setShowSuccessModal(false);
    toast.success("Entry created successfully");
    onBack();
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative font-['Inter']">
      {/* Top Navigation */}
      <div className="flex-none">
        <PageHeader 
          title={parentTab?.includes("blacklist") ? "Create Blacklist Entry" : "Create Whitelist Entry"}
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />
      </div>

      {/* Main Content Area - Hidden scrollbars for all browsers */}
      <div className="flex-1 overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-8">
        <div className="w-full flex flex-col gap-8 max-w-full animate-in fade-in duration-500">
          
          {/* Row 1: Entity ID and Entity Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#161616]">
                Entity ID <span className="text-[#DA1E28]">*</span>
              </label>
              <Input 
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                placeholder="e.g., WL-2024-001"
                className="h-[46px] border-[#E0E0E0] rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] bg-white shadow-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#161616]">
                Entity Type <span className="text-[#DA1E28]">*</span>
              </label>
              <Select value={entityType} onValueChange={setEntityType}>
                <SelectTrigger className="h-[46px] border-[#E0E0E0] rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] bg-white shadow-none">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COUNTRY">COUNTRY</SelectItem>
                  <SelectItem value="BIN">BIN</SelectItem>
                  <SelectItem value="CARD">CARD</SelectItem>
                  <SelectItem value="ACCOUNT">ACCOUNT</SelectItem>
                  <SelectItem value="IP">IP</SelectItem>
                  <SelectItem value="EMAIL">EMAIL</SelectItem>
                  <SelectItem value="MERCHANT">MERCHANT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Entity Value */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#161616]">
              Entity Value <span className="text-[#DA1E28]">*</span>
            </label>
            <Input 
              value={entityValue}
              onChange={(e) => setEntityValue(e.target.value)}
              placeholder="Enter the entity value"
              className="h-[46px] border-[#E0E0E0] rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] bg-white shadow-none"
            />
          </div>

          {/* Scenario Multiselect (Strictly only Scenario wise entry) */}
          {isScenarioWise && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[14px] font-semibold text-[#161616]">
                Select Scenarios <span className="text-[#DA1E28]">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
                  className={cn(
                    "w-full h-[46px] px-4 bg-white border border-[#E0E0E0] rounded-[8px] flex items-center justify-between text-[14px] text-[#161616] hover:bg-gray-50 transition-colors shadow-none",
                    isScenarioDropdownOpen && "ring-1 ring-[#2A53A0] border-[#2A53A0]"
                  )}
                >
                  <span className={selectedScenarios.length === 0 ? "text-gray-400" : "text-[#161616]"}>
                    {selectedScenarios.length === 0 
                      ? "Select one or more scenarios" 
                      : `${selectedScenarios.length} scenarios selected`}
                  </span>
                  <ChevronDown size={20} className={cn("text-[#525252] transition-transform", isScenarioDropdownOpen && "rotate-180")} />
                </button>

                {isScenarioDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[50]" 
                      onClick={() => setIsScenarioDropdownOpen(false)} 
                    />
                    <div className="absolute top-[50px] left-0 w-full bg-white border border-[#E0E0E0] rounded-[8px] shadow-lg z-[60] py-2 max-h-[240px] overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-150">
                      {AVAILABLE_SCENARIOS.map((scenario) => (
                        <div 
                          key={scenario}
                          onClick={() => toggleScenario(scenario)}
                          className="flex items-center px-4 py-2.5 hover:bg-[#F0F4FF] cursor-pointer transition-colors group"
                        >
                          <div className={cn(
                            "w-4 h-4 rounded-sm border mr-3 flex items-center justify-center transition-all",
                            selectedScenarios.includes(scenario) 
                              ? "bg-[#2A53A0] border-[#2A53A0]" 
                              : "border-gray-300 group-hover:border-[#2A53A0]"
                          )}>
                            {selectedScenarios.includes(scenario) && <CheckmarkFilled size={12} className="text-white" />}
                          </div>
                          <span className={cn(
                            "text-[14px]",
                            selectedScenarios.includes(scenario) ? "text-[#2A53A0] font-medium" : "text-[#161616]"
                          )}>
                            {scenario}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Selected Scenario Pills */}
              {selectedScenarios.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in duration-300">
                  {selectedScenarios.map((scenario) => (
                    <div 
                      key={scenario} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#EAF2FF] text-[#2A53A0] border border-[#B2D4FF] rounded-full text-[12px] font-medium group transition-all hover:bg-[#D0E2FF]"
                    >
                      {scenario}
                      <button 
                        onClick={() => toggleScenario(scenario)}
                        className="p-0.5 hover:bg-white/50 rounded-full transition-colors"
                      >
                        <X size={14} className="text-[#2A53A0]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Row 3: Reason */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#161616]">
              Reason <span className="text-[#DA1E28]">*</span>
            </label>
            <Textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for this entry"
              className="min-h-[120px] border-[#E0E0E0] rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] resize-none bg-white shadow-none"
            />
          </div>

          {/* Row 4: Valid From and Expiry Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#161616]">
                Valid From <span className="text-[#DA1E28]">*</span>
              </label>
              <div className="relative">
                <Input 
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="h-[46px] border-[#E0E0E0] rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] pr-10 bg-white shadow-none"
                />
                <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2 relative">
              <label className="text-[14px] font-semibold text-[#161616]">
                Expiry Date <span className="text-[#DA1E28]">*</span>
              </label>
              <div className="relative">
                <Input 
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="h-[46px] border-[#E0E0E0] rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] pr-10 bg-white shadow-none"
                />
                <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <span className="absolute -bottom-6 left-0 text-[11px] text-[#525252]">
                Use 2099-12-31T23:59 for no expiration
              </span>
            </div>
          </div>

          {/* Row 5: Comments */}
          <div className="space-y-2 pt-4">
            <label className="text-[14px] font-semibold text-[#161616]">
              Comments (Optional)
            </label>
            <Textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any additional notes"
              className="min-h-[100px] border-[#E0E0E0] rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] resize-none bg-white shadow-none"
            />
          </div>
          
          <div className="h-10" />
        </div>
      </div>

      {/* Fixed Footer Actions */}
      <div className="flex-none bg-white border-t border-[#E0E0E0] flex items-center h-[80px] px-8 z-50">
        <div className="w-full flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="h-[46px] px-8 bg-white border-[#C6C6C6] text-[#161616] hover:bg-gray-50 rounded-[8px] font-medium text-[14px]"
          >
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="h-[46px] px-8 bg-white border-[#C6C6C6] text-[#161616] hover:bg-gray-50 rounded-[8px] font-medium text-[14px]"
              onClick={() => toast.info("Draft saved successfully")}
            >
              Save as Draft
            </Button>
            <Button 
              onClick={handleCreate}
              className="h-[46px] px-10 bg-[#2A53A0] hover:bg-[#1E3C75] text-white rounded-[8px] font-bold transition-colors text-[14px]"
            >
              Create Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[400px] overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-[#198038]">
                <CheckmarkFilled size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-[20px] font-bold text-[#161616]">Success!</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Whitelist entry <strong>"{entityId}"</strong> has been successfully created and sent for approval.
                </p>
              </div>
              <div className="pt-2 w-full">
                <Button 
                  className="w-full h-[46px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
                  onClick={handleFinalSuccess}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
