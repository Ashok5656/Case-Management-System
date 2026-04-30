import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form@7.55.0";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription,
  DialogHeader
} from "./ui/dialog";
import { Close, Information, Checkmark, Grid } from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "./ui/utils";
import { motion, AnimatePresence } from "motion/react";

interface ConfigureDerivedFormData {
  profileAssignment: "all" | "specific";
  isPii: boolean;
  description: string;
}

interface ConfigureDerivedFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (fieldId: string, data: any) => void;
  field: any;
}

const AVAILABLE_PROFILES = [
  "Retail Banking",
  "Corporate Banking",
  "Wealth Management",
  "Card Transactions",
  "Trade Finance",
  "Treasury"
];

export function ConfigureDerivedFieldDialog({ 
  open, 
  onOpenChange, 
  onSave,
  field
}: ConfigureDerivedFieldDialogProps) {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    reset 
  } = useForm<ConfigureDerivedFormData>({
    defaultValues: {
      profileAssignment: "all",
      isPii: false,
      description: ""
    }
  });

  useEffect(() => {
    if (field && open) {
      reset({
        profileAssignment: field.profileAssignment || "all",
        isPii: (field.constraints || "").toString().includes("PII") || !!field.containsPii,
        description: field.description || field.constraints || ""
      });
      setSelectedProfiles(["Retail Banking", "Corporate Banking", "Card Transactions"]);
    }
  }, [field, open, reset]);

  const profileAssignment = watch("profileAssignment");
  const isPiiChecked = watch("isPii");

  const toggleProfile = (profile: string) => {
    setSelectedProfiles(prev => 
      prev.includes(profile) 
        ? prev.filter(p => p !== profile) 
        : [...prev, profile]
    );
  };

  const onSubmit = (data: ConfigureDerivedFormData) => {
    onSave(field.id, {
      ...data,
      selectedProfiles: data.profileAssignment === "specific" ? selectedProfiles : []
    });
    onOpenChange(false);
  };

  if (!field) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[680px] p-0 gap-0 rounded-[8px] overflow-hidden bg-white shadow-2xl flex flex-col z-[100] [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="flex-none flex flex-row items-center justify-between px-[30px] h-[64px] border-b border-gray-100 bg-[#2A53A0] space-y-0 text-white">
          <div className="flex items-center gap-3">
             <DialogTitle className="text-[20px] font-normal text-white">Configure Derived Field</DialogTitle>
             <DialogDescription className="sr-only">
               Configure profile assignment and privacy settings for the derived field.
             </DialogDescription>
          </div>
          <button 
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-[28px] h-[28px] flex items-center justify-center hover:bg-white/10 rounded-[4px] transition-colors text-white"
          >
            <Close size={18} />
          </button>
        </DialogHeader>

        {/* Main Content Area */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col bg-white overflow-y-auto max-h-[80vh]">
          <div className="px-5 py-6 space-y-6">
            
            {/* Field Name Row - Read Only */}
            <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-[#161616]">Field Name</Label>
                <div className="relative flex items-center bg-[#f4f4f4] border border-gray-300 rounded-[8px] h-[46px] px-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-6 h-6 bg-white rounded border border-gray-200 flex items-center justify-center">
                            <Grid size={16} className="text-[#da1e28]" />
                        </div>
                        <span className="text-[14px] font-mono text-[#161616]">{field.fieldName}</span>
                    </div>
                    <div className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[11px] font-medium rounded-[4px]">
                        Read-only
                    </div>
                </div>
            </div>

            {/* Description Area */}
            <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-[#161616]">Description</Label>
                <div className="text-[14px] text-[#525252] min-h-[20px] px-1">
                    {field.description || "No description provided."}
                </div>
                <div className="h-[1px] bg-gray-100 w-full" />
            </div>

            {/* Profile Assignment Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                  PROFILE ASSIGNMENT
                </div>
                <RadioGroup 
                    value={profileAssignment} 
                    onValueChange={(val: any) => setValue("profileAssignment", val)}
                    className="flex flex-col gap-3.5"
                >
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="all" id="r-all" className="h-5 w-5 border-gray-400 text-[#2A53A0] focus:ring-[#2A53A0]" />
                        <Label htmlFor="r-all" className="text-[14px] font-normal text-[#161616] cursor-pointer">Apply to All Profiles</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="specific" id="r-specific" className="h-5 w-5 border-gray-400 text-[#2A53A0] focus:ring-[#2A53A0]" />
                        <Label htmlFor="r-specific" className="text-[14px] font-normal text-[#161616] cursor-pointer">Select Specific Profiles</Label>
                    </div>
                </RadioGroup>

                <AnimatePresence>
                  {profileAssignment === "specific" && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-[8px] grid grid-cols-2 gap-x-6 gap-y-4">
                        {AVAILABLE_PROFILES.map((profile) => (
                          <div key={profile} className="flex items-center gap-3">
                            <Checkbox 
                              id={`profile-${profile}`}
                              checked={selectedProfiles.includes(profile)}
                              onCheckedChange={() => toggleProfile(profile)}
                              className="h-4 w-4 border-gray-400 data-[state=checked]:bg-[#2A53A0] data-[state=checked]:border-[#2A53A0]"
                            />
                            <Label 
                              htmlFor={`profile-${profile}`}
                              className="text-[13px] font-normal text-[#161616] cursor-pointer select-none"
                            >
                              {profile}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="h-[1px] bg-gray-100 w-full mt-2" />
            </div>

            {/* Data Privacy Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                  DATA PRIVACY
                </div>
                <div className="flex items-center gap-3">
                    <Checkbox 
                        id="config-pii" 
                        checked={isPiiChecked}
                        onCheckedChange={(val: boolean) => setValue("isPii", !!val)}
                        className="h-5 w-5 border-gray-400 rounded-[4px] data-[state=checked]:bg-[#2A53A0] data-[state=checked]:border-[#2A53A0]"
                    />
                    <Label 
                        htmlFor="config-pii" 
                        className="text-[14px] font-normal text-[#161616] cursor-pointer select-none"
                    >
                        Mark as PII (Personally Identifiable Information)
                    </Label>
                </div>

                {/* Info Alert */}
                <div className="flex items-start gap-3 p-3 bg-[#edf5ff] border border-[#d0e2ff] rounded-[8px] mt-2">
                    <div className="mt-0.5 text-[#0043ce]">
                        <Information size={18} />
                    </div>
                    <p className="text-[13px] text-[#0043ce] leading-relaxed">
                        Enable if this derived field could reveal sensitive patterns or contains personal data.
                    </p>
                </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex-none flex items-stretch h-[64px] bg-[#f4f4f4] border-t border-gray-200 gap-0">
            <button 
                type="button"
                className="w-1/2 bg-[#F4F4F4] hover:bg-[#e8e8e8] text-[#2A53A0] text-[14px] font-medium transition-colors"
                onClick={() => onOpenChange(false)}
            >
                Cancel
            </button>
            <button 
                type="submit"
                className="w-1/2 bg-[#2A53A0] hover:bg-[#1e3c75] text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Checkmark size={18} /> Save Configuration
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
