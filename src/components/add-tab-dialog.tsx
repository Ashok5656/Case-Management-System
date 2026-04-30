import React from "react";
import { useForm } from "react-hook-form@7.55.0";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription,
  DialogHeader
} from "./ui/dialog";
import { Close, Checkmark, Add } from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { cn } from "./ui/utils";

interface AddTabFormData {
  cloneFrom: string;
  tabName: string;
  description: string;
}

export function AddTabDialog({ 
  open, 
  onOpenChange, 
  onAdd,
  existingTabs = []
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onAdd: (tabName: string, description: string, cloneFrom?: string) => void;
  existingTabs?: { id: string, name: string }[];
}) {
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    reset, 
    formState: { errors } 
  } = useForm<AddTabFormData>({
    mode: "onChange",
    defaultValues: {
      cloneFrom: "none",
      tabName: "",
      description: ""
    }
  });

  const tabNameValue = watch("tabName") || "";
  const descriptionValue = watch("description") || "";
  const cloneFromValue = watch("cloneFrom");
  const isFormValid = tabNameValue.trim().length > 0;

  const onSubmit = (data: AddTabFormData) => {
    onAdd(data.tabName, data.description, data.cloneFrom === "none" ? undefined : data.cloneFrom);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[540px] p-0 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[150] [&>button]:hidden">
        <DialogHeader className="flex-none flex flex-row items-center justify-between px-4 h-[48px] border-b border-gray-100 bg-white space-y-0">
          <div className="flex items-center gap-2">
             <Add size={20} className="text-[#2A53A0]" />
             <DialogTitle className="text-[16px] font-semibold text-[#161616]">Create New Tab</DialogTitle>
             <DialogDescription className="sr-only">Form to create a new configuration tab.</DialogDescription>
          </div>
          <button 
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-[28px] h-[28px] flex items-center justify-center hover:bg-gray-100 rounded-sm transition-colors text-gray-500"
          >
            <Close size={18} />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col bg-white">
          <div className="p-6 space-y-6">
            {/* Clone From */}
            <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-[#161616]">Clone from</Label>
                <Select 
                    value={cloneFromValue} 
                    onValueChange={(val) => setValue("cloneFrom", val)}
                >
                    <SelectTrigger className="w-full bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] !h-[46px]">
                        <SelectValue placeholder="Select source configuration" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-[160]">
                        <SelectItem value="none">Empty (Blank Tab)</SelectItem>
                        {existingTabs.map(tab => (
                            <SelectItem key={tab.id} value={tab.id}>{tab.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-[12px] text-gray-400">Select source configuration to copy, or Empty for blank tab</p>
            </div>

            {/* Tab Name */}
            <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-[#161616] flex items-center gap-1">
                    Tab Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                    {...register("tabName", { required: true, maxLength: 50 })}
                    placeholder="Enter tab name"
                    className={cn(
                        "w-full bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] !h-[46px]",
                        errors.tabName && "border-red-500"
                    )}
                />
                <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400">Max 50 characters</span>
                    <span className={cn(tabNameValue.length > 50 ? "text-red-500" : "text-gray-400")}>
                        {tabNameValue.length}/50
                    </span>
                </div>
            </div>

            {/* Tab Description */}
            <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-[#161616]">Tab Description</Label>
                <Textarea 
                    {...register("description", { maxLength: 500 })}
                    placeholder="Describe the purpose of this configuration variant"
                    className="w-full bg-white border-gray-300 rounded-sm focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] min-h-[100px] resize-none"
                />
                <div className="flex justify-end text-[11px]">
                    <span className={cn(descriptionValue.length > 500 ? "text-red-500" : "text-gray-400")}>
                        {descriptionValue.length}/500
                    </span>
                </div>
            </div>
          </div>

          <div className="flex-none flex items-center justify-end h-[72px] bg-[#f4f4f4] border-t border-gray-200 px-6 gap-3">
            <Button 
                type="button"
                variant="outline"
                className="!h-[42px] px-8 rounded-sm bg-white border-gray-300 text-[14px] font-medium text-[#161616]"
                onClick={() => onOpenChange(false)}
            >
                Cancel
            </Button>
            <Button 
                type="submit"
                disabled={!isFormValid}
                className={cn(
                  "!h-[42px] px-8 rounded-sm font-semibold border-0 text-[14px] transition-all",
                  isFormValid ? "bg-[#2A53A0] hover:bg-[#1e3c75] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
            >
                Create Tab
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
