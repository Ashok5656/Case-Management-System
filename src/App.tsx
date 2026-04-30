import { useState, useRef, useMemo, useEffect } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster, toast } from "sonner@2.0.3";
import PageHeader from "./components/page-header";
import { ModernHeader } from "./components/modern-header";
import { UnifiedSidebar } from "./components/unified-sidebar";
import { ModuleContent } from "./components/module-content";
import { ScrollToBottomButton } from "./components/scroll-to-bottom-button";
import { DashboardOverview } from "./components/dashboard-overview";
import { ComplianceAnalytics } from "./components/dashboards/compliance-analytics";
import { RiskManagement } from "./components/dashboards/risk-management";
import { TransactionMonitoring } from "./components/dashboards/transaction-monitoring";
import { PaymentMonitoring } from "./components/dashboards/payment-monitoring";
import { CustomerIntelligence } from "./components/dashboards/customer-intelligence";
import { OperationalMetrics } from "./components/dashboards/operational-metrics";
import { ExecutiveSummary } from "./components/dashboards/executive-summary";
import { ScreeningDashboard } from "./components/dashboards/screening-dashboard";
import { LoD2Dashboard } from "./components/dashboards/lod2-dashboard";
import { LoginScreen } from "./components/login-screen";
import { TwoFactorAuth } from "./components/two-factor-auth";
import { TemplatesPage, TEMPLATE_DATA } from "./components/templates-page";
import { TemplateDetailsPage } from "./components/template-details-page";
import { TemplateUsePage } from "./components/template-use-page";
import { ViewUDVPage } from "./components/view-udv-page";
import { ViewSECPage } from "./components/view-sec-page";
import { CreateUDVPage } from "./components/create-udv-page";
import { CreateScenarioPage } from "./components/create-scenario-page";
import { VersionManagementPage } from "./components/version-management-page";
import { ScenarioListPage } from "./components/scenario-list-page";
import { ViewScenarioPage } from "./components/view-scenario-page";
import { EditScenarioPage } from "./components/edit-scenario-page";
import { PendingVerificationPage } from "./components/pending-verification-page";
import { MyWorkPage } from "./components/my-work-page";
import { INITIAL_SCENARIO_DATA, INITIAL_PENDING_DATA, ScenarioItem } from "./components/scenarios-data";
import {
  Dashboard,
  Home,
  User,
  UserAdmin,
  Portfolio,
  Security,
  Activity,
  UserFollow,
  Document,
  Flow,
  DocumentView,
  View,
  Flash,
  Money,
  ChartRadar,
  Time,
  Search,
  ChartBar,
  Edit,
  Copy,
  Catalog,
  CheckmarkOutline,
  DataTable,
  VirtualMachine,
  TaskSettings,
  Settings,
  Workspace,
  Group,
  SettingsAdjust,
  SendAlt,
  Reply
} from "@carbon/icons-react";

import AppFooter from "./components/app-footer";
import { ScenariosDashboard } from "./components/dashboards/scenarios-dashboard";
import { 
  EventsPage, 
  OOTB_DATA, 
  CUSTOM_DATA, 
  DRAFT_DATA, 
  PENDING_DATA,
  EventItem 
} from "./components/events-page";
import { 
  UDVPage, 
  OOTB_UDV, 
  CUSTOM_UDV, 
  DRAFT_UDV, 
  PENDING_UDV, 
  UDVItem 
} from "./components/udv-page";
import { 
  SECPage, 
  OOTB_SEC, 
  CUSTOM_SEC, 
  DRAFT_SEC, 
  PENDING_SEC, 
  SECItem 
} from "./components/sec-page";
import { ViewsPage } from "./components/views-page";
import { CreateViewPage } from "./components/create-view-page";
import { 
  OOTB_VIEWS, 
  CUSTOM_VIEWS, 
  DRAFT_VIEWS, 
  PENDING_VIEWS, 
  ViewItem 
} from "./components/views-page";
import { 
  VirtualSEPage, 
  OOTB_VIRTUAL_ENVS, 
  CUSTOM_VIRTUAL_ENVS, 
  DRAFT_VIRTUAL_ENVS, 
  PENDING_VIRTUAL_ENVS, 
  VirtualEnvItem 
} from "./components/virtual-se-page";
import { EventDetailsPage } from "./components/event-details-page";
import { CreateEventPage } from "./components/create-event-page";
import { VerifyEventPage } from "./components/verify-event-page";
import { VerifyScenarioPage } from "./components/verify-scenario-page";
import { VerifyUDVPage } from "./components/verify-udv-page";
import { VerifySECPage } from "./components/verify-sec-page";
import { VerifyViewPage } from "./components/verify-view-page";
import { VerifyWorkspacePage } from "./components/verify-workspace-page";
import { VerifySettingsPage } from "./components/verify-settings-page";

import { LookupTablesPage, LOOKUP_TABLES_DATA } from "./components/lookup-tables-page";
import { EditWhitelistEntryPage } from "./components/edit-whitelist-entry-page";
import { CreateWhitelistEntryPage } from "./components/create-whitelist-entry-page";
import { BulkUploadPage } from "./components/bulk-upload-page";
import { CoreTablesPage } from "./components/core-tables-page";
import { CoreTableEntryView } from "./components/core-table-entry-view";
import { LookupTableEntryView } from "./components/lookup-table-entry-view";
import { Button } from "./components/ui/button";

import { CreateSECPage } from "./components/create-sec-page";
import { WorkspaceManagementPage, INITIAL_WORKSPACE_DATA } from "./components/workspace-management-page";
import { GroupManagementPage } from "./components/group-management-page";
import { KeyConfigurationView } from "./components/key-configuration-view";
import { SettingsTabView } from "./components/settings-tab-view";
import { SystemConfigPage } from "./components/system-config-page";
import { SettingsEventsPage } from "./components/settings-events-page";
import { DashboardConfigPage } from "./components/dashboard-config-page";
import { RequestConfirmationPage } from "./components/request-confirmation-page";
import { ResponseConfirmationPage } from "./components/response-confirmation-page";
import { SupervisorPage } from "./components/supervisor-page";
import { SettingsPage } from "./components/settings-page";
import { EFMDashboardPage } from "./components/efm-dashboard-page";
import { CasesPage } from "./components/cases-page";
import { CaseDetailPage } from "./components/case-detail-page";
import { AlertDetailPage } from "./components/alert-detail-page";
import { AlertsPage } from "./components/alerts-page";

