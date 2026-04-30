import React from "react";
import svgPaths from "../imports/svg-j8yenkawvu";
import { X, Check } from "lucide-react";

interface ActionItem {
  title: string;
  description: string;
  tag: string;
}

interface ChangesSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  actionItems: ActionItem[];
  totalActions: number;
}

export function ChangesSummaryDialog({
  isOpen,
  onClose,
  onContinue,
  actionItems,
  totalActions
}: ChangesSummaryDialogProps) {
  if (!isOpen) return null;

  const getActionIcon = (tag: string) => {
    // Returns the blue edit icon for Modified/Added items
    return (
      <div className="relative shrink-0 size-[32px] bg-[#EFF6FF] rounded-full flex items-center justify-center">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <g>
            <path d="M1 13H15V14H1V13Z" fill="#155DFC" />
            <path d={svgPaths.p279f5270} fill="#155DFC" />
          </g>
        </svg>
      </div>
    );
  };

  const getTagLabel = (tag: string) => {
    return tag.toUpperCase();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-[200]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[510px] bg-white rounded-[4px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] z-[201] overflow-hidden">
        {/* Header */}
        <div className="h-[64px] bg-[#2A53A0] flex items-center justify-between px-[30px] border-b border-[#f3f4f6]">
          <h2 className="text-[20px] font-normal text-white leading-[30px]">
            Review and Submit Changes
          </h2>
          <button
            onClick={onClose}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-[4px] hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="pt-[24px] px-[30px] pb-[24px]">
          {/* Info Banner */}
          <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[8px] p-[18px] mb-[16px]">
            <div className="flex gap-[16px]">
              {/* Info Icon */}
              <div className="shrink-0 w-[24px] h-[24px] mt-[2px]">
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                  <path 
                    d="M1.125 0C0.902508 0 0.685008 0.06598 0.500008 0.1896C0.315008 0.31321 0.170808 0.48891 0.0856076 0.69448C0.000507571 0.90005 -0.0217926 1.12625 0.0216074 1.34448C0.0650074 1.56271 0.172208 1.76316 0.329508 1.9205C0.486808 2.07783 0.687308 2.18498 0.905508 2.22838C1.12381 2.27179 1.35001 2.24951 1.55551 2.16436C1.76111 2.07922 1.93681 1.93502 2.06041 1.75002C2.18401 1.56501 2.25001 1.3475 2.25001 1.125C2.25001 0.82663 2.13151 0.54048 1.92051 0.3295C1.70951 0.11853 1.42341 0 1.12501 0Z" 
                    fill="#2A53A0" 
                    transform="translate(10.875, 6)"
                  />
                  <path 
                    d="M3.75 6V0H0.75V1.5H2.25V6H0V7.5H6V6H3.75Z" 
                    fill="#2A53A0" 
                    transform="translate(9, 10.5)"
                  />
                  <path 
                    d={svgPaths.p1308c700} 
                    fill="#2A53A0" 
                    transform="translate(1.5, 1.5)"
                  />
                </svg>
              </div>

              {/* Info Text */}
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-[#2A53A0] leading-[21px] mb-[0px]">
                  Ready to promote changes?
                </h3>
                <p className="text-[13px] font-normal text-[rgba(42,83,160,0.8)] leading-[19.5px]">
                  Please review the <span className="font-bold underline decoration-solid">{totalActions}</span> {totalActions === 1 ? 'action' : 'actions'} below before submitting for verification.
                </p>
              </div>
            </div>
          </div>

          {/* Performed Actions Section */}
          <div className="mt-[16px]">
            <h4 className="text-[12px] font-bold text-[#99A1AF] tracking-[1.2px] uppercase leading-[18px] mb-[10px]">
              Performed Actions
            </h4>

            {/* Action Items */}
            <div className="border border-[#F3F4F6] rounded-[8px] overflow-hidden">
              {actionItems.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between px-[16px] h-[72px] border-b border-[#F3F4F6] last:border-b-0"
                >
                  <div className="flex items-center gap-[12px] flex-1">
                    {getActionIcon(item.tag)}
                    <div className="flex-1">
                      <h5 className="text-[14px] font-bold text-[#161616] leading-[21px]">
                        {item.title}
                      </h5>
                      <p className="text-[12px] font-normal text-[#6A7282] leading-[18px]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#F3F4F6] rounded-[4px] px-[10px] h-[23px] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#6A7282] tracking-[0.5px] uppercase leading-[15px]">
                      {getTagLabel(item.tag)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F4F4F4] h-[64px] flex items-start pt-px border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="flex-1 h-[63px] border-r border-[#E5E7EB] flex items-center justify-center text-[14px] font-medium text-[#2A53A0] hover:bg-white/50 transition-colors"
          >
            Continue Editing
          </button>
          <button
            onClick={onContinue}
            className="flex-1 h-[63px] bg-[#2A53A0] hover:bg-[#1e3c75] flex items-center justify-center text-[14px] font-medium text-white transition-colors gap-[8px]"
          >
            <span>Confirm and Submit</span>
            <Check size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
