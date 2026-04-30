import React from "react";
import imgClari5Loader from "figma:asset/4695cc06ada82390ec617ae2b76764d7dd803fe5.png";

export const Clari5Loader = () => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#333333]/50">
    <div className="relative w-[211px] h-[100px]">
      <div className="absolute bg-white h-[100px] left-0 rounded-[8px] top-0 w-[211px] shadow-lg" />
      <div className="absolute [display:contents] left-[36px] top-[27px]">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-46.5px)] rounded-[8px] size-[46px] top-1/2 animate-spin">
          <img alt="Loading" className="absolute block max-w-none size-full" height="46" src={imgClari5Loader} width="46" />
        </div>
        <p className="-translate-x-1/2 absolute font-['Inter',sans-serif] font-normal leading-[1.8] left-[131.5px] not-italic text-[#333] text-[16px] text-center top-[36px] whitespace-nowrap">Loading....</p>
      </div>
    </div>
  </div>
);