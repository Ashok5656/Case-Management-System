import React from "react";
import { ChevronDown, CaretLeft, CaretRight } from "@carbon/icons-react";

interface CarbonPaginationFooterProps {
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalItems: number;
}

export function CarbonPaginationFooter({
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  totalItems
}: CarbonPaginationFooterProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="bg-white border-t border-[#e0e0e0] h-12 flex items-center justify-between text-base text-[#161616] select-none w-full font-sans">
      {/* Left Side: Items per page & Range */}
      <div className="flex items-center h-full">
        {/* Items per page */}
        <div className="flex items-center h-full border-r border-[#e0e0e0] px-4">
          <span className="mr-2 text-[#525252] font-normal hidden sm:block">Items per page:</span>
          <div className="relative inline-flex items-center cursor-pointer h-full">
            <select 
              value={pageSize}
              onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1); // Reset to page 1 on size change
              }}
              className="appearance-none bg-transparent font-medium pr-8 h-12 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2A53A0] border-b border-transparent hover:bg-[#e0e0e0] transition-colors"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <ChevronDown size={16} className="absolute right-2 pointer-events-none text-[#161616]" />
          </div>
        </div>

        {/* Range Text */}
        <div className="flex items-center h-full px-4">
          <span className="text-[#525252]">
            <span className="text-[#161616] font-medium">{startItem}–{endItem}</span> of <span className="text-[#161616] font-medium">{totalItems}</span> items
          </span>
        </div>
      </div>

      {/* Right Side: Navigation */}
      <div className="flex items-center h-full">
        {/* Page Select */}
        <div className="border-l border-[#e0e0e0] h-full flex items-center">
           <div className="relative h-full inline-flex items-center">
              <select 
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="appearance-none bg-transparent font-medium pl-4 pr-10 h-12 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2A53A0] border-b border-transparent hover:bg-[#e0e0e0] transition-colors"
              >
                {totalPages > 0 ? (
                    [...Array(totalPages)].map((_, i) => (
                       <option key={i+1} value={i+1}>{i+1}</option>
                    ))
                ) : (
                    <option value={1}>1</option>
                )}
              </select>
              <ChevronDown size={16} className="absolute right-3 pointer-events-none text-[#161616]" />
           </div>
           <span className="text-[#525252] pr-4 border-r border-[#e0e0e0] h-full flex items-center">of {Math.max(1, totalPages)} pages</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex h-full">
          <button 
            className="w-12 h-full flex items-center justify-center hover:bg-[#e0e0e0] disabled:opacity-25 disabled:hover:bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#2A53A0] inset-0 text-[#161616]"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            <CaretLeft size={20} />
          </button>
          <button 
            className="w-12 h-full flex items-center justify-center border-l border-[#e0e0e0] hover:bg-[#e0e0e0] disabled:opacity-25 disabled:hover:bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#2A53A0] text-[#161616]"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          >
            <CaretRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
