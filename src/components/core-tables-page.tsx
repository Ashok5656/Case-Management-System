import React, { useState, useMemo } from "react";
import { 
  Building, 
  User, 
  Store, 
  Terminal as TerminalIcon, 
  Wallet, 
  Purchase, 
  Information, 
  Download, 
  Upload, 
  Search, 
  View,
  Catalog
} from "@carbon/icons-react";
import PageHeader from "./page-header";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import { CarbonPaginationFooter } from "./carbon-pagination-footer";
import { useSortableData } from "../hooks/use-sortable-data";
import { SortableHeader } from "./ui/sortable-header";

// --- MOCK DATA ---

const CORE_TABLES_CONFIG = [
  { id: 'branch', label: 'Branch', count: '245 records', icon: Building },
  { id: 'customer', label: 'Customer', count: '12,458 records', icon: User },
  { id: 'merchant', label: 'Merchant', count: '3,876 records', icon: Store },
  { id: 'terminal', label: 'Terminal', count: '1,542 records', icon: TerminalIcon },
  { id: 'account', label: 'Account', count: '18,932 records', icon: Wallet },
  { id: 'card', label: 'Card', count: '24,567 records', icon: Purchase },
];

const BRANCH_DATA = [
  { id: "BR-001", name: "Main Branch", city: "New York", state: "NY", country: "USA", type: "Primary", status: "Active" },
  { id: "BR-002", name: "Downtown Branch", city: "Los Angeles", state: "CA", country: "USA", type: "Secondary", status: "Active" },
  { id: "BR-003", name: "North Branch", city: "Chicago", state: "IL", country: "USA", type: "Secondary", status: "Active" },
  { id: "BR-004", name: "South Branch", city: "Houston", state: "TX", country: "USA", type: "Tertiary", status: "Inactive" },
  { id: "BR-005", name: "East Branch", city: "Miami", state: "FL", country: "USA", type: "Secondary", status: "Active" },
  { id: "BR-006", name: "West Branch", city: "San Francisco", state: "CA", country: "USA", type: "Primary", status: "Active" },
  { id: "BR-007", name: "Central Branch", city: "Phoenix", state: "AZ", country: "USA", type: "Tertiary", status: "Active" },
  { id: "BR-008", name: "Lakeside Branch", city: "Detroit", state: "MI", country: "USA", type: "Secondary", status: "Inactive" },
];

const CUSTOMER_DATA = [
  { id: "CUST-8821", name: "John Doe", email: "john.doe@example.com", phone: "+1 555-0101", city: "New York", segment: "Premium", status: "Active" },
  { id: "CUST-8822", name: "Jane Smith", email: "jane.smith@example.com", phone: "+1 555-0102", city: "Los Angeles", segment: "Standard", status: "Active" },
  { id: "CUST-8823", name: "Michael Brown", email: "m.brown@example.com", phone: "+1 555-0103", city: "Chicago", segment: "Standard", status: "Inactive" },
  { id: "CUST-8824", name: "Emily Davis", email: "emily.d@example.com", phone: "+1 555-0104", city: "Houston", segment: "Premium", status: "Active" },
  { id: "CUST-8825", name: "Chris Wilson", email: "c.wilson@example.com", phone: "+1 555-0105", city: "Miami", segment: "Enterprise", status: "Active" },
  { id: "CUST-8826", name: "Sarah Miller", email: "s.miller@example.com", phone: "+1 555-0106", city: "Seattle", segment: "Standard", status: "Active" },
  { id: "CUST-8827", name: "David Clark", email: "d.clark@example.com", phone: "+1 555-0107", city: "Austin", segment: "Premium", status: "Inactive" },
  { id: "CUST-8828", name: "Laura Lee", email: "l.lee@example.com", phone: "+1 555-0108", city: "Denver", segment: "Standard", status: "Active" },
];

interface CoreTablesPageProps {
  onBreadcrumbNavigate: (path: string) => void;
}

