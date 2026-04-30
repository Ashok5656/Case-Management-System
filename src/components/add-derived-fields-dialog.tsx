import React, { useState, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription,
  DialogHeader
} from "./ui/dialog";
import { Search, Close, ChevronRight, ChevronDown, Calculator } from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { cn } from "./ui/utils";

interface DerivedField {
  id: string;
  fieldName: string;
  category: string;
  type: string;
  description: string;
}

const CATEGORIES_DATA = [
  {
    id: "cat1",
    name: "Customer Behavior - New Entity Detection",
    fields: [
      { id: "df1", fieldName: "is_device_new", category: "Customer Behavior - New Entity Detection", type: "Boolean", description: "TRUE if device has not been seen before for this customer" },
      { id: "df2", fieldName: "is_cpty_new", category: "Customer Behavior - New Entity Detection", type: "Boolean", description: "TRUE if counterparty is new for this customer" },
      { id: "df3", fieldName: "is_beneficiary_new", category: "Customer Behavior - New Entity Detection", type: "Boolean", description: "TRUE if beneficiary is new for this customer" },
      { id: "df4", fieldName: "is_ip_new", category: "Customer Behavior - New Entity Detection", type: "Boolean", description: "TRUE if IP address is new for customer" },
    ]
  },
  {
    id: "cat2",
    name: "Geographic - New Location Detection",
    fields: [
      { id: "df5", fieldName: "is_origination_country_new", category: "Geographic - New Location Detection", type: "Boolean", description: "TRUE if transaction origin country is new" },
      { id: "df6", fieldName: "is_cpty_country_new", category: "Geographic - New Location Detection", type: "Boolean", description: "TRUE if counterparty country is new" },
      { id: "df14", fieldName: "cross_border_velocity", category: "Geographic - New Location Detection", type: "Integer", description: "Number of cross-border transactions in last 24 hours" },
    ]
  },
  {
    id: "cat3",
    name: "Transaction Pattern - New Type Detection",
    fields: [
      { id: "df7", fieldName: "is_txn_type_new", category: "Transaction Pattern - New Type Detection", type: "Boolean", description: "TRUE if transaction type is new for customer" },
      { id: "df8", fieldName: "is_trantype_new", category: "Transaction Pattern - New Type Detection", type: "Boolean", description: "TRUE if transaction sub-type is new" },
    ]
  },
  {
    id: "cat4",
    name: "Amount Analysis",
    fields: [
      { id: "df10", fieldName: "amt_deviation_30d", category: "Amount Analysis", type: "Decimal", description: "Percentage deviation from 30-day average transaction amount" },
      { id: "df15", fieldName: "is_high_value_spike", category: "Amount Analysis", type: "Boolean", description: "TRUE if txn amount is >5x historical average" },
    ]
  },
  {
    id: "cat5",
    name: "Velocity Analysis",
    fields: [
      { id: "df9", fieldName: "velocity_txn_count_1h", category: "Velocity Analysis", type: "Integer", description: "Total number of transactions in the last 60 minutes" },
    ]
  },
  {
    id: "cat6",
    name: "Temporal Patterns",
    fields: [
      { id: "df16", fieldName: "time_to_first_txn", category: "Temporal Patterns", type: "Integer", description: "Time elapsed from onboarding to first transaction in minutes" },
      { id: "df20", fieldName: "avg_txn_interval_6m", category: "Temporal Patterns", type: "Decimal", description: "Mean time between successful transactions in last 6 months" }
    ]
  },
  {
    id: "cat7",
    name: "Security - Device Health",
    fields: [
      { id: "df19", fieldName: "is_jailbroken_device", category: "Security - Device Health", type: "Boolean", description: "TRUE if device shows signs of OS compromise" },
    ]
  }
];

