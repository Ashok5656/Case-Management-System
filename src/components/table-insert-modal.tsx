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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { cn } from "./ui/utils";
import { Database } from "lucide-react";

interface TableInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const TABLE_OPTIONS = [
  { id: "alert_history", name: "ALERT_HISTORY - Historical alert records" },
  { id: "customer_activity", name: "CUSTOMER_ACTIVITY - Recent user actions" },
];

const FIELDS = [
  { name: "alert_id", type: "string", required: true },
  { name: "scenario_name", type: "string", required: true },
  { name: "customer_id", type: "string", required: true },
  { name: "risk_score", type: "number", required: true },
  { name: "alert_date", type: "date", required: true },
  { name: "description", type: "string", required: false },
];

export function TableInsertModal({ isOpen, onClose, onSave }: TableInsertModalProps) {
  const [selectedTableId, setSelectedTableId] = useState("");
  const [mappings, setMappings] = useState<Record<string, { source: string, value: string }>>(
    FIELDS.reduce((acc, field) => ({
      ...acc,
      [field.name]: { source: "Source...", value: "" }
    }), {})
  );
  const [existsStrategy, setExistsStrategy] = useState("skip");

  const handleMappingChange = (fieldName: string, field: 'source' | 'value', val: string) => {
    setMappings(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], [field]: val }
    }));
  };

  const handleSave = () => {
    if (!selectedTableId) return;
    onSave({
      tableId: selectedTableId,
      mappings,
      existsStrategy
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden border-none rounded-[12px] gap-0">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-[16px] font-bold text-[#161616]">Configure Table Insert</DialogTitle>
          <DialogDescription className="sr-only">
            Map scenario data to database table columns and define conflict resolution strategies.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Select Table */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#394960]">
              Select Table <span className="text-red-500">*</span>
            </label>
            <Select value={selectedTableId} onValueChange={setSelectedTableId}>
              <SelectTrigger className="h-[46px] px-4 border-gray-200 rounded-[8px] text-[13px] bg-white">
                <SelectValue placeholder="Search or select table..." />
              </SelectTrigger>
              <SelectContent>
                {TABLE_OPTIONS.map(table => (
                  <SelectItem key={table.id} value={table.id}>{table.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTableId ? (
            <>
              {/* Field Mapping */}
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-[#394960]">Field Mapping</label>
                <div className="border border-gray-100 rounded-[8px] overflow-hidden">
                  <div className="bg-[#F8F9FB] border-b border-gray-100 flex px-4 py-2.5">
                    <span className="flex-1 text-[11px] font-bold text-gray-400 uppercase">Field Name</span>
                    <span className="w-16 text-[11px] font-bold text-gray-400 uppercase">Type</span>
                    <span className="flex-1 text-[11px] font-bold text-gray-400 uppercase pl-4">Value</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {FIELDS.map((field) => (
                      <div key={field.name} className="flex items-center px-4 py-3 bg-white">
                        <div className="flex-1">
                          <span className="text-[13px] font-bold text-[#161616]">
                            {field.name}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </span>
                        </div>
                        <div className="w-16">
                          <span className="text-[11px] text-gray-400 font-mono">{field.type}</span>
                        </div>
                        <div className="flex-[1.5] flex gap-2 pl-4">
                          <Select 
                            value={mappings[field.name]?.source || "Source..."} 
                            onValueChange={(v) => handleMappingChange(field.name, 'source', v)}
                          >
                            <SelectTrigger className="h-[46px] px-2 border-gray-100 rounded-[8px] text-[11px] w-[110px] bg-white shadow-none">
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
                            value={mappings[field.name]?.value || ""}
                            onChange={(e) => handleMappingChange(field.name, 'value', e.target.value)}
                            className="h-[46px] px-2 border-gray-100 rounded-[8px] text-[11px] flex-1 bg-white shadow-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* If Record Exists */}
              <div className="space-y-3 pt-2">
                <label className="text-[13px] font-bold text-[#394960]">If Record Exists</label>
                <RadioGroup value={existsStrategy} onValueChange={setExistsStrategy} className="flex flex-row items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="skip" id="skip" className="text-[#2A53A0] border-gray-300" />
                    <Label htmlFor="skip" className="text-[13px] font-medium text-[#4B5E7D] cursor-pointer">Skip (default)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="update" id="update" className="text-[#2A53A0] border-gray-300" />
                    <Label htmlFor="update" className="text-[13px] font-medium text-[#4B5E7D] cursor-pointer">Update existing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="error" id="error" className="text-[#2A53A0] border-gray-300" />
                    <Label htmlFor="error" className="text-[13px] font-medium text-[#4B5E7D] cursor-pointer">Fail with error</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-gray-100 rounded-[12px] bg-gray-50/30">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
                <Database size={20} className="text-[#2A53A0]/30" />
              </div>
              <p className="text-[13px] font-medium text-gray-500 text-center">
                Please select a target database table from the list above to begin column mapping.
              </p>
            </div>
          )}
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
            disabled={!selectedTableId}
            className="h-[48px] px-8 bg-[#2A53A0] hover:bg-[#1E3D75] text-white font-bold rounded-[8px] shadow-sm transition-all disabled:bg-gray-200 disabled:text-gray-400"
          >
            Save Table Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
