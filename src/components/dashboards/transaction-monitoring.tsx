import { motion } from "motion/react";
import {
  Activity,
  Calendar,
  Download,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter,
  CreditCard,
  Banknote,
  Globe,
  RefreshCw as Renew,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Users,
  Layers,
  Map as MapIcon,
  BarChart2,
  PieChart as PieChartIcon
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  LineChart,
  Line,
  Treemap
} from "recharts";
import { useState, Fragment } from "react";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface TransactionMonitoringProps {
  breadcrumbs?: BreadcrumbItem[];
  onBreadcrumbNavigate?: (path: string) => void;
}

export function TransactionMonitoring({ breadcrumbs, onBreadcrumbNavigate }: TransactionMonitoringProps) {
  const [dateRange, setDateRange] = useState("Last 7 Days");

  // --- MOCK DATA ---

  // 1. KPIs
  const kpiData = [
    { title: "Total Alerts Generated Today", value: "1,782", change: "+48.2%", trend: "up", color: "blue" },
    { title: "Open Alerts", value: "3,456", change: "-2.5%", trend: "down", color: "red" },
    { title: "Alerts Closed Today", value: "1,689", change: "+12.8%", trend: "up", color: "green" },
    { title: "Alert-to-SAR Rate", value: "18.4%", change: "+4.2%", trend: "up", color: "orange" },
  ];

  // 2. Alert Volume Trend (7 Days)
  const alertVolumeTrend = [
    { day: "Jul 1", volume: 32000 },
    { day: "Jul 2", volume: 34000 },
    { day: "Jul 3", volume: 33500 },
    { day: "Jul 4", volume: 36000 },
    { day: "Jul 5", volume: 38000 },
    { day: "Jul 6", volume: 37500 },
    { day: "Jul 7", volume: 39000 },
  ];

  // 3. Alerts by Priority
  const alertsByPriority = [
    { name: "Critical", value: 3500, color: "#ef4444" },
    { name: "High", value: 5200, color: "#f97316" },
    { name: "Medium", value: 4500, color: "#eab308" },
    { name: "Low", value: 1116, color: "#10b981" },
  ];

  // 4. Alerts by Scenario/Rule
  const alertsByScenario = [
    { name: "High Cash Deposits", value: 4200 },
    { name: "Rapid Movement", value: 3800 },
    { name: "Cross-Border Activity", value: 3500 },
    { name: "Structuring Pattern", value: 2900 },
    { name: "Dormant Reactivation", value: 2400 },
    { name: "Multiple Small Txns", value: 2100 },
    { name: "High-Risk Geography", value: 1800 },
    { name: "Loan Withdrawal", value: 1500 },
  ];

  // 5. Alert Aging Distribution
  const alertAging = [
    { range: "0-3 Days", critical: 1200, high: 2000, medium: 800, low: 200 },
    { range: "4-7 Days", critical: 800, high: 1500, medium: 1200, low: 300 },
    { range: "8-14 Days", critical: 400, high: 800, medium: 1500, low: 400 },
    { range: "15-30 Days", critical: 100, high: 200, medium: 400, low: 200 },
    { range: "30+ Days", critical: 50, high: 50, medium: 100, low: 50 },
  ];

  // 6. Scenario Effectiveness Matrix (Scatter)
  // X: Alert Volume, Y: STR Conversion Rate
  const scenarioEffectiveness = [
    { name: "High Cash", volume: 4200, conversion: 15, z: 100, fill: "#ef4444" }, // High Vol, Low Conv (Twin Trees?)
    { name: "Structuring", volume: 2900, conversion: 25, z: 80, fill: "#f97316" },
    { name: "Rapid Mvt", volume: 3800, conversion: 18, z: 90, fill: "#eab308" },
    { name: "Cross Border", volume: 3500, conversion: 45, z: 85, fill: "#10b981" }, // Better
    { name: "Dormant", volume: 2400, conversion: 60, z: 60, fill: "#3b82f6" }, // Effective
  ];

  // 7. False Positive Rate by Scenario
  const fprByScenario = [
    { name: "Multiple Small Txns", value: 95, color: "#ef4444" },
    { name: "Round Amount", value: 92, color: "#ef4444" },
    { name: "Cash Withdrawal", value: 88, color: "#f97316" },
    { name: "Rapid Movement", value: 85, color: "#f97316" },
    { name: "High Cash Deposits", value: 78, color: "#f97316" },
    { name: "Dormant Reactivation", value: 72, color: "#eab308" },
    { name: "Structuring Pattern", value: 65, color: "#eab308" },
    { name: "Cross-Border Activity", value: 45, color: "#10b981" },
  ];

  // 8. True Positive Rate by Scenario
  const tprByScenario = [
    { name: "Cross-Border Activity", value: 55, color: "#10b981" },
    { name: "Structuring Pattern", value: 48, color: "#10b981" },
    { name: "Dormant Reactivation", value: 42, color: "#10b981" },
    { name: "High Cash Deposits", value: 35, color: "#eab308" },
    { name: "Rapid Movement", value: 28, color: "#eab308" },
    { name: "Cash Withdrawal", value: 22, color: "#f97316" },
    { name: "Round Amount", value: 12, color: "#ef4444" },
    { name: "Multiple Small Txns", value: 8, color: "#ef4444" },
  ];

  // 9. Alert Volume by Customer Segment (Treemap mock using custom component or simple blocks)
  const alertsBySegment = [
    { name: "Retail", value: 10450, color: "#3b82f6" },
    { name: "Commercial", value: 6920, color: "#8b5cf6" },
    { name: "Private Banking", value: 3580, color: "#f97316" },
    { name: "Corporate", value: 4120, color: "#eab308" },
    { name: "SME", value: 2340, color: "#ec4899" },
    { name: "NBFI", value: 6570, color: "#10b981" },
  ];

  // 10. Alert Volume by Product
  const alertsByProduct = [
    { name: "Deposits", value: 5200, color: "#3b82f6" },
    { name: "FX", value: 4100, color: "#8b5cf6" },
    { name: "Trade", value: 2800, color: "#f97316" },
    { name: "Cards", value: 2100, color: "#10b981" },
    { name: "Loans", value: 1500, color: "#eab308" },
    { name: "Other", value: 900, color: "#ec4899" },
  ];

  // 11. Alert Volume by Geography
  const alertsByGeo = [
    { region: "Maharashtra", value: 6930, level: "Critical", color: "#ef4444" },
    { region: "Delhi", value: 7236, level: "Critical", color: "#ef4444" },
    { region: "Karnataka", value: 5040, level: "High", color: "#f97316" },
    { region: "Tamil Nadu", value: 4890, level: "High", color: "#f97316" },
    { region: "Gujarat", value: 3780, level: "High", color: "#f97316" },
    { region: "West Bengal", value: 3450, level: "Medium", color: "#eab308" }, // "Low Risk" in image but let's use yellow
  ];

  // 12. Alert Inflow vs Outflow
  const inflowOutflow = [
    { day: "Dec 1", inflow: 1200, outflow: 1050 },
    { day: "Dec 8", inflow: 1250, outflow: 1100 },
    { day: "Dec 15", inflow: 1220, outflow: 1180 },
    { day: "Dec 22", inflow: 1350, outflow: 1250 },
    { day: "Dec 29", inflow: 1300, outflow: 1220 },
  ];

  // 13. Transaction Volume Monitored
  const transactionVolume = [
    { day: "Jun 1", volume: 1.8 },
    { day: "Jun 2", volume: 1.9 },
    { day: "Jun 3", volume: 1.85 },
    { day: "Jun 4", volume: 1.75 },
    { day: "Jun 5", volume: 1.95 },
    { day: "Jun 6", volume: 1.98 },
    { day: "Jun 7", volume: 1.92 },
  ]; // Millions

  // 14. Threshold Trigger Analysis (Scatter)
  // X: Threshold Amount, Y: Alerts Generated
  const thresholdTriggers = [
    { threshold: 50000, alerts: 2500, fill: "#ef4444" },
    { threshold: 100000, alerts: 4500, fill: "#f97316" },
    { threshold: 250000, alerts: 7200, fill: "#eab308" },
    { threshold: 500000, alerts: 9800, fill: "#eab308" }, // Higher alerts? Mockup logic
    { threshold: 1000000, alerts: 14000, fill: "#eab308" },
    { threshold: 2000000, alerts: 18000, fill: "#f97316" },
  ];

  // 15. Structuring Pattern Detection (Line)
  const structuringPattern = [
    { day: "Jun 1", value: 80 },
    { day: "Jun 8", value: 90 },
    { day: "Jun 15", value: 82 },
    { day: "Jun 22", value: 95 },
    { day: "Jun 29", value: 88 },
  ];

  // 16. Rapid Movement Alerts (Line)
  const rapidMovement = [
    { day: "Jun 1", value: 110 },
    { day: "Jun 8", value: 112 },
    { day: "Jun 15", value: 105 },
    { day: "Jun 22", value: 120 },
    { day: "Jun 29", value: 115 },
  ];

  // 17. Typology Coverage Heat Map
  const typologyCoverage = [
    { type: "Structuring", highCash: "High", multipleSmall: "Low", roundAmount: "Medium", crossBorder: "Low", rapidMvt: "-" },
    { type: "Layering", highCash: "Medium", multipleSmall: "Medium", roundAmount: "-", crossBorder: "High", rapidMvt: "High" },
    { type: "Trade Based ML", highCash: "-", multipleSmall: "-", roundAmount: "Medium", crossBorder: "High", rapidMvt: "Medium" },
    { type: "Cash Smuggling", highCash: "High", multipleSmall: "Medium", roundAmount: "High", crossBorder: "Medium", rapidMvt: "-" },
  ];

  // 18. Model/Rule Health Status
  const modelHealth = [
    { status: "Operational", count: 7, color: "green" },
    { status: "Degraded", count: 1, color: "orange" },
    { status: "Error", count: 1, color: "red" },
    { status: "Maintenance", count: 1, color: "blue" },
  ];

  const modelHealthDetails = [
    { name: "High Cash Deposits", status: "Operational", color: "text-green-600 bg-green-50" },
    { name: "Rapid Movement", status: "Operational", color: "text-green-600 bg-green-50" },
    { name: "Cross-Border Activity", status: "Operational", color: "text-green-600 bg-green-50" },
    { name: "Structuring Pattern", status: "Degraded", color: "text-orange-600 bg-orange-50" },
  ];

  // 19. Alert Assignment Queue
  const assignmentQueue = [
    { id: "AL-2024-1847", scenario: "High Cash Deposits", customer: "CUST-88214", priority: "Critical", age: "2h" },
    { id: "AL-2024-1848", scenario: "Cross-Border Activity", customer: "CUST-78142", priority: "High", age: "4h" },
    { id: "AL-2024-1849", scenario: "Rapid Movement", customer: "CUST-45678", priority: "High", age: "5h" },
    { id: "AL-2024-1850", scenario: "Structuring Pattern", customer: "CUST-22410", priority: "Medium", age: "8h" },
    { id: "AL-2024-1851", scenario: "Multiple Small Txns", customer: "CUST-98765", priority: "Low", age: "1d" },
  ];

  // 20. Peak Alert Generation Times (Heatmap Mock)
  // Simple grid visualization
  const peakTimes = Array(7).fill(0).map((_, row) => 
    Array(24).fill(0).map((_, col) => {
      // Simulate peak around 10am-4pm
      if (row < 5 && col > 9 && col < 17) return Math.random() > 0.3 ? 2 : 1;
      return 0;
    })
  );

  // 21. Scenario Tuning Impact
  const tuningImpact = [
    { scenario: "High Cash", before: 5500, after: 4200 },
    { scenario: "Rapid Mvt", before: 4100, after: 3800 },
    { scenario: "Cross Border", before: 3600, after: 3500 },
    { scenario: "Structuring", before: 3200, after: 2200 }, // Big drop
    { scenario: "Dormant", before: 2600, after: 2400 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 pb-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction Monitoring Dashboard</h1>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />
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

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 h-[40px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-[#2A53A0] dark:hover:border-[#6b93e6] transition-all shadow-sm">
            <Calendar className="size-4 text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{dateRange}</span>
            <ChevronDown className="size-3 text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 h-[40px] bg-[#2A53A0] text-white rounded-lg shadow-sm hover:bg-[#1e3a70] dark:bg-[#6b93e6] dark:hover:bg-[#5577cc] transition-all">
            <span className="text-sm">Export Report</span>
            <Download className="size-4" />
          </button>
        </div>
      </div>

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <Card key={idx} className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</p>
                <div className={`text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${
                   kpi.trend === 'up' && kpi.color !== 'red' ? 'bg-green-100 text-green-700' :
                   kpi.trend === 'down' && kpi.color === 'red' ? 'bg-green-100 text-green-700' : // Good if bad things go down
                   'bg-red-100 text-red-700'
                }`}>
                   {kpi.change}
                </div>
             </div>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</h3>
          </Card>
        ))}
      </div>

      {/* Row 2: Alert Volume Trend & Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <Card className="lg:col-span-2 p-4 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Alert Volume Trend (7D)</h3>
            <p className="text-xs text-gray-500 mb-4">Monthly alert generation across all scenarios</p>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={alertVolumeTrend}>
                     <defs>
                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                     <Tooltip />
                     <Area type="monotone" dataKey="volume" stroke="#8b5cf6" fill="url(#colorTrend)" strokeWidth={2} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Alerts by Priority</h3>
            <div className="h-[200px] relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={alertsByPriority} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                        {alertsByPriority.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-xl font-bold text-gray-900">14,316</p>
                  <p className="text-xs text-gray-500">Total Alerts</p>
               </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs">
               {alertsByPriority.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                     <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                     <span>{item.name}</span>
                  </div>
               ))}
            </div>
         </Card>
      </div>

      {/* Row 3: Alerts by Scenario & Aging */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Alerts by Scenario/Rule</h3>
            <p className="text-xs text-gray-500 mb-4">Volume by detection rule</p>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertsByScenario} layout="vertical" margin={{ left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{ fill: '#f3f4f6' }} />
                     <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Alert Aging Distribution</h3>
            <p className="text-xs text-gray-500 mb-4">Age buckets of open alerts</p>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertAging}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                     <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                     <Tooltip cursor={{ fill: '#f3f4f6' }} />
                     <Legend wrapperStyle={{ fontSize: '10px' }} />
                     <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" />
                     <Bar dataKey="high" name="High" stackId="a" fill="#f97316" />
                     <Bar dataKey="medium" name="Medium" stackId="a" fill="#eab308" />
                     <Bar dataKey="low" name="Low" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Row 4: Scenario Effectiveness Matrix */}
      <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
         <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Scenario Effectiveness Matrix</h3>
            <div className="flex gap-4 text-xs text-gray-500">
               <span>X: Alert Volume</span>
               <span>Y: STR Conversion Rate</span>
            </div>
         </div>
         <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
               <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis type="number" dataKey="volume" name="Volume" unit=" alerts" axisLine={false} tickLine={false} />
                  <YAxis type="number" dataKey="conversion" name="Conversion" unit="%" axisLine={false} tickLine={false} />
                  <ZAxis type="number" dataKey="z" range={[100, 400]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Scenarios" data={scenarioEffectiveness} fill="#8884d8">
                     {scenarioEffectiveness.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Scatter>
               </ScatterChart>
            </ResponsiveContainer>
            {/* Quadrant Labels Mockup */}
            <div className="absolute top-2 left-2 text-xs font-bold text-red-500">Twin Trees</div>
            <div className="absolute top-2 right-2 text-xs font-bold text-green-500">Optimize</div>
            <div className="absolute bottom-2 left-2 text-xs font-bold text-orange-500">Review</div>
            <div className="absolute bottom-2 right-2 text-xs font-bold text-blue-500">Effective</div>
         </div>
      </Card>

      {/* Row 5: FPR & TPR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">False Positive Rate by Scenario</h3>
            <p className="text-xs text-gray-500 mb-4">Ranked by FP rate</p>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fprByScenario} layout="vertical" margin={{ left: 30 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{ fill: '#f3f4f6' }} />
                     <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={15} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">True Positive Rate by Scenario</h3>
            <p className="text-xs text-gray-500 mb-4">Detection effectiveness ranking</p>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tprByScenario} layout="vertical" margin={{ left: 30 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{ fill: '#f3f4f6' }} />
                     <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={15} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Row 6: Segment & Product */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         {/* Segment Treemap Mockup (using blocks) */}
         <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Alert Volume by Customer Segment</h3>
            <p className="text-xs text-gray-500 mb-4">Retail, Commercial, Private Banking, etc.</p>
            <div className="h-[250px] flex flex-wrap gap-1">
               <div className="w-full h-1/2 flex gap-1">
                  <div className="h-full w-2/3 bg-blue-500 text-white flex flex-col justify-center items-center p-2">
                     <span className="font-bold">Retail</span>
                     <span className="text-xs">10,450</span>
                  </div>
                  <div className="h-full w-1/3 flex flex-col gap-1">
                     <div className="h-1/2 w-full bg-orange-500 text-white flex flex-col justify-center items-center p-1">
                        <span className="font-bold text-xs">Private Banking</span>
                        <span className="text-[10px]">3,580</span>
                     </div>
                     <div className="h-1/2 w-full bg-green-500 text-white flex flex-col justify-center items-center p-1">
                        <span className="font-bold text-xs">NBFI</span>
                        <span className="text-[10px]">6,570</span>
                     </div>
                  </div>
               </div>
               <div className="w-full h-1/2 flex gap-1">
                  <div className="h-full w-1/2 bg-purple-500 text-white flex flex-col justify-center items-center p-2">
                     <span className="font-bold">Commercial</span>
                     <span className="text-xs">6,920</span>
                  </div>
                  <div className="h-full w-1/2 flex gap-1">
                     <div className="h-full w-2/3 bg-yellow-500 text-white flex flex-col justify-center items-center p-1">
                        <span className="font-bold text-xs">Corporate</span>
                        <span className="text-[10px]">4,120</span>
                     </div>
                     <div className="h-full w-1/3 bg-pink-500 text-white flex flex-col justify-center items-center p-1">
                        <span className="font-bold text-[10px]">SME</span>
                        <span className="text-[8px]">2,340</span>
                     </div>
                  </div>
               </div>
            </div>
         </Card>

         <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Alert Volume by Product</h3>
            <p className="text-xs text-gray-500 mb-4">Deposits, Wires, Cards, etc.</p>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertsByProduct}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                     <Tooltip cursor={{ fill: '#f3f4f6' }} />
                     <Bar dataKey="value" fill="#8884d8">
                        {alertsByProduct.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Row 7: Geography & Inflow/Outflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Alert Volume by Geography</h3>
            <p className="text-xs text-gray-500 mb-4">Geographic distribution of alerts</p>
            <div className="grid grid-cols-2 gap-2">
               {alertsByGeo.map((geo, i) => (
                  <div key={i} className="p-3 rounded-lg text-white flex flex-col justify-between h-20" style={{ backgroundColor: geo.color }}>
                     <span className="text-xs font-medium opacity-90">{geo.region}</span>
                     <div>
                        <span className="text-lg font-bold block">{geo.value.toLocaleString()}</span>
                        <span className="text-[10px] uppercase opacity-80">{geo.level}</span>
                     </div>
                  </div>
               ))}
            </div>
         </Card>

         <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Alert Inflow vs. Outflow</h3>
            <p className="text-xs text-gray-500 mb-4">New alerts vs. closed alerts</p>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inflowOutflow}>
                     <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                     <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                     <YAxis tick={{ fontSize: 10 }} />
                     <Tooltip />
                     <Legend wrapperStyle={{ fontSize: '10px' }} />
                     <Line type="monotone" dataKey="inflow" name="Alerts Generated" stroke="#ef4444" strokeWidth={2} dot={false} />
                     <Line type="monotone" dataKey="outflow" name="Alerts Closed" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>
    </motion.div>
  );
}
