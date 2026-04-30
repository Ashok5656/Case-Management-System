import React from "react";
import { useForm } from "react-hook-form@7.55.0";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription,
  DialogHeader
} from "./ui/dialog";
import { Close, Checkmark, Tag, Information } from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { cn } from "./ui/utils";

interface AddFieldFormData {
  fieldName: string;
  displayName: string;
  description: string;
  dataType: string;
  required: boolean;
  isPii: boolean;
  // String specific
  maxLength?: string;
  // Numeric specific
  minValue?: string;
  maxValue?: string;
  precision?: string;
  // Date specific
  dateFormat?: string;
  // Date Time specific
  dateTimeFormat?: string;
  timeZone?: string;
  // Boolean specific
  defaultValue?: string;
  trueLabel?: string;
  falseLabel?: string;
}

export function AddFieldDialog({ 
  open, 
  onOpenChange, 
  onAdd,
  initialData,
  title = "Add New Field"
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onAdd: (field: any) => void;
  initialData?: any;
  title?: string;
}) {
  const { 
    register, 
    handleSubmit, 
    watch, 
    reset, 
    setValue,
    formState: { errors, isValid } 
  } = useForm<AddFieldFormData>({
    mode: "onChange",
    defaultValues: {
      fieldName: initialData?.fieldName || "",
      displayName: initialData?.displayName || "",
      description: initialData?.description || "",
      dataType: initialData?.dataType || "String",
      required: initialData?.required || false,
      isPii: initialData?.isPii || false,
      maxLength: initialData?.maxLength || "",
      minValue: initialData?.minValue || "",
      maxValue: initialData?.maxValue || "",
      precision: initialData?.precision || "",
      dateFormat: initialData?.dateFormat || "YYYY-MM-DD",
      dateTimeFormat: initialData?.dateTimeFormat || "YYYY-MM-DD HH:mm:ss",
      timeZone: initialData?.timeZone || "UTC",
      defaultValue: initialData?.defaultValue || "false",
      trueLabel: initialData?.trueLabel || "True",
      falseLabel: initialData?.falseLabel || "False"
    }
  });

  const selectedDataType = watch("dataType");
  const isPiiChecked = watch("isPii");
  const fieldName = watch("fieldName");
  const displayName = watch("displayName");

  const isSubmitDisabled = !fieldName || !displayName;

  const onSubmit = (data: AddFieldFormData) => {
    onAdd({
      ...data,
      id: initialData?.id || `field-${Date.now()}`,
      category: "Custom",
      sourceMapping: initialData?.sourceMapping || "",
      constraints: data.isPii ? "PII" : "-"
    });
    reset();
    onOpenChange(false);
  };

  const renderTypeSpecificFields = () => {
    switch (selectedDataType) {
      case "String":
        return (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">Max Length</Label>
              <Input 
                {...register("maxLength")}
                type="number"
                placeholder="255"
                className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]"
              />
            </div>
          </div>
        );
      case "Integer":
        return (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">Min Value</Label>
              <Input 
                {...register("minValue")}
                type="number"
                placeholder="0"
                className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">Max Value</Label>
              <Input 
                {...register("maxValue")}
                type="number"
                placeholder="99999"
                className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]"
              />
            </div>
          </div>
        );
      case "Double":
      case "Decimal":
        return (
          <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">Min Value</Label>
              <Input 
                {...register("minValue")}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">Max Value</Label>
              <Input 
                {...register("maxValue")}
                type="number"
                step="0.01"
                placeholder="1000000.00"
                className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">Precision</Label>
              <Input 
                {...register("precision")}
                type="number"
                placeholder="2"
                className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]"
              />
            </div>
          </div>
        );
      case "Date":
        return (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <Label className="text-[13px] font-semibold text-[#161616]">Date Format</Label>
            <Select 
              value={watch("dateFormat")} 
              onValueChange={(val) => setValue("dateFormat", val)}
            >
              <SelectTrigger className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="ISO8601">ISO 8601</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "Date time":
        return (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">Date Time Format</Label>
              <Input 
                {...register("dateTimeFormat")}
                placeholder="YYYY-MM-DD HH:mm:ss"
                className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">Time Zone</Label>
              <Select 
                value={watch("timeZone")} 
                onValueChange={(val) => setValue("timeZone", val)}
              >
                <SelectTrigger className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">EST</SelectItem>
                  <SelectItem value="PST">PST</SelectItem>
                  <SelectItem value="IST">IST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "Boolean":
        return (
          <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">Default Value</Label>
              <Select 
                value={watch("defaultValue")} 
                onValueChange={(val) => setValue("defaultValue", val)}
              >
                <SelectTrigger className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">True Label</Label>
              <Input 
                {...register("trueLabel")}
                placeholder="True"
                className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">False Label</Label>
              <Input 
                {...register("falseLabel")}
                placeholder="False"
                className="w-full bg-white border-gray-300 rounded-[8px] !h-[46px]"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[680px] p-0 gap-0 rounded-[8px] overflow-hidden bg-white shadow-2xl flex flex-col z-[100] [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="flex-none flex flex-row items-center justify-between px-[30px] h-[64px] border-b border-gray-100 bg-[#2A53A0] space-y-0">
          <div className="flex items-center gap-3">
             <DialogTitle className="text-[20px] font-normal text-white">{title}</DialogTitle>
             <DialogDescription className="sr-only">
               Configure the details and constraints for the new event field.
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
          <div className="px-5 py-4 space-y-4">
            
            {/* Row 1: Field Name and Display Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-[#161616]">
                  Field Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  {...register("fieldName", { required: "Field Name is required" })}
                  placeholder="e.g., transaction_amt"
                  className={cn(
                    "w-full bg-white border-gray-300 rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] !h-[46px]",
                    errors.fieldName && "border-red-500 focus:ring-red-500"
                  )}
                />
                {errors.fieldName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.fieldName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-[#161616]">
                  Display Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  {...register("displayName", { required: "Display Name is required" })}
                  placeholder="e.g., Transaction Amount"
                  className={cn(
                    "w-full bg-white border-gray-300 rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] !h-[46px]",
                    errors.displayName && "border-red-500 focus:ring-red-500"
                  )}
                />
                {errors.displayName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.displayName.message}</p>
                )}
              </div>
            </div>

            {/* Row 2: Description */}
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">Description</Label>
              <Textarea 
                {...register("description")}
                placeholder="Briefly describe the purpose of this field..."
                className="w-full bg-white border-gray-300 rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] min-h-[80px] resize-none"
              />
            </div>

            {/* Row 3: Data Type */}
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#161616]">
                Data Type <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={selectedDataType} 
                onValueChange={(val: any) => setValue("dataType", val, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full bg-white border-gray-300 rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] !h-[46px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[110]">
                  <SelectItem value="String">String</SelectItem>
                  <SelectItem value="Integer">Integer</SelectItem>
                  <SelectItem value="Double">Double</SelectItem>
                  <SelectItem value="Decimal">Decimal</SelectItem>
                  <SelectItem value="Boolean">Boolean</SelectItem>
                  <SelectItem value="Date">Date</SelectItem>
                  <SelectItem value="Date time">Date time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type Specific Constraints */}
            <div className="bg-white border border-gray-200 rounded-[12px] p-5 space-y-4">
               <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <Information size={14} />
                  Type Specific Constraints
               </div>
               {renderTypeSpecificFields()}
            </div>

            {/* PII Settings Section - LAST */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <Checkbox 
                        id="add-pii-check" 
                        checked={watch("isPii")}
                        onCheckedChange={(val: boolean) => {
                            setValue("isPii", !!val);
                        }}
                        className="h-5 w-5 border-gray-300 data-[state=checked]:bg-[#2A53A0] data-[state=checked]:border-[#2A53A0] rounded-[4px]"
                    />
                    <Label htmlFor="add-pii-check" className="text-[14px] font-medium text-[#161616] cursor-pointer select-none">
                        Mark as PII (Personally Identifiable Information)
                    </Label>
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
                disabled={isSubmitDisabled}
                className="w-1/2 bg-[#2A53A0] hover:bg-[#1e3c75] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Checkmark size={18} /> Create Field
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
