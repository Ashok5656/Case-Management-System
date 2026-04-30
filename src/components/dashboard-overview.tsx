import { motion, AnimatePresence } from "motion/react";
import PageHeader from "./page-header";
import { 
  Email,
  Checkmark,
  WarningAlt,
  Time,
  Language,
  Locked,
  CheckmarkFilled,
  WarningFilled,
  ErrorFilled,
  ChartLine,
  ChartPie,
  ChevronLeft,
  ChevronRight
} from "@carbon/icons-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { cn } from "./ui/utils";

interface DashboardOverviewProps {
  breadcrumbs: any[];
  onBreadcrumbNavigate: (item: any) => void;
  username: string;
}

export function DashboardOverview({ breadcrumbs, onBreadcrumbNavigate, username }: DashboardOverviewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Current timestamp for last updated
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimestamp = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  // Metric cards data
  const metricCards = [
    {
      icon: Email,
      iconBg: "#D0E2FF",
      iconColor: "#2A53A0",
      value: "0 / 0",
      label: "Emails Ingested / New Cases",
      subtext: "Today"
    },
    {
      icon: CheckmarkFilled,
      iconBg: "#DEFBE6",
      iconColor: "#198038",
      value: "0",
      label: "Cases Processed",
      subtext: "Total cases responded to"
    },
    {
      icon: Time,
      iconBg: "#D0E2FF",
      iconColor: "#0F62FE",
      value: "0",
      label: "Partially Processed",
      subtext: "Cases partially responded to"
    },
    {
      icon: Language,
      iconBg: "#F4F4F4",
      iconColor: "#8D8D8D",
      value: "0",
      label: "Regional Language Cases",
      subtext: "Non-English category"
    },
    {
      icon: Time,
      iconBg: "#FFF9E5",
      iconColor: "#B28600",
      value: "0.0h",
      label: "Average Processing Time",
      subtext: "From received to response sent"
    },
    {
      icon: WarningFilled,
      iconBg: "#FFE0E0",
      iconColor: "#DA1E28",
      value: "0",
      label: "Quarantined/Exception Cases",
      subtext: "Today"
    }
  ];

  // Aging summary cards
  const agingCards = [
    {
      icon: CheckmarkFilled,
      iconColor: "#198038",
      borderColor: "#198038",
      bgColor: "#DEFBE6",
      range: "0-2 Days",
      value: "12",
      label: "Recent emails"
    },
    {
      icon: WarningFilled,
      iconColor: "#B28600",
      borderColor: "#F1C21B",
      bgColor: "#FFF9E5",
      range: "3-5 Days",
      value: "8",
      label: "Needs attention"
    },
    {
      icon: ErrorFilled,
      iconColor: "#DA1E28",
      borderColor: "#DA1E28",
      bgColor: "#FFE0E0",
      range: ">5 Days",
      value: "3",
      label: "Urgent"
    }
  ];

  // Chart data
  const dailyVolumeData = [
    { date: "Apr 17", cases: 5 },
    { date: "Apr 18", cases: 8 },
    { date: "Apr 19", cases: 12 },
    { date: "Apr 20", cases: 7 },
    { date: "Apr 21", cases: 15 },
    { date: "Apr 22", cases: 11 },
    { date: "Apr 23", cases: 9 }
  ];

  const categoryData = [
    { name: "POLICE_REQUEST", value: 45, percentage: 45.0, color: "#2A53A0" },
    { name: "COURT_ORDER", value: 30, percentage: 30.0, color: "#0F62FE" },
    { name: "REGULATORY_INQUIRY", value: 15, percentage: 15.0, color: "#8A3FFC" },
    { name: "OTHER", value: 10, percentage: 10.0, color: "#D12771" }
  ];

  const COLORS = ["#2A53A0", "#0F62FE", "##8A3FFC", "#D12771"];
  
  // All case data
  const allCases = [
    { id: "CASE-2024-0420", category: "COURT_ORDER", status: "In Progress", receivedDate: "2024-04-23", age: 0, priority: "High", assignedTo: "Lisa Anderson" },
    { id: "CASE-2024-0421", category: "POLICE_REQUEST", status: "Pending", receivedDate: "2024-04-23", age: 0, priority: "Medium", assignedTo: "David Brown" },
    { id: "CASE-2024-0422", category: "REGULATORY_INQUIRY", status: "Completed", receivedDate: "2024-04-22", age: 1, priority: "Low", assignedTo: "Michael Chen" },
    { id: "CASE-2024-0419", category: "OTHER", status: "Pending", receivedDate: "2024-04-22", age: 1, priority: "Medium", assignedTo: "Robert Wilson" },
    { id: "CASE-2024-0418", category: "POLICE_REQUEST", status: "Completed", receivedDate: "2024-04-21", age: 2, priority: "High", assignedTo: "Emily Chen" },
    { id: "CASE-2024-0417", category: "REGULATORY_INQUIRY", status: "In Progress", receivedDate: "2024-04-21", age: 2, priority: "Critical", assignedTo: "Mike Davis" },
    { id: "CASE-2024-0416", category: "COURT_ORDER", status: "Pending", receivedDate: "2024-04-20", age: 3, priority: "High", assignedTo: "Sarah Johnson" },
    { id: "CASE-2024-0415", category: "POLICE_REQUEST", status: "In Progress", receivedDate: "2024-04-19", age: 4, priority: "Medium", assignedTo: "John Smith" },
    { id: "CASE-2024-0414", category: "OTHER", status: "Completed", receivedDate: "2024-04-19", age: 4, priority: "Low", assignedTo: "Jennifer Lee" },
    { id: "CASE-2024-0413", category: "COURT_ORDER", status: "Pending", receivedDate: "2024-04-18", age: 5, priority: "Critical", assignedTo: "Tom Harris" },
    { id: "CASE-2024-0412", category: "POLICE_REQUEST", status: "In Progress", receivedDate: "2024-04-18", age: 5, priority: "High", assignedTo: "Amanda Clark" },
    { id: "CASE-2024-0411", category: "REGULATORY_INQUIRY", status: "Pending", receivedDate: "2024-04-17", age: 6, priority: "Medium", assignedTo: "Kevin Martinez" },
    { id: "CASE-2024-0410", category: "OTHER", status: "Completed", receivedDate: "2024-04-17", age: 6, priority: "Low", assignedTo: "Rachel Green" },
    { id: "CASE-2024-0409", category: "COURT_ORDER", status: "In Progress", receivedDate: "2024-04-16", age: 7, priority: "High", assignedTo: "Chris Taylor" },
    { id: "CASE-2024-0408", category: "POLICE_REQUEST", status: "Pending", receivedDate: "2024-04-16", age: 7, priority: "Critical", assignedTo: "Nicole White" },
  ];

  // Calculate pagination
  const totalItems = allCases.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedCases = allCases.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(Number(e.target.value));
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white font-['Inter'] overflow-hidden">
      <div className="flex-none bg-white z-40 sticky top-0">
        <PageHeader 
          title="Dashboard" 
          breadcrumbs={breadcrumbs} 
          onBreadcrumbNavigate={onBreadcrumbNavigate} 
        />
      </div>
      
      {/* Scrollable Content Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto hover-scroll p-4 space-y-4 relative bg-white">
        
        {/* Top Metric Cards - 6 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {metricCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-8 h-8 rounded-[4px] flex items-center justify-center"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <card.icon className="w-4 h-4" style={{ color: card.iconColor }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[28px] font-normal leading-tight text-[#161616]">{card.value}</div>
                <div className="text-[13px] font-normal text-[#161616] leading-tight">{card.label}</div>
                <div className="text-[11px] text-[#525252]">{card.subtext}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section - Three columns in one row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Aging Summary */}
          <div className="rounded-xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Time className="w-4 h-4 text-[#2A53A0]" />
              <h2 className="text-[15px] font-medium text-[#161616]">Aging Summary</h2>
            </div>
            <p className="text-[11px] text-[#525252] mb-4">Pending emails by age</p>
            
            {/* Bar Chart */}
            <div className="w-full relative" style={{ height: '280px' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
                {/* Y-axis labels and grid */}
                <line x1="50" y1="40" x2="50" y2="220" stroke="#E0E0E0" strokeWidth="1" />
                <line x1="50" y1="220" x2="380" y2="220" stroke="#E0E0E0" strokeWidth="1" />
                {[0, 4, 8, 12, 16].map((val, i) => (
                  <g key={`grid-${i}`}>
                    <line x1="50" y1={220 - (i * 45)} x2="380" y2={220 - (i * 45)} stroke="#E0E0E0" strokeWidth="1" strokeDasharray="3,3" />
                    <text x="40" y={225 - (i * 45)} fontSize="14" fill="#525252" textAnchor="end">{val}</text>
                  </g>
                ))}
                
                {/* Bars */}
                {agingCards.map((card, i) => {
                  const value = parseInt(card.value);
                  const barHeight = (value / 16) * 180;
                  const barWidth = 70;
                  const xPos = 90 + (i * 100);
                  const yPos = 220 - barHeight;
                  
                  return (
                    <g key={`bar-${i}`}>
                      {/* Bar */}
                      <rect
                        x={xPos}
                        y={yPos}
                        width={barWidth}
                        height={barHeight}
                        fill={card.iconColor}
                        rx="4"
                      />
                      {/* Value on top of bar */}
                      <text
                        x={xPos + barWidth / 2}
                        y={yPos - 5}
                        fontSize="14"
                        fill="#161616"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {card.value}
                      </text>
                      {/* X-axis label */}
                      <text
                        x={xPos + barWidth / 2}
                        y="240"
                        fontSize="14"
                        fill="#525252"
                        textAnchor="middle"
                      >
                        {card.range}
                      </text>
                      <text
                        x={xPos + barWidth / 2}
                        y="258"
                        fontSize="12"
                        fill="#525252"
                        textAnchor="middle"
                      >
                        {card.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="mt-2 text-[11px] text-[#525252]">
              Last updated: {formatTimestamp(currentTime)}
            </div>
          </div>

          {/* Daily Case Volume Trend */}
          <div className="rounded-xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ChartLine className="w-4 h-4 text-[#2A53A0]" />
              <h3 className="text-[15px] font-medium text-[#161616]">Daily Case Volume Trend</h3>
            </div>
            <p className="text-[11px] text-[#525252] mb-4">Last 7 days including today</p>
            
            {/* Custom Line Chart */}
            <div className="w-full relative" style={{ height: '280px' }}>
              <svg width="100%" height="100%" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                <line x1="40" y1="40" x2="40" y2="220" stroke="#E0E0E0" strokeWidth="1" />
                <line x1="40" y1="220" x2="580" y2="220" stroke="#E0E0E0" strokeWidth="1" />
                {[0, 5, 10, 15, 20].map((val, i) => (
                  <g key={`grid-${i}`}>
                    <line x1="40" y1={220 - (i * 45)} x2="580" y2={220 - (i * 45)} stroke="#E0E0E0" strokeWidth="1" strokeDasharray="3,3" />
                    <text x="25" y={225 - (i * 45)} fontSize="14" fill="#525252" textAnchor="end">{val}</text>
                  </g>
                ))}
                {/* X-axis labels */}
                {dailyVolumeData.map((item, i) => (
                  <text 
                    key={`xlabel-${i}`} 
                    x={90 + (i * 75)} 
                    y="240" 
                    fill="#525252" 
                    textAnchor="middle"
                    style={{ fontSize: '14px', fontWeight: '400' }}
                  >
                    {item.date}
                  </text>
                ))}
                {/* Data points and line */}
                {dailyVolumeData.map((item, i) => {
                  const yPos = 220 - (item.cases / 20 * 180);
                  return (
                    <circle key={`point-${i}`} cx={90 + (i * 75)} cy={yPos} r="4" fill="#2A53A0" />
                  );
                })}
                <polyline
                  points={dailyVolumeData.map((item, i) => {
                    const yPos = 220 - (item.cases / 20 * 180);
                    return `${90 + (i * 75)},${yPos}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#2A53A0"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Case Distribution by Category */}
          <div className="rounded-xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ChartPie className="w-4 h-4 text-[#2A53A0]" />
              <h3 className="text-[15px] font-medium text-[#161616]">Case Distribution by Category</h3>
            </div>
            <p className="text-[11px] text-[#525252] mb-4">Breakdown of all cases</p>
            
            {/* Custom Donut Chart */}
            <div className="relative w-full flex flex-col items-center justify-center" style={{ height: '280px' }}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                {(() => {
                  const total = categoryData.reduce((sum, cat) => sum + cat.value, 0);
                  let currentAngle = -90; // Start from top
                  
                  return categoryData.map((cat, i) => {
                    const percentage = (cat.value / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;
                    currentAngle = endAngle;
                    
                    // Convert angles to radians
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    
                    // Calculate arc path for donut
                    const outerRadius = 80;
                    const innerRadius = 50;
                    const centerX = 100;
                    const centerY = 100;
                    
                    const x1 = centerX + outerRadius * Math.cos(startRad);
                    const y1 = centerY + outerRadius * Math.sin(startRad);
                    const x2 = centerX + outerRadius * Math.cos(endRad);
                    const y2 = centerY + outerRadius * Math.sin(endRad);
                    const x3 = centerX + innerRadius * Math.cos(endRad);
                    const y3 = centerY + innerRadius * Math.sin(endRad);
                    const x4 = centerX + innerRadius * Math.cos(startRad);
                    const y4 = centerY + innerRadius * Math.sin(startRad);
                    
                    const largeArc = angle > 180 ? 1 : 0;
                    
                    const pathData = [
                      `M ${x1} ${y1}`,
                      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
                      `L ${x3} ${y3}`,
                      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
                      'Z'
                    ].join(' ');
                    
                    return (
                      <path
                        key={`segment-${i}`}
                        d={pathData}
                        fill={cat.color}
                      />
                    );
                  });
                })()}
              </svg>
              
              {/* Legend */}
              <div className="mt-4 space-y-2">
                {categoryData.map((cat, i) => (
                  <div key={`legend-${i}`} className="flex items-center gap-2 text-[11px]">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-[#161616]">{cat.name}</span>
                    <span className="text-[#525252] ml-1">{cat.value} ({cat.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Case List Data Table */}
        <div className="rounded-xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="pb-3 border-b border-[#E0E0E0]">
            <h3 className="text-[15px] font-medium text-[#161616]">Recent Cases</h3>
            <p className="text-[11px] text-[#525252] mt-1">Latest case submissions and their status</p>
          </div>
          
          <div className="overflow-x-auto mt-4">
            <div className="border border-[#E0E0E0] rounded-[8px] overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#E0E0E0]" style={{ backgroundColor: '#F0F0F0', height: '48px' }}>
                    <th className="text-left px-4 text-[16px] font-medium text-[#2A53A0]">Case ID</th>
                    <th className="text-left px-4 text-[16px] font-medium text-[#2A53A0]">Category</th>
                    <th className="text-left px-4 text-[16px] font-medium text-[#2A53A0]">Status</th>
                    <th className="text-left px-4 text-[16px] font-medium text-[#2A53A0]">Received Date</th>
                    <th className="text-left px-4 text-[16px] font-medium text-[#2A53A0]">Age (Days)</th>
                    <th className="text-left px-4 text-[16px] font-medium text-[#2A53A0]">Priority</th>
                    <th className="text-left px-4 text-[16px] font-medium text-[#2A53A0]">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCases.map((caseItem, idx) => (
                    <tr key={idx} className="border-b border-[#E0E0E0] last:border-b-0 hover:bg-[#F4F4F4] transition-colors" style={{ height: '46px' }}>
                      <td className="px-4 text-[13px] text-[#2A53A0] font-medium">{caseItem.id}</td>
                      <td className="px-4 text-[13px] text-[#161616]">{caseItem.category}</td>
                      <td className="px-4">
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-[4px] text-[11px] font-medium",
                          caseItem.status === "Completed" && "bg-[#DEFBE6] text-[#198038]",
                          caseItem.status === "In Progress" && "bg-[#D0E2FF] text-[#0F62FE]",
                          caseItem.status === "Pending" && "bg-[#FFF9E5] text-[#B28600]"
                        )}>
                          {caseItem.status}
                        </span>
                      </td>
                      <td className="px-4 text-[13px] text-[#525252]">{caseItem.receivedDate}</td>
                      <td className="px-4 text-[13px] text-[#161616]">{caseItem.age}</td>
                      <td className="px-4">
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-[4px] text-[11px] font-medium",
                          caseItem.priority === "Critical" && "bg-[#FFE0E0] text-[#DA1E28]",
                          caseItem.priority === "High" && "bg-[#FFD6E8] text-[#D12771]",
                          caseItem.priority === "Medium" && "bg-[#FFF9E5] text-[#B28600]",
                          caseItem.priority === "Low" && "bg-[#E5F6FF] text-[#0F62FE]"
                        )}>
                          {caseItem.priority}
                        </span>
                      </td>
                      <td className="px-4 text-[13px] text-[#161616]">{caseItem.assignedTo}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[#E0E0E0]" style={{ height: '47px' }}>
                    <td colSpan={7} className="p-0">
                      <div className="bg-white flex items-center justify-between">
                        {/* Left Side - Items per page */}
                        <div className="flex items-center border-r border-[#E0E0E0]">
                          <div className="flex items-center gap-2 px-4 h-[47px]">
                            <span className="text-[#525252] text-[16px] font-normal whitespace-nowrap">Items per page:</span>
                            <div className="relative">
                              <select 
                                className="appearance-none bg-white border-0 text-[#161616] text-[16px] font-normal pr-8 pl-2 py-2 cursor-pointer focus:outline-none"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                              >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                              </select>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M8 11L3 6L3.7 5.3L8 9.6L12.3 5.3L13 6L8 11Z" fill="#161616"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 h-[47px] flex items-center border-l border-[#E0E0E0]">
                            <p className="text-[#161616] text-[16px]">
                              <span className="font-medium">{startIndex + 1}–{endIndex}</span>
                              <span className="text-[#525252] font-normal"> of </span>
                              <span className="font-medium">{totalItems}</span>
                              <span className="text-[#525252] font-normal"> items</span>
                            </p>
                          </div>
                        </div>

                        {/* Right Side - Page navigation */}
                        <div className="flex items-center">
                          <div className="px-4 h-[47px] flex items-center border-r border-[#E0E0E0]">
                            <div className="relative">
                              <select 
                                className="appearance-none bg-white border-0 text-[#161616] text-[16px] font-normal pr-8 pl-2 py-2 cursor-pointer focus:outline-none"
                                value={currentPage}
                                onChange={handlePageChange}
                              >
                                {Array.from({ length: totalPages }, (_, i) => (
                                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                              </select>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M8 11L3 6L3.7 5.3L8 9.6L12.3 5.3L13 6L8 11Z" fill="#161616"/>
                                </svg>
                              </div>
                            </div>
                            <span className="text-[#525252] text-[16px] font-normal ml-2 whitespace-nowrap">of {totalPages} pages</span>
                          </div>
                          <div className="flex items-center h-[47px]">
                            <button 
                              onClick={handlePreviousPage}
                              disabled={currentPage === 1}
                              className={cn(
                                "h-full px-3 flex items-center justify-center border-r border-[#E0E0E0]",
                                currentPage === 1 ? "opacity-25 cursor-not-allowed" : "hover:bg-[#F4F4F4] cursor-pointer"
                              )}
                            >
                              <ChevronLeft size={20} className="text-[#161616]" />
                            </button>
                            <button 
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className={cn(
                                "h-full px-3 flex items-center justify-center",
                                currentPage === totalPages ? "opacity-25 cursor-not-allowed" : "hover:bg-[#F4F4F4] cursor-pointer"
                              )}
                            >
                              <ChevronRight size={20} className="text-[#161616]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-[#161616] rounded-[8px] p-3 flex items-center justify-between gap-6">
          {/* Total Backlog */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4589FF]"></div>
            <span className="text-white text-[13px] font-normal">Total Backlog:</span>
            <span className="text-white text-[13px] font-semibold">0</span>
          </div>

          {/* Today's Additions */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#24A148]"></div>
            <span className="text-white text-[13px] font-normal">Today's Additions:</span>
            <span className="text-white text-[13px] font-semibold">0</span>
          </div>

          {/* Pending Response Confirmation */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF832B]"></div>
            <span className="text-white text-[13px] font-normal">Pending Response Confirmation:</span>
            <span className="text-white text-[13px] font-semibold">0</span>
          </div>

          {/* Responded Today */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#D12771]"></div>
            <span className="text-white text-[13px] font-normal">Responded Today:</span>
            <span className="text-white text-[13px] font-semibold">0</span>
          </div>
        </div>

      </div>
    </div>
  );
}