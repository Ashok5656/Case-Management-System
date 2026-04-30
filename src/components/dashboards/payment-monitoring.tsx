import { motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Filter,
  Globe,
  MoreHorizontal,
  RefreshCw as Renew,
  Search,
  Shield,
  ShieldAlert,
  Timer,
  TrendingUp,
  Wallet,
  Zap,
  Ban,
  Gauge
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
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Treemap
} from "recharts";
import { cn } from "../ui/utils";
import { useSortableData } from "../../hooks/use-sortable-data";
import { SortableHeader } from "../ui/sortable-header";

// Custom Treemap Content
const TreemapContent = (props: any) => {
  const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: colors[index % colors.length],
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {width > 30 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
        >
          {name}
        </text>
      )}
    </g>
  );
};

export function PaymentMonitoring({ breadcrumbs, onBreadcrumbNavigate }: { breadcrumbs?: any[], onBreadcrumbNavigate?: (path: string) => void }) {
  // 0. KPI Cards Data
  const paymentKpis = [
    {
      title: "Total Payments Processed",
      value: "47,850",
      subValue: "Value: ₹34,567 Cr",
      change: "+ 5.9% vs yesterday",
      trend: "up",
      icon: FileText,
      colorIdx: 0, // Blue
      type: "standard"
    },
    {
      title: "Payments Held for Review",
      value: "448",
      subValue: "Avg hold: 4.2 hrs",
      change: "~ 8.5% from avg",
      trend: "neutral", // Orange
      icon: Clock,
      colorIdx: 3, // Orange
      type: "standard"
    },
    {
      title: "Payments Blocked (Today)",
      value: "127",
      subValue: "Value: ₹2,345 Cr",
      extra: "Top: Sanctions Match (45)",
      change: null, // No badge logic for this one in image, but let's keep consistent layout
      trend: null,
      icon: Ban,
      colorIdx: 4, // Red
      type: "blocked"
    },
    {
      title: "Avg Payment Release Time",
      value: "3.8 hrs",
      subValue: "Target: 4 hrs",
      change: "↘ 5.2% vs target",
      trend: "down", // Green (good)
      icon: Timer,
      colorIdx: 5, // Purple? Image shows green text for trend. Icon is purple.
      type: "standard"
    },
    {
      title: "Processing SLA Compliance",
      value: "96.8 %",
      subValue: "Target: 95%",
      change: null,
      trend: null,
      icon: Gauge,
      colorIdx: 1, // Green
      type: "progress",
      progress: 96.8
    }
  ];

  // New Charts Data
  // Hourly Volume Trend
  const hourlyVolumeTrend = [
    { time: "00:00", value: 1200 }, { time: "02:00", value: 900 }, { time: "04:00", value: 600 },
    { time: "06:00", value: 1800 }, { time: "08:00", value: 3500 }, { time: "10:00", value: 5800 },
    { time: "12:00", value: 6200 }, { time: "14:00", value: 5500 }, { time: "16:00", value: 4200 },
    { time: "18:00", value: 2800 }, { time: "20:00", value: 1800 }, { time: "22:00", value: 1400 },
  ];

  // High Value Payment Trend (Daily)
  const highValueTrend = [
    { date: "Jan 27", count: 135 },
    { date: "Jan 28", count: 155 },
    { date: "Jan 29", count: 125 },
    { date: "Jan 30", count: 175 },
    { date: "Jan 31", count: 185 },
    { date: "Feb 1", count: 165 },
    { date: "Feb 2", count: 150 },
  ];

  // 1. Volume by Channel
  const volumeByChannel = [
    { name: "RTGS", value: 12450, fill: "#8b5cf6" },
    { name: "NEFT", value: 38900, fill: "#8b5cf6" },
    { name: "IMPS", value: 28000, fill: "#8b5cf6" },
    { name: "UPI", value: 124000, fill: "#7c3aed" }, // Highlighted as highest
    { name: "SWIFT", value: 4500, fill: "#a78bfa" },
    { name: "ACH", value: 15600, fill: "#8b5cf6" },
  ];

  // 2. Volume by Currency (TreeMap data structure)
  const volumeByCurrency = [
    { name: "INR", size: 450000, fill: "#2563eb" }, // Blue
    { name: "USD", size: 380000, fill: "#7c3aed" }, // Purple
    { name: "EUR", size: 150000, fill: "#f97316" }, // Orange
    { name: "AUD", size: 80000, fill: "#eab308" },  // Yellow
    { name: "GBP", size: 120000, fill: "#10b981" }, // Green
    { name: "SGD", size: 60000, fill: "#ec4899" },  // Pink
    { name: "JPY", size: 50000, fill: "#64748b" },  // Grey
  ];

  // 3. Origin/Dest Countries
  const originCountries = [
    { country: "India (Domestic)", risk: "LOW", count: 38500, amount: "₹280.90 Cr", percent: 81.4, color: "bg-green-500" },
    { country: "United States", risk: "LOW", count: 2240, amount: "₹45.80 Cr", percent: 4.9, color: "bg-green-500" },
    { country: "United Kingdom", risk: "LOW", count: 1800, amount: "₹34.20 Cr", percent: 4.0, color: "bg-green-500" },
    { country: "UAE", risk: "MEDIUM", count: 1450, amount: "₹21.50 Cr", percent: 3.5, color: "bg-orange-500" },
  ];

  const destCountries = [
    { country: "India (Domestic)", risk: "LOW", count: 30200, amount: "₹209.08 Cr", percent: 85.6, color: "bg-green-500" },
    { country: "United States", risk: "LOW", count: 2150, amount: "₹42.20 Cr", percent: 4.5, color: "bg-green-500" },
    { country: "UAE", risk: "MEDIUM", count: 1970, amount: "₹32.80 Cr", percent: 4.7, color: "bg-orange-500" },
    { country: "United Kingdom", risk: "LOW", count: 1520, amount: "₹28.40 Cr", percent: 3.2, color: "bg-green-500" },
  ];

  // 4. High Risk Corridor
  const highRiskCorridor = [
    { name: "IND->Panama", value: 12 },
    { name: "IND->Singapore", value: 24 },
    { name: "IND->Australia", value: 35 },
    { name: "IND->UK", value: 48 },
    { name: "IND->UAE", value: 85 },
  ];

  // 5. Payment Holds
  const holdReasons = [
    { name: "Sanctions Screening", value: 145, fill: "#f97316" },
    { name: "High-Risk Country", value: 102, fill: "#ef4444" },
    { name: "Unusual Pattern", value: 89, fill: "#8b5cf6" },
    { name: "Missing Info", value: 58, fill: "#3b82f6" },
    { name: "PEP Match", value: 34, fill: "#10b981" },
    { name: "Other", value: 12, fill: "#64748b" },
  ];

  // 6. Hold Aging
  const holdAging = [
    { range: "0-2h", count: 180 },
    { range: "2-4h", count: 145 },
    { range: "4-8h", count: 98 },
    { range: "8-24h", count: 45 },
    { range: ">24h", count: 12 },
  ];

  // 7. Trends
  const rejectionTrend = [
    { date: "Jan 07", rate: 2.2 }, { date: "Jan 14", rate: 2.8 }, { date: "Jan 21", rate: 2.4 },
    { date: "Jan 28", rate: 3.1 }, { date: "Feb 04", rate: 2.9 }, { date: "Feb 11", rate: 2.7 },
  ];
  const sanctionsHitRate = [
    { date: "Jan 07", rate: 0.8 }, { date: "Jan 14", rate: 1.2 }, { date: "Jan 21", rate: 0.9 },
    { date: "Jan 28", rate: 1.1 }, { date: "Feb 04", rate: 1.0 }, { date: "Feb 11", rate: 1.1 },
  ];

  // 8. Round Amount
  const roundAmountData = [
    { amount: "100", count: 120 }, { amount: "500", count: 240 }, { amount: "1000", count: 80 },
    { amount: "5000", count: 180 }, { amount: "10000", count: 60 }, { amount: "50000", count: 110 },
    { amount: "1L", count: 40 }, { amount: "5L", count: 20 },
  ];

  // 9. Scatter - Rapid Movement
  const rapidMovement = [
    { x: 10, y: 20, z: 100, risk: "low" }, { x: 30, y: 40, z: 200, risk: "medium" }, { x: 50, y: 80, z: 500, risk: "high" },
    { x: 15, y: 25, z: 120, risk: "low" }, { x: 35, y: 45, z: 220, risk: "medium" }, { x: 55, y: 85, z: 550, risk: "high" },
    { x: 12, y: 22, z: 110, risk: "low" }, { x: 32, y: 42, z: 210, risk: "medium" }, { x: 52, y: 82, z: 520, risk: "high" },
  ];

  // 10. Velocity
  const velocityData = [
    { x: 10, y: 500 }, { x: 20, y: 450 }, { x: 30, y: 300 }, { x: 40, y: 200 },
    { x: 50, y: 100 }, { x: 60, y: 80 }, { x: 70, y: 50 },
  ];

  // 11. Cross Border Ratio
  const crossBorderData = [
    { date: "Jan 07", domestic: 400, cross: 50 }, { date: "Jan 14", domestic: 420, cross: 55 },
    { date: "Jan 21", domestic: 410, cross: 48 }, { date: "Jan 28", domestic: 440, cross: 60 },
    { date: "Feb 04", domestic: 430, cross: 52 }, { date: "Feb 11", domestic: 450, cross: 58 },
  ];

  // 12. Heatmap (Mock Data 7x24)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const heatmapGrid = days.map(d => ({
    day: d,
    hours: hours.map(h => Math.floor(Math.random() * 100))
  }));

  const getHeatmapColor = (val: number) => {
    if (val > 80) return "bg-red-500";
    if (val > 60) return "bg-orange-500";
    if (val > 40) return "bg-yellow-400";
    return "bg-green-400";
  };

  // 13. Tables
  const swiftData = [
    { ref: "FT230127001", sender: "ABC Corp", beneficiary: "XYZ Ltd", amount: "12.5K USD", status: "Cleared", risk: 25 },
    { ref: "FT230127002", sender: "DEF Inc", beneficiary: "PQR Pvt", amount: "5.8K EUR", status: "Held", risk: 88 },
    { ref: "FT230127003", sender: "GHI LLC", beneficiary: "MNO Ltd", amount: "12.2K USD", status: "Flagged", risk: 65 },
    { ref: "FT230127004", sender: "JKL Corp", beneficiary: "RST Inc", amount: "2.2K GBP", status: "Cleared", risk: 32 },
    { ref: "FT230127005", sender: "UVW Ltd", beneficiary: "STU Pvt", amount: "9.5K USD", status: "Held", risk: 72 },
  ];

  const topHolds = [
    { ref: "PH230201", customer: "Global Traders Ltd", amount: "18.5K USD", reason: "Sanctions Screening", duration: "2.5 hrs", risk: 78 },
    { ref: "PH230202", customer: "International Corp", amount: "35.0K EUR", reason: "High-Risk Country", duration: "2.0 hrs", risk: 85 },
    { ref: "PH230203", customer: "Overseas Investment", amount: "22.4K USD", reason: "PEP Match", duration: "1.5 hrs", risk: 92 },
    { ref: "PH230204", customer: "Trading Partners Inc", amount: "26.7K GBP", reason: "Unusual Pattern", duration: "18 hrs", risk: 65 },
    { ref: "PH230205", customer: "Export Solutions", amount: "24.5K USD", reason: "Missing Info", duration: "4.5 hrs", risk: 56 },
  ];

  const { items: sortedSwift, requestSort: sortSwift, sortConfig: swiftSortConfig } = useSortableData(swiftData);
  const { items: sortedHolds, requestSort: sortHolds, sortConfig: holdsSortConfig } = useSortableData(topHolds);

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Monitoring</h1>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />
            <Select defaultValue="global">
               <SelectTrigger className="w-[180px] h-[46px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-lg hover:border-[#2A53A0] dark:hover:border-[#6b93e6] transition-all shadow-sm">
                  <SelectValue placeholder="Region" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="apac">APAC</SelectItem>
                  <SelectItem value="emea">EMEA</SelectItem>
                  <SelectItem value="americas">Americas</SelectItem>
               </SelectContent>
            </Select>
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
           <button className="flex items-center gap-2 px-4 h-[46px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-[#2A53A0] dark:hover:border-[#6b93e6] transition-all shadow-sm">
             <Calendar className="size-4 text-[#2A53A0] dark:text-[#6b93e6]" />
             <span className="text-sm text-gray-700 dark:text-gray-300">Last 7 Days</span>
             <ChevronDown className="size-4 text-gray-500" />
           </button>
           <button className="flex items-center gap-2 px-4 h-[46px] bg-[#2A53A0] hover:bg-[#1e3a70] dark:bg-[#6b93e6] dark:hover:bg-[#5577cc] text-white rounded-lg transition-all shadow-sm">
             <span className="text-sm">Export</span>
             <Download className="size-4" />
           </button>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {paymentKpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const colorMap = {
            0: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", badge: "text-green-600 bg-transparent border-none px-0" }, // Blue icon, Green trend text
            1: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", badge: "text-emerald-600 bg-transparent border-none px-0" },
            2: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400", badge: "text-indigo-600 bg-transparent border-none px-0" },
            3: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", badge: "text-orange-600 bg-transparent border-none px-0" },
            4: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", badge: "text-red-600 bg-transparent border-none px-0" },
            5: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", badge: "text-green-600 bg-transparent border-none px-0" }, // Purple icon, Green trend text
          } as Record<number, { bg: string, text: string, badge: string }>;
          
          const colors = colorMap[kpi.colorIdx] || colorMap[0];

          return (
            <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm h-full flex flex-col justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-3">
                     <div className={`p-1.5 rounded-md ${colors.bg}`}>
                       <Icon className={`size-4 ${colors.text}`} />
                     </div>
                     <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{kpi.title}</span>
                   </div>
                   
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{kpi.value}</h3>
                   
                   {/* Subtext Logic */}
                   {kpi.type === 'blocked' ? (
                      <div className="space-y-1">
                         <p className="text-xs text-gray-500">{kpi.subValue}</p>
                         <p className="text-[10px] text-gray-400">{kpi.extra}</p>
                      </div>
                   ) : (
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500">{kpi.subValue}</p>
                        {kpi.change && (
                           <span className={cn("text-xs font-medium mt-1", colors.badge)}>
                              {kpi.change}
                           </span>
                        )}
                      </div>
                   )}
                </div>

                {/* Progress Bar for Type 'progress' */}
                {kpi.type === 'progress' && (
                   <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: `${kpi.progress}%` }}></div>
                   </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Row 2: New Panels (Volume Trend & High Value) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         {/* Payment Volume Trend (Area Chart) - Takes 2 cols */}
         <Card className="lg:col-span-2 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Payment Volume Trend (Today)</h3>
               </div>
               <span className="text-xs text-gray-400">Hourly breakdown</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
               <AreaChart data={hourlyVolumeTrend}>
                  <defs>
                     <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="time" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val} />
                  <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVol)" />
               </AreaChart>
            </ResponsiveContainer>
         </Card>

         {/* High-Value Payment Trend (Line Chart) - Takes 1 col */}
         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">High-Value Payment Trend</h3>
               </div>
               <span className="text-xs text-gray-400">Threshold: ₹1 Cr</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
               <LineChart data={highValueTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} domain={[0, 250]} />
                  <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="plainline" />
                  <Line name="Payment Count" type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={{r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff"}} />
               </LineChart>
            </ResponsiveContainer>
         </Card>
      </div>

      {/* Row 3 (Previously Row 1): Volume Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Payment Volume by Channel */}
        <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
              <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Payment Volume by Channel</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeByChannel}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" tick={{fontSize: 11}} />
              <YAxis tick={{fontSize: 11}} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
              <Bar dataKey="value" radius={[4,4,0,0]}>
                {volumeByChannel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Volume by Currency - Treemap */}
        <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <DollarSign className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
              <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Payment Volume by Currency</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <Treemap
              data={volumeByCurrency}
              dataKey="size"
              stroke="#fff"
              fill="#8884d8"
              content={<TreemapContent colors={volumeByCurrency.map(c => c.fill)} />}
            />
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2: Origin & Destination Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Globe className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
              <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Payments by Originating Country</h3>
            </div>
            <span className="text-xs text-gray-500">42,000 payments</span>
          </div>
          <div className="space-y-4">
            {originCountries.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-2">
                     <span className="font-medium text-gray-900 dark:text-gray-100">{item.country}</span>
                     <Badge variant="secondary" className={cn("text-[10px] px-1 h-4", 
                        item.risk === "LOW" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                     )}>{item.risk}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-gray-500">{item.count.toLocaleString()} payments</span>
                     <span className="font-bold text-gray-900 dark:text-gray-100">{item.amount}</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                   <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Globe className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
              <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Payments by Destination Country</h3>
            </div>
            <span className="text-xs text-gray-500">46,120 payments</span>
          </div>
          <div className="space-y-4">
            {destCountries.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-2">
                     <span className="font-medium text-gray-900 dark:text-gray-100">{item.country}</span>
                     <Badge variant="secondary" className={cn("text-[10px] px-1 h-4", 
                        item.risk === "LOW" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                     )}>{item.risk}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-gray-500">{item.count.toLocaleString()} payments</span>
                     <span className="font-bold text-gray-900 dark:text-gray-100">{item.amount}</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                   <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Risks & Holds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
               <ShieldAlert className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
               <h3 className="text-gray-900 dark:text-white font-semibold text-lg">High-Risk Corridor Volume</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
               <BarChart data={highRiskCorridor} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                  <XAxis type="number" fontSize={11} />
                  <YAxis dataKey="name" type="category" width={80} fontSize={11} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Bar dataKey="value" fill="#f97316" radius={[0,4,4,0]} barSize={20} />
               </BarChart>
            </ResponsiveContainer>
         </Card>

         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
               <AlertTriangle className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
               <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Payment Holds by Reason</h3>
            </div>
            <div className="flex flex-col items-center">
               <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                     <Pie data={holdReasons} innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={2}>
                        {holdReasons.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                     </Pie>
                     <Tooltip />
                     <Legend wrapperStyle={{fontSize: '10px'}} iconSize={8} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
               <Clock className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
               <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Payment Hold Aging</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
               <BarChart data={holdAging}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="range" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Bar dataKey="count" fill="#ea580c" radius={[4,4,0,0]} barSize={30} />
               </BarChart>
            </ResponsiveContainer>
         </Card>
      </div>

      {/* Row 4: Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <Activity className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Payment Rejection Rate</h3>
               </div>
               <span className="text-xs text-red-500 font-medium">Avg: 2.8%</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
               <LineChart data={rejectionTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis fontSize={11} domain={[0, 5]} />
                  <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} dot={{r: 3}} />
               </LineChart>
            </ResponsiveContainer>
         </Card>

         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <Shield className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Sanctions Hit Rate</h3>
               </div>
               <span className="text-xs text-orange-500 font-medium">Avg: 1.1%</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
               <LineChart data={sanctionsHitRate}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis fontSize={11} domain={[0, 2]} />
                  <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Line type="monotone" dataKey="rate" stroke="#f97316" strokeWidth={2} dot={{r: 3}} />
               </LineChart>
            </ResponsiveContainer>
         </Card>

         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <CreditCard className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Round Amount Detection</h3>
               </div>
               <span className="text-xs text-gray-500">270 flagged</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
               <BarChart data={roundAmountData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="amount" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Bar dataKey="count" fill="#10b981" radius={[2,2,0,0]} barSize={20} />
               </BarChart>
            </ResponsiveContainer>
         </Card>
      </div>

      {/* Row 5: Scatter & Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
               <Zap className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
               <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Rapid Movement Detection</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
               <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Speed" unit="m/s" fontSize={11} />
                  <YAxis type="number" dataKey="y" name="Frequency" fontSize={11} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Scatter name="Transactions" data={rapidMovement} fill="#8884d8">
                     {rapidMovement.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.risk === 'high' ? '#ef4444' : entry.risk === 'medium' ? '#f59e0b' : '#10b981'} />
                     ))}
                  </Scatter>
               </ScatterChart>
            </ResponsiveContainer>
         </Card>

         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
               <TrendingUp className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
               <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Payment Velocity by Customer</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
               <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" fontSize={11} />
                  <YAxis type="number" dataKey="y" fontSize={11} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Scatter name="Velocity" data={velocityData} fill="#000" />
               </ScatterChart>
            </ResponsiveContainer>
         </Card>
      </div>

      {/* Row 6: Cross-Border & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
               <Globe className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
               <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Cross-Border vs. Domestic Ratio</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
               <AreaChart data={crossBorderData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Area type="monotone" dataKey="domestic" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="cross" stackId="1" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} />
               </AreaChart>
            </ResponsiveContainer>
         </Card>

         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
               <Activity className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
               <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Unusual Payment Patterns Alert</h3>
            </div>
            <div className="flex flex-col gap-1">
               {heatmapGrid.map((row, i) => (
                  <div key={i} className="flex gap-1 items-center">
                     <span className="w-8 text-[10px] text-gray-500 font-medium">{row.day}</span>
                     <div className="flex gap-1 flex-1">
                        {row.hours.map((val, j) => (
                           <div key={j} className={cn("flex-1 h-4 rounded-sm", getHeatmapColor(val))} title={`${val}% risk`} />
                        ))}
                     </div>
                  </div>
               ))}
               <div className="flex justify-between pl-8 mt-1">
                  <span className="text-[10px] text-gray-400">00:00</span>
                  <span className="text-[10px] text-gray-400">12:00</span>
                  <span className="text-[10px] text-gray-400">23:59</span>
               </div>
            </div>
         </Card>
      </div>

      {/* Row 7: Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <FileText className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">SWIFT MT103 Analysis</h3>
               </div>
               <Badge variant="outline" className="text-xs">5 wire transfers</Badge>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500">
                     <tr>
                        <th className="px-3 py-2"><SortableHeader column="ref" label="Reference" sortConfig={swiftSortConfig} onSort={sortSwift} /></th>
                        <th className="px-3 py-2"><SortableHeader column="sender" label="Sender" sortConfig={swiftSortConfig} onSort={sortSwift} /></th>
                        <th className="px-3 py-2"><SortableHeader column="amount" label="Amount" sortConfig={swiftSortConfig} onSort={sortSwift} /></th>
                        <th className="px-3 py-2"><SortableHeader column="status" label="Status" sortConfig={swiftSortConfig} onSort={sortSwift} /></th>
                        <th className="px-3 py-2 text-right"><SortableHeader column="risk" label="Risk" sortConfig={swiftSortConfig} onSort={sortSwift} className="justify-end" /></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {sortedSwift.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                           <td className="px-3 py-2 font-medium">{row.ref}</td>
                           <td className="px-3 py-2 text-gray-600">{row.sender}</td>
                           <td className="px-3 py-2 font-bold">{row.amount}</td>
                           <td className="px-3 py-2">
                              <span className={cn("px-1.5 py-0.5 rounded text-[10px]", 
                                 row.status === "Cleared" ? "bg-green-100 text-green-700" :
                                 row.status === "Held" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                              )}>{row.status}</span>
                           </td>
                           <td className={cn("px-3 py-2 text-right font-bold", 
                              row.risk > 70 ? "text-red-600" : "text-green-600"
                           )}>{row.risk}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>

         <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Top 10 Payment Holds by Value</h3>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500">
                     <tr>
                        <th className="px-3 py-2"><SortableHeader column="customer" label="Customer" sortConfig={holdsSortConfig} onSort={sortHolds} /></th>
                        <th className="px-3 py-2"><SortableHeader column="amount" label="Amount" sortConfig={holdsSortConfig} onSort={sortHolds} /></th>
                        <th className="px-3 py-2"><SortableHeader column="reason" label="Reason" sortConfig={holdsSortConfig} onSort={sortHolds} /></th>
                        <th className="px-3 py-2 text-right"><SortableHeader column="risk" label="Risk" sortConfig={holdsSortConfig} onSort={sortHolds} className="justify-end" /></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {sortedHolds.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                           <td className="px-3 py-2 font-medium">{row.customer}</td>
                           <td className="px-3 py-2 font-bold">{row.amount}</td>
                           <td className="px-3 py-2 text-gray-600">{row.reason}</td>
                           <td className={cn("px-3 py-2 text-right font-bold", 
                              row.risk > 80 ? "text-red-600" : "text-orange-600"
                           )}>{row.risk}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>
      </div>

    </motion.div>
  );
}
