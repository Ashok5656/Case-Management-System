export interface ScenarioItem {
  id: string;
  name: string;
  workspace: string;
  group: string;
  status: "Verified" | "Rejected" | "Draft" | "Pending Approval";
  hits: string;
  performance: number;
  description: string;
  category: string;
  riskWeight: number;
  lastModified: string;
  createdBy?: string;
  createdOn?: string;
  conditions?: any[];
  queryConditions?: any[];
  actions?: any[];
  statusNote?: string;
}

export const INITIAL_SCENARIO_DATA: ScenarioItem[] = [
  { 
    id: "SCN-1082", 
    name: "High Value Transaction Pattern", 
    workspace: "Account", 
    group: "EFM", 
    status: "Verified", 
    hits: "1,247", 
    performance: 94.2,
    description: "Detects transactions exceeding 2 standard deviations from mean for account history",
    category: "Payment Fraud",
    riskWeight: 85,
    lastModified: "2026-01-25T14:30:00.000Z",
    createdBy: "John Smith",
    createdOn: "2026-01-05T09:00:00.000Z"
  },
  { 
    id: "SCN-1081", 
    name: "Velocity Check - Card", 
    workspace: "Card", 
    group: "EFM", 
    status: "Verified", 
    hits: "856", 
    performance: 87.5,
    description: "Triggers when more than 5 transactions occur in 1 hour on a single card",
    category: "Velocity-Based",
    riskWeight: 70,
    lastModified: "2026-01-26T10:15:00.000Z",
    createdBy: "Sarah Johnson",
    createdOn: "2026-01-08T11:20:00.000Z"
  },
  { 
    id: "SCN-1080", 
    name: "New Device Geo Anomaly", 
    workspace: "Terminal", 
    group: "Risk", 
    status: "Verified", 
    hits: "412", 
    performance: 91.8,
    description: "Monitors logins from new devices in high-risk jurisdictions",
    category: "Geographic Anomaly",
    riskWeight: 90,
    lastModified: "2026-01-28T16:45:00.000Z",
    createdBy: "Emma Davis",
    createdOn: "2026-01-10T08:15:00.000Z"
  },
  { 
    id: "SCN-1079", 
    name: "Dormant Account Activity", 
    workspace: "Account", 
    group: "AML", 
    status: "Rejected", 
    statusNote: "Conditions are too broad, causing excessive false positives",
    hits: "0", 
    performance: 0,
    description: "Triggers on any financial transaction for accounts with no activity > 180 days",
    category: "Mule Account",
    riskWeight: 65,
    lastModified: "2026-01-20T09:00:00.000Z",
    createdBy: "Michael Brown",
    createdOn: "2026-01-12T14:45:00.000Z"
  },
  { 
    id: "SCN-1078", 
    name: "ATO Credential Burst", 
    workspace: "Customer", 
    group: "Compliance", 
    status: "Verified", 
    hits: "156", 
    performance: 82.3,
    description: "Detects multiple profile changes (email, phone) within a 24-hour window",
    category: "Account Takeover (ATO)",
    riskWeight: 75,
    lastModified: "2026-01-29T11:00:00.000Z",
    createdBy: "John Smith",
    createdOn: "2026-01-15T10:30:00.000Z"
  },
  { 
    id: "SCN-2001", 
    name: "Structuring Pattern Detection", 
    workspace: "Transaction", 
    group: "AML", 
    status: "Draft", 
    hits: "0", 
    performance: 0,
    description: "Detects multiple deposits just below the regulatory reporting threshold within 24 hours",
    category: "Structuring",
    riskWeight: 82,
    lastModified: "2026-02-01T14:00:00.000Z",
    createdBy: "Rajesh Kumar",
    createdOn: "2026-01-31T08:30:00.000Z"
  },
  { 
    id: "SCN-2002", 
    name: "Cross-Border Velocity Check", 
    workspace: "Account", 
    group: "Risk", 
    status: "Draft", 
    hits: "0", 
    performance: 0,
    description: "Monitors rapid succession of international transfers from a single domestic account",
    category: "Velocity-Based",
    riskWeight: 78,
    lastModified: "2026-02-02T17:00:00.000Z",
    createdBy: "Rajesh Kumar",
    createdOn: "2026-02-01T12:00:00.000Z"
  },
  { 
    id: "SCN-2003", 
    name: "Third Party Payment Anomaly", 
    workspace: "Card", 
    group: "Fraud", 
    status: "Rejected", 
    statusNote: "Missing dependency on Card Master Table",
    hits: "0", 
    performance: 0,
    description: "Identifies payments to known high-risk third party processors with no prior history",
    category: "Payment Fraud",
    riskWeight: 88,
    lastModified: "2026-02-03T09:30:00.000Z",
    createdBy: "Rajesh Kumar",
    createdOn: "2026-02-02T14:20:00.000Z"
  },
  { 
    id: "SCN-2004", 
    name: "Merchant Category Mismatch", 
    workspace: "Card", 
    group: "EFM", 
    status: "Draft", 
    hits: "0", 
    performance: 0,
    description: "Triggers when card usage shifts dramatically to unusual merchant categories",
    category: "Spending Pattern",
    riskWeight: 65,
    lastModified: "2026-02-03T11:55:00.000Z",
    createdBy: "Rajesh Kumar",
    createdOn: "2026-02-03T08:15:00.000Z"
  },
  { 
    id: "SCN-2005", 
    name: "Corporate Account Bulk Transfer", 
    workspace: "Transaction", 
    group: "Compliance", 
    status: "Draft", 
    hits: "0", 
    performance: 0,
    description: "Monitors bulk payment uploads for unusual beneficiary patterns in corporate accounts",
    category: "Internal Control",
    riskWeight: 72,
    lastModified: "2026-02-04T09:00:00.000Z",
    createdBy: "Rajesh Kumar",
    createdOn: "2026-02-04T07:45:00.000Z"
  },
  { 
    id: "SCN-2006", 
    name: "High Risk Jurisdiction Wire", 
    workspace: "Account", 
    group: "AML", 
    status: "Draft", 
    hits: "0", 
    performance: 0,
    description: "Incoming wires from FATF grey-listed jurisdictions followed by rapid liquidation",
    category: "Money Laundering",
    riskWeight: 95,
    lastModified: "2026-02-04T10:05:00.000Z",
    createdBy: "Rajesh Kumar",
    createdOn: "2026-02-04T10:05:00.000Z"
  },
  { 
    id: "SCN-2007", 
    name: "Login Brute Force Recovery", 
    workspace: "Customer", 
    group: "Security", 
    status: "Draft", 
    hits: "0", 
    performance: 0,
    description: "Detects 10+ failed login attempts followed by a successful login and profile change",
    category: "Account Security",
    riskWeight: 90,
    lastModified: "2026-02-04T12:00:00.000Z",
    createdBy: "Rajesh Kumar",
    createdOn: "2026-02-04T11:55:00.000Z"
  }
];

export const INITIAL_PENDING_DATA: ScenarioItem[] = [
  { 
    id: "SCN-1090", 
    name: "Rapid Onboarding Activity", 
    workspace: "Customer", 
    group: "Risk", 
    status: "Pending Approval", 
    hits: "0", 
    performance: 0,
    description: "High volume of activity within 48 hours of account opening",
    category: "Synthetic Identity",
    riskWeight: 80,
    lastModified: "2026-01-30T15:30:00.000Z",
    createdBy: "Sarah Johnson",
    createdOn: "2026-01-30T15:30:00.000Z"
  },
  { 
    id: "SCN-1091", 
    name: "Unusual ATM Cash-Out", 
    workspace: "ATM", 
    group: "Fraud", 
    status: "Pending Approval", 
    hits: "0", 
    performance: 0,
    description: "Multiple maximum limit withdrawals at different ATM locations in 2 hours",
    category: "Cash-Out Fraud",
    riskWeight: 95,
    lastModified: "2026-01-30T16:40:00.000Z",
    createdBy: "John Smith",
    createdOn: "2026-01-30T16:40:00.000Z"
  },
  { 
    id: "SCN-1092", 
    name: "Shell Company Wire Transfer", 
    workspace: "Transaction", 
    group: "AML", 
    status: "Pending Approval", 
    hits: "0", 
    performance: 0,
    description: "Large incoming wires from offshore jurisdictions followed by immediate dispersal",
    category: "Money Laundering",
    riskWeight: 92,
    lastModified: "2026-01-30T12:00:00.000Z",
    createdBy: "Emma Davis",
    createdOn: "2026-01-30T12:00:00.000Z"
  },
  { 
    id: "SCN-1093", 
    name: "Account Takeover Attempt", 
    workspace: "Account", 
    group: "Security", 
    status: "Rejected", 
    statusNote: "Missing audit trails for password resets",
    hits: "0", 
    performance: 0,
    description: "Password reset followed by immediate large fund transfer request",
    category: "ATO",
    riskWeight: 88,
    lastModified: "2026-01-30T09:30:00.000Z",
    createdBy: "Michael Brown",
    createdOn: "2026-01-30T09:30:00.000Z"
  },
  { 
    id: "SCN-1094", 
    name: "Multiple Micro-Deposits", 
    workspace: "Account", 
    group: "Compliance", 
    status: "Pending Approval", 
    hits: "0", 
    performance: 0,
    description: "Series of small deposits under $1 to verify account linkages across multiple banks",
    category: "Structuring",
    riskWeight: 65,
    lastModified: "2026-01-30T07:45:00.000Z",
    createdBy: "Sarah Johnson",
    createdOn: "2026-01-30T07:45:00.000Z"
  },
  { 
    id: "SCN-1095", 
    name: "New_Beneficiary_Large_Wire", 
    workspace: "Beneficiary", 
    group: "Fraud", 
    status: "Pending Approval", 
    hits: "0", 
    performance: 0,
    description: "Immediate high-value wire after beneficiary registration", 
    category: "Payment Fraud",
    riskWeight: 92,
    lastModified: "2026-02-03T11:55:00.000Z",
    createdBy: "Amit Patel",
    createdOn: "2026-01-31T14:20:00.000Z"
  },
  { 
    id: "SCN-1096", 
    name: "Card_CNP_International_Burst", 
    workspace: "Card", 
    group: "Risk", 
    status: "Pending Approval", 
    hits: "0", 
    performance: 0,
    description: "International Card Not Present burst transactions", 
    category: "Card Fraud",
    riskWeight: 74,
    lastModified: "2026-02-03T10:05:00.000Z",
    createdBy: "System",
    createdOn: "2026-01-31T09:40:00.000Z"
  },
  { 
    id: "SCN-1097", 
    name: "Layering_Pattern_Detection", 
    workspace: "Transaction", 
    group: "AML", 
    status: "Pending Approval", 
    hits: "0", 
    performance: 0,
    description: "Multiple small deposits followed by large withdrawal within 24h", 
    category: "Money Laundering",
    riskWeight: 88,
    lastModified: "2026-01-30T15:30:00.000Z",
    createdBy: "Rajesh Kumar",
    createdOn: "2026-01-30T15:30:00.000Z"
  },
  { 
    id: "SCN-1098", 
    name: "Employee_Account_Self_Transfer", 
    workspace: "Account", 
    group: "Internal", 
    status: "Pending Approval", 
    hits: "0", 
    performance: 0,
    description: "Detecting transfers between employee accounts and related parties", 
    category: "Internal Fraud",
    riskWeight: 45,
    lastModified: "2026-01-29T16:40:00.000Z",
    createdBy: "Sarah Chen",
    createdOn: "2026-01-29T16:40:00.000Z"
  }
];

