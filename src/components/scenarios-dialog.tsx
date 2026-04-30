import React, { useState } from "react";
import { 
  Search, 
  Launch,
  Close
} from "@carbon/icons-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { cn } from "./ui/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface Scenario {
  title: string;
  description: string;
}

interface ScenariosDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  variableName: string;
  count: number;
  scenarios: Scenario[];
}

export function ScenariosDialog({ 
  isOpen, 
  onOpenChange, 
  variableName, 
  count, 
  scenarios 
}: ScenariosDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScenarios = scenarios.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1400px] w-[95vw] p-0 gap-0 overflow-hidden bg-white border-none rounded-[12px] shadow-2xl">
        <VisuallyHidden.Root>
          <DialogTitle>Scenarios Using Variable {variableName}</DialogTitle>
          <DialogDescription>
            A list of {count} scenarios that currently utilize the {variableName} variable for detection logic.
          </DialogDescription>
        </VisuallyHidden.Root>

        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-[24px] font-bold text-[#161616]">Scenarios Using Variable</h2>
              <div className="flex items-center gap-2 text-[14px]">
                <span className="text-[#2A53A0] font-bold uppercase tracking-tight">{variableName}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">{count} scenarios</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search scenarios by name or description..."
              className="w-full h-[52px] pl-12 pr-4 bg-white border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2A53A0]/20 focus:border-[#2A53A0] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="px-8 pb-8 max-h-[60vh] overflow-y-auto hover-scroll">
          <div className="flex flex-col gap-3">
            {filteredScenarios.map((scenario, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-white border border-gray-100 rounded-[12px] flex justify-between items-start group hover:border-[#2A53A0]/30 hover:bg-blue-50/5 transition-all cursor-pointer"
              >
                <div className="space-y-1.5 flex-1 pr-8">
                  <h4 className="text-[16px] font-bold text-[#2A53A0] group-hover:underline">
                    {scenario.title}
                  </h4>
                  <p className="text-[14px] text-gray-500 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>
                <div className="text-gray-300 group-hover:text-[#2A53A0] transition-colors p-1">
                  <Launch size={20} />
                </div>
              </div>
            ))}

            {filteredScenarios.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[16px] bg-gray-50/30">
                <p className="text-[15px] text-gray-400 font-medium">No scenarios match your search query</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
