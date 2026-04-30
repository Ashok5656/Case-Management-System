import { motion } from "motion/react";
import {
  Users,
  CheckSquare,
  Briefcase,
  ShieldAlert,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Bell,
  Search,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  Globe,
  RefreshCw as Renew,
  Sparkles,
  Server,
  Activity,
  Shield,
  Brain,
  CheckCircle2,
  UserCheck
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area
} from "recharts";
import { cn } from "../ui/utils";
import { useSortableData } from "../../hooks/use-sortable-data";
import { SortableHeader } from "../ui/sortable-header";

interface OperationalMetricsProps {
  breadcrumbs?: any[];
  onBreadcrumbNavigate?: (path: string) => void;
}

export function OperationalMetrics({ breadcrumbs, onBreadcrumbNavigate }: OperationalMetricsProps) {
  // 1. KPI Data
  const kpiData = [
    {
      title: "Team Queue",
      value: "847",
      subValue: "Alerts: 623 | Cases: 224",
      change: "+2.2%",
      trend: "down", // "down" visually means bad/red for queue usually? But arrow direction matters.
      // User dashboard uses 'trend: "down"' + badge color.
      // Let's match user dashboard logic.
      icon: Users,
      colorIdx: 0
    },
    {
      title: "Closed Today",
      value: "156",
      subValue: "Target: 180 (87%)",
      change: "87% Target",
      trend: "neutral",
      icon: CheckSquare,
      colorIdx: 1
    },
    {
      title: "SLA Compliance",
      value: "91.3%",
      subValue: "Target 95%",
      change: "-3.7%",
      trend: "down",
      icon: Clock,
      colorIdx: 3 // Orange
    },
    {
      title: "QA Pass Rate",
      value: "96.2%",
      subValue: "Excellent quality",
      change: "+1.2%",
      trend: "up",
      icon: CheckCircle,
      colorIdx: 1 // Green
    }
  ];

  // 2. Workload Distribution
  const workloadData = [
    { name: "Priya S.", open: 12, inProgress: 18, pending: 5 },
    { name: "Amit P.", open: 15, inProgress: 22, pending: 8 },
    { name: "Sanjay K.", open: 10, inProgress: 15, pending: 4 },
    { name: "Neha S.", open: 18, inProgress: 20, pending: 6 },
    { name: "Rajesh V.", open: 14, inProgress: 16, pending: 7 },
    { name: "Anjali D.", open: 11, inProgress: 14, pending: 3 },
    { name: "Vikram R.", open: 16, inProgress: 24, pending: 9 },
    { name: "Kavita N.", open: 9, inProgress: 12, pending: 4 },
  ];

  // 3. Queue Aging Heatmap
  const heatmapData = [
    { priority: "Critical", d0_2: 8, d3_5: 12, d6_10: 18, d10plus: 5 },
    { priority: "High", d0_2: 25, d3_5: 32, d6_10: 29, d10plus: 15 },
    { priority: "Medium", d0_2: 45, d3_5: 52, d6_10: 38, d10plus: 22 },
    { priority: "Low", d0_2: 63, d3_5: 82, d6_10: 55, d10plus: 36 },
  ];

  const { items: sortedHeatmap, requestSort: sortHeatmap, sortConfig: heatmapSortConfig } = useSortableData(heatmapData);

  // 4. Leaderboard
  const leaderboardData = [
    { rank: 1, name: "Priya Sharma", closed: 42, tat: "6.2h", quality: "98%", score: 95 },
    { rank: 2, name: "Amit Patel", closed: 38, tat: "8.5h", quality: "96%", score: 92 },
    { rank: 3, name: "Neha Singh", closed: 36, tat: "8.8h", quality: "97%", score: 90 },
    { rank: 4, name: "Vikram Reddy", closed: 34, tat: "9.5h", quality: "95%", score: 88 },
    { rank: 5, name: "Rajesh Verma", closed: 32, tat: "10.2h", quality: "84%", score: 85 },
  ];

  // 5. Breach Analysis
  const breachData = [
    { date: "Dec 18", count: 8, rate: 5 },
    { date: "Dec 19", count: 12, rate: 8.5 },
    { date: "Dec 20", count: 6, rate: 4 },
    { date: "Dec 21", count: 9, rate: 6 },
    { date: "Dec 22", count: 5, rate: 3 },
    { date: "Dec 23", count: 14, rate: 10.5 },
    { date: "Dec 24", count: 7, rate: 5 },
    { date: "Dec 25", count: 4, rate: 2 },
    { date: "Dec 26", count: 8, rate: 6 },
    { date: "Dec 27", count: 10, rate: 7 },
    { date: "Dec 28", count: 6, rate: 4 },
    { date: "Dec 29", count: 9, rate: 6 },
    { date: "Dec 30", count: 7, rate: 5 },
    { date: "Dec 31", count: 11, rate: 8 },
  ];

  // 6. At Risk
  const atRiskItems = [
    { id: "AML-4521", severity: "Critical", time: "1h 25m", user: "Priya S.", action: "Escalate" },
    { id: "AML-4522", severity: "High", time: "1h 45m", user: "Amit P.", action: "Escalate" },
    { id: "AML-4524", severity: "High", time: "2h 25m", user: "Vikram R.", action: "Escalate" },
    { id: "AML-4527", severity: "High", time: "3h 50m", user: "Kavita N.", action: "Escalate" },
    { id: "AML-4505", severity: "Medium", time: "3h 40m", user: "Rajesh V.", action: "Escalate" },
    { id: "AML-4506", severity: "Medium", time: "4h 15m", user: "Sanjay K.", action: "Escalate" },
  ];

  // 7. QA Summary
  const qaPieData = [
    { name: "Pass", value: 112, color: "#10b981" },
    { name: "Fail", value: 8, color: "#ef4444" },
    { name: "Pending", value: 4, color: "#f59e0b" },
  ];
  const qaErrorData = [
    { name: "Docs", value: 12 },
    { name: "Sanction", value: 8 },
    { name: "Policy", value: 5 },
    { name: "Data", value: 3 },
  ];

  // 8. Alerts
  const alerts = [
    { type: "success", title: "ACHIEVEMENT", time: "5 min ago", message: "Priya Sharma completed 20 cases today" },
    { type: "info", title: "INFO", time: "18 min ago", message: "2 cases escalated by Amit Patel" },
    { type: "warning", title: "WARNING", time: "26 min ago", message: "SLA breach for case AML-4521" },
    { type: "error", title: "ALERT", time: "45 min ago", message: "New high-priority alert assigned to Team Alpha" },
    { type: "success", title: "ACHIEVEMENT", time: "1 hour ago", message: "Team achieved 98% QA pass rate this week" },
  ];

  // 9. Detailed Performance
  const detailedPerformance = [
    { name: "Priya Sharma", status: "Online", queue: 82, today: 18, week: 126, avgTat: "6.2h", sla: "98.5%", qa: "98%", trend: "up" },
    { name: "Amit Patel", status: "Online", queue: 85, today: 15, week: 112, avgTat: "9.1h", sla: "94.2%", qa: "96%", trend: "up" },
    { name: "Sanjay Kumar", status: "Break", queue: 77, today: 12, week: 98, avgTat: "9.5h", sla: "92.1%", qa: "95%", trend: "stable" },
    { name: "Neha Singh", status: "Online", queue: 82, today: 16, week: 108, avgTat: "8.8h", sla: "96.8%", qa: "97%", trend: "up" },
    { name: "Rajesh Verma", status: "Online", queue: 88, today: 14, week: 102, avgTat: "10.2h", sla: "90.5%", qa: "84%", trend: "stable" },
    { name: "Anjali Desai", status: "Offline", queue: 66, today: 11, week: 89, avgTat: "9.5h", sla: "93.2%", qa: "96%", trend: "up" },
    { name: "Vikram Reddy", status: "Online", queue: 92, today: 17, week: 118, avgTat: "9.5h", sla: "94.8%", qa: "95%", trend: "stable" },
    { name: "Kavita Nair", status: "Online", queue: 80, today: 13, week: 95, avgTat: "10.0h", sla: "91.8%", qa: "93%", trend: "down" },
  ];

  const { items: sortedDetailed, requestSort: sortDetailed, sortConfig: detailedConfig } = useSortableData(detailedPerformance);

  const getHeatmapColor = (value: number) => {
    if (value > 50) return "bg-red-200 text-red-900";
    if (value > 30) return "bg-orange-200 text-orange-900";
    if (value > 15) return "bg-yellow-100 text-yellow-900";
    return "bg-green-50 text-green-900";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         {/* Left Side: Context Controls */}
         <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Operations Dashboard</h1>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />
            <Select defaultValue="team-alpha">
               <SelectTrigger className="w-[180px] h-[46px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-lg hover:border-[#2A53A0] dark:hover:border-[#6b93e6] transition-all shadow-sm">
                  <SelectValue placeholder="Select Team" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="team-alpha">Team Alpha</SelectItem>
                  <SelectItem value="team-beta">Team Beta</SelectItem>
                  <SelectItem value="team-gamma">Team Gamma</SelectItem>
               </SelectContent>
            </Select>

           <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />

           {/* Last Updated */}
           <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="hidden sm:inline">Updated: Just now</span>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-[#2A53A0] dark:text-[#6b93e6]"
              >
                <Renew className="size-4" />
              </motion.button>
           </div>
         </div>

         {/* Right Side */}
         <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 h-[46px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-[#2A53A0] dark:hover:border-[#6b93e6] transition-all shadow-sm">
             <Calendar className="size-4 text-[#2A53A0] dark:text-[#6b93e6]" />
             <span className="text-sm text-gray-700 dark:text-gray-300">Last 24 Hours</span>
             <ChevronDown className="size-4 text-gray-500" />
           </button>
           <button className="flex items-center gap-2 px-4 h-[46px] bg-[#2A53A0] hover:bg-[#1e3a70] dark:bg-[#6b93e6] dark:hover:bg-[#5577cc] text-white rounded-lg transition-all shadow-sm">
             <span className="text-sm">Export</span>
             <Download className="size-4" />
           </button>
         </div>
      </div>

      {/* Row 1: KPI Cards - Matched Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const colorMap = {
            0: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-50 text-blue-700 border-blue-200" },
            1: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            2: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400", badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
            3: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", badge: "bg-orange-50 text-orange-700 border-orange-200" },
          } as Record<number, { bg: string, text: string, badge: string }>;
          
          const colors = colorMap[kpi.colorIdx] || colorMap[0];

          return (
            <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
            >
              <Card className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`size-5 ${colors.text}`} />
                  </div>
                  <Badge variant="outline" className={colors.badge}>{kpi.change}</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</h3>
                <p className="text-sm text-gray-500">{kpi.title}</p>
                <p className="text-xs text-gray-400 mt-1">{kpi.subValue}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Row 2: Workload & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         {/* Workload Distribution */}
         <Card className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <BarChart3 className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Workload Distribution</h3>
                  </div>
               </div>
               <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={workloadData} layout="vertical" barSize={16}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                     <XAxis type="number" fontSize={11} />
                     <YAxis dataKey="name" type="category" width={90} fontSize={11} tick={{fill: '#4b5563'}} />
                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                     <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />
                     <Bar dataKey="open" name="Open" stackId="a" fill="#2A53A0" radius={[0,0,0,0]} />
                     <Bar dataKey="inProgress" name="In Progress" stackId="a" fill="#eab308" radius={[0,0,0,0]} />
                     <Bar dataKey="pending" name="Pending Info" stackId="a" fill="#64748b" radius={[0,4,4,0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Queue Aging Heatmap */}
         <Card className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <Activity className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Queue Aging Heatmap</h3>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                     <thead>
                        <tr className="text-gray-500">
                           <th className="text-left font-medium pb-2">
                             <SortableHeader column="priority" label="Priority" sortConfig={heatmapSortConfig} onSort={sortHeatmap} />
                           </th>
                           <th className="text-center font-medium pb-2">
                             <SortableHeader column="d0_2" label="0-2d" sortConfig={heatmapSortConfig} onSort={sortHeatmap} className="justify-center" />
                           </th>
                           <th className="text-center font-medium pb-2">
                             <SortableHeader column="d3_5" label="3-5d" sortConfig={heatmapSortConfig} onSort={sortHeatmap} className="justify-center" />
                           </th>
                           <th className="text-center font-medium pb-2">
                             <SortableHeader column="d6_10" label="6-10d" sortConfig={heatmapSortConfig} onSort={sortHeatmap} className="justify-center" />
                           </th>
                           <th className="text-center font-medium pb-2">
                             <SortableHeader column="d10plus" label="10+d" sortConfig={heatmapSortConfig} onSort={sortHeatmap} className="justify-center" />
                           </th>
                        </tr>
                     </thead>
                     <tbody className="space-y-1">
                        {sortedHeatmap.map((row) => (
                           <tr key={row.priority}>
                              <td className="font-medium text-gray-700 py-1">{row.priority}</td>
                              <td className="p-1"><div className={cn("w-full py-1.5 text-center rounded text-xs font-medium", getHeatmapColor(row.d0_2))}>{row.d0_2}</div></td>
                              <td className="p-1"><div className={cn("w-full py-1.5 text-center rounded text-xs font-medium", getHeatmapColor(row.d3_5))}>{row.d3_5}</div></td>
                              <td className="p-1"><div className={cn("w-full py-1.5 text-center rounded text-xs font-medium", getHeatmapColor(row.d6_10))}>{row.d6_10}</div></td>
                              <td className="p-1"><div className={cn("w-full py-1.5 text-center rounded text-xs font-medium", getHeatmapColor(row.d10plus))}>{row.d10plus}</div></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </Card>
      </div>

      {/* Row 3: Leaderboard & Breach Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         {/* Leaderboard */}
         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <TrendingUp className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Productivity Leaderboard</h3>
                  </div>
                  <button className="text-xs text-[#2A53A0] hover:underline">View Full Team</button>
               </div>
               <div className="divide-y divide-gray-100">
                  {leaderboardData.map((item) => (
                     <div key={item.name} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-lg">
                        <div className="flex items-center gap-3">
                           <div className={cn("w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold", 
                              item.rank === 1 ? "bg-yellow-100 text-yellow-700" : 
                              item.rank === 2 ? "bg-gray-100 text-gray-700" :
                              item.rank === 3 ? "bg-orange-50 text-orange-700" : "text-gray-500"
                           )}>
                              {item.rank <= 3 ? (item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : "🥉") : item.rank}
                           </div>
                           <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-center">
                              <span className="block text-sm font-bold text-gray-900">{item.closed}</span>
                              <span className="block text-[10px] text-gray-500">Closed</span>
                           </div>
                           <div className="text-center hidden sm:block">
                              <span className="block text-sm font-bold text-[#2A53A0]">{item.score}</span>
                              <span className="block text-[10px] text-gray-500">Score</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </Card>

         {/* SLA Breach Analysis */}
         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <AlertTriangle className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">SLA Breach Analysis</h3>
                  </div>
               </div>
               <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={breachData}>
                     <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                     <XAxis dataKey="date" tick={{fontSize: 10}} tickMargin={10} interval={2} />
                     <YAxis yAxisId="left" tick={{fontSize: 10}} width={20} />
                     <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10}} width={20} unit="%" />
                     <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                     <Bar yAxisId="left" dataKey="count" name="Breach Count" fill="#ea580c" barSize={10} radius={[2,2,0,0]} />
                     <Line yAxisId="right" type="monotone" dataKey="rate" name="Breach Rate %" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </ComposedChart>
               </ResponsiveContainer>
               <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 px-2 py-1 rounded">
                     <AlertTriangle className="size-3" />
                     <span className="font-medium">Dec 19: Breach spike detected (12 breaches)</span>
                  </div>
               </div>
            </div>
         </Card>
      </div>

      {/* Row 4: At Risk & Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         {/* SLA Countdown - At Risk */}
         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <Clock className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">SLA Countdown</h3>
                  </div>
                  <Badge variant="destructive" className="animate-pulse">7 Items At Risk</Badge>
               </div>
               <div className="divide-y divide-gray-100">
                  {atRiskItems.map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-lg">
                        <div className="flex items-center gap-3">
                           <Badge variant="outline" className={cn("w-16 justify-center", 
                              item.severity === "Critical" ? "bg-red-50 text-red-700 border-red-200" : 
                              item.severity === "High" ? "bg-orange-50 text-orange-700 border-orange-200" :
                              "bg-yellow-50 text-yellow-700 border-yellow-200"
                           )}>
                              {item.time}
                           </Badge>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900">{item.id}</span>
                              <span className="text-xs text-gray-500">{item.user}</span>
                           </div>
                        </div>
                        <button className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded shadow-sm hover:bg-red-700 transition-colors">
                           {item.action}
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </Card>

         {/* Escalations Tracker */}
         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <MoreHorizontal className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Escalations Tracker</h3>
                  </div>
               </div>
               <div className="space-y-4">
                  <div>
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-gray-500 uppercase">Incoming (from L1/L2)</h4>
                        <div className="flex items-center gap-1">
                           <span className="text-lg font-bold text-gray-900">3</span>
                           <span className="text-xs font-medium text-green-600">+0.5%</span>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                           <div>
                              <span className="text-xs font-bold text-gray-900 block">AML-4510</span>
                              <span className="text-[10px] text-gray-500">from L1 Team • 15 min ago</span>
                           </div>
                           <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-[10px]">Pending</Badge>
                        </div>
                     </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-gray-500 uppercase">Outgoing (to Management)</h4>
                        <div className="flex items-center gap-1">
                           <span className="text-lg font-bold text-gray-900">2</span>
                           <span className="text-xs font-medium text-green-600">-2.2%</span>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                           <div>
                              <span className="text-xs font-bold text-gray-900 block">AML-4500</span>
                              <span className="text-[10px] text-gray-500">Sent 2 hours ago</span>
                           </div>
                           <Badge variant="secondary" className="bg-green-100 text-green-800 text-[10px]">Approved</Badge>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </Card>
      </div>

      {/* Row 5: QA & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         {/* QA Summary */}
         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <CheckCircle2 className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">QA Summary</h3>
                  </div>
               </div>
               <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 flex flex-col items-center">
                     <div className="relative h-32 w-32">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie 
                                 data={qaPieData} 
                                 innerRadius={40} 
                                 outerRadius={55} 
                                 paddingAngle={5} 
                                 dataKey="value"
                              >
                                 {qaPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                              </Pie>
                           </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-xl font-bold text-gray-900">91%</span>
                        </div>
                     </div>
                     <div className="flex gap-3 text-[10px] mt-2">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Pass</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Fail</div>
                     </div>
                  </div>
                  <div className="flex-1">
                     <h4 className="text-xs font-medium text-gray-500 mb-2">ERROR CATEGORIES</h4>
                     <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={qaErrorData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                           <XAxis dataKey="name" tick={{fontSize: 9}} interval={0} />
                           <YAxis hide />
                           <Bar dataKey="value" fill="#d97706" radius={[4,4,0,0]} barSize={20} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>
         </Card>

         {/* Alerts & Notifications */}
         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <Bell className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                     <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Team Alerts</h3>
                  </div>
               </div>
               <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
                  {alerts.map((alert, i) => (
                     <div key={i} className="flex gap-3">
                        <div className={cn("mt-1 w-2 h-2 rounded-full shrink-0", 
                           alert.type === "success" ? "bg-green-500" : 
                           alert.type === "warning" ? "bg-orange-500" : 
                           alert.type === "error" ? "bg-red-500" : "bg-blue-500"
                        )} />
                        <div>
                           <div className="flex items-baseline gap-2">
                              <span className={cn("text-xs font-bold uppercase", 
                                 alert.type === "success" ? "text-green-600" : 
                                 alert.type === "warning" ? "text-orange-600" : 
                                 alert.type === "error" ? "text-red-600" : "text-blue-600"
                              )}>{alert.title}</span>
                              <span className="text-[10px] text-gray-400">{alert.time}</span>
                           </div>
                           <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">{alert.message}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </Card>
      </div>

      {/* Row 6: Detailed Performance Table */}
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
         <div className="p-6">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <Users className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Detailed Team Performance</h3>
               </div>
               <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50">Export</button>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500">
                     <tr>
                        <th className="px-4 py-2 font-medium text-xs">Analyst</th>
                        <th className="px-4 py-2 font-medium text-xs">Status</th>
                        <th className="px-4 py-2 font-medium text-xs text-right">Queue</th>
                        <th className="px-4 py-2 font-medium text-xs text-right">Today</th>
                        <th className="px-4 py-2 font-medium text-xs text-right">Week</th>
                        <th className="px-4 py-2 font-medium text-xs text-right">Avg TAT</th>
                        <th className="px-4 py-2 font-medium text-xs text-right">SLA</th>
                        <th className="px-4 py-2 font-medium text-xs text-right">Score</th>
                        <th className="px-4 py-2 font-medium text-xs text-center">Trend</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {detailedPerformance.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                           <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                           <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                 <div className={cn("w-1.5 h-1.5 rounded-full", 
                                    row.status === "Online" ? "bg-green-500" : 
                                    row.status === "Break" ? "bg-yellow-500" : "bg-gray-400"
                                 )}></div>
                                 <span className="text-xs text-gray-600">{row.status}</span>
                              </div>
                           </td>
                           <td className="px-4 py-3 text-right font-medium text-gray-900">{row.queue}</td>
                           <td className="px-4 py-3 text-right text-gray-600">{row.today}</td>
                           <td className="px-4 py-3 text-right text-gray-600">{row.week}</td>
                           <td className="px-4 py-3 text-right text-gray-600">{row.avgTat}</td>
                           <td className={cn("px-4 py-3 text-right font-medium", 
                              parseFloat(row.sla) < 95 ? "text-orange-600" : "text-green-600"
                           )}>{row.sla}</td>
                           <td className={cn("px-4 py-3 text-right font-medium", 
                              parseFloat(row.qa) < 90 ? "text-orange-600" : "text-green-600"
                           )}>{row.qa}</td>
                           <td className="px-4 py-3 text-center">
                              {row.trend === "up" ? <TrendingUp className="size-4 text-green-500 mx-auto" /> : 
                               row.trend === "down" ? <TrendingDown className="size-4 text-red-500 mx-auto" /> : 
                               <div className="w-4 h-0.5 bg-gray-300 mx-auto"></div>}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </Card>
    </motion.div>
  );
}
