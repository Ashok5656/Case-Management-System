import { useState, Fragment } from "react";
import {
  ChevronSort,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Renew,
  Filter,
  Tools,
  CaretLeft,
  CaretRight,
  Edit,
  Upload,
  Launch,
} from "@carbon/icons-react";
import { cn } from "./ui/utils";
import PageHeader from "./page-header";

interface CasesPageProps {
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
  onCaseClick?: (caseId: string) => void;
}

// ── types ─────────────────────────────────────────────────────────────────────

export interface CaseAlert {
  alertId: string;
  unread: boolean;
  scenarioFactName: string;
  indicationOfFraud: string;
  alertScore: number;
  alertStatus: string;
  alertEntityId?: string;
  entityName?: string;
  alertSummary?: string;
  createdOn?: string;
  receivedAt?: string;
  caseId?: string;
  // alert detail page fields
  assignee?: string;
  source?: string;
  suppressDurationTiming?: string;
  consolidatedReport?: string;
  benefitRealised?: string;
  riskLevel?: string;
  suppressDuration?: string;
  monetaryValue?: string;
  lossAverted?: string;
}

export interface CaseRow {
  caseId: string;
  caseEntityName: string;
  summary: string;
  assignee: string;
  createdOn: string;
  receivedAt: string;
  caseStatus: "CREATED" | "CLOSED";
  priority?: "HIGH" | "MEDIUM" | "LOW";
  category?: string;
  description?: string;
  linkedAlerts?: number;
  tags?: string[];
  // detail-view fields
  caseEntityId?: string;
  caseType?: string;
  resolutionType?: string;
  updatedBy?: string;
  resolvedOn?: string;
  reporter?: string;
  labels?: string;
  caseEntityScore?: number;
  createdBy?: string;
  closedOn?: string;
  alertList?: CaseAlert[];
}

// ── data ──────────────────────────────────────────────────────────────────────

