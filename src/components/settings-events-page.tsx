import React, { useState, useMemo } from "react";
import { 
  Search, 
  ChevronDown,
} from "@carbon/icons-react";
import { toast } from "sonner@2.0.3";
import { cn } from "./ui/utils";
import { Switch } from "./ui/switch";
import { useSortableData } from "../hooks/use-sortable-data";
import { SortableHeader } from "./ui/sortable-header";
import { CarbonPaginationFooter } from "./carbon-pagination-footer";
import PageHeader from "./page-header";
import { LinkedSecDialog } from "./linked-sec-dialog";

interface SettingsEventItem {
  id: string;
  eventName: string;
  description: string;
  type: string;
  status: "Active" | "Inactive";
  linkedSec: number;
}

const SETTINGS_EVENTS_DATA: SettingsEventItem[] = [
  { id: "1", eventName: "Account Opening", description: "Standard account creation workflow", type: "Financial", status: "Active", linkedSec: 4 },
  { id: "2", eventName: "ACH Payment", description: "Batch payment processing", type: "Financial", status: "Active", linkedSec: 3 },
  { id: "3", eventName: "ATM Withdrawal", description: "Cash out events", type: "Financial", status: "Active", linkedSec: 4 },
  { id: "4", eventName: "Profile Update", description: "Customer detail changes", type: "Non-Financial", status: "Active", linkedSec: 2 },
  { id: "5", eventName: "Password Reset", description: "Security credential updates", type: "Non-Financial", status: "Active", linkedSec: 3 },
  { id: "6", eventName: "Wire Transfer", description: "Real-time fund movement", type: "Financial", status: "Active", linkedSec: 5 },
  { id: "7", eventName: "Login Attempt", description: "User authentication events", type: "Non-Financial", status: "Active", linkedSec: 4 },
  { id: "8", eventName: "Address Change", description: "Physical location updates", type: "Non-Financial", status: "Active", linkedSec: 0 },
];

export function SettingsEventsPage({ 
  breadcrumbs, 
  onBreadcrumbNavigate 
}: { 
  breadcrumbs: any[], 
  onBreadcrumbNavigate: (path: string) => void 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<SettingsEventItem[]>(SETTINGS_EVENTS_DATA);
  const [selectedEventForSec, setSelectedEventForSec] = useState<{id: string, name: string, count: number} | null>(null);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesType = typeFilter === "all" || item.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesSearch = item.eventName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [data, typeFilter, searchTerm]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const toggleStatus = (id: string) => {
    const item = data.find(i => i.id === id);
    if (!item) return;

    // Logic: Only allow deactivation if Linked Sec count is 0
    if (item.status === "Active" && item.linkedSec > 0) {
      toast.error(`Cannot deactivate "${item.eventName}"`, {
        description: `This event has ${item.linkedSec} linked security controls. Please remove them before deactivating.`
      });
      return;
    }

    setData(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } 
        : item
    ));
    
    toast.success(`Event status updated`, {
      description: `"${item.eventName}" is now ${item.status === "Active" ? "Inactive" : "Active"}.`
    });
  };

  return (
    <div className="w-full h-full bg-white flex flex-col p-0 overflow-hidden">
      <PageHeader 
        title="Settings - Events" 
        breadcrumbs={breadcrumbs} 
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
      />
      
      <div className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
        {/* Controls Section */}
        <div className="flex-none flex items-center justify-between bg-white h-[48px] px-0 gap-4">
          <div className="flex items-center gap-4 h-full">
            <div className="relative w-[300px] h-[46px] flex items-center self-center">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full h-full pl-12 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
              />
            </div>
            
            <div className="flex items-center h-[46px] self-center">
              <div className="relative h-full flex items-center">
                <select 
                  value={typeFilter}
                  onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-white border border-gray-300 rounded-[8px] h-full px-4 pr-10 text-[14px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[160px]"
                >
                  <option value="all">All Types</option>
                  <option value="financial">Financial</option>
                  <option value="non-financial">Non-Financial</option>
                </select>
                <div className="absolute right-3 pointer-events-none text-gray-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 border border-gray-200 rounded-sm overflow-hidden flex flex-col bg-white">
          <div className="flex-1 hover-scroll bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F0F0F0] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                  <th className="px-4 border-b border-[#e0e0e0] w-[20%] align-middle whitespace-nowrap">
                    <SortableHeader column="eventName" label="Event Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[30%] align-middle whitespace-nowrap">
                    <span className="text-[14px] font-semibold text-[#2A53A0]">Description</span>
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[15%] align-middle whitespace-nowrap">
                    <SortableHeader column="type" label="Type" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap text-center">
                    <SortableHeader column="linkedSec" label="Linked Sec" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold justify-center" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[15%] align-middle whitespace-nowrap text-center">
                    <span className="text-[14px] font-semibold text-[#2A53A0]">Status</span>
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[10%] align-middle whitespace-nowrap text-center">
                    <span className="text-[14px] font-semibold text-[#2A53A0]">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors">
                    <td className="px-4 align-middle">
                      <span className="text-[14px] text-[#161616] font-normal block truncate">{item.eventName}</span>
                    </td>
                    <td className="px-4 align-middle">
                      <span className="text-[14px] text-[#161616] font-normal block truncate">{item.description}</span>
                    </td>
                    <td className="px-4 align-middle">
                      <span className={cn(
                        "inline-flex items-center px-3 h-[28px] rounded-md text-[11px] font-medium whitespace-nowrap w-fit",
                        item.type === "Financial" ? "text-[#004144] bg-[#D9FBFB]" : "text-[#161616] bg-[#E0E0E0]"
                      )}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 align-middle text-center">
                      <span className="text-[14px] text-[#161616] underline cursor-pointer font-normal" onClick={() => setSelectedEventForSec({ id: item.id, name: item.eventName, count: item.linkedSec })}>
                        {item.linkedSec}
                      </span>
                    </td>
                    <td className="px-4 align-middle text-center">
                      <div className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full border-0 h-[28px] text-[11px] font-medium whitespace-nowrap min-w-[75px] justify-center mx-auto",
                        item.status === "Active" ? "bg-[#DEFBE6] text-[#198038]" : "bg-[#FFF1F1] text-[#DA1E28]"
                      )}>
                        {item.status}
                      </div>
                    </td>
                    <td className="px-4 align-middle text-center">
                      <div className="flex justify-center items-center">
                        <Switch 
                          checked={item.status === "Active"} 
                          onCheckedChange={() => toggleStatus(item.id)}
                          className="data-[state=checked]:bg-[#2A53A0]"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-none">
            <CarbonPaginationFooter 
              pageSize={pageSize} 
              setPageSize={setPageSize} 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
              totalItems={sortedData.length} 
            />
          </div>
        </div>
      </div>

      <LinkedSecDialog 
        isOpen={!!selectedEventForSec} 
        onClose={() => setSelectedEventForSec(null)} 
        eventId={selectedEventForSec?.id || ""} 
        eventName={selectedEventForSec?.name || ""} 
        linkedSecCount={selectedEventForSec?.count || 0} 
      />
    </div>
  );
}
