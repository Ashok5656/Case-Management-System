import { motion } from "motion/react";
import {
  ShieldCheck,
  FileCheck,
  AlertOctagon,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  ArrowRight,
  ClipboardCheck,
  Scale,
  Clock
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
  AreaChart,
  Area
} from "recharts";
import { useState } from "react";
import { useSortableData } from "../../hooks/use-sortable-data";
import { SortableHeader } from "../ui/sortable-header";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface LoD2DashboardProps {
  breadcrumbs?: BreadcrumbItem[];
  onBreadcrumbNavigate?: (path: string) => void;
}

export function LoD2Dashboard({ breadcrumbs, onBreadcrumbNavigate }: LoD2DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // KPI Data
  const kpiStats = [
    {
      title: "QA Sample Rate",
      value: "15.2%",
      target: "Target: 15%",
      status: "good",
      icon: Scale,
      color: "emerald"
    },
    {
      title: "Policy Breaches",
      value: "3",
      target: "Monthly",
      status: "critical",
      icon: AlertOctagon,
      color: "red"
    },
    {
      title: "Assurance Score",
      value: "94.8%",
      target: "+1.2% vs last month",
      status: "good",
      icon: ShieldCheck,
      color: "blue"
    },
    {
      title: "Overdue Reviews",
      value: "12",
      target: "Requires Attention",
      status: "warning",
      icon: Clock,
      color: "orange"
    }
  ];

  // QA Trends Data
  const qaTrendData = [
    { month: "Jan", passRate: 92, defects: 15 },
    { month: "Feb", passRate: 94, defects: 12 },
    { month: "Mar", passRate: 93, defects: 14 },
    { month: "Apr", passRate: 95, defects: 8 },
    { month: "May", passRate: 96, defects: 6 },
    { month: "Jun", passRate: 94, defects: 9 }
  ];

  // Issue Severity Data
  const issueData = [
    { name: "Critical", count: 2, color: "#ef4444" },
    { name: "High", count: 8, color: "#f97316" },
    { name: "Medium", count: 15, color: "#eab308" },
    { name: "Low", count: 24, color: "#22c55e" }
  ];

  // Active Reviews List
  const activeReviews = [
    {
      id: "REV-2024-089",
      process: "KYC Onboarding",
      auditor: "Sarah Jenkins",
      status: "In Progress",
      progress: 65,
      dueDate: "Today"
    },
    {
      id: "REV-2024-092",
      process: "TM Alerts - High Risk",
      auditor: "Mike Ross",
      status: "Pending Review",
      progress: 90,
      dueDate: "Tomorrow"
    },
    {
      id: "REV-2024-105",
      process: "Sanctions Screening",
      auditor: "Elena Rodriguez",
      status: "Not Started",
      progress: 0,
      dueDate: "In 2 days"
    },
    {
      id: "REV-2024-078",
      process: "EDD - Crypto Desk",
      auditor: "David Chen",
      status: "Corrective Action",
      progress: 100,
      dueDate: "Overdue"
    }
  ];

  const { items: sortedReviews, requestSort: sortReviews, sortConfig: reviewsSortConfig } = useSortableData(activeReviews);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="size-6 text-[#2A53A0]" />
            2nd Line of Defence (2LoD)
          </h2>
          <p className="text-gray-500 text-sm mt-1">Compliance Assurance & Quality Control Oversight</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 h-[46px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-[#2A53A0] dark:hover:border-[#6b93e6] transition-all">
            <Calendar className="size-4 text-gray-500" />
            <span className="text-sm">This Quarter</span>
          </button>
          <button className="flex items-center gap-2 px-3 h-[46px] bg-[#2A53A0] text-white rounded-lg hover:bg-[#1e3a70] dark:bg-[#6b93e6] dark:hover:bg-[#5577cc] transition-all shadow-sm">
            <Download className="size-4" />
            <span className="text-sm">Assurance Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${
                  stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                  stat.color === 'red' ? 'bg-red-100 text-red-600' :
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  <stat.icon className="size-5" />
                </div>
                {stat.status === 'good' && <CheckCircle2 className="size-5 text-emerald-500" />}
                {stat.status === 'warning' && <AlertOctagon className="size-5 text-orange-500" />}
                {stat.status === 'critical' && <AlertOctagon className="size-5 text-red-500" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.target}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* QA Trends Chart */}
        <div className="lg:col-span-2">
          <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                  <h3 className="text-gray-900 dark:text-white">Quality Assurance Trend</h3>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={qaTrendData}>
                  <defs>
                    <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2A53A0" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2A53A0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="passRate" stroke="#2A53A0" strokeWidth={2} fillOpacity={1} fill="url(#colorPass)" name="Pass Rate %" />
                  <Line type="monotone" dataKey="defects" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Defects" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Issue Severity Breakdown */}
        <div>
          <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                    <AlertOctagon className="size-5 text-[#2A53A0] dark:text-[#6b93e6]" />
                    <h3 className="text-gray-900 dark:text-white">Open Issues by Severity</h3>
                 </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="space-y-4">
                  {issueData.map((issue, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{issue.name}</span>
                        <span className="text-gray-900 dark:text-white font-bold">{issue.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ width: `${(issue.count / 49) * 100}%`, backgroundColor: issue.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Open Issues</span>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">49</span>
                  </div>
                  <button className="w-full mt-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    View All Issues
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Active Reviews Table */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="size-5 text-[#2A53A0]" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Assurance Reviews</h3>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md">My Reviews</button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Team Reviews</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  <SortableHeader column="process" label="Review ID / Process" sortConfig={reviewsSortConfig} onSort={sortReviews} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  <SortableHeader column="auditor" label="Lead Auditor" sortConfig={reviewsSortConfig} onSort={sortReviews} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  <SortableHeader column="progress" label="Progress" sortConfig={reviewsSortConfig} onSort={sortReviews} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  <SortableHeader column="dueDate" label="Due Date" sortConfig={reviewsSortConfig} onSort={sortReviews} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  <SortableHeader column="status" label="Status" sortConfig={reviewsSortConfig} onSort={sortReviews} />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {sortedReviews.map((review, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">{review.process}</span>
                      <span className="text-xs text-gray-500">{review.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                        {review.auditor.charAt(0)}
                      </div>
                      {review.auditor}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full max-w-[120px] bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#2A53A0] h-1.5 rounded-full" style={{ width: `${review.progress}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 inline-block">{review.progress}% Complete</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    <span className={review.dueDate === 'Overdue' ? 'text-red-600 font-medium' : ''}>
                      {review.dueDate}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className={`
                      ${review.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        review.status === 'Corrective Action' ? 'bg-red-50 text-red-700 border-red-200' :
                        review.status === 'Pending Review' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-gray-50 text-gray-600 border-gray-200'}
                    `}>
                      {review.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-[#2A53A0] hover:text-[#1e3a70] text-sm font-medium flex items-center justify-end gap-1">
                      View <ArrowRight className="size-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
