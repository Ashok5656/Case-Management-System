import React from "react";

export const SuccessDialog = ({ 
  onContinue, 
  title, 
  message 
}: { 
  onContinue: () => void; 
  title: string; 
  message: string;
}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#333333]/50 animate-in fade-in duration-300">
    <div className="bg-white w-[360px] rounded-[8px] overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-300">
      <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6 text-center">
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
        
        <h2 className="text-[#2A53A0] text-[20px] font-medium mb-2">{title}</h2>
        <div className="text-[#767676] text-[16px] leading-[1.6]">
          {message.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
      
      <button 
        onClick={onContinue}
        className="h-[64px] w-full bg-[#2A53A0] hover:bg-[#1e3c75] text-white text-[16px] font-normal transition-colors flex items-center justify-center shrink-0"
      >
        Continue
      </button>
    </div>
  </div>
);