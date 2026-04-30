import React, { useState } from "react";
import { 
  Checkmark, 
  CheckmarkFilled,
  Close, 
  ChevronRight, 
  ArrowRight,
  StarFilled,
  Warning,
  Information,
  Upload,
  Calculation,
  Settings,
  View,
  Edit,
  TrashCan,
  Add,
  Tag,
  Security
} from "@carbon/icons-react";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { toast } from "sonner@2.0.3";
import PageHeader from "./page-header";
import { AddFieldDialog } from "./add-field-dialog";
import { AddMappingFieldDialog } from "./add-mapping-field-dialog";
import { DerivedFieldDialog } from "./derived-field-dialog";
import { BulkFieldUploadDialog } from "./bulk-field-upload-dialog";

interface CreateEventPageProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  breadcrumbs: any[];
  onBreadcrumbNavigate: (path: string) => void;
  title?: string;
  initialEvent?: any;
}

import imgClari5Loader from "figma:asset/f00e65b2786f070bfa2a235a2ec971d7f5109221.png";

const Clari5Loader = () => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#333333]/50">
    <div className="bg-white w-[211px] h-[100px] rounded-[8px] flex flex-col items-center justify-center gap-2 relative shadow-lg">
      <div className="w-[46px] h-[46px] animate-spin">
        <img src={imgClari5Loader} alt="Loading..." className="w-full h-full object-contain" />
      </div>
      <p className="text-[#333333] text-[16px] font-normal font-sans">Loading....</p>
    </div>
  </div>
);

const SuccessDialog = ({ onContinue, eventName }: { onContinue: () => void, eventName: string }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#333333]/50 animate-in fade-in duration-300">
    <div className="bg-white w-[360px] h-[260px] rounded-[8px] overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-300">
      <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-4 px-6 text-center">
        {/* Checkmark Icon */}
        <div className="mb-4">
          <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
            <path 
              d="M18 0C8.06 0 0 8.06 0 18C0 27.94 8.06 36 18 36C27.94 36 36 27.94 36 18C36 8.06 27.94 0 18 0ZM18 33.12C9.66 33.12 2.88 26.34 2.88 18C2.88 9.66 9.66 2.88 18 2.88C26.34 2.88 33.12 9.66 33.12 18C33.12 26.34 26.34 33.12 18 33.12Z" 
              fill="#2A53A0" 
            />
            <path 
              d="M25.74 11.16L15.48 21.42L10.26 16.2L8.28 18.18L15.48 25.38L27.72 13.14L25.74 11.16Z" 
              fill="#2A53A0" 
            />
          </svg>
        </div>
        
        <h2 className="text-[#2A53A0] text-[20px] font-medium mb-2">Success</h2>
        <div className="text-[#767676] text-[16px] leading-[1.6]">
          <p>Event Successfully</p>
          <p>Created</p>
        </div>
      </div>
      
      <button 
        onClick={onContinue}
        className="h-[55px] w-full bg-[#2A53A0] hover:bg-[#1e3c75] text-white text-[16px] font-normal transition-colors flex items-center justify-center"
      >
        Continue
      </button>
    </div>
  </div>
);

