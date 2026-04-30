import { useState, useMemo } from "react";
import { 
  Search, 
  View, 
  ChevronRight, 
  WarningAltFilled,
  Add,
  ChevronDown,
  Launch,
  Portfolio,
  Identification,
  Flash,
  Settings,
  User,
  Money,
  Enterprise,
  Document
} from "@carbon/icons-react";
import PageHeader from "./page-header";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CarbonPaginationFooter } from "./carbon-pagination-footer";
import { useSortableData } from "../hooks/use-sortable-data";
import { SortableHeader } from "./ui/sortable-header";
import { cn } from "./ui/utils";

export interface TemplateParameter {
  name: string;
  defaultValue: string;
  description: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  workspace: string;
  events: string[];
  warning?: string;
  tags: string[];
  parameters: TemplateParameter[];
  dsl: string;
  requiredIpvs: string[];
  requiredViews: string[];
}

export const TEMPLATE_DATA: TemplateItem[] = [
  // Account Takeover (ATO)
  {
    id: "1",
    name: "ATO_PASSWORD_CHANGE_TXN",
    version: "v1.0",
    description: "Password change followed by high-value transaction within X hours",
    category: "Account Takeover (ATO)",
    workspace: "Customer",
    events: ["NF_PasswordChange", "FT_Transaction"],
    tags: ["ATO", "Security"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "2",
    name: "ATO_NEW_DEVICE_HIGH_VALUE",
    version: "v1.0",
    description: "Transaction from new device exceeding threshold",
    category: "Account Takeover (ATO)",
    workspace: "Device",
    events: ["NF_DeviceChange", "FT_Transaction"],
    tags: ["ATO", "Device"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "3",
    name: "ATO_CREDENTIAL_CHANGE_BURST",
    version: "v1.0",
    description: "Multiple credential changes (email, phone, address) in short period",
    category: "Account Takeover (ATO)",
    workspace: "Customer",
    events: ["NF_CredentialChange"],
    tags: ["ATO", "Security"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "4",
    name: "ATO_BENEFICIARY_ADD_TRANSFER",
    version: "v1.0",
    description: "New beneficiary added followed by immediate high-value transfer",
    category: "Account Takeover (ATO)",
    workspace: "Beneficiary",
    events: ["NF_BenAdd", "FT_Transfer"],
    tags: ["ATO", "Fraud"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "5",
    name: "ATO_GEO_IMPOSSIBLE_TRAVEL",
    version: "v1.0",
    description: "Login from geographically impossible locations within timeframe",
    category: "Account Takeover (ATO)",
    workspace: "Account",
    events: ["NF_Login"],
    tags: ["ATO", "Geo"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "6",
    name: "ATO_FAILED_LOGIN_SUCCESS",
    version: "v1.0",
    description: "Multiple failed logins followed by successful login and transaction",
    category: "Account Takeover (ATO)",
    workspace: "Account",
    events: ["NF_Login", "FT_Transaction"],
    tags: ["ATO", "Security"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  // Payment Fraud
  {
    id: "7",
    name: "PAY_HIGH_VALUE_FIRST_TXN",
    version: "v1.0",
    description: "First transaction on account exceeds threshold",
    category: "Payment Fraud",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["Payment", "Fraud"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "8",
    name: "PAY_RAPID_SUCCESSIVE_TRANSFERS",
    version: "v1.0",
    description: "Multiple transfers in short window exceeding cumulative threshold",
    category: "Payment Fraud",
    workspace: "Transaction",
    events: ["FT_Transfer"],
    tags: ["Payment", "Velocity"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "9",
    name: "PAY_DORMANT_ACCOUNT_ACTIVATION",
    version: "v1.0",
    description: "Transaction on dormant account (no activity > X days)",
    category: "Payment Fraud",
    workspace: "Account",
    events: ["FT_Transaction"],
    tags: ["Payment", "Dormancy"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "10",
    name: "PAY_ROUND_AMOUNT_PATTERN",
    version: "v1.0",
    description: "Multiple round amount transactions indicating structuring",
    category: "Payment Fraud",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["Payment", "Structuring"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "11",
    name: "PAY_UNUSUAL_TIME_TXN",
    version: "v1.0",
    description: "High-value transaction outside normal operating hours",
    category: "Payment Fraud",
    workspace: "Channel",
    events: ["FT_Transaction"],
    tags: ["Payment", "Anomaly"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "12",
    name: "PAY_CHANNEL_ANOMALY",
    version: "v1.0",
    description: "Transaction via unusual channel for customer profile",
    category: "Payment Fraud",
    workspace: "Channel",
    events: ["FT_Transaction"],
    tags: ["Payment", "Profile"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  // Card Fraud
  {
    id: "13",
    name: "CARD_CNP_HIGH_VALUE",
    version: "v1.0",
    description: "Card-not-present transaction exceeding threshold",
    category: "Card Fraud",
    workspace: "Payment Card",
    events: ["FT_CardPayment"],
    tags: ["Card", "CNP"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "14",
    name: "CARD_COUNTRY_MISMATCH",
    version: "v1.0",
    description: "Transaction country different from cardholder country",
    category: "Card Fraud",
    workspace: "Card",
    events: ["FT_CardPayment"],
    tags: ["Card", "Geo"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "15",
    name: "CARD_ATM_RAPID_WITHDRAWAL",
    version: "v1.0",
    description: "Multiple ATM withdrawals in short time window",
    category: "Card Fraud",
    workspace: "Card",
    events: ["FT_Withdrawal"],
    tags: ["Card", "Velocity"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "16",
    name: "CARD_MCC_HIGH_RISK",
    version: "v1.0",
    description: "Transaction at high-risk merchant category",
    category: "Card Fraud",
    workspace: "Merchant",
    events: ["FT_CardPayment"],
    tags: ["Card", "Risk"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "17",
    name: "CARD_FALLBACK_TXN",
    version: "v1.0",
    description: "Chip fallback to magnetic stripe transaction",
    category: "Card Fraud",
    workspace: "Payment Card",
    events: ["FT_CardPayment"],
    tags: ["Card", "Security"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "18",
    name: "CARD_MULTIPLE_DECLINE_SUCCESS",
    version: "v1.0",
    description: "Multiple declines followed by approval",
    category: "Card Fraud",
    workspace: "Payment Card",
    events: ["FT_CardPayment"],
    tags: ["Card", "Pattern"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  // Mule Account
  {
    id: "19",
    name: "MULE_RAPID_IN_OUT",
    version: "v1.0",
    description: "Credit followed by near-equal debit within short window",
    category: "Mule Account",
    workspace: "Non-Customer",
    events: ["FT_Deposit", "FT_Transfer"],
    tags: ["Mule", "Velocity"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "20",
    name: "MULE_FAN_IN_PATTERN",
    version: "v1.0",
    description: "Multiple credits from different sources to single account",
    category: "Mule Account",
    workspace: "External Entity",
    events: ["FT_Transfer"],
    tags: ["Mule", "Aggregation"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "21",
    name: "MULE_FAN_OUT_PATTERN",
    version: "v1.0",
    description: "Single large credit followed by multiple small debits",
    category: "Mule Account",
    workspace: "External Entity",
    events: ["FT_Transfer"],
    tags: ["Mule", "Distribution"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "22",
    name: "MULE_NEW_ACCOUNT_HIGH_VOLUME",
    version: "v1.0",
    description: "New account with unusually high transaction volume",
    category: "Mule Account",
    workspace: "Account",
    events: ["FT_Transaction"],
    tags: ["Mule", "New Account"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "23",
    name: "MULE_BENEFICIARY_CONCENTRATION",
    version: "v1.0",
    description: "Multiple customers sending to same beneficiary",
    category: "Mule Account",
    workspace: "Beneficiary",
    events: ["FT_Transfer"],
    tags: ["Mule", "Beneficiary"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "24",
    name: "MULE_CIRCULAR_FLOW",
    version: "v1.0",
    description: "Funds returning to originator through intermediaries",
    category: "Mule Account",
    workspace: "External Entity",
    events: ["FT_Transfer"],
    tags: ["Mule", "Circular"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  // Velocity-Based
  {
    id: "25",
    name: "VEL_TXN_COUNT_HOURLY",
    version: "v1.0",
    description: "Transaction count exceeds hourly threshold",
    category: "Velocity-Based",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["Velocity", "Count"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "26",
    name: "VEL_TXN_COUNT_DAILY",
    version: "v1.0",
    description: "Transaction count exceeds daily threshold",
    category: "Velocity-Based",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["Velocity", "Count"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "27",
    name: "VEL_AMOUNT_SUM_DAILY",
    version: "v1.0",
    description: "Total transaction amount exceeds daily threshold",
    category: "Velocity-Based",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["Velocity", "Amount"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "28",
    name: "VEL_DISTINCT_BENEFICIARY",
    version: "v1.0",
    description: "Transfers to more than X distinct beneficiaries in period",
    category: "Velocity-Based",
    workspace: "Transaction",
    events: ["FT_Transfer"],
    tags: ["Velocity", "Beneficiary"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "29",
    name: "VEL_CHANNEL_SWITCH",
    version: "v1.0",
    description: "Rapid channel switching within transaction sequence",
    category: "Velocity-Based",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["Velocity", "Channel"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "30",
    name: "VEL_DEVICE_COUNT",
    version: "v1.0",
    description: "Transactions from more than X devices in period",
    category: "Velocity-Based",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["Velocity", "Device"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  // Geographic Anomaly
  {
    id: "31",
    name: "GEO_IMPOSSIBLE_TRAVEL",
    version: "v1.0",
    description: "Transactions from locations >500km apart within 1 hour",
    category: "Geographic Anomaly",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["Geo", "Velocity"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "32",
    name: "GEO_HIGH_RISK_COUNTRY",
    version: "v1.0",
    description: "First-time transaction to/from high-risk jurisdiction exceeding $1,000",
    category: "Geographic Anomaly",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["Geo", "Risk"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "33",
    name: "GEO_UNUSUAL_LOCATION_LOGIN",
    version: "v1.0",
    description: "Login from country never accessed before followed by transaction",
    category: "Geographic Anomaly",
    workspace: "Account",
    events: ["NF_Login", "FT_Transaction"],
    tags: ["Geo", "Security"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "34",
    name: "GEO_MULTIPLE_COUNTRIES_SAME_DAY",
    version: "v1.0",
    description: "Transactions from 3+ different countries within 24 hours",
    category: "Geographic Anomaly",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["Geo", "Pattern"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  // Behavioral Deviation
  {
    id: "35",
    name: "BEHAVIOR_TIME_DEVIATION",
    version: "v1.0",
    description: "Transactions outside customer's normal active hours",
    category: "Behavioral Deviation",
    workspace: "Customer",
    events: ["FT_Transaction"],
    tags: ["Behavior", "Anomaly"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "36",
    name: "BEHAVIOR_CHANNEL_DEVIATION",
    version: "v1.0",
    description: "Use of channel never used before",
    category: "Behavioral Deviation",
    workspace: "Customer",
    events: ["FT_Transaction"],
    tags: ["Behavior", "Channel"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "37",
    name: "BEHAVIOR_TRANSACTION_TYPE_CHANGE",
    version: "v1.0",
    description: "Customer performs transaction type never done before",
    category: "Behavioral Deviation",
    workspace: "Customer",
    events: ["FT_Transaction"],
    tags: ["Behavior", "Type"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "38",
    name: "BEHAVIOR_RECIPIENT_DEVIATION",
    version: "v1.0",
    description: "Payment to recipient type inconsistent with customer profile",
    category: "Behavioral Deviation",
    workspace: "Customer",
    events: ["FT_Transfer"],
    tags: ["Behavior", "Profile"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  // Synthetic Identity
  {
    id: "39",
    name: "SYNTHETIC_NEW_CUSTOMER_RAPID_CREDIT",
    version: "v1.0",
    description: "New customer with immediate high-credit application",
    category: "Synthetic Identity",
    workspace: "Customer",
    events: ["EV_Application"],
    tags: ["Synthetic", "Credit"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "40",
    name: "SYNTHETIC_INCONSISTENT_DATA",
    version: "v1.0",
    description: "Customer with mismatched data elements",
    category: "Synthetic Identity",
    workspace: "Customer",
    events: ["EV_ProfileUpdate"],
    tags: ["Synthetic", "Data"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "41",
    name: "SYNTHETIC_BUST_OUT_PATTERN",
    version: "v1.0",
    description: "Months of small payments then sudden large cash-out",
    category: "Synthetic Identity",
    workspace: "Customer",
    events: ["FT_Transaction"],
    tags: ["Synthetic", "Pattern"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  // AML Typology
  {
    id: "42",
    name: "AML_STRUCTURING_BELOW_LIMIT",
    version: "v1.0",
    description: "Multiple transactions just below reporting threshold",
    category: "AML Typology",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["AML", "Structuring"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "43",
    name: "AML_RAPID_MOVEMENT",
    version: "v1.0",
    description: "Funds moved rapidly through multiple accounts",
    category: "AML Typology",
    workspace: "Transaction",
    events: ["FT_Transfer"],
    tags: ["AML", "Velocity"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "44",
    name: "AML_CASH_INTENSIVE",
    version: "v1.0",
    description: "High cash deposit/withdrawal ratio",
    category: "AML Typology",
    workspace: "Transaction",
    events: ["FT_Deposit", "FT_Withdrawal"],
    tags: ["AML", "Cash"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "45",
    name: "AML_HIGH_RISK_JURISDICTION",
    version: "v1.0",
    description: "Transactions with high-risk countries",
    category: "AML Typology",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["AML", "Geo"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "46",
    name: "AML_PEP_UNUSUAL_ACTIVITY",
    version: "v1.0",
    description: "Unusual activity on PEP-linked accounts",
    category: "AML Typology",
    workspace: "Account",
    events: ["FT_Transaction"],
    tags: ["AML", "PEP"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  },
  {
    id: "47",
    name: "AML_SHELL_COMPANY_INDICATOR",
    version: "v1",
    description: "Business account with shell company indicators",
    category: "AML Typology",
    workspace: "Transaction",
    events: ["FT_Transaction"],
    tags: ["AML", "Shell"],
    parameters: [],
    dsl: "",
    requiredIpvs: [],
    requiredViews: []
  }
];

interface TemplatesPageProps {
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
  onView: (id: string) => void;
  onUse: (id: string) => void;
}

export function TemplatesPage({ breadcrumbs, onBreadcrumbNavigate, onView, onUse }: TemplatesPageProps) {
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const getWorkspaceIcon = (workspace: string) => {
    switch (workspace) {
      case "Account": return Portfolio;
      case "Card": return Identification;
      case "Transaction": return Flash;
      case "Terminal": return Settings;
      case "Beneficiary": return User;
      case "ATM": return Money;
      case "Customer": return User;
      case "Organization": return Enterprise;
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
      case "Customer": return "text-[#491D8B] bg-[#E8DAFF]";
      case "Organization": return "text-[#004144] bg-[#D9FBFB]";
      default: return "text-[#2A53A0] bg-[#f0f4f9]";
    }
  };

  const filteredData = useMemo(() => {
    return TEMPLATE_DATA.filter(item => {
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchTerm]);

  const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const CATEGORIES = [
    { label: "All Categories", value: "all", count: "47 templates" },
    { label: "Account Takeover (ATO)", value: "Account Takeover (ATO)", count: "6 templates" },
    { label: "Payment Fraud", value: "Payment Fraud", count: "6 templates" },
    { label: "Card Fraud", value: "Card Fraud", count: "6 templates" },
    { label: "Mule Account", value: "Mule Account", count: "6 templates" },
    { label: "Velocity-Based", value: "Velocity-Based", count: "6 templates" },
    { label: "Geographic Anomaly", value: "Geographic Anomaly", count: "4 templates" },
    { label: "Behavioral Deviation", value: "Behavioral Deviation", count: "4 templates" },
    { label: "Synthetic Identity", value: "Synthetic Identity", count: "3 templates" },
    { label: "AML Typology", value: "AML Typology", count: "6 templates" },
    { label: "Custom Patterns", value: "Custom Patterns", count: "0 templates" },
  ];

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "Account Takeover (ATO)": return "bg-blue-100 text-blue-700 border-blue-200 h-[28px] flex items-center justify-center";
      case "Payment Fraud": return "bg-red-100 text-red-700 border-red-200 h-[28px] flex items-center justify-center";
      case "Card Fraud": return "bg-orange-100 text-orange-700 border-orange-200 h-[28px] flex items-center justify-center";
      case "Mule Account": return "bg-purple-100 text-purple-700 border-purple-200 h-[28px] flex items-center justify-center";
      case "Velocity-Based": return "bg-teal-100 text-teal-700 border-teal-200 h-[28px] flex items-center justify-center";
      case "Geographic Anomaly": return "bg-indigo-100 text-indigo-700 border-indigo-200 h-[28px] flex items-center justify-center";
      case "Behavioral Deviation": return "bg-amber-100 text-amber-700 border-amber-200 h-[28px] flex items-center justify-center";
      case "Synthetic Identity": return "bg-emerald-100 text-emerald-700 border-emerald-200 h-[28px] flex items-center justify-center";
      case "AML Typology": return "bg-slate-100 text-slate-700 border-slate-200 h-[28px] flex items-center justify-center";
      default: return "bg-gray-100 text-gray-700 border-gray-200 h-[28px] flex items-center justify-center";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-['Inter'] overflow-hidden">
      <PageHeader 
        title="Scenario Templates" 
        breadcrumbs={breadcrumbs} 
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
      />
      <div className="flex-1 flex flex-col p-4 overflow-hidden space-y-4">
        {/* Search and Action Bar */}
        <div className="flex-none flex items-center justify-between bg-white h-[46px]">
          <div className="flex items-center gap-4 h-full">
            <div className="relative w-[300px] h-full flex items-center">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full h-full pl-12 pr-4 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none placeholder:text-gray-500 transition-all"
              />
            </div>
            
            <div className="flex items-center h-full">
              <div className="relative h-full flex items-center">
                 <select 
                   value={categoryFilter}
                   onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                   className="bg-white border border-gray-300 rounded-sm h-[46px] px-4 pr-10 text-[14px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[280px]"
                 >
                     {CATEGORIES.map(cat => (
                       <option key={cat.value} value={cat.value}>
                         {cat.label} ({cat.count})
                       </option>
                     ))}
                 </select>
                 <div className="absolute right-3 pointer-events-none text-gray-500">
                    <ChevronDown size={16} />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-[#F0F0F0] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
                  <th className="px-4 border-b border-[#e0e0e0] w-[30%] align-middle whitespace-nowrap">
                    <SortableHeader column="name" label="Template Name" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[32%] align-middle whitespace-nowrap">
                    <SortableHeader column="description" label="Description" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[14%] align-middle whitespace-nowrap">
                    <SortableHeader column="workspace" label="Workspace" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[14%] align-middle whitespace-nowrap">
                    <SortableHeader column="category" label="Category" sortConfig={sortConfig} onSort={requestSort} className="text-[#2A53A0] font-semibold" />
                  </th>
                  <th className="px-4 border-b border-[#e0e0e0] w-[10%] text-center align-middle select-none">
                    <span className="text-[14px] font-semibold text-[#2A53A0]">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData.length > 0 ? paginatedData.map((row) => (
                  <tr key={row.id} className="h-[46px] border-b border-[#e0e0e0] hover:bg-[#f4f4f4] transition-colors group">
                    <td className="px-4 align-middle">
                      <button 
                        onClick={() => onView(row.id)}
                        className="flex items-center gap-2 overflow-hidden text-left hover:opacity-80 transition-opacity"
                      >
                        <div className="flex items-center gap-1 overflow-hidden">
                          <span className="text-[14px] text-[#161616] font-normal truncate" title={row.name}>
                            {row.name}
                          </span>
                          <Badge className="bg-[#EAF2FF] text-[#2A53A0] border border-[#d0e2ff] px-2 py-0 h-[18px] text-[10px] font-bold rounded-sm shrink-0 tracking-tight flex items-center justify-center">
                            {row.version}
                          </Badge>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 align-middle">
                      <span className="text-[14px] text-[#161616] font-normal block truncate" title={row.description}>
                        {row.description}
                      </span>
                    </td>
                    <td className="px-4 align-middle">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 h-[28px] rounded-md text-[11px] font-medium whitespace-nowrap w-fit",
                        getWorkspaceColor(row.workspace)
                      )}>
                        {(() => {
                          const Icon = getWorkspaceIcon(row.workspace);
                          return <Icon size={12} className="shrink-0" />;
                        })()}
                        <span>{row.workspace}</span>
                      </div>
                    </td>
                    <td className="px-4 align-middle text-center overflow-hidden">
                      <Badge 
                        className={cn(
                          "border font-medium rounded-full px-3 text-[11px] whitespace-nowrap h-6 flex items-center max-w-full justify-center",
                          getCategoryStyles(row.category)
                        )}
                      >
                        <span className="truncate">{row.category}</span>
                      </Badge>
                    </td>
                    <td className="px-4 align-middle text-center">
                      <button 
                        className="w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#e5f6ff] hover:bg-[#bae6fd] rounded-md transition-colors text-[#00539a] mx-auto" 
                        title="Use Template"
                        onClick={() => onUse(row.id)}
                      >
                        <Launch size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="h-48 text-center text-gray-500 text-sm">No templates matching your criteria were found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <CarbonPaginationFooter 
            pageSize={pageSize} 
            setPageSize={setPageSize} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            totalItems={sortedData.length} 
          />
        </div>
      </div>
    </div>
  );
}
