import React, { useState } from "react";
import {
  SendAlt,
  Renew,
  Filter,
  Search,
  CheckmarkOutline,
  Close,
  Edit,
  Email,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Add,
  Save,
} from "@carbon/icons-react";
import PageHeader from "./page-header";

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

interface ResponseItem {
  id: string;
  subject: string;
  status: "Draft" | "Ready" | "Sent";
  date: string;
  to: string;
  toEmail: string;
  from: string;
  fromEmail: string;
  mailbox: string;
  emailUUID: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  responseBody: string;
  originalRequestId: string;
  analysisResult: AnalysisResult;
  processingInfo: ProcessingInfo;
}

const MOCK_RESPONSES: ResponseItem[] = [
  {
    id: "RES-2026-001",
    subject: "RE: FW: Cyber Cell Indore Comp. No. 74/23 (Insp. Dinesh verma) Sc- PNB",
    status: "Ready",
    date: "09 Apr 2026, 11:20 am",
    to: "State Cyber Crime",
    toEmail: "io1-cybercell@mppolice.gov.in",
    from: "Dhruva N. Kadaba",
    fromEmail: "dnkadaba@yahoo.com",
    mailbox: "dnkadaba",
    emailUUID: "71befd8a-1c33-47ad-a812-8e4901f65832",
    priority: "Low",
    originalRequestId: "REQ-2026-001",
    responseBody: `Dear Sir/Madam,

This is with reference to your communication dated 4 February 2025 regarding Cyber Cell Indore Complaint No. 74/23 under Section 91 CrPC.

We have processed your request and are pleased to furnish the following information:

1. Account Statement (Opening Date to Till Date) for all three accounts mentioned.
2. KYC documents and Account Opening Forms (scanned copies) — attached herewith.
3. Branch Manager details are available upon formal requisition with authorized seal.
4. Account Balance and status as on date of request — enclosed.
5. Registered Mobile Numbers and Email IDs — attached in prescribed format.
6. NEFT/RTGS/UPI/POS/IMPS transaction details (Debit and Credit separately with beneficiary details in Excel format) — attached.
7. Net Banking IP Logs — attached.
8. Debit/Credit Card details — attached.

Kindly acknowledge receipt of this response.

Regards,
Compliance Team
Punjab National Bank`,
    analysisResult: {
      categories: ["POLICE_REQUEST", "LAW_ENFORCEMENT", "RESPONSE_DRAFTED"],
      priority: "URGENT",
      classificationConfidence: "HIGH",
      detectedLanguage: "en",
      entitiesExtracted: 6,
      determinedActions: ["ACCOUNT_STATEMENT", "KYC_DOCUMENTS", "ACCOUNT_OPENING_FORMS", "BALANCE_INQUIRY", "ACCOUNT_HOLDER_DETAILS"],
    },
    processingInfo: { status: "Ready", created: "08 Apr 2026, 10:34 am", updated: "09 Apr 2026, 11:20 am", tenantId: "Global" },
  },
  {
    id: "RES-2026-002",
    subject: "RE: Account Freeze Request - CBI Complaint 2025/CB/1234",
    status: "Draft",
    date: "08 Apr 2026, 09:45 am",
    to: "Krishna Preethi Chitrala",
    toEmail: "krishna.chitrala@pnb.co.in",
    from: "Cyber Crime Monitoring Cell",
    fromEmail: "cybercrimecell@pnb.co.in",
    mailbox: "cybercrimecell",
    emailUUID: "b3c4d5e6-f7a8-9012-bcde-f23456789013",
    priority: "High",
    originalRequestId: "REQ-2026-002",
    responseBody: `Dear Ma'am,

This is in reference to your request dated 7 April 2026 regarding CBI Complaint 2025/CB/1234, directing the freeze of account XXXX-XXXX-4521 held by Mr. Rajesh Kumar Sharma.

We hereby confirm that the said account has been FROZEN with immediate effect as per the directions of the Honourable Court order no. 2025/CB/1234.

Account freeze details:
- Account Number: XXXX-XXXX-4521
- Account Holder: Rajesh Kumar Sharma
- Branch: Indore Main Branch
- Freeze Effective From: 08 Apr 2026, 09:45 am
- Reference Number: FRZ-2026-001

Please contact us if any further information is required.

Regards,
Account Operations
Punjab National Bank`,
    analysisResult: {
      categories: ["ACCOUNT_FREEZE", "CBI_REQUEST", "LAW_ENFORCEMENT"],
      priority: "HIGH",
      classificationConfidence: "HIGH",
      detectedLanguage: "en",
      entitiesExtracted: 3,
      determinedActions: ["ACCOUNT_FREEZE", "ACCOUNT_HOLDER_DETAILS"],
    },
    processingInfo: { status: "Draft", created: "07 Apr 2026, 03:15 pm", updated: "08 Apr 2026, 09:45 am", tenantId: "Global" },
  },
  {
    id: "RES-2026-003",
    subject: "RE: Legal Notice: Account Holder Details Required - Complaint 5678",
    status: "Ready",
    date: "07 Apr 2026, 02:30 pm",
    to: "State Cyber Crime Cell",
    toEmail: "io1-cybercell@mppolice.gov.in",
    from: "Dhruva N. Kadaba",
    fromEmail: "dnkadaba@yahoo.com",
    mailbox: "dnkadaba",
    emailUUID: "c4d5e6f7-a8b9-0123-cdef-345678901234",
    priority: "Medium",
    originalRequestId: "REQ-2026-003",
    responseBody: `Dear Sir/Madam,

This is with reference to your Legal Notice under Section 91 CrPC dated 6 April 2026, regarding Complaint No. 5678 pertaining to an online fraud.

In response to your request for account holder details, please find the following information:

Account Number: XXXX-XXXX-9012
Branch: Indore Branch (IFSC: PUNB0031520)

KYC Details (enclosed as per prescribed format):
- Name of Account Holder: [As per bank records — provided in sealed attachment]
- Address: [As per KYC — provided in sealed attachment]
- Identity Documents: [As per KYC — provided in sealed attachment]

This information is being provided strictly for investigation purposes and must be used in accordance with applicable data protection laws.

Regards,
Compliance Team
Punjab National Bank`,
    analysisResult: {
      categories: ["POLICE_REQUEST", "LAW_ENFORCEMENT", "KYC_RESPONSE"],
      priority: "MEDIUM",
      classificationConfidence: "MEDIUM",
      detectedLanguage: "en",
      entitiesExtracted: 2,
      determinedActions: ["ACCOUNT_HOLDER_DETAILS", "KYC_DOCUMENTS"],
    },
    processingInfo: { status: "Ready", created: "06 Apr 2026, 11:20 am", updated: "07 Apr 2026, 02:30 pm", tenantId: "Global" },
  },
  {
    id: "RES-2026-004",
    subject: "RE: Urgent: Court Order for Account Statement - Case No. HC/2026/0291",
    status: "Draft",
    date: "06 Apr 2026, 10:00 am",
    to: "High Court Registry",
    toEmail: "registry@mphighcourt.gov.in",
    from: "Legal Compliance Cell",
    fromEmail: "legal@pnb.co.in",
    mailbox: "legal_notice",
    emailUUID: "d5e6f7a8-b9c0-1234-defa-456789012345",
    priority: "Critical",
    originalRequestId: "REQ-2026-004",
    responseBody: `To,
The Registrar
Hon'ble High Court of Madhya Pradesh

Subject: Compliance with Court Order in Case No. HC/2026/0291

Dear Sir,

This is in compliance with the order dated 04-Apr-2026 passed by the Hon'ble High Court of Madhya Pradesh in Case No. HC/2026/0291.

We hereby produce the complete account statement of the account holder (Account: XXXX-XXXX-7761) for the period 01-Jan-2025 to 31-Mar-2026, as directed by the court.

The documents are enclosed in a sealed cover as per court's directions:
- Account Statement (01-Jan-2025 to 31-Mar-2026) — Enclosed
- Certificate of Authenticity — Enclosed
- Affidavit by Authorized Signatory — Enclosed

We request the Hon'ble Court to acknowledge receipt of the documents.

Yours faithfully,
Chief Compliance Officer
Punjab National Bank`,
    analysisResult: {
      categories: ["COURT_ORDER", "LAW_ENFORCEMENT", "URGENT_COMPLIANCE"],
      priority: "URGENT",
      classificationConfidence: "HIGH",
      detectedLanguage: "en",
      entitiesExtracted: 4,
      determinedActions: ["ACCOUNT_STATEMENT"],
    },
    processingInfo: { status: "Draft", created: "05 Apr 2026, 09:05 am", updated: "06 Apr 2026, 10:00 am", tenantId: "Global" },
  },
  {
    id: "RES-2026-005",
    subject: "RE: RE: Account Unfreeze Request - FIR No. 2025/456/CBI",
    status: "Sent",
    date: "05 Apr 2026, 11:15 am",
    to: "Anjali Mehta",
    toEmail: "anjali.mehta@cbi.gov.in",
    from: "Account Operations",
    fromEmail: "accountops@pnb.co.in",
    mailbox: "account_unfreeze",
    emailUUID: "e6f7a8b9-c0d1-2345-efab-567890123456",
    priority: "High",
    originalRequestId: "REQ-2026-005",
    responseBody: `Dear Ma'am,

This is with reference to your communication regarding FIR No. 2025/456/CBI and the request for unfreezing of account held by Mr. Suresh Babu Naidu.

We are pleased to inform you that the account has been UNFROZEN with immediate effect, following the disposal of the case and your request.

Account Unfreeze Details:
- Account Number: XXXX-XXXX-7892
- Account Holder: Suresh Babu Naidu
- Original Freeze Date: 12 Jan 2026
- Unfreeze Effective From: 05 Apr 2026, 11:15 am
- Reference Number: UFZ-2026-001

The account holder has been notified separately of the unfreezing of their account.

Regards,
Account Operations Team
Punjab National Bank`,
    analysisResult: {
      categories: ["ACCOUNT_UNFREEZE", "CBI_REQUEST", "LAW_ENFORCEMENT"],
      priority: "HIGH",
      classificationConfidence: "HIGH",
      detectedLanguage: "en",
      entitiesExtracted: 3,
      determinedActions: ["ACCOUNT_UNFREEZE"],
    },
    processingInfo: { status: "Sent", created: "04 Apr 2026, 02:48 pm", updated: "05 Apr 2026, 11:15 am", tenantId: "Global" },
  },
  {
    id: "RES-2026-006",
    subject: "RE: FW: DPDP Act Compliance - Customer Data Disclosure Request",
    status: "Ready",
    date: "04 Apr 2026, 03:00 pm",
    to: "Data Protection Officer",
    toEmail: "dpo@meity.gov.in",
    from: "Cyber Crime Monitoring Cell",
    fromEmail: "cybercrimecell@pnb.co.in",
    mailbox: "cybercrimecell",
    emailUUID: "f7a8b9c0-d1e2-3456-fabc-678901234567",
    priority: "Medium",
    originalRequestId: "REQ-2026-006",
    responseBody: `Dear Sir/Madam,

This is in response to your communication dated 3 April 2026, under Section 12 of the Digital Personal Data Protection Act, 2023, requesting details of the account holder associated with account XXXX-XXXX-6612 (IFSC: PUNB0050100).

In compliance with DPDP Act, 2023 provisions and applicable RBI guidelines, we furnish the following information in the prescribed format:

1. Account Holder Details: Provided in the attached sealed document.
2. KYC Documents: Provided as per the prescribed format in the attachment.

We wish to confirm that this disclosure is being made solely for the purposes specified under Section 12 of the DPDP Act, 2023 and in response to a request from the Data Protection Board.

Please acknowledge receipt of this communication.

Regards,
Compliance Team
Punjab National Bank`,
    analysisResult: {
      categories: ["DPDP_COMPLIANCE", "DATA_DISCLOSURE", "REGULATORY"],
      priority: "MEDIUM",
      classificationConfidence: "MEDIUM",
      detectedLanguage: "en",
      entitiesExtracted: 2,
      determinedActions: ["ACCOUNT_HOLDER_DETAILS", "KYC_DOCUMENTS"],
    },
    processingInfo: { status: "Ready", created: "03 Apr 2026, 04:30 pm", updated: "04 Apr 2026, 03:00 pm", tenantId: "Global" },
  },
  {
    id: "RES-2026-007",
    subject: "RE: Account Opening Form Verification - Ref: AO/2026/PNB/8832",
    status: "Sent",
    date: "03 Apr 2026, 10:30 am",
    to: "Branch Operations",
    toEmail: "branchops.indore@pnb.co.in",
    from: "Central KYC Cell",
    fromEmail: "ckyc@pnb.co.in",
    mailbox: "account_opening",
    emailUUID: "a8b9c0d1-e2f3-4567-abcd-789012345678",
    priority: "Low",
    originalRequestId: "REQ-2026-007",
    responseBody: `Dear Team,

This is with reference to your communication dated 2 April 2026 regarding Account Opening Form verification for new customer Ref: AO/2026/PNB/8832.

We have completed the Central KYC verification for the following customer:

Customer Name: Priya Ramesh Iyer
Account Type: Savings
Branch Code: PNB-IN-0042
Reference: AO/2026/PNB/8832

Verification Status: APPROVED
CKYC Number: CKYC-2026-88321-IN

All KYC documents submitted have been verified and are found to be in order. The account may be activated at the branch level.

Please proceed with account activation and notify the customer accordingly.

Regards,
Central KYC Cell
Punjab National Bank`,
    analysisResult: {
      categories: ["ACCOUNT_OPENING", "KYC_VERIFICATION", "INTERNAL"],
      priority: "LOW",
      classificationConfidence: "HIGH",
      detectedLanguage: "en",
      entitiesExtracted: 3,
      determinedActions: ["ACCOUNT_OPENING_FORMS", "KYC_DOCUMENTS"],
    },
    processingInfo: { status: "Sent", created: "02 Apr 2026, 12:15 pm", updated: "03 Apr 2026, 10:30 am", tenantId: "Global" },
  },
  {
    id: "RES-2026-008",
    subject: "RE: Police Requisition: Transaction Details for FIR 2026/CR/1109",
    status: "Draft",
    date: "02 Apr 2026, 02:15 pm",
    to: "SP Office Bhopal",
    toEmail: "sp.bhopal@mppolice.gov.in",
    from: "Dhruva N. Kadaba",
    fromEmail: "dnkadaba@yahoo.com",
    mailbox: "dnkadaba",
    emailUUID: "b9c0d1e2-f3a4-5678-bcde-890123456789",
    priority: "High",
    originalRequestId: "REQ-2026-008",
    responseBody: `Dear Sir,

This is in response to your requisition under Section 160 CrPC dated 1 April 2026, regarding FIR No. 2026/CR/1109 registered at Bhopal Kotwali Police Station.

As requested, please find the complete transaction details for Account XXXX-XXXX-3341 (IFSC: PUNB0BH0001) for the period 01-Oct-2025 to 31-Mar-2026, enclosed herewith.

Documents Provided:
1. Account Statement (01-Oct-2025 to 31-Mar-2026) — Excel Format
2. NEFT/RTGS Transaction Details (with beneficiary information) — Excel Format
3. UPI Transaction Log — Excel Format
4. ATM/POS Transaction Details — Excel Format
5. Certificate of Authenticity — Attached

All transaction details include Debit and Credit entries separately with beneficiary/remitter information as available in bank records.

This information is provided solely for the purpose of investigation of FIR 2026/CR/1109 and must be used accordingly.

Regards,
Compliance Team
Punjab National Bank`,
    analysisResult: {
      categories: ["POLICE_REQUEST", "TRANSACTION_INQUIRY", "LAW_ENFORCEMENT"],
      priority: "HIGH",
      classificationConfidence: "HIGH",
      detectedLanguage: "en",
      entitiesExtracted: 4,
      determinedActions: ["ACCOUNT_STATEMENT", "TRANSACTION_DETAILS"],
    },
    processingInfo: { status: "Draft", created: "01 Apr 2026, 08:50 am", updated: "02 Apr 2026, 02:15 pm", tenantId: "Global" },
  },
];

