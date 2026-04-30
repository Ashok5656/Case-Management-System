import React from "react";
import { ArrowLeft } from "lucide-react";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { cn } from "./ui/utils";

interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBack?: () => void;
  onBreadcrumbNavigate: (path: string) => void;
  className?: string;
}

export default function PageHeader({
  title,
  breadcrumbs,
  onBack,
  onBreadcrumbNavigate,
  className
}: PageHeaderProps) {
  return (
    <div className={cn(
      "flex items-center justify-between px-4 h-[48px] bg-white border-b border-gray-200 w-full shrink-0",
      className
    )}>
      {/* Left side: Page Heading & Back Button */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-[32px] h-[32px] hover:bg-[#f4f4f4] rounded-[8px] text-[#525252] transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
        )}
        <h2 className="text-[20px] font-medium text-[#161616] truncate">
          {title}
        </h2>
      </div>

      {/* Right side: Breadcrumbs */}
      <div className="flex items-center">
        <BreadcrumbNav items={breadcrumbs} onNavigate={onBreadcrumbNavigate} />
      </div>
    </div>
  );
}
