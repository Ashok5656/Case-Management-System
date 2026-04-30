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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { cn } from "./ui/utils";
import { AlertTriangle, Check, X, Info } from "lucide-react";

interface RdaResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const RESPONSE_TYPES = [
  { id: "Decline", label: "Decline", code: "D", color: "bg-red-500", borderColor: "border-red-500", textColor: "text-red-500", bgColor: "bg-red-50" },
  { id: "Allow", label: "Allow", code: "A", color: "bg-green-500", borderColor: "border-green-500", textColor: "text-green-500", bgColor: "bg-green-50" },
  { id: "Challenge 1", label: "Challenge 1", code: "C", color: "bg-orange-500", borderColor: "border-orange-500", textColor: "text-orange-500", bgColor: "bg-orange-50" },
  { id: "Challenge 2", label: "Challenge 2", code: "C", color: "bg-orange-500", borderColor: "border-orange-500", textColor: "text-orange-500", bgColor: "bg-orange-50" },
  { id: "Challenge 3", label: "Challenge 3", code: "C", color: "bg-orange-500", borderColor: "border-orange-500", textColor: "text-orange-500", bgColor: "bg-orange-50" },
];

export function RdaResponseModal({ isOpen, onClose, onSave }: RdaResponseModalProps) {
  const [selectedType, setSelectedType] = useState("Decline");
  const [responseCode, setResponseCode] = useState("DECLINE");
  const [responseMessage, setResponseMessage] = useState("Decline");
  const [reasonCode, setReasonCode] = useState("High Risk Profile");
  const [storeAsEvent, setStoreAsEvent] = useState(true);

  const handleTypeSelect = (type: any) => {
    setSelectedType(type.id);
    setResponseCode(type.label.toUpperCase());
    setResponseMessage(type.label);
  };

  const handleSave = () => {
    onSave({
      type: selectedType,
      code: responseCode,
      message: responseMessage,
      reasonCode,
      storeAsEvent
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden border-none rounded-[12px] gap-0">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-[16px] font-bold text-[#161616]">Configure RDA Response</DialogTitle>
          <DialogDescription className="sr-only">
            Adjust the settings for real-time automated data responses, including response type and reason codes.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Alert Box */}
          <div className="bg-[#FFF8E6] border border-[#FFEAB3] rounded-[8px] p-4 flex gap-3">
            <AlertTriangle className="text-[#FF8800] shrink-0" size={20} />
            <div>
              <p className="text-[14px] font-bold text-[#161616]">Real-Time Decision</p>
              <p className="text-[12px] text-gray-600 mt-0.5">This action will affect real-time transaction processing.</p>
            </div>
          </div>

          {/* Response Type */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-[#394960] flex items-center gap-1">
              Response Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {RESPONSE_TYPES.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type)}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-3 border rounded-[8px] transition-all h-[110px]",
                      isSelected 
                        ? cn(type.borderColor, type.bgColor) 
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1">
                        <Check size={12} className={type.textColor} strokeWidth={3} />
                      </div>
                    )}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white text-[14px] font-bold mb-2 shadow-sm",
                      type.color
                    )}>
                      {type.code}
                    </div>
                    <span className={cn(
                      "text-[11px] font-bold text-center leading-tight",
                      isSelected ? type.textColor : "text-[#4B5E7D]"
                    )}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Response Code */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#394960]">Response Code</label>
              <Input 
                value={responseCode} 
                readOnly 
                className="bg-[#F8F9FB] border-gray-200 text-gray-500 font-mono text-[13px] h-[46px] px-4 rounded-[8px]" 
              />
            </div>

            {/* Reason Code */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#394960] flex items-center gap-1">
                Reason Code <span className="text-red-500">*</span>
              </label>
              <Select value={reasonCode} onValueChange={setReasonCode}>
                <SelectTrigger className="h-[46px] px-4 border-gray-200 rounded-[8px] text-[13px] bg-white">
                  <SelectValue placeholder="Select reason code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High Risk Profile">High Risk Profile</SelectItem>
                  <SelectItem value="Suspicious Activity">Suspicious Activity</SelectItem>
                  <SelectItem value="Threshold Exceeded">Threshold Exceeded</SelectItem>
                  <SelectItem value="Unusual Velocity">Unusual Velocity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Response Message */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[13px] font-bold text-[#394960]">
                Response Message <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <span className="text-[11px] text-gray-400">{responseMessage.length}/200</span>
            </div>
            <Input 
              value={responseMessage} 
              onChange={(e) => setResponseMessage(e.target.value)}
              className="h-[46px] px-4 border-gray-200 rounded-[8px] text-[13px] focus:ring-[#2A53A0] bg-white" 
            />
          </div>

          {/* Analysis Switch */}
          <div className="bg-[#F8F9FB] rounded-[8px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-[#4B5E7D]">Store decision as event for analysis</span>
              <Info size={14} className="text-[#2A53A0]" />
            </div>
            <Switch 
              checked={storeAsEvent} 
              onCheckedChange={setStoreAsEvent}
              className="data-[state=checked]:bg-[#2A53A0]"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t flex flex-row items-center justify-between bg-white">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="h-[48px] px-6 text-[#161616] font-bold hover:bg-gray-100 rounded-[8px] transition-colors"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="h-[48px] px-8 bg-[#2A53A0] hover:bg-[#1E3D75] text-white font-bold rounded-[8px] shadow-sm transition-all"
          >
            Save RDA Response
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