const priorityColors: Record<string, string> = {
  Low: "bg-[#defbe6] text-[#0e6027]",
  Medium: "bg-[#fdf1c2] text-[#8a5c00]",
  High: "bg-[#fff1f1] text-[#a2191f]",
  Critical: "bg-[#a2191f] text-white"
};

const statusColors: Record<string, string> = {
  Draft: "bg-[#e8e8e8] text-[#525252]",
  Ready: "bg-[#defbe6] text-[#0e6027]",
  Sent: "bg-[#edf5ff] text-[#0043ce]"
};

interface Props {
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
}

const PRIORITY_ORDER: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
const STATUS_ORDER: Record<string, number> = { Draft: 0, Ready: 1, Sent: 2 };

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
};

function parseResponseDate(dateStr: string): number {
  const [datePart, timePart] = dateStr.split(", ");
  const [day, mon, year] = datePart.split(" ");
  const [time, meridiem] = timePart.split(" ");
  const [h, m] = time.split(":").map(Number);
  const hour = meridiem === "pm" && h !== 12 ? h + 12 : meridiem === "am" && h === 12 ? 0 : h;
  return new Date(Number(year), MONTH_MAP[mon], Number(day), hour, m).getTime();
}

export function ResponseConfirmationPage({ breadcrumbs, onBreadcrumbNavigate }: Props) {
  const [responses, setResponses] = useState<ResponseItem[]>(MOCK_RESPONSES);
  const [selected, setSelected] = useState<ResponseItem | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-newest");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editToRecipients, setEditToRecipients] = useState<string[]>([""]);
  const [editCcRecipients, setEditCcRecipients] = useState<string[]>([]);

  const openEditDialog = () => {
    if (!selected) return;
    setEditSubject(selected.subject);
    setEditBody(selected.responseBody);
    setEditToRecipients([selected.toEmail]);
    setEditCcRecipients([]);
    setShowEditDialog(true);
  };

  const saveEditChanges = () => {
    if (!selected) return;
    const updated: ResponseItem = {
      ...selected,
      subject: editSubject,
      responseBody: editBody,
      toEmail: editToRecipients[0] ?? selected.toEmail,
    };
    setResponses(prev => prev.map(r => r.id === selected.id ? updated : r));
    setSelected(updated);
    setShowEditDialog(false);
  };

  const filtered = responses
    .filter(r => {
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        r.subject.toLowerCase().includes(q) ||
        r.toEmail.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.to.toLowerCase().includes(q);
      const matchesStatus = filterStatus === "All" || r.status === filterStatus;
      const matchesPriority = filterPriority === "All" || r.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "date-newest") return parseResponseDate(b.date) - parseResponseDate(a.date);
      if (sortBy === "date-oldest") return parseResponseDate(a.date) - parseResponseDate(b.date);
      if (sortBy === "priority") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sortBy === "status") return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      return 0;
    });

  const activeFilterCount = (filterStatus !== "All" ? 1 : 0) + (filterPriority !== "All" ? 1 : 0);

  return (
    <div className="flex flex-col h-full bg-white">
      <PageHeader
        title="Response Confirmation"
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
                  placeholder="Search responses by subject, recipient, ID..."
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
                    {["All", "Draft", "Ready", "Sent"].map(s => (
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

            {/* Left panel — response list */}
            <div className={`flex flex-col border-r border-[#e0e0e0] bg-[#f4f4f4] shrink-0 transition-all duration-200 ${leftPanelOpen ? "w-[420px]" : "w-10"}`}>

              {leftPanelOpen ? (
              <>
              {/* List header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2 min-w-0">
                  <SendAlt size={18} className="text-[#198038] shrink-0" />
                  <span className="text-[14px] font-semibold text-[#161616] truncate">Responses Pending Confirmation</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#198038] text-white text-[11px] font-medium shrink-0">
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

              {/* Response list */}
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center p-6">
                    <SendAlt size={32} className="text-[#c6c6c6] mb-3" />
                    <p className="text-[14px] text-[#525252]">No responses found.</p>
                  </div>
                ) : (
                  filtered.map(response => (
                    <button
                      key={response.id}
                      onClick={() => setSelected(response)}
                      className={`w-full text-left p-4 border-b border-[#e0e0e0] transition-colors ${selected?.id === response.id ? "bg-[#edf5ff] border-l-2 border-l-[#2A53A0]" : "bg-white hover:bg-[#f4f4f4]"}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[13px] font-medium text-[#161616] line-clamp-2 flex-1">{response.subject}</span>
                        <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-sm font-medium ${statusColors[response.status]}`}>
                          {response.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] text-[#198038] bg-[#defbe6] px-2 py-0.5 rounded-sm font-medium">{response.id}</span>
                        <span className="text-[11px] text-[#525252]">→ {response.originalRequestId}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-[#525252]">
                        <span>📅 {response.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] text-[#525252] mt-0.5">
                        <Email size={12} />
                        <span className="truncate">To: {response.to} &lt;{response.toEmail}&gt;</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#525252]">ID: {response.id}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${priorityColors[response.priority]}`}>
                            — {response.priority}
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
                      Response List ({filtered.length})
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right panel — response detail */}
            <div className="flex-1 flex flex-col overflow-hidden border-l border-[#e0e0e0]">
              {selected ? (
                <>
                  {/* Detail header */}
                  {(() => {
                    const selectedIndex = filtered.findIndex(r => r.id === selected.id);
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
                            <span className="text-[11px] text-[#198038] bg-[#defbe6] px-2 py-0.5 rounded-sm font-medium">{selected.id}</span>
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
                            title="Previous response"
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <button
                            onClick={() => hasNext && setSelected(filtered[selectedIndex + 1])}
                            disabled={!hasNext}
                            className={`w-7 h-7 flex items-center justify-center rounded border border-[#e0e0e0] transition-colors ${hasNext ? "bg-white hover:bg-[#e8e8e8] text-[#161616]" : "bg-[#f4f4f4] text-[#c6c6c6] cursor-not-allowed"}`}
                            title="Next response"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Scrollable detail body */}
                  <div className="flex-1 overflow-y-auto">

                    {/* Response Details */}
                    <div className="px-5 py-4 border-b border-[#e0e0e0]">
                      <h4 className="text-[13px] font-semibold text-[#161616] mb-3">Response Details</h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px] mb-4">
                        <div>
                          <span className="text-[12px] text-[#525252] block mb-0.5">From</span>
                          <span className="text-[13px] text-[#161616]">{selected.from} &lt;{selected.fromEmail}&gt;</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-[#525252] block mb-0.5">Date</span>
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
                        <div>
                          <span className="text-[12px] text-[#525252] block mb-0.5">Original Request ID</span>
                          <span className="text-[13px] text-[#2A53A0] font-medium">{selected.originalRequestId}</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-[#525252] block mb-0.5">Priority</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-sm font-medium ${priorityColors[selected.priority]}`}>
                            {selected.priority}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[12px] text-[#525252] block mb-0.5">Subject</span>
                          <span className="text-[13px] text-[#161616]">{selected.subject}</span>
                        </div>
                      </div>
                    </div>

                    {/* Response Body */}
                    <div className="px-5 py-4 border-b border-[#e0e0e0]">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[13px] font-semibold text-[#161616]">Response Body</h4>
                        <button className="flex items-center gap-1.5 h-7 px-3 border border-[#e0e0e0] bg-white text-[11px] font-medium text-[#161616] rounded hover:bg-[#e8e8e8] transition-colors">
                          <Renew size={12} />
                          Regenerate
                        </button>
                      </div>
                      <div className="text-[13px] text-[#161616] bg-[#f4f4f4] border border-[#e0e0e0] rounded p-4 leading-relaxed whitespace-pre-wrap">
                        {selected.responseBody}
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
                      <button onClick={openEditDialog} className="flex-1 flex items-center justify-center gap-2 text-[#161616] text-[14px] font-medium transition-colors bg-[#f1c21b] hover:bg-[#d2a106]" style={{ height: "46px", borderRadius: "8px" }}>
                        Edit Response
                        <Edit size={16} />
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 text-white text-[14px] font-medium transition-colors bg-[#198038] hover:bg-[#0e6027]" style={{ height: "46px", borderRadius: "8px" }}>
                        Confirm &amp; Send
                        <SendAlt size={16} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <SendAlt size={48} className="text-[#c6c6c6] mb-4" />
                  <p className="text-[16px] text-[#525252] font-medium">Select a response to review</p>
                  <p className="text-[13px] text-[#a8a8a8] mt-1">Click on any response from the list to view details</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Carbon Design System Modal — Edit Response */}
      {showEditDialog && selected && (
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
              className="shrink-0 flex items-center justify-between"
              style={{ backgroundColor: "#2A53A0", padding: "20px 16px", minHeight: "72px" }}
            >
              <div className="flex items-center gap-3">
                <Edit size={20} style={{ color: "#ffffff" }} />
                <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#ffffff", margin: 0 }}>
                  Edit Response
                </h2>
              </div>
              <button
                onClick={() => setShowEditDialog(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}
                title="Close"
              >
                <Close size={20} />
              </button>
            </div>

            {/* Carbon Modal Body */}
            <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#f4f4f4", padding: "24px" }}>
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e0e0e0" }}>

                {/* Section toolbar */}
                <div
                  className="flex items-center justify-between"
                  style={{ padding: "14px 16px", backgroundColor: "#f4f4f4", borderBottom: "1px solid #e0e0e0" }}
                >
                  <div className="flex items-center gap-2">
                    <SendAlt size={16} style={{ color: "#2A53A0" }} />
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#161616" }}>Compose Response</span>
                  </div>
                </div>

                {/* Form content */}
                <div style={{ padding: "24px 24px 28px" }}>

                  {/* To / CC — two-column grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
                    {/* To */}
                    <div>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "8px" }}>
                        To <span style={{ color: "#a2191f" }}>*</span>
                      </label>
                      {editToRecipients.map((r, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <input
                            type="email"
                            value={r}
                            onChange={e => setEditToRecipients(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                            placeholder="recipient@example.com"
                            style={{ flex: 1, height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none" }}
                          />
                          {editToRecipients.length > 1 && (
                            <button onClick={() => setEditToRecipients(prev => prev.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#a2191f", display: "flex", padding: "4px" }}>
                              <Close size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => setEditToRecipients(prev => [...prev, ""])} style={{ fontSize: "13px", color: "#2A53A0", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                        <Add size={14} /> Add recipient
                      </button>
                    </div>

                    {/* CC */}
                    <div>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "8px" }}>CC</label>
                      {editCcRecipients.map((r, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <input
                            type="email"
                            value={r}
                            onChange={e => setEditCcRecipients(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                            placeholder="cc@example.com"
                            style={{ flex: 1, height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none" }}
                          />
                          <button onClick={() => setEditCcRecipients(prev => prev.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#a2191f", display: "flex", padding: "4px" }}>
                            <Close size={14} />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => setEditCcRecipients(prev => [...prev, ""])} style={{ fontSize: "13px", color: "#2A53A0", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "4px" }}>
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
                      value={editSubject}
                      onChange={e => setEditSubject(e.target.value)}
                      style={{ width: "100%", height: "40px", padding: "0 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Response Body */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#161616", display: "block", marginBottom: "8px" }}>
                      Response Body <span style={{ color: "#a2191f" }}>*</span>
                    </label>
                    <textarea
                      value={editBody}
                      onChange={e => setEditBody(e.target.value)}
                      rows={14}
                      style={{ width: "100%", padding: "12px 14px", fontSize: "14px", color: "#161616", backgroundColor: "#ffffff", border: "1px solid #8d8d8d", borderRadius: "8px", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.6 }}
                    />
                  </div>

                  {/* Original Request Reference */}
                  <div style={{ border: "1px solid #e0e0e0" }}>
                    <div style={{ padding: "10px 16px", backgroundColor: "#e0e0e0", borderBottom: "1px solid #c6c6c6" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#525252" }}>Original Request Reference</span>
                    </div>
                    <div style={{ padding: "14px 16px", backgroundColor: "#fafafa", fontSize: "12px", color: "#161616", lineHeight: 1.7 }}>
                      <p style={{ margin: "0 0 2px 0" }}><strong>Request ID:</strong> {selected.originalRequestId}</p>
                      <p style={{ margin: "0 0 2px 0" }}><strong>Subject:</strong> {selected.subject}</p>
                      <p style={{ margin: "0 0 2px 0" }}><strong>To:</strong> {selected.to} &lt;{selected.toEmail}&gt;</p>
                      <p style={{ margin: 0 }}><strong>Priority:</strong> {selected.priority}</p>
                    </div>
                  </div>

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
                  setEditSubject(selected.subject);
                  setEditBody(selected.responseBody);
                  setEditToRecipients([selected.toEmail]);
                  setEditCcRecipients([]);
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
      )}

    </div>
  );
}
