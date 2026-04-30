import { motion } from "motion/react";
import {
  Users,
  UserPlus,
  UserCheck,
  Globe,
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  Briefcase,
  RefreshCw as Renew,
  ChevronDown,
  CheckCircle2,
  FileSearch,
  CopySlash,
  AlertTriangle,
  Clock,
  XCircle,
  FileText,
  ShieldAlert,
  BarChart2,
  PieChart as PieChartIcon,
  Activity,
  Layers
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend,
  FunnelChart,
  Funnel,
  LabelList
} from "recharts";
import { useState } from "react";
import { useSortableData } from "../../hooks/use-sortable-data";
import { SortableHeader } from "../ui/sortable-header";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface CustomerIntelligenceProps {
  breadcrumbs?: BreadcrumbItem[];
  onBreadcrumbNavigate?: (path: string) => void;
}

export function CustomerIntelligence({ breadcrumbs, onBreadcrumbNavigate }: CustomerIntelligenceProps) {
  const [dateRange, setDateRange] = useState("Today");

  // --- MOCK DATA ---

  // 1. KPI Cards
  const kpiData = [
    { title: "New Applications (Today)", value: "189", change: "+12.5%", trend: "up", icon: UserPlus, color: "blue" },
    { title: "Pending KYC Reviews", value: "385", change: "+5.2%", trend: "up", icon: Clock, color: "orange" },
    { title: "Applications Approved (Today)", value: "142", change: "+8.7%", trend: "up", icon: CheckCircle2, color: "green" },
    { title: "Applications Rejected (Today)", value: "16", change: "-2.3%", trend: "down", icon: XCircle, color: "red" },
  ];

  // 2. Onboarding Volume Trend
  const volumeTrend = [
    { time: "9am", applied: 20, kyc: 15, verified: 10, approved: 8 },
    { time: "10am", applied: 45, kyc: 35, verified: 25, approved: 20 },
    { time: "11am", applied: 70, kyc: 55, verified: 40, approved: 35 },
    { time: "12pm", applied: 65, kyc: 50, verified: 45, approved: 30 },
    { time: "1pm", applied: 50, kyc: 40, verified: 35, approved: 25 },
    { time: "2pm", applied: 80, kyc: 65, verified: 50, approved: 45 },
    { time: "3pm", applied: 95, kyc: 75, verified: 60, approved: 55 },
    { time: "4pm", applied: 85, kyc: 70, verified: 65, approved: 50 },
  ];

  // 3. Application Status Funnel
  const funnelData = [
    { value: 4521, name: "Applied", fill: "#3b82f6" },
    { value: 3245, name: "KYC Review", fill: "#8b5cf6" },
    { value: 2890, name: "Verified", fill: "#f97316" },
    { value: 2752, name: "Approved", fill: "#10b981" },
  ];

  // 4. Avg Onboarding Time (Radial Mockup Data)
  const avgTime = 4.2; // days
  const targetTime = 5.0;

  // 5. KYC Completion Rate (Radial Mockup Data)
  const kycRate = 87.3; // %
  const kycTarget = 90.0;

  // 6. Applications by Customer Type
  const customerType = [
    { name: "Individual", value: 65, color: "#3b82f6" },
    { name: "Corporate", value: 20, color: "#8b5cf6" },
    { name: "Partnership", value: 10, color: "#f97316" },
    { name: "Trust", value: 5, color: "#10b981" },
  ];

  // 7. Applications by Channel
  const channelData = [
    { name: "Mobile App", value: 45, color: "#3b82f6" },
    { name: "Branch", value: 30, color: "#8b5cf6" },
    { name: "Contact Center", value: 15, color: "#f97316" },
    { name: "Partner", value: 7, color: "#10b981" },
    { name: "Call Center", value: 3, color: "#eab308" },
  ];

  // 8. Customer Risk Rating at Onboarding
  const riskRating = [
    { name: "Low Risk", value: 65, color: "#10b981" },
    { name: "Medium Risk", value: 22, color: "#f59e0b" },
    { name: "High Risk", value: 10, color: "#f97316" },
    { name: "Very High Risk", value: 3, color: "#ef4444" },
  ];

  // 9. Applications by Product
  const productData = [
    { name: "Savings", value: 1850 },
    { name: "Current", value: 1250 },
    { name: "Demat", value: 950 },
    { name: "Personal Loan", value: 750 },
    { name: "Credit Card", value: 620 },
    { name: "Home Loan", value: 450 },
    { name: "FD/RD", value: 320 },
    { name: "Insurance", value: 210 },
  ];

  // 10. Applications by Geography
  const geoData = [
    { name: "Maharashtra", value: 1450, color: "#3b82f6" },
    { name: "Karnataka", value: 1250, color: "#8b5cf6" },
    { name: "Tamil Nadu", value: 1100, color: "#f97316" },
    { name: "Delhi NCR", value: 1050, color: "#10b981" },
    { name: "Gujarat", value: 950, color: "#10b981" }, // Using same color scheme
    { name: "West Bengal", value: 580, color: "#10b981" },
    { name: "Rajasthan", value: 450, color: "#10b981" },
    { name: "Uttar Pradesh", value: 350, color: "#10b981" },
  ];

  // 11. Document Verification Status
  const docStatus = [
    { name: "Identity", verified: 120, failed: 10, pending: 5 },
    { name: "Address", verified: 115, failed: 12, pending: 8 },
    { name: "Income", verified: 95, failed: 8, pending: 25 },
    { name: "Business", verified: 45, failed: 15, pending: 30 },
    { name: "Signature", verified: 125, failed: 5, pending: 2 },
    { name: "Photo", verified: 118, failed: 4, pending: 3 },
  ];

  // 12. ID Verification Pass Rate
  const idPassRate = [
    { week: "Week 1", rate: 92 },
    { week: "Week 2", rate: 93 },
    { week: "Week 3", rate: 91 },
    { week: "Week 4", rate: 94 },
    { week: "Week 5", rate: 93.5 },
    { week: "Week 6", rate: 95 },
  ];

  // 13. Rejection Reasons Breakdown
  const rejectionReasons = [
    { name: "Incomplete Documentation", value: 145 },
    { name: "Failed KYC", value: 120 },
    { name: "Adverse Media Hit", value: 85 },
    { name: "Sanctions Hit", value: 65 },
    { name: "Low Credit Score", value: 55 },
    { name: "Suspected Fraud", value: 45 },
    { name: "Unsupported Geography", value: 35 },
    { name: "Underage Applicant", value: 25 },
  ];

  // 14. High Risk Applicants Monitoring
  const highRiskCount = 23;

  // 15. Screening & SLA
  const pepScreening = 94.2;
  const slaCompliance = 91.5;

  // 16. EDD Trigger Rate
  const eddTrigger = [
    { month: "Jul", value: 12 },
    { month: "Aug", value: 15 },
    { month: "Sep", value: 14 },
    { month: "Oct", value: 18 },
    { month: "Nov", value: 17 },
    { month: "Dec", value: 19 },
  ];

  // 17. Application Aging Analysis
  const agingData = [
    { range: "0-2 days", count: 120 },
    { range: "3-5 days", count: 220 },
    { range: "6-10 days", count: 180 },
    { range: "11-15 days", count: 120 },
    { range: "15-30 days", count: 80 },
    { range: "30+ days", count: 45 },
    { range: "60+ days", count: 20 },
  ];

  // 18. Beneficial Ownership Verification
  const uboData = [
    { type: "Private Limited", verified: 120, pending: 40, failed: 10 },
    { type: "Public Limited", verified: 80, pending: 30, failed: 5 },
    { type: "Partnership", verified: 90, pending: 40, failed: 15 },
    { type: "LLP", verified: 45, pending: 15, failed: 5 },
    { type: "Trust", verified: 30, pending: 10, failed: 5 },
  ];

  // 19. Tables
  const pendingDocs = [
    { id: "CUST-2024-0012", name: "Rajesh Kumar", doc: "Income Proof", age: 3, risk: "Low" },
    { id: "CUST-2024-0045", name: "Priya Sharma", doc: "Business Registration", age: 5, risk: "Medium" },
    { id: "CUST-2024-0078", name: "Amit Patel", doc: "Address Proof", age: 4, risk: "Low" },
    { id: "CUST-2024-0092", name: "Sunita Patel", doc: "Bank Statement", age: 6, risk: "High" },
    { id: "CUST-2024-0103", name: "Vikram Singh", doc: "PAN Card", age: 7, risk: "Medium" },
  ];

  const incompleteApps = [
    { id: "APP-2024-7821", customer: "Amit Desai", product: "Current Account", missing: "Address Proof, Bank Statement", days: 3 },
    { id: "APP-2024-7845", customer: "Neha Gupta", product: "Personal Loan", missing: "Income Proof", days: 12 },
    { id: "APP-2024-7867", customer: "Arjun Rai", product: "Savings Account", missing: "PAN Card", days: 5 },
    { id: "APP-2024-7889", customer: "Kavya Varma", product: "Business Loan", missing: "Business Registration, Financials", days: 15 },
    { id: "APP-2024-7901", customer: "Rohit Kapoor", product: "Credit Card", missing: "Income Proof, Address Proof", days: 8 },
  ];

  const { items: sortedPendingDocs, requestSort: sortPendingDocs, sortConfig: pendingConfig } = useSortableData(pendingDocs);
  const { items: sortedIncomplete, requestSort: sortIncomplete, sortConfig: incompleteConfig } = useSortableData(incompleteApps);

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Onboarding Dashboard</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</p>
                <div className={`p-1.5 rounded-full ${
                  kpi.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  kpi.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                  kpi.color === 'green' ? 'bg-green-50 text-green-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{kpi.value}</h3>
              <div className={`text-xs flex items-center gap-1 ${
                kpi.trend === 'up' && kpi.color !== 'red' ? 'text-green-600' :
                kpi.trend === 'down' && kpi.color === 'red' ? 'text-green-600' : // Good if bad things go down
                'text-red-600'
              }`}>
                {kpi.change}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Row 2: Trend & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Onboarding Volume Trend</h3>
            <p className="text-xs text-gray-500 mb-4">Application volume over time</p>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeTrend}>
                     <defs>
                        <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                     <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                     <Tooltip />
                     <Legend wrapperStyle={{ fontSize: '12px' }}/>
                     <Area type="monotone" dataKey="applied" name="Applied" stackId="1" stroke="#3b82f6" fill="url(#colorApplied)" />
                     <Area type="monotone" dataKey="kyc" name="KYC Review" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                     <Area type="monotone" dataKey="verified" name="Verified" stackId="1" stroke="#f97316" fill="#f97316" />
                     <Area type="monotone" dataKey="approved" name="Approved" stackId="1" stroke="#10b981" fill="#10b981" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Application Status Funnel</h3>
            <p className="text-xs text-gray-500 mb-4">Applied &gt; KYC &gt; Verified &gt; Approved</p>
            <div className="h-[250px] flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                     <Tooltip />
                     <Funnel
                        data={funnelData}
                        dataKey="value"
                        nameKey="name"
                        labelLine={false}
                     >
                        <LabelList position="right" fill="#6b7280" stroke="none" dataKey="name" />
                     </Funnel>
                  </FunnelChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Row 3: Radial Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center">
            <h3 className="font-semibold text-gray-900 mb-4 w-full text-left">Average Onboarding Time</h3>
            <div className="relative size-32">
               <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-emerald-500" strokeDasharray={`${(avgTime/targetTime)*100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
               </svg>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-2xl font-bold text-gray-900">{avgTime}</span>
                  <span className="text-xs text-gray-500 block">days</span>
               </div>
            </div>
            <div className="mt-4 flex justify-between w-full text-xs text-gray-500 px-10">
               <span>Target: {targetTime} days</span>
               <span className="text-green-600">Above Target</span>
            </div>
         </Card>

         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center">
            <h3 className="font-semibold text-gray-900 mb-4 w-full text-left">KYC Completion Rate</h3>
            <div className="relative size-32">
               <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-blue-600" strokeDasharray={`${kycRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
               </svg>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-2xl font-bold text-gray-900">{kycRate}%</span>
                  <span className="text-xs text-gray-500 block">completed</span>
               </div>
            </div>
            <div className="mt-4 flex justify-between w-full text-xs text-gray-500 px-10">
               <span>Target: {kycTarget}%</span>
               <span className="text-red-600">-2.7% Gap</span>
            </div>
         </Card>
      </div>

      {/* Row 4: Segmentation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Applications by Customer Type</h3>
            <div className="h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={customerType} innerRadius={0} outerRadius={80} paddingAngle={2} dataKey="value">
                        {customerType.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
               {customerType.map((item, i) => (
                  <div key={i} className="flex items-center gap-1">
                     <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                     <span>{item.name}</span>
                  </div>
               ))}
            </div>
         </Card>

         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Applications by Channel</h3>
            <div className="h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={channelData} innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                        {channelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
               {channelData.map((item, i) => (
                  <div key={i} className="flex items-center gap-1">
                     <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                     <span>{item.name}</span>
                  </div>
               ))}
            </div>
         </Card>

         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Customer Risk Rating</h3>
            <div className="h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={riskRating} innerRadius={0} outerRadius={80} paddingAngle={2} dataKey="value">
                        {riskRating.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
               {riskRating.map((item, i) => (
                  <div key={i} className="flex items-center gap-1">
                     <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                     <span>{item.name}</span>
                  </div>
               ))}
            </div>
         </Card>
      </div>

      {/* Row 5: Product & Geo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Applications by Product Requested</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productData} layout="vertical" margin={{ left: 30 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{ fill: '#f3f4f6' }} />
                     <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Applications by Geography</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geoData} layout="vertical" margin={{ left: 30 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{ fill: '#f3f4f6' }} />
                     <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={10} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Row 6: Doc Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Document Verification Status</h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={docStatus}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                     <Tooltip cursor={{ fill: '#f3f4f6' }} />
                     <Legend wrapperStyle={{ fontSize: '11px' }} />
                     <Bar dataKey="pending" name="Pending" stackId="a" fill="#eab308" />
                     <Bar dataKey="verified" name="Verified" stackId="a" fill="#10b981" />
                     <Bar dataKey="failed" name="Failed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">ID Verification Pass Rate</h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={idPassRate}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                     <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} domain={[80, 100]} />
                     <Tooltip />
                     <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{r: 4}} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Row 7: Rejection Reasons */}
      <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
         <h3 className="font-semibold text-gray-900 mb-4">Rejection Reasons Breakdown</h3>
         <p className="text-xs text-gray-500 mb-4">Why applications are declined</p>
         <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={rejectionReasons} layout="vertical" margin={{ left: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </Card>

      {/* Row 8: Monitoring & SLA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">High-Risk Applicants Monitoring</h3>
            <div className="flex flex-col h-full justify-center">
               <span className="text-4xl font-bold text-gray-900 mb-2">{highRiskCount}</span>
               <span className="text-red-600 text-sm">Critical Flag</span>
               <div className="h-1 bg-gray-100 rounded-full mt-4 w-1/2">
                  <div className="h-full bg-red-600 rounded-full w-[25%]" />
               </div>
            </div>
         </Card>

         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm w-full text-left">PEP/Sanctions Screening Status</h3>
            <div className="relative size-24">
               <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-purple-600" strokeDasharray={`${pepScreening}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
               </svg>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-lg font-bold text-gray-900">{pepScreening}%</span>
               </div>
            </div>
         </Card>

         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm w-full text-left">Onboarding SLA Compliance</h3>
            <div className="relative size-24">
               <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-green-500" strokeDasharray={`${slaCompliance}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
               </svg>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-lg font-bold text-gray-900">{slaCompliance}%</span>
               </div>
            </div>
         </Card>
      </div>

      {/* Row 9: EDD & Aging */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">EDD Trigger Rate</h3>
            <div className="h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={eddTrigger}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                     <Tooltip />
                     <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{r: 4}} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Application Aging Analysis</h3>
            <div className="h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agingData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                     <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                     <Tooltip cursor={{ fill: '#f3f4f6' }} />
                     <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Row 10: Beneficial Ownership */}
      <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
         <h3 className="font-semibold text-gray-900 mb-4">Beneficial Ownership Verification Status</h3>
         <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={uboData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} />
                  <Legend />
                  <Bar dataKey="verified" name="Verified" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill="#10b981" />
                  <Bar dataKey="failed" name="Failed" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </Card>

      {/* Row 11: Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Pending Document Requests</h3>
            <div className="overflow-x-auto">
               <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500">
                     <tr>
                        <th className="p-2"><SortableHeader column="id" label="Customer ID" sortConfig={pendingConfig} onSort={sortPendingDocs} /></th>
                        <th className="p-2"><SortableHeader column="name" label="Name" sortConfig={pendingConfig} onSort={sortPendingDocs} /></th>
                        <th className="p-2"><SortableHeader column="doc" label="Document" sortConfig={pendingConfig} onSort={sortPendingDocs} /></th>
                        <th className="p-2"><SortableHeader column="age" label="Age (Days)" sortConfig={pendingConfig} onSort={sortPendingDocs} /></th>
                        <th className="p-2 text-center"><SortableHeader column="risk" label="Risk" sortConfig={pendingConfig} onSort={sortPendingDocs} className="justify-center" /></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {sortedPendingDocs.map((row, i) => (
                        <tr key={i}>
                           <td className="p-2 text-gray-500">{row.id}</td>
                           <td className="p-2 font-medium">{row.name}</td>
                           <td className="p-2">{row.doc}</td>
                           <td className="p-2">{row.age}</td>
                           <td className="p-2 text-center">
                              <Badge variant="outline" className={`text-[10px] ${
                                 row.risk === 'High' ? 'bg-red-50 text-red-700' :
                                 row.risk === 'Medium' ? 'bg-orange-50 text-orange-700' :
                                 'bg-green-50 text-green-700'
                              }`}>
                                 {row.risk}
                              </Badge>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>

         <Card className="p-5 border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Incomplete Applications</h3>
            <div className="overflow-x-auto">
               <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500">
                     <tr>
                        <th className="p-2"><SortableHeader column="id" label="App ID" sortConfig={incompleteConfig} onSort={sortIncomplete} /></th>
                        <th className="p-2"><SortableHeader column="customer" label="Customer" sortConfig={incompleteConfig} onSort={sortIncomplete} /></th>
                        <th className="p-2"><SortableHeader column="missing" label="Missing Items" sortConfig={incompleteConfig} onSort={sortIncomplete} /></th>
                        <th className="p-2 text-center"><SortableHeader column="days" label="Days" sortConfig={incompleteConfig} onSort={sortIncomplete} className="justify-center" /></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {sortedIncomplete.map((row, i) => (
                        <tr key={i}>
                           <td className="p-2 text-gray-500">{row.id}</td>
                           <td className="p-2 font-medium">{row.customer}</td>
                           <td className="p-2 text-gray-500 truncate max-w-[150px]" title={row.missing}>{row.missing}</td>
                           <td className="p-2 text-center">
                              <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold">{row.days}</span>
                           </td>
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