export const casesData: CaseRow[] = [
  {
    caseId: "CB-373",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core",
    assignee: "ONE SUPER",
    createdOn: "28 April 2026 11:54:42.000",
    receivedAt: "28 April 2026 11:54:42.000",
    caseStatus: "CLOSED",
    caseType: "CASE",
    caseEntityId: "000000380",
    resolutionType: "N/A",
    updatedBy: "SYSTEM",
    resolvedOn: "-",
    reporter: "CXPS",
    labels: "SUPERUSER1 ...",
    caseEntityScore: 500,
    createdBy: "SYSTEM",
    closedOn: "29 April 2026 15:30:51.000",
    alertList: [
      { alertId: "CB-373-1", unread: true,  scenarioFactName: "ACCT_DRAINAGE_SBA_INTU",      indicationOfFraud: "No",  alertScore: 500, alertStatus: "CLOSED", alertEntityId: "C_F_000000380", entityName: "CUSTOMER", alertSummary: "CB-373-1|000000380|ACCT_DRAINAGE_SBA_INTU:Savings account drainage detected above threshold",          createdOn: "28 April 2026 11:54:42.000", receivedAt: "28 April 2026 11:54:42.000", caseId: "CB-373", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-29 15:30:51.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Medium", suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "CB-373-2", unread: false, scenarioFactName: "MULTI_LOGIN_SM_ADD_INTU",      indicationOfFraud: "No",  alertScore: 450, alertStatus: "CLOSED", alertEntityId: "C_F_000000380", entityName: "CUSTOMER", alertSummary: "CB-373-2|000000380|MULTI_LOGIN_SM_ADD_INTU:Multiple login attempts from different devices",               createdOn: "28 April 2026 11:55:10.000", receivedAt: "28 April 2026 11:55:10.000", caseId: "CB-373", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-29 15:31:10.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Low",    suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "CB-373-3", unread: false, scenarioFactName: "SIGN_ON_DIFF_CNTRY_INTU",      indicationOfFraud: "No",  alertScore: 420, alertStatus: "CLOSED", alertEntityId: "C_F_000000380", entityName: "CUSTOMER", alertSummary: "CB-373-3|000000380|SIGN_ON_DIFF_CNTRY_INTU:Sign-on detected from a different country than usual",          createdOn: "28 April 2026 11:56:00.000", receivedAt: "28 April 2026 11:56:00.000", caseId: "CB-373", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-29 15:32:00.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Low",    suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "CB-373-4", unread: false, scenarioFactName: "IB_FUND_TXFR_INTU",            indicationOfFraud: "No",  alertScore: 480, alertStatus: "CLOSED", alertEntityId: "C_F_000000380", entityName: "CUSTOMER", alertSummary: "CB-373-4|000000380|IB_FUND_TXFR_INTU:Internet banking fund transfer above daily limit detected",         createdOn: "28 April 2026 11:57:00.000", receivedAt: "28 April 2026 11:57:00.000", caseId: "CB-373", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-29 15:33:00.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Medium", suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
    ],
  },
  {
    caseId: "EFM-7668",
    caseEntityName: "PAYMENTCARD – 567885432799",
    summary: "Finacle Co",
    assignee: "ONE SUPER",
    createdOn: "28 April 2026 13:09:01.000",
    receivedAt: "28 April 2026 13:09:01.000",
    caseStatus: "CREATED",
    priority: "HIGH",
    category: "Fraud Detection",
    caseType: "CASE",
    caseEntityId: "567885432799",
    resolutionType: "N/A",
    updatedBy: "SYSTEM",
    resolvedOn: "-",
    reporter: "CXPS",
    labels: "SUPERUSER1 ...",
    caseEntityScore: 600,
    createdBy: "SYSTEM",
    alertList: [
      { alertId: "EFM-7668-1", unread: true,  scenarioFactName: "FRD_PAYMENT_CARD_INTU", indicationOfFraud: "Yes", alertScore: 600, alertStatus: "CREATED", alertEntityId: "C_P_567885432799", entityName: "PAYMENTCARD", alertSummary: "EFM-7668-1|567885432799|FRD_PAYMENT_CARD_INTU:Fraudulent payment card transaction detected on high-value merchant", createdOn: "28 April 2026 13:09:01.000", receivedAt: "28 April 2026 13:09:01.000", caseId: "EFM-7668", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:09:01.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "High", suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "EFM-7668-2", unread: false, scenarioFactName: "HIGH_VALUE_TXN_INTU",   indicationOfFraud: "Yes", alertScore: 580, alertStatus: "CREATED", alertEntityId: "C_P_567885432799", entityName: "PAYMENTCARD", alertSummary: "EFM-7668-2|567885432799|HIGH_VALUE_TXN_INTU:High value transaction exceeds daily limit for the account", createdOn: "28 April 2026 13:09:01.000", receivedAt: "28 April 2026 13:09:15.000", caseId: "EFM-7668", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:09:15.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "High", suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
    ],
  },
  {
    caseId: "EFM-7666",
    caseEntityName: "CUSTOMER – 000000916",
    summary: "Finacle Co",
    assignee: "ONE SUPER",
    createdOn: "28 April 2026 13:08:48.000",
    receivedAt: "28 April 2026 13:08:48.000",
    caseStatus: "CREATED",
    priority: "MEDIUM",
    category: "AML",
    caseType: "CASE",
    caseEntityId: "000000916",
    resolutionType: "N/A",
    updatedBy: "SYSTEM",
    resolvedOn: "-",
    reporter: "CXPS",
    labels: "SUPERUSER1 ...",
    caseEntityScore: 900,
    createdBy: "SYSTEM",
    alertList: [
      { alertId: "EFM-7666-2", unread: true,  scenarioFactName: "INT_TRANSFER_MON_INTU",      indicationOfFraud: "No", alertScore: 900, alertStatus: "CREATED", alertEntityId: "C_F_000000916", entityName: "CUSTOMER", alertSummary: "EFM-7666-2|000000916|INT_TRANSFER_MON_INTU:International transfer monitoring triggered as amount exceeds threshold",    createdOn: "28 April 2026 13:08:30.000", receivedAt: "28 April 2026 13:08:53.000", caseId: "EFM-7666", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:08:53.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "High",   suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "EFM-7666-1", unread: false, scenarioFactName: "CEM_CROSS_BORDER_INTU",      indicationOfFraud: "No", alertScore: 700, alertStatus: "CREATED", alertEntityId: "C_F_000000916", entityName: "CUSTOMER", alertSummary: "EFM-7666-1|000000916|CEM_CROSS_BORDER_INTU:Cross border transaction alert for unusual activity in foreign currency",         createdOn: "28 April 2026 13:08:30.000", receivedAt: "28 April 2026 13:08:48.000", caseId: "EFM-7666", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:08:48.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Medium", suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "EFM-7666-3", unread: false, scenarioFactName: "IGTB_TXN_ODD_HOURS_INTU",    indicationOfFraud: "No", alertScore: 650, alertStatus: "CREATED", alertEntityId: "C_F_000000916", entityName: "CUSTOMER", alertSummary: "EFM-7666-3|000000916|IGTB_TXN_ODD_HOURS_INTU:IGTB transaction performed during odd hours outside business time",         createdOn: "28 April 2026 13:09:10.000", receivedAt: "28 April 2026 13:09:10.000", caseId: "EFM-7666", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:09:10.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Medium", suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "EFM-7666-4", unread: false, scenarioFactName: "CROSS_CHANNEL_IBPOS_INTU",   indicationOfFraud: "No", alertScore: 620, alertStatus: "CREATED", alertEntityId: "C_F_000000916", entityName: "CUSTOMER", alertSummary: "EFM-7666-4|000000916|CROSS_CHANNEL_IBPOS_INTU:Cross channel IB and POS activity within one hour for same customer",          createdOn: "28 April 2026 13:09:30.000", receivedAt: "28 April 2026 13:09:30.000", caseId: "EFM-7666", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:09:30.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Low",   suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
    ],
  },
  {
    caseId: "EFM-7667",
    caseEntityName: "TERMINAL – 7676",
    summary: "Finacle Core",
    assignee: "ONE SUPER",
    createdOn: "28 April 2026 13:08:49.000",
    receivedAt: "28 April 2026 13:08:49.000",
    caseStatus: "CREATED",
    caseType: "CASE",
    caseEntityId: "7676",
    resolutionType: "N/A",
    updatedBy: "SYSTEM",
    resolvedOn: "-",
    reporter: "CXPS",
    labels: "SUPERUSER1 ...",
    caseEntityScore: 700,
    createdBy: "SYSTEM",
    alertList: [
      { alertId: "EFM-7667-1", unread: true,  scenarioFactName: "DORMANT_TERMINAL_INTU",      indicationOfFraud: "No", alertScore: 700, alertStatus: "CREATED", alertEntityId: "C_T_7676", entityName: "TERMINAL", alertSummary: "EFM-7667-1|7676|DORMANT_TERMINAL_INTU:Dormant terminal suddenly activated with multiple high-value transactions",  createdOn: "28 April 2026 13:08:49.000", receivedAt: "28 April 2026 13:08:49.000", caseId: "EFM-7667", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:08:49.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Medium", suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "EFM-7667-2", unread: false, scenarioFactName: "HV_TXN_ABOVE_10000_INTU",    indicationOfFraud: "No", alertScore: 650, alertStatus: "CREATED", alertEntityId: "C_T_7676", entityName: "TERMINAL", alertSummary: "EFM-7667-2|7676|HV_TXN_ABOVE_10000_INTU:High value transaction above 10000 KWD detected at terminal",              createdOn: "28 April 2026 13:09:05.000", receivedAt: "28 April 2026 13:09:05.000", caseId: "EFM-7667", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:09:05.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Medium", suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "EFM-7667-3", unread: false, scenarioFactName: "ACCT_TAKEOVER_HFV_INTU",     indicationOfFraud: "No", alertScore: 600, alertStatus: "CREATED", alertEntityId: "C_T_7676", entityName: "TERMINAL", alertSummary: "EFM-7667-3|7676|ACCT_TAKEOVER_HFV_INTU:Account takeover with high funds velocity detected at POS terminal",        createdOn: "28 April 2026 13:09:20.000", receivedAt: "28 April 2026 13:09:20.000", caseId: "EFM-7667", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:09:20.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Low",   suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
    ],
  },
  {
    caseId: "RDE-1845",
    caseEntityName: "CUSTOMER – 000000916",
    summary: "Finacle Core",
    assignee: "ONE SUPER",
    createdOn: "28 April 2026 13:06:53.000",
    receivedAt: "28 April 2026 13:06:53.000",
    caseStatus: "CREATED",
    caseType: "CASE",
    caseEntityId: "000000916",
    resolutionType: "N/A",
    updatedBy: "SYSTEM",
    resolvedOn: "-",
    reporter: "CXPS",
    labels: "SUPERUSER1 ...",
    caseEntityScore: 650,
    createdBy: "SYSTEM",
    alertList: [
      { alertId: "RDE-1845-1", unread: true,  scenarioFactName: "CROSS_BORDER_SBA_INTU",      indicationOfFraud: "No", alertScore: 650, alertStatus: "CREATED", alertEntityId: "C_F_000000916", entityName: "CUSTOMER", alertSummary: "RDE-1845-1|000000916|CROSS_BORDER_SBA_INTU:Cross border savings account alert triggered by unusual transfer pattern", createdOn: "28 April 2026 13:06:53.000", receivedAt: "28 April 2026 13:06:53.000", caseId: "RDE-1845", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:06:53.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Medium", suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "RDE-1845-2", unread: false, scenarioFactName: "CUST_RISK_SCORE_BL_INTU",    indicationOfFraud: "No", alertScore: 600, alertStatus: "CREATED", alertEntityId: "C_F_000000916", entityName: "CUSTOMER", alertSummary: "RDE-1845-2|000000916|CUST_RISK_SCORE_BL_INTU:Customer risk score elevated due to blacklist match detected",          createdOn: "28 April 2026 13:07:10.000", receivedAt: "28 April 2026 13:07:10.000", caseId: "RDE-1845", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:07:10.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Medium", suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "RDE-1845-3", unread: false, scenarioFactName: "CASH_DEPO_MULT_ACCT_INTU",   indicationOfFraud: "No", alertScore: 580, alertStatus: "CREATED", alertEntityId: "C_F_000000916", entityName: "CUSTOMER", alertSummary: "RDE-1845-3|000000916|CASH_DEPO_MULT_ACCT_INTU:Cash deposits across multiple accounts in short time window",              createdOn: "28 April 2026 13:07:30.000", receivedAt: "28 April 2026 13:07:30.000", caseId: "RDE-1845", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 13:07:30.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Low",   suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
    ],
  },
  {
    caseId: "EFM-7665",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core",
    assignee: "ONE SUPER",
    createdOn: "28 April 2026 11:54:28.000",
    receivedAt: "28 April 2026 11:54:28.000",
    caseStatus: "CREATED",
    caseType: "CASE",
    caseEntityId: "000000380",
    resolutionType: "N/A",
    updatedBy: "SYSTEM",
    resolvedOn: "-",
    reporter: "CXPS",
    labels: "SUPERUSER1 ...",
    caseEntityScore: 550,
    createdBy: "SYSTEM",
    alertList: [
      { alertId: "EFM-7665-9", unread: true,  scenarioFactName: "ACCT_ACTIVITY_MON_INTU",     indicationOfFraud: "No", alertScore: 550, alertStatus: "CREATED", alertEntityId: "C_F_000000380", entityName: "CUSTOMER", alertSummary: "EFM-7665-9|000000380|ACCT_ACTIVITY_MON_INTU:Account activity monitoring alert due to unusual withdrawal pattern",  createdOn: "28 April 2026 11:54:28.000", receivedAt: "28 April 2026 11:54:28.000", caseId: "EFM-7665", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 11:54:28.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Low",    suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "EFM-7665-8", unread: false, scenarioFactName: "CEM_CRS_SELL_TRVL_INTU",     indicationOfFraud: "No", alertScore: 520, alertStatus: "CREATED", alertEntityId: "C_F_000000380", entityName: "CUSTOMER", alertSummary: "EFM-7665-8|000000380|CEM_CRS_SELL_TRVL_INTU:Cross-sell travel card purchase pattern triggered compliance alert",      createdOn: "28 April 2026 11:55:00.000", receivedAt: "28 April 2026 11:55:00.000", caseId: "EFM-7665", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 11:55:00.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Low",    suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "EFM-7665-7", unread: false, scenarioFactName: "INT_FOR_FT_ECOM_INTU",        indicationOfFraud: "No", alertScore: 500, alertStatus: "CREATED", alertEntityId: "C_F_000000380", entityName: "CUSTOMER", alertSummary: "EFM-7665-7|000000380|INT_FOR_FT_ECOM_INTU:International foreign fund transfer for e-commerce above allowed limit",    createdOn: "28 April 2026 11:55:30.000", receivedAt: "28 April 2026 11:55:30.000", caseId: "EFM-7665", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 11:55:30.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Low",    suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
      { alertId: "EFM-7665-6", unread: false, scenarioFactName: "CROSS_CHANNEL_CBS_POS_INTU",  indicationOfFraud: "No", alertScore: 480, alertStatus: "CREATED", alertEntityId: "C_F_000000380", entityName: "CUSTOMER", alertSummary: "EFM-7665-6|000000380|CROSS_CHANNEL_CBS_POS_INTU:Cross channel CBS and POS transaction within one hour window",          createdOn: "28 April 2026 11:56:00.000", receivedAt: "28 April 2026 11:56:00.000", caseId: "EFM-7665", assignee: "ONE SUPER", source: "Finacle Core", suppressDurationTiming: "2026-04-28 11:56:00.158", consolidatedReport: "-", benefitRealised: "-", riskLevel: "Low",    suppressDuration: "7d", monetaryValue: "-", lossAverted: "-" },
    ],
  },
  {
    caseId: "T-112",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core",
    assignee: "ONE SUPER",
    createdOn: "28 April 2026 11:54:32.000",
    receivedAt: "28 April 2026 11:54:32.000",
    caseStatus: "CREATED",
    caseType: "CASE",
    caseEntityId: "000000380",
    resolutionType: "N/A",
    updatedBy: "SYSTEM",
    resolvedOn: "-",
    reporter: "CXPS",
    labels: "SUPERUSER1 ...",
    caseEntityScore: 480,
    createdBy: "SYSTEM",
    alertList: [],
  },
  {
    caseId: "TM-626",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "28 April 2026 11:54:29.000",
    receivedAt: "28 April 2026 11:54:29.000",
    caseStatus: "CREATED",
  },
  {
    caseId: "AML-7750",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "28 April 2026 11:54:22.000",
    receivedAt: "28 April 2026 11:54:22.000",
    caseStatus: "CREATED",
  },
  {
    caseId: "EFM-7664",
    caseEntityName: "USER – user112",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "28 April 2026 11:54:22.000",
    receivedAt: "28 April 2026 11:54:22.000",
    caseStatus: "CREATED",
  },
  {
    caseId: "CB-368",
    caseEntityName: "CUSTOMER – 000000383",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 13:49:18.000",
    receivedAt: "24 April 2026 13:49:18.000",
    caseStatus: "CLOSED",
  },
  {
    caseId: "CB-370",
    caseEntityName: "CUSTOMER – STANDIN_A_F_1004004877411",
    summary: "...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 13:50:13.000",
    receivedAt: "24 April 2026 13:50:13.000",
    caseStatus: "CLOSED",
  },
  {
    caseId: "CB-371",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 14:48:39.000",
    receivedAt: "24 April 2026 14:48:39.000",
    caseStatus: "CLOSED",
  },
  {
    caseId: "CB-372",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 15:08:04.000",
    receivedAt: "24 April 2026 15:08:04.000",
    caseStatus: "CLOSED",
  },
  {
    caseId: "CB-369",
    caseEntityName: "CUSTOMER – 000001774",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 13:49:30.000",
    receivedAt: "24 April 2026 13:49:30.000",
    caseStatus: "CLOSED",
  },
  {
    caseId: "CB-367",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "22 April 2026 16:07:26.000",
    receivedAt: "22 April 2026 16:07:26.000",
    caseStatus: "CLOSED",
  },
  {
    caseId: "T-111",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 15:07:45.000",
    receivedAt: "24 April 2026 15:07:45.000",
    caseStatus: "CREATED",
  },
  {
    caseId: "EFM-7662",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 15:07:50.000",
    receivedAt: "24 April 2026 15:07:50.000",
    caseStatus: "CREATED",
  },
  {
    caseId: "EFM-7663",
    caseEntityName: "USER – bk_user01",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 15:07:56.000",
    receivedAt: "24 April 2026 15:07:56.000",
    caseStatus: "CREATED",
  },
  {
    caseId: "AML-7749",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 15:07:25.000",
    receivedAt: "24 April 2026 15:07:25.000",
    caseStatus: "CREATED",
  },
  {
    caseId: "TM-625",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 15:07:35.000",
    receivedAt: "24 April 2026 15:07:35.000",
    caseStatus: "CREATED",
  },
  {
    caseId: "EFM-7661",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 14:48:25.000",
    receivedAt: "24 April 2026 14:48:25.000",
    caseStatus: "CREATED",
  },
  {
    caseId: "T-110",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 14:48:29.000",
    receivedAt: "24 April 2026 14:48:29.000",
    caseStatus: "CREATED",
  },
  {
    caseId: "TM-624",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 14:48:20.000",
    receivedAt: "24 April 2026 14:48:20.000",
    caseStatus: "CREATED",
  },
  {
    caseId: "AML-7748",
    caseEntityName: "CUSTOMER – 000000380",
    summary: "Finacle Core ...",
    assignee: "ONE SUPER",
    createdOn: "24 April 2026 14:48:10.000",
    receivedAt: "24 April 2026 14:48:10.000",
    caseStatus: "CREATED",
  },
];

const TOTAL_CASES = 679;
const PAGE_SIZE = 25;
const TOTAL_PAGES = 28;

// ── sub-components ─────────────────────────────────────────────────────────────

function CaseStatusBadge({ status }: { status: "CREATED" | "CLOSED" }) {
  if (status === "CREATED") {
    return (
      <span className="inline-block rounded-full px-4 py-1 text-sm font-medium whitespace-nowrap" style={{ backgroundColor: "#DCFCE7", color: "#16A34A" }}>
        CREATED
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full px-4 py-1 text-sm font-medium whitespace-nowrap" style={{ backgroundColor: "#F4F4F4", color: "#6F6F6F" }}>
      CLOSED
    </span>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 10 14" width="10" height="14" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M5 0L9.33 5H0.67L5 0Z" />
      <path d="M5 14L0.67 9H9.33L5 14Z" />
    </svg>
  );
}

function SortableHeader({ label }: { label: string }) {
  return (
    <th
      style={{ height: "48px", backgroundColor: "#E0E0E0", color: "#2A53A0", fontSize: "14px", fontWeight: 500 }}
      className="px-4 text-left whitespace-nowrap align-middle"
    >
      <div className="flex items-center gap-1.5">
        {label}
        <SortIcon />
      </div>
    </th>
  );
}

function PriorityBadge({ priority }: { priority?: "HIGH" | "MEDIUM" | "LOW" }) {
  if (!priority) return null;
  const styles = {
    HIGH: "bg-[#FFF1F1] text-[#DA1E28]",
    MEDIUM: "bg-[#FFF8E1] text-[#B28600]",
    LOW: "bg-[#DEFBE6] text-[#198038]",
  };
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", styles[priority])}>
      {priority}
    </span>
  );
}

function MlIndicator() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        <span className="w-2 h-2 rounded-full bg-[#DA1E28] inline-block" />
        <span className="text-[10px] text-[#525252]">ML</span>
      </div>
      <div className="flex items-center gap-0.5">
        <span className="w-2 h-2 rounded-full bg-[#198038] inline-block" />
        <span className="text-[10px] text-[#525252]">BL</span>
      </div>
      <div className="flex items-center gap-0.5">
        <span className="w-2 h-2 rounded-full bg-[#198038] inline-block" />
        <span className="text-[10px] text-[#525252]">RL</span>
      </div>
    </div>
  );
}

function ExpandedDetail({ row }: { row: CaseRow }) {
  const alerts = row.alertList ?? [];

  const COLS = [
    { label: "Alert Entity Id", w: "13%" },
    { label: "Alert Id",        w: "8%"  },
    { label: "Entity Name",     w: "9%"  },
    { label: "Summary",         w: "16%" },
    { label: "Score",           w: "5%"  },
    { label: "Status",          w: "9%"  },
    { label: "Created On",      w: "13%" },
    { label: "Received At",     w: "13%" },
    { label: "Case Id",         w: "6%"  },
    { label: "ML Indicator",    w: "8%"  },
  ];

  return (
    /* Outer wrapper — white bg with padding around the inner table */
    <div className="p-4" style={{ backgroundColor: "#ffffff" }}>

      {/* Alert List heading */}
      <p style={{ fontSize: 14, fontWeight: 600, color: "#161616", marginBottom: 10 }}>Alert List</p>

      {/* Inner Carbon DS data table */}
      <div style={{ border: "1px solid #E0E0E0", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <table className="w-full" style={{ tableLayout: "fixed", borderCollapse: "collapse" }}>
          <colgroup>
            {COLS.map((c) => <col key={c.label} style={{ width: c.w }} />)}
          </colgroup>

          {/* Carbon DS header — 48px, #E0E0E0 bg, #2A53A0 text */}
          <thead>
            <tr style={{ height: 48, backgroundColor: "#E0E0E0" }}>
              {COLS.map((c) => (
                <th
                  key={c.label}
                  style={{ color: "#2A53A0", fontSize: 14, fontWeight: 600, borderBottom: "1px solid #C6C6C6" }}
                  className="px-4 text-left align-middle whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Carbon DS body rows — 46px */}
          <tbody>
            {alerts.length === 0 ? (
              <tr style={{ height: 46, backgroundColor: "#ffffff" }}>
                <td
                  colSpan={COLS.length}
                  style={{ color: "#6F6F6F", fontSize: 14, borderBottom: "1px solid #E0E0E0" }}
                  className="p-4 text-center align-middle"
                >
                  No alerts linked to this case.
                </td>
              </tr>
            ) : (
              alerts.map((a, idx) => (
                <tr
                  key={a.alertId}
                  style={{
                    height: 46,
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#F7FAFF",
                    borderBottom: "1px solid #E0E0E0",
                  }}
                  className="transition-colors hover:bg-[#EBF1FF]"
                >
                  {/* Alert Entity Id — purple chip */}
                  <td className="px-4 align-middle">
                    <span
                      style={{ backgroundColor: "#EDE7FF", color: "#6929C4", fontSize: 14, fontWeight: 500 }}
                      className="inline-block px-2 py-0.5 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                    >
                      {a.alertEntityId ?? "—"}
                    </span>
                  </td>

                  {/* Alert Id — blue link */}
                  <td className="px-4 align-middle">
                    <span
                      style={{ color: "#0043CE", fontSize: 14, fontWeight: 500 }}
                      className="cursor-pointer hover:underline whitespace-nowrap"
                    >
                      {a.alertId}
                    </span>
                  </td>

                  {/* Entity Name — gray chip */}
                  <td className="px-4 align-middle">
                    <span
                      style={{ backgroundColor: "#E0E0E0", color: "#393939", fontSize: 14, fontWeight: 500 }}
                      className="inline-block px-2 py-0.5 rounded whitespace-nowrap"
                    >
                      {a.entityName ?? "—"}
                    </span>
                  </td>

                  {/* Summary */}
                  <td className="px-4 align-middle">
                    <span
                      style={{ color: "#161616", fontSize: 14 }}
                      className="block overflow-hidden text-ellipsis whitespace-nowrap"
                      title={a.alertSummary}
                    >
                      {a.alertSummary ?? "—"}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="px-4 align-middle">
                    <span style={{ color: "#161616", fontSize: 14, fontWeight: 600 }}>{a.alertScore}</span>
                  </td>

                  {/* Status badge */}
                  <td className="px-4 align-middle">
                    <CaseStatusBadge status={a.alertStatus as "CREATED" | "CLOSED"} />
                  </td>

                  {/* Created On */}
                  <td className="px-4 align-middle">
                    <span style={{ color: "#525252", fontSize: 14 }} className="whitespace-nowrap">{a.createdOn ?? "—"}</span>
                  </td>

                  {/* Received At */}
                  <td className="px-4 align-middle">
                    <span style={{ color: "#525252", fontSize: 14 }} className="whitespace-nowrap">{a.receivedAt ?? "—"}</span>
                  </td>

                  {/* Case Id — blue link */}
                  <td className="px-4 align-middle">
                    <span
                      style={{ color: "#0043CE", fontSize: 14, fontWeight: 500 }}
                      className="cursor-pointer hover:underline whitespace-nowrap"
                    >
                      {a.caseId ?? "—"}
                    </span>
                  </td>

                  {/* ML Indicator */}
                  <td className="px-4 align-middle">
                    <MlIndicator />
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Carbon DS footer — 46px, white */}
          {alerts.length > 0 && (
            <tfoot>
              <tr style={{ height: 46, backgroundColor: "#ffffff", borderTop: "1px solid #E0E0E0" }}>
                <td colSpan={COLS.length} className="p-4 align-middle">
                  <span style={{ color: "#525252", fontSize: 14 }}>
                    Total alerts:{" "}
                    <span style={{ color: "#2A53A0", fontWeight: 600 }}>{alerts.length}</span>
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}


// ── entity details data ────────────────────────────────────────────────────────

export const intelligenceData = [
  { factname: "HV_TXN_ABOVE_10000KWD",                  score: "L3(500)",  computed: "2026-04-28 11:53:22.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "SAM" },
  { factname: "CUST_FIRST_TIME_LOGIN_NEW_DEVICE",        score: "L2(700)",  computed: "2024-03-26 19:04:32.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "RDE" },
  { factname: "ACCOUNT_TAKEOVER_HIGH_FUNDS_VELOCITY",    score: "L3(500)",  computed: "2025-07-14 10:31:03.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "RDE" },
  { factname: "SIGN_ON_DIFF_CNTRY",                      score: "L2(700)",  computed: "2026-04-23 14:07:52.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "SAM" },
  { factname: "IGTB_TXN_DURING_ODD_HOURS",               score: "L2(600)",  computed: "2025-07-14 10:30:48.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "SAM" },
  { factname: "CEM_CRS_SELL_TRVL_CRD",                   score: "L2(700)",  computed: "2025-08-11 17:31:59.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "SAM" },
  { factname: "INT_FOR_FT_ECOM_TXN",                     score: "L1(900)",  computed: "2025-08-11 17:31:59.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "SAM" },
  { factname: "CROSS_CHANNEL_IBPOS",                     score: "L2(650)",  computed: "2025-06-26 14:48:16.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "RDE" },
  { factname: "IB_FUND_TXFR_INTU",                       score: "L2(600)",  computed: "2025-07-14 10:30:50.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "SAM" },
  { factname: "IB_FUND_XFR_INTU",                        score: "L2(600)",  computed: "2025-07-14 10:30:50.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "SAM" },
  { factname: "MANUAL-ALERT",                            score: "L1(1000)", computed: "2024-02-22 11:26:39.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "SAM" },
  { factname: "MULTI_LOGIN_SM_ADD",                      score: "L2(750)",  computed: "2024-10-07 14:57:52.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "RDE" },
  { factname: "CASH_DEPO_OR_WHDL_MULT_ACCT_INTU",        score: "L3(500)",  computed: "2024-04-12 15:11:11.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "SAM" },
  { factname: "CROSS_CHANNEL_CBS_POS_1HOUR",             score: "L2(700)",  computed: "2024-12-21 22:50:05.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "RDE" },
  { factname: "MUL_CUST_APPLI_COMPROMISED_DEVICE_IP",    score: "L2(600)",  computed: "2024-12-24 11:42:07.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "SAM" },
  { factname: "CUST_RISK_SCORE_ACCT_BLACKLIST_CUST_INTU",score: "L2(700)",  computed: "2026-04-28 11:53:22.0", cTRS: "-", wlmatches: "-", cRCvalue: "-", str: "-", source: "SAM" },
];

export const accountsData = [
  { acctId: "A_F_TD0001216986707", name: "Ramon", openedDate: "2005-06-13", acctType: "Savings Account", schemeCode: "TDGEN", acctStatus: "Active" },
];

export const entityCasesData = [
  { caseId: "EFM-7665", module: "EFM", openedDate: "2026-04-28" },
  { caseId: "AML-7750", module: "AML", openedDate: "2026-04-28" },
  { caseId: "CB-373",   module: "EFM", openedDate: "2026-04-28" },
  { caseId: "T-112",    module: "EFM", openedDate: "2026-04-28" },
  { caseId: "TM-626",   module: "AML", openedDate: "2026-04-28" },
];

// ── details view sub-components ────────────────────────────────────────────────

function DetailField({ label, value, link }: { label: string; value?: string; link?: boolean }) {
  return (
    <div className="flex border-b border-[#E0E0E0]" style={{ minHeight: 40 }}>
      <div className="w-[45%] flex items-center px-4 py-2 bg-[#F4F4F4] text-sm text-[#525252] font-medium border-r border-[#E0E0E0] flex-shrink-0">
        {label}
      </div>
      <div className="flex-1 flex items-center px-4 py-2 text-sm text-[#161616]">
        {link ? (
          <span className="text-[#2A53A0] cursor-pointer hover:underline">{value ?? "—"}</span>
        ) : (
          <span>{value ?? "—"}</span>
        )}
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

const CREATED_COUNT = casesData.filter((r) => r.caseStatus === "CREATED").length;
const CLOSED_COUNT = casesData.filter((r) => r.caseStatus === "CLOSED").length;

export function CasesPage({ breadcrumbs, onBreadcrumbNavigate, onCaseClick }: CasesPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [view, setView] = useState<"list" | "details">("list");
  const [refreshMins, setRefreshMins] = useState(5);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [detailTab, setDetailTab] = useState<"case" | "entity">("case");
  const [listPageSize] = useState(25);
  const [activityTab, setActivityTab] = useState<"Comments" | "Attachments" | "Audit History" | "Inbox Response">("Comments");
  const [commentText, setCommentText] = useState("");
  const [caseDetailsOpen, setCaseDetailsOpen] = useState(true);
  const [entityTab, setEntityTab] = useState<"Intelligence" | "Accounts" | "Cases">("Intelligence");

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, TOTAL_CASES);
  const selectedCase = casesData[selectedCaseIdx];

  return (
    <div className="flex flex-col h-full bg-white">
      <PageHeader title="Cases" breadcrumbs={breadcrumbs} onBreadcrumbNavigate={onBreadcrumbNavigate} />

      <div className="flex-1 overflow-hidden p-4 flex flex-col gap-3 bg-white">

        {/* ── Title + badges + toolbar row (OUTSIDE the table card) ── */}
        <div className="flex items-center gap-3 flex-wrap flex-shrink-0 min-h-[46px]">
          {/* Left: title + divider + count badges */}
          <span className="whitespace-nowrap font-medium" style={{ fontSize: "21px", color: "#525252" }}>Case List</span>
          <div className="w-px h-5 bg-gray-400 flex-shrink-0" />
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#525252] text-white whitespace-nowrap">
            Total : {TOTAL_CASES}
          </span>
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#DEFBE6] text-[#198038] whitespace-nowrap">
            Created : {CREATED_COUNT}
          </span>
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E0E0E0] text-[#525252] whitespace-nowrap">
            Closed : {CLOSED_COUNT}
          </span>

          <div className="flex-1" />

          {/* Right: toolbar controls — all 46px height */}

          {/* Save Filter */}
          <button className="h-[46px] px-4 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-[#161616] whitespace-nowrap">
            Save Filter
          </button>

          {/* Filter List */}
          <button
            className="h-[46px] w-[46px] flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-[#525252]"
            title="Filter List"
          >
            <Filter size={16} />
          </button>

          {/* Column Setting */}
          <button
            className="h-[46px] w-[46px] flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-[#525252]"
            title="Column Setting"
          >
            <Tools size={16} />
          </button>

          {/* Refresh in N mins */}
          <div className="h-[46px] flex items-center gap-1 px-3 border border-gray-300 rounded-lg bg-white text-sm text-[#161616] whitespace-nowrap">
            <span>Refresh in</span>
            <select
              value={refreshMins}
              onChange={(e) => setRefreshMins(Number(e.target.value))}
              className="border-none outline-none bg-transparent text-sm text-[#161616] cursor-pointer px-0.5"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={30}>30</option>
            </select>
            <span>mins</span>
          </div>

          {/* Refresh */}
          <button
            className="h-[46px] w-[46px] flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-[#525252]"
            title="Refresh"
          >
            <Renew size={16} />
          </button>

          {/* View switcher — Content Switcher style, 46px */}
          <div className="h-[46px] flex items-stretch border border-gray-300 rounded-lg overflow-hidden">
            {/* List View option */}
            <button
              onClick={() => setView("list")}
              className={cn(
                "h-full px-4 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap",
                view === "list"
                  ? "bg-[#2A53A0] text-white"
                  : "bg-white text-[#525252] hover:bg-gray-50"
              )}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                <rect x="1" y="2" width="14" height="2" rx="0.5" />
                <rect x="1" y="7" width="14" height="2" rx="0.5" />
                <rect x="1" y="12" width="14" height="2" rx="0.5" />
              </svg>
              List View
            </button>

            <div className="w-px bg-gray-300" />

            {/* Details View option */}
            <button
              onClick={() => setView("details")}
              className={cn(
                "h-full px-4 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap",
                view === "details"
                  ? "bg-[#2A53A0] text-white"
                  : "bg-white text-[#525252] hover:bg-gray-50"
              )}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                <rect x="1" y="1" width="6" height="6" rx="0.5" />
                <rect x="9" y="1" width="6" height="6" rx="0.5" />
                <rect x="1" y="9" width="6" height="6" rx="0.5" />
                <rect x="9" y="9" width="6" height="6" rx="0.5" />
              </svg>
              Details View
            </button>
          </div>
        </div>

        {/* ── Details View ── */}
        {view === "details" && (
          <div className="flex-1 min-h-0 flex gap-0 border border-gray-200 rounded-lg overflow-hidden shadow-sm">

            {/* Left: case list */}
            <div className="w-[280px] flex-shrink-0 flex flex-col border-r border-[#E0E0E0] bg-white">
              <div className="flex-1 overflow-y-auto">
                {casesData.map((c, i) => {
                  const entityPart = c.caseEntityName.split("–")[1]?.trim() ?? c.caseEntityName;
                  const idPart = c.caseEntityName.split("–")[0]?.trim() ?? "";
                  return (
                    <button
                      key={c.caseId}
                      onClick={() => { setSelectedCaseIdx(i); setDetailTab("case"); }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 border-b border-[#E0E0E0] transition-colors",
                        selectedCaseIdx === i ? "bg-[#EAF2FF]" : "hover:bg-[#F4F4F4]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#161616]">{c.caseId}</span>
                        <span className={cn(
                          "text-[11px] font-semibold px-2 py-0.5 rounded",
                          c.caseStatus === "CREATED" ? "bg-[#198038] text-white" : "bg-[#525252] text-white"
                        )}>
                          {c.caseStatus}
                        </span>
                      </div>
                      <div className="text-xs text-[#525252] mt-0.5 truncate">
                        {entityPart} | {c.summary}
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* List bottom pagination */}
              <div className="flex-shrink-0 border-t border-[#E0E0E0] px-3 py-2 flex items-center gap-2 bg-white">
                <button className="p-1 hover:bg-gray-100 rounded text-[#525252]"><CaretLeft size={14} /></button>
                <span className="text-xs text-[#525252] flex-1 text-center">Show cases: {listPageSize}</span>
                <button className="p-1 hover:bg-gray-100 rounded text-[#525252]"><CaretRight size={14} /></button>
              </div>
            </div>

            {/* Right: case detail */}
            <div className="flex-1 min-w-0 flex flex-col bg-white overflow-hidden">

              {/* Detail header */}
              <div className="flex-shrink-0 flex items-center px-4 py-2 border-b border-[#E0E0E0] bg-white gap-2">
                <span className="text-sm font-bold text-[#161616]">{selectedCase?.caseId}</span>
                <span className="text-sm text-[#525252]">||</span>
                <span className="text-sm text-[#525252] truncate flex-1">
                  {selectedCase?.caseEntityId} | {selectedCase?.summary}
                </span>
                <div className="flex items-center gap-1 text-xs text-[#525252] flex-shrink-0">
                  <span>{selectedCaseIdx + 1} of {TOTAL_CASES}</span>
                  <button
                    onClick={() => setSelectedCaseIdx(i => Math.max(0, i - 1))}
                    disabled={selectedCaseIdx === 0}
                    className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => setSelectedCaseIdx(i => Math.min(casesData.length - 1, i + 1))}
                    disabled={selectedCaseIdx === casesData.length - 1}
                    className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Scrollable detail body */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {selectedCase && (
                  <div className="p-4 space-y-4">

                    {/* ── Case Details accordion panel ── */}
                    <div className="border border-[#E0E0E0] rounded overflow-hidden">

                      {/* Accordion header — click to collapse/expand */}
                      <button
                        onClick={() => setCaseDetailsOpen(o => !o)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F4F4F4] hover:bg-[#EBEBEB] transition-colors border-b border-[#E0E0E0]"
                      >
                        <span className="text-sm font-semibold text-[#161616]">Case Details</span>
                        {caseDetailsOpen
                          ? <ChevronDown size={16} className="text-[#525252]" />
                          : <ChevronRight size={16} className="text-[#525252]" />
                        }
                      </button>

                      {/* Accordion body — visible when open */}
                      {caseDetailsOpen && (
                        <>
                          {/* Internal tabs: Case Info | Entity Details */}
                          <div className="flex border-b border-[#E0E0E0] bg-white">
                            {(["case", "entity"] as const).map((t) => (
                              <button
                                key={t}
                                onClick={() => setDetailTab(t)}
                                className={cn(
                                  "px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors",
                                  detailTab === t
                                    ? "border-[#2A53A0] text-[#2A53A0]"
                                    : "border-transparent text-[#525252] hover:text-[#161616]"
                                )}
                              >
                                {t === "case" ? "Case Info" : "Entity Details"}
                              </button>
                            ))}
                          </div>

                          {/* Case Info tab content */}
                          {detailTab === "case" && (
                            <div className="p-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="border border-[#E0E0E0] rounded overflow-hidden">
                                  <DetailField label="Type"             value={selectedCase.caseType ?? "CASE"} />
                                  <DetailField label="Case_Status"      value={selectedCase.caseStatus} />
                                  <DetailField label="Resolution Type"  value={selectedCase.resolutionType ?? "N/A"} />
                                  <DetailField label="Case Entity Id"   value={selectedCase.caseEntityId} link />
                                  <DetailField label="Case Entity Name" value={selectedCase.caseEntityName.split("–")[0]?.trim()} />
                                  <DetailField label="Updated By"       value={selectedCase.updatedBy ?? "SYSTEM"} />
                                  <DetailField label="Resolved On"      value={selectedCase.resolvedOn ?? "—"} />
                                </div>
                                <div className="border border-[#E0E0E0] rounded overflow-hidden">
                                  <DetailField label="Reporter"          value={selectedCase.reporter ?? "CXPS"} />
                                  <DetailField label="Labels"            value={selectedCase.labels ?? "—"} />
                                  <DetailField label="Case Entity Score" value={String(selectedCase.caseEntityScore ?? "—")} />
                                  <DetailField label="Assignee"          value={selectedCase.assignee} />
                                  <DetailField label="Created By"        value={selectedCase.createdBy ?? "SYSTEM"} />
                                  <DetailField label="Created_on"        value={selectedCase.createdOn} />
                                  <DetailField label="Closed On"         value={selectedCase.closedOn ?? "—"} />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Entity Details tab content */}
                          {detailTab === "entity" && (
                            <div>
                              {/* Sub-tabs: Intelligence | Accounts | Cases */}
                              <div className="flex border-b border-[#E0E0E0] px-4 bg-white">
                                {(["Intelligence", "Accounts", "Cases"] as const).map((t) => (
                                  <button
                                    key={t}
                                    onClick={() => setEntityTab(t)}
                                    className={cn(
                                      "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                                      entityTab === t
                                        ? "border-[#161616] text-[#161616] font-semibold"
                                        : "border-transparent text-[#525252] hover:text-[#161616]"
                                    )}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>

                              {/* Intelligence table */}
                              {entityTab === "Intelligence" && (
                                <div className="overflow-auto">
                                  <table className="w-full" style={{ borderCollapse: "collapse" }}>
                                    <thead>
                                      <tr style={{ height: "48px", backgroundColor: "#E0E0E0" }}>
                                        {["factname", "score", "computed", "cTRS", "wlmatches", "cRCvalue", "str", "source"].map(h => (
                                          <th key={h} className="px-4 text-left text-sm font-medium whitespace-nowrap align-middle" style={{ color: "#2A53A0" }}>
                                            <div className="flex items-center gap-1">{h}<ChevronSort size={14} style={{ color: "#2A53A0" }} /></div>
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {intelligenceData.map((row, i) => (
                                        <tr key={i} style={{ height: "46px" }} className="border-b border-[#E0E0E0] hover:bg-[#F5F8FF] transition-colors">
                                          <td className="px-4 text-sm text-[#161616] font-mono">{row.factname}</td>
                                          <td className="px-4 text-sm text-[#161616]">{row.score}</td>
                                          <td className="px-4 text-sm text-[#525252] whitespace-nowrap">{row.computed}</td>
                                          <td className="px-4 text-sm text-[#525252]">{row.cTRS}</td>
                                          <td className="px-4 text-sm text-[#525252]">{row.wlmatches}</td>
                                          <td className="px-4 text-sm text-[#525252]">{row.cRCvalue}</td>
                                          <td className="px-4 text-sm text-[#525252]">{row.str}</td>
                                          <td className="px-4 text-sm text-[#161616]">{row.source}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {/* Accounts table */}
                              {entityTab === "Accounts" && (
                                <div className="p-4">
                                  <div className="border border-[#E0E0E0] rounded overflow-hidden">
                                    <table className="w-full" style={{ borderCollapse: "collapse" }}>
                                      <thead>
                                        <tr style={{ height: "48px", backgroundColor: "#E0E0E0" }}>
                                          {["acctId", "name", "openedDate", "acctType", "schemeCode", "acctStatus"].map(h => (
                                            <th key={h} className="px-4 text-left text-sm font-medium whitespace-nowrap align-middle" style={{ color: "#2A53A0" }}>
                                              <div className="flex items-center gap-1">{h}<ChevronSort size={14} style={{ color: "#2A53A0" }} /></div>
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {accountsData.map((row, i) => (
                                          <tr key={i} style={{ height: "46px" }} className="border-b border-[#E0E0E0] hover:bg-[#F5F8FF] transition-colors">
                                            <td className="px-4 text-sm text-[#2A53A0] font-medium">{row.acctId}</td>
                                            <td className="px-4 text-sm text-[#161616]">{row.name}</td>
                                            <td className="px-4 text-sm text-[#525252]">{row.openedDate}</td>
                                            <td className="px-4 text-sm text-[#161616]">{row.acctType}</td>
                                            <td className="px-4 text-sm text-[#161616]">{row.schemeCode}</td>
                                            <td className="px-4 text-sm text-[#161616]">{row.acctStatus}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}

                              {/* Cases table */}
                              {entityTab === "Cases" && (
                                <div className="p-4">
                                  <div className="border border-[#E0E0E0] rounded overflow-hidden">
                                    <table className="w-full" style={{ borderCollapse: "collapse" }}>
                                      <thead>
                                        <tr style={{ height: "48px", backgroundColor: "#E0E0E0" }}>
                                          {["caseId", "module", "openedDate"].map(h => (
                                            <th key={h} className="px-4 text-left text-sm font-medium whitespace-nowrap align-middle" style={{ color: "#2A53A0" }}>
                                              <div className="flex items-center gap-1">{h}<ChevronSort size={14} style={{ color: "#2A53A0" }} /></div>
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {entityCasesData.map((row, i) => (
                                          <tr key={i} style={{ height: "46px" }} className="border-b border-[#E0E0E0] hover:bg-[#F5F8FF] transition-colors">
                                            <td className="px-4 text-sm text-[#2A53A0] font-medium cursor-pointer hover:underline">{row.caseId}</td>
                                            <td className="px-4 text-sm text-[#161616]">{row.module}</td>
                                            <td className="px-4 text-sm text-[#525252]">{row.openedDate}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Alert List section */}
                    <div className="border border-[#E0E0E0] rounded overflow-hidden">
                      {/* Alert list header */}
                      <div className="flex items-center justify-between px-4 py-2 border-b border-[#E0E0E0] bg-[#F4F4F4]">
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-[#161616]">
                          Alert List <ChevronDown size={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center bg-[#2A53A0] text-white rounded hover:bg-[#1A3870] transition-colors">
                          <Edit size={14} />
                        </button>
                      </div>

                      {/* Alert table */}
                      <table className="w-full" style={{ borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#E0E0E0", height: "40px" }}>
                            {["Alert Id", "Scenario / Fact Name", "Indication of Fraud", "Alert Score", "Alert Status", "Indicator"].map(h => (
                              <th key={h} className="px-4 text-left text-xs font-semibold text-[#2A53A0] whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedCase.alertList ?? []).map((alert, i) => (
                            <tr key={i} style={{ height: "46px" }} className="border-b border-[#E0E0E0] hover:bg-[#F5F8FF]">
                              <td className="px-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-[#2A53A0] text-sm font-medium cursor-pointer hover:underline">{alert.alertId}</span>
                                  {alert.unread && (
                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-[#E0E0E0] text-[#525252] rounded">Unread</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 text-sm text-[#525252]">{alert.scenarioFactName}</td>
                              <td className="px-4 text-sm text-[#161616]">{alert.indicationOfFraud}</td>
                              <td className="px-4 text-sm text-[#161616]">{alert.alertScore}</td>
                              <td className="px-4">
                                <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#E0E0E0] text-[#525252]">
                                  {alert.alertStatus}
                                </span>
                              </td>
                              <td className="px-4">
                                <div className="flex gap-1.5">
                                  <span className="w-3 h-3 rounded-full bg-[#DA1E28] inline-block" />
                                  <span className="w-3 h-3 rounded-full bg-[#F1C21B] inline-block" />
                                  <span className="w-3 h-3 rounded-full bg-[#F1C21B] inline-block" />
                                </div>
                              </td>
                            </tr>
                          ))}
                          {(selectedCase.alertList ?? []).length === 0 && (
                            <tr><td colSpan={6} className="px-4 py-4 text-sm text-[#525252] text-center">No alerts linked to this case.</td></tr>
                          )}
                        </tbody>
                      </table>
                      <div className="px-4 py-2 text-xs text-[#525252] bg-white border-t border-[#E0E0E0]">
                        Total alerts: {(selectedCase.alertList ?? []).length}
                      </div>
                    </div>

                    {/* ── Activity Details section ── */}
                    <div className="border border-[#E0E0E0] rounded overflow-hidden">

                      {/* Section header */}
                      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#2A53A0] bg-white">
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-[#161616]">
                          Activity Details <ChevronDown size={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center bg-[#2A53A0] text-white rounded hover:bg-[#1A3870] transition-colors">
                          <Upload size={14} />
                        </button>
                      </div>

                      {/* Sub-tabs: Comments | Attachments | Audit History | Inbox Response */}
                      <div className="flex border-b border-[#E0E0E0] bg-white">
                        {(["Comments", "Attachments", "Audit History", "Inbox Response"] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActivityTab(tab)}
                            className={cn(
                              "px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap",
                              activityTab === tab
                                ? "border-[#161616] text-[#161616]"
                                : "border-transparent text-[#525252] hover:text-[#161616]"
                            )}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {/* Tab content */}
                      <div className="bg-white p-4">
                        {activityTab === "Comments" && (
                          <div className="space-y-3">
                            {/* Rich text editor */}
                            <div className="border border-[#E0E0E0] rounded overflow-hidden">
                              {/* Toolbar */}
                              <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[#E0E0E0] flex-wrap">
                                {/* Paragraph style select */}
                                <select className="text-xs border border-[#C6C6C6] rounded px-2 py-1 mr-2 text-[#161616] outline-none bg-white cursor-pointer hover:bg-gray-50">
                                  <option>Normal</option>
                                  <option>Heading 1</option>
                                  <option>Heading 2</option>
                                  <option>Heading 3</option>
                                </select>
                                {/* Formatting buttons */}
                                {[
                                  { label: "B",   title: "Bold",          cls: "font-bold" },
                                  { label: "I",   title: "Italic",        cls: "italic" },
                                  { label: "U",   title: "Underline",     cls: "underline" },
                                ].map(btn => (
                                  <button key={btn.title} title={btn.title}
                                    className={cn("w-7 h-7 flex items-center justify-center text-sm text-[#161616] hover:bg-[#E0E0E0] rounded transition-colors", btn.cls)}>
                                    {btn.label}
                                  </button>
                                ))}
                                {/* Link */}
                                <button title="Link" className="w-7 h-7 flex items-center justify-center hover:bg-[#E0E0E0] rounded transition-colors">
                                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                                    <path d="M6 10l4-4M5 7.5a2.5 2.5 0 003.5 3.5l1.5-1.5A2.5 2.5 0 006.5 6L5 7.5z" />
                                    <path d="M10 8.5a2.5 2.5 0 00-3.5-3.5L5 6.5A2.5 2.5 0 009.5 10L11 8.5z" />
                                  </svg>
                                </button>
                                {/* Blockquote */}
                                <button title="Blockquote" className="w-7 h-7 flex items-center justify-center text-sm text-[#161616] hover:bg-[#E0E0E0] rounded font-serif transition-colors">
                                  "
                                </button>
                                {/* Ordered list */}
                                <button title="Ordered List" className="w-7 h-7 flex items-center justify-center hover:bg-[#E0E0E0] rounded transition-colors">
                                  <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                                    <rect x="6" y="3" width="8" height="1.5" rx="0.5" />
                                    <rect x="6" y="7" width="8" height="1.5" rx="0.5" />
                                    <rect x="6" y="11" width="8" height="1.5" rx="0.5" />
                                    <text x="1.5" y="5" fontSize="4" fill="currentColor">1</text>
                                    <text x="1.5" y="9" fontSize="4" fill="currentColor">2</text>
                                    <text x="1.5" y="13" fontSize="4" fill="currentColor">3</text>
                                  </svg>
                                </button>
                                {/* Unordered list */}
                                <button title="Unordered List" className="w-7 h-7 flex items-center justify-center hover:bg-[#E0E0E0] rounded transition-colors">
                                  <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                                    <circle cx="3" cy="4" r="1.2" />
                                    <rect x="6" y="3" width="8" height="1.5" rx="0.5" />
                                    <circle cx="3" cy="8" r="1.2" />
                                    <rect x="6" y="7" width="8" height="1.5" rx="0.5" />
                                    <circle cx="3" cy="12" r="1.2" />
                                    <rect x="6" y="11" width="8" height="1.5" rx="0.5" />
                                  </svg>
                                </button>
                                {/* Code */}
                                <button title="Code" className="w-7 h-7 flex items-center justify-center text-xs font-mono text-[#161616] hover:bg-[#E0E0E0] rounded transition-colors">
                                  {"</>"}
                                </button>
                              </div>

                              {/* Editor text area */}
                              <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment(Only text is supported)"
                                rows={4}
                                className="w-full px-4 py-3 text-sm text-[#161616] placeholder-[#DA1E28] placeholder-italic resize-none outline-none bg-white"
                                style={{ fontStyle: commentText ? "normal" : "italic" }}
                              />
                            </div>

                            {/* Add Comment button */}
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A53A0] text-white text-sm font-medium rounded hover:bg-[#1A3870] transition-colors">
                              Add Comment
                              <Launch size={14} />
                            </button>
                          </div>
                        )}

                        {activityTab === "Attachments" && (
                          <div className="text-sm text-[#525252] py-4 text-center">No attachments found.</div>
                        )}
                        {activityTab === "Audit History" && (
                          <div className="text-sm text-[#525252] py-4 text-center">No audit history available.</div>
                        )}
                        {activityTab === "Inbox Response" && (
                          <div className="text-sm text-[#525252] py-4 text-center">No inbox responses.</div>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Carbon DS data table card ── */}
        {view === "list" && <div className="flex-1 min-h-0 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden">

          {/* Scrollable table body — thead is sticky inside */}
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full" style={{ tableLayout: "fixed", borderCollapse: "collapse" }}>
              <colgroup>
                <col style={{ width: "4%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "10%" }} />
              </colgroup>
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr>
                  {/* expand toggle column — no label, matching header style */}
                  <th style={{ height: "48px", backgroundColor: "#E0E0E0" }} className="px-2" />
                  <SortableHeader label="Case Id" />
                  <SortableHeader label="Case Entity Name" />
                  <SortableHeader label="Summary" />
                  <SortableHeader label="Assignee" />
                  <SortableHeader label="Created On" />
                  <SortableHeader label="Received At" />
                  <SortableHeader label="Case Status" />
                </tr>
              </thead>
              <tbody>
                {casesData.map((row, idx) => {
                  const isExpanded = expandedRows.has(row.caseId + idx);
                  return (
                    <Fragment key={row.caseId + idx}>
                      <tr
                        style={{ height: "46px" }}
                        className={cn(
                          "border-b border-[#E0E0E0] transition-colors",
                          isExpanded ? "bg-[#EAF2FF]" : "hover:bg-[#F5F8FF]"
                        )}
                      >
                        {/* Expand toggle */}
                        <td className="px-2 align-middle text-center">
                          <button
                            onClick={() => toggleRow(row.caseId + idx)}
                            className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#D0E2FF] transition-colors text-[#525252] hover:text-[#2A53A0]"
                            title={isExpanded ? "Collapse row" : "Expand row"}
                          >
                            {isExpanded
                              ? <ChevronDown size={16} className="text-[#2A53A0]" />
                              : <ChevronRight size={16} />
                            }
                          </button>
                        </td>
                        <td className="px-4 overflow-hidden align-middle">
                          <span
                            className="text-[#2A53A0] text-sm font-medium cursor-pointer hover:underline block truncate"
                            onClick={() => onCaseClick?.(row.caseId)}
                          >
                            {row.caseId}
                          </span>
                        </td>
                        <td className="px-4 overflow-hidden align-middle">
                          <span className="block truncate text-sm text-[#161616]" title={row.caseEntityName}>{row.caseEntityName}</span>
                        </td>
                        <td className="px-4 overflow-hidden align-middle">
                          <span className="block truncate text-sm text-[#525252]">{row.summary}</span>
                        </td>
                        <td className="px-4 overflow-hidden align-middle">
                          <span className="block truncate text-sm text-[#161616]">{row.assignee}</span>
                        </td>
                        <td className="px-4 overflow-hidden align-middle">
                          <span className="block truncate text-xs text-[#525252]">{row.createdOn}</span>
                        </td>
                        <td className="px-4 overflow-hidden align-middle">
                          <span className="block truncate text-xs text-[#525252]">{row.receivedAt}</span>
                        </td>
                        <td className="px-4 align-middle">
                          <CaseStatusBadge status={row.caseStatus} />
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <tr className="border-b border-[#C6D6F5]">
                          <td colSpan={8} className="p-0">
                            <ExpandedDetail row={row} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Data Table Footer — 48px white ── */}
          <div
            style={{ height: "48px", backgroundColor: "#ffffff" }}
            className="flex-shrink-0 flex items-stretch border-t border-[#E0E0E0] text-sm text-[#525252]"
          >
            {/* "Items per page:" label */}
            <span className="flex items-center px-4 whitespace-nowrap">Items per page:</span>

            {/* Divider */}
            <div className="w-px bg-[#E0E0E0]" />

            {/* Page-size select */}
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="px-4 bg-white text-sm text-[#161616] border-none outline-none cursor-pointer hover:bg-[#f4f4f4]"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            {/* Divider */}
            <div className="w-px bg-[#E0E0E0]" />

            {/* Range text — fills remaining space */}
            <span className="flex items-center flex-1 px-4 whitespace-nowrap">
              {start}–{end} of {TOTAL_CASES} items
            </span>

            {/* Page select + "of N pages" */}
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="px-4 bg-white text-sm text-[#161616] border-none outline-none cursor-pointer hover:bg-[#f4f4f4]"
            >
              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="flex items-center pr-4 whitespace-nowrap">of {TOTAL_PAGES} pages</span>

            {/* Divider */}
            <div className="w-px bg-[#E0E0E0]" />

            {/* Prev arrow */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-12 flex items-center justify-center text-[#525252] hover:bg-[#f4f4f4] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <CaretLeft size={16} />
            </button>

            {/* Divider */}
            <div className="w-px bg-[#E0E0E0]" />

            {/* Next arrow */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              disabled={currentPage === TOTAL_PAGES}
              className="w-12 flex items-center justify-center text-[#525252] hover:bg-[#f4f4f4] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <CaretRight size={16} />
            </button>
          </div>

        </div>}

      </div>
    </div>
  );
}

export default CasesPage;
