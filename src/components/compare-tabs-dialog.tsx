import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription,
  DialogHeader
} from "./ui/dialog";
import { 
  Close, 
  Compare, 
  Download,
  CheckmarkFilled,
  WarningFilled
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { cn } from "./ui/utils";

interface TabItem {
  id: string;
  name: string;
}

export function CompareTabsDialog({ 
  open, 
  onOpenChange, 
  tabs = [] 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  tabs: TabItem[];
}) {
  const [tabA, setTabA] = useState<string>(tabs[0]?.id || "");
  const [tabB, setTabB] = useState<string>(tabs[1]?.id || tabs[0]?.id || "");

  const tabAName = tabs.find(t => t.id === tabA)?.name || "Select Tab";
  const tabBName = tabs.find(t => t.id === tabB)?.name || "Select Tab";

  const areTabsSame = tabA === tabB;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[98vw] sm:max-w-[98vw] h-[90vh] p-0 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xl flex flex-col z-[150] [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="flex-none flex flex-row items-center justify-between px-4 h-[48px] border-b border-gray-100 bg-white space-y-0">
          <div className="flex items-center gap-2">
             <Compare size={20} className="text-[#2A53A0]" />
             <DialogTitle className="text-[16px] font-semibold text-[#161616]">Compare Tabs</DialogTitle>
             <DialogDescription className="sr-only">Compare configuration differences between two tabs.</DialogDescription>
          </div>
          <button 
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1.5 hover:bg-gray-100 rounded-sm transition-colors text-gray-500"
          >
            <Close size={20} />
          </button>
        </DialogHeader>

        {/* Tab Selectors Row */}
        <div className="flex-none h-[64px] bg-white border-b border-gray-100 flex items-center justify-center gap-4 px-4">
            <div className="w-[240px]">
                <Select value={tabA} onValueChange={setTabA}>
                    <SelectTrigger className="h-[38px] text-[13px] border-gray-300 bg-white">
                        <SelectValue placeholder="Select Tab" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        {tabs.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <span className="text-[12px] font-bold text-gray-400">VS</span>
            <div className="w-[240px]">
                <Select value={tabB} onValueChange={setTabB}>
                    <SelectTrigger className="h-[38px] text-[13px] border-gray-300 bg-white">
                        <SelectValue placeholder="Select Tab" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        {tabs.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Info Row */}
        <div className="flex-none h-[40px] bg-gray-50 border-b border-gray-200 flex items-center px-4">
            <span className="text-[11px] font-bold text-[#161616] tracking-wider uppercase">DIFFERENCES FOUND:</span>
            {areTabsSame ? (
                <div className="flex items-center gap-1 ml-2 text-[#198038]">
                    <CheckmarkFilled size={14} />
                    <span className="text-[12px] font-medium">No differences found</span>
                </div>
            ) : (
                <div className="flex items-center gap-1 ml-2 text-[#da1e28]">
                    <WarningFilled size={14} />
                    <span className="text-[12px] font-medium">No differences to display for current selection</span>
                </div>
            )}
        </div>

        {/* Comparison Content */}
        <div className="flex-1 flex overflow-hidden">
            {/* Left Panel */}
            <div className="flex-1 border-r border-gray-100 flex flex-col">
                <div className="h-[40px] bg-[#f4f4f4] border-b border-gray-200 flex items-center justify-center">
                    <span className="text-[12px] font-bold text-[#161616] uppercase tracking-wide">{tabAName}</span>
                </div>
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <span className="text-[13px] text-gray-400">No differences to display</span>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex flex-col">
                <div className="h-[40px] bg-[#f4f4f4] border-b border-gray-200 flex items-center justify-center">
                    <span className="text-[12px] font-bold text-[#161616] uppercase tracking-wide">{tabBName}</span>
                </div>
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <span className="text-[13px] text-gray-400">No differences to display</span>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="flex-none h-[64px] bg-white border-t border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-gray-400">Legend:</span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#198038]" />
                        <span className="text-[#525252]">Added</span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#da1e28]" />
                        <span className="text-[#525252]">Removed</span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#f1c21b]" />
                        <span className="text-[#525252]">Modified</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" className="h-[38px] px-4 gap-2 border-gray-300 text-[13px] font-medium rounded-sm">
                    <Download size={18} /> Export Comparison
                </Button>
                <Button 
                    onClick={() => onOpenChange(false)}
                    className="h-[38px] px-6 bg-[#2A53A0] hover:bg-[#1e3c75] text-white text-[13px] font-semibold rounded-sm border-0"
                >
                    Close
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
