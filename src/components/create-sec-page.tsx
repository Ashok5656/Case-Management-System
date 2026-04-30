import React, { useState, useMemo, useEffect } from "react";
import { 
  Checkmark, 
  CheckmarkFilled,
  Close, 
  Information,
  Settings,
  Edit,
  Add,
  Flash,
  Security,
  Code,
  Table,
  Warning,
  StarFilled,
  Launch,
  CircleDash,
  TrashCan,
  Copy as CarbonCopy,
  ChevronUp as CarbonChevronUp,
  ChevronDown as CarbonChevronDown
} from "@carbon/icons-react";
import { ArrowLeft, ChevronLeft, ArrowRight, Plus, Copy, Trash2, ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { toast } from "sonner@2.0.3";
import PageHeader from "./page-header";
import { ScrollArea } from "./ui/scroll-area";

interface ConditionRow {
  id: string;
  leftBracket: string;
  field: string;
  operator: string;
  value: string;
  rightBracket: string;
  logicalOperator: 'AND' | 'OR';
}

interface CreateSECPageProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  breadcrumbs: any[];
  onBreadcrumbNavigate: (path: string) => void;
  customEvents: any[];
  initialData?: any;
}

export function CreateSECPage({ 
  onCancel, 
  onSubmit, 
  breadcrumbs, 
  onBreadcrumbNavigate,
  customEvents,
  initialData
}: CreateSECPageProps) {
  const isEdit = !!initialData;
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    customEvent: initialData?.customEvent || "",
    status: initialData?.status || "Active",
    selectedFields: initialData?.selectedFields || [] as string[],
    piiMapping: initialData?.piiMapping || {} as Record<string, string>,
    conditionExpression: initialData?.conditionExpression || "",
    conditions: initialData?.conditions || [] as ConditionRow[],
    id: initialData?.id || undefined
  });

  const steps = [
    { id: 1, label: "Basic Information" },
    { id: 2, label: "Field Selection" },
    { id: 3, label: "Condition Builder" }
  ];

  const handleNext = () => {
    if (currentStep === 1 && !formData.name) {
      toast.error("Please enter an SEC Name");
      return;
    }
    if (currentStep === 1 && !formData.customEvent) {
      toast.error("Please select a Custom Event");
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePreSubmit = () => {
    if (!formData.conditionExpression) {
      toast.error("Please define at least one condition");
      return;
    }
    setShowSuccessModal(true);
  };

  const handleSaveDraft = () => {
    setShowDraftModal(true);
  };

  const handleConfirmDraft = () => {
    setShowDraftModal(false);
    onSubmit({
      ...formData,
      status: "Draft",
      artifactType: "sec"
    });
  };

  const handleConfirmSubmit = () => {
    setShowSuccessModal(false);
    onSubmit({
      ...formData,
      status: "Pending Approval", // Force status to move away from Draft
      artifactType: "sec"
    });
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

  const MOCK_FIELDS = [
    { id: "f1", fieldName: "transaction_amount", dataType: "Number", description: "Transaction amount" },
    { id: "f2", fieldName: "transaction_type", dataType: "String", description: "Type of transaction" },
    { id: "f3", fieldName: "transaction_date", dataType: "Date", description: "Transaction date" },
    { id: "f4", fieldName: "account_balance", dataType: "Number", description: "Current account balance" },
    { id: "f5", fieldName: "source_country", dataType: "String", description: "Source country code" },
    { id: "f6", fieldName: "destination_country", dataType: "String", description: "Destination country code" },
    { id: "f7", fieldName: "currency_code", dataType: "String", description: "Currency code" },
    { id: "f8", fieldName: "is_international", dataType: "Boolean", description: "International transaction flag" }
  ];

  const selectedEventObj = useMemo(() => {
    // Search in customEvents first
    let event = customEvents.find(e => e.eventName === formData.customEvent);
    
    // If not found (could be an OOTB event or external), use a default fallback with fields
    if (!event) {
      event = { eventName: formData.customEvent, fields: MOCK_FIELDS };
    } else if (!event.fields || event.fields.length === 0) {
      event = { ...event, fields: MOCK_FIELDS };
    }
    
    return event;
  }, [formData.customEvent, customEvents, MOCK_FIELDS]);

  const PII_LEVELS = [
    { value: "None", label: "Non-PII", color: "bg-gray-100 text-gray-500" },
    { value: "PII", label: "PII", color: "bg-blue-100 text-blue-700" },
    { value: "Sensitive", label: "Sensitive", color: "bg-red-100 text-red-700" },
  ];

  const toggleField = (fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(fieldName)
        ? prev.selectedFields.filter(f => f !== fieldName)
        : [...prev.selectedFields, fieldName]
    }));
  };

  const addCondition = () => {
    const newCondition: ConditionRow = {
      id: Math.random().toString(36).substr(2, 9),
      leftBracket: "none",
      field: "",
      operator: "",
      value: "",
      rightBracket: "none",
      logicalOperator: "AND"
    };
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
  };

  const updateCondition = (id: string, updates: Partial<ConditionRow>) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const deleteCondition = (id: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== id)
    }));
  };

  const copyCondition = (id: string) => {
    const conditionToCopy = formData.conditions.find(c => c.id === id);
    if (conditionToCopy) {
      const newCondition = { ...conditionToCopy, id: Math.random().toString(36).substr(2, 9) };
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition]
      }));
    }
  };

  const generatedExpression = useMemo(() => {
    return formData.conditions
      .map((c, index) => {
        const prefix = index > 0 ? ` ${c.logicalOperator} ` : "";
        const lb = c.leftBracket === "none" ? "" : c.leftBracket;
        const rb = c.rightBracket === "none" ? "" : c.rightBracket;
        const row = `${lb} ${c.field} ${c.operator} ${c.value} ${rb}`.trim();
        return prefix + row;
      })
      .join("") || "[Field] [Operator] [Value]";
  }, [formData.conditions]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, conditionExpression: generatedExpression }));
  }, [generatedExpression]);

  const isStep1Valid = formData.name.trim() !== "" && formData.customEvent !== "";
  const isStep2Valid = formData.selectedFields.length > 0;
  const isStep3Valid = formData.conditions.length > 0 && formData.conditions.every(c => c.field && c.operator);

  const renderSummary = () => (
    <div className="bg-[#f8f9fb] rounded-[12px] p-8 min-h-[520px] border border-gray-200 sticky top-0 flex flex-col h-full">
      <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <CircleDash size={16} /> SEC Summary
      </h4>
      <div className="space-y-6 flex-1">
        <div className="space-y-1">
          <span className="text-[12px] text-gray-500 font-medium uppercase tracking-tight">SEC Name</span>
          <p className="text-[14px] text-[#161616] font-bold truncate">{formData.name || "Untitled SEC"}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[12px] text-gray-500 font-medium uppercase tracking-tight">Custom Event</span>
          <p className="text-[14px] text-[#2A53A0] font-mono font-bold truncate">{formData.customEvent || "None Selected"}</p>
        </div>
        <div className="h-[1px] bg-gray-200 my-2" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[12px] text-gray-500 font-medium uppercase tracking-tight">Fields</span>
            <p className="text-[18px] text-[#161616] font-black">{formData.selectedFields.length}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[12px] text-gray-500 font-medium uppercase tracking-tight">Conditions</span>
            <p className="text-[18px] text-[#161616] font-black">{formData.conditionExpression ? 1 : 0}</p>
          </div>
        </div>
        <div className="h-[1px] bg-gray-200 my-2" />
        <div className="flex justify-between items-center">
          <span className="text-[12px] text-gray-500 font-medium uppercase tracking-tight">Status</span>
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
            formData.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
          )}>
            {formData.status}
          </span>
        </div>

        {formData.selectedFields.length > 0 && (
          <div className="pt-4 space-y-2">
            <span className="text-[12px] text-gray-500 font-medium uppercase tracking-tight">Selected Fields</span>
            <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
              {formData.selectedFields.map(field => (
                <span key={field} className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] text-[#161616] font-medium">
                  {field}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="flex flex-col gap-8 w-full">
      <div className="space-y-1">
        <h3 className="text-[18px] font-bold text-[#161616]">{isEdit ? "Edit Basic Information" : "Basic Information"}</h3>
        <p className="text-[14px] text-gray-500">{isEdit ? "Modify the semantic events collection details" : "Define a new Semantic Events Collection with basic information, field selection, and conditions"}</p>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <Label className="text-[14px] font-semibold text-[#161616]">
            SEC Name <span className="text-red-500">*</span>
          </Label>
          <Input 
            placeholder="e.g., High Value Transaction Check"
            className="!h-[46px] border-gray-300 rounded-[8px] focus:ring-[#2A53A0] bg-white"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[14px] font-semibold text-[#161616]">Description</Label>
          <textarea 
            placeholder="Describe the purpose of this SEC..."
            className="w-full min-h-[120px] p-4 border border-gray-300 rounded-[8px] text-[14px] outline-none focus:border-[#2A53A0] bg-white resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Label className="text-[14px] font-semibold text-[#161616]">
              Custom Event <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.customEvent} 
              onValueChange={(val) => setFormData({...formData, customEvent: val, selectedFields: []})}
            >
              <SelectTrigger className="!h-[46px] border-gray-300 rounded-[8px] focus:ring-[#2A53A0] bg-white flex items-center">
                <SelectValue placeholder="Select a Custom Event..." />
              </SelectTrigger>
              <SelectContent>
                {customEvents.map(e => (
                  <SelectItem key={e.id} value={e.eventName}>{e.eventName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-[14px] font-semibold text-[#161616]">Initial Status</Label>
            <div className="flex items-center gap-6 h-[46px]">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  formData.status === "Active" ? "border-[#2A53A0]" : "border-gray-300 group-hover:border-[#2A53A0]"
                )}>
                  {formData.status === "Active" && <div className="w-2.5 h-2.5 rounded-full bg-[#2A53A0]" />}
                </div>
                <input 
                  type="radio" 
                  className="hidden" 
                  name="status" 
                  checked={formData.status === "Active"} 
                  onChange={() => setFormData({...formData, status: "Active"})}
                />
                <span className="text-[14px] text-[#161616]">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  formData.status === "Inactive" ? "border-[#2A53A0]" : "border-gray-300 group-hover:border-[#2A53A0]"
                )}>
                  {formData.status === "Inactive" && <div className="w-2.5 h-2.5 rounded-full bg-[#2A53A0]" />}
                </div>
                <input 
                  type="radio" 
                  className="hidden" 
                  name="status" 
                  checked={formData.status === "Inactive"} 
                  onChange={() => setFormData({...formData, status: "Inactive"})}
                />
                <span className="text-[14px] text-[#161616]">Inactive</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFieldSelection = () => {
    if (!formData.customEvent) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-gray-200 rounded-[12px] bg-white text-center p-8 w-full">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Information size={32} className="text-[#2A53A0]" />
          </div>
          <h3 className="text-[18px] font-bold text-[#161616] mb-2">Select a Custom Event First</h3>
          <p className="text-[14px] text-gray-500">Choose a Custom Event in Step 1 to view and select available fields.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-[#161616]">Field Selection</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-[32px] px-4 text-[13px] font-normal rounded-md border-0 bg-blue-50 text-[#2A53A0] hover:bg-blue-100"
              onClick={() => setFormData({...formData, selectedFields: selectedEventObj?.fields.map((f: any) => f.fieldName) || []})}
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-[32px] px-4 text-[13px] font-normal rounded-md border-0 bg-gray-50 text-[#161616] hover:bg-gray-100"
              onClick={() => setFormData({...formData, selectedFields: []})}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="bg-[#e9f3ff] p-4 rounded-lg flex flex-col gap-1">
          <p className="text-[15px] font-bold text-[#2A53A0]">
            {formData.selectedFields.length} of {selectedEventObj?.fields?.length || 0} fields selected
          </p>
          <p className="text-[13px] text-[#2A53A0]/80">
            Selected fields will be available in the Condition Builder
          </p>
        </div>

        <div className="space-y-3">
          {(selectedEventObj?.fields || []).map((field: any) => (
            <div 
              key={field.id}
              onClick={() => toggleField(field.fieldName)}
              className={cn(
                "p-5 border rounded-xl transition-all cursor-pointer group flex items-center justify-between",
                formData.selectedFields.includes(field.fieldName)
                  ? "bg-white border-[#2A53A0] ring-1 ring-[#2A53A0]/20"
                  : "bg-white border-gray-100 hover:border-gray-200"
              )}
            >
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-bold text-[#161616] tracking-tight">{field.fieldName}</span>
                  <Badge className="bg-gray-100 text-gray-500 text-[11px] px-2 py-0 h-5 font-medium border-0 rounded">
                    {field.dataType}
                  </Badge>
                </div>
                <span className="text-[13px] text-gray-400 font-normal">{field.description}</span>
                
                {formData.selectedFields.includes(field.fieldName) && (
                  <div 
                    className="mt-3 flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100 w-fit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">PII CLASSIFICATION:</span>
                    <div className="flex items-center gap-1.5">
                      {PII_LEVELS.map(level => (
                        <button
                          key={level.value}
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            piiMapping: { ...prev.piiMapping, [field.fieldName]: level.value } 
                          }))}
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold uppercase transition-all border",
                            formData.piiMapping[field.fieldName] === level.value || (!formData.piiMapping[field.fieldName] && level.value === "None")
                              ? (level.value === "None" ? "bg-gray-200 border-gray-300 text-gray-700" : level.value === "PII" ? "bg-blue-100 border-blue-200 text-blue-700" : "bg-red-100 border-red-200 text-red-700")
                              : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                          )}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className={cn(
                "w-6 h-6 rounded border flex items-center justify-center transition-all shrink-0",
                formData.selectedFields.includes(field.fieldName)
                  ? "bg-[#2A53A0] border-[#2A53A0]"
                  : "bg-white border-gray-300 group-hover:border-gray-400"
              )}>
                {formData.selectedFields.includes(field.fieldName) && <Checkmark size={18} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderConditionBuilder = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-[18px] font-bold text-[#161616]">Condition Builder</h3>
          <p className="text-[14px] text-gray-500 font-normal">Build complex conditional expressions using the Row Builder pattern</p>
        </div>
        {formData.conditions.length > 0 && (
          <Button 
            onClick={addCondition}
            className="h-[36px] bg-[#2A53A0] hover:bg-[#1E3C75] text-white rounded-[6px] text-[13px] font-semibold flex items-center gap-2"
          >
            <Plus size={16} /> Add Condition
          </Button>
        )}
      </div>

      {formData.conditions.length === 0 ? (
        <div className="w-full py-16 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-100 rounded-[12px] text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
            <Plus size={32} className="text-gray-300" />
          </div>
          <div className="space-y-2">
            <h4 className="text-[18px] font-bold text-[#161616]">No conditions added yet</h4>
            <p className="text-[14px] text-gray-500 font-normal">Click "Add Condition" to start building your expression</p>
          </div>
          <Button 
            onClick={addCondition}
            className="h-[46px] px-8 bg-[#2A53A0] hover:bg-[#1E3C75] text-white rounded-[8px] font-bold text-[14px]"
          >
            Add First Condition
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {formData.conditions.map((condition, index) => (
              <div key={condition.id} className="space-y-4">
                {index > 0 && (
                  <div className="flex justify-center">
                    <div className="relative w-full flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                      </div>
                      <div className="relative">
                        <Select 
                          value={condition.logicalOperator} 
                          onValueChange={(val: 'AND' | 'OR') => updateCondition(condition.id, { logicalOperator: val })}
                        >
                          <SelectTrigger className="h-[32px] w-[80px] bg-white border-gray-200 rounded-md text-[11px] font-bold uppercase tracking-wider">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-white border border-gray-100 rounded-[12px] overflow-hidden group hover:border-[#2A53A0]/30 transition-all">
                  <div className="px-6 py-3 bg-[#f8f9fb] border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-[#2A53A0] flex items-center justify-center text-[12px] font-bold">
                        {index + 1}
                      </div>
                      <span className="text-[14px] font-bold text-[#161616]">Condition Row {index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button className="w-[28px] h-[28px] flex items-center justify-center hover:bg-gray-200 rounded-md text-gray-500 transition-colors">
                        <ChevronUp size={16} />
                      </button>
                      <button className="w-[28px] h-[28px] flex items-center justify-center hover:bg-gray-200 rounded-md text-gray-500 transition-colors">
                        <ChevronDown size={16} />
                      </button>
                      <button 
                        onClick={() => copyCondition(condition.id)}
                        className="w-[28px] h-[28px] flex items-center justify-center hover:bg-gray-200 rounded-md text-gray-500 transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={() => deleteCondition(condition.id)}
                        className="w-[28px] h-[28px] flex items-center justify-center hover:bg-red-50 rounded-md text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 flex items-end gap-4">
                    <div className="space-y-1.5 w-[60px]">
                      <Label className="text-[11px] text-gray-400 font-bold uppercase font-mono">(</Label>
                      <Select 
                        value={condition.leftBracket} 
                        onValueChange={(val) => updateCondition(condition.id, { leftBracket: val })}
                      >
                        <SelectTrigger className="h-[46px] border-gray-200 rounded-lg text-[14px] font-mono">
                          <SelectValue placeholder="." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="(">(</SelectItem>
                          <SelectItem value="((">( (</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                      <Label className="text-[11px] text-[#161616] font-bold uppercase">Field <span className="text-red-500">*</span></Label>
                      <Select 
                        value={condition.field} 
                        onValueChange={(val) => updateCondition(condition.id, { field: val })}
                      >
                        <SelectTrigger className="h-[46px] border-gray-200 rounded-lg text-[14px]">
                          <SelectValue placeholder="Select field..." />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.selectedFields.map(field => (
                            <SelectItem key={field} value={field}>{field}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 w-[140px]">
                      <Label className="text-[11px] text-[#161616] font-bold uppercase">Operator <span className="text-red-500">*</span></Label>
                      <Select 
                        value={condition.operator} 
                        onValueChange={(val) => updateCondition(condition.id, { operator: val })}
                      >
                        <SelectTrigger className="h-[46px] border-gray-200 rounded-lg text-[14px]">
                          <SelectValue placeholder="Select.." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="=">Equals (=)</SelectItem>
                          <SelectItem value="!=">Not Equals (!=)</SelectItem>
                          <SelectItem value=">">Greater Than (&gt;)</SelectItem>
                          <SelectItem value="<">Less Than (&lt;)</SelectItem>
                          <SelectItem value="CONTAINS">Contains</SelectItem>
                          <SelectItem value="IN">In List</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-[150px]">
                      <Label className="text-[11px] text-[#161616] font-bold uppercase">Value</Label>
                      <Input 
                        placeholder="Enter value..."
                        className="h-[46px] border-gray-200 rounded-lg"
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5 w-[60px]">
                      <Label className="text-[11px] text-gray-400 font-bold uppercase font-mono">)</Label>
                      <Select 
                        value={condition.rightBracket} 
                        onValueChange={(val) => updateCondition(condition.id, { rightBracket: val })}
                      >
                        <SelectTrigger className="h-[46px] border-gray-200 rounded-lg text-[14px] font-mono">
                          <SelectValue placeholder="." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value=")">)</SelectItem>
                          <SelectItem value="))">) )</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#defbe6] px-6 py-4 rounded-lg border border-[#c8f7d4] flex items-center gap-3">
            <CheckCircle2 size={20} className="text-[#198038]" />
            <span className="text-[15px] font-bold text-[#198038]">Brackets are balanced</span>
          </div>

          <div className="bg-white border border-gray-100 rounded-[12px] p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-black text-gray-400 uppercase tracking-[2px]">Expression Preview</span>
              <Badge className="bg-blue-50 text-[#2A53A0] text-[10px] font-bold rounded-md border-0 h-6 px-3 flex items-center">Real-time</Badge>
            </div>
            <div className="bg-[#f8f9fb] p-6 rounded-lg border border-gray-100">
              <p className="font-mono text-[16px] text-[#161616] leading-relaxed break-all">
                {generatedExpression}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden relative font-['Inter']">
      <PageHeader 
        title={isEdit ? "Edit Custom SEC" : "Create Custom SEC"}
        breadcrumbs={breadcrumbs}
        onBack={onCancel}
        onBreadcrumbNavigate={onBreadcrumbNavigate}
      />

      {renderStepIndicator()}

      <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 w-full h-full">
          <div className="w-full flex flex-col items-center p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-[1600px]">
              <div className="lg:col-span-2">
                {currentStep === 1 && renderBasicInfo()}
                {currentStep === 2 && renderFieldSelection()}
                {currentStep === 3 && renderConditionBuilder()}
              </div>
              <div className="lg:col-span-1">
                {renderSummary()}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="flex-none bg-[#f4f4f4] border-t border-gray-200 h-[80px] flex items-center px-12 z-50">
        <div className="flex-1 flex items-center gap-3">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="h-[48px] px-8 bg-white border-gray-300 text-[#161616] hover:bg-gray-100 rounded-[8px] font-normal text-[14px] flex items-center gap-2"
            >
              <ChevronLeft size={18} /> Back
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="h-[48px] px-8 bg-white border-gray-300 text-[#161616] hover:bg-gray-100 rounded-[8px] font-normal text-[14px]"
          >
            Cancel
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            disabled={!isStep1Valid}
            onClick={handleSaveDraft}
            className="h-[48px] px-8 bg-white border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 disabled:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed rounded-[8px] font-normal text-[14px] flex items-center gap-2"
          >
            <CircleDash size={18} /> Save as Draft
          </Button>
          {currentStep < 3 ? (
            <Button 
              onClick={handleNext}
              disabled={currentStep === 1 ? !isStep1Valid : currentStep === 2 ? !isStep2Valid : false}
              className="h-[48px] px-10 bg-[#2A53A0] hover:bg-[#1E3C75] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-[8px] font-normal transition-all active:scale-95 flex items-center gap-2"
            >
              Next Step <ArrowRight size={18} />
            </Button>
          ) : (
            <Button 
              onClick={handlePreSubmit}
              disabled={!isStep3Valid}
              className="h-[48px] px-10 bg-[#2A53A0] hover:bg-[#1E3C75] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-[8px] font-normal transition-all active:scale-95 flex items-center gap-2"
            >
              <Launch size={18} /> {isEdit ? "Update and Submit" : "Submit for Approval"}
            </Button>
          )}
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
                  Your Custom SEC <strong>"{formData.name}"</strong> has been {isEdit ? "updated" : "created"} and sent for Approval.
                </p>
              </div>
              <div className="pt-2 w-full">
                <Button 
                   className="w-full h-[48px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
                  onClick={handleConfirmSubmit}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Draft Success Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[400px] overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-[#F1FBFA] rounded-full flex items-center justify-center text-[#005D5D]">
                <Checkmark size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-[20px] font-bold text-[#161616]">Draft Saved</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  The Custom SEC <strong>"{formData.name}"</strong> has been saved as a draft. You can complete it later from the My Work module.
                </p>
              </div>
              <div className="pt-2 w-full flex flex-col gap-3">
                <Button 
                  className="w-full h-[48px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
                  onClick={handleConfirmDraft}
                >
                  Go to My Work
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-[48px] border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 font-bold rounded-[8px] text-[14px]"
                  onClick={() => setShowDraftModal(false)}
                >
                  Continue Editing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