export default function App() {
  // Suppress Figma inspector prop warnings in development
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('React does not recognize') &&
        args[0].includes('_fg')
      ) {
        return; // Suppress Figma inspector warnings
      }
      originalError.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);

  // Main application state and routing
  const mainContentRef = useRef<HTMLElement>(null);
  // Simplified menu structure - removed old complex submenu items
  // const createSubItems = (items: { label: string; icon: any; description?: string }[]) => 
  //   items.map(item => ({
  //     id: item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  //     ...item
  //   }));

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [username, setUsername] = useState("Rajesh Kumar");
  const [userRole, setUserRole] = useState("System Administrator");
  const [activeItem, _setActiveItem] = useState("home-dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [scenarioCreationData, setScenarioCreationData] = useState<{ template: any; config: any } | null>(null);

  // --- LIFTED SCENARIO DATA STATES ---
  const [scenarios, setScenarios] = useState<ScenarioItem[]>(INITIAL_SCENARIO_DATA);
  const [pendingScenarios, setPendingScenarios] = useState<ScenarioItem[]>(INITIAL_PENDING_DATA);

  // --- LIFTED EVENT DATA STATES ---
  const [ootbEvents, setOotbEvents] = useState<EventItem[]>(OOTB_DATA);
  const [customEvents, setCustomEvents] = useState<EventItem[]>(CUSTOM_DATA);
  const [draftEvents, setDraftEvents] = useState<EventItem[]>(DRAFT_DATA);
  const [pendingEvents, setPendingEvents] = useState<EventItem[]>(PENDING_DATA);
  
  // --- LIFTED UDV DATA STATES ---
  const [ootbUDV, setOotbUDV] = useState<UDVItem[]>(OOTB_UDV);
  const [customUDV, setCustomUDV] = useState<UDVItem[]>(CUSTOM_UDV);
  const [draftUDV, setDraftUDV] = useState<UDVItem[]>(DRAFT_UDV);
  const [pendingUDV, setPendingUDV] = useState<UDVItem[]>(PENDING_UDV);

  // --- LIFTED SEC DATA STATES ---
  const [ootbSEC, setOotbSEC] = useState<SECItem[]>(OOTB_SEC);
  const [customSEC, setCustomSEC] = useState<SECItem[]>(CUSTOM_SEC);
  const [draftSEC, setDraftSEC] = useState<SECItem[]>(DRAFT_SEC);
  const [pendingSEC, setPendingSEC] = useState<SECItem[]>(PENDING_SEC);

  // --- LIFTED VIEWS DATA STATES ---
  const [ootbViews, setOotbViews] = useState<ViewItem[]>(OOTB_VIEWS);
  const [customViews, setCustomViews] = useState<ViewItem[]>(CUSTOM_VIEWS);
  const [draftViews, setDraftViews] = useState<ViewItem[]>(DRAFT_VIEWS);
  const [pendingViews, setPendingViews] = useState<ViewItem[]>(PENDING_VIEWS);

  // --- LIFTED VIRTUAL SE DATA STATES ---
  const [ootbVirtualEnvs, setOotbVirtualEnvs] = useState<VirtualEnvItem[]>(OOTB_VIRTUAL_ENVS);
  const [customVirtualEnvs, setCustomVirtualEnvs] = useState<VirtualEnvItem[]>(CUSTOM_VIRTUAL_ENVS);
  const [draftVirtualEnvs, setDraftVirtualEnvs] = useState<VirtualEnvItem[]>(DRAFT_VIRTUAL_ENVS);
  const [pendingVirtualEnvs, setPendingVirtualEnvs] = useState<VirtualEnvItem[]>(PENDING_VIRTUAL_ENVS);

  // --- WORKSPACE KEY CONFIGURATION STATE ---
  const [pendingWorkspaces, setPendingWorkspaces] = useState<any[]>([]);
  const [approvedWorkspaceConfigs, setApprovedWorkspaceConfigs] = useState<Record<string, any>>({});

  // --- WORKSPACE SETTINGS STATE ---
  const [pendingSettings, setPendingSettings] = useState<any[]>([]);
  const [approvedSettings, setApprovedSettings] = useState<Record<string, any>>({});

  const allEvents = useMemo(() => [
    ...ootbEvents,
    ...customEvents,
    ...draftEvents,
    ...pendingEvents
  ], [ootbEvents, customEvents, draftEvents, pendingEvents]);

  const setActiveItem = (item: string) => {
    if (item === "ai-genie") {
       window.open("https://genai.clari5.com", "_blank");
       return;
    }
    _setActiveItem(item);
  };
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [is2FAEnabled, setIs2FAEnabled] = useState(() => {
    const saved = localStorage.getItem("is2FAEnabled");
    return saved === null ? true : saved === "true";
  });

  const menuItems = useMemo(() => [
    {
      id: "home",
      title: "Home",
      icon: Home,
      gradient: "from-blue-500 via-blue-600 to-cyan-600",
      subItems: [
        { id: "dashboard", label: "Dashboard", icon: Dashboard },
        { id: "cases", label: "Cases", icon: Document },
        { id: "alerts", label: "Alerts", icon: Activity },
      ],
    },
    {
      id: "advanced-search",
      title: "Advanced Search",
      icon: Search,
      gradient: "from-purple-500 via-purple-600 to-indigo-600",
      subItems: [],
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      gradient: "from-slate-600 via-slate-700 to-slate-800",
      subItems: [
        { id: "users-groups", label: "Users & Groups", icon: Group },
        { id: "projects", label: "Projects", icon: Portfolio },
        { id: "fields", label: "Fields", icon: DataTable },
        { id: "modules", label: "Modules", icon: TaskSettings },
        { id: "questionnaire", label: "Questionnaire", icon: Catalog },
      ],
    },
  ], []);

  const getCurrentContent = () => {
    if (activeItem === "home-dashboard" || activeItem === "dashboard") {
      return {
        type: "efm-dashboard",
        breadcrumbs: [{ label: "Home", path: "home-dashboard" }, { label: "Dashboard", isActive: true }],
      };
    }

    if (activeItem === "home-cases") {
      return {
        type: "cases-page",
        breadcrumbs: [{ label: "Home", path: "home-dashboard" }, { label: "Cases", isActive: true }],
      };
    }

    if (activeItem.startsWith("case-detail-")) {
      const id = activeItem.replace("case-detail-", "");
      return {
        type: "case-detail",
        caseId: id,
        breadcrumbs: [
          { label: "Home", path: "home-dashboard" },
          { label: "Cases", path: "home-cases" },
          { label: id, isActive: true },
        ],
      };
    }

    if (activeItem.startsWith("alert-detail-")) {
      const id = activeItem.replace("alert-detail-", "");
      return {
        type: "alert-detail",
        alertId: id,
        breadcrumbs: [
          { label: "Home", path: "home-dashboard" },
          { label: id, isActive: true },
        ],
      };
    }

    if (activeItem === "home-alerts") {
      return {
        type: "alerts-page",
        breadcrumbs: [{ label: "Home", path: "home-dashboard" }, { label: "Alerts", isActive: true }],
      };
    }

    if (activeItem === "advanced-search") {
      return {
        type: "placeholder-message",
        message: "Advanced Search page.",
        breadcrumbs: [{ label: "Advanced Search", isActive: true }],
      };
    }

    if (activeItem === "settings-users-groups") {
      return {
        type: "placeholder-message",
        message: "Users & Groups page.",
        breadcrumbs: [{ label: "Settings", path: "settings-users-groups" }, { label: "Users & Groups", isActive: true }],
      };
    }

    if (activeItem === "settings-projects") {
      return {
        type: "placeholder-message",
        message: "Projects page.",
        breadcrumbs: [{ label: "Settings", path: "settings-users-groups" }, { label: "Projects", isActive: true }],
      };
    }

    if (activeItem === "settings-fields") {
      return {
        type: "placeholder-message",
        message: "Fields page.",
        breadcrumbs: [{ label: "Settings", path: "settings-users-groups" }, { label: "Fields", isActive: true }],
      };
    }

    if (activeItem === "settings-modules") {
      return {
        type: "placeholder-message",
        message: "Modules page.",
        breadcrumbs: [{ label: "Settings", path: "settings-users-groups" }, { label: "Modules", isActive: true }],
      };
    }

    if (activeItem === "settings-questionnaire") {
      return {
        type: "placeholder-message",
        message: "Questionnaire page.",
        breadcrumbs: [{ label: "Settings", path: "settings-users-groups" }, { label: "Questionnaire", isActive: true }],
      };
    }

    // Default to EFM dashboard
    return {
      type: "efm-dashboard",
      breadcrumbs: [{ label: "Home", path: "home-dashboard" }, { label: "Dashboard", isActive: true }],
    };
  };

  // Old complex routing logic removed for simplified menu structure

  const currentContent = getCurrentContent();

  const handleLogout = () => setIsLoggedIn(false);
  const handleToggle2FA = (enabled: boolean) => {
    setIs2FAEnabled(enabled);
    localStorage.setItem("is2FAEnabled", String(enabled));
  };

  /* BLOCK_START_OLD_ROUTING_REMOVED
       const initialTab = activeItem.includes(":") ? activeItem.split(":")[1] : (activeItem === "events-pending" ? "event" : (activeItem === "udv-pending" ? "udv" : (activeItem === "sec-pending" ? "sec" : (activeItem === "views-pending" ? "view" : (activeItem === "virtual-se-pending" ? "virtual-se" : "scenario")))));
       
       return {
         type: "pending-verification-unified",
         initialTab,
         onVerifyScenario: (id: string) => setActiveItem(`scenarios-verify-${id}`),
         onVerifyEvent: (id: string) => setActiveItem(`events-verify-${id}`),
         onVerifyUDV: (id: string) => setActiveItem(`udv-verify-${id}`),
         onVerifySEC: (id: string) => setActiveItem(`sec-verify-${id}`),
         onVerifyView: (id: string) => setActiveItem(`views-verify-${id}`),
         onVerifyVirtualEnv: (id: string) => setActiveItem(`virtual-se-verify-${id}`),
         breadcrumbs: [{ label: "Pending Verification", isActive: true }]
       };
    }

    if (activeItem.startsWith("scenarios-verify-")) {
       const scenarioId = activeItem.replace("scenarios-verify-", "");
       const scenario = pendingScenarios.find(s => s.id === scenarioId);
       return {
          type: "scenario-verify",
          scenario,
          breadcrumbs: [
             { label: "Scenarios", path: "scenarios" },
             { label: "Pending Verification", path: "pending-verification-main:scenario" },
             { label: "Verify Scenario", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("events-verify-")) {
       const eventId = activeItem.replace("events-verify-", "");
       const event = pendingEvents.find(e => e.id === eventId);
       return {
          type: "event-verify",
          event,
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "Events", path: "events" },
             { label: "Pending Verification", path: "pending-verification-main:event" },
             { label: "Verify Event", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("udv-verify-")) {
       const udvId = activeItem.replace("udv-verify-", "");
       const udv = pendingUDV.find(u => u.id === udvId);
       return {
          type: "udv-verify",
          udv,
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "UDV", path: "udv" },
             { label: "Pending Verification", path: "pending-verification-main:udv" },
             { label: "Verify UDV", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("sec-verify-")) {
       const secId = activeItem.replace("sec-verify-", "");
       const sec = pendingSEC.find(s => s.id === secId);
       return {
          type: "sec-verify",
          sec,
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "SEC Management", path: "sec" },
             { label: "Pending Verification", path: "pending-verification-main:sec" },
             { label: "Verify SEC", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("views-verify-")) {
       const viewId = activeItem.replace("views-verify-", "");
       const view = pendingViews.find(v => v.id === viewId);
       return {
          type: "view-verify",
          view,
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "View Management", path: "views-management" },
             { label: "Pending Verification", path: "pending-verification-main:view" },
             { label: "Verify View", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("workspace-verify-")) {
       const workspaceId = activeItem.replace("workspace-verify-", "");
       const workspace = pendingWorkspaces.find(w => w.id === workspaceId);
       return {
          type: "workspace-verify",
          workspace,
          breadcrumbs: [
             { label: "System Configuration", path: "system-configuration" },
             { label: "Workspace Management", path: "system-configuration-workspace-management" },
             { label: "Pending Verification", path: "pending-verification-main:workspace" },
             { label: "Verify Workspace Configuration", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("settings-verify-")) {
       const settingsId = activeItem.replace("settings-verify-", "");
       const settings = pendingSettings.find(s => s.id === settingsId);
       return {
          type: "settings-verify",
          settings,
          breadcrumbs: [
             { label: "System Configuration", path: "system-configuration" },
             { label: "Workspace Management", path: "system-configuration-workspace-management" },
             { label: "Pending Verification", path: "pending-verification-main:settings" },
             { label: "Verify Settings", isActive: true }
          ]
       };
    }

    if (activeItem === "virtual-se-create") {
       return {
          type: "placeholder-message",
          message: "Create a new virtual simulation environment.",
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "Virtual SE", path: "virtual-se" },
             { label: "New Environment", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("virtual-se-verify-")) {
       const veId = activeItem.replace("virtual-se-verify-", "");
       const ve = pendingVirtualEnvs.find(v => v.id === veId);
       return {
          type: "virtual-se-verify",
          ve,
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "Virtual SE", path: "virtual-se" },
             { label: "Pending Verification", path: "pending-verification-main:virtual-se" },
             { label: "Verify Environment", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("virtual-se-details-")) {
       const veId = activeItem.replace("virtual-se-details-", "");
       const ve = [...ootbVirtualEnvs, ...customVirtualEnvs, ...draftVirtualEnvs, ...pendingVirtualEnvs].find(v => v.id === veId);
       return {
          type: "virtual-se-details",
          ve,
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "Virtual SE", path: "virtual-se" },
             { label: ve?.name || "Environment Details", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("virtual-se-edit-")) {
       const veId = activeItem.replace("virtual-se-edit-", "");
       const ve = draftVirtualEnvs.find(v => v.id === veId);
       return {
          type: "virtual-se-edit",
          ve,
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "Virtual SE", path: "virtual-se" },
             { label: "Edit Config", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("events-details-")) {
       const eventId = activeItem.replace("events-details-", "");
       const event = allEvents.find(e => e.id === eventId);
       const categoryPath = event?.category === "custom" ? "events-custom" : "events";
       const categoryLabel = event?.category === "custom" ? "Custom Events" : "OOTB Events";
       
       return {
          type: "event-details",
          event,
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "Events", path: "events" },
             { label: categoryLabel, path: categoryPath },
             { label: event?.eventName || "Event Details", isActive: true }
          ]
       };
    }

    if (activeItem === "events-create" || activeItem.startsWith("events-edit-")) {
       const isEdit = activeItem.startsWith("events-edit-");
       const eventId = isEdit ? activeItem.replace("events-edit-", "") : null;
       const event = isEdit ? allEvents.find(e => e.id === eventId) : null;
       
       const baseLabel = isEdit ? (event?.category === "draft" ? "Drafted Events" : "Custom Events") : "Custom Events";
       const basePath = isEdit ? (event?.category === "draft" ? "events-draft" : "events-custom") : "events-custom";

       return {
          type: "create-event",
          title: isEdit ? "Edit Custom Event" : "Add Custom Event",
          initialData: event,
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "Events", path: "events" },
             { label: baseLabel, path: basePath },
             { label: isEdit ? "Edit Event" : "Add Event", isActive: true }
          ]
       };
    }

    if (activeItem === "events" || activeItem === "events-draft" || activeItem === "events-custom") {
       const tabLabels: Record<string, string> = {
         "events": "OOTB Events",
         "events-draft": "Drafted Events",
         "events-custom": "Custom Events"
       };
       return {
         type: "events-inventory",
         initialTab: activeItem === "events-draft" ? "draft" : activeItem === "events-custom" ? "custom" : "ootb",
         breadcrumbs: [
           { label: "Data Maintenance", path: "data-maintenance" },
           { label: "Events", path: "events" },
           { label: tabLabels[activeItem] || "OOTB Events", isActive: true }
         ]
       };
    }

    if (activeItem === "udv-create") {
       return {
          type: "create-udv",
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "UDV", path: "udv" },
             { label: "Create Custom UDV", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("udv-edit-")) {
       const udvId = activeItem.replace("udv-edit-", "");
       const udv = draftUDV.find(u => u.id === udvId) || customUDV.find(u => u.id === udvId) || ootbUDV.find(u => u.id === udvId);
       
       return {
          type: "create-udv",
          title: "Edit Custom UDV",
          initialData: udv,
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "UDV", path: "udv" },
             { label: "My Work", path: "my-work:udv" },
             { label: udv?.name || "Edit UDV", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("udv-details-")) {
       const udvId = activeItem.replace("udv-details-", "");
       const udv = draftUDV.find(u => u.id === udvId) || customUDV.find(u => u.id === udvId) || ootbUDV.find(u => u.id === udvId);
       
       const category = udv?.category || "default";
       const parentPath = category === "custom" ? "udv-custom" : category === "draft" ? "udv-draft" : "udv";
       const parentLabel = category === "custom" ? "Custom UDV" : category === "draft" ? "Drafted UDV" : "Available IPVs";

       return {
          type: "view-udv",
          udv,
          breadcrumbs: [
             { label: "Data Maintenance", path: "data-maintenance" },
             { label: "UDV", path: "udv" },
             { label: parentLabel, path: parentPath },
             { label: "Variable Details", isActive: true }
          ]
       };
    }

    if (activeItem === "udv" || activeItem === "udv-draft" || activeItem === "udv-custom") {
       const tabLabels: Record<string, string> = {
         "udv": "Available IPVs",
         "udv-draft": "Drafted UDV",
         "udv-custom": "Custom UDV"
       };
       return {
         type: "udv-inventory",
         initialTab: activeItem === "udv-draft" ? "draft" : activeItem === "udv-custom" ? "custom" : "ootb",
         breadcrumbs: [
           { label: "Data Maintenance", path: "data-maintenance" },
           { label: "UDV", path: "udv" },
           { label: tabLabels[activeItem] || "Available IPVs", isActive: true }
         ]
       };
    }

    if (activeItem.startsWith("sec-details-")) {
      const secId = activeItem.replace("sec-details-", "");
      const sec = [...ootbSEC, ...customSEC].find(s => s.id === secId);
      const categoryPath = sec?.category === "custom" ? "sec-custom" : "sec";
      const categoryLabel = sec?.category === "custom" ? "Custom Controls" : "OOTB Controls";
      
      return {
        type: "sec-details",
        sec,
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "SEC Management", path: "sec" },
          { label: categoryLabel, path: categoryPath },
          { label: "Control Details", isActive: true }
        ]
      };
    }

    if (activeItem.startsWith("sec-edit-")) {
      const secId = activeItem.replace("sec-edit-", "");
      // Check custom inventory first, then drafts, then pending
      const sec = [...customSEC, ...draftSEC, ...pendingSEC].find(s => s.id === secId);
      return {
        type: "sec-edit",
        sec,
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "SEC Management", path: "sec" },
          { label: "Custom Controls", path: "sec-custom" },
          { label: `Edit: ${sec?.name || "Control"}`, isActive: true }
        ]
      };
    }

    if (activeItem === "sec" || activeItem === "sec-custom") {
       const tabLabels: Record<string, string> = {
         "sec": "OOTB Controls",
         "sec-custom": "Custom Controls"
       };
       return {
         type: "sec-inventory",
         initialTab: activeItem === "sec-custom" ? "custom" : "ootb",
         breadcrumbs: [
           { label: "Data Maintenance", path: "data-maintenance" },
           { label: "SEC Management", path: "sec" },
           { label: tabLabels[activeItem] || "OOTB Controls", isActive: true }
         ]
       };
    }

    if (activeItem === "sec-create") {
      return {
        type: "create-sec",
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "SEC Management", path: "sec" },
          { label: "Custom Controls", path: "sec-custom" },
          { label: "Create New SEC", isActive: true }
        ]
      };
    }

    if (activeItem === "views-management-views" || activeItem === "views" || activeItem === "views-management-views:ootb" || activeItem === "views-management-views:custom") {
       const initialTab = activeItem.includes(":") ? activeItem.split(":")[1] : "ootb";
       const tabLabels: Record<string, string> = {
         "ootb": "OOTB Views",
         "custom": "Custom Views"
       };
       return {
         type: "views-inventory",
         initialTab,
         breadcrumbs: [
           { label: "Data Maintenance", path: "data-maintenance" },
           { label: "View Management", path: "views-management" },
           { label: tabLabels[initialTab] || "OOTB Views", isActive: true }
         ]
       };
    }

    if (activeItem === "views-management-lookup-tables" || activeItem.startsWith("views-management-lookup-tables:")) {
      const initialTab = activeItem.includes(":") ? activeItem.split(":")[1] : "whitelist-global";
      return {
        type: "lookup-tables",
        initialTab,
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "View Management", path: "views-management" },
          { label: "Lookup Tables", isActive: true }
        ]
      };
    }

    if (activeItem.startsWith("views-management-lookup-tables-bulk-upload") || activeItem === "lookup-bulk-upload") {
      const parentTab = activeItem.includes(":") ? activeItem.split(":")[1] : "whitelist-global";
      return {
        type: "lookup-bulk-upload",
        parentTab,
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "View Management", path: "views-management" },
          { label: "Lookup Tables", path: `views-management-lookup-tables:${parentTab}` },
          { label: "Bulk Upload", isActive: true }
        ]
      };
    }

    if (activeItem.startsWith("views-management-lookup-tables-create") || activeItem === "lookup-create") {
      const parentTab = activeItem.includes(":") ? activeItem.split(":")[1] : "whitelist-global";
      return {
        type: "lookup-create",
        parentTab,
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "View Management", path: "views-management" },
          { label: "Lookup Tables", path: `views-management-lookup-tables:${parentTab}` },
          { label: "Create Whitelist Entry", isActive: true }
        ]
      };
    }

    if (activeItem.startsWith("views-management-lookup-tables-edit-") || activeItem.startsWith("lookup-edit-")) {
      const parts = activeItem.split("edit-")[1]?.split(":") || ["", "whitelist-global"];
      const id = parts[0];
      const parentTab = parts[1] || "whitelist-global";
      const entry = LOOKUP_TABLES_DATA.find(t => t.id === id);
      return {
        type: "lookup-edit",
        entry,
        parentTab,
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "View Management", path: "views-management" },
          { label: "Lookup Tables", path: `views-management-lookup-tables:${parentTab}` },
          { label: "Edit Whitelist Entry", isActive: true }
        ]
      };
    }

    if (activeItem.startsWith("views-management-lookup-tables-details-") || activeItem.startsWith("lookup-details-")) {
      const parts = activeItem.split("details-")[1]?.split(":") || ["", "whitelist-global"];
      const id = parts[0];
      const parentTab = parts[1] || "whitelist-global";
      const entry = LOOKUP_TABLES_DATA.find(t => t.id === id);
      return {
        type: "lookup-details",
        entry,
        parentTab,
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "View Management", path: "views-management" },
          { label: "Lookup Tables", path: `views-management-lookup-tables:${parentTab}` },
          { label: "Entry Details", isActive: true }
        ]
      };
    }

    if (activeItem.startsWith("views-management-core-tables-view-")) {
      const parts = activeItem.replace("views-management-core-tables-view-", "").split(":");
      const type = parts[0] as "branch" | "customer" | "account" | "card";
      const id = parts[1] || "unknown";
      return {
        type: "core-tables-view",
        entryType: type,
        entryId: id,
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "View Management", path: "views-management" },
          { label: "Core Tables", path: "views-management-core-tables" },
          { label: "View Entry", isActive: true }
        ]
      };
    }

    if (activeItem === "views-management-core-tables") {
      return {
        type: "core-tables",
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "View Management", path: "views-management" },
          { label: "Core Tables", isActive: true }
        ]
      };
    }

    if (activeItem === "views-management-views:create" || activeItem.startsWith("views-management-views:create:") || activeItem.startsWith("views-management-views:edit-")) {
      const isEdit = activeItem.startsWith("views-management-views:edit-");
      const parts = isEdit ? activeItem.replace("views-management-views:edit-", "").split(":") : activeItem.split(":");
      const viewId = isEdit ? parts[0] : null;
      const parentTab = isEdit ? (parts[1] || "ootb") : (parts[2] || "ootb");
      
      const allViews = [...ootbViews, ...customViews, ...draftViews, ...pendingViews];
      const view = viewId ? allViews.find(v => v.id === viewId) : null;

      return {
         type: "create-view",
         title: isEdit ? "Edit Custom View" : "Create Custom View",
         initialData: view,
         readOnly: false,
         parentTab,
         breadcrumbs: [
            { label: "Data Maintenance", path: "data-maintenance" },
            { label: "View Management", path: "views-management" },
            { label: "Views", path: `views-management-views:${parentTab}` },
            { label: isEdit ? "Edit View" : "Create View", isActive: true }
         ]
      };
    }

    if (activeItem.startsWith("views-management-views:data-") || activeItem.startsWith("views-management-views:config-")) {
      const prefix = activeItem.includes("data-") ? "views-management-views:data-" : "views-management-views:config-";
      const parts = activeItem.replace(prefix, "").split(":");
      const viewId = parts[0];
      const parentTab = parts[1] || "ootb";
        
      const allViews = [...ootbViews, ...customViews, ...draftViews, ...pendingViews];
      const view = allViews.find(v => v.id === viewId);

      return {
        type: "create-view",
        title: "View Details",
        initialData: view,
        readOnly: true,
        parentTab,
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "View Management", path: "views-management" },
          { label: "Views", path: `views-management-views:${parentTab}` },
          { label: view?.name || "View Details", isActive: true }
        ]
      };
    }

    if (activeItem === "virtual-se" || activeItem === "virtual-se-draft" || activeItem === "virtual-se-custom") {
       const tabLabels: Record<string, string> = {
         "virtual-se": "OOTB Environments",
         "virtual-se-draft": "Drafted Configs",
         "virtual-se-custom": "Custom Environments"
       };
       return {
         type: "virtual-se-inventory",
         initialTab: activeItem === "virtual-se-draft" ? "draft" : activeItem === "virtual-se-custom" ? "custom" : "ootb",
         breadcrumbs: [
           { label: "Data Maintenance", path: "data-maintenance" },
           { label: "Virtual SE", path: "virtual-se" },
           { label: tabLabels[activeItem] || "OOTB Environments", isActive: true }
         ]
       };
    }

    if (activeItem.startsWith("my-work")) {
       const initialTab = activeItem.includes(":") ? activeItem.split(":")[1] : "all";
       return {
         type: "my-work",
         initialTab,
         onViewScenarioDetails: (id: string) => setActiveItem(`scenarios-view-${id}`),
         onViewEventDetails: (id: string) => setActiveItem(`events-details-${id}`),
         onViewUDVDetails: (id: string) => setActiveItem(`udv-details-${id}`),
         onViewSECDetails: (id: string) => setActiveItem(`sec-details-${id}`),
         onViewViewDetails: (id: string) => {
            const allViews = [...ootbViews, ...customViews, ...draftViews, ...pendingViews];
            const v = allViews.find(view => view.id === id);
            
            if (v?.status === "Pending Approval") {
               setActiveItem(`views-verify-${id}`);
               return;
            }

            const parentTab = v?.category === "ootb" ? "ootb" : "custom";
            setActiveItem(`views-management-views:data-${id}:${parentTab}`);
         },
         breadcrumbs: [{ label: "My Work", isActive: true }]
       };
    }

    if (activeItem === "dashboard" || activeItem.startsWith("dashboard-")) {
       let pageLabel = "Overview";
       if (activeItem !== "dashboard") {
          const itemId = activeItem.replace("dashboard-", "");
          const item = dashboardSubItems.find(i => i.id === itemId);
          if (item) pageLabel = item.label;
       }
       return { 
         type: "dashboard",
         breadcrumbs: [
           { label: "Dashboard", path: "dashboard" },
           { label: pageLabel, isActive: true }
         ]
       };
    }

    if (activeItem === "scenarios" || activeItem === "scenarios-scenarios-dashboard") {
       return {
          type: "scenarios-dashboard",
          breadcrumbs: [
             { label: "Dashboard", path: "dashboard" },
             { label: "Scenarios", path: "scenarios" },
             { label: "Scenarios Dashboard", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("scenarios-templates-view-")) {
       const templateId = activeItem.replace("scenarios-templates-view-", "");
       const template = TEMPLATE_DATA.find(t => t.id === templateId);
       return {
          type: "template-details",
          template,
          breadcrumbs: [
             { label: "Scenarios", path: "scenarios" },
             { label: "Templates", path: "scenarios-templates" },
             { label: template?.name || "Template Details", isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("scenarios-templates-use-")) {
       const templateId = activeItem.replace("scenarios-templates-use-", "");
       const template = TEMPLATE_DATA.find(t => t.id === templateId);
       return {
          type: "template-use",
          template,
          breadcrumbs: [
             { label: "Scenarios", path: "scenarios" },
             { label: "Templates", path: "scenarios-templates" },
             { label: `Use: ${template?.name || "Template"}`, isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("scenarios-view-")) {
       const scenarioId = activeItem.replace("scenarios-view-", "");
       const scenario = scenarios.find(s => s.id === scenarioId) || pendingScenarios.find(s => s.id === scenarioId);
       
       if (!scenario) {
          return { type: "dashboard", breadcrumbs: [{ label: "Dashboard", isActive: true }] };
       }

       return {
          type: "scenario-view",
          scenario,
          breadcrumbs: [
             { label: "Scenarios", path: "scenarios" },
             { label: "Scenario List", path: "scenarios-scenario-list" },
             { label: scenario.name, isActive: true }
          ]
       };
    }

    if (activeItem.startsWith("scenarios-edit-")) {
       const scenarioId = activeItem.replace("scenarios-edit-", "");
       const scenario = scenarios.find(s => s.id === scenarioId) || pendingScenarios.find(s => s.id === scenarioId);
       
       if (!scenario) {
          return { type: "dashboard", breadcrumbs: [{ label: "Dashboard", isActive: true }] };
       }

       return {
          type: "create-scenario", 
          template: null,
          config: scenario,
          breadcrumbs: [
             { label: "Scenarios", path: "scenarios" },
             { label: "Scenario List", path: "scenarios-scenario-list" },
             { label: scenario.name, path: `scenarios-view-${scenarioId}` },
             { label: "Edit Scenario", isActive: true }
          ]
       };
    }

    if (activeItem === "scenarios-templates") {
      return {
        type: "templates",
        breadcrumbs: [
          { label: "Scenarios", path: "scenarios" },
          { label: "Templates", isActive: true }
        ]
      };
    }

    if (activeItem === "scenarios-scenario-list") {
      return {
        type: "scenario-list",
        breadcrumbs: [
          { label: "Scenarios", path: "scenarios" },
          { label: "Scenario List", isActive: true }
        ]
      };
    }

    if (activeItem === "scenarios-version-management") {
      return {
        type: "version-management",
        breadcrumbs: [
          { label: "Scenarios", path: "scenarios" },
          { label: "Version Management", isActive: true }
        ]
      };
    }

    if (activeItem === "scenarios-create-scenario") {
      return {
        type: "create-scenario",
        template: scenarioCreationData?.template,
        config: scenarioCreationData?.config,
        breadcrumbs: [
          { label: "Scenarios", path: "scenarios" },
          { label: "Create Scenario", isActive: true }
        ]
      };
    }

    if (activeItem === "system-configuration") {
      return {
        type: "module",
        title: "SYSTEM CONFIGURATION",
        version: "v1.0",
        icon: Settings,
        gradient: "from-slate-600 via-slate-700 to-slate-800",
        items: systemConfigItems,
        description: "Manage system-wide configurations, workspaces, groups, and settings.",
        breadcrumbs: [{ label: "System Configuration", isActive: true }]
      };
    }

    if (activeItem.startsWith("system-configuration-")) {
      const itemId = activeItem.replace("system-configuration-", "");
      const item = systemConfigItems.find(i => i.id === itemId);
      
      if (itemId === "workspace-management") {
        return {
          type: "workspace-management",
          breadcrumbs: [
            { label: "System Configuration", path: "system-configuration" },
            { label: "Workspace Management", isActive: true }
          ]
        };
      }

      if (itemId === "workspace-key-config") {
        return {
          type: "workspace-key-config",
          breadcrumbs: [
            { label: "System Configuration", path: "system-configuration" },
            { label: "Workspace Management", path: "system-configuration-workspace-management" },
            { label: "Key Configuration", isActive: true }
          ]
        };
      }

      if (itemId === "workspace-settings") {
        return {
          type: "workspace-settings",
          breadcrumbs: [
            { label: "System Configuration", path: "system-configuration" },
            { label: "Workspace Management", path: "system-configuration-workspace-management" },
            { label: "Settings", isActive: true }
          ]
        };
      }

      if (itemId === "group-management") {
        return {
          type: "group-management",
          breadcrumbs: [
            { label: "System Configuration", path: "system-configuration" },
            { label: "Group Management", isActive: true }
          ]
        };
      }

      if (itemId === "dashboard-config") {
        return {
          type: "dashboard-config",
          breadcrumbs: [
            { label: "System Configuration", path: "system-configuration" },
            { label: "Dashboard Config", isActive: true }
          ]
        };
      }

      if (itemId === "system-settings") {
        return {
          type: "system-config",
          breadcrumbs: [
            { label: "System Configuration", path: "system-configuration" },
            { label: "System Settings", isActive: true }
          ]
        };
      }

      return {
        type: "module",
        title: item?.label.toUpperCase() || "SYSTEM CONFIGURATION",
        version: "v1.0",
        icon: item?.icon || Settings,
        gradient: "from-slate-600 via-slate-700 to-slate-800",
        items: [],
        description: `Manage ${item?.label || "System Configuration"} module settings and configurations.`,
        breadcrumbs: [
          { label: "System Configuration", path: "system-configuration" },
          { label: item?.label || "Configuration", isActive: true }
        ]
      };
    }

    if (activeItem === "settings") {
      return {
        type: "module",
        title: "SETTINGS",
        version: "v1.0",
        icon: Settings,
        gradient: "from-gray-500 via-gray-600 to-gray-700",
        items: [],
        description: "Configure application settings",
        breadcrumbs: [{ label: "Settings", isActive: true }]
      };
    }

    if (activeItem === "topx") {
      return {
        type: "placeholder-message",
        message: "TopX configuration and management page.",
        breadcrumbs: [
          { label: "Data Maintenance", path: "data-maintenance" },
          { label: "TopX", isActive: true }
        ]
      };
    }

    const menu = menuItems.find(m => m.id === activeItem);
    if (menu) {
       return {
          type: "module",
          title: menu.title.toUpperCase(),
          version: "v1.0",
          icon: menu.icon,
          gradient: menu.gradient,
          items: menu.subItems || [],
          description: `Manage ${menu.title}`,
          breadcrumbs: [{ label: menu.title, isActive: true }]
       };
    }

    return { type: "dashboard", breadcrumbs: [{ label: "Dashboard", isActive: true }] };
  };
  BLOCK_END_OLD_ROUTING_REMOVED */

  // --- TRANSITION HANDLERS ---
  const handleApproveEvent = (id: string, comment: string) => {
    const event = pendingEvents.find(e => e.id === id);
    if (event) {
      setPendingEvents(prev => prev.filter(e => e.id !== id));
      setCustomEvents(prev => [{ ...event, status: "Verified", statusNote: comment, category: "custom", lastModified: new Date().toISOString() }, ...prev]);
      toast.success("Event Approved and moved to Custom Inventory");
      setActiveItem("events-custom");
    }
  };

  const handleRejectEvent = (id: string, comment: string) => {
    const event = pendingEvents.find(e => e.id === id);
    if (event) {
      const now = new Date().toISOString();
      setPendingEvents(prev => prev.filter(e => e.id !== id));
      setDraftEvents(prev => [{ ...event, status: "Rejected", statusNote: comment, category: "draft", lastModified: now }, ...prev]);
      toast.error(`Event Rejected`, {
        description: `Reason: ${comment}`,
        duration: 6000,
      });
      setActiveItem("my-work:event");
    }
  };

  const handleApproveScenario = (id: string, comment: string) => {
    const scenario = pendingScenarios.find(s => s.id === id);
    if (scenario) {
      const now = new Date().toISOString();
      setPendingScenarios(prev => prev.filter(s => s.id !== id));
      setScenarios(prev => [{ ...scenario, status: "Verified", lastModified: now }, ...prev]);
      toast.success(`Scenario ${id} Approved and activated`);
      setActiveItem("scenarios-scenario-list");
    }
  };

  const handleRejectScenario = (id: string, comment: string) => {
    const scenario = pendingScenarios.find(s => s.id === id);
    if (scenario) {
      const now = new Date().toISOString();
      setPendingScenarios(prev => prev.filter(s => s.id !== id));
      setScenarios(prev => [{ ...scenario, status: "Rejected", statusNote: comment, lastModified: now }, ...prev]);
      toast.error(`Scenario Rejected`, {
        description: `Reason: ${comment}`,
        duration: 6000,
      });
      setActiveItem("my-work:scenario");
    }
  };

  const handleApproveUDV = (id: string, comment: string) => {
    const udv = pendingUDV.find(u => u.id === id);
    if (udv) {
      const now = new Date().toISOString();
      setPendingUDV(prev => prev.filter(u => u.id !== id));
      setCustomUDV(prev => [{ ...udv, status: "Verified", category: "custom", statusNote: comment, lastModified: now }, ...prev]);
      toast.success("UDV Verified successfully");
      setActiveItem("udv-custom");
    }
  };

  const handleRejectUDV = (id: string, reason: string) => {
    const udv = pendingUDV.find(u => u.id === id);
    if (udv) {
      const now = new Date().toISOString();
      setPendingUDV(prev => prev.filter(u => u.id !== id));
      setDraftUDV(prev => [{ ...udv, status: "Rejected", statusNote: reason, category: "draft", lastModified: now }, ...prev]);
      toast.error(`UDV Rejected`, {
        description: `Reason: ${reason}`,
        duration: 6000,
      });
      setActiveItem("my-work:udv");
    }
  };

  const onApproveViewHandler = (id: string, comment: string) => {
    const view = pendingViews.find(v => v.id === id);
    if (view) {
      const now = new Date().toISOString();
      setPendingViews(prev => prev.filter(v => v.id !== id));
      setCustomViews(prev => [{ ...view, status: "Verified", category: "custom", statusNote: comment, lastModified: now }, ...prev]);
      toast.success("View Verified successfully");
      setActiveItem("views-management-views:custom");
    }
  };

  const onRejectViewHandler = (id: string, comment: string) => {
    const view = pendingViews.find(v => v.id === id);
    if (view) {
      const now = new Date().toISOString();
      setPendingViews(prev => prev.filter(v => v.id !== id));
      setDraftViews(prev => [{ ...view, status: "Rejected", statusNote: comment, category: "draft", lastModified: now }, ...prev]);
      toast.error("View Rejected");
      setActiveItem("my-work:view");
    }
  };

  const handleRejectVirtualEnv = (id: string, comment: string) => {
    const env = pendingVirtualEnvs.find(v => v.id === id);
    if (env) {
      const now = new Date().toISOString();
      setPendingVirtualEnvs(prev => prev.filter(v => v.id !== id));
      setDraftVirtualEnvs(prev => [{ ...env, status: "Rejected", statusNote: comment, category: "draft", lastModified: now }, ...prev]);
      toast.error("Virtual SE Rejected");
      setActiveItem("my-work:virtual-se");
    }
  };

  const handleNavigateToVerifyScenario = (id: string) => {
    setActiveItem(`scenarios-verify-${id}`);
  };

  const handleCreateScenario = (data: any) => {
    const isDraft = data.status === "Draft";
    
    if (data.id) {
      // Logic for editing an existing scenario
      const isExistingPending = pendingScenarios.some(s => s.id === data.id);
      
      const updatedScenario: ScenarioItem = {
        id: data.id,
        name: data.name,
        workspace: data.workspace,
        group: data.group,
        status: data.status === "Draft" ? "Draft" : "Pending Approval",
        hits: data.hits || "0",
        performance: data.performance || 0,
        description: data.description || "No description provided",
        category: data.category || "General",
        riskWeight: data.riskWeight || 50,
        lastModified: new Date().toISOString(),
        createdBy: username,
        createdOn: data.createdOn || new Date().toISOString().slice(0, 10)
      };

      if (isExistingPending) {
        setPendingScenarios(prev => prev.map(s => s.id === data.id ? updatedScenario : s));
      } else {
        setScenarios(prev => prev.filter(s => s.id !== data.id));
        if (isDraft) {
          setScenarios(prev => [updatedScenario, ...prev]);
        } else {
          setPendingScenarios(prev => [updatedScenario, ...prev]);
        }
      }
      toast.success(isDraft ? "Draft updated" : "Scenario updated and sent for re-verification");
    } else {
      const newScenario: ScenarioItem = {
        id: `SCN-${Math.floor(1000 + Math.random() * 9000)}`,
        name: data.name,
        workspace: data.workspace,
        group: data.group,
        status: data.status === "Draft" ? "Draft" : "Pending Approval",
        hits: "0",
        performance: 0,
        description: data.description || "No description provided",
        category: data.category || "General",
        riskWeight: data.riskWeight || 50,
        lastModified: new Date().toISOString(),
        createdBy: username,
        createdOn: new Date().toISOString().slice(0, 10)
      };
      
      if (isDraft) {
        setScenarios(prev => [newScenario, ...prev]);
        toast.success("Scenario saved as draft");
      } else {
        setPendingScenarios(prev => [newScenario, ...prev]);
        toast.success("Scenario created and sent for verification");
      }
    }
    
    if (isDraft) {
      setActiveItem(`my-work:scenario`);
    } else {
      setActiveItem(`pending-verification-main:scenario`);
    }
  };

  const handleCreateUDV = (data: any) => {
    const now = new Date().toISOString();
    const dateStr = now.slice(0, 10);
    if (data.id) {
      const updatedUdv = { ...data, category: "pending", status: "Pending Approval", lastModified: now };
      setDraftUDV(prev => prev.filter(u => u.id !== data.id));
      setCustomUDV(prev => prev.filter(u => u.id !== data.id));
      setPendingUDV(prev => [updatedUdv, ...prev.filter(u => u.id !== data.id)]);
      toast.success("UDV updated and sent for verification");
    } else {
      const newUdv = { 
        ...data, 
        id: `UDV-${Math.floor(1000 + Math.random() * 9000)}`, 
        category: "pending", 
        status: "Pending Approval",
        createdOn: dateStr,
        lastModified: now
      };
      setPendingUDV(prev => [newUdv, ...prev]);
      toast.success("Custom UDV created and sent for verification");
    }
    setActiveItem(`pending-verification-main:udv`);
  };

  const handleSaveUDVDraft = (data: any) => {
    const now = new Date().toISOString();
    const dateStr = now.slice(0, 10);
    if (data.id) {
      const updatedUdv = { ...data, category: "draft", status: "Draft", lastModified: now };
      setDraftUDV(prev => [updatedUdv, ...prev.filter(u => u.id !== data.id)]);
      toast.success("UDV draft updated");
    } else {
      const newUdv = { 
        ...data, 
        id: `UDV-DFT-${Math.floor(1000 + Math.random() * 9000)}`, 
        category: "draft", 
        status: "Draft",
        createdOn: dateStr,
        lastModified: now
      };
      setDraftUDV(prev => [newUdv, ...prev]);
      toast.success("UDV saved as draft");
    }
    setActiveItem(`my-work:${data.artifactType || 'udv'}`);
  };

  const handleCreateEvent = (data: any) => {
    const isDraft = data.status === "Draft";
    const now = new Date().toISOString();
    
    const newEvent = {
       ...data,
       id: data.id || `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
       status: isDraft ? "Draft" : "Pending Approval",
       category: isDraft ? "draft" : "pending",
       date: now.slice(0, 10),
       lastModified: now
    };

    if (isDraft) {
      setDraftEvents(prev => [newEvent, ...prev.filter(e => e.id !== newEvent.id)]);
      toast.success("Event saved as draft");
      setActiveItem(`my-work:event`);
    } else {
      setPendingEvents(prev => [newEvent, ...prev.filter(e => e.id !== newEvent.id)]);
      setDraftEvents(prev => prev.filter(e => e.id !== newEvent.id));
      toast.success("Event created and sent for verification");
      setActiveItem(`pending-verification-main:event`);
    }
  };

  const handleCreateView = (data: any) => {
    const isDraft = data.status === "Draft";
    const now = new Date().toISOString();
    
    const newView: ViewItem = {
      ...data,
      id: data.id || `VIEW-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      viewType: "Custom",
      sourceTable: data.sourceTable,
      conditions: data.conditions || "None",
      scenarioCount: 0,
      status: isDraft ? "Draft" : "Pending Approval",
      createdBy: username,
      createdOn: now.slice(0, 10),
      lastModified: now
    };

    if (isDraft) {
      setDraftViews(prev => [newView, ...prev.filter(v => v.id !== newView.id)]);
      toast.success("View saved as draft");
      setActiveItem(`my-work:view`);
    } else {
      setPendingViews(prev => [newView, ...prev.filter(v => v.id !== newView.id)]);
      setDraftViews(prev => prev.filter(v => v.id !== newView.id));
      toast.success("Custom View created and sent for verification");
      setActiveItem(`pending-verification-main:view`);
    }
  };

  const handleSaveViewDraft = (data: any) => {
    handleCreateView({ ...data, status: "Draft" });
  };

  const handleSubmitKeyConfiguration = (data: any) => {
    const now = new Date().toISOString();
    
    // Generate description from changes
    const changesSummary = data.changes && data.changes.length > 0 
      ? data.changes.join("; ")
      : "Configuration updated";
    
    // Convert actionItems to fieldChanges format for consistency
    const fieldChanges = data.actionItems?.map((action: any) => ({
      name: action.title,
      status: action.tag,
      description: action.description
    })) || [];
    
    const newWorkspaceConfig = {
      ...data,
      id: `WS-KEY-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${data.workspace?.name || "Unknown Workspace"} - Key Config`,
      workspaceName: data.workspace?.name || "Unknown Workspace",
      type: data.keyType === "default" ? "Default Key" : "Conditional Key",
      description: changesSummary,
      fieldChanges: fieldChanges,
      date: now.slice(0, 10),
      lastModified: now,
      submittedBy: "Current User",
      submittedAt: now,
      status: "Pending Approval",
      category: "pending"
    };
    
    setPendingWorkspaces(prev => [newWorkspaceConfig, ...prev]);
    toast.success("Key configuration submitted for verification");
  };

  const handleSubmitSettings = (data: any) => {
    const now = new Date().toISOString();
    
    // Generate description from changes
    const changesSummary = data.changes && data.changes.length > 0 
      ? data.changes.join("; ")
      : "Settings updated";
    
    // Convert actionItems to fieldChanges format for consistency
    const fieldChanges = data.actionItems?.map((action: any) => ({
      name: action.title,
      status: action.tag,
      description: action.description
    })) || [];
    
    const newSettingsConfig = {
      ...data,
      id: `WS-SET-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${data.workspace?.name || "Unknown Workspace"} - Settings`,
      workspaceName: data.workspace?.name || "Unknown Workspace",
      type: "Settings",
      description: changesSummary,
      fieldChanges: fieldChanges,
      date: now.slice(0, 10),
      lastModified: now,
      submittedBy: "Current User",
      submittedAt: now,
      status: "Pending Approval",
      category: "pending",
      artifactType: "settings"
    };
    
    setPendingSettings(prev => [newSettingsConfig, ...prev]);
    toast.success("Settings submitted for verification");
  };

  const handleDeleteDraft = (type: string, id: string) => {
    switch (type) {
      case "scenario": setScenarios(prev => prev.filter(s => s.id !== id)); break;
      case "event": setDraftEvents(prev => prev.filter(e => e.id !== id)); break;
      case "udv": setDraftUDV(prev => prev.filter(u => u.id !== id)); break;
      case "sec": setDraftSEC(prev => prev.filter(s => s.id !== id)); break;
      case "view": setDraftViews(prev => prev.filter(v => v.id !== id)); break;
      case "virtual-se": setDraftVirtualEnvs(prev => prev.filter(v => v.id !== id)); break;
    }
    toast.info("Draft deleted successfully");
  };

  const handleDeleteEvent = (id: string, tab: string) => {
    if (tab === "ootb") setOotbEvents(prev => prev.filter(e => e.id !== id));
    else if (tab === "custom") setCustomEvents(prev => prev.filter(e => e.id !== id));
    else if (tab === "draft") setDraftEvents(prev => prev.filter(e => e.id !== id));
    else if (tab === "pending") setPendingEvents(prev => prev.filter(e => e.id !== id));
    toast.info("Event deleted successfully");
  };

  const handleDeleteUDV = (id: string, tab: string) => {
    if (tab === "ootb") setOotbUDV(prev => prev.filter(u => u.id !== id));
    else if (tab === "custom") setCustomUDV(prev => prev.filter(u => u.id !== id));
    else if (tab === "draft") setDraftUDV(prev => prev.filter(u => u.id !== id));
    else if (tab === "pending") setPendingUDV(prev => prev.filter(u => u.id !== id));
    toast.info("Variable deleted successfully");
  };

  const handleDeleteSEC = (id: string, tab: string) => {
    if (tab === "ootb") setOotbSEC(prev => prev.filter(s => s.id !== id));
    else if (tab === "custom") {
      const sec = customSEC.find(s => s.id === id);
      if (sec && sec.status === "Active") {
        toast.error("Only Inactive SEC can be deleted");
        return;
      }
      setCustomSEC(prev => prev.filter(s => s.id !== id));
      toast.info("Control deleted successfully");
    }
  };

  const handleCreateSEC = (data: any) => {
    const isDraft = data.status === "Draft";
    const now = new Date().toISOString();
    const dateStr = now.slice(0, 10);
    
    const newSEC: SECItem = {
      ...data,
      id: data.id || `SEC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: isDraft ? "Draft" : "Pending Approval",
      category: isDraft ? "custom" : "custom", 
      linkedScenarios: 0,
      createdOn: dateStr,
      lastModifiedDate: now,
      lastModifiedBy: username,
    };

    if (isDraft) {
      setDraftSEC(prev => [newSEC, ...prev.filter(s => s.id !== newSEC.id)]);
      toast.success("SEC saved as draft");
      setActiveItem("my-work:sec");
    } else {
      setPendingSEC(prev => [newSEC, ...prev.filter(s => s.id !== newSEC.id)]);
      setDraftSEC(prev => prev.filter(s => s.id !== newSEC.id));
      toast.success("SEC created and sent for verification");
      setActiveItem("pending-verification-main:sec");
    }
  };

  const handleVerifySEC = (id: string, comment: string) => {
    const sec = pendingSEC.find(s => s.id === id);
    if (sec) {
      const verifiedSEC = { 
        ...sec, 
        status: "Active", 
        category: "custom",
        lastModifiedBy: username,
        lastModifiedDate: new Date().toISOString()
      };
      setCustomSEC(prev => [verifiedSEC, ...prev]);
      setPendingSEC(prev => prev.filter(s => s.id !== id));
      toast.success(`SEC "${sec.name}" verified and activated`);
      setActiveItem("sec-custom");
    }
  };

  const handleRejectSEC = (id: string, comment: string) => {
    const sec = pendingSEC.find(s => s.id === id);
    if (sec) {
      const rejectedSEC = { 
        ...sec, 
        status: "Inactive", 
        statusNote: comment,
        lastModifiedBy: username,
        lastModifiedDate: new Date().toISOString()
      };
      setDraftSEC(prev => [rejectedSEC, ...prev]);
      setPendingSEC(prev => prev.filter(s => s.id !== id));
      toast.error(`SEC "${sec.name}" rejected`);
      setActiveItem("my-work:sec");
    }
  };

  const handleApproveWorkspace = (id: string, comment: string) => {
    const workspace = pendingWorkspaces.find(w => w.id === id);
    if (workspace) {
      // Store the approved configuration mapped to the workspace name
      setApprovedWorkspaceConfigs(prev => ({
        ...prev,
        [workspace.workspaceName]: {
          ...workspace,
          approvedAt: new Date().toISOString(),
          approvedBy: username,
          approvalComment: comment
        }
      }));
      
      setPendingWorkspaces(prev => prev.filter(w => w.id !== id));
      toast.success(`Workspace configuration "${workspace.workspaceName}" approved and deployed`);
      // Redirect to Key Configuration page to show the latest approved changes
      setActiveItem("system-configuration-workspace-key-config");
    }
  };

  const handleRejectWorkspace = (id: string, comment: string) => {
    const workspace = pendingWorkspaces.find(w => w.id === id);
    if (workspace) {
      setPendingWorkspaces(prev => prev.filter(w => w.id !== id));
      toast.error(`Workspace configuration "${workspace.workspaceName}" rejected: ${comment}`);
      setActiveItem("pending-verification-main:workspace");
    }
  };

  const handleApproveSettings = (id: string, comment: string) => {
    const settings = pendingSettings.find(s => s.id === id);
    if (settings) {
      // Store the approved settings mapped to the workspace name
      setApprovedSettings(prev => ({
        ...prev,
        [settings.workspaceName]: {
          ...settings,
          approvedAt: new Date().toISOString(),
          approvedBy: username,
          approvalComment: comment
        }
      }));
      
      setPendingSettings(prev => prev.filter(s => s.id !== id));
      toast.success(`Settings for "${settings.workspaceName}" approved and deployed`);
      // Redirect to Settings page to show the latest approved changes
      setActiveItem("system-configuration-workspace-settings");
    }
  };

  const handleRejectSettings = (id: string, comment: string) => {
    const settings = pendingSettings.find(s => s.id === id);
    if (settings) {
      setPendingSettings(prev => prev.filter(s => s.id !== id));
      toast.error(`Settings for "${settings.workspaceName}" rejected: ${comment}`);
      setActiveItem("pending-verification-main:settings");
    }
  };

  const handleStatusChangeSEC = (id: string, newStatus: "Active" | "Inactive") => {
    setCustomSEC(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    toast.success(`Control is now ${newStatus}`);
  };

  const handleDeleteView = (id: string, tab: string) => {
    if (tab === "ootb") setOotbViews(prev => prev.filter(v => v.id !== id));
    else if (tab === "custom") setCustomViews(prev => prev.filter(v => v.id !== id));
    else if (tab === "draft") setDraftViews(prev => prev.filter(v => v.id !== id));
    else if (tab === "pending") setPendingViews(prev => prev.filter(v => v.id !== id));
    toast.info("View deleted successfully");
  };

  const handleDeleteVirtualEnv = (id: string, tab: string) => {
    if (tab === "ootb") setOotbVirtualEnvs(prev => prev.filter(v => v.id !== id));
    else if (tab === "custom") setCustomVirtualEnvs(prev => prev.filter(v => v.id !== id));
    else if (tab === "draft") setDraftVirtualEnvs(prev => prev.filter(v => v.id !== id));
    else if (tab === "pending") setPendingVirtualEnvs(prev => prev.filter(v => v.id !== id));
    toast.info("Environment terminated successfully");
  };

  const handleDuplicateScenario = (id: string) => {
    const original = scenarios.find(s => s.id === id) || pendingScenarios.find(s => s.id === id);
    if (original) {
      const newId = `SCN-${Math.floor(1000 + Math.random() * 9000)}`;
      const duplicate: ScenarioItem = {
        ...original,
        id: newId,
        name: `${original.name} (Copy)`,
        status: "Draft",
        hits: "0",
        lastModified: new Date().toISOString(),
        createdOn: new Date().toISOString().slice(0, 10)
      };
      setScenarios(prev => [duplicate, ...prev]);
      toast.success(`Duplicated scenario as ${duplicate.name}`);
    }
  };

  if (showTwoFactor && !isLoggedIn) return <ThemeProvider><TwoFactorAuth username={username} onVerify={() => setIsLoggedIn(true)} onBack={() => setShowTwoFactor(false)} /></ThemeProvider>;
  if (!isLoggedIn) return <ThemeProvider><LoginScreen onLogin={(user) => { setUsername(user); is2FAEnabled ? setShowTwoFactor(true) : setIsLoggedIn(true); }} /></ThemeProvider>;

  return (
    <ThemeProvider>
      <Toaster position="top-center" richColors />
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          <UnifiedSidebar 
            menuItems={menuItems} 
            activeItem={activeItem} 
            onSelect={setActiveItem} 
            isCollapsed={isSidebarCollapsed} 
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <ModernHeader 
              onLogout={handleLogout} 
              is2FAEnabled={is2FAEnabled} 
              onToggle2FA={handleToggle2FA} 
              username={username} 
              userRole={userRole} 
              isSidebarCollapsed={isSidebarCollapsed} 
              onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              searchableItems={[]}
              onModuleSelect={setActiveItem}
            />
            <main ref={mainContentRef} className="flex-1 flex flex-col overflow-hidden relative">
              <div className="h-full">
                {currentContent.type === "scenario-verify" ? (
                  <VerifyScenarioPage 
                    scenario={(currentContent as any).scenario}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBack={() => setActiveItem("pending-verification-main:scenario")}
                    onBreadcrumbNavigate={setActiveItem}
                    onApprove={handleApproveScenario}
                    onReject={handleRejectScenario}
                  />
                ) : currentContent.type === "event-verify" ? (
                  <VerifyEventPage 
                    event={(currentContent as any).event} 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBack={() => setActiveItem("pending-verification-main:event")} 
                    onBreadcrumbNavigate={setActiveItem}
                    onApprove={handleApproveEvent} 
                    onReject={handleRejectEvent} 
                  />
                ) : currentContent.type === "udv-verify" ? (
                  <VerifyUDVPage 
                    udv={{
                      id: (currentContent as any).udv?.id || "UDV-MOCK",
                      name: (currentContent as any).udv?.name || "Mock UDV Variable",
                      description: (currentContent as any).udv?.description || "Mock description for verification",
                      category: (currentContent as any).udv?.category || "Transaction",
                      changeType: (currentContent as any).udv?.changeType || "Logic Edit",
                      createdBy: (currentContent as any).udv?.createdBy || "Admin",
                      createdOn: (currentContent as any).udv?.createdOn || "2025-01-20",
                      logic: (currentContent as any).udv?.logic || "SELECT * FROM transactions WHERE amount > 1000",
                      dependencies: (currentContent as any).udv?.dependencies || ["Core Table: Transactions", "Lookup: High Risk Countries"],
                      config: (currentContent as any).udv?.config || {
                        method: "AGGREGATION",
                        targetField: "transaction_amount",
                        timePeriod: "90 days",
                        channel: "Online",
                        amount: "> 1000"
                      }
                    }}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBack={() => setActiveItem("pending-verification-main:udv")}
                    onVerify={handleApproveUDV}
                    onReject={handleRejectUDV}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "sec-verify" ? (
                  <VerifySECPage 
                    sec={(currentContent as any).sec} 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBack={() => setActiveItem("pending-verification-main:sec")} 
                    onBreadcrumbNavigate={setActiveItem}
                    onVerify={handleVerifySEC} 
                    onReject={handleRejectSEC} 
                  />
                ) : currentContent.type === "view-verify" ? (
                  <VerifyViewPage 
                    view={(currentContent as any).view} 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBack={() => setActiveItem("pending-verification-main:view")} 
                    onBreadcrumbNavigate={setActiveItem}
                    onApprove={onApproveViewHandler} 
                    onReject={onRejectViewHandler} 
                  />
                ) : currentContent.type === "workspace-verify" ? (
                  <VerifyWorkspacePage 
                    workspace={(currentContent as any).workspace} 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBack={() => setActiveItem("pending-verification-main:workspace")} 
                    onBreadcrumbNavigate={setActiveItem}
                    onApprove={handleApproveWorkspace} 
                    onReject={handleRejectWorkspace} 
                  />
                ) : currentContent.type === "settings-verify" ? (
                  <VerifySettingsPage 
                    settings={(currentContent as any).settings} 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBack={() => setActiveItem("pending-verification-main:settings")} 
                    onBreadcrumbNavigate={setActiveItem}
                    onApprove={handleApproveSettings} 
                    onReject={handleRejectSettings} 
                  />
                ) : currentContent.type === "request-confirmation" ? (
                  <RequestConfirmationPage
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "response-confirmation" ? (
                  <ResponseConfirmationPage
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "supervisor" ? (
                  <SupervisorPage
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "sentinel-settings" ? (
                  <SettingsPage
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "placeholder-message" ? (
                  <div className="flex flex-col h-full bg-white">
                    <PageHeader
                      title={(currentContent as any).message.split(" page")[0]}
                      breadcrumbs={currentContent.breadcrumbs}
                      onBreadcrumbNavigate={setActiveItem}
                    />
                    <div className="flex-1 p-8 flex items-center justify-center">
                      <div className="max-w-md w-full p-12 border border-dashed border-gray-300 rounded-lg text-center space-y-4">
                        <Settings size={48} className="mx-auto text-gray-300" />
                        <p className="text-[16px] text-[#525252]">{(currentContent as any).message}</p>
                      </div>
                    </div>
                  </div>
                ) : currentContent.type === "pending-verification-unified" ? (
                  <PendingVerificationPage 
                    scenarios={pendingScenarios}
                    events={pendingEvents}
                    udvs={pendingUDV}
                    secs={pendingSEC}
                    views={pendingViews}
                    virtualEnvs={pendingVirtualEnvs}
                    workspaces={pendingWorkspaces}
                    settings={pendingSettings}
                    initialTab={(currentContent as any).initialTab}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onVerifyScenario={handleNavigateToVerifyScenario}
                    onRejectScenario={handleRejectScenario}
                    onVerifyEvent={(id) => setActiveItem(`events-verify-${id}`)}
                    onRejectEvent={handleRejectEvent}
                    onVerifyUDV={(id) => setActiveItem(`udv-verify-${id}`)}
                    onVerifySEC={(id) => setActiveItem(`sec-verify-${id}`)}
                    onVerifyView={(id) => setActiveItem(`views-verify-${id}`)}
                    onVerifyVirtualEnv={(id) => toast.info(`Virtual SE ${id} verification coming soon`)}
                    onVerifyWorkspace={(id) => setActiveItem(`workspace-verify-${id}`)}
                    onRejectWorkspace={(id, comment) => {
                      setPendingWorkspaces(prev => prev.filter(w => w.id !== id));
                      toast.error(`Workspace configuration rejected: ${comment}`);
                    }}
                    onVerifySettings={(id) => setActiveItem(`settings-verify-${id}`)}
                    onRejectSettings={(id, comment) => {
                      setPendingSettings(prev => prev.filter(s => s.id !== id));
                      toast.error(`Settings rejected: ${comment}`);
                    }}
                    onRejectUDV={handleRejectUDV}
                    onRejectSEC={handleRejectSEC}
                    onRejectView={onRejectViewHandler}
                    onRejectVirtualEnv={handleRejectVirtualEnv}
                  />
                ) : currentContent.type === "event-details" ? (
                  <EventDetailsPage 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBreadcrumbNavigate={setActiveItem} 
                    event={(currentContent as any).event} 
                    onSubmit={handleCreateEvent}
                  />
                ) : currentContent.type === "events-inventory" ? (
                  <EventsPage 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBreadcrumbNavigate={setActiveItem} 
                    initialTab={(currentContent as any).initialTab}
                    ootbEvents={ootbEvents}
                    customEvents={customEvents}
                    draftEvents={draftEvents}
                    pendingEvents={pendingEvents}
                    onDeleteEvent={handleDeleteEvent}
                  />
                ) : currentContent.type === "create-udv" ? (
                  <CreateUDVPage 
                    key={(currentContent as any).initialData?.id || "new-udv"}
                    onBack={() => setActiveItem("udv")} 
                    onSave={handleCreateUDV} 
                    onSaveDraft={handleSaveUDVDraft}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    title={(currentContent as any).title}
                    initialData={(currentContent as any).initialData}
                  />
                ) : currentContent.type === "sec-details" ? (
                  <ViewSECPage 
                    sec={(currentContent as any).sec}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onBack={() => setActiveItem("sec")}
                    onEdit={(id) => setActiveItem(`sec-edit-${id}`)}
                    onStatusChange={handleStatusChangeSEC}
                  />
                ) : currentContent.type === "udv-inventory" ? (
                  <UDVPage 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBreadcrumbNavigate={setActiveItem} 
                    initialTab={(currentContent as any).initialTab}
                    ootbUDV={ootbUDV}
                    customUDV={customUDV}
                    draftUDV={draftUDV}
                    pendingUDV={pendingUDV}
                    onDeleteUDV={handleDeleteUDV}
                  />
                ) : currentContent.type === "sec-inventory" ? (
                  <SECPage 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBreadcrumbNavigate={setActiveItem} 
                    initialTab={(currentContent as any).initialTab}
                    ootbSEC={ootbSEC}
                    customSEC={customSEC}
                    onDeleteSEC={handleDeleteSEC}
                    onStatusChangeSEC={handleStatusChangeSEC}
                  />
                ) : currentContent.type === "create-sec" ? (
                  <CreateSECPage 
                    onCancel={() => setActiveItem("sec-custom")}
                    onSubmit={handleCreateSEC}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    customEvents={customEvents}
                  />
                ) : currentContent.type === "sec-edit" ? (
                  <CreateSECPage 
                    initialData={(currentContent as any).sec}
                    onCancel={() => setActiveItem("sec-custom")}
                    onSubmit={handleCreateSEC}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    customEvents={customEvents}
                  />
                ) : currentContent.type === "lookup-tables" ? (
                  <LookupTablesPage 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBreadcrumbNavigate={setActiveItem} 
                    initialTab={(currentContent as any).initialTab}
                  />
                ) : currentContent.type === "core-tables" ? (
                  <CoreTablesPage 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBreadcrumbNavigate={setActiveItem}
                    onBack={() => setActiveItem("views-management")}
                  />
                ) : currentContent.type === "core-tables-view" ? (
                  <CoreTableEntryView 
                    type={(currentContent as any).entryType}
                    entryId={(currentContent as any).entryId}
                    onBack={() => setActiveItem("views-management-core-tables")}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "lookup-create" ? (
                  <CreateWhitelistEntryPage 
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onBack={() => setActiveItem(`views-management-lookup-tables:${(currentContent as any).parentTab}`)}
                    parentTab={(currentContent as any).parentTab}
                  />
                ) : currentContent.type === "lookup-bulk-upload" ? (
                  <BulkUploadPage 
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onBack={() => setActiveItem(`views-management-lookup-tables:${(currentContent as any).parentTab}`)}
                  />
                ) : currentContent.type === "lookup-edit" ? (
                  <EditWhitelistEntryPage 
                    initialData={(currentContent as any).entry}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onBack={() => setActiveItem(`views-management-lookup-tables:${(currentContent as any).parentTab}`)}
                    parentTab={(currentContent as any).parentTab}
                  />
                ) : currentContent.type === "lookup-details" ? (
                  <LookupTableEntryView 
                    entryId={(currentContent as any).entry?.id}
                    onBack={() => setActiveItem(`views-management-lookup-tables:${(currentContent as any).parentTab}`)}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "views-inventory" ? (
                  <ViewsPage 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBreadcrumbNavigate={setActiveItem} 
                    initialTab={(currentContent as any).initialTab}
                    ootbViews={ootbViews}
                    customViews={customViews}
                    draftViews={draftViews}
                    pendingViews={pendingViews}
                    onDeleteView={handleDeleteView}
                  />
                ) : currentContent.type === "create-view" ? (
                  <CreateViewPage 
                    onBack={() => setActiveItem(`views-management-views:${(currentContent as any).parentTab || 'ootb'}`)}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    title={(currentContent as any).title}
                    initialData={(currentContent as any).initialData}
                    readOnly={(currentContent as any).readOnly}
                    onCreate={handleCreateView}
                    onSaveDraft={handleSaveViewDraft}
                  />
                ) : currentContent.type === "view-data" ? (
                  <div className="flex flex-col h-full bg-white">
                    <PageHeader 
                      title={`View Data: ${(currentContent as any).view?.name}`}
                      breadcrumbs={currentContent.breadcrumbs}
                      onBack={() => setActiveItem("views-management-views")}
                      onBreadcrumbNavigate={setActiveItem}
                    />
                    <div className="flex-1 p-8 overflow-auto">
                      <div className="bg-[#F4F4F4] border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-4">
                        <DataTable size={64} className="text-gray-300" />
                        <div className="space-y-1">
                          <h3 className="text-[18px] font-bold text-[#161616]">Dynamic View Data Preview</h3>
                          <p className="text-[14px] text-gray-500 max-w-[500px]">
                            Displaying live records from <strong>{(currentContent as any).view?.sourceTable}</strong> using configuration: 
                            <code className="block mt-2 p-2 bg-gray-100 rounded text-[12px] font-mono text-[#2A53A0]">{(currentContent as any).view?.conditions}</code>
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveItem(`views-management-views:config-${(currentContent as any).view?.id}`)}
                          className="mt-4 border-[#2A53A0] text-[#2A53A0] hover:bg-[#edf5ff]"
                        >
                          View Configuration
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : currentContent.type === "virtual-se-inventory" ? (
                  <VirtualSEPage 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBreadcrumbNavigate={setActiveItem} 
                    initialTab={(currentContent as any).initialTab}
                    ootbVirtualEnvs={ootbVirtualEnvs}
                    customVirtualEnvs={customVirtualEnvs}
                    draftVirtualEnvs={draftVirtualEnvs}
                    pendingVirtualEnvs={pendingVirtualEnvs}
                    onDeleteEnv={handleDeleteVirtualEnv}
                  />
                ) : currentContent.type === "templates" ? (
                  <TemplatesPage 
                    breadcrumbs={currentContent.breadcrumbs} 
                    onBreadcrumbNavigate={setActiveItem} 
                    onView={(id) => setActiveItem(`scenarios-templates-view-${id}`)}
                    onUse={(id) => setActiveItem(`scenarios-templates-use-${id}`)}
                  />
                ) : currentContent.type === "scenarios-dashboard" ? (
                  <div className="flex flex-col h-full bg-white overflow-hidden relative">
                    <PageHeader 
                      title="Scenarios Dashboard" 
                      breadcrumbs={currentContent.breadcrumbs} 
                      onBreadcrumbNavigate={setActiveItem} 
                    />
                    <div ref={mainContentRef} className="flex-1 p-4 overflow-auto hover-scroll">
                      <ScenariosDashboard />
                    </div>
                    <ScrollToBottomButton scrollRef={mainContentRef} />
                  </div>
                ) : currentContent.type === "scenario-list" ? (
                  <ScenarioListPage 
                    scenarios={scenarios}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onBasedOnTemplate={() => setActiveItem("scenarios-templates")}
                    onViewScenario={(id) => setActiveItem(`scenarios-view-${id}`)}
                    onEditScenario={(id) => setActiveItem(`scenarios-edit-${id}`)}
                    onDuplicateScenario={handleDuplicateScenario}
                    onNewScenario={() => {
                      setScenarioCreationData(null);
                      setActiveItem("scenarios-create-scenario");
                    }}
                  />
                ) : currentContent.type === "scenario-view" ? (
                  <ViewScenarioPage 
                    scenario={(currentContent as any).scenario}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onEdit={(id) => setActiveItem(`scenarios-edit-${id}`)}
                    onBack={() => setActiveItem("scenarios-scenario-list")}
                  />
                ) : currentContent.type === "template-details" ? (
                  <TemplateDetailsPage 
                    template={(currentContent as any).template}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onBack={() => setActiveItem("scenarios-templates")}
                  />
                ) : currentContent.type === "template-use" ? (
                  <TemplateUsePage 
                    template={(currentContent as any).template}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onBack={() => setActiveItem("scenarios-templates")}
                    onCreateScenario={(template, config) => {
                      setScenarioCreationData({ template, config });
                      setActiveItem("scenarios-create-scenario");
                    }}
                  />
                ) : currentContent.type === "create-scenario" ? (
                  <CreateScenarioPage
                    template={(currentContent as any).template}
                    config={(currentContent as any).config}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onCancel={() => {
                      const config = (currentContent as any).config;
                      setScenarioCreationData(null);
                      if (config?.status === "Draft") {
                        setActiveItem("my-work:scenario");
                      } else {
                        setActiveItem("scenarios-scenario-list");
                      }
                    }}
                    onCreate={handleCreateScenario}
                  />
                ) : currentContent.type === "version-management" ? (
                  <VersionManagementPage 
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "create-event" ? (
                  <CreateEventPage 
                    title={(currentContent as any).title} 
                    initialEvent={(currentContent as any).initialData} 
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onCancel={() => {
                      const initialData = (currentContent as any).initialData;
                      if (initialData?.status === "Draft" || initialData?.status === "Drafted") {
                        setActiveItem("my-work:event");
                      } else {
                        setActiveItem("events");
                      }
                    }}
                    onSubmit={handleCreateEvent} 
                  />
                ) : currentContent.type === "create-udv" ? (
                  <CreateUDVPage 
                    initialData={(currentContent as any).initialData}
                    title={(currentContent as any).title}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onBack={() => {
                      const initialData = (currentContent as any).initialData;
                      if (initialData?.status === "Draft") {
                        setActiveItem("my-work:udv");
                      } else {
                        setActiveItem("udv");
                      }
                    }}
                    onSave={handleCreateUDV}
                    onSaveDraft={handleSaveUDVDraft}
                  />
                ) : currentContent.type === "view-udv" ? (
                  <ViewUDVPage
                    udv={(currentContent as any).udv}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onEdit={(id) => setActiveItem(`udv-edit-${id}`)}
                    onClose={() => setActiveItem("udv")}
                  />
                ) : currentContent.type === "my-work" ? (
                  <MyWorkPage 
                    draftScenarios={[...scenarios, ...pendingScenarios]}
                    draftEvents={[...draftEvents, ...pendingEvents, ...customEvents]}
                    draftUDV={[...draftUDV, ...pendingUDV, ...customUDV]}
                    draftSEC={[...draftSEC, ...pendingSEC, ...customSEC]}
                    draftViews={[...draftViews, ...pendingViews, ...customViews]}
                    draftVirtualEnvs={[...draftVirtualEnvs, ...pendingVirtualEnvs, ...customVirtualEnvs]}
                    onSelectScenario={(id) => setActiveItem(`scenarios-edit-${id}`)}
                    onSelectEvent={(id) => setActiveItem(`events-edit-${id}`)}
                    onSelectUDV={(id) => setActiveItem(`udv-edit-${id}`)}
                    onSelectSEC={(id) => setActiveItem(`sec-edit-${id}`)}
                    onSelectView={(id) => setActiveItem(`views-management-views:edit-${id}`)}
                    onSelectVirtualEnv={(id) => setActiveItem(`virtual-se-edit-${id}`)}
                    onViewScenarioDetails={(currentContent as any).onViewScenarioDetails}
                    onViewEventDetails={(currentContent as any).onViewEventDetails}
                    onViewUDVDetails={(currentContent as any).onViewUDVDetails}
                    onViewSECDetails={(currentContent as any).onViewSECDetails}
                    onViewViewDetails={(currentContent as any).onViewViewDetails}
                    onDeleteDraft={handleDeleteDraft}
                    initialTab={(currentContent as any).initialTab}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "efm-dashboard" ? (
                  <EFMDashboardPage
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "cases-page" ? (
                  <CasesPage
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onCaseClick={(id) => setActiveItem(`case-detail-${id}`)}
                  />
                ) : currentContent.type === "case-detail" ? (
                  <CaseDetailPage
                    caseId={(currentContent as any).caseId}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onAlertClick={(id) => setActiveItem(`alert-detail-${id}`)}
                  />
                ) : currentContent.type === "alert-detail" ? (
                  <AlertDetailPage
                    alertId={(currentContent as any).alertId}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "alerts-page" ? (
                  <AlertsPage
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "dashboard" ? (
                  <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <DashboardOverview username={username} breadcrumbs={currentContent.breadcrumbs} onBreadcrumbNavigate={setActiveItem} />
                  </div>
                ) : currentContent.type === "workspace-management" ? (
                  <WorkspaceManagementPage 
                    onBreadcrumbNavigate={setActiveItem}
                    onViewWorkspace={(id) => toast.info(`Viewing workspace ${id}`)}
                    onConfigWorkspace={(id) => setActiveItem("system-configuration-workspace-key-config")}
                    onSettingsWorkspace={(id) => setActiveItem("system-configuration-workspace-settings")}
                    breadcrumbs={currentContent.breadcrumbs}
                    approvedConfigs={approvedWorkspaceConfigs}
                  />
                ) : currentContent.type === "workspace-key-config" ? (
                  <KeyConfigurationView 
                    workspaces={INITIAL_WORKSPACE_DATA} 
                    approvedConfigs={approvedWorkspaceConfigs}
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    onSubmit={handleSubmitKeyConfiguration}
                  />
                ) : currentContent.type === "workspace-settings" ? (
                  <SettingsTabView 
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                    workspaces={INITIAL_WORKSPACE_DATA}
                    approvedSettings={approvedSettings}
                    onSubmit={handleSubmitSettings}
                  />
                ) : currentContent.type === "group-management" ? (
                  <GroupManagementPage 
                    onBreadcrumbNavigate={setActiveItem}
                    breadcrumbs={currentContent.breadcrumbs}
                  />
                ) : currentContent.type === "dashboard-config" ? (
                  <DashboardConfigPage 
                    onBreadcrumbNavigate={setActiveItem}
                    breadcrumbs={currentContent.breadcrumbs}
                  />
                ) : currentContent.type === "system-config" ? (
                  <SystemConfigPage 
                    onBreadcrumbNavigate={setActiveItem}
                    breadcrumbs={currentContent.breadcrumbs}
                  />
                ) : currentContent.type === "settings-events" ? (
                  <SettingsEventsPage 
                    breadcrumbs={currentContent.breadcrumbs}
                    onBreadcrumbNavigate={setActiveItem}
                  />
                ) : currentContent.type === "module" ? (
                  <ModuleContent {...currentContent} onBreadcrumbNavigate={setActiveItem} />
                ) : <DashboardOverview username={username} breadcrumbs={currentContent.breadcrumbs} onBreadcrumbNavigate={setActiveItem} />}
              </div>
            </main>
          </div>
        </div>
        {isLoggedIn && !['create-view', 'lookup-details', 'core-table-view', 'core-tables-view', 'scenario-view', 'template-details', 'view-udv', 'event-details', 'verify-scenario', 'verify-event', 'udv-verify', 'sec-verify', 'workspace-verify'].includes(currentContent.type) && <AppFooter />}
        {(currentContent.type === "scenarios-dashboard" || currentContent.type === "dashboard") && (
          null
        )}
      </div>
    </ThemeProvider>
  );
}