export function CreateEventPage({ 
  onCancel, 
  onSubmit, 
  breadcrumbs, 
  onBreadcrumbNavigate,
  title = "Create Custom Event",
  initialEvent
}: CreateEventPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDerivedDialogOpen, setIsDerivedDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<any>(null);
  const [formData, setFormData] = useState({
    eventName: initialEvent?.eventName || "",
    eventType: initialEvent?.type || "",
    description: initialEvent?.description || "",
    status: initialEvent?.status || "Active",
    category: "Custom",
    fields: initialEvent?.fields || [],
    submissionComment: ""
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { id: 1, label: "Event Information" },
    { id: 2, label: "Field Configuration" },
    { id: 3, label: "Review and Create Event" }
  ];

  const handleSaveDraft = () => {
    setShowDraftModal(true);
  };

  const goToDrafts = () => {
    setShowDraftModal(false);
    onSubmit({ ...formData, status: "Draft", artifactType: "event" });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API call / processing
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const handleFinalSubmit = () => {
    setShowSuccessModal(false);
    onSubmit({ 
      ...formData, 
      status: "Pending Approval", // Ensure status is set for verification
      artifactType: "event" 
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.eventName || !formData.eventType) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleBulkUpload = (newFields: any[]) => {
    // Add IDs to new fields if missing
    const fieldsWithIds = newFields.map(f => ({
      ...f,
      id: f.id || Math.random().toString(36).substr(2, 9),
      category: f.category || "Custom"
    }));
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, ...fieldsWithIds]
    }));
    
    toast.success(`Successfully uploaded ${newFields.length} field(s)`);
  };

  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !formData.eventName.trim() || !formData.eventType;
    }
    if (currentStep === 2) {
      return formData.fields.length === 0 || formData.fields.some(f => !f.fieldName?.trim());
    }
    return false;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center w-full py-5 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-6 w-full px-12">
        {steps.map((step, index) => (
          <div key={step.id} className="contents">
            <div className="flex items-center gap-3">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all border-2 shrink-0",
                  currentStep === step.id 
                    ? "bg-[#2A53A0] border-[#2A53A0] text-white shadow-sm ring-4 ring-blue-50" 
                    : currentStep > step.id 
                      ? "bg-green-500 border-green-500 text-white" 
                      : "bg-white border-gray-300 text-gray-400"
                )}
              >
                {currentStep > step.id ? <Checkmark size={18} /> : step.id}
              </div>
              <span className={cn(
                "text-[13px] font-semibold whitespace-nowrap",
                currentStep === step.id ? "text-[#2A53A0]" : "text-[#525252]"
              )}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-gray-200 min-w-[20px]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="w-full px-12 py-10 space-y-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Event Category */}
        <div className="space-y-2">
          <Label className="text-[14px] font-semibold text-[#161616]">Event Category</Label>
          <div className="flex items-center gap-2 bg-white border border-[#E8DAFF] rounded-[8px] px-3 !h-[46px] w-fit shadow-sm">
            <StarFilled size={16} className="text-[#8a3ffc]" />
            <span className="text-[11px] font-medium text-[#8a3ffc]">Custom</span>
            <span className="text-[12px] text-gray-400 font-normal ml-1">(Read-only)</span>
          </div>
        </div>

        {/* Event Name */}
        <div className="space-y-2">
          <Label className="text-[14px] font-semibold text-[#161616] flex items-center gap-1">
            Event Name <span className="text-red-500">*</span>
          </Label>
          <Input 
            placeholder="Enter event name (e.g., High_Value_Wire_Transfer)"
            className="!h-[46px] text-[14px] border-gray-300 focus:ring-[#2A53A0] bg-white rounded-[8px]"
            value={formData.eventName}
            onChange={(e) => setFormData({...formData, eventName: e.target.value})}
            maxLength={100}
          />
          <p className="text-[11px] text-gray-400 text-right mt-1">{formData.eventName.length}/100 characters</p>
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <Label className="text-[14px] font-semibold text-[#161616] flex items-center gap-1">
            Event Type <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.eventType} 
            onValueChange={(val) => setFormData({...formData, eventType: val})}
          >
            <SelectTrigger className="!h-[46px] border-gray-300 text-[14px] bg-white rounded-[8px] focus:ring-[#2A53A0]">
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Financial">Financial</SelectItem>
              <SelectItem value="Non-Financial">Non-Financial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label className="text-[14px] font-semibold text-[#161616] flex items-center gap-1">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.status} 
            onValueChange={(val) => setFormData({...formData, status: val})}
          >
            <SelectTrigger className="!h-[46px] border-gray-300 text-[14px] bg-white rounded-[8px] focus:ring-[#2A53A0]">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-[14px] font-normal text-[#161616]">Description / Notes (Optional)</Label>
          <textarea 
            placeholder="Enter details about this custom event..."
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-[8px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] text-[14px] outline-none bg-white"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            maxLength={500}
          />
          <p className="text-[11px] text-gray-400 text-right mt-1">{formData.description.length}/500 characters</p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="w-full px-12 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-[15px] font-semibold text-[#161616]">Field Configuration</h3>
          <p className="text-[12px] text-gray-500">Define the data structure for this custom event.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="h-[46px] px-4 border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 flex items-center gap-2 rounded-[8px] text-[13px] font-medium transition-colors"
            onClick={() => setIsBulkUploadOpen(true)}
          >
            <Upload size={16} /> Upload
          </Button>
          <Button 
            variant="outline" 
            className="h-[46px] border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-[13px] rounded-[8px] px-5 font-normal"
            onClick={() => setIsDerivedDialogOpen(true)}
          >
            <Calculation size={18} /> Add Derived Field
          </Button>
          <Button 
            variant="outline" 
            className="h-[46px] border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 flex items-center gap-2 text-[13px] rounded-[8px] px-5 font-medium"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Add size={18} /> Add Field
          </Button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-[8px] overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f4f4f4] h-[46px]">
            <tr>
              <th className="px-4 text-[14px] font-medium text-[#2A53A0]">Field / Display Name</th>
              <th className="px-4 text-[14px] font-medium text-[#2A53A0]">Type</th>
              <th className="px-4 text-[14px] font-medium text-[#2A53A0]">Constraints</th>
              <th className="px-4 text-[14px] font-medium text-[#2A53A0]">Req.</th>
              <th className="px-4 text-[14px] font-medium text-[#2A53A0]">PII</th>
              <th className="px-4 text-[14px] font-medium text-[#2A53A0]">Category</th>
              <th className="px-4 text-[14px] font-medium text-[#2A53A0] text-left w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(() => {
              const customFields = formData.fields.filter(f => f.category === "Custom" || !f.category);
              const derivedFields = formData.fields.filter(f => f.category === "Derived" || (f.category && f.category !== "Custom"));
              
              if (formData.fields.length === 0) {
                return (
                  <tr>
                    <td colSpan={7} className="h-48 text-center text-gray-400 text-[13px] bg-white">
                      <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                        <Tag size={32} />
                        <p>No fields defined yet. Click "Add Field" or "Load Reference Data" to start.</p>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <>
                  {/* CUSTOM FIELDS Section Header */}
                  {customFields.length > 0 && (
                    <tr className="bg-[#F8F5FF] h-[40px] border-y border-[#E8DAFF]">
                      <td colSpan={7} className="px-4 text-[11px] font-medium text-[#8a3ffc] tracking-wider">
                        CUSTOM FIELDS ({customFields.length})
                      </td>
                    </tr>
                  )}
                  
                  {customFields.map((field) => (
                    <tr key={field.id} className="h-[52px] hover:bg-gray-50 transition-colors group">
                      <td className="px-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-[14px] text-[#161616] font-medium leading-none mb-1">{field.fieldName}</span>
                          <span className="text-[11px] text-gray-500 font-normal">{field.displayName || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 align-middle">
                        <span className="text-[13px] text-[#525252]">{field.dataType || "String"}</span>
                      </td>
                      <td className="px-4 align-middle">
                        <div className="flex flex-col gap-0.5">
                           {field.maxLength && <span className="text-[11px] text-gray-400">Max: {field.maxLength}</span>}
                           {field.minValue && <span className="text-[11px] text-gray-400">Min: {field.minValue}</span>}
                           {field.maxValue && <span className="text-[11px] text-gray-400">Max: {field.maxValue}</span>}
                           {!field.maxLength && !field.minValue && !field.maxValue && <span className="text-[11px] text-gray-400">—</span>}
                        </div>
                      </td>
                      <td className="px-4 align-middle">
                        <span className={cn(
                          "text-[12px] font-medium",
                          field.required ? "text-red-600" : "text-gray-400"
                        )}>
                          {field.required ? "YES" : "NO"}
                        </span>
                      </td>
                      <td className="px-4 align-middle">
                        {field.isPii ? (
                          <Badge className="bg-[#FFF1F1] text-[#DA1E28] border-0 text-[10px] font-bold uppercase rounded-sm px-1.5 h-5 flex items-center gap-1 w-fit">
                            <Security size={10} />
                            {field.piiType || "PII"}
                          </Badge>
                        ) : (
                          <span className="text-[13px] text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 align-middle">
                        <div className="flex items-center gap-1.5 bg-[#F8F5FF] border border-[#E8DAFF] rounded-[4px] px-2.5 py-1 w-fit">
                          <StarFilled size={12} className="text-[#8a3ffc]" />
                          <span className="text-[11px] font-medium text-[#8a3ffc]">Custom</span>
                        </div>
                      </td>
                      <td className="px-4 align-middle text-left">
                        <div className="flex items-center justify-start gap-1.5">
                          <button 
                            className="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] transition-colors border bg-[#f0f4f9] hover:bg-[#e1e9f4] text-[#2A53A0] border-[#d0e2ff]"
                            title="View"
                          >
                            <View size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              setFieldToEdit(field);
                              setIsAddDialogOpen(true);
                            }}
                            className="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] transition-colors border bg-[#edf5ff] hover:bg-[#d0e2ff] text-[#0043ce] border-[#d0e2ff]"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              const newFields = formData.fields.filter(f => f.id !== field.id);
                              setFormData({...formData, fields: newFields});
                            }}
                            className="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] transition-colors border bg-[#fff1f1] hover:bg-[#ffd7d9] text-[#da1e28] border-[#ffd7d9]"
                            title="Delete"
                          >
                            <TrashCan size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* DERIVED FIELDS Section Header */}
                  {derivedFields.length > 0 && (
                    <tr className="bg-[#EDF5FF] h-[40px] border-y border-[#D0E2FF]">
                      <td colSpan={7} className="px-4 text-[11px] font-medium text-[#2A53A0] tracking-wider">
                        DERIVED FIELDS ({derivedFields.length})
                      </td>
                    </tr>
                  )}

                  {derivedFields.map((field) => (
                    <tr key={field.id} className="h-[52px] hover:bg-gray-50 transition-colors group">
                      <td className="px-4 align-middle">
                        <div className="flex items-center gap-2.5">
                          {/* Colorful Grid Icon Mimic */}
                          <div className="grid grid-cols-2 gap-0.5 w-4 h-4 p-0.5 bg-gray-100 rounded-[2px] border border-gray-200">
                             <div className="bg-red-400 rounded-[1px]" />
                             <div className="bg-green-400 rounded-[1px]" />
                             <div className="bg-blue-400 rounded-[1px]" />
                             <div className="bg-orange-400 rounded-[1px]" />
                          </div>
                          <span className="text-[14px] text-[#161616] font-medium">{field.fieldName}</span>
                        </div>
                      </td>
                      <td className="px-4 align-middle">
                        <span className="text-[13px] text-[#525252]">{field.dataType || "Double"}</span>
                      </td>
                      <td className="px-4 align-middle">
                        <span className="text-[13px] text-gray-400 italic">[System Computed]</span>
                      </td>
                      <td className="px-4 align-middle">
                        <span className="text-[13px] text-gray-400">—</span>
                      </td>
                      <td className="px-4 align-middle">
                        {field.isPii ? (
                          <Badge className="bg-[#FFF1F1] text-[#DA1E28] border-0 text-[10px] font-bold uppercase rounded-sm px-1.5 h-5 flex items-center gap-1 w-fit">
                            <Security size={10} />
                            {field.piiType || "PII"}
                          </Badge>
                        ) : (
                          <span className="text-[13px] text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 align-middle">
                        <div className="bg-[#EDF5FF] border border-[#D0E2FF] rounded-[4px] px-2.5 py-1 w-fit">
                          <span className="text-[11px] font-medium text-[#2A53A0]">Derived</span>
                        </div>
                      </td>
                      <td className="px-4 align-middle text-left">
                        <div className="flex items-center justify-start gap-1.5">
                          <button 
                            className="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] transition-colors border bg-[#f0f4f9] hover:bg-[#e1e9f4] text-[#2A53A0] border-[#d0e2ff]"
                            title="View"
                          >
                            <View size={16} />
                          </button>
                          <button 
                            className="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] transition-colors border bg-[#f4f4f4] hover:bg-[#e0e0e0] text-[#525252] border-gray-200"
                            title="Settings"
                          >
                            <Settings size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              const newFields = formData.fields.filter(f => f.id !== field.id);
                              setFormData({...formData, fields: newFields});
                            }}
                            className="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] transition-colors border bg-[#fff1f1] hover:bg-[#ffd7d9] text-[#da1e28] border-[#ffd7d9]"
                            title="Delete"
                          >
                            <TrashCan size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              );
            })()}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 p-4 border-l-4 border-[#2A53A0] rounded-r-[8px] flex gap-3">
        <Information size={20} className="text-[#2A53A0] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[13px] font-semibold text-[#2A53A0]">Heads up!</p>
          <p className="text-[12px] text-blue-800 leading-relaxed">
            All events automatically include standard audit fields like `tenant_id`, `event_id`, and `timestamp`. You only need to define custom business attributes here.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const customFields = formData.fields.filter(f => f.category === "Custom" || !f.category);
    const derivedFields = formData.fields.filter(f => f.category === "Derived" || (f.category && f.category !== "Custom"));
    const piiCount = formData.fields.filter(f => f.isPii).length;

    return (
      <div className="w-full px-12 py-6 space-y-6">
        {/* EVENT INFORMATION */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-medium text-[#161616]">Event Information</h3>
            <button 
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1 text-[#2A53A0] hover:underline text-[14px] font-medium"
            >
              <Edit size={16} /> Edit
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-[8px] p-4 shadow-sm space-y-2">
            <div className="flex items-center gap-1.5 text-[14px] flex-wrap">
              <span className="font-medium text-[#525252]">Name:</span>
              <span className="text-[#161616] font-normal">{formData.eventName || "—"}</span>
              <span className="text-gray-300 mx-3">|</span>
              <span className="font-medium text-[#525252]">Type:</span>
              <span className="text-[#161616] font-normal">{formData.eventType || "—"}</span>
              <span className="text-gray-300 mx-3">|</span>
              <span className="font-medium text-[#525252]">Category:</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#F1E8FF] border border-[#E8DAFF] rounded-[4px] w-fit">
                <StarFilled size={12} className="text-[#8a3ffc]" />
                <span className="text-[11px] font-medium text-[#8a3ffc]">Custom</span>
              </div>
              <span className="text-gray-300 mx-3">|</span>
              <span className="font-medium text-[#525252]">Status:</span>
              <div className={cn(
                "px-2 py-0.5 rounded-[4px] text-[11px] font-medium border w-fit",
                formData.status === "Active" 
                  ? "bg-[#DEFBE6] text-[#198038] border-[#A7F0BA]" 
                  : "bg-gray-100 text-gray-600 border-gray-200"
              )}>
                {formData.status}
              </div>
            </div>
            <div className="h-[1px] bg-gray-100 w-full" />
            <div className="flex items-start gap-2">
              <span className="text-[14px] font-medium text-[#525252] whitespace-nowrap">Description:</span>
              <span className="text-[14px] text-[#161616] leading-relaxed line-clamp-2 font-normal">{formData.description || "No description provided."}</span>
            </div>
          </div>
        </div>

        {/* FIELDS SUMMARY */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-medium text-[#161616]">
              Fields ({formData.fields.length} Total)
            </h3>
            <button 
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1 text-[#2A53A0] hover:underline text-[14px] font-medium"
            >
              <Edit size={16} /> Edit
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-[8px] p-4 shadow-sm">
            <div className="flex items-center gap-1.5 text-[14px]">
              <span className="font-medium text-[#525252]">Custom:</span>
              <span className="font-normal text-[#161616]">{customFields.length}</span>
              <span className="text-gray-300 mx-3">|</span>
              <span className="font-medium text-[#525252]">Derived:</span>
              <span className="font-normal text-[#161616]">{derivedFields.length}</span>
              <span className="text-gray-300 mx-3">|</span>
              <span className="font-medium text-[#525252]">PII:</span>
              <span className="font-normal text-[#161616]">{piiCount}</span>
              <span className="ml-1">🔒</span>
            </div>
          </div>
        </div>

        {/* CUSTOM FIELDS TABLE */}
        {customFields.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[14px] font-medium text-[#161616]">
              Custom Fields ({customFields.length})
            </h3>
            <div className="border border-gray-200 rounded-[8px] overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f4f4f4] h-[46px]">
                  <tr>
                    <th className="px-4 text-[14px] font-medium text-[#2A53A0]">Field / Display Name</th>
                    <th className="px-4 text-[14px] font-medium text-[#2A53A0]">Type</th>
                    <th className="px-4 text-[14px] font-medium text-[#2A53A0]">Req.</th>
                    <th className="px-4 text-[14px] font-medium text-[#2A53A0]">PII</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customFields.map((field) => (
                    <tr key={field.id} className="h-[48px]">
                      <td className="px-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-[#161616] leading-none mb-1">{field.fieldName}</span>
                          <span className="text-[10px] text-gray-500 font-normal">{field.displayName || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 align-middle text-[13px] text-[#525252] font-normal">{field.dataType}</td>
                      <td className="px-4 align-middle">
                        <span className={cn(
                          "text-[12px] font-medium",
                          field.required ? "text-red-600" : "text-gray-400"
                        )}>
                          {field.required ? "YES" : "NO"}
                        </span>
                      </td>
                      <td className="px-4 align-middle">
                        {field.isPii ? (
                          <div className="flex items-center gap-1.5 text-[#DA1E28] font-bold text-[10px]">
                            <Security size={12} />
                            {field.piiType?.toUpperCase() || "PII"}
                          </div>
                        ) : (
                          <span className="text-gray-300 text-[12px]">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DERIVED FIELDS TABLE */}
        {derivedFields.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[14px] font-medium text-[#161616]">
              Derived Fields ({derivedFields.length})
            </h3>
            <div className="border border-gray-200 rounded-[8px] overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f4f4f4] h-[46px]">
                  <tr>
                    <th className="px-4 text-[14px] font-medium text-[#2A53A0]">Destination</th>
                    <th className="px-4 text-[14px] font-medium text-[#2A53A0]">Source</th>
                    <th className="px-4 text-[14px] font-medium text-[#2A53A0]">Condition</th>
                    <th className="px-4 text-[14px] font-medium text-[#2A53A0]">PII</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {derivedFields.map((field) => (
                    <tr key={field.id} className="h-[48px]">
                      <td className="px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5 p-0.5 bg-gray-50 rounded-[1px] border border-gray-100">
                             <div className="bg-red-400 rounded-[1px]" />
                             <div className="bg-green-400 rounded-[1px]" />
                             <div className="bg-blue-400 rounded-[1px]" />
                             <div className="bg-orange-400 rounded-[1px]" />
                          </div>
                          <span className="text-[13px] font-normal text-[#161616]">{field.fieldName}</span>
                        </div>
                      </td>
                      <td className="px-4 align-middle text-[13px] italic text-[#161616] font-normal">[System Computed]</td>
                      <td className="px-4 align-middle text-[13px] text-[#161616] font-normal">—</td>
                      <td className="px-4 align-middle text-[13px] text-[#161616] font-normal">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBMISSION COMMENT */}
        <div className="space-y-2">
          <h3 className="text-[14px] font-medium text-[#161616]">Submission Comment</h3>
          <div className="bg-white border border-gray-200 rounded-[8px] p-4 shadow-sm">
            <textarea 
              placeholder="Add any additional context or comments for the approval team (optional)..."
              className="w-full min-h-[100px] text-[14px] text-[#525252] outline-none bg-transparent resize-none placeholder:text-gray-300"
              value={formData.submissionComment}
              onChange={(e) => setFormData({...formData, submissionComment: e.target.value})}
            />
          </div>
        </div>

        <div className="bg-orange-50 p-4 border-l-4 border-orange-400 rounded-r-[8px] flex gap-3">
          <Warning size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-orange-800 leading-relaxed">
            Submitting this event will make it available for configuration across all modules. Ensure the technical identifiers match your data ingestion pipeline.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* PERSISTENT HEADER REGION */}
      <div className="flex-none bg-white z-20 border-b border-gray-100 shadow-sm">
        <PageHeader 
          title={title}
          breadcrumbs={breadcrumbs}
          onBack={onCancel}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />
      </div>

      {/* Step Indicator */}
      <div className="flex-none">
        {renderStepIndicator()}
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto bg-white scrollbar-hide">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Footer */}
      <div className="flex-none bg-[#f4f4f4] border-t border-gray-200 h-[72px] flex items-center justify-between px-12">
        <div className="flex items-center gap-2">
           {currentStep > 1 && (
             <Button 
               variant="outline" 
               className="h-[48px] px-6 border-gray-300 text-[#525252] hover:bg-gray-50 text-[14px] rounded-[8px] flex items-center gap-2 font-semibold"
               onClick={handleBack}
             >
               <ArrowLeft size={18} strokeWidth={2.5} /> Back
             </Button>
           )}
           <Button 
             variant="outline" 
             className="!h-[48px] px-8 bg-white hover:bg-gray-50 text-[#525252] border border-gray-300 text-[14px] font-medium rounded-[8px] transition-colors"
             onClick={onCancel}
           >
             Cancel
           </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="h-[48px] px-6 border-gray-300 text-gray-600 hover:bg-white text-[14px] rounded-[8px]"
            onClick={handleSaveDraft}
          >
            Save as Draft
          </Button>
          <Button 
            disabled={isNextDisabled()}
            className={cn(
              "h-[48px] px-8 font-semibold shadow-sm transition-all text-[14px] rounded-[8px]",
              isNextDisabled() 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-[#2A53A0] hover:bg-[#1e3c75] text-white"
            )}
            onClick={currentStep === 3 ? handleSubmit : handleNext}
          >
            {currentStep === 3 ? (initialEvent ? "Update Custom Event" : "Review and Create Event") : "Next Step"}
          </Button>
        </div>
      </div>

      {/* Draft Success Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[400px] overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#2A53A0]">
                <Checkmark size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-[20px] font-bold text-[#161616]">Draft Saved</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Your progress on <strong>"{formData.eventName || 'Untitled Event'}"</strong> has been saved. You can return to complete this configuration at any time.
                </p>
              </div>
              <div className="pt-2 w-full flex flex-col gap-2">
                <Button 
                  className="w-full h-[48px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
                  onClick={goToDrafts}
                >
                  Go to My work
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-[48px] border-gray-300 text-gray-600 hover:bg-gray-50 font-bold rounded-[8px] text-[14px]"
                  onClick={() => setShowDraftModal(false)}
                >
                  Continue Editing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loader */}
      {isLoading && <Clari5Loader />}

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessDialog 
          eventName={formData.eventName} 
          onContinue={handleFinalSubmit} 
        />
      )}

      <AddMappingFieldDialog 
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setFieldToEdit(null);
        }}
        title={fieldToEdit ? "Edit Field" : "Add New Field"}
        initialData={fieldToEdit}
        onAdd={(newField) => {
          if (fieldToEdit) {
            setFormData(prev => ({
              ...prev,
              fields: prev.fields.map(f => f.id === fieldToEdit.id ? newField : f)
            }));
            toast.success(`Field "${newField.fieldName}" updated successfully`);
          } else {
            setFormData(prev => ({
              ...prev,
              fields: [...prev.fields, newField]
            }));
            toast.success(`Field "${newField.fieldName}" added successfully`);
          }
          setFieldToEdit(null);
        }}
      />

      <DerivedFieldDialog 
        open={isDerivedDialogOpen}
        onOpenChange={setIsDerivedDialogOpen}
        onAddFields={(newFields) => {
          setFormData(prev => ({
            ...prev,
            fields: [...prev.fields, ...newFields]
          }));
          toast.success(`${newFields.length} derived fields added successfully`);
        }}
      />

      <BulkFieldUploadDialog 
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUpload={handleBulkUpload}
      />
    </div>
  );
}
