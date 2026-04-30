import { motion } from "motion/react";
import {
  FileText,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Download,
  Target,
  Globe,
  Briefcase,
  ChevronDown,
  RefreshCw as Renew
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { useState } from "react";
import { BreadcrumbNav } from "../breadcrumb-nav";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface ExecutiveSummaryProps {
  breadcrumbs?: BreadcrumbItem[];
  onBreadcrumbNavigate?: (path: string) => void;
}

export function ExecutiveSummary({ breadcrumbs, onBreadcrumbNavigate }: ExecutiveSummaryProps) {
  const [dateRange, setDateRange] = useState("This Quarter");

  const monthlyFraudPrevention = [
    { month: "Jan", prevented: 45, attempted: 48 },
    { month: "Feb", prevented: 52, attempted: 55 },
    { month: "Mar", prevented: 48, attempted: 51 },
    { month: "Apr", prevented: 60, attempted: 62 },
    { month: "May", prevented: 58, attempted: 60 },
    { month: "Jun", prevented: 65, attempted: 68 },
  ];

  const complianceScores = [
    { region: "North America", score: 98 },
    { region: "Europe", score: 96 },
    { region: "APAC", score: 92 },
    { region: "LATAM", score: 94 },
    { region: "MEA", score: 90 },
  ];

  const operationalEfficiency = [
    { name: "Cost of Compliance", value: 35, color: "#2A53A0" },
    { name: "Fraud Losses", value: 15, color: "#ef4444" },
    { name: "Operational Overhead", value: 25, color: "#f59e0b" },
    { name: "Technology Investment", value: 25, color: "#10b981" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        {/* Left Side: Context Controls */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Executive Overview</h1>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />
          {/* Region Filter */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-3 h-[46px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-[#2A53A0] dark:hover:border-[#6b93e6] transition-all"
          >
            <Globe className="size-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">All Regions</span>
            <ChevronDown className="size-3 text-gray-400" />
          </motion.button>

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
            <Calendar className="size-4 text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{dateRange}</span>
          </button>
          <button className="flex items-center gap-2 px-4 h-[46px] bg-[#2A53A0] text-white rounded-lg shadow-sm hover:bg-[#1e3a70] dark:bg-[#6b93e6] dark:hover:bg-[#5577cc] transition-all">
            <span className="text-sm">Download PDF</span>
            <Download className="size-4" />
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
           <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                 <ShieldCheck className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                 <TrendingUp className="size-3" /> +15% YoY
              </Badge>
           </div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">₹124.5M</h2>
           <p className="text-sm text-gray-500">Total Fraud Prevented</p>
        </Card>

        <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
           <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                 <Target className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                 <Target className="size-3" /> Exceeds Target
              </Badge>
           </div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">96.2%</h2>
           <p className="text-sm text-gray-500">Global Compliance Score</p>
        </Card>

        <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
           <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                 <Briefcase className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
                 <TrendingUp className="size-3" /> Automation
              </Badge>
           </div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">₹42.8M</h2>
           <p className="text-sm text-gray-500">Operational Savings</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fraud Prevention Trend */}
        <Card className="p-4 border-gray-200 dark:border-gray-800">
           <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <DollarSign className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
               <h3 className="text-gray-900 dark:text-white">Fraud Prevention ROI (Millions)</h3>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Prevented</span>
               </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-500">Attempted</span>
               </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyFraudPrevention}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" tick={{fontSize: 12, fill: "#9ca3af"}} />
              <YAxis tick={{fontSize: 12, fill: "#9ca3af"}} />
              <Tooltip 
                cursor={{fill: 'transparent'}} 
                contentStyle={{ 
                  borderRadius: "8px", 
                  border: "1px solid #e5e7eb", 
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" 
                }}
              />
              <Bar dataKey="prevented" fill="#2A53A0" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="attempted" fill="#e5e7eb" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Regional Compliance */}
        <Card className="p-4 border-gray-200 dark:border-gray-800">
           <div className="flex items-center gap-2 mb-4">
              <Globe className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
              <h3 className="text-gray-900 dark:text-white">Regional Compliance Adherence</h3>
           </div>
           <div className="space-y-6">
              {complianceScores.map((region, index) => (
                <div key={index}>
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{region.region}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{region.score}%</span>
                   </div>
                   <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${region.score}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full rounded-full ${region.score >= 95 ? 'bg-[#2A53A0]' : region.score >= 90 ? 'bg-[#4A7BD0]' : 'bg-orange-500'}`}
                      />
                   </div>
                </div>
              ))}
           </div>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cost Distribution */}
          <Card className="p-4 border-gray-200 dark:border-gray-800">
             <div className="flex items-center gap-2 mb-4">
                <Briefcase className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                <h3 className="text-gray-900 dark:text-white">Cost Distribution</h3>
             </div>
             <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                   <Pie
                      data={operationalEfficiency}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                   >
                      {operationalEfficiency.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Pie>
                   <Tooltip 
                      contentStyle={{ 
                        borderRadius: "8px", 
                        border: "1px solid #e5e7eb", 
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" 
                      }}
                   />
                </PieChart>
             </ResponsiveContainer>
             <div className="grid grid-cols-2 gap-2 mt-4">
                {operationalEfficiency.map((item, index) => (
                   <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}} />
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                   </div>
                ))}
             </div>
          </Card>

          {/* Strategic Initiatives */}
          <Card className="lg:col-span-2 p-4 border-gray-200 dark:border-gray-800">
             <div className="flex items-center gap-2 mb-4">
                <Target className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                <h3 className="text-gray-900 dark:text-white">Strategic Initiatives Status</h3>
             </div>
             <div className="space-y-4">
                {[
                   { name: "AI Model Upgrade v2.0", progress: 85, status: "On Track", due: "June 2025" },
                   { name: "Global Watchlist Integration", progress: 40, status: "Delayed", due: "Aug 2025" },
                   { name: "Real-time Crypto Monitoring", progress: 15, status: "Started", due: "Dec 2025" },
                   { name: "Legacy System Migration", progress: 95, status: "Near Completion", due: "May 2025" }
                ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex-1">
                         <div className="flex justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                               item.status === "On Track" || item.status === "Near Completion" ? "bg-green-100 text-green-700" :
                               item.status === "Delayed" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                            }`}>{item.status}</span>
                         </div>
                         <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-[#2A53A0] rounded-full" style={{width: `${item.progress}%`}} />
                         </div>
                      </div>
                      <div className="text-right min-w-[80px]">
                         <p className="text-xs text-gray-500">Due</p>
                         <p className="text-xs font-medium text-gray-900 dark:text-white">{item.due}</p>
                      </div>
                   </div>
                ))}
             </div>
          </Card>
       </div>
    </motion.div>
  );
}
