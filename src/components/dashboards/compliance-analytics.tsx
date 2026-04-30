import { motion } from "motion/react";
import {
  FileText,
  AlertTriangle,
  Clock,
  Calendar as CalendarIcon,
  Download,
  ChevronDown,
  MoreHorizontal,
  Search,
  Globe,
  Banknote,
  TrendingUp,
  Target,
  FileWarning,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  Activity,
  ShieldAlert,
  ListChecks
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Treemap
} from "recharts";
import { cn } from "../ui/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useSortableData } from "../../hooks/use-sortable-data";
import { SortableHeader } from "../ui/sortable-header";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface ComplianceAnalyticsProps {
  breadcrumbs?: BreadcrumbItem[];
  onBreadcrumbNavigate?: (path: string) => void;
}

export function ComplianceAnalytics({ breadcrumbs, onBreadcrumbNavigate }: ComplianceAnalyticsProps) {
  // 1. KPI Data (Corrected for Consistency)
  const kpiData = [
    { title: "Total Reports (MTD)", value: "4,855", subValue: "+12.5% vs last month", change: "+12.5%", trend: "up", icon: FileText, colorIdx: 0 },
    { title: "Total Reports (YTD)", value: "52,847", subValue: "On track for yearly target", change: "+5.2%", trend: "up", icon: Layers, colorIdx: 2 },
    { title: "Approaching Deadline", value: "147", subValue: "Due within 48 hours", change: "Critical", trend: "down", icon: Clock, colorIdx: 3 },
    { title: "Filing Precision", value: "99.2%", subValue: "Target: 99.5%", change: "-0.3%", trend: "down", icon: Target, colorIdx: 1 },
    { title: "Pending Reports", value: "25", subValue: "Needs immediate action", change: "-5", trend: "up", icon: AlertTriangle, colorIdx: 3 },
    { title: "Avg Days to File", value: "2.4", subValue: "Benchmark: 3 Days", change: "-0.6", trend: "up", icon: CalendarIcon, colorIdx: 0 }
  ];

  // 2. Report Type Summaries (Sum = 4,855)
  const typeSummaries = [
    { label: "CTR", total: "3,150", filed: "3,140", pending: "10", rate: "99.7%", color: "blue" },
    { label: "CBWTR", total: "1,420", filed: "1,415", pending: "5", rate: "99.6%", color: "emerald" },
    { label: "STR", total: "180", filed: "172", pending: "8", rate: "95.5%", color: "amber" },
    { label: "NTR", total: "70", filed: "68", pending: "2", rate: "97.1%", color: "violet" },
    { label: "CCR", total: "35", filed: "35", pending: "0", rate: "100%", color: "pink" },
  ];

  // 3. Trend Data
  const reportTrends = [
    { month: "Jan", CTR: 2900, STR: 110, CBWTR: 1200 },
    { month: "Feb", CTR: 3000, STR: 125, CBWTR: 1300 },
    { month: "Mar", CTR: 2850, STR: 115, CBWTR: 1250 },
    { month: "Apr", CTR: 3100, STR: 140, CBWTR: 1350 },
    { month: "May", CTR: 3120, STR: 155, CBWTR: 1380 },
    { month: "Jun", CTR: 3150, STR: 180, CBWTR: 1420 },
  ];

  const reportDistribution = [
    { name: "CTR", value: 64.9, color: "#3b82f6" }, 
    { name: "CBWTR", value: 29.2, color: "#10b981" }, 
    { name: "STR", value: 3.7, color: "#f59e0b" }, 
    { name: "NTR", value: 1.4, color: "#8b5cf6" }, 
    { name: "CCR", value: 0.8, color: "#ec4899" }, 
  ];

  // 4. Timeliness & Quality
  const filingTimeliness = [
    { type: "CTR", days: 99.5, target: 98 },
    { type: "STR", days: 96.2, target: 95 },
    { type: "CBWTR", days: 99.8, target: 98 },
    { type: "NTR", days: 94.5, target: 95 },
    { type: "CCR", days: 100.0, target: 98 },
  ];

  const avgDaysToFile = [
    { type: "CTR", days: 1.8, benchmark: 3 },
    { type: "STR", days: 5.5, benchmark: 7 },
    { type: "CBWTR", days: 1.2, benchmark: 3 },
    { type: "NTR", days: 6.2, benchmark: 15 },
    { type: "CCR", days: 2.1, benchmark: 3 },
  ];

  const qualityScore = [
    { type: "CTR", score: 99, target: 98 },
    { type: "STR", score: 94, target: 92 },
    { type: "CBWTR", score: 98, target: 95 },
    { type: "NTR", score: 95, target: 90 },
    { type: "CCR", score: 99, target: 95 },
  ];

  // 5. STR Analysis
  const strActivity = [
    { activity: "Structuring", count: 45 },
    { activity: "Smurfing", count: 32 },
    { activity: "High Value Cash", count: 28 },
    { activity: "Terror Financing", count: 12 },
    { activity: "Tax Evasion", count: 18 },
    { activity: "Other", count: 45 },
  ];

  const strProduct = [
    { name: "Savings", size: 400, fill: "#f59e0b" },
    { name: "Current", size: 300, fill: "#fbbf24" },
    { name: "Loans", size: 300, fill: "#fcd34d" },
    { name: "Forex", size: 200, fill: "#fde68a" },
    { name: "Trade", size: 100, fill: "#fef3c7" },
  ];

  const strTypeData = [
    { name: "Initial", value: 155, color: "#f97316" },
    { name: "Continuing", value: 25, color: "#fdba74" }
  ];

  // 6. CBWTR Analysis
  const cbwtrCountries = [
    { country: "USA", value: 450, risk: "Low" },
    { country: "UAE", value: 380, risk: "Medium" },
    { country: "UK", value: 320, risk: "Low" },
    { country: "Singapore", value: 290, risk: "Low" },
    { country: "Hong Kong", value: 250, risk: "Medium" },
    { country: "China", value: 180, risk: "High" },
    { country: "Australia", value: 150, risk: "Low" },
    { country: "Canada", value: 120, risk: "Low" },
    { country: "Germany", value: 90, risk: "Low" },
    { country: "Nigeria", value: 45, risk: "High" },
  ];

  // 7. CTR & CCR Analysis
  const ctrAmountBand = [
    { range: "10L-20L", count: 1450 },
    { range: "20L-50L", count: 920 },
    { range: "50L-1Cr", count: 580 },
    { range: ">1Cr", count: 200 },
  ];

  const ctrTxnType = [
    { type: "Deposit", count: 1850, color: "#3b82f6" },
    { type: "Withdrawal", count: 950, color: "#60a5fa" },
    { type: "Exchange", count: 350, color: "#93c5fd" },
  ];

  const ccrDenomination = [
    { note: "500", count: 150 },
    { note: "200", count: 85 },
    { note: "100", count: 45 },
    { note: "2000", count: 20 },
    { note: "50", count: 15 },
  ];

  // 8. NTR & Heatmap
  const ntrOrgType = [
    { name: "Charity", value: 40, color: "#8b5cf6" },
    { name: "NGO", value: 30, color: "#a78bfa" },
    { name: "Religious", value: 20, color: "#c4b5fd" },
    { name: "Trust", value: 10, color: "#ddd6fe" },
  ];

  const riskHeatmap = [
    { type: "CTR", timeliness: 1, quality: 1, volume: 3, highRisk: 1, backlog: 1 },
    { type: "STR", timeliness: 2, quality: 2, volume: 2, highRisk: 3, backlog: 2 },
    { type: "CBWTR", timeliness: 1, quality: 1, volume: 3, highRisk: 2, backlog: 1 },
    { type: "NTR", timeliness: 2, quality: 1, volume: 1, highRisk: 3, backlog: 2 },
    { type: "CCR", timeliness: 1, quality: 1, volume: 1, highRisk: 2, backlog: 1 },
  ];

  // 9. Calendar
  const calendarDates = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    hasEvent: [5, 12, 15, 20, 25, 30].includes(i + 1),
    type: [5, 15, 25].includes(i + 1) ? "CTR" : [12, 30].includes(i + 1) ? "STR" : "NTR"
  }));

  const pendingChecklist = [
    { stage: "Data Validation", count: 12, color: "#ef4444" },
    { stage: "L1 Review", count: 8, color: "#f97316" },
    { stage: "L2 Review", count: 4, color: "#eab308" },
    { stage: "Final Approval", count: 1, color: "#10b981" },
  ];

  // 10. Amendment & Rejection
  const amendmentTrend = [
    { month: "Jan", CTR: 0.8, STR: 1.5, CBWTR: 0.5 },
    { month: "Feb", CTR: 0.9, STR: 1.2, CBWTR: 0.6 },
    { month: "Mar", CTR: 1.1, STR: 1.8, CBWTR: 0.8 },
    { month: "Apr", CTR: 1.0, STR: 1.4, CBWTR: 0.5 },
    { month: "May", CTR: 0.7, STR: 1.1, CBWTR: 0.4 },
    { month: "Jun", CTR: 0.5, STR: 0.9, CBWTR: 0.3 },
  ];

  const rejectionAnalysis = [
    { reason: "Schema", current: 5, previous: 8 },
    { reason: "ID Error", current: 3, previous: 5 },
    { reason: "Missing Info", current: 4, previous: 6 },
    { reason: "Duplicate", current: 1, previous: 3 },
    { reason: "Sanction", current: 2, previous: 4 },
  ];

  // 11. Recent Submissions
  const recentSubmissions = [
    { id: "RPT-2025-0892", type: "CTR", subDate: "Jan 18, 2025", status: "Filed", records: 1250, amount: "4.2 Cr", analyst: "Priya S.", time: "1.5 days" },
    { id: "RPT-2025-0891", type: "STR", subDate: "Jan 18, 2025", status: "Pending L2", records: 1, amount: "-", analyst: "Rajesh K.", time: "4.0 days" },
    { id: "RPT-2025-0890", type: "CBWTR", subDate: "Jan 17, 2025", status: "Filed", records: 450, amount: "1.2 Cr", analyst: "Amit P.", time: "1.0 day" },
    { id: "RPT-2025-0889", type: "NTR", subDate: "Jan 17, 2025", status: "Rejected", records: 12, amount: "45 L", analyst: "Vikram S.", time: "2.5 days" },
    { id: "RPT-2025-0888", type: "CTR", subDate: "Jan 16, 2025", status: "Filed", records: 1100, amount: "3.8 Cr", analyst: "Priya S.", time: "1.8 days" },
  ];

  const getRiskColor = (level: number) => {
    if (level === 3) return "bg-red-500";
    if (level === 2) return "bg-orange-400";
    return "bg-green-500";
  };

  const { items: sortedPending, requestSort: sortPending, sortConfig: pendingConfig } = useSortableData(pendingChecklist);
  const { items: sortedSubmissions, requestSort: sortSubmissions, sortConfig: submissionsConfig } = useSortableData(recentSubmissions);

  const { items: sortedHeatmap, requestSort: sortHeatmap, sortConfig: heatmapConfig } = useSortableData(riskHeatmap);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Regulatory Reporting Dashboard</h1>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />
            <Select defaultValue="all-regions">
               <SelectTrigger className="w-[180px] h-[46px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-lg hover:border-[#2A53A0] dark:hover:border-[#6b93e6] transition-all shadow-sm">
                  <SelectValue placeholder="Select Region" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all-regions">All Regions</SelectItem>
                  <SelectItem value="north">North Zone</SelectItem>
                  <SelectItem value="south">South Zone</SelectItem>
                  <SelectItem value="east">East Zone</SelectItem>
                  <SelectItem value="west">West Zone</SelectItem>
               </SelectContent>
            </Select>
           <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />
           <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="hidden sm:inline">Updated: Just now</span>
              <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-[#2A53A0] dark:text-[#6b93e6]">
                <RefreshCw className="size-4" />
              </motion.button>
           </div>
         </div>
         <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 h-[46px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-[#2A53A0] dark:hover:border-[#6b93e6] transition-all shadow-sm">
             <CalendarIcon className="size-4 text-[#2A53A0] dark:text-[#6b93e6]" />
             <span className="text-sm text-gray-700 dark:text-gray-300">Last 6 Months</span>
             <ChevronDown className="size-4 text-gray-500" />
           </button>
           <button className="flex items-center gap-2 px-4 h-[46px] bg-[#2A53A0] hover:bg-[#1e3a70] dark:bg-[#6b93e6] dark:hover:bg-[#5577cc] text-white rounded-lg transition-all shadow-sm">
             <span className="text-sm">Export</span>
             <Download className="size-4" />
           </button>
         </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const colorMap = {
            0: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
            1: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400" },
            2: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400" },
            3: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
          } as Record<number, { bg: string, text: string }>;
          const colors = colorMap[kpi.colorIdx] || colorMap[0];
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm h-full flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`size-4 ${colors.text}`} />
                  </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{kpi.value}</h3>
                    <p className="text-xs text-gray-500 font-medium truncate">{kpi.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <span className={cn("text-[10px] font-bold", kpi.trend === 'up' && kpi.colorIdx !== 3 ? 'text-green-600' : 'text-red-600')}>{kpi.change}</span>
                        {kpi.subValue && <span className="text-[9px] text-gray-400 truncate hidden xl:inline">{kpi.subValue.replace('vs last month', '')}</span>}
                    </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Row 2: Report Type Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
         {typeSummaries.map((type, i) => (
            <Card key={i} className={`p-4 border-l-4 shadow-sm`} style={{ borderLeftColor: `var(--color-${type.color}-500)` }}>
               <div className="flex justify-between items-start">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded bg-${type.color}-50 text-${type.color}-700 border border-${type.color}-100`}>
                     {type.label}
                  </span>
                  <Badge className="bg-[#f0f4f9] text-[#2A53A0] border-0 font-bold px-2 h-[28px] text-[10px] flex items-center justify-center uppercase">{type.rate}</Badge>
               </div>
               <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                     <span className="text-[10px] text-gray-500 block">Total (MTD)</span>
                     <span className="text-lg font-bold text-gray-900 dark:text-white">{type.total}</span>
                  </div>
                  <div className="text-right">
                      <span className="text-[10px] text-gray-500 block">Pending</span>
                      <span className="text-lg font-bold text-orange-600">{type.pending}</span>
                  </div>
               </div>
               <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
                  <div className={`h-full bg-${type.color}-500`} style={{ width: type.rate }}></div>
               </div>
            </Card>
         ))}
      </div>

      {/* Row 3: Trend & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Report Filing Trend</h3>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={reportTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCTR" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCBWTR" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="month" tick={{fontSize: 11}} />
                        <YAxis tick={{fontSize: 11}} />
                        <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                        <Area type="monotone" dataKey="CTR" stackId="1" stroke="#3b82f6" fill="url(#colorCTR)" />
                        <Area type="monotone" dataKey="CBWTR" stackId="1" stroke="#10b981" fill="url(#colorCBWTR)" />
                        <Area type="monotone" dataKey="STR" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <PieChartIcon className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Report Distribution</h3>
                    </div>
                </div>
                <div className="relative h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={reportDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {reportDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className="text-3xl font-bold text-gray-900 dark:text-white">57K</span>
                       <span className="text-xs text-gray-500">Total</span>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    {reportDistribution.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                            </div>
                            <span className="font-medium">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
      </div>

      {/* Row 4: Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Filing Timeliness</h3>
                </div>
                <div className="space-y-4">
                    {filingTimeliness.map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{item.type}</span>
                                <span className={item.days >= item.target ? "text-green-600" : "text-red-600"}>{item.days}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className={cn("h-1.5 rounded-full", item.days >= item.target ? "bg-emerald-500" : "bg-red-500")} style={{ width: `${item.days}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </Card>

         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Avg Days to File</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={avgDaysToFile}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="type" tick={{fontSize: 10}} />
                        <YAxis tick={{fontSize: 10}} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{fontSize: '11px'}} />
                        <Bar dataKey="days" fill="#10b981" radius={[4,4,0,0]} barSize={20}>
                            {avgDaysToFile.map((entry, index) => (
                                <Cell key={index} fill={entry.days > entry.benchmark ? "#ef4444" : "#10b981"} />
                            ))}
                        </Bar>
                        <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </Card>

         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Quality Score</h3>
                </div>
                <div className="space-y-4">
                    {qualityScore.map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{item.type}</span>
                                <span className="text-gray-500">{item.score}/100</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 relative">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${item.score}%` }}></div>
                                <div className="absolute top-[-2px] w-0.5 h-2.5 bg-black" style={{ left: `${item.target}%` }}></div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end text-[10px] text-gray-400 gap-2">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Score</span>
                        <span className="flex items-center gap-1"><div className="w-0.5 h-2 bg-black"></div> Target</span>
                    </div>
                </div>
            </div>
         </Card>
      </div>

      {/* Row 5: STR Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="p-6">
                 <div className="flex items-center gap-2 mb-6">
                     <Activity className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">STR Activity</h3>
                 </div>
                 <ResponsiveContainer width="100%" height={200}>
                     <BarChart data={strActivity} layout="vertical">
                         <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                         <XAxis type="number" hide />
                         <YAxis dataKey="activity" type="category" width={110} tick={{fontSize: 10}} />
                         <Tooltip cursor={{fill: 'transparent'}} />
                         <Bar dataKey="count" fill="#f97316" radius={[0,4,4,0]} barSize={16} />
                     </BarChart>
                 </ResponsiveContainer>
             </div>
         </Card>

         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="p-6">
                 <div className="flex items-center gap-2 mb-6">
                     <Banknote className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">STR by Product</h3>
                 </div>
                 <ResponsiveContainer width="100%" height={200}>
                     <Treemap data={strProduct} dataKey="size" aspectRatio={4/3} stroke="#fff" fill="#f59e0b" content={<CustomTreemapContent />} />
                 </ResponsiveContainer>
             </div>
         </Card>

         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="p-6">
                 <div className="flex items-center gap-2 mb-6">
                     <RefreshCw className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Initial vs Continuing</h3>
                 </div>
                 <div className="flex items-center justify-center h-[200px]">
                     <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                             <Pie data={strTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                                 {strTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                             </Pie>
                             <Tooltip />
                             <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{fontSize: '10px'}}/>
                         </PieChart>
                     </ResponsiveContainer>
                 </div>
             </div>
         </Card>
      </div>

      {/* Row 6: CBWTR Analysis */}
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
         <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
                <Globe className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                <h3 className="text-gray-900 dark:text-white font-semibold text-lg">CBWTR: Top Destinations</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cbwtrCountries} layout="vertical" margin={{left: 20}}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                    <XAxis type="number" fontSize={10} />
                    <YAxis dataKey="country" type="category" width={80} tick={{fontSize: 11}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Legend wrapperStyle={{fontSize: '10px'}} />
                    <Bar dataKey="value" name="Volume" radius={[0,4,4,0]} barSize={20}>
                        {cbwtrCountries.map((entry, index) => (
                            <Cell key={index} fill={entry.risk === "High" ? "#ef4444" : entry.risk === "Medium" ? "#f59e0b" : "#10b981"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-[10px] mt-2">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Low Risk</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Medium Risk</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> High Risk</span>
            </div>
         </div>
      </Card>

      {/* Row 7: CTR & CCR Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         {/* CTR */}
         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="p-6">
                 <div className="flex items-center gap-2 mb-6">
                     <FileText className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Cash Transaction Reports (CTR)</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                         <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">CTR by Amount Band</h4>
                         <ResponsiveContainer width="100%" height={150}>
                             <BarChart data={ctrAmountBand}>
                                 <XAxis dataKey="range" tick={{fontSize: 9}} />
                                 <Tooltip />
                                 <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                     <div>
                         <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">CTR by Transaction Type</h4>
                         <div className="space-y-3 pt-2">
                             {ctrTxnType.map((item, i) => (
                                 <div key={i}>
                                     <div className="flex justify-between text-[10px] mb-1">
                                         <span>{item.type}</span>
                                         <span>{item.count}</span>
                                     </div>
                                     <div className="w-full bg-gray-100 h-1.5 rounded-full">
                                         <div className="h-1.5 rounded-full" style={{ width: `${(item.count/2000)*100}%`, backgroundColor: item.color }}></div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
                 <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-3">
                     <div className="p-2 bg-orange-100 rounded-full text-orange-600"><AlertTriangle className="size-4" /></div>
                     <div>
                         <h4 className="text-xs font-bold text-orange-900">Structuring Alert</h4>
                         <p className="text-[10px] text-orange-700">67 transactions detected just below threshold (9.5L - 9.9L)</p>
                     </div>
                 </div>
             </div>
         </Card>

         {/* CCR */}
         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="p-6">
                 <div className="flex items-center gap-2 mb-6">
                     <FileWarning className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Counterfeit Currency Reports</h3>
                 </div>
                 <div className="flex justify-between items-start mb-6">
                     <div>
                         <span className="text-xs text-gray-500 block">Total Face Value Detected</span>
                         <span className="text-2xl font-bold text-gray-900">$127,100</span>
                     </div>
                     <Badge variant="outline" className="text-purple-600 bg-purple-50">+12% vs last month</Badge>
                 </div>
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Note Denomination</h4>
                 <div className="space-y-3 mb-6">
                     {ccrDenomination.map((item, i) => (
                         <div key={i} className="flex items-center gap-2">
                             <span className="text-[10px] w-8">{item.note}</span>
                             <div className="flex-1 bg-gray-100 h-1.5 rounded-full">
                                 <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${(item.count/150)*100}%` }}></div>
                             </div>
                             <span className="text-[10px] w-6 text-right">{item.count}</span>
                         </div>
                     ))}
                 </div>
             </div>
         </Card>
      </div>

      {/* Row 8: NTR & Risk Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="p-6">
                 <div className="flex items-center gap-2 mb-6">
                     <ShieldAlert className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Non-Profit Reports (NTR)</h3>
                 </div>
                 <div className="flex flex-col md:flex-row gap-6 items-center">
                     <div className="w-32 h-32 flex-shrink-0">
                         <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                 <Pie data={ntrOrgType} innerRadius={25} outerRadius={40} dataKey="value">
                                     {ntrOrgType.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                 </Pie>
                                 <Tooltip />
                             </PieChart>
                         </ResponsiveContainer>
                     </div>
                     <div className="flex-1 w-full">
                         <div className="grid grid-cols-2 gap-3 mb-4">
                             {ntrOrgType.map((item, i) => (
                                 <div key={i} className="flex items-center gap-2 text-xs">
                                     <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}} />
                                     <span>{item.name}: {item.value}%</span>
                                 </div>
                             ))}
                         </div>
                         <div className="flex gap-2">
                             <div className="flex-1 p-2 bg-red-50 border border-red-100 rounded text-center">
                                 <span className="block text-lg font-bold text-red-700">23</span>
                                 <span className="text-[10px] text-red-500">High Risk NPOs</span>
                             </div>
                             <div className="flex-1 p-2 bg-blue-50 border border-blue-100 rounded text-center">
                                  <span className="block text-lg font-bold text-blue-700">4</span>
                                  <span className="text-[10px] text-blue-500">Sanction Hits</span>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </Card>

         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="p-6">
                 <div className="flex items-center gap-2 mb-6">
                     <Activity className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Regulatory Risk Heatmap</h3>
                 </div>
                 <div className="overflow-x-auto">
                     <table className="w-full text-xs">
                         <thead>
                             <tr className="text-gray-500 border-b border-gray-100">
                                 <th className="text-left py-2"><SortableHeader column="type" label="TYPE" sortConfig={heatmapConfig} onSort={sortHeatmap} /></th>
                                 <th className="text-center py-2"><SortableHeader column="timeliness" label="TIMELINESS" sortConfig={heatmapConfig} onSort={sortHeatmap} className="justify-center" /></th>
                                 <th className="text-center py-2"><SortableHeader column="quality" label="QUALITY" sortConfig={heatmapConfig} onSort={sortHeatmap} className="justify-center" /></th>
                                 <th className="text-center py-2"><SortableHeader column="volume" label="VOLUME" sortConfig={heatmapConfig} onSort={sortHeatmap} className="justify-center" /></th>
                                 <th className="text-center py-2"><SortableHeader column="highRisk" label="RISK" sortConfig={heatmapConfig} onSort={sortHeatmap} className="justify-center" /></th>
                             </tr>
                         </thead>
                         <tbody>
                             {sortedHeatmap.map((row, i) => (
                                 <tr key={i} className="border-b border-gray-50 last:border-0">
                                     <td className="font-bold py-2">{row.type}</td>
                                     <td className="p-1"><div className={cn("h-6 w-full rounded", getRiskColor(row.timeliness))}></div></td>
                                     <td className="p-1"><div className={cn("h-6 w-full rounded", getRiskColor(row.quality))}></div></td>
                                     <td className="p-1"><div className={cn("h-6 w-full rounded", getRiskColor(row.volume))}></div></td>
                                     <td className="p-1"><div className={cn("h-6 w-full rounded", getRiskColor(row.highRisk))}></div></td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
         </Card>
      </div>

      {/* Row 9: Calendar & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                      <CalendarIcon className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                      <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Regulatory Calendar</h3>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="text-gray-400 py-1">{d}</div>)}
                      {calendarDates.map((date, i) => (
                          <div key={i} className={cn("h-8 flex items-center justify-center rounded relative", 
                              date.hasEvent ? "bg-blue-50 text-blue-700 font-bold cursor-pointer hover:bg-blue-100" : "text-gray-600"
                          )}>
                              {date.day}
                              {date.hasEvent && (
                                  <div className={cn("absolute bottom-0.5 w-1 h-1 rounded-full", 
                                      date.type === "CTR" ? "bg-blue-500" : date.type === "STR" ? "bg-orange-500" : "bg-purple-500"
                                  )}></div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                      <ListChecks className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                      <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Pending Checklist</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={pendingChecklist}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                          <XAxis dataKey="stage" tick={{fontSize: 10}} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="count" radius={[4,4,0,0]} barSize={40}>
                              {pendingChecklist.map((entry, index) => (
                                  <Cell key={index} fill={entry.color} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </Card>
      </div>

      {/* Row 10: Amendment & Rejection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                      <RefreshCw className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                      <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Amendment Rate</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={amendmentTrend}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="month" tick={{fontSize: 10}} />
                          <Tooltip />
                          <Legend wrapperStyle={{fontSize: '10px'}} />
                          <Line type="monotone" dataKey="CTR" stroke="#3b82f6" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="STR" stroke="#f97316" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="CBWTR" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                      <Ban className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                      <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Rejection Analysis</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={rejectionAnalysis}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                          <XAxis dataKey="reason" tick={{fontSize: 10}} />
                          <Tooltip />
                          <Legend wrapperStyle={{fontSize: '10px'}} />
                          <Bar dataKey="current" name="Current Month" fill="#3b82f6" radius={[4,4,0,0]} />
                          <Bar dataKey="previous" name="Previous Month" fill="#93c5fd" radius={[4,4,0,0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </Card>
      </div>

      {/* Row 11: Recent Submissions Table */}
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
         <div className="p-6">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <FileText className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Recent Report Submissions</h3>
               </div>
               <div className="flex gap-2">
                   <div className="relative">
                       <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
                       <input type="text" placeholder="Search..." className="h-8 pl-8 pr-3 text-xs border rounded-md" />
                   </div>
                   <Button variant="outline" size="sm" className="h-8 text-xs">Filter</Button>
                   <Button size="sm" className="h-8 text-xs bg-[#2A53A0]">Export</Button>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500">
                     <tr>
                        <th className="px-4 py-3 font-bold"><SortableHeader column="id" label="Report ID" sortConfig={submissionsConfig} onSort={sortSubmissions} /></th>
                        <th className="px-4 py-3 font-bold"><SortableHeader column="type" label="Type" sortConfig={submissionsConfig} onSort={sortSubmissions} /></th>
                        <th className="px-4 py-3 font-bold"><SortableHeader column="subDate" label="Submission Date" sortConfig={submissionsConfig} onSort={sortSubmissions} /></th>
                        <th className="px-4 py-3 font-bold"><SortableHeader column="status" label="Status" sortConfig={submissionsConfig} onSort={sortSubmissions} /></th>
                        <th className="px-4 py-3 font-bold text-right"><SortableHeader column="records" label="Records" sortConfig={submissionsConfig} onSort={sortSubmissions} className="justify-end" /></th>
                        <th className="px-4 py-3 font-bold text-right"><SortableHeader column="amount" label="Amount" sortConfig={submissionsConfig} onSort={sortSubmissions} className="justify-end" /></th>
                        <th className="px-4 py-3 font-bold"><SortableHeader column="analyst" label="Analyst" sortConfig={submissionsConfig} onSort={sortSubmissions} /></th>
                        <th className="px-4 py-3 font-bold"><SortableHeader column="time" label="Time to File" sortConfig={submissionsConfig} onSort={sortSubmissions} /></th>
                        <th className="px-4 py-3 font-bold text-right">Options</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {sortedSubmissions.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                           <td className="px-4 py-3 font-medium text-[#2A53A0]">{row.id}</td>
                           <td className="px-4 py-3">
                               <Badge variant="outline" className={cn("text-[10px]", 
                                   row.type === "CTR" ? "text-blue-600 bg-blue-50 border-blue-200" :
                                   row.type === "STR" ? "text-orange-600 bg-orange-50 border-orange-200" :
                                   row.type === "NTR" ? "text-purple-600 bg-purple-50 border-purple-200" :
                                   "text-green-600 bg-green-50 border-green-200"
                               )}>{row.type}</Badge>
                           </td>
                           <td className="px-4 py-3 text-gray-600">{row.subDate}</td>
                           <td className="px-4 py-3">
                              <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border",
                                 row.status === "Filed" ? "bg-green-50 text-green-700 border-green-200" :
                                 row.status === "Pending L2" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                 "bg-red-50 text-red-700 border-red-200"
                              )}>
                                 {row.status}
                              </span>
                           </td>
                           <td className="px-4 py-3 text-right text-gray-900 font-medium">{row.records}</td>
                           <td className="px-4 py-3 text-right text-gray-900">{row.amount}</td>
                           <td className="px-4 py-3 text-gray-600">{row.analyst}</td>
                           <td className="px-4 py-3 text-gray-600">{row.time}</td>
                           <td className="px-4 py-3 text-right">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                 <MoreHorizontal className="size-3 text-gray-400" />
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </Card>
      
      <div className="h-8"></div>
    </motion.div>
  );
}

const CustomTreemapContent = (props: any) => {
    const { x, y, width, height, name, value } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: props.fill,
            stroke: "#fff",
            strokeWidth: 2 / (props.depth + 1e-10),
            strokeOpacity: 1 / (props.depth + 1e-10),
          }}
        />
        {width > 30 && height > 30 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 5}
            textAnchor="middle"
            fill="#fff"
            fontSize={10}
            fontWeight="bold"
          >
            {name}
          </text>
        )}
      </g>
    );
  };

// Add missing Ban icon import if not present or replace with closest like XCircle
import { Ban } from "lucide-react";
