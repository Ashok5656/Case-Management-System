import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { cn } from "./ui/utils";
import { ChevronRight, Play, X, ChevronDown, Check, Minus } from "lucide-react";

interface ApiCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const API_GROUPS = [
  {
    label: "External Services",
    options: [
      { 
        id: "trust-armour", 
        name: "Trust Armour Risk API - Get real-time risk score from Trust Armour",
        endpoint: "https://api.trustarmour.com/v1/risk",
        method: "POST",
        parameters: [
          { name: "customer_id", type: "string", required: true },
          { name: "transaction_id", type: "string", required: true },
          { name: "amount", type: "number", required: true },
        ]
      },
      {
        id: "geocoding",
        name: "Geocoding Service - Convert IP to location",
        endpoint: "https://api.geoserve.io/v1/lookup",
        method: "GET",
        parameters: [
          { name: "ip_address", type: "string", required: true },
        ]
      }
    ]
  },
  {
    label: "Internal APIs",
    options: [
      {
        id: "customer-profile",
        name: "Customer Profile API - Retrieve customer details",
        endpoint: "https://internal.efrm.local/api/v1/customers",
        method: "GET",
        parameters: [
          { name: "customer_id", type: "string", required: true },
        ]
      }
    ]
  }
];

export function ApiCallModal({ isOpen, onClose, onSave }: ApiCallModalProps) {
  const [selectedApiId, setSelectedApiId] = useState<string>("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [executionMode, setExecutionMode] = useState("async");
  const [enableRetry, setEnableRetry] = useState(false);
  const [continueOnFailure, setContinueOnFailure] = useState(true);
  
  const allOptions = API_GROUPS.flatMap(g => g.options);
  const selectedApi = allOptions.find(api => api.id === selectedApiId);

  const [mappings, setMappings] = useState<Record<string, { source: string, value: string }>>({});

  // Reset mappings when API changes
  React.useEffect(() => {
    if (selectedApi) {
      const initialMappings: Record<string, { source: string, value: string }> = {};
      selectedApi.parameters.forEach(p => {
        initialMappings[p.name] = { source: "Event", value: "" };
      });
      setMappings(initialMappings);
    } else {
      setMappings({});
    }
  }, [selectedApiId]);

  const handleMappingChange = (paramName: string, field: 'source' | 'value', val: string) => {
    setMappings(prev => ({
      ...prev,
      [paramName]: { ...prev[paramName], [field]: val }
    }));
  };

  const handleSave = () => {
    if (!selectedApi) return;
    onSave({
      apiId: selectedApiId,
      apiName: selectedApi.name,
      mappings,
      advanced: isAdvancedOpen ? {
        executionMode,
        enableRetry,
        continueOnFailure
      } : null
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="max-w-[600px] p-0 overflow-hidden border-none rounded-[12px] gap-0 transition-all duration-300">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0 bg-white sticky top-0 z-10">
          <DialogTitle className="text-[16px] font-bold text-[#161616]">Configure API Call</DialogTitle>
          <DialogDescription className="sr-only">
            Configure external API endpoints and parameter mappings for automated actions.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Select API */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#394960]">
              Select API <span className="text-red-500">*</span>
            </label>
            <Select value={selectedApiId} onValueChange={setSelectedApiId}>
              <SelectTrigger className="h-[46px] px-4 border-gray-200 rounded-[8px] text-[13px] bg-white">
                <SelectValue placeholder="Search or select API..." />
              </SelectTrigger>
              <SelectContent>
                {API_GROUPS.map(group => (
                  <SelectGroup key={group.label}>
                    <SelectLabel className="font-bold text-[#161616] py-2 px-3">{group.label}</SelectLabel>
                    {group.options.map(api => (
                      <SelectItem key={api.id} value={api.id} className="pl-6">
                        {api.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedApi ? (
            <>
              {/* Endpoint Info */}
              <div className="bg-[#F8F9FB] border border-[#EDF0F2] rounded-[8px] p-4 flex justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Endpoint:</span>
                  <p className="text-[12px] font-mono text-[#394960] truncate max-w-[400px]">{selectedApi.endpoint}</p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Method:</span>
                  <p className="text-[12px] font-bold text-[#2A53A0]">{selectedApi.method}</p>
                </div>
              </div>

              {/* Parameter Mapping */}
              <div className="space-y-4">
                <label className="text-[13px] font-bold text-[#394960]">Parameter Mapping</label>
                <div className="space-y-3 bg-white border border-[#E7EBF1] rounded-[8px] p-5 shadow-sm">
                  {selectedApi.parameters.map((param) => (
                    <div key={param.name} className="flex items-start gap-4">
                      <div className="w-[160px] pt-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-[#161616]">{param.name}</span>
                          {param.required && (
                            <span className="bg-red-50 text-red-500 text-[10px] px-1.5 py-0.5 rounded font-bold">Required</span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono">{param.type}</span>
                      </div>
                      <div className="flex-1 flex gap-2">
                        <Select 
                          value={mappings[param.name]?.source || "Source..."} 
                          onValueChange={(v) => handleMappingChange(param.name, 'source', v)}
                        >
                          <SelectTrigger className="h-[46px] px-3 border-gray-200 rounded-[8px] text-[13px] w-[110px] bg-white">
                            <SelectValue placeholder="Source..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Event">Event</SelectItem>
                            <SelectItem value="Constant">Constant</SelectItem>
                            <SelectItem value="Variable">Variable</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          placeholder="Enter value..."
                          value={mappings[param.name]?.value || ""}
                          onChange={(e) => handleMappingChange(param.name, 'value', e.target.value)}
                          className="h-[46px] px-3 border-gray-200 rounded-[8px] text-[13px] flex-1 bg-white focus:ring-[#2A53A0]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-3 pt-2">
                <button 
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="flex items-center gap-1 text-[14px] font-bold text-[#394960] hover:text-[#2A53A0] transition-colors"
                >
                  <div className="w-5 flex justify-center">
                    {isAdvancedOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                  Advanced Settings
                </button>
                
                {isAdvancedOpen && (
                  <div className="border border-[#E7EBF1] rounded-[8px] p-6 bg-white space-y-5 shadow-sm">
                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-[#394960]">Execution Flow Control</Label>
                      <RadioGroup 
                        value={executionMode} 
                        onValueChange={setExecutionMode} 
                        className="flex items-center gap-8"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="sync" id="sync" className="size-5 border-[#C1C9D2] text-[#2A53A0]" />
                          <Label htmlFor="sync" className="text-[14px] font-medium text-[#4B5E7D] cursor-pointer">Synchronous</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="async" id="async" className="size-5 border-[#C1C9D2] text-[#2A53A0]" />
                          <Label htmlFor="async" className="text-[14px] font-medium text-[#4B5E7D] cursor-pointer">Asynchronous</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="pt-2 space-y-4">
                      <div className="flex items-center justify-between p-3 border border-transparent hover:border-[#E7EBF1] hover:bg-[#F8F9FB] rounded-[8px] transition-all">
                        <div className="space-y-0.5">
                          <Label htmlFor="retry" className="text-[14px] font-bold text-[#394960] cursor-pointer">Enable Auto-Retry</Label>
                          <p className="text-[12px] text-gray-500">Automatically retry the call if a network error occurs.</p>
                        </div>
                        <Switch 
                          id="retry" 
                          checked={enableRetry} 
                          onCheckedChange={setEnableRetry}
                          className="data-[state=checked]:bg-[#2A53A0] data-[state=unchecked]:bg-[#E2E8F0]"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border border-transparent hover:border-[#E7EBF1] hover:bg-[#F8F9FB] rounded-[8px] transition-all">
                        <div className="space-y-0.5">
                          <Label htmlFor="failure" className="text-[14px] font-bold text-[#394960] cursor-pointer">Continue on Failure</Label>
                          <p className="text-[12px] text-gray-500">Proceed to the next action even if this API call fails.</p>
                        </div>
                        <Switch 
                          id="failure" 
                          checked={continueOnFailure} 
                          onCheckedChange={setContinueOnFailure}
                          className="data-[state=checked]:bg-[#2A53A0] data-[state=unchecked]:bg-[#E2E8F0]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-[#E7EBF1] rounded-[12px] bg-gray-50/30">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md mb-4 border border-[#E7EBF1]">
                <Play size={24} className="text-[#2A53A0]/40 ml-1" />
              </div>
              <p className="text-[14px] font-medium text-gray-500 text-center max-w-[300px]">
                Select an API endpoint to start configuring your automated action.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t flex flex-row items-center justify-between bg-white sticky bottom-0 z-10">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="h-[48px] px-6 text-[#161616] font-bold hover:bg-gray-100 rounded-[8px] transition-colors"
          >
            Cancel
          </Button>

          <div className="flex gap-3">
            <Button 
              variant="outline"
              disabled={!selectedApi}
              className="h-[48px] px-6 border-2 border-[#2A53A0] bg-transparent text-[#2A53A0] hover:bg-[#2A53A0]/5 font-bold rounded-[8px] gap-2 disabled:opacity-30 transition-all"
            >
              <Play size={16} fill="currentColor" />
              Test Connection
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!selectedApi}
              className="h-[48px] px-8 bg-[#2A53A0] hover:bg-[#1E3D75] text-white font-bold rounded-[8px] shadow-sm transition-all disabled:bg-gray-200 disabled:text-gray-400"
            >
              Save API Call
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
