import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription, 
  DialogHeader 
} from "./ui/dialog";
import { Close, Code, Information } from "@carbon/icons-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "./ui/utils";

interface ViewFieldDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: {
    id: string;
    name: string;
    code: string;
    dataType: string;
    type: "System" | "Derived" | "Custom";
    sourceMapping: string;
    sourceType: string;
    transformation?: string;
    constraints?: {
      required?: boolean;
      maxLength?: number;
    };
    containsPii?: boolean;
    category?: string;
  } | null;
}

export function ViewFieldDetailsDialog({ open, onOpenChange, field }: ViewFieldDetailsProps) {
  if (!field) return null;

  const isSystemField = field.type === "System";
  const isCustomField = field.type === "Custom";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[680px] p-0 gap-0 rounded-[8px] overflow-hidden bg-white shadow-2xl flex flex-col z-[100] [&>button]:hidden max-h-[90vh]">
        {/* Header - Fixed 64px based on high-density design */}
        <DialogHeader className="flex-none flex flex-row items-center justify-between px-[30px] h-[64px] border-b border-gray-100 bg-[#2A53A0] space-y-0 text-white">
          <div className="flex items-center gap-3">
             <DialogTitle className="text-[20px] font-normal text-white">Field Details</DialogTitle>
             <DialogDescription className="sr-only">
               Detailed information for field {field.name}
             </DialogDescription>
          </div>
          <button 
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-[28px] h-[28px] flex items-center justify-center hover:bg-white/10 rounded-[4px] transition-colors text-white"
            aria-label="Close"
          >
            <Close size={18} />
          </button>
        </DialogHeader>

        {/* Content Area - No Footer as per viewing pattern */}
        <div className="flex-1 overflow-y-auto p-[30px] space-y-6 custom-scrollbar">
          <div className="space-y-1 pb-4 border-b border-gray-100">
            <h2 className="text-[22px] font-semibold text-[#161616] leading-tight font-mono">{field.name}</h2>
            <div className={cn(
                "inline-flex items-center px-3 py-1 text-[12px] font-medium rounded-[4px] border",
                isCustomField ? "bg-[#F6F2FF] text-[#8a3ffc] border-[#D0C0FF]" : "bg-gray-100 text-[#525252] border-gray-200"
            )}>
               {isSystemField ? "Default Field (OOTB)" : `${field.type} Field`}
            </div>
          </div>

          <div className="space-y-5">
            {/* Field Grid */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616]">Field Name</Label>
                    <Input readOnly value={field.name} className="!h-[46px] bg-[#f4f4f4] border-gray-300 rounded-[8px] text-[14px] font-mono" />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616]">Field Code / Identifier</Label>
                    <Input readOnly value={field.code} className="!h-[46px] bg-[#f4f4f4] border-gray-300 rounded-[8px] text-[14px] text-blue-600 font-mono" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616]">Data Type</Label>
                    <div className="!h-[46px] w-full px-4 flex items-center bg-[#f0f7ff] border border-[#d0e2ff] rounded-[8px] text-[14px] text-blue-700 font-medium">
                        {field.dataType}
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616]">Field Origin</Label>
                    <Input readOnly value={field.type + " Field"} className="!h-[46px] bg-[#f4f4f4] border-gray-300 rounded-[8px] text-[14px]" />
                </div>
            </div>

            {/* Source Mapping */}
            <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-[#161616]">Source Mapping / Expression</Label>
                <div className="relative">
                    <Input readOnly value={field.sourceMapping} className="!h-[46px] bg-[#f4f4f4] border-gray-300 rounded-[8px] text-[14px] text-blue-500 font-mono" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white text-[#525252] text-[10px] font-bold uppercase rounded-[4px] border border-gray-200">
                        {field.sourceType || "Reference"}
                    </div>
                </div>
            </div>

            {/* Constraints & PII */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616]">Validation Constraints</Label>
                    <div className="border border-gray-200 rounded-[8px] overflow-hidden divide-y divide-gray-100">
                        <div className="flex items-center justify-between px-4 h-[40px] bg-white text-[13px]">
                            <span className="text-gray-600">Max Length</span>
                            <span className="font-bold text-[#161616]">{field.constraints?.maxLength || "255"}</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-[#161616]">PII Status</Label>
                    <div className={cn(
                        "flex items-center justify-between px-4 h-[40px] rounded-[8px] border text-[13px] font-medium",
                        field.containsPii ? "bg-red-50 border-red-100 text-red-700" : "bg-[#f6fff6] border-[#e6f4e6] text-[#198038]"
                    )}>
                        <span className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full border border-current" /> {field.containsPii ? "Sensitive Info" : "Standard Info"}
                        </span>
                        <span>{field.containsPii ? "YES" : "NO"}</span>
                    </div>
                </div>
            </div>

            {/* Field Info Summary */}
            <div className="mt-4 bg-[#f8f9fc] border-l-[4px] border-[#2A53A0] p-5 rounded-[8px] flex items-start gap-4">
                <div className="mt-1 text-[#2A53A0]">
                    <Information size={20} />
                </div>
                <div className="space-y-2 flex-1">
                    <h4 className="text-[13px] font-bold text-[#161616] uppercase tracking-wider">Field Metadata Summary</h4>
                    <div className="grid grid-cols-2 gap-y-1 text-[13px]">
                        <span className="text-gray-500">Category:</span>
                        <span className="text-[#161616] font-medium">{field.category || "Custom Field"}</span>
                        <span className="text-gray-500">Transformation:</span>
                        <span className="text-[#161616] font-mono">{field.transformation || "NONE"}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
        
        {/* Simple Footer for viewing dialog */}
        <div className="flex-none flex items-stretch h-[64px] bg-[#f4f4f4] border-t border-gray-200">
            <button 
                type="button"
                className="w-full bg-[#F4F4F4] hover:bg-[#e8e8e8] text-[#2A53A0] text-[14px] font-medium transition-colors"
                onClick={() => onOpenChange(false)}
            >
                Close Details
            </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
