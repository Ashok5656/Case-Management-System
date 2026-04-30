import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";

interface SortableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  column: string;
  label: string;
  sortConfig?: { key: any; direction: 'asc' | 'desc' } | null;
  onSort: (key: any) => void;
  iconPosition?: "left" | "right";
}

export function SortableHeader({ 
  column, 
  label, 
  sortConfig, 
  onSort, 
  className, 
  iconPosition = "right",
  ...props 
}: SortableHeaderProps) {
  const isSorted = sortConfig?.key === column;
  const direction = isSorted ? sortConfig.direction : undefined;

  const Icon = direction === "desc" ? ArrowDown : direction === "asc" ? ArrowUp : ArrowUpDown;
  const iconClasses = cn("h-3.5 w-3.5 shrink-0", !direction && "opacity-50 text-[#8d8d8d]");

  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-1.5 font-medium text-[13px] text-[#2A53A0] cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-0 w-full h-full",
        iconPosition === "right" ? "justify-start" : "justify-end",
        className
      )}
      onClick={() => onSort(column)}
      {...props}
    >
      {iconPosition === "left" && <Icon className={iconClasses} />}
      <span className="whitespace-nowrap leading-none">{label}</span>
      {iconPosition === "right" && <Icon className={iconClasses} />}
    </button>
  );
}