export function AddDerivedFieldsDialog({ 
  open, 
  onOpenChange, 
  onAdd,
  existingFieldNames = []
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onAdd: (fields: DerivedField[]) => void;
  existingFieldNames?: string[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  // Default to first 3 expanded
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES_DATA.slice(0, 3).map(c => c.id))
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isFieldAlreadyAdded = (fieldName: string) => existingFieldNames.includes(fieldName);

  const filteredCategories = useMemo(() => {
    return CATEGORIES_DATA.map(cat => ({
      ...cat,
      fields: cat.fields.filter(field => {
        const matchesSearch = field.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              field.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
    })).filter(cat => cat.fields.length > 0);
  }, [searchTerm]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleField = (field: DerivedField) => {
    if (isFieldAlreadyAdded(field.fieldName)) return;
    
    const newSelected = new Set(selectedIds);
    if (newSelected.has(field.id)) {
      newSelected.delete(field.id);
    } else {
      newSelected.add(field.id);
    }
    setSelectedIds(newSelected);
  };

  const selectAllInCategory = (category: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const selectableFields = category.fields.filter((f: DerivedField) => !isFieldAlreadyAdded(f.fieldName));
    const selectableIds = selectableFields.map((f: DerivedField) => f.id);
    
    if (selectableIds.length === 0) return;

    const allSelectableSelected = selectableIds.every((id: string) => selectedIds.has(id));

    const newSelected = new Set(selectedIds);
    if (allSelectableSelected) {
      selectableIds.forEach((id: string) => newSelected.delete(id));
    } else {
      selectableIds.forEach((id: string) => newSelected.add(id));
    }
    setSelectedIds(newSelected);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedIds(new Set());
  };

  const handleAdd = () => {
    const allFields = CATEGORIES_DATA.flatMap(c => c.fields);
    const selectedFields = allFields.filter(f => selectedIds.has(f.id));
    onAdd(selectedFields);
    setSelectedIds(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:max-w-[1200px] h-[80vh] p-0 gap-0 border-0 rounded-lg overflow-hidden bg-white shadow-2xl flex flex-col z-[100] [&>button]:hidden">
        {/* Header - Fixed 64px with primary background */}
        <DialogHeader className="flex-none flex flex-row items-center justify-between px-6 h-[64px] border-b border-[#2A53A0]/20 bg-[#2A53A0] space-y-0">
          <div className="flex items-center">
             <div className="flex flex-col text-left">
                <DialogTitle className="text-[16px] font-semibold text-white">Add Derived Fields</DialogTitle>
                <DialogDescription className="sr-only">
                  Select from a list of system-computed derived fields to add to the event configuration.
                </DialogDescription>
             </div>
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="w-[28px] h-[28px] flex items-center justify-center hover:bg-white/10 rounded-sm transition-colors text-white/80 hover:text-white"
          >
            <Close size={20} />
          </button>
        </DialogHeader>

        {/* Search Bar & Selection Count parallel */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search derived fields..."
              className="pl-10 h-[46px] bg-white border-gray-300 rounded-[8px] text-[14px] focus:ring-[#2A53A0] focus:border-[#2A53A0]"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-[#EDF5FF] px-4 py-2 rounded-[8px] border border-[#D0E2FF]">
            <span className="text-[13px] font-semibold text-[#2A53A0] leading-none">{selectedIds.size}</span>
            <span className="text-[12px] text-[#2A53A0]/80 font-medium">Fields Selected</span>
          </div>
        </div>

        {/* Scrollable Content - Accordion Style consistent with Create Event Flow */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-white">
          {filteredCategories.map(category => {
            const isExpanded = expandedCategories.has(category.id);
            const selectableFields = category.fields.filter(f => !isFieldAlreadyAdded(f.fieldName));
            const selectedCount = category.fields.filter(f => selectedIds.has(f.id)).length;
            const isAllSelected = selectableFields.length > 0 && selectableFields.every(f => selectedIds.has(f.id));

            return (
              <div key={category.id} className={cn(
                "border rounded-[8px] bg-white overflow-hidden transition-all duration-200",
                isExpanded ? "border-[#2A53A0]/30 shadow-md" : "border-gray-200"
              )}>
                <div 
                  className={cn(
                    "h-[54px] px-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors",
                    isExpanded && "border-b border-gray-100 bg-[#F4F7FB]"
                  )}
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("transition-transform duration-200", isExpanded ? "text-[#2A53A0]" : "text-gray-400")}>
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    <span className={cn("text-[14px] font-semibold", isExpanded ? "text-[#2A53A0]" : "text-[#161616]")}>
                      {category.name} (Field count: {category.fields.length})
                    </span>
                    {selectedCount > 0 && (
                      <span className="bg-[#EDF5FF] text-[#2A53A0] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#D0E2FF]">
                        {selectedCount} selected
                      </span>
                    )}
                  </div>
                  {selectableFields.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        "h-[32px] rounded-[8px] text-[12px] px-3 font-medium transition-all",
                        isAllSelected ? "bg-[#2A53A0] text-white border-[#2A53A0]" : "border-gray-300 text-gray-600 hover:border-[#2A53A0] hover:text-[#2A53A0]"
                      )}
                      onClick={(e) => selectAllInCategory(category, e)}
                    >
                      {isAllSelected ? "Deselect All" : "Select All"}
                    </Button>
                  )}
                </div>

                {isExpanded && (
                  <div className="p-2 space-y-1 bg-white">
                    {category.fields.map(field => {
                      const isAdded = isFieldAlreadyAdded(field.fieldName);
                      const isSelected = selectedIds.has(field.id);
                      
                      return (
                        <div 
                          key={field.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-[8px] transition-colors border",
                            isAdded ? "opacity-50 cursor-not-allowed bg-gray-50 border-transparent" : 
                            isSelected ? "bg-[#EDF5FF]/50 border-[#D0E2FF] cursor-pointer" : 
                            "hover:bg-gray-50 border-transparent cursor-pointer"
                          )}
                          onClick={() => !isAdded && toggleField(field)}
                        >
                          <Checkbox 
                            checked={isSelected || isAdded}
                            disabled={isAdded}
                            onCheckedChange={() => !isAdded && toggleField(field)}
                            className={cn(
                              "rounded-[4px]",
                              isAdded ? "bg-gray-300 border-gray-300" : "data-[state=checked]:bg-[#2A53A0] data-[state=checked]:border-[#2A53A0]"
                            )}
                          />
                          <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-medium text-[#161616]">{field.fieldName}</span>
                              <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                                {field.type}
                              </span>
                              {isAdded && (
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-tight">Already Added</span>
                              )}
                            </div>
                            <span className="text-[12px] text-gray-500 leading-tight mt-0.5">{field.description}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Carbon Style Footer with Full Width Buttons - Consistent 3-col Grid */}
        <div className="flex-none grid grid-cols-3 h-[64px] bg-white border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="h-full rounded-none text-[#161616] bg-[#f4f4f4] hover:bg-[#e0e0e0] border-r border-gray-200 text-[14px] font-normal"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="ghost" 
            className="h-full rounded-none text-[#161616] bg-white hover:bg-[#f4f4f4] border-r border-gray-200 text-[14px] font-normal"
            onClick={handleReset}
          >
            Reset Selection
          </Button>
          <Button 
            className="h-full rounded-none bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-normal disabled:opacity-50 disabled:cursor-not-allowed border-0 text-[14px]"
            disabled={selectedIds.size === 0}
            onClick={handleAdd}
          >
            Add Derived Fields
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
