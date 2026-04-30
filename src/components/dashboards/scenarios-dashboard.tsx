import { useState, useMemo, useRef, useEffect, useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  View, 
  Copy, 
  Play, 
  Archive, 
  TrashCan,
  Document, 
  CheckmarkFilled, 
  Edit, 
  Time, 
  CloseFilled, 
  Add,
  ChevronDown,
  Calendar,
  Filter,
  OverflowMenuVertical,
  Identification,
  Flash,
  Settings,
  User,
  Money,
  Portfolio,
  Checkmark
} from "@carbon/icons-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { useSortableData } from "../../hooks/use-sortable-data";
import { SortableHeader } from "../ui/sortable-header";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart, 
  Area 
} from "recharts";

// Mock Data from Image
const STATS_DATA = [
  { id: 'total', label: "Total Scenarios", value: 8, icon: Document, color: "#2A53A0" },
  { id: 'active', label: "Active", value: 4, icon: CheckmarkFilled, color: "#198038" },
  { id: 'drafts', label: "My Drafts", value: 1, icon: Edit, color: "#2A53A0" },
  { id: 'pending', label: "Pending Approval", value: 1, icon: Time, color: "#F1C21B", hasAlert: true },
  { id: 'nonperforming', label: "Non-Performing", value: 1, icon: CloseFilled, color: "#DA1E28" },
];

const BREAKDOWN_DATA = [
  { label: "Account", count: 2, icon: Portfolio },
  { label: "Card", count: 1, icon: Identification },
  { label: "Transaction", count: 2, icon: Flash },
  { label: "Terminal", count: 1, icon: Settings },
  { label: "Beneficiary", count: 1, icon: User },
  { label: "ATM", count: 1, icon: Money },
];

const RECENT_SCENARIOS = [
  { id: "SCN-1082", name: "High Value Transaction Pattern", workspace: "Account", group: "EFM", status: "Active", hits: "1,247", performance: 94.2, creator: "John Smith", date: "2026-01-30" },
  { id: "SCN-1081", name: "Velocity Check - Card", workspace: "Card", group: "EFM", status: "Active", hits: "856", performance: 87.5, creator: "Sarah Johnson", date: "2026-01-29" },
  { id: "SCN-1080", name: "Geographic Anomaly Detection", workspace: "Transaction", group: "AML Compliance", status: "Pending", hits: "0", performance: 0.0, creator: "Emma Davis", date: "2026-01-28" },
  { id: "SCN-1079", name: "Account Dormancy Alert", workspace: "Account", group: "EFM", status: "Draft", hits: "0", performance: 0.0, creator: "John Smith", date: "2026-01-27" },
  { id: "SCN-1078", name: "Multiple Failed Attempts", workspace: "Terminal", group: "EFM", status: "Active", hits: "423", performance: 45.3, creator: "Michael Brown", date: "2026-01-25" },
  { id: "SCN-1077", name: "Suspicious Beneficiary Pattern", workspace: "Beneficiary", group: "AML Compliance", status: "Disabled", hits: "0", performance: 0.0, creator: "Sarah Johnson", date: "2026-01-24" },
  { id: "SCN-1076", name: "Cross-Border Transaction Rules", workspace: "Transaction", group: "AML Compliance", status: "Active", hits: "2,103", performance: 92.8, creator: "Emma Davis", date: "2026-01-20" },
  { id: "SCN-1075", name: "ATM Withdrawal Velocity", workspace: "ATM", group: "EFM", status: "Rejected", hits: "0", performance: 0.0, creator: "Michael Brown", date: "2026-01-15" },
];

const TOP_PERFORMERS = [
  { rank: 1, name: "High Value Transaction Pa...", performance: 94.2 },
  { rank: 2, name: "Cross-Border Transaction ...", performance: 92.8 },
  { rank: 3, name: "Velocity Check - Card", performance: 87.5 },
  { rank: 4, name: "Multiple Failed Attempts", performance: 45.3 },
];

const RECENT_ACTIVITY = [
  { title: "Account Dormancy Alert", user: "John Smith", date: "16/12/2024", type: "modified", color: "#2A53A0" },
  { title: "Velocity Check - Card", user: "Sarah Johnson", date: "15/12/2024", type: "modified", color: "#198038" },
  { title: "Cross-Border Transaction Rules", user: "Sarah Johnson", date: "14/12/2024", type: "modified", color: "#198038" },
  { title: "Multiple Failed Attempts", user: "Emma Davis", date: "12/12/2024", type: "modified", color: "#198038" },
];

