import React, { useState } from "react";
import { 
  Upload, 
  Close, 
  Download, 
  Document, 
  Checkmark,
  CheckmarkFilled,
  Warning,
  Information,
  Table
} from "@carbon/icons-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";
import { cn } from "./ui/utils";

interface BulkFieldUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (fields: any[]) => void;
}

export function BulkFieldUploadDialog({ isOpen, onClose, onUpload }: BulkFieldUploadDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFileUpload = (file: File) => {
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error("Please upload a CSV file");
        return;
      }
      setUploadedFile(file);
      setIsUploading(true);
      
      // Simulate processing
      let p = 0;
      const interval = setInterval(() => {
        p += 20;
        setUploadProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Mock preview data for fields
          setPreviewData([
            { id: "f1", fieldName: "customer_id", dataType: "String", sourceMapping: "JSON.cust_id", isPii: true, piiType: "Customer ID", category: "Custom" },
            { id: "f2", fieldName: "txn_amount", dataType: "Double", sourceMapping: "JSON.amount", isPii: false, category: "Custom" },
            { id: "f3", fieldName: "merchant_name", dataType: "String", sourceMapping: "JSON.m_name", isPii: false, category: "Custom" },
            { id: "f4", fieldName: "card_last4", dataType: "String", sourceMapping: "JSON.card", isPii: true, piiType: "Card Number", category: "Custom" },
            { id: "f5", fieldName: "location_city", dataType: "String", sourceMapping: "JSON.city", isPii: false, category: "Custom" },
          ]);
          
          setCurrentStep(2);
          toast.success("File processed successfully");
        }
      }, 150);
    }
  };

  const handleComplete = () => {
    onUpload(previewData);
    onClose();
    // Reset
    setTimeout(() => {
      setCurrentStep(1);
      setUploadedFile(null);
      setPreviewData([]);
    }, 300);
  };

  const downloadTemplate = () => {
    toast.info("Downloading field definition template...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] p-0 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[100] [&>button]:hidden">
        <DialogHeader className="flex-none flex flex-row items-center justify-between px-[30px] h-[64px] border-b border-gray-100 bg-[#2A53A0] space-y-0">
           <div className="space-y-0.5">
             <DialogTitle className="text-[20px] font-normal text-white leading-tight">
               Upload Field Configuration
             </DialogTitle>
             <DialogDescription className="sr-only">
               Upload field definitions from a CSV file.
             </DialogDescription>
           </div>
           <button 
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-[4px] transition-colors text-white"
            >
              <Close size={20} />
            </button>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col bg-white overflow-y-auto max-h-[80vh]">
          {currentStep === 1 ? (
            <div className="px-[30px] py-6 space-y-6">
              <div className="flex justify-end">
                  <button 
                    onClick={downloadTemplate}
                    className="flex items-center gap-1.5 text-[12px] text-[#2A53A0] hover:underline font-semibold group transition-all"
                  >
                    <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> 
                    Download CSV Template
                  </button>
              </div>

              <div 
                className={cn(
                  "border-2 border-dashed rounded-[8px] p-10 flex flex-col items-center justify-center transition-all cursor-pointer group bg-white",
                  uploadedFile 
                    ? "border-[#2A53A0] bg-blue-50/30" 
                    : "border-gray-200 hover:border-[#2A53A0] hover:bg-blue-50/20"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    handleFileUpload(file);
                }}
                onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file);
                    };
                    input.click();
                }}
              >
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                  <Upload size={28} className={cn("transition-colors", uploadedFile ? "text-[#2A53A0]" : "text-gray-400 group-hover:text-[#2A53A0]")} />
                </div>
                
                {uploadedFile ? (
                  <div className="text-center">
                    <p className="text-[15px] font-semibold text-[#161616]">{uploadedFile.name}</p>
                    <p className="text-[12px] text-gray-500 mt-1">{(uploadedFile.size / 1024).toFixed(2)} KB • Processing...</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                        setPreviewData([]);
                        setCurrentStep(1);
                      }}
                      className="mt-3 text-[12px] text-red-500 hover:text-red-600 font-medium underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-[16px] font-medium text-[#161616]">Drag and drop CSV file here</p>
                    <p className="text-[14px] text-gray-500 mt-1">or click to browse from your computer</p>
                  </div>
                )}

                {isUploading && (
                  <div className="w-[260px] space-y-2 pt-4">
                    <div className="flex items-center justify-between text-[11px] font-medium">
                      <span className="text-gray-500 italic">Analyzing fields...</span>
                      <span className="text-[#2A53A0] font-bold">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1 bg-gray-100" />
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-[8px] p-5 space-y-4 shadow-sm">
                 <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    <Information size={14} />
                    FILE REQUIREMENTS
                 </div>
                 <div className="space-y-2">
                    <ul className="text-[13px] text-gray-600 space-y-1.5 list-disc ml-5 leading-relaxed">
                      <li>Column Headers: <span className="font-mono text-[#2A53A0] bg-blue-50 px-1 rounded">FieldName, DataType, SourceMapping</span></li>
                      <li>File format must be <span className="font-semibold text-[#161616]">.csv</span></li>
                      <li>Standard audit fields (tenant_id, etc.) will be automatically filtered</li>
                    </ul>
                 </div>
              </div>
            </div>
          ) : (
            <div className="px-[30px] py-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h3 className="text-[15px] font-bold text-[#161616]">
                      Preview Field Definitions
                    </h3>
                    <p className="text-[12px] text-gray-500">{previewData.length} new fields detected in "{uploadedFile?.name}"</p>
                </div>
                <button 
                  onClick={() => {
                      setCurrentStep(1);
                      setUploadedFile(null);
                      setPreviewData([]);
                  }}
                  className="text-[12px] text-[#2A53A0] hover:underline font-semibold bg-blue-50 px-3 py-1.5 rounded-sm transition-all"
                >
                  Change File
                </button>
              </div>

              <div className="border border-gray-200 rounded-[8px] overflow-hidden bg-white shadow-sm max-h-[350px] overflow-y-auto border-l-[3px] border-l-green-500">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f4f4f4] h-[44px] sticky top-0 z-10 border-b border-gray-200">
                    <tr>
                      <th className="px-6 text-[13px] font-semibold text-[#2A53A0]">Field Name</th>
                      <th className="px-6 text-[13px] font-semibold text-[#2A53A0]">Type</th>
                      <th className="px-6 text-[13px] font-semibold text-[#2A53A0]">PII</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewData.map((field, idx) => (
                      <tr key={idx} className="h-[48px] hover:bg-gray-50 transition-colors">
                        <td className="px-6 text-[13px] text-[#161616] font-medium">{field.fieldName}</td>
                        <td className="px-6 text-[13px] text-[#525252]">{field.dataType}</td>
                        <td className="px-6">
                          {field.isPii ? (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-sm border border-red-100 uppercase tracking-tight">
                              {field.piiType || "PII"}
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-[8px] p-5 flex gap-4 animate-in fade-in duration-500">
                <CheckmarkFilled size={20} className="text-green-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-[13px] font-bold text-green-800">Validation Successful</p>
                    <p className="text-[12px] text-green-700 leading-relaxed">
                      Schema analysis complete. All {previewData.length} fields are formatted correctly and ready for import.
                    </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-none flex items-stretch h-[64px] bg-[#f4f4f4] border-t border-gray-200 gap-0">
          <button 
            type="button"
            className="w-1/2 bg-[#F4F4F4] hover:bg-[#e8e8e8] text-[#2A53A0] text-[14px] font-medium transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="button"
            disabled={currentStep === 1}
            onClick={handleComplete}
            className="w-1/2 bg-[#2A53A0] hover:bg-[#1e3c75] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Checkmark size={18} /> Upload & Apply
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
