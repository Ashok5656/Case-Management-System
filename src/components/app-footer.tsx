import { Copyright } from "lucide-react";
import Frame2 from "../imports/Frame237";

export default function AppFooter() {
  return (
    <div className="h-[42px] grid grid-cols-3 items-center px-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-500 dark:text-gray-400">
      {/* Left Side */}
      <div className="font-medium text-left">
        Your license will expire on June 12, 2026
      </div>

      {/* Center */}
      <div className="flex items-center justify-center gap-1.5">
        <Copyright className="size-3" />
        <span>Clari5 - A Perfios Software Company</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-end gap-3">
         <span>
           Important Links
         </span>
         <div className="h-7 flex items-center">
           <Frame2 />
         </div>
      </div>
    </div>
  );
}