const TREND_DATA = [
  { name: 'Mon', hits: 400 },
  { name: 'Tue', hits: 300 },
  { name: 'Wed', hits: 500 },
  { name: 'Thu', hits: 280 },
  { name: 'Fri', hits: 590 },
  { name: 'Sat', hits: 320 },
  { name: 'Sun', hits: 450 },
];

function ActionMenu({ scenarioId }: { scenarioId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-[28px] h-[28px] flex items-center justify-center rounded-md bg-[#E5F6F6] text-[#007D79] hover:bg-[#D1EBE7] transition-colors"
      >
        <OverflowMenuVertical size={16} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-[8px] shadow-xl border border-gray-200 z-[100] py-1 overflow-hidden"
          >
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-gray-700 hover:bg-[#EAF2FF] hover:text-[#2A53A0] transition-colors">
              <View size={16} className="text-gray-400" />
              <span>View Details</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-gray-700 hover:bg-[#EAF2FF] hover:text-[#2A53A0] transition-colors">
              <Edit size={16} className="text-gray-400" />
              <span>Edit Scenario</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-gray-700 hover:bg-[#EAF2FF] hover:text-[#2A53A0] transition-colors">
              <Copy size={16} className="text-gray-400" />
              <span>Duplicate</span>
            </button>
            
            <div className="h-[1px] bg-gray-100 my-1" />
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[#198038] hover:bg-[#DEFBE6] transition-colors">
              <Play size={16} />
              <span>Activate</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition-colors">
              <Archive size={16} className="text-gray-400" />
              <span>Archive</span>
            </button>
            
            <div className="h-[1px] bg-gray-100 my-1" />
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[#DA1E28] hover:bg-[#FFF1F1] transition-colors">
              <TrashCan size={16} />
              <span>Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const getWorkspaceIcon = (workspace: string) => {
  switch (workspace) {
    case "Account": return Portfolio;
    case "Card": return Identification;
    case "Transaction": return Flash;
    case "Terminal": return Settings;
    case "Beneficiary": return User;
    case "ATM": return Money;
    default: return Document;
  }
};

const getWorkspaceColor = (workspace: string) => {
  switch (workspace) {
    case "Account": return "text-[#002D9C] bg-[#D0E2FF]";
    case "Card": return "text-[#491D8B] bg-[#E8DAFF]";
    case "Transaction": return "text-[#004144] bg-[#D9FBFB]";
    case "Terminal": return "text-[#161616] bg-[#E0E0E0]";
    case "Beneficiary": return "text-[#750E13] bg-[#FFD7E1]";
    case "ATM": return "text-[#002D9C] bg-[#D0E2FF]";
    default: return "text-[#2A53A0] bg-[#f0f4f9]";
  }
};

const getGroupColor = (group: string) => {
  switch (group) {
    case "EFM": return "text-[#8A3FFC] bg-[#F1F0FF] border-[#D4BBFF]";
    case "AML Compliance": return "text-[#007D79] bg-[#E5F6F6] border-[#97E1E1]";
    default: return "text-[#525252] bg-[#F4F4F4] border-[#E0E0E0]";
  }
};

function FilterDropdown({ 
  label, 
  options, 
  selected, 
  onChange, 
  icon: Icon 
}: { 
  label: string, 
  options: string[], 
  selected: string, 
  onChange: (val: string) => void,
  icon: any
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-[46px] px-4 gap-2 text-sm rounded-[8px] bg-white border transition-all flex items-center font-medium min-w-[110px] justify-between",
          selected !== "All" ? "border-[#2A53A0] text-[#2A53A0] bg-blue-50" : "border-gray-300 text-[#161616] hover:bg-gray-50"
        )}
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className={selected !== "All" ? "text-[#2A53A0]" : "text-gray-400"} />
          <span>{selected === "All" ? label : selected}</span>
        </div>
        <ChevronDown size={14} className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute right-0 mt-1 w-48 bg-white rounded-[8px] shadow-lg border border-gray-200 z-50 py-1"
          >
            {options.map((opt, idx) => (
              <div 
                key={`${opt}-${idx}`}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-sm text-gray-700"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                <span>{opt}</span>
                {selected === opt && <Checkmark size={14} className="text-[#2A53A0]" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchableFilterDropdown({ 
  label, 
  options, 
  selected, 
  onChange, 
  icon: Icon,
  searchPlaceholder,
  searchValue,
  onSearchChange
}: { 
  label: string, 
  options: string[], 
  selected: string, 
  onChange: (val: string) => void,
  icon: any,
  searchPlaceholder: string,
  searchValue: string,
  onSearchChange: (val: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-[46px] px-4 gap-2 text-sm rounded-[8px] bg-white border transition-all flex items-center font-medium min-w-[140px] justify-between",
          selected !== "All" ? "border-[#2A53A0] text-[#2A53A0] bg-blue-50" : "border-gray-300 text-[#161616] hover:bg-gray-50"
        )}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <Icon size={14} className={selected !== "All" ? "text-[#2A53A0]" : "text-gray-400"} />
          <span className="truncate">{selected === "All" ? label : selected}</span>
        </div>
        <ChevronDown size={14} className={cn("transition-transform shrink-0", isOpen ? "rotate-180" : "")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute right-0 mt-1 w-56 bg-white rounded-[8px] shadow-lg border border-gray-200 z-50 overflow-hidden flex flex-col"
          >
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-[12px] bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#2A53A0]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto py-1">
              {options.length > 0 ? (
                options.map((opt, idx) => (
                  <div 
                    key={`${opt}-${idx}`}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-sm text-gray-700"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                  >
                    <span className="truncate">{opt}</span>
                    {selected === opt && <Checkmark size={14} className="text-[#2A53A0] shrink-0" />}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-[11px] text-gray-400 italic">No matches found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ScenariosDashboard() {
  const gradientId = useId();
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [creatorFilter, setCreatorFilter] = useState<string>("All");
  
  const [creatorSearch, setCreatorSearch] = useState("");
  
  const statusOptions = ["All", "Active", "Pending", "Draft", "Disabled", "Rejected"];
  const dateOptions = ["All", "Today", "Last 7 Days", "Last 30 Days"];
  
  const allCreators = useMemo(() => {
    const creators = RECENT_SCENARIOS.map(s => s.creator).filter(Boolean);
    return ["All", ...Array.from(new Set(creators))];
  }, []);

  const filteredCreators = useMemo(() => {
    return allCreators.filter(c => 
      c.toLowerCase().includes(creatorSearch.toLowerCase())
    );
  }, [allCreators, creatorSearch]);

  const filteredScenarios = useMemo(() => {
    return RECENT_SCENARIOS.filter(scenario => {
      const matchesStatus = statusFilter === "All" || scenario.status === statusFilter;
      
      const matchesCreator = creatorFilter === "All" || scenario.creator === creatorFilter;
      
      let matchesDate = true;
      if (dateFilter !== "All") {
        const scenarioDate = new Date(scenario.date);
        const today = new Date("2026-01-30");
        const diffDays = Math.ceil((today.getTime() - scenarioDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateFilter === "Today") matchesDate = diffDays === 0;
        else if (dateFilter === "Last 7 Days") matchesDate = diffDays <= 7;
        else if (dateFilter === "Last 30 Days") matchesDate = diffDays <= 30;
      }
      
      return matchesStatus && matchesCreator && matchesDate;
    });
  }, [statusFilter, creatorFilter, dateFilter]);

  const { items: sortedScenarios, requestSort, sortConfig } = useSortableData(filteredScenarios);

  return (
    <div className="space-y-4 pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
            <span>Authoring</span>
            <span>/</span>
            <span>Scenarios</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Scenario Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group min-w-[200px]">
            <button className="w-full flex items-center justify-between px-4 h-[46px] bg-white border border-gray-300 rounded-[8px] text-[14px] text-[#161616] font-medium hover:border-[#2A53A0] transition-colors">
              All Workspaces <ChevronDown size={18} className="text-gray-500" />
            </button>
          </div>
          <div className="relative group min-w-[200px]">
            <button className="w-full flex items-center justify-between px-4 h-[46px] bg-white border border-gray-300 rounded-[8px] text-[14px] text-[#161616] font-medium hover:border-[#2A53A0] transition-colors">
              All Groups <ChevronDown size={18} className="text-gray-500" />
            </button>
          </div>
          <Button className="bg-[#2A53A0] hover:bg-[#1e3c75] text-white rounded-[8px] h-[48px] px-8 gap-2 font-semibold text-[14px] shadow-sm">
            <Add size={20} />
            New Scenario
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STATS_DATA.map((stat) => {
          const getLightColor = (color: string) => {
            if (color === "#2A53A0") return "#EAF2FF";
            if (color === "#198038") return "#DEFBE6";
            if (color === "#F1C21B") return "#FFF9E5";
            if (color === "#DA1E28") return "#FFF1F1";
            return "#F4F4F4";
          };
          const lightColor = getLightColor(stat.color);
          const trendValue = stat.id === 'active' ? 3 : stat.id === 'total' ? 2 : 1;

          return (
            <div 
              key={stat.id} 
              className="bg-white p-4 rounded-[8px] border border-gray-100 shadow-sm flex flex-col justify-between h-full min-h-[140px]"
            >
              <div className="flex justify-between items-start mb-2">
                <div 
                  className="p-2 rounded-[8px]"
                  style={{ backgroundColor: `${stat.color}1A`, color: stat.color }}
                >
                  <stat.icon size={20} style={{ color: "currentColor" }} />
                </div>
                <span 
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: lightColor, color: stat.color }}
                >
                  +{trendValue}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-700 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-500">
                  {stat.id === 'total' && "Total scenarios in library"}
                  {stat.id === 'active' && "Currently live or approved"}
                  {stat.id === 'drafts' && "Being authored or updated"}
                  {stat.id === 'pending' && "Awaiting checker review"}
                  {stat.id === 'nonperforming' && "Stopped due to issues"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Scenarios Panel */}
      <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-normal text-[#161616]">Recent Scenarios</h2>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-gray-400 font-medium italic">Data refreshed 2 mins ago</span>
            <button className="text-[13px] text-[#2A53A0] hover:underline font-bold uppercase tracking-wider">View Full Library</button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white px-4 h-[64px] flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e0e0e0]">
          {/* Left Side: Workspace Badges (Standardized Main Dashboard style) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {BREAKDOWN_DATA.map((item) => (
              <div 
                key={item.label} 
                className={cn(
                  "rounded-full px-4 h-[30px] text-sm font-normal border flex items-center gap-1.5 shrink-0 transition-colors",
                  getWorkspaceColor(item.label)
                )}
              >
                <item.icon size={14} className="opacity-80" />
                <span>{item.label}:</span>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>

          {/* Right Side: Filters */}
          <div className="flex items-center gap-2 shrink-0">
            <FilterDropdown 
              label="Status" 
              options={statusOptions} 
              selected={statusFilter} 
              onChange={setStatusFilter} 
              icon={Flash} 
            />

            <FilterDropdown 
              label="Date" 
              options={dateOptions} 
              selected={dateFilter} 
              onChange={setDateFilter} 
              icon={Calendar} 
            />

            <SearchableFilterDropdown 
              label="Created By" 
              options={filteredCreators} 
              selected={creatorFilter} 
              onChange={setCreatorFilter} 
              icon={User} 
              searchPlaceholder="Search creators..."
              searchValue={creatorSearch}
              onSearchChange={setCreatorSearch}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto flex-1 bg-white">
          <table className="w-full border-collapse text-left table-fixed">
            <thead>
              <tr className="bg-[#F0F0F0] text-[#161616] h-[46px] shadow-[0_1px_0_0_#e0e0e0]">
                <th className="px-4 py-3 text-[13px] font-medium text-[#2A53A0] w-[10%] border-b border-[#e0e0e0] text-left">
                  <SortableHeader column="id" label="ID" sortConfig={sortConfig} onSort={requestSort} />
                </th>
                <th className="px-4 py-3 text-[13px] font-medium text-[#2A53A0] w-[21%] border-b border-[#e0e0e0] text-left">
                  <SortableHeader column="name" label="Scenario Name" sortConfig={sortConfig} onSort={requestSort} />
                </th>
                <th className="px-4 py-3 text-[13px] font-medium text-[#2A53A0] w-[10%] border-b border-[#e0e0e0] text-left">
                  <SortableHeader column="workspace" label="Workspace" sortConfig={sortConfig} onSort={requestSort} />
                </th>
                <th className="px-4 py-3 text-[13px] font-medium text-[#2A53A0] w-[9%] border-b border-[#e0e0e0] text-left">
                  <SortableHeader column="group" label="Group" sortConfig={sortConfig} onSort={requestSort} />
                </th>
                <th className="px-4 py-3 text-[13px] font-medium text-[#2A53A0] w-[10%] border-b border-[#e0e0e0] text-left">
                  <SortableHeader column="creator" label="Created By" sortConfig={sortConfig} onSort={requestSort} />
                </th>
                <th className="px-4 py-3 text-[13px] font-medium text-[#2A53A0] w-[9%] border-b border-[#e0e0e0] text-left">
                  <SortableHeader column="date" label="Created On" sortConfig={sortConfig} onSort={requestSort} />
                </th>
                <th className="px-4 py-3 text-[13px] font-medium text-[#2A53A0] w-[8%] border-b border-[#e0e0e0] text-right">
                  <SortableHeader column="hits" label="Hits" sortConfig={sortConfig} onSort={requestSort} iconPosition="left" />
                </th>
                <th className="px-4 py-3 text-[13px] font-medium text-[#2A53A0] w-[12%] border-b border-[#e0e0e0] text-left">
                  <SortableHeader column="performance" label="Performance" sortConfig={sortConfig} onSort={requestSort} />
                </th>
                <th className="px-4 py-3 text-[13px] font-medium text-[#2A53A0] w-[6%] border-b border-[#e0e0e0] text-left">
                  <SortableHeader column="status" label="Status" sortConfig={sortConfig} onSort={requestSort} />
                </th>
                <th className="px-4 py-3 text-[13px] font-medium text-[#2A53A0] w-[5%] border-b border-[#e0e0e0] text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedScenarios.length > 0 ? (
                sortedScenarios.map((row) => {
                  const Icon = getWorkspaceIcon(row.workspace);
                  return (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors h-[46px]">
                      <td className="px-4 py-2">
                        <div className="flex items-center h-full font-medium text-[#2A53A0] hover:underline cursor-pointer text-[13px] truncate">
                          {row.id}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-[13px] font-medium text-[#161616] truncate block" title={row.name}>{row.name}</span>
                      </td>
                      <td className="px-4 py-2">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-medium h-[28px] whitespace-nowrap",
                          getWorkspaceColor(row.workspace)
                        )}>
                          <Icon size={12} className="shrink-0" />
                          <span>{row.workspace}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge className={cn(
                          "text-[10px] font-medium px-2 py-0.5 rounded-md uppercase border h-[28px] flex items-center justify-center",
                          getGroupColor(row.group)
                        )}>
                          {row.group}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-[12px] text-gray-700 font-medium">{row.creator}</td>
                      <td className="px-4 py-2 text-[12px] text-gray-500 font-mono">{row.date}</td>
                      <td className="px-4 py-2 text-[12px] font-mono text-right text-gray-600">{row.hits}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                row.performance > 80 ? "bg-[#198038]" : row.performance > 0 ? "bg-[#DA1E28]" : "bg-gray-300"
                              )}
                              style={{ width: `${row.performance}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-gray-700 w-10">{row.performance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full border-0 h-[28px] flex items-center justify-center",
                          row.status === "Active" && "bg-[#DEFBE6] text-[#198038]",
                          row.status === "Pending" && "bg-[#FFF9E5] text-[#B28600]",
                          row.status === "Draft" && "bg-[#EAF2FF] text-[#2A53A0]",
                          row.status === "Disabled" && "bg-[#F4F4F4] text-[#525252]",
                          row.status === "Rejected" && "bg-[#FFF1F1] text-[#DA1E28]",
                        )}>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <ActionMenu scenarioId={row.id} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500 text-sm italic">
                    No scenarios match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Performance Trends */}
        <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Performance Trends</h2>
            <button className="text-[12px] text-[#2A53A0] hover:underline font-medium">View All</button>
          </div>
          <div className="p-4 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2A53A0" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2A53A0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="hits" stroke="#2A53A0" fillOpacity={1} fill={`url(#${gradientId})`} />
                </AreaChart>
              </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Top Performers</h2>
            <button className="text-[12px] text-[#2A53A0] hover:underline font-medium">View All</button>
          </div>
          <div className="p-4 space-y-4">
            {TOP_PERFORMERS.map((item) => (
              <div key={item.rank} className="flex items-center justify-between group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                    item.rank === 1 ? "bg-[#F1C21B] text-white" : "bg-gray-200 text-gray-600"
                  )}>
                    {item.rank}
                  </div>
                  <span className="text-[13px] text-gray-700 truncate font-medium group-hover:text-[#2A53A0] transition-colors">{item.name}</span>
                </div>
                <span className="text-[13px] font-bold text-[#198038]">{item.performance}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
            <button className="text-[12px] text-[#2A53A0] hover:underline font-medium">View All</button>
          </div>
          <div className="p-4 space-y-5">
            {RECENT_ACTIVITY.map((item, idx) => (
              <div key={`${item.title}-${item.date}-${idx}`} className="flex gap-3 relative">
                <div className="flex flex-col items-center shrink-0">
                  <div 
                    className="w-2 h-2 rounded-full z-10" 
                    style={{ backgroundColor: item.color }} 
                  />
                  {idx !== RECENT_ACTIVITY.length - 1 && (
                    <div className="w-[1px] bg-gray-100 absolute top-2 bottom-[-20px] left-1" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-gray-900">{item.title}</span>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span>{item.user}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}