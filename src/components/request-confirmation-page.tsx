import React, { useState } from "react";
import {
  CheckmarkOutline,
  Email,
  Renew,
  Filter,
  Search,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Close,
  Edit,
  SendAlt,
  Information,
  Add,
  TrashCan,
  Save,
  TableSplit,
  Building,
  Identification,
  Tag,
  Currency,
  Calendar,
  Flash,
} from "@carbon/icons-react";
import PageHeader from "./page-header";

interface ExtractedRow {
  customerIdentifier: string;
  ifsc: string;
  accountNumber: string;
  transactionId: string;
  amount: string;
  statementDateRange: string;
  actions: string[];
}

interface AnalysisResult {
  categories: string[];
  priority: string;
  classificationConfidence: string;
  detectedLanguage: string;
  entitiesExtracted: number;
  determinedActions: string[];
}

interface ProcessingInfo {
  status: string;
  created: string;
  updated: string;
  tenantId: string;
}

interface EmailItem {
  id: string;
  subject: string;
  status: "Extracted" | "Pending" | "Confirmed";
  tag: string;
  date: string;
  sender: string;
  senderEmail: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  mailbox: string;
  to: string;
  toEmail: string;
  emailUUID: string;
  body: string;
  extractedInfo: ExtractedRow[];
  analysisResult: AnalysisResult;
  processingInfo: ProcessingInfo;
}

const MOCK_EMAILS: EmailItem[] = [
  {
    id: "REQ-2026-001",
    subject: "FW: Cyber Cell Indore Comp. No. 74/23 (Insp. Dinesh verma) Sc- PNB",
    status: "Extracted",
    tag: "REQ-2026-001",
    date: "08 Apr 2026, 10:34 am",
    sender: '"Dhruva N. Kadaba"',
    senderEmail: "dnkadaba@yahoo.com",
    priority: "Low",
    mailbox: "dnkadaba",
    to: "Dhruva Kadaba",
    toEmail: "dnkadaba@yahoo.com",
    emailUUID: "58aedd6e-fc54-46fc-9373-5d3780e54719",
    body: `<p><strong>From:</strong> "STATE CYBER CRIME" &lt;io1-cybercell@mppolice.gov.in&gt;<br/>
<strong>To:</strong> "Cyber Crime Monitoring Cell" &lt;cybercrimecell@pnb.co.in&gt;, "BO31520" &lt;BO31520@PNB.CO.IN&gt;, "BO4751" &lt;BO4751@PNB.CO.IN&gt;, "BO4081" &lt;BO4081@PNB.CO.IN&gt;<br/>
<strong>Sent:</strong> Tuesday, 4 February, 2025 12:59:25<br/>
<strong>Subject:</strong> FW: Cyber Cell Indore Comp. No. 74/23 (Insp. Dinesh verma) Sc- PNB</p>
<h2><strong>(Under Section 91 CrPC)</strong></h2>
<p>To,<br/>&nbsp;&nbsp;&nbsp;&nbsp;The Branch manager<br/>&nbsp;&nbsp;&nbsp;&nbsp;PNB Bank</p>
<p>Cyber &amp; High-tech crime police station Bhopal, Zone Indore is investigating Comp. <strong>No. 74/23</strong>. The role of the following accounts of your bank in the crime investigation appears suspicious.</p>
<p>Kindly provide bank details of the below given Bank account.</p>
<p><strong>Account No. - <u>0315202100000264</u> , IFSC CODE - <u>PUNB0031520</u></strong><br/>
<strong>Account No. - <u>4751002100008129</u> , IFSC CODE - <u>PUNB0475100</u></strong><br/>
<strong>Account No. - <u>4081002101022537</u> , IFSC CODE - <u>PUNB0408100</u></strong></p>
<p>Hence please provide the below-given information U/S 91 CrPC.</p>
<ol>
<li><u>Account statement</u> from date Opening Date To Till Date.</li>
<li>Provide <u>KYC</u> of above Account, <u>Account Opening</u> form scanned copy</li>
<li>Provide Branch Manager's Name and Contact information, Email id.</li>
<li>Status of Account and Account <u>Balance</u>.</li>
<li>Registered Mobile Number and Email id in the above account.</li>
<li>provide (IMPS, RTGS, UPI, POS, NEFT, etc.) From date opening date To Till date Transaction Debit and Credit separate Details with beneficial details. (Excel Format)</li>
<li>Kindly Provide <span style="color:red">Net banking Ip logs details</span>.</li>
<li>issue all Debit/credit card details.</li>
<li>If the said account has been blocked by any other agency or law enforcement agency that supplies the information of that agency.</li>
</ol>
<p>Regards<br/>INCHARGE<br/>State Cyber crime<br/>Zone,Indore(mp)<br/>Phone- 0731-2490373.</p>`,
    extractedInfo: [
      { customerIdentifier: "-", ifsc: "PUNB0031520", accountNumber: "0315202100000264", transactionId: "-", amount: "-", statementDateRange: "-", actions: ["ACCOUNT_STATEMENT", "KYC_DOCUMENTS", "ACCOUNT_OPENING_FORMS", "BALANCE_INQUIRY", "ACCOUNT_HOLDER_DETAILS"] },
      { customerIdentifier: "-", ifsc: "PUNB0475100", accountNumber: "4751002100008129", transactionId: "-", amount: "-", statementDateRange: "-", actions: ["ACCOUNT_STATEMENT", "KYC_DOCUMENTS", "ACCOUNT_OPENING_FORMS", "BALANCE_INQUIRY", "ACCOUNT_HOLDER_DETAILS"] },
      { customerIdentifier: "-", ifsc: "PUNB0408100", accountNumber: "4081002101022537", transactionId: "-", amount: "-", statementDateRange: "-", actions: ["ACCOUNT_STATEMENT", "KYC_DOCUMENTS", "ACCOUNT_OPENING_FORMS", "BALANCE_INQUIRY", "ACCOUNT_HOLDER_DETAILS"] },
    ],
    analysisResult: {
      categories: ["POLICE_REQUEST", "UNAUTH_TRANS_ALERT", "INTER_BRANCH", "LAW_ENFORCEMENT"],
      priority: "URGENT",
      classificationConfidence: "HIGH",
      detectedLanguage: "en",
      entitiesExtracted: 6,
      determinedActions: ["ACCOUNT_STATEMENT", "KYC_DOCUMENTS", "ACCOUNT_OPENING_FORMS", "BALANCE_INQUIRY", "ACCOUNT_HOLDER_DETAILS"],
    },
    processingInfo: { status: "Extracted", created: "14 Apr 2026, 03:26 pm", updated: "15 Apr 2026, 09:04 am", tenantId: "Global" },
  },
  {
    id: "REQ-2026-002",
    subject: "Account Freeze Request - CBI Complaint 2025/CB/1234",
    status: "Pending",
    tag: "REQ-2026-002",
    date: "07 Apr 2026, 03:15 pm",
    sender: '"Krishna Preethi Chitrala"',
    senderEmail: "krishna.chitrala@pnb.co.in",
    priority: "High",
    mailbox: "cybercrimecell",
    to: "Cyber Crime Monitoring Cell",
    toEmail: "cybercrimecell@pnb.co.in",
    emailUUID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    body: `<p><strong>From:</strong> "Krishna Preethi Chitrala" &lt;krishna.chitrala@pnb.co.in&gt;<br/>
<strong>To:</strong> "Cyber Crime Monitoring Cell" &lt;cybercrimecell@pnb.co.in&gt;<br/>
<strong>Sent:</strong> Monday, 7 April, 2026 15:15:00<br/>
<strong>Subject:</strong> Account Freeze Request - CBI Complaint 2025/CB/1234</p>
<p>Dear Sir/Madam,</p>
<p>Kindly freeze the following account as per the directions of the Honourable Court order no. 2025/CB/1234. The account holder details are attached herewith for reference. Please acknowledge receipt and action taken within 24 hours.</p>
<p><strong>Account No:</strong> XXXX-XXXX-4521<br/>
<strong>Account Holder:</strong> Rajesh Kumar Sharma<br/>
<strong>Branch:</strong> Indore Main Branch</p>`,
    extractedInfo: [
      { customerIdentifier: "Rajesh Kumar Sharma", ifsc: "PUNB0031520", accountNumber: "XXXX-XXXX-4521", transactionId: "-", amount: "-", statementDateRange: "-", actions: ["ACCOUNT_FREEZE", "ACCOUNT_HOLDER_DETAILS"] },
    ],
    analysisResult: { categories: ["ACCOUNT_FREEZE", "CBI_REQUEST", "LAW_ENFORCEMENT"], priority: "HIGH", classificationConfidence: "HIGH", detectedLanguage: "en", entitiesExtracted: 3, determinedActions: ["ACCOUNT_FREEZE", "ACCOUNT_HOLDER_DETAILS"] },
    processingInfo: { status: "Pending", created: "07 Apr 2026, 03:15 pm", updated: "07 Apr 2026, 04:00 pm", tenantId: "Global" },
  },
  {
    id: "REQ-2026-003",
    subject: "Legal Notice: Account Holder Details Required - Complaint 5678",
    status: "Extracted",
    tag: "REQ-2026-003",
    date: "06 Apr 2026, 11:20 am",
    sender: '"State Cyber Crime Cell"',
    senderEmail: "io1-cybercell@mppolice.gov.in",
    priority: "Medium",
    mailbox: "dnkadaba",
    to: "Dhruva Kadaba",
    toEmail: "dnkadaba@yahoo.com",
    emailUUID: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    body: `<p><strong>From:</strong> "State Cyber Crime Cell" &lt;io1-cybercell@mppolice.gov.in&gt;<br/>
<strong>To:</strong> Dhruva Kadaba &lt;dnkadaba@yahoo.com&gt;<br/>
<strong>Sent:</strong> Sunday, 6 April, 2026 11:20:00<br/>
<strong>Subject:</strong> Legal Notice: Account Holder Details Required - Complaint 5678</p>
<p>This is a legal notice under Section 91 CrPC requesting account holder details for Complaint No. 5678 pertaining to an online fraud reported by the complainant. Kindly furnish the required details within 3 working days.</p>`,
    extractedInfo: [
      { customerIdentifier: "-", ifsc: "PUNB0031520", accountNumber: "XXXX-XXXX-9012", transactionId: "-", amount: "-", statementDateRange: "-", actions: ["ACCOUNT_HOLDER_DETAILS", "KYC_DOCUMENTS"] },
    ],
    analysisResult: { categories: ["POLICE_REQUEST", "LAW_ENFORCEMENT"], priority: "MEDIUM", classificationConfidence: "MEDIUM", detectedLanguage: "en", entitiesExtracted: 2, determinedActions: ["ACCOUNT_HOLDER_DETAILS", "KYC_DOCUMENTS"] },
    processingInfo: { status: "Extracted", created: "06 Apr 2026, 11:20 am", updated: "06 Apr 2026, 12:30 pm", tenantId: "Global" },
  },
  {
    id: "REQ-2026-004",
    subject: "Urgent: Court Order for Account Statement - Case No. HC/2026/0291",
    status: "Extracted",
    tag: "REQ-2026-004",
    date: "05 Apr 2026, 09:05 am",
    sender: '"High Court Registry"',
    senderEmail: "registry@mphighcourt.gov.in",
    priority: "Critical",
    mailbox: "legal_notice",
    to: "Legal Compliance Cell",
    toEmail: "legal@pnb.co.in",
    emailUUID: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    body: `<p><strong>From:</strong> "High Court Registry" &lt;registry@mphighcourt.gov.in&gt;<br/>
<strong>To:</strong> Legal Compliance Cell &lt;legal@pnb.co.in&gt;<br/>
<strong>Sent:</strong> Saturday, 5 April, 2026 09:05:00<br/>
<strong>Subject:</strong> Urgent: Court Order for Account Statement - Case No. HC/2026/0291</p>
<p>In pursuance of the order dated 04-Apr-2026 passed by Hon'ble High Court of Madhya Pradesh in Case No. HC/2026/0291, you are directed to produce the complete account statement of the account holder for the period 01-Jan-2025 to 31-Mar-2026 before the court within 7 days from the date of receipt of this notice.</p>
<p>Non-compliance shall be treated as contempt of court.</p>`,
    extractedInfo: [
      { customerIdentifier: "-", ifsc: "PUNB0100200", accountNumber: "XXXX-XXXX-7761", transactionId: "-", amount: "-", statementDateRange: "01-Jan-2025 to 31-Mar-2026", actions: ["ACCOUNT_STATEMENT"] },
    ],
    analysisResult: { categories: ["COURT_ORDER", "LAW_ENFORCEMENT", "URGENT_COMPLIANCE"], priority: "URGENT", classificationConfidence: "HIGH", detectedLanguage: "en", entitiesExtracted: 4, determinedActions: ["ACCOUNT_STATEMENT"] },
    processingInfo: { status: "Extracted", created: "05 Apr 2026, 09:05 am", updated: "05 Apr 2026, 10:15 am", tenantId: "Global" },
  },
  {
    id: "REQ-2026-005",
    subject: "RE: Account Unfreeze Request - FIR No. 2025/456/CBI",
    status: "Pending",
    tag: "REQ-2026-005",
    date: "04 Apr 2026, 02:48 pm",
    sender: '"Anjali Mehta"',
    senderEmail: "anjali.mehta@cbi.gov.in",
    priority: "High",
    mailbox: "account_unfreeze",
    to: "Account Operations",
    toEmail: "accountops@pnb.co.in",
    emailUUID: "d4e5f6a7-b8c9-0123-defa-234567890123",
    body: `<p><strong>From:</strong> "Anjali Mehta" &lt;anjali.mehta@cbi.gov.in&gt;<br/>
<strong>To:</strong> Account Operations &lt;accountops@pnb.co.in&gt;<br/>
<strong>Sent:</strong> Friday, 4 April, 2026 14:48:00<br/>
<strong>Subject:</strong> RE: Account Unfreeze Request - FIR No. 2025/456/CBI</p>
<p>This is with reference to the earlier communication regarding FIR No. 2025/456/CBI. After completion of the investigation, the CBI hereby requests unfreezing of the account as the case has been disposed of. Please process the unfreeze request on priority.</p>
<p><strong>Account No:</strong> XXXX-XXXX-7892<br/>
<strong>Account Holder:</strong> Suresh Babu Naidu<br/>
<strong>Date of Freeze:</strong> 12 Jan 2026</p>`,
    extractedInfo: [
      { customerIdentifier: "Suresh Babu Naidu", ifsc: "PUNB0200100", accountNumber: "XXXX-XXXX-7892", transactionId: "-", amount: "-", statementDateRange: "-", actions: ["ACCOUNT_UNFREEZE"] },
    ],
    analysisResult: { categories: ["ACCOUNT_UNFREEZE", "CBI_REQUEST", "LAW_ENFORCEMENT"], priority: "HIGH", classificationConfidence: "HIGH", detectedLanguage: "en", entitiesExtracted: 3, determinedActions: ["ACCOUNT_UNFREEZE"] },
    processingInfo: { status: "Pending", created: "04 Apr 2026, 02:48 pm", updated: "04 Apr 2026, 03:30 pm", tenantId: "Global" },
  },
  {
    id: "REQ-2026-006",
    subject: "FW: DPDP Act Compliance - Customer Data Disclosure Request",
    status: "Extracted",
    tag: "REQ-2026-006",
    date: "03 Apr 2026, 04:30 pm",
    sender: '"Data Protection Officer"',
    senderEmail: "dpo@meity.gov.in",
    priority: "Medium",
    mailbox: "cybercrimecell",
    to: "Cyber Crime Monitoring Cell",
    toEmail: "cybercrimecell@pnb.co.in",
    emailUUID: "e5f6a7b8-c9d0-1234-efab-345678901234",
    body: `<p><strong>From:</strong> "Data Protection Officer" &lt;dpo@meity.gov.in&gt;<br/>
<strong>To:</strong> Cyber Crime Monitoring Cell &lt;cybercrimecell@pnb.co.in&gt;<br/>
<strong>Sent:</strong> Thursday, 3 April, 2026 16:30:00<br/>
<strong>Subject:</strong> FW: DPDP Act Compliance - Customer Data Disclosure Request</p>
<p>Under Section 12 of the Digital Personal Data Protection Act, 2023, you are requested to provide details of account holder associated with the following identifiers as part of an ongoing investigation by the Data Protection Board.</p>
<p>Please respond within 5 business days with the required information in the prescribed format.</p>`,
    extractedInfo: [
      { customerIdentifier: "-", ifsc: "PUNB0050100", accountNumber: "XXXX-XXXX-6612", transactionId: "-", amount: "-", statementDateRange: "-", actions: ["ACCOUNT_HOLDER_DETAILS", "KYC_DOCUMENTS"] },
    ],
    analysisResult: { categories: ["DPDP_COMPLIANCE", "DATA_DISCLOSURE", "REGULATORY"], priority: "MEDIUM", classificationConfidence: "MEDIUM", detectedLanguage: "en", entitiesExtracted: 2, determinedActions: ["ACCOUNT_HOLDER_DETAILS", "KYC_DOCUMENTS"] },
    processingInfo: { status: "Extracted", created: "03 Apr 2026, 04:30 pm", updated: "03 Apr 2026, 05:15 pm", tenantId: "Global" },
  },
  {
    id: "REQ-2026-007",
    subject: "Account Opening Form Verification - Ref: AO/2026/PNB/8832",
    status: "Confirmed",
    tag: "REQ-2026-007",
    date: "02 Apr 2026, 12:15 pm",
    sender: '"Branch Operations"',
    senderEmail: "branchops.indore@pnb.co.in",
    priority: "Low",
    mailbox: "account_opening",
    to: "Central KYC Cell",
    toEmail: "ckyc@pnb.co.in",
    emailUUID: "f6a7b8c9-d0e1-2345-fabc-456789012345",
    body: `<p><strong>From:</strong> "Branch Operations" &lt;branchops.indore@pnb.co.in&gt;<br/>
<strong>To:</strong> Central KYC Cell &lt;ckyc@pnb.co.in&gt;<br/>
<strong>Sent:</strong> Wednesday, 2 April, 2026 12:15:00<br/>
<strong>Subject:</strong> Account Opening Form Verification - Ref: AO/2026/PNB/8832</p>
<p>Kindly find attached the account opening form for the new customer onboarded at Indore Main Branch. All KYC documents have been collected and verified at branch level. Please complete central verification at the earliest.</p>
<p><strong>Customer Name:</strong> Priya Ramesh Iyer<br/>
<strong>Account Type:</strong> Savings<br/>
<strong>Branch Code:</strong> PNB-IN-0042</p>`,
    extractedInfo: [
      { customerIdentifier: "Priya Ramesh Iyer", ifsc: "PUNB0IN0042", accountNumber: "AO/2026/PNB/8832", transactionId: "-", amount: "-", statementDateRange: "-", actions: ["ACCOUNT_OPENING_FORMS", "KYC_DOCUMENTS"] },
    ],
    analysisResult: { categories: ["ACCOUNT_OPENING", "KYC_VERIFICATION", "INTERNAL"], priority: "LOW", classificationConfidence: "HIGH", detectedLanguage: "en", entitiesExtracted: 3, determinedActions: ["ACCOUNT_OPENING_FORMS", "KYC_DOCUMENTS"] },
    processingInfo: { status: "Confirmed", created: "02 Apr 2026, 12:15 pm", updated: "02 Apr 2026, 02:45 pm", tenantId: "Global" },
  },
  {
    id: "REQ-2026-008",
    subject: "Police Requisition: Transaction Details for FIR 2026/CR/1109",
    status: "Pending",
    tag: "REQ-2026-008",
    date: "01 Apr 2026, 08:50 am",
    sender: '"SP Office Bhopal"',
    senderEmail: "sp.bhopal@mppolice.gov.in",
    priority: "High",
    mailbox: "dnkadaba",
    to: "Dhruva Kadaba",
    toEmail: "dnkadaba@yahoo.com",
    emailUUID: "a7b8c9d0-e1f2-3456-abcd-567890123456",
    body: `<p><strong>From:</strong> "SP Office Bhopal" &lt;sp.bhopal@mppolice.gov.in&gt;<br/>
<strong>To:</strong> Dhruva Kadaba &lt;dnkadaba@yahoo.com&gt;<br/>
<strong>Sent:</strong> Tuesday, 1 April, 2026 08:50:00<br/>
<strong>Subject:</strong> Police Requisition: Transaction Details for FIR 2026/CR/1109</p>
<p>Under Section 160 CrPC, you are hereby requisitioned to provide complete transaction details including NEFT/RTGS/UPI records for the account mentioned below, for the period 01-Oct-2025 to 31-Mar-2026, in connection with FIR No. 2026/CR/1109 registered at Bhopal Kotwali Police Station.</p>
<p><strong>Case Type:</strong> Online Financial Fraud<br/>
<strong>Accused Account:</strong> XXXX-XXXX-3341</p>`,
    extractedInfo: [
      { customerIdentifier: "-", ifsc: "PUNB0BH0001", accountNumber: "XXXX-XXXX-3341", transactionId: "-", amount: "-", statementDateRange: "01-Oct-2025 to 31-Mar-2026", actions: ["ACCOUNT_STATEMENT", "TRANSACTION_DETAILS"] },
    ],
    analysisResult: { categories: ["POLICE_REQUEST", "TRANSACTION_INQUIRY", "LAW_ENFORCEMENT"], priority: "HIGH", classificationConfidence: "HIGH", detectedLanguage: "en", entitiesExtracted: 4, determinedActions: ["ACCOUNT_STATEMENT", "TRANSACTION_DETAILS"] },
    processingInfo: { status: "Pending", created: "01 Apr 2026, 08:50 am", updated: "01 Apr 2026, 09:30 am", tenantId: "Global" },
  },
];


const priorityColors: Record<string, string> = {
  Low: "bg-[#defbe6] text-[#0e6027]",
  Medium: "bg-[#fdf1c2] text-[#8a5c00]",
  High: "bg-[#fff1f1] text-[#a2191f]",
  Critical: "bg-[#a2191f] text-white"
};

const statusColors: Record<string, string> = {
  Extracted: "bg-[#edf5ff] text-[#0043ce]",
  Pending: "bg-[#fdf1c2] text-[#8a5c00]",
  Confirmed: "bg-[#defbe6] text-[#0e6027]"
};

interface Props {
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
}

const PRIORITY_ORDER: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
const STATUS_ORDER: Record<string, number> = { Extracted: 0, Pending: 1, Confirmed: 2 };

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
};

function parseEmailDate(dateStr: string): number {
  // "08 Apr 2026, 10:34 am"
  const [datePart, timePart] = dateStr.split(", ");
  const [day, mon, year] = datePart.split(" ");
  const [time, meridiem] = timePart.split(" ");
  const [h, m] = time.split(":").map(Number);
  const hour = meridiem === "pm" && h !== 12 ? h + 12 : meridiem === "am" && h === 12 ? 0 : h;
  return new Date(Number(year), MONTH_MAP[mon], Number(day), hour, m).getTime();
}

export function RequestConfirmationPage({ breadcrumbs, onBreadcrumbNavigate }: Props) {
  const [emails, setEmails] = useState<EmailItem[]>(MOCK_EMAILS);
  const [selected, setSelected] = useState<EmailItem | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-newest");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [actionsDropdownRow, setActionsDropdownRow] = useState<number | null>(null);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [forwardMode, setForwardMode] = useState<"full" | "actions">("full");
  const [toRecipients, setToRecipients] = useState<string[]>([""]);
  const [ccRecipients, setCcRecipients] = useState<string[]>([]);
  const [forwardSubject, setForwardSubject] = useState("");
  const [coverMessage, setCoverMessage] = useState("");

  const openForwardDialog = () => {
    if (!selected) return;
    setForwardMode("full");
    setToRecipients([""]);
    setCcRecipients([]);
    setForwardSubject("Fwd: " + selected.subject);
    setCoverMessage("");
    setShowForwardDialog(true);
  };
  const [editRows, setEditRows] = useState<ExtractedRow[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  const openEditDialog = () => {
    if (!selected) return;
    setEditRows(selected.extractedInfo.map(r => ({ ...r, actions: [...r.actions] })));
    setEditingRowIndex(null);
    setShowEditDialog(true);
  };

  const saveEditChanges = () => {
    if (!selected) return;
    const updated = { ...selected, extractedInfo: editRows };
    setEmails(prev => prev.map(e => e.id === selected.id ? updated : e));
    setSelected(updated);
    setShowEditDialog(false);
    setEditingRowIndex(null);
  };

  const addEditRow = () => {
    setEditRows(prev => [...prev, { customerIdentifier: "", ifsc: "", accountNumber: "", transactionId: "", amount: "", statementDateRange: "", actions: [] }]);
    setEditingRowIndex(editRows.length);
  };

  const deleteEditRow = (index: number) => {
    setEditRows(prev => prev.filter((_, i) => i !== index));
    if (editingRowIndex === index) setEditingRowIndex(null);
  };

  const updateEditRow = (index: number, field: keyof ExtractedRow, value: string) => {
    setEditRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: field === "actions" ? value.split(",").map(s => s.trim()).filter(Boolean) : value } : r));
  };

  const filtered = emails
    .filter(e => {
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        e.subject.toLowerCase().includes(q) ||
        e.senderEmail.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.sender.toLowerCase().includes(q);
      const matchesStatus = filterStatus === "All" || e.status === filterStatus;
      const matchesPriority = filterPriority === "All" || e.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "date-newest") return parseEmailDate(b.date) - parseEmailDate(a.date);
      if (sortBy === "date-oldest") return parseEmailDate(a.date) - parseEmailDate(b.date);
      if (sortBy === "priority") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sortBy === "status") return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      return 0;
    });

  const activeFilterCount = (filterStatus !== "All" ? 1 : 0) + (filterPriority !== "All" ? 1 : 0);

  return (
    <div className="flex flex-col h-full bg-white">
      <PageHeader
        title="Request Confirmation"
        breadcrumbs={breadcrumbs}
        onBreadcrumbNavigate={onBreadcrumbNavigate}
      />

      {/* Main content section */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="flex flex-col h-full gap-4">

          {/* Search + Filter bar */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center h-11 px-4 gap-3 bg-white border border-[#e0e0e0] rounded-lg">
                <Search size={16} className="text-[#525252] shrink-0" />
                <input
                  className="flex-1 bg-transparent text-[14px] text-[#161616] placeholder:text-[#a8a8a8] outline-none"
                  placeholder="Search emails by subject, sender, identifiers..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-[#525252] hover:text-[#161616]">
                    <Close size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`relative flex items-center gap-2 px-4 h-11 border rounded-lg text-[14px] transition-colors shrink-0 ${showFilters || activeFilterCount > 0 ? "bg-[#edf5ff] border-[#2A53A0] text-[#2A53A0]" : "bg-white border-[#e0e0e0] text-[#161616] hover:bg-[#e8e8e8]"}`}
              >
                <Filter size={16} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#2A53A0] text-white text-[10px] flex items-center justify-center font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter panel */}
            {showFilters && (
              <div className="flex items-center gap-4 px-4 py-3 bg-white border border-[#e0e0e0] rounded-lg">
                {/* Status filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-[#525252] shrink-0">Status:</span>
                  <div className="flex gap-1">
                    {["All", "Extracted", "Pending", "Confirmed"].map(s => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${filterStatus === s ? "bg-[#2A53A0] text-white" : "bg-[#f4f4f4] text-[#525252] hover:bg-[#e8e8e8]"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-px h-5 bg-[#e0e0e0]" />

                {/* Priority filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-[#525252] shrink-0">Priority:</span>
                  <div className="flex gap-1">
                    {["All", "Critical", "High", "Medium", "Low"].map(p => (
                      <button
                        key={p}
                        onClick={() => setFilterPriority(p)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${filterPriority === p ? "bg-[#2A53A0] text-white" : "bg-[#f4f4f4] text-[#525252] hover:bg-[#e8e8e8]"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <>
                    <div className="w-px h-5 bg-[#e0e0e0]" />
                    <button
                      onClick={() => { setFilterStatus("All"); setFilterPriority("All"); }}
                      className="text-[12px] text-[#a2191f] hover:underline shrink-0"
                    >
                      Clear all
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Split panel body */}
          <div className="flex flex-1 overflow-hidden border border-[#e0e0e0] rounded-lg bg-white">

            {/* Left panel — email list */}
            <div className={`flex flex-col border-r border-[#e0e0e0] bg-[#f4f4f4] shrink-0 transition-all duration-200 ${leftPanelOpen ? "w-[420px]" : "w-10"}`}>

              {leftPanelOpen ? (
              <>
              {/* List header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckmarkOutline size={18} className="text-[#2A53A0] shrink-0" />
                  <span className="text-[14px] font-semibold text-[#161616] truncate">Extracted Emails Pending Confirmation</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2A53A0] text-white text-[11px] font-medium shrink-0">
                    {filtered.length}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-1.5 hover:bg-[#e0e0e0] rounded transition-colors">
                    <Renew size={16} className="text-[#525252]" />
                  </button>
                  <button
                    onClick={() => setLeftPanelOpen(false)}
                    className="p-1.5 hover:bg-[#e0e0e0] rounded transition-colors"
                    title="Collapse panel"
                  >
                    <ChevronLeft size={16} className="text-[#525252]" />
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[#e0e0e0] bg-white">
                <span className="text-[13px] text-[#525252]">Sort by:</span>
                <div className="relative inline-flex items-center">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none text-[13px] text-[#161616] bg-white border border-[#e0e0e0] rounded px-3 py-1 pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2A53A0]"
                  >
                    <option value="date-newest">Date (Newest First)</option>
                    <option value="date-oldest">Date (Oldest First)</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 pointer-events-none text-[#525252]" />
                </div>
              </div>

              {/* Email list */}
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center p-6">
                    <Email size={32} className="text-[#c6c6c6] mb-3" />
                    <p className="text-[14px] text-[#525252]">No emails found.</p>
                  </div>
                ) : (
                  filtered.map(email => (
                    <button
                      key={email.id}
                      onClick={() => setSelected(email)}
                      className={`w-full text-left p-4 border-b border-[#e0e0e0] transition-colors ${selected?.id === email.id ? "bg-[#edf5ff] border-l-2 border-l-[#2A53A0]" : "bg-white hover:bg-[#f4f4f4]"}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[13px] font-medium text-[#161616] line-clamp-2 flex-1">{email.subject}</span>
                        <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-sm font-medium ${statusColors[email.status]}`}>
                          {email.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] text-[#2A53A0] bg-[#edf5ff] px-2 py-0.5 rounded-sm font-medium">{email.tag}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-[#525252]">
                        <span>📅 {email.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] text-[#525252] mt-0.5">
                        <Email size={12} />
                        <span className="truncate">{email.sender} &lt;{email.senderEmail}&gt;</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#525252]">ID: {email.id}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${priorityColors[email.priority]}`}>
                            — {email.priority}
                          </span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-[#e0e0e0] flex items-center justify-center">
                          <User size={12} className="text-[#525252]" />
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
              </>
              ) : (
                /* Collapsed state — vertical expand button */
                <div className="flex flex-col items-center pt-3 gap-2 bg-white h-full">
                  <button
                    onClick={() => setLeftPanelOpen(true)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e0e0e0] transition-colors"
                    title="Expand panel"
                  >
                    <ChevronRight size={16} className="text-[#525252]" />
                  </button>
                  <div className="flex-1 flex items-center justify-center">
                    <span
                      className="text-[13px] font-semibold text-[#161616] whitespace-nowrap"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      Email List ({filtered.length})
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right panel — email detail */}
            <div className="flex-1 flex flex-col overflow-hidden border-l border-[#e0e0e0]">
                {selected ? (
                  <>
                    {/* Detail header */}
                    {(() => {
                      const selectedIndex = filtered.findIndex(e => e.id === selected.id);
                      const hasPrev = selectedIndex > 0;
                      const hasNext = selectedIndex < filtered.length - 1;
                      return (
                        <div className="flex items-center justify-between px-5 py-3 border-b border-[#e0e0e0] bg-white shrink-0 gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[13px] font-medium text-[#161616] line-clamp-1">{selected.subject}</span>
                              <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-sm font-medium ${statusColors[selected.status]}`}>
                                {selected.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[#2A53A0] bg-[#edf5ff] px-2 py-0.5 rounded-sm font-medium">{selected.tag}</span>
                              <span className="text-[11px] text-[#525252]">Email ID: {selected.emailUUID}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[12px] text-[#525252] mr-1 whitespace-nowrap">
                              {selectedIndex + 1} of {filtered.length}
                            </span>
                            <button
                              onClick={() => hasPrev && setSelected(filtered[selectedIndex - 1])}
                              disabled={!hasPrev}
                              className={`w-7 h-7 flex items-center justify-center rounded border border-[#e0e0e0] transition-colors ${hasPrev ? "bg-white hover:bg-[#e8e8e8] text-[#161616]" : "bg-[#f4f4f4] text-[#c6c6c6] cursor-not-allowed"}`}
                              title="Previous email"
                            >
                              <ChevronLeft size={14} />
                            </button>
                            <button
                              onClick={() => hasNext && setSelected(filtered[selectedIndex + 1])}
                              disabled={!hasNext}
                              className={`w-7 h-7 flex items-center justify-center rounded border border-[#e0e0e0] transition-colors ${hasNext ? "bg-white hover:bg-[#e8e8e8] text-[#161616]" : "bg-[#f4f4f4] text-[#c6c6c6] cursor-not-allowed"}`}
                              title="Next email"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Scrollable detail body */}
                    <div className="flex-1 overflow-y-auto">

                      {/* Email Details */}
                      <div className="px-5 py-4 border-b border-[#e0e0e0]">
                        <h4 className="text-[13px] font-semibold text-[#161616] mb-3">Email Details</h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px] mb-4">
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-0.5">From</span>
                            <span className="text-[13px] text-[#161616]">{selected.sender} &lt;{selected.senderEmail}&gt;</span>
                          </div>
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-0.5">Received</span>
                            <span className="text-[13px] text-[#161616]">{selected.date}</span>
                          </div>
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-0.5">To</span>
                            <span className="text-[13px] text-[#161616]">{selected.to} &lt;{selected.toEmail}&gt;</span>
                          </div>
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-0.5">Mailbox</span>
                            <span className="text-[13px] text-[#161616]">{selected.mailbox}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[12px] text-[#525252] block mb-0.5">Subject</span>
                            <span className="text-[13px] text-[#161616]">{selected.subject}</span>
                          </div>
                        </div>
                        <div
                          className="text-[13px] text-[#161616] bg-[#f4f4f4] border border-[#e0e0e0] rounded p-4 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: selected.body }}
                        />
                      </div>

                      {/* Extracted Information */}
                      <div className="px-5 py-4 border-b border-[#e0e0e0]">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-[13px] font-semibold text-[#161616]">Extracted Information</h4>
                          <button className="flex items-center gap-1.5 h-7 px-3 border border-[#e0e0e0] bg-white text-[11px] font-medium text-[#161616] rounded hover:bg-[#e8e8e8] transition-colors">
                            <Renew size={12} />
                            Reprocess
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-[12px]">
                            <thead>
                              <tr className="bg-[#f4f4f4]">
                                {["Customer Identifier", "Bank Identifier (IFSC)", "Account Identifier", "Transaction ID", "Amount", "Statement Date Range", "Actions"].map(col => (
                                  <th key={col} className="px-3 py-2 text-left text-[12px] font-semibold text-[#525252] border border-[#e0e0e0] whitespace-nowrap">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {selected.extractedInfo.map((row, i) => (
                                <tr key={i} className="border-b border-[#e0e0e0] hover:bg-[#f4f4f4]">
                                  <td className="px-3 py-2 border border-[#e0e0e0] text-[#161616]">{row.customerIdentifier}</td>
                                  <td className="px-3 py-2 border border-[#e0e0e0] text-[#2A53A0] font-medium">{row.ifsc}</td>
                                  <td className="px-3 py-2 border border-[#e0e0e0] text-[#2A53A0] font-medium">{row.accountNumber}</td>
                                  <td className="px-3 py-2 border border-[#e0e0e0] text-[#161616]">{row.transactionId}</td>
                                  <td className="px-3 py-2 border border-[#e0e0e0] text-[#161616]">{row.amount}</td>
                                  <td className="px-3 py-2 border border-[#e0e0e0] text-[#161616] whitespace-nowrap">{row.statementDateRange}</td>
                                  <td className="px-3 py-2 border border-[#e0e0e0]">
                                    <div className="flex flex-wrap gap-1">
                                      {row.actions.map(a => (
                                        <span key={a} className="text-[10px] px-1.5 py-0.5 bg-[#edf5ff] text-[#0043ce] rounded-sm font-medium whitespace-nowrap">{a}</span>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Analysis Result */}
                      <div className="px-5 py-4 border-b border-[#e0e0e0]">
                        <h4 className="text-[13px] font-semibold text-[#161616] mb-3">Analysis Result</h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-1.5">Categories</span>
                            <div className="flex flex-wrap gap-1">
                              {selected.analysisResult.categories.map(c => (
                                <span key={c} className="text-[10px] px-2 py-0.5 bg-[#f2e8ff] text-[#6929c4] rounded-sm font-medium">{c}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-1.5">Determined Actions</span>
                            <div className="flex flex-wrap gap-1">
                              {selected.analysisResult.determinedActions.map(a => (
                                <span key={a} className="text-[10px] px-2 py-0.5 bg-[#edf5ff] text-[#0043ce] rounded-sm font-medium">{a}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-1">Priority</span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${
                              selected.analysisResult.priority === "URGENT" ? "bg-[#a2191f] text-white" :
                              selected.analysisResult.priority === "HIGH" ? "bg-[#fff1f1] text-[#a2191f]" :
                              selected.analysisResult.priority === "MEDIUM" ? "bg-[#fdf1c2] text-[#8a5c00]" :
                              "bg-[#defbe6] text-[#0e6027]"
                            }`}>{selected.analysisResult.priority}</span>
                          </div>
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-1">Classification Confidence</span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${
                              selected.analysisResult.classificationConfidence === "HIGH" ? "bg-[#defbe6] text-[#0e6027]" :
                              selected.analysisResult.classificationConfidence === "MEDIUM" ? "bg-[#fdf1c2] text-[#8a5c00]" :
                              "bg-[#fff1f1] text-[#a2191f]"
                            }`}>{selected.analysisResult.classificationConfidence}</span>
                          </div>
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-1">Detected Language</span>
                            <span className="text-[13px] text-[#161616]">{selected.analysisResult.detectedLanguage}</span>
                          </div>
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-1">Entities Extracted</span>
                            <span className="text-[13px] text-[#161616] font-semibold">{selected.analysisResult.entitiesExtracted}</span>
                          </div>
                        </div>
                      </div>

                      {/* Processing Information */}
                      <div className="px-5 py-4">
                        <h4 className="text-[13px] font-semibold text-[#161616] mb-3">Processing Information</h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-1">Status</span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${statusColors[selected.processingInfo.status as keyof typeof statusColors] ?? "bg-[#e8e8e8] text-[#525252]"}`}>
                              {selected.processingInfo.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-1">Tenant ID</span>
                            <span className="text-[13px] text-[#161616]">{selected.processingInfo.tenantId}</span>
                          </div>
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-1">Created</span>
                            <span className="text-[13px] text-[#161616]">{selected.processingInfo.created}</span>
                          </div>
                          <div>
                            <span className="text-[12px] text-[#525252] block mb-1">Updated</span>
                            <span className="text-[13px] text-[#161616]">{selected.processingInfo.updated}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 px-5 border-t border-[#e0e0e0] bg-white shrink-0" style={{ height: "80px" }}>
                      <button className="flex items-center justify-center gap-2 px-5 text-[14px] font-medium transition-colors hover:bg-[#c6c6c6]" style={{ height: "46px", borderRadius: "8px", backgroundColor: "#D9D9D9", color: "#525252" }}>
                        Cancel
                        <Close size={16} />
                      </button>
                      <div className="flex-1 flex items-center gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 text-white text-[14px] font-medium transition-colors bg-[#198038] hover:bg-[#0e6027]" style={{ height: "46px", borderRadius: "8px" }}>
                          Approve Extraction
                          <CheckmarkOutline size={16} />
                        </button>
                        <button onClick={openEditDialog} className="flex-1 flex items-center justify-center gap-2 text-[#161616] text-[14px] font-medium transition-colors bg-[#f1c21b] hover:bg-[#d2a106]" style={{ height: "46px", borderRadius: "8px" }}>
                          Edit Extraction
                          <Edit size={16} />
                        </button>
                        <button onClick={openForwardDialog} className="flex-1 flex items-center justify-center gap-2 text-white text-[14px] font-medium transition-colors bg-[#2A53A0] hover:bg-[#1d3d7a]" style={{ height: "46px", borderRadius: "8px" }}>
                          Forward via Email
                          <SendAlt size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <Email size={48} className="text-[#c6c6c6] mb-4" />
                    <p className="text-[16px] text-[#525252] font-medium">Select an email to review</p>
                    <p className="text-[13px] text-[#a8a8a8] mt-1">Click on any email from the list to view details</p>
                  </div>
                )}
            </div>

          </div>
        </div>
      </div>

      {/* Carbon Design System Modal — Edit Extracted Data */}
      {showEditDialog && selected && (() => {
        const AVAILABLE_ACTIONS = [
          "ACCOUNT_STATEMENT", "KYC_DOCUMENTS", "ACCOUNT_OPENING_FORMS",
          "BALANCE_INQUIRY", "ACCOUNT_HOLDER_DETAILS", "ACCOUNT_FREEZE",
          "ACCOUNT_UNFREEZE", "TRANSACTION_DETAILS", "NET_BANKING_IP_LOGS",
          "DEBIT_CREDIT_CARD_DETAILS",
        ];
        const carbonInput: React.CSSProperties = {
          width: "100%", height: "40px", padding: "0 16px",
          fontSize: "14px", color: "#161616", backgroundColor: "#ffffff",
          border: "1px solid #8d8d8d",
          outline: "none", borderRadius: "8px",
        };
        const toggleAction = (rowIndex: number, action: string) => {
          setEditRows(prev => prev.map((r, idx) => {
            if (idx !== rowIndex) return r;
            const has = r.actions.includes(action);
            return { ...r, actions: has ? r.actions.filter(a => a !== action) : [...r.actions, action] };
          }));
        };
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(22,22,22,0.7)" }}
            onClick={e => { if (e.target === e.currentTarget) setShowEditDialog(false); }}
          >
            <div
              className="flex flex-col"
              style={{ width: "min(1400px, 98vw)", height: "min(88vh, 860px)", backgroundColor: "#ffffff", boxShadow: "0 12px 48px rgba(0,0,0,0.4)", borderRadius: "8px", overflow: "hidden" }}
            >

              {/* Carbon Modal Header — dark blue */}
              <div
                className="shrink-0 flex items-start justify-between"
                style={{ backgroundColor: "#2A53A0", padding: "20px 16px 20px 16px", minHeight: "72px" }}
              >
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#ffffff", margin: 0, lineHeight: 1.4 }}>
                    Edit Extracted Data
                  </h2>
                </div>
                <button
                  onClick={() => setShowEditDialog(false)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", marginTop: "2px" }}
                  title="Close"
                >
                  <Close size={20} />
                </button>
              </div>

              {/* Carbon Modal Body */}
              <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#f4f4f4", padding: "24px" }}>
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e0e0e0" }}>

                  {/* Toolbar */}
                  <div
                    className="flex items-center justify-between"
                    style={{ padding: "14px 16px", backgroundColor: "#f4f4f4", borderBottom: "1px solid #e0e0e0" }}
                  >
                    <div className="flex items-center gap-2">
                      <TableSplit size={16} style={{ color: "#2A53A0" }} />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#161616" }}>Extracted Information</span>
                      <span style={{ fontSize: "13px", color: "#525252" }}>({editRows.length} rows)</span>
                    </div>
                    <button
                      onClick={addEditRow}
                      className="flex items-center gap-1.5"
                      style={{ height: "40px", padding: "0 20px", backgroundColor: "#2A53A0", color: "#ffffff", fontSize: "14px", fontWeight: 400, border: "none", cursor: "pointer", borderRadius: "0" }}
                    >
                      <Add size={16} />
                      Add Row
                    </button>
                  </div>

                  {/* Data table */}
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#e0e0e0" }}>
                          {([
                            { icon: <User size={13} />, label: "Customer" },
                            { icon: <Building size={13} />, label: "Bank" },
                            { icon: <Identification size={13} />, label: "Account Identifier" },
                            { icon: <Tag size={13} />, label: "Transaction ID" },
                            { icon: <Currency size={13} />, label: "Amount" },
                            { icon: <Calendar size={13} />, label: "Date Range" },
                            { icon: <Flash size={13} />, label: "Actions" },
                          ] as { icon: React.ReactNode; label: string }[]).map(col => (
                            <th
                              key={col.label}
                              style={{ padding: "12px 16px", textAlign: "left", borderRight: "1px solid #c6c6c6", borderBottom: "1px solid #c6c6c6" }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#525252" }}>
                                {col.icon}
                                {col.label}
                              </div>
                            </th>
                          ))}
                          <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #c6c6c6", fontSize: "12px", fontWeight: 600, color: "#525252", width: "90px" }}>
                            Edit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {editRows.length === 0 ? (
                          <tr>
                            <td colSpan={8} style={{ padding: "64px 16px", textAlign: "center", fontSize: "14px", color: "#525252" }}>
                              No rows yet. Click &ldquo;Add Row&rdquo; to add extracted data.
                            </td>
                          </tr>
                        ) : editRows.map((row, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #e0e0e0", backgroundColor: "#ffffff" }}>
                            {editingRowIndex === i ? (
                              <>
                                {/* Customer — Carbon text input */}
                                <td style={{ padding: "10px 12px", borderRight: "1px solid #e0e0e0", verticalAlign: "top" }}>
                                  <div style={{ fontSize: "11px", color: "#525252", marginBottom: "4px" }}>Customer Identifier</div>
                                  <input
                                    value={row.customerIdentifier}
                                    onChange={e => updateEditRow(i, "customerIdentifier", e.target.value)}
                                    style={carbonInput}
                                    placeholder="-"
                                  />
                                </td>
                                {/* IFSC — Carbon text input */}
                                <td style={{ padding: "10px 12px", borderRight: "1px solid #e0e0e0", verticalAlign: "top" }}>
                                  <div style={{ fontSize: "11px", color: "#525252", marginBottom: "4px" }}>IFSC Code</div>
                                  <input
                                    value={row.ifsc}
                                    onChange={e => updateEditRow(i, "ifsc", e.target.value)}
                                    style={carbonInput}
                                    placeholder="PUNB0000000"
                                  />
                                </td>
                                {/* Account Number — Carbon text input */}
                                <td style={{ padding: "10px 12px", borderRight: "1px solid #e0e0e0", verticalAlign: "top" }}>
                                  <div style={{ fontSize: "11px", color: "#525252", marginBottom: "4px" }}>Account Number</div>
                                  <input
                                    value={row.accountNumber}
                                    onChange={e => updateEditRow(i, "accountNumber", e.target.value)}
                                    style={carbonInput}
                                    placeholder="e.g. XXXX-XXXX-0000"
                                  />
                                </td>
                                {/* Transaction ID */}
                                <td style={{ padding: "10px 12px", borderRight: "1px solid #e0e0e0", verticalAlign: "top" }}>
                                  <div style={{ fontSize: "11px", color: "#525252", marginBottom: "4px" }}>Transaction ID</div>
                                  <input
                                    value={row.transactionId}
                                    onChange={e => updateEditRow(i, "transactionId", e.target.value)}
                                    style={carbonInput}
                                    placeholder="-"
                                  />
                                </td>
                                {/* Amount */}
                                <td style={{ padding: "10px 12px", borderRight: "1px solid #e0e0e0", verticalAlign: "top" }}>
                                  <div style={{ fontSize: "11px", color: "#525252", marginBottom: "4px" }}>Amount</div>
                                  <input
                                    value={row.amount}
                                    onChange={e => updateEditRow(i, "amount", e.target.value)}
                                    style={carbonInput}
                                    placeholder="-"
                                  />
                                </td>
                                {/* Date Range */}
                                <td style={{ padding: "10px 12px", borderRight: "1px solid #e0e0e0", verticalAlign: "top" }}>
                                  <div style={{ fontSize: "11px", color: "#525252", marginBottom: "4px" }}>Date Range</div>
                                  <input
                                    value={row.statementDateRange}
                                    onChange={e => updateEditRow(i, "statementDateRange", e.target.value)}
                                    style={carbonInput}
                                    placeholder="DD-MMM-YYYY to DD-MMM-YYYY"
                                  />
                                </td>
                                {/* Actions — custom multi-select dropdown */}
                                <td style={{ padding: "10px 12px", borderRight: "1px solid #e0e0e0", verticalAlign: "top" }}>
                                  <div style={{ fontSize: "11px", color: "#525252", marginBottom: "4px" }}>Actions</div>
                                  {/* Trigger button */}
                                  <button
                                    onClick={() => setActionsDropdownRow(actionsDropdownRow === i ? null : i)}
                                    style={{ width: "100%", height: "40px", padding: "0 12px 0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: row.actions.length ? "#161616" : "#8d8d8d" }}
                                  >
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>
                                      {row.actions.length === 0 ? "Select actions…" : `${row.actions.length} action${row.actions.length > 1 ? "s" : ""} selected`}
                                    </span>
                                    <ChevronDown size={16} style={{ flexShrink: 0, color: "#525252", transform: actionsDropdownRow === i ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                                  </button>
                                  {/* Inline options panel */}
                                  {actionsDropdownRow === i && (
                                    <div style={{ marginTop: "4px", border: "1px solid #8d8d8d", borderRadius: "8px", overflow: "hidden", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
                                      {AVAILABLE_ACTIONS.map(action => (
                                        <label
                                          key={action}
                                          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", cursor: "pointer", backgroundColor: row.actions.includes(action) ? "#edf5ff" : "#ffffff", borderBottom: "1px solid #f4f4f4" }}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={row.actions.includes(action)}
                                            onChange={() => toggleAction(i, action)}
                                            style={{ accentColor: "#2A53A0", width: "14px", height: "14px", flexShrink: 0 }}
                                          />
                                          <span style={{ fontSize: "12px", color: "#161616" }}>{action}</span>
                                        </label>
                                      ))}
                                    </div>
                                  )}
                                  {/* Selected tags */}
                                  {row.actions.length > 0 && (
                                    <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                      {row.actions.map(a => (
                                        <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", padding: "2px 8px", backgroundColor: "#edf5ff", color: "#0043ce", borderRadius: "4px", fontWeight: 500 }}>
                                          {a}
                                          <button onClick={() => toggleAction(i, a)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#0043ce", fontSize: "12px", lineHeight: 1, display: "flex" }}>×</button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </td>
                              </>
                            ) : (
                              <>
                                <td style={{ padding: "14px 16px", fontSize: "14px", color: "#161616", borderRight: "1px solid #e0e0e0" }}>{row.customerIdentifier || "-"}</td>
                                <td style={{ padding: "14px 16px", borderRight: "1px solid #e0e0e0" }}>
                                  <div style={{ fontSize: "11px", color: "#8d8d8d", marginBottom: "2px" }}>IFSC:</div>
                                  <div style={{ fontSize: "13px", color: "#161616", fontWeight: 500 }}>{row.ifsc || "-"}</div>
                                </td>
                                <td style={{ padding: "14px 16px", borderRight: "1px solid #e0e0e0" }}>
                                  <div style={{ fontSize: "11px", color: "#8d8d8d", marginBottom: "2px" }}>ACCOUNT NUMBER:</div>
                                  <div style={{ fontSize: "13px", color: "#161616", fontWeight: 500 }}>{row.accountNumber || "-"}</div>
                                </td>
                                <td style={{ padding: "14px 16px", fontSize: "14px", color: "#161616", borderRight: "1px solid #e0e0e0" }}>{row.transactionId || "-"}</td>
                                <td style={{ padding: "14px 16px", fontSize: "14px", color: "#161616", borderRight: "1px solid #e0e0e0" }}>{row.amount || "-"}</td>
                                <td style={{ padding: "14px 16px", fontSize: "14px", color: "#161616", borderRight: "1px solid #e0e0e0", whiteSpace: "nowrap" }}>{row.statementDateRange || "-"}</td>
                                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#161616", borderRight: "1px solid #e0e0e0" }}>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                    {row.actions.map(a => (
                                      <span key={a} style={{ fontSize: "11px", padding: "2px 8px", backgroundColor: "#edf5ff", color: "#0043ce", borderRadius: "2px", fontWeight: 500 }}>{a}</span>
                                    ))}
                                    {row.actions.length === 0 && "-"}
                                  </div>
                                </td>
                              </>
                            )}
                            <td style={{ padding: "10px 16px", textAlign: "center", verticalAlign: "middle" }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                                <button
                                  onClick={() => setEditingRowIndex(editingRowIndex === i ? null : i)}
                                  style={{ padding: "6px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", borderRadius: "2px" }}
                                  title={editingRowIndex === i ? "Done" : "Edit row"}
                                >
                                  {editingRowIndex === i
                                    ? <CheckmarkOutline size={16} style={{ color: "#198038" }} />
                                    : <Edit size={16} style={{ color: "#2A53A0" }} />
                                  }
                                </button>
                                <button
                                  onClick={() => deleteEditRow(i)}
                                  style={{ padding: "6px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", borderRadius: "2px" }}
                                  title="Delete row"
                                >
                                  <TrashCan size={16} style={{ color: "#a2191f" }} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Carbon Modal Footer — full-width 3-button layout */}
              <div className="flex shrink-0" style={{ borderTop: "1px solid #e0e0e0" }}>
                <button
                  onClick={() => setShowEditDialog(false)}
                  style={{ flex: 1, height: "64px", backgroundColor: "#f4f4f4", border: "none", borderRight: "1px solid #e0e0e0", fontSize: "14px", fontWeight: 400, color: "#2A53A0", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f4f4f4")}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setEditRows(selected.extractedInfo.map(r => ({ ...r, actions: [...r.actions] })));
                    setEditingRowIndex(null);
                  }}
                  className="flex items-center justify-center gap-2"
                  style={{ flex: 1, height: "64px", backgroundColor: "#f4f4f4", border: "none", borderRight: "1px solid #e0e0e0", fontSize: "14px", fontWeight: 400, color: "#2A53A0", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f4f4f4")}
                >
                  <Renew size={16} />
                  Reset
                </button>
                <button
                  onClick={saveEditChanges}
                  className="flex items-center justify-center gap-2"
                  style={{ flex: 1, height: "64px", backgroundColor: "#2A53A0", border: "none", fontSize: "14px", fontWeight: 400, color: "#ffffff", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1d3d7a")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2A53A0")}
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Forward Email Dialog */}
      {showForwardDialog && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(22,22,22,0.7)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowForwardDialog(false); }}
        >
          <div
            className="flex flex-col"
            style={{ width: "min(1400px, 98vw)", height: "min(88vh, 860px)", backgroundColor: "#ffffff", boxShadow: "0 12px 48px rgba(0,0,0,0.4)", borderRadius: "8px", overflow: "hidden" }}
          >
            {/* Carbon Modal Header — dark blue, same as Edit Extraction */}
            <div className="flex items-center justify-between shrink-0" style={{ backgroundColor: "#2A53A0", padding: "20px 16px", minHeight: "72px" }}>
              <div className="flex items-center gap-3">
                <Email size={20} style={{ color: "#ffffff" }} />
                <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#ffffff", margin: 0 }}>Forward Email</h2>
              </div>
              <button
                onClick={() => setShowForwardDialog(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px", display: "flex", color: "#ffffff" }}
              >
                <Close size={20} />
              </button>
            </div>

            {/* Carbon Modal Body — gray bg with white card, same as Edit Extraction */}
            <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#f4f4f4", padding: "24px" }}>
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e0e0e0" }}>

                {/* Section toolbar */}
                <div className="flex items-center justify-between" style={{ padding: "14px 16px", backgroundColor: "#f4f4f4", borderBottom: "1px solid #e0e0e0" }}>
                  <div className="flex items-center gap-2">
                    <Email size={16} style={{ color: "#2A53A0" }} />
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#161616" }}>Compose Forward</span>
                  </div>
                </div>

                {/* Form content */}
                <div style={{ padding: "24px 24px 28px" }}>

                  {/* Forward Mode */}
                  <div style={{ marginBottom: "24px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#161616", marginBottom: "12px" }}>Forward Mode</p>
                    <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                      <label style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "12px 16px", border: `2px solid ${forwardMode === "full" ? "#2A53A0" : "#e0e0e0"}`, borderRadius: "8px", backgroundColor: forwardMode === "full" ? "#edf5ff" : "#ffffff" }}>
                        <input type="radio" name="fwdMode" checked={forwardMode === "full"} onChange={() => setForwardMode("full")} style={{ accentColor: "#2A53A0", width: "16px", height: "16px", flexShrink: 0 }} />
                        <div>
                          <span style={{ fontSize: "14px", fontWeight: 500, color: "#161616" }}>Forward full email</span>
                          <span style={{ fontSize: "13px", color: "#525252", marginLeft: "8px" }}>— Include complete original email</span>
                        </div>
                      </label>
                      <label style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "12px 16px", border: `2px solid ${forwardMode === "actions" ? "#2A53A0" : "#e0e0e0"}`, borderRadius: "8px", backgroundColor: forwardMode === "actions" ? "#edf5ff" : "#ffffff" }}>
                        <input type="radio" name="fwdMode" checked={forwardMode === "actions"} onChange={() => setForwardMode("actions")} style={{ accentColor: "#2A53A0", width: "16px", height: "16px", flexShrink: 0 }} />
                        <div>
                          <span style={{ fontSize: "14px", fontWeight: 500, color: "#161616" }}>Forward selected actions</span>
                          <span style={{ fontSize: "13px", color: "#525252", marginLeft: "8px" }}>— Send structured request for specific actions</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Two-column grid for To / CC */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
                    {/* To */}
                    <div>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "8px" }}>
                        To <span style={{ color: "#a2191f" }}>*</span>
                      </label>
                      {toRecipients.map((r, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <input
                            type="email"
                            value={r}
                            onChange={e => setToRecipients(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                            placeholder="recipient@example.com"
                            style={{ flex: 1, height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none" }}
                          />
                          {toRecipients.length > 1 && (
                            <button onClick={() => setToRecipients(prev => prev.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#a2191f", display: "flex", padding: "4px" }}>
                              <Close size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => setToRecipients(prev => [...prev, ""])} style={{ fontSize: "13px", color: "#2A53A0", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                        <Add size={14} /> Add recipient
                      </button>
                    </div>

                    {/* CC */}
                    <div>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "8px" }}>CC</label>
                      {ccRecipients.map((r, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <input
                            type="email"
                            value={r}
                            onChange={e => setCcRecipients(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                            placeholder="cc@example.com"
                            style={{ flex: 1, height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none" }}
                          />
                          <button onClick={() => setCcRecipients(prev => prev.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#a2191f", display: "flex", padding: "4px" }}>
                            <Close size={14} />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => setCcRecipients(prev => [...prev, ""])} style={{ fontSize: "13px", color: "#2A53A0", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                        <Add size={14} /> Add CC
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "8px" }}>
                      Subject <span style={{ color: "#a2191f" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={forwardSubject}
                      onChange={e => setForwardSubject(e.target.value)}
                      style={{ width: "100%", height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Cover Message */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "8px" }}>Cover Message (Optional)</label>
                    <textarea
                      value={coverMessage}
                      onChange={e => setCoverMessage(e.target.value)}
                      placeholder="Add a message before the forwarded email..."
                      rows={4}
                      style={{ width: "100%", padding: "12px 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                    />
                  </div>

                  {/* Original Email Preview */}
                  <div style={{ border: "1px solid #e0e0e0" }}>
                    <div style={{ padding: "10px 16px", backgroundColor: "#e0e0e0", borderBottom: "1px solid #c6c6c6" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#525252" }}>Original Email Preview</span>
                    </div>
                    <div style={{ padding: "14px 16px", backgroundColor: "#fafafa", fontSize: "12px", color: "#161616", lineHeight: 1.7 }}>
                      <p style={{ margin: "0 0 2px 0" }}><strong>From:</strong> {selected.sender} &lt;{selected.senderEmail}&gt;</p>
                      <p style={{ margin: "0 0 2px 0" }}><strong>Date:</strong> {selected.date}</p>
                      <p style={{ margin: "0 0 2px 0" }}><strong>Subject:</strong> {selected.subject}</p>
                      <p style={{ margin: "0 0 10px 0" }}><strong>To:</strong> {selected.to} &lt;{selected.toEmail}&gt;</p>
                      <div
                        style={{ color: "#525252", fontSize: "12px", maxHeight: "90px", overflow: "hidden", WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)" }}
                        dangerouslySetInnerHTML={{ __html: selected.body }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Carbon Modal Footer — same full-width 3-button layout as Edit Extraction */}
            <div className="flex shrink-0" style={{ borderTop: "1px solid #e0e0e0" }}>
              <button
                onClick={() => setShowForwardDialog(false)}
                style={{ flex: 1, height: "64px", backgroundColor: "#f4f4f4", border: "none", borderRight: "1px solid #e0e0e0", fontSize: "14px", fontWeight: 400, color: "#2A53A0", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f4f4f4")}
              >
                Cancel
              </button>
              <button
                onClick={() => { setToRecipients([""]); setCcRecipients([]); setForwardSubject("Fwd: " + selected.subject); setCoverMessage(""); setForwardMode("full"); }}
                className="flex items-center justify-center gap-2"
                style={{ flex: 1, height: "64px", backgroundColor: "#f4f4f4", border: "none", borderRight: "1px solid #e0e0e0", fontSize: "14px", fontWeight: 400, color: "#2A53A0", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f4f4f4")}
              >
                <Renew size={16} />
                Reset
              </button>
              <button
                className="flex items-center justify-center gap-2"
                style={{ flex: 1, height: "64px", backgroundColor: "#2A53A0", border: "none", fontSize: "14px", fontWeight: 400, color: "#ffffff", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1d3d7a")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2A53A0")}
              >
                <SendAlt size={16} />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
