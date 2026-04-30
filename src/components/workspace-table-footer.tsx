import React from 'react';

interface WorkspaceTableFooterProps {
  count: number;
}

export function WorkspaceTableFooter({ count }: WorkspaceTableFooterProps) {
  // Use a fixed date or today's date based on the mock
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

  return (
    <div className="bg-[#f4f4f4] flex items-center justify-between h-[46px] px-6 relative select-none">
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-[#161616] text-[12px]">{count}</span>
        <span className="font-normal text-[#525252] text-[12px]">workspaces found</span>
      </div>
      <div className="text-[#99a1af] text-[12px] font-normal">
        Last updated: {formattedDate}
      </div>
    </div>
  );
}