export function CoreTablesPage({ onBreadcrumbNavigate, breadcrumbs, onBack }: { onBreadcrumbNavigate: (path: string) => void, breadcrumbs: any[], onBack?: () => void }) {
  const [selectedTableId, setSelectedTableId] = useState("branch");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const rawData = useMemo(() => {
    switch (selectedTableId) {
      case "branch": return BRANCH_DATA;
      case "customer": return CUSTOMER_DATA;
      default: return [];
    }
  }, [selectedTableId]);

  const filteredData = useMemo(() => {
    return rawData.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rawData, searchTerm]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const tableHeaders = useMemo(() => {
    if (selectedTableId === "branch") {
      return [
        { key: "id", label: "Branch ID" },
        { key: "name", label: "Branch Name" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "country", label: "Country" },
        { key: "type", label: "Branch Type" },
        { key: "status", label: "Status" },
      ];
    } else if (selectedTableId === "customer") {
      return [
        { key: "id", label: "Customer ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "city", label: "City" },
        { key: "segment", label: "Segment" },
        { key: "status", label: "Status" },
      ];
    }
    return [];
  }, [selectedTableId]);

  return (
    <div className="flex flex-col h-full w-full bg-white font-['Inter'] overflow-hidden">
      <PageHeader 
        title="Core Tables" 
        breadcrumbs={breadcrumbs} 
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
        onBack={onBack}
      />
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        
        {/* Core Table Selection Grid */}
        <div className="space-y-3">
          <h2 className="text-[14px] font-semibold text-[#161616]">Select Core Table</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CORE_TABLES_CONFIG.map((table) => {
              const Icon = table.icon;
              const isActive = selectedTableId === table.id;
              return (
                <button
                  key={table.id}
                  onClick={() => {
                    setSelectedTableId(table.id);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-[8px] border transition-all text-left group h-[64px]",
                    isActive 
                      ? "bg-white border-[#2A53A0] ring-1 ring-[#2A53A0] shadow-sm" 
                      : "bg-[#F4F4F4] border-transparent hover:bg-gray-200"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-[6px] flex items-center justify-center shrink-0 transition-colors",
                    isActive ? "bg-[#EAF2FF] text-[#2A53A0]" : "bg-white text-gray-500 group-hover:text-[#2A53A0]"
                  )}>
                    <Icon size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={cn(
                      "text-[14px] font-bold truncate",
                      isActive ? "text-[#2A53A0]" : "text-[#161616]"
                    )}>{table.label}</span>
                    <span className="text-[11px] text-gray-500 truncate">{table.count}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Information Banner */}
        <div className="flex items-center gap-3 bg-[#EAF2FF] border border-[#B2D4FF] px-4 h-[46px] rounded-[4px]">
          <Information size={18} className="text-[#2A53A0] shrink-0" />
          <p className="text-[12px] text-[#161616] font-medium">
            <span className="font-bold">Read-Only View:</span> Core table structure is fixed. These are system-defined entities that cannot be modified.
          </p>
        </div>

        {/* High-Density Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-[48px]">
          <div className="relative w-full sm:w-[320px] h-[46px] self-center">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder={`Search ${selectedTableId} records...`} 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full h-full pl-12 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto h-full">
            <Button 
              variant="outline" 
              className="h-[48px] px-6 border-gray-300 text-[#161616] hover:bg-gray-50 rounded-[8px] flex items-center gap-2 font-medium text-[14px]"
            >
              <Download size={20} /> Export
            </Button>
            <Button 
              className="h-[48px] px-6 bg-[#2A53A0] hover:bg-[#1E3C75] text-white rounded-[8px] flex items-center gap-2 font-normal transition-colors text-[14px]"
            >
              <Upload size={20} /> Import CSV
            </Button>
          </div>
        </div>

        {/* Data Table with CamelCase Columns */}
        <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
          <div className="overflow-x-auto no-scrollbar bg-white">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F0F0F0] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                  {tableHeaders.map((header) => (
                    <th key={header.key} className="px-6 border-b border-[#e0e0e0] align-middle whitespace-nowrap">
                      <SortableHeader 
                        column={header.key} 
                        label={header.label} 
                        sortConfig={sortConfig} 
                        onSort={requestSort} 
                        className="text-[#2A53A0] font-semibold" 
                      />
                    </th>
                  ))}
                  <th className="px-6 border-b border-[#e0e0e0] w-[120px] text-left align-middle select-none">
                    <span className="text-[14px] font-semibold text-[#2A53A0] ml-1 whitespace-nowrap">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData.length > 0 ? paginatedData.map((row: any, idx) => (
                  <tr key={idx} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
                    {tableHeaders.map((header) => (
                      <td key={header.key} className="px-6 align-middle">
                        {header.key === "status" ? (
                          <div className="flex items-center gap-2">
                            <Badge className={cn(
                              "text-[11px] font-medium px-3 rounded-full border-0 h-[28px] flex items-center justify-center whitespace-nowrap",
                              row[header.key] === "Active" ? "bg-[#defbe6] text-[#198038]" : "bg-[#fff1f1] text-[#da1e28]"
                            )}>
                              {row[header.key]}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-[14px] text-[#161616] font-normal block truncate">{row[header.key]}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 align-middle text-left">
                      <button 
                        onClick={() => onBreadcrumbNavigate(`views-management-core-tables-view-${selectedTableId}:${row.id}`)}
                        className="w-[28px] h-[28px] flex items-center justify-center bg-[#edf5ff] hover:bg-[#d0e2ff] rounded-md transition-colors text-[#0043ce]" 
                        title="View Details"
                      >
                        <View size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={tableHeaders.length + 1} className="h-48 text-center text-gray-500 text-sm">
                      No records matching your criteria were found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
  );
}
