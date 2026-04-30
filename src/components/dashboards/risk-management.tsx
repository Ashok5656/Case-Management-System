import { motion } from "motion/react";
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Activity,
  Calendar,
  Download,
  ChevronDown,
  UserX,
  MapPin,
  Lock,
  Globe,
  Search,
  RefreshCw as Renew,
  FileWarning,
  UserCheck,
  CheckCircle2,
  AlertOctagon,
  BarChart3,
  PieChart as PieChartIcon,
  LayoutDashboard,
  ArrowUpRight,
  Clock,
  Target,
  Briefcase
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { useState, Fragment } from "react";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface RiskManagementProps {
  breadcrumbs?: BreadcrumbItem[];
  onBreadcrumbNavigate?: (path: string) => void;
}

export function RiskManagement({ breadcrumbs, onBreadcrumbNavigate }: RiskManagementProps) {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  // --- DATA MOCKUP ---

  // 1. KPI Cards
  const kpiData = [
    { title: "High-Risk Customers", value: "2,847", subtext: "6.1% of total", change: "+3.2%", icon: ShieldAlert, color: "red" },
    { title: "PEP Customers", value: "1,254", subtext: "3.6% of total", change: "+2.1%", icon: UserCheck, color: "purple" },
    { title: "Pending Risk Rating", value: "348", subtext: "Avg: 12 days", change: "78 overdue", icon: Clock, color: "orange" },
    { title: "Overdue EDD Reviews", value: "87", subtext: "23 critical (>90 days)", change: "Critical", icon: AlertTriangle, color: "red" },
  ];
  
  const riskAssessmentCompletion = { value: 94.2, target: 95, gap: 0.8 };

  // 2. Customer Risk Distribution
  const riskDistribution = [
    { name: "High Risk", value: 8, color: "#ef4444" },
    { name: "Medium Risk", value: 25, color: "#f59e0b" },
    { name: "Low Risk", value: 67, color: "#10b981" },
  ];

  // 3. Risk Trend
  const riskTrendData = [
    { month: "Aug", high: 350, medium: 800, low: 2000 },
    { month: "Sep", high: 380, medium: 850, low: 2100 },
    { month: "Oct", high: 320, medium: 900, low: 2200 },
    { month: "Nov", high: 400, medium: 880, low: 2300 },
    { month: "Dec", high: 420, medium: 920, low: 2400 },
    { month: "Jan", high: 450, medium: 950, low: 2500 },
  ];

  // 4. High-Risk by Geography
  const highRiskGeo = [
    { region: "Maharashtra", count: 789, risk: "Critical", color: "#ef4444", percentage: 27.7 },
    { region: "Delhi NCR", count: 645, risk: "High", color: "#f97316", percentage: 22.7 },
    { region: "Gujarat", count: 412, risk: "High", color: "#f97316", percentage: 14.5 },
    { region: "Karnataka", count: 378, risk: "Medium", color: "#eab308", percentage: 13.3 },
    { region: "Tamil Nadu", count: 289, risk: "Medium", color: "#eab308", percentage: 10.2 },
    { region: "West Bengal", count: 187, risk: "Medium", color: "#eab308", percentage: 6.6 },
    { region: "Rajasthan", count: 147, risk: "Low", color: "#10b981", percentage: 5.2 },
  ];

  // NEW: High-Risk by Business Line
  const highRiskBusinessLine = [
    { name: "Retail Banking", value: 1245, percentage: 43.7, color: "#3b82f6" },
    { name: "Corporate", value: 850, percentage: 29.8, color: "#8b5cf6" },
    { name: "Wealth Mgmt", value: 432, percentage: 15.2, color: "#10b981" },
    { name: "SME Banking", value: 320, percentage: 11.3, color: "#f59e0b" },
  ];

  // 5. Risk Rating Migration Matrix
  const migrationMatrix = {
    headers: ["Low", "Medium", "High"],
    rows: [
      { from: "Low", to: { low: 22890, medium: 456, high: 110 } },
      { from: "Medium", to: { low: 234, medium: 8345, high: 355 } },
      { from: "High", to: { low: 45, medium: 187, high: 2615 } },
    ]
  };

  // 6. High-Risk by Product
  const highRiskProducts = [
    { name: "Wire Transfers", value: 879, color: "#f97316" },
    { name: "Foreign Currency", value: 367, color: "#10b981" },
    { name: "Letters of Credit", value: 312, color: "#8b5cf6" },
    { name: "Precious Metals", value: 209, color: "#3b82f6" },
  ];

  // 7. PEP Distribution
  const pepByType = [
    { name: "Foreign PEP", value: 45, color: "#ef4444" },
    { name: "Domestic PEP", value: 35, color: "#f97316" },
    { name: "RCA (Relatives)", value: 20, color: "#eab308" },
  ];

  // 8. Adverse Media Trend
  const adverseMediaTrend = [
    { date: "Jan 27", hits: 12 },
    { date: "Jan 28", hits: 18 },
    { date: "Jan 29", hits: 15 },
    { date: "Jan 30", hits: 25 },
    { date: "Jan 31", hits: 22 },
    { date: "Feb 1", hits: 30 },
    { date: "Feb 2", hits: 28 },
  ];

  // 9. CDD Status
  const cddStatus = [
    { category: "Low Risk", completed: 12000, pending: 500, overdue: 50 },
    { category: "Medium Risk", completed: 8000, pending: 800, overdue: 120 },
    { category: "High Risk", completed: 2500, pending: 300, overdue: 87 },
  ];

  // 10. Risk Factor Analysis (Radar)
  const riskFactorData = [
    { subject: "Geography", A: 85, fullMark: 100 },
    { subject: "Product", A: 70, fullMark: 100 },
    { subject: "Customer Type", A: 60, fullMark: 100 },
    { subject: "Channel", A: 50, fullMark: 100 },
    { subject: "Transaction", A: 75, fullMark: 100 },
    { subject: "PEP/Sanctions", A: 90, fullMark: 100 },
  ];

  // 11. Country Risk Matrix
  const countryRiskMatrix = [
    { country: "India", trade: 25, wire: 15, fx: 55, cash: 20 },
    { country: "UAE", trade: 65, wire: 50, fx: 40, cash: 70 },
    { country: "USA", trade: 20, wire: 18, fx: 35, cash: 15 },
    { country: "UK", trade: 23, wire: 20, fx: 38, cash: 18 },
    { country: "Hong Kong", trade: 72, wire: 80, fx: 75, cash: 65 },
    { country: "Singapore", trade: 45, wire: 42, fx: 48, cash: 40 },
  ];

  // 12. Risk Appetite
  const riskAppetite = [
    { metric: "High-Risk Customers (%)", current: 5.1, threshold: 6, limit: 10, status: "Within" },
    { metric: "PEP Exposure (%)", current: 3.6, threshold: 4, limit: 5, status: "Within" },
    { metric: "High-Risk Countries (%)", current: 12.3, threshold: 12, limit: 15, status: "Warning" },
    { metric: "Overdue EDD Reviews", current: 87, threshold: 100, limit: 150, status: "Within" },
  ];

  // 13. Model Risk Scorecard
  const modelScorecard = [
    { model: "Customer Risk Rating", accuracy: "94.5%", precision: "92.3%", recall: "89.7%", lastVal: "Jan 2026", status: "Active" },
    { model: "Transaction Monitoring", accuracy: "91.2%", precision: "88.9%", recall: "85.4%", lastVal: "Dec 2025", status: "Active" },
    { model: "PEP Screening", accuracy: "98.8%", precision: "95.2%", recall: "93.6%", lastVal: "Jan 2026", status: "Active" },
    { model: "Sanctions Screening", accuracy: "99.2%", precision: "97.4%", recall: "96.8%", lastVal: "Jan 2026", status: "Active" },
    { model: "Adverse Media Detection", accuracy: "82.4%", precision: "78.9%", recall: "75.3%", lastVal: "Nov 2025", status: "Calibration" },
  ];

  const getRiskColor = (val: number) => {
    if (val > 60) return "bg-red-500";
    if (val > 30) return "bg-orange-500";
    return "bg-emerald-500";
  };

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Risk Management Dashboard</h1>
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

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiData.map((kpi, idx) => {
           const Icon = kpi.icon;
           return (
             <Card key={idx} className="p-4 border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</h3>
                   </div>
                   <div className={`p-2 rounded-full ${kpi.color === 'red' ? 'bg-red-50 text-red-600' : kpi.color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                      <Icon className="size-4" />
                   </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                   <span className="text-gray-400">{kpi.subtext}</span>
                   <span className={`font-medium ${kpi.change.includes('+') ? 'text-red-600' : 'text-gray-600'}`}>{kpi.change}</span>
                </div>
                <div className={`absolute bottom-0 left-0 h-1 bg-${kpi.color}-500 transition-all duration-500 w-0 group-hover:w-full`} />
             </Card>
           );
        })}
        
        {/* Risk Assessment Completion Card */}
        <Card className="p-4 border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
           <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Assessment Completion</p>
              <Target className="size-4 text-blue-500" />
           </div>
           <div className="flex items-center justify-center py-2">
              <div className="relative size-16">
                 <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-[#2A53A0]" strokeDasharray={`${riskAssessmentCompletion.value}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                 </svg>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-sm font-bold text-gray-900">{riskAssessmentCompletion.value}%</span>
                 </div>
              </div>
           </div>
           <div className="text-center text-xs text-gray-500">
              Target: {riskAssessmentCompletion.target}% <span className="text-orange-500">({riskAssessmentCompletion.gap}% gap)</span>
           </div>
        </Card>
      </div>

      {/* Row 2: Breakdowns - Risk Distribution, Business Line, Geography */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         {/* Customer Risk Distribution (Pie) */}
         <Card className="border-gray-200 dark:border-gray-800 shadow-sm p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
               <h3 className="font-semibold text-gray-900">Customer Risk Distribution</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center">
               <div className="h-[180px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={riskDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                           {riskDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                     <p className="text-xl font-bold text-gray-900">Total</p>
                     <p className="text-xs text-gray-500">Risk Score</p>
                  </div>
               </div>
               <div className="flex justify-center gap-4 mt-2">
                  {riskDistribution.map((item, i) => (
                     <div key={i} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}</span>
                     </div>
                  ))}
               </div>
            </div>
         </Card>

         {/* NEW: High-Risk by Business Line */}
         <Card className="border-gray-200 dark:border-gray-800 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-gray-900">High-Risk by Business Line</h3>
               <Briefcase className="size-4 text-gray-400" />
            </div>
            <div className="space-y-4">
               {highRiskBusinessLine.map((item, i) => (
                  <div key={i} className="space-y-1">
                     <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="text-gray-500">{item.value} ({item.percentage}%)</span>
                     </div>
                     <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                           className="h-full rounded-full transition-all duration-500" 
                           style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </Card>

         {/* High Risk by Geography */}
         <Card className="border-gray-200 dark:border-gray-800 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-gray-900">High-Risk by Geography</h3>
               <Globe className="size-4 text-gray-400" />
            </div>
            <div className="space-y-4">
               {highRiskGeo.slice(0, 5).map((geo, i) => (
                  <div key={i} className="space-y-1">
                     <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-gray-700">{geo.region}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${geo.risk === 'Critical' ? 'bg-red-100 text-red-700' : geo.risk === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>{geo.risk}</span>
                     </div>
                     <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${geo.percentage}%`, backgroundColor: geo.color }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      </div>

      {/* Row 3: Risk Alert Trend (Full Width) */}
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm p-4">
         <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Customer Risk Trend (6-Month)</h3>
            <div className="flex items-center gap-4 text-xs">
               <span className="flex items-center gap-1.5"><div className="w-3 h-1 bg-red-500 rounded-full" /> High Risk</span>
               <span className="flex items-center gap-1.5"><div className="w-3 h-1 bg-yellow-500 rounded-full" /> Medium Risk</span>
               <span className="flex items-center gap-1.5"><div className="w-3 h-1 bg-emerald-500 rounded-full" /> Low Risk</span>
            </div>
         </div>
         <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={riskTrendData}>
                  <defs>
                     <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                     contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                  />
                  <Area type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} fill="url(#colorHigh)" stackId="1" />
                  <Area type="monotone" dataKey="medium" stroke="#f59e0b" strokeWidth={2} fill="#f59e0b" fillOpacity={0.1} stackId="1" />
                  <Area type="monotone" dataKey="low" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.05} stackId="1" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </Card>

      {/* Row 4: Migration Matrix & Product Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         {/* Risk Rating Migration Matrix */}
         <Card className="border-gray-200 dark:border-gray-800 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Risk Rating Migration Matrix</h3>
            <div className="relative">
               <div className="absolute top-0 left-16 right-0 text-center text-xs font-medium text-gray-500 uppercase">To Rating →</div>
               <div className="absolute left-0 top-16 bottom-0 w-8 -rotate-90 text-center text-xs font-medium text-gray-500 uppercase flex items-center justify-center">From Rating</div>
               
               <div className="ml-8 mt-6">
                  <div className="grid grid-cols-4 gap-2">
                     <div className="col-start-2 text-center text-xs font-bold text-gray-600">Low</div>
                     <div className="text-center text-xs font-bold text-gray-600">Medium</div>
                     <div className="text-center text-xs font-bold text-gray-600">High</div>

                     {migrationMatrix.rows.map((row, i) => (
                        <Fragment key={i}>
                           <div className="flex items-center justify-end text-xs font-bold text-gray-600 pr-2">{row.from}</div>
                           <div className="bg-green-50 rounded p-2 text-center border border-green-100">
                              <div className="text-lg font-bold text-green-700">{row.to.low}</div>
                              <div className="text-[10px] text-green-600">migrated</div>
                           </div>
                           <div className="bg-yellow-50 rounded p-2 text-center border border-yellow-100">
                              <div className="text-lg font-bold text-yellow-700">{row.to.medium}</div>
                              <div className="text-[10px] text-yellow-600">stable</div>
                           </div>
                           <div className="bg-red-50 rounded p-2 text-center border border-red-100">
                              <div className="text-lg font-bold text-red-700">{row.to.high}</div>
                              <div className="text-[10px] text-red-600">migrated</div>
                           </div>
                        </Fragment>
                     ))}
                  </div>
               </div>
               <div className="flex justify-center gap-4 mt-4 text-xs">
                  <span className="flex items-center"><div className="w-2 h-2 bg-green-200 mr-1 rounded-sm"></div> Low</span>
                  <span className="flex items-center"><div className="w-2 h-2 bg-yellow-200 mr-1 rounded-sm"></div> Medium</span>
                  <span className="flex items-center"><div className="w-2 h-2 bg-red-200 mr-1 rounded-sm"></div> High</span>
               </div>
            </div>
         </Card>

         {/* High Risk by Product & PEP */}
         <div className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-800 shadow-sm p-4">
               <h3 className="font-semibold text-gray-900 mb-4">High-Risk by Product</h3>
               <div className="grid grid-cols-2 gap-2 h-[160px]">
                  {highRiskProducts.map((product, i) => (
                     <div key={i} className="rounded-lg p-3 text-white flex flex-col justify-between" style={{ backgroundColor: product.color }}>
                        <span className="text-xs font-medium opacity-90">{product.name}</span>
                        <span className="text-xl font-bold">{product.value}</span>
                     </div>
                  ))}
               </div>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 shadow-sm p-4">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">PEP Distribution</h3>
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div className="h-[140px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie data={pepByType} innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value">
                               {pepByType.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="space-y-2 text-xs">
                      {pepByType.map((item, i) => (
                         <div key={i} className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} /> {item.name}</span>
                            <span className="font-bold">{item.value}%</span>
                         </div>
                      ))}
                   </div>
               </div>
            </Card>
         </div>
      </div>

      {/* Row 5: Operational Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         {/* EDD & CDD */}
         <Card className="lg:col-span-2 border-gray-200 dark:border-gray-800 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Customer Due Diligence Status</h3>
            <ResponsiveContainer width="100%" height={250}>
               <BarChart data={cddStatus} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 12 }} axisLine={false} />
                  <Tooltip />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" barSize={20} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" barSize={20} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="overdue" name="Overdue" stackId="a" fill="#ef4444" barSize={20} radius={[0, 4, 4, 0]} />
               </BarChart>
            </ResponsiveContainer>
         </Card>

         {/* Adverse Media Hits */}
         <Card className="border-gray-200 dark:border-gray-800 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Adverse Media Hits Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
               <LineChart data={adverseMediaTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="hits" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
               </LineChart>
            </ResponsiveContainer>
         </Card>
      </div>

      {/* Row 6: Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         {/* Radar Chart */}
         <Card className="border-gray-200 dark:border-gray-800 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Risk Factor Analysis</h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskFactorData}>
                     <PolarGrid opacity={0.2} />
                     <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                     <Radar name="Risk Score" dataKey="A" stroke="#2A53A0" fill="#2A53A0" fillOpacity={0.3} />
                     <Tooltip />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
         </Card>
         
         {/* Emerging Risks */}
         <Card className="border-gray-200 dark:border-gray-800 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Emerging Risk Indicators</h3>
            <div className="grid grid-cols-1 gap-4">
               <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-xs font-bold text-red-700">Crypto Trading</span>
                     <TrendingUp className="size-3 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-800">145</div>
                  <div className="text-[10px] text-red-600">+28% vs last month</div>
               </div>
               <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-xs font-bold text-orange-700">Shell Companies</span>
                     <TrendingUp className="size-3 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-800">89</div>
                  <div className="text-[10px] text-orange-600">+12% vs last month</div>
               </div>
               <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-xs font-bold text-yellow-700">Trade Violations</span>
                     <TrendingUp className="size-3 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-800">54</div>
                  <div className="text-[10px] text-yellow-600">+5% vs last month</div>
               </div>
            </div>
         </Card>

         {/* Country Risk Matrix */}
         <Card className="border-gray-200 dark:border-gray-800 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Country Risk Matrix</h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
               {countryRiskMatrix.map((country, i) => (
                  <div key={i} className="flex items-center justify-between text-xs border-b border-gray-100 pb-2 last:border-0">
                     <span className="font-medium text-gray-700">{country.country}</span>
                     <div className="flex gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] text-white ${getRiskColor(country.trade)}`}>T</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] text-white ${getRiskColor(country.wire)}`}>W</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] text-white ${getRiskColor(country.fx)}`}>F</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] text-white ${getRiskColor(country.cash)}`}>C</span>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      </div>
    </motion.div>
  );
}
