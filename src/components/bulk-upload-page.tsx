import React, { useState } from "react";
import { 
  Checkmark, 
  CheckmarkFilled,
  Upload,
  ChevronRight,
  Download,
  Document,
  Information,
  Warning,
  CheckmarkOutline,
  Close,
  Table
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import PageHeader from "./page-header";
import { toast } from "sonner@2.0.3";
import { Progress } from "./ui/progress";

interface BulkUploadPageProps {
  onBack: () => void;
  onBreadcrumbNavigate: (path: string) => void;
  breadcrumbs: any[];
}

export function BulkUploadPage({
  onBack,
  onBreadcrumbNavigate,
  breadcrumbs
}: BulkUploadPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{name: string, size: string} | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const steps = [
    { id: 1, label: "Upload" },
    { id: 2, label: "Map Fields" },
    { id: 3, label: "Validate" },
    { id: 4, label: "Complete" }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error("Please upload a CSV file");
        return;
      }
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB"
      });
      setIsUploading(true);
      
      // Simulate progress
      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        setUploadProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success("File uploaded successfully");
        }
      }, 100);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !uploadedFile) {
      toast.error("Please upload a file first");
      return;
    }
    if (currentStep === 3) {
      setShowSuccessModal(true);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBackStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalSuccess = () => {
    setShowSuccessModal(false);
    onBack();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center w-full py-5 border-b border-gray-100 bg-white sticky top-0 z-20">
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
    <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Template Download Section */}
      <div className="bg-[#EDF5FF] border border-[#D0E2FF] rounded-[12px] p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2A53A0] shadow-sm">
            <Document size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-[16px] font-bold text-[#2A53A0]">Need a template?</h3>
            <p className="text-[14px] text-blue-800">Download our standardized CSV template to ensure data compatibility.</p>
          </div>
        </div>
        <Button 
          variant="outline"
          className="h-[48px] bg-white border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 font-bold px-6 rounded-[8px]"
          onClick={() => toast.info("Template download started")}
        >
          <Download size={20} className="mr-2" /> Download Template
        </Button>
      </div>

      {/* Upload Zone */}
      <div 
        className={cn(
          "border-2 border-dashed rounded-[16px] p-16 flex flex-col items-center justify-center transition-all duration-300 relative bg-white",
          uploadedFile ? "border-green-300 bg-green-50/10" : "border-gray-200 hover:border-[#2A53A0] hover:bg-gray-50/50"
        )}
      >
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer" 
        />
        
        <div className="flex flex-col items-center text-center gap-6">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300",
            uploadedFile ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400 group-hover:bg-blue-50"
          )}>
            <Upload size={40} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-[20px] font-bold text-[#161616]">
              {uploadedFile ? "File selected" : "Click to upload or drag and drop"}
            </h3>
            <p className="text-[14px] text-gray-500 max-w-[400px]">
              {uploadedFile ? `Ready to map fields: ${uploadedFile.name}` : "Support for CSV files up to 10MB. Make sure your data matches the template structure."}
            </p>
          </div>

          {isUploading && (
            <div className="w-[300px] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-[12px] font-medium">
                <span className="text-gray-500">Uploading {uploadedFile?.name}...</span>
                <span className="text-[#2A53A0]">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2 bg-gray-100" />
            </div>
          )}

          {uploadedFile && !isUploading && (
            <div className="bg-white border border-green-200 rounded-[8px] p-4 flex items-center gap-4 shadow-sm animate-in zoom-in-95">
              <CheckmarkFilled size={24} className="text-green-500" />
              <div className="text-left">
                <p className="text-[14px] font-bold text-[#161616] truncate max-w-[200px]">{uploadedFile.name}</p>
                <p className="text-[12px] text-gray-400">{uploadedFile.size}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFile(null);
                }}
                className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors rounded-full"
              >
                <Close size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gray-50 border border-gray-100 rounded-[12px] p-5 flex gap-4">
        <Information size={20} className="text-[#2A53A0] mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-[14px] font-bold text-[#161616]">Processing Timeline</h4>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            Bulk uploads are processed asynchronously. Large files (5k+ records) may take up to 2 minutes to validate. You can monitor the progress in the notification center.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-[18px] font-bold text-[#161616]">Map Fields</h3>
          <p className="text-[14px] text-gray-500 italic">Match the columns from your CSV to the system entry fields.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-[12px] font-bold border border-green-100">
          <CheckmarkFilled size={16} /> 12 Fields Auto-Mapped
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[12px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F4F4F4] h-[52px]">
            <tr>
              <th className="px-6 text-[14px] font-bold text-[#2A53A0] uppercase tracking-wider">System Field</th>
              <th className="px-6 text-[14px] font-bold text-[#2A53A0] uppercase tracking-wider">Your CSV Column</th>
              <th className="px-6 text-[14px] font-bold text-[#2A53A0] uppercase tracking-wider">Data Preview</th>
              <th className="px-6 text-[14px] font-bold text-[#2A53A0] uppercase tracking-wider text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { field: "Entity ID", csv: "entity_id", preview: "WL-2024-001" },
              { field: "Entity Type", csv: "type", preview: "COUNTRY" },
              { field: "Entity Value", csv: "value", preview: "USA" },
              { field: "Reason", csv: "reason_text", preview: "Trusted jurisdiction..." },
              { field: "Valid From", csv: "valid_from", preview: "2024-01-01 09:00" },
              { field: "Expiry Date", csv: "expiry_date", preview: "2099-12-31 23:59" }
            ].map((row, idx) => (
              <tr key={idx} className="h-[60px] hover:bg-gray-50 transition-colors">
                <td className="px-6">
                  <span className="text-[14px] font-bold text-[#161616]">{row.field}</span>
                </td>
                <td className="px-6">
                  <div className="bg-gray-100 border border-gray-200 rounded-[6px] px-3 py-2 text-[13px] font-mono text-gray-600 flex items-center justify-between w-[200px]">
                    {row.csv}
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                </td>
                <td className="px-6 text-[13px] text-gray-500 italic">
                  {row.preview}
                </td>
                <td className="px-6 text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600">
                    <CheckmarkOutline size={18} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-4">
        <h3 className="text-[18px] font-bold text-[#161616]">Validation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-[12px] p-6 shadow-sm flex flex-col items-center gap-2">
            <span className="text-[32px] font-bold text-[#161616]">1,240</span>
            <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Total Records</span>
          </div>
          <div className="bg-white border border-green-200 rounded-[12px] p-6 shadow-sm flex flex-col items-center gap-2">
            <span className="text-[32px] font-bold text-green-600">1,238</span>
            <span className="text-[13px] font-bold text-green-700 uppercase tracking-wider">Valid Entries</span>
          </div>
          <div className="bg-white border border-red-200 rounded-[12px] p-6 shadow-sm flex flex-col items-center gap-2">
            <span className="text-[32px] font-bold text-red-600">2</span>
            <span className="text-[13px] font-bold text-red-700 uppercase tracking-wider">Errors Found</span>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-[12px] p-6 space-y-4">
        <div className="flex items-center gap-2 text-red-700 font-bold">
          <Warning size={20} />
          <span>Action Required: Validation Errors</span>
        </div>
        <div className="bg-white border border-red-100 rounded-[8px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-red-50/50 h-[40px]">
              <tr>
                <th className="px-4 text-[12px] font-bold text-red-800 uppercase">Row</th>
                <th className="px-4 text-[12px] font-bold text-red-800 uppercase">Field</th>
                <th className="px-4 text-[12px] font-bold text-red-800 uppercase">Error Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-50">
              <tr className="h-[46px] text-[13px]">
                <td className="px-4 font-bold text-gray-700">42</td>
                <td className="px-4 font-medium text-gray-900">Entity Value</td>
                <td className="px-4 text-red-600">Invalid BIN format (must be 6 or 8 digits)</td>
              </tr>
              <tr className="h-[46px] text-[13px]">
                <td className="px-4 font-bold text-gray-700">105</td>
                <td className="px-4 font-medium text-gray-900">Expiry Date</td>
                <td className="px-4 text-red-600">Date cannot be in the past</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-red-600">
          Only the 1,238 valid records will be imported. To fix these errors, update your CSV and re-upload, or proceed to import only the valid entries.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-white relative font-['Inter']">
      {/* Top Navigation */}
      <div className="flex-none">
        <PageHeader 
          title="Bulk Upload"
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />
      </div>

      {/* Step Indicator */}
      <div className="flex-none shadow-sm">
        {renderStepIndicator()}
      </div>

      {/* Main Content Area - Hidden scrollbars */}
      <div className="flex-1 overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-8">
        <div className="w-full max-w-full pb-10">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>

      {/* Fixed Footer Actions */}
      <div className="flex-none bg-white border-t border-[#E0E0E0] flex items-center h-[80px] px-8 z-50">
        <div className="w-full flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={currentStep === 1 ? onBack : handleBackStep}
            className="h-[48px] px-8 bg-white border-[#C6C6C6] text-[#161616] hover:bg-gray-100 rounded-[8px] font-medium text-[14px]"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>
          <div className="flex items-center gap-3">
            {currentStep < 3 && (
              <Button 
                variant="outline"
                className="h-[48px] px-8 bg-white border-[#C6C6C6] text-[#161616] hover:bg-gray-50 rounded-[8px] font-medium text-[14px]"
                onClick={() => toast.info("Draft configuration saved")}
              >
                Save Progress
              </Button>
            )}
            <Button 
              onClick={handleNext}
              className="h-[48px] px-10 bg-[#2A53A0] hover:bg-[#1E3C75] text-white rounded-[8px] font-bold transition-colors text-[14px] flex items-center gap-2"
            >
              {currentStep === 3 ? "Complete Import" : "Continue"} 
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[450px] overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-10 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-[#198038]">
                <CheckmarkFilled size={64} />
              </div>
              <div className="space-y-3">
                <h2 className="text-[24px] font-bold text-[#161616]">Import Complete!</h2>
                <div className="bg-gray-50 p-4 rounded-[8px] space-y-1">
                   <p className="text-[14px] text-gray-700">
                    <strong>1,238</strong> records successfully imported.
                  </p>
                  <p className="text-[12px] text-gray-500">
                    Submission ID: <span className="font-mono">IMP-7729-2024</span>
                  </p>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed px-4">
                  The entries have been added to the <strong>Pending Verification</strong> list. You can track their status in the "My Work" module.
                </p>
              </div>
              <div className="pt-2 w-full">
                <Button 
                  className="w-full h-[48px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
                  onClick={handleFinalSuccess}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
