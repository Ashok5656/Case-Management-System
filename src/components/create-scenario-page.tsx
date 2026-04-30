import React, { useState, useEffect, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "./ui/dialog";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "./ui/popover";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { 
  Checkmark,
  CheckmarkFilled
} from "@carbon/icons-react";
import { 
  ChevronDown, 
  ChevronRight,
  ArrowLeft,
  Info, 
  Settings, 
  Plus, 
  Copy, 
  Zap, 
  MessageSquare, 
  Play, 
  Save, 
  Send, 
  Clock, 
  RefreshCw,
  Type,
  Bold,
  Italic,
  Variable,
  AlertCircle,
  FileText,
  Activity,
  Edit2,
  Trash2,
  X,
  Layers,
  Database,
  Link,
  Search,
  Check,
  Minus,
  AlertTriangle,
  Eye,
  CreditCard,
  User,
  Folder,
  Trash,
  Lock
} from "lucide-react";
import PageHeader from "./page-header";
import { TemplateItem } from "./templates-page";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "./ui/select";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "./ui/utils";
import { motion, AnimatePresence } from "motion/react";
import { RdaResponseModal } from "./rda-response-modal";
import { ApiCallModal } from "./api-call-modal";
import { TableInsertModal } from "./table-insert-modal";

interface CreateScenarioPageProps {
  template?: TemplateItem;
  config?: any;
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
  onCancel: () => void;
  onCreate?: (scenario: any) => void;
}

const ENTITY_LIST = [
  "Customer",
  "Account",
  "Card",
  "Non-Customer",
  "Beneficiary",
  "Transaction",
  "Payment Card",
  "Merchant",
  "Device",
  "Channel",
  "External Entity"
];

const GROUP_LIST = ["EFM", "AML", "Compliance", "Risk", "Operations"];

const MESSAGE_TEMPLATES = [
  {
    title: "High Value Transaction",
    content: "Alert: High-value transaction of {CurrentEvent.amount:currency} at {CurrentEvent.timestamp}"
  },
  {
    title: "Velocity Alert",
    content: "Alert: {COUNT_LOGIN_24H} logins in last 24 hours for customer. Current event: {CurrentEvent.id}"
  },
  {
    title: "Threshold Breach",
    content: "Transaction amount {CurrentEvent.amount:currency} exceeds the configured threshold."
  }
];

const VARIABLE_CATEGORIES = [
  {
    name: "Current Event",
    count: 4,
    icon: Zap,
    items: [
      { name: "CurrentEvent.amount", value: "15000.50" },
      { name: "CurrentEvent.merchant_name", value: "ABC Store" },
      { name: "CurrentEvent.timestamp", value: "2024-12-17 14:32:15" },
      { name: "CurrentEvent.channel", value: "ATM" }
    ]
  },
  {
    name: "IPV Variables",
    count: 2,
    icon: Activity,
    items: [
      { name: "IPV.risk_score", value: "88" },
      { name: "IPV.trust_level", value: "High" }
    ]
  },
  {
    name: "Custom Queries",
    count: 1,
    icon: Search,
    items: [
      { name: "Query.Last_30D_Total", value: "4500.00" }
    ]
  },
  {
    name: "Bank Parameters",
    count: 2,
    icon: Settings,
    items: [
      { name: "Param.Max_Daily", value: "20000" },
      { name: "Param.Region_Code", value: "EU" }
    ]
  }
];

const CATEGORY_OPTIONS = [
  { label: "Variables", icon: Variable, color: "text-purple-500", bgColor: "bg-purple-50" },
  { label: "Current Event", icon: Activity, color: "text-blue-500", bgColor: "bg-blue-50" },
  { label: "Virtual Event", icon: Zap, color: "text-teal-500", bgColor: "bg-teal-50" },
  { label: "Views", icon: Eye, color: "text-green-500", bgColor: "bg-green-50" },
  { label: "Queries", icon: Search, color: "text-orange-500", bgColor: "bg-orange-50" },
  { label: "Bank Parameters", icon: Settings, color: "text-gray-500", bgColor: "bg-gray-50" }
];

const VARIABLES_DATA = [
  {
    group: "Variables",
    icon: Database,
    subgroups: [
      {
        name: "Account Variables",
        items: [
          { name: "balance", type: "Num" },
          { name: "age_days", type: "Num" },
          { name: "account_type", type: "Str" },
          { name: "currency", type: "Str" },
          { name: "status", type: "Str" },
        ]
      },
      {
        name: "Customer Variables",
        items: [
          { name: "risk_score", type: "Num" },
          { name: "kyc_status", type: "Str" },
          { name: "residence_country", type: "Str" },
        ]
      }
    ]
  },
  {
    group: "Events",
    icon: Activity,
    subgroups: [
      {
        name: "Transaction Data",
        items: [
          { name: "amount", type: "Num" },
          { name: "merchant_category", type: "Str" },
          { name: "channel", type: "Str" },
        ]
      }
    ]
  }
];

const OPERATORS_BY_TYPE: Record<string, string[]> = {
  "Num": [">", "<", ">=", "<=", "=", "!=", "BETWEEN", "IN", "NOT IN"],
  "Str": ["=", "!=", "CONTAINS", "STARTS WITH", "ENDS WITH", "IN", "NOT IN", "MATCHES REGEX"]
};

export function CreateScenarioPage({ template, config, breadcrumbs, onBreadcrumbNavigate, onCancel, onCreate }: CreateScenarioPageProps) {
  const isEditMode = !!config?.id;
  const [mode, setMode] = useState("Quick Mode");
  const [activeStep, setActiveStep] = useState(1);
  const STEPS = [
    { id: 1, label: "Definition", optional: false },
    { id: 2, label: "Precondition", optional: false },
    { id: 3, label: "Queries", optional: true },
    { id: 4, label: "Trigger", optional: false },
    { id: 5, label: "Message", optional: true },
    { id: 6, label: "Actions", optional: false },
    { id: 7, label: "Review", optional: false }
  ];
  const [workspace, setWorkspace] = useState(template?.workspace || "");
  const [triggeringEntity, setTriggeringEntity] = useState(config?.targetEntity || template?.workspace || "");
  const [scenarioName, setScenarioName] = useState(template ? `${template.name}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}` : "");
  const [group, setGroup] = useState(template ? "EFM" : "");
  const [description, setDescription] = useState(template?.description || "");
  const [riskWeight, setRiskWeight] = useState(template ? 50 : 0);
  const [batchAlert, setBatchAlert] = useState(template ? true : false);
  const [frequency, setFrequency] = useState("Daily");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const [shadowMode, setShadowMode] = useState(false);
  const [rdaMode, setRdaMode] = useState(false);
  const [conditionType, setConditionType] = useState("Simple");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [variableSearch, setVariableSearch] = useState("");
  const [message, setMessage] = useState(template ? (config?.alert || "Alert: Transaction of {currentEvent.amount:currency} detected at {currentEvent.merchant_name}. Total last 7 days: {SUM_TXN_7D:currency}") : "");
  const [isSaved, setIsSaved] = useState(true);
  const [isTestingPerformance, setIsTestingPerformance] = useState(false);
  const [performanceResults, setPerformanceResults] = useState<{ hitRate: string; alertsPerDay: string; truePositive: string } | null>(null);

  const [conditions, setConditions] = useState<any[]>([]);
  const [queryConditions, setQueryConditions] = useState<any[]>([]);
  const [triggerConditions, setTriggerConditions] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  
  const [queryConditionType, setQueryConditionType] = useState("Simple");
  const [triggerConditionType, setTriggerConditionType] = useState("Simple");
  const [expressionValue, setExpressionValue] = useState("amount > 5000 AND risk_score >= 80");
  const [queryExpressionValue, setQueryExpressionValue] = useState("");
  const [triggerExpressionValue, setTriggerExpressionValue] = useState("");

  const filteredVariables = useMemo(() => {
    const search = (variableSearch || "").toLowerCase();
    if (!search) return VARIABLES_DATA;
    return VARIABLES_DATA.map(group => ({
      ...group,
      subgroups: (group.subgroups || []).map(sub => ({
        ...sub,
        items: (sub.items || []).filter(item => 
          item && item.name && item.name.toLowerCase().includes(search)
        )
      })).filter(sub => sub.items && sub.items.length > 0)
    })).filter(group => group.subgroups && group.subgroups.length > 0);
  }, [variableSearch]);

  // Mock template conditions and actions

  const isFormValid = useMemo(() => {
    return (
      workspace !== "" &&
      triggeringEntity !== "" &&
      scenarioName !== "" &&
      group !== "" &&
      message !== ""
    );
  }, [workspace, triggeringEntity, scenarioName, group, message]);

  const isCurrentStepValid = useMemo(() => {
    switch (activeStep) {
      case 1: // Definition
        return !!(workspace && triggeringEntity && scenarioName && group);
      case 2: // Precondition
        return (conditionType === "Simple" ? (conditions.length > 0 && conditions.some(c => c.field !== "" || c.type === 'group')) : !!expressionValue);
      case 3: // Queries
        return true; // Optional
      case 4: // Trigger
        return (triggerConditionType === "Simple" ? (triggerConditions.length > 0 && triggerConditions.some(c => c.field !== "" || c.type === 'group')) : !!triggerExpressionValue);
      case 6: // Actions
        return actions.length > 0;
      default: // Steps 5 are optional, 7 is review
        return true;
    }
  }, [activeStep, workspace, triggeringEntity, scenarioName, group, conditions, queryConditions, triggerConditions, conditionType, triggerConditionType, expressionValue, triggerExpressionValue, actions]);

  const handleTestPerformance = () => {
    setIsTestingPerformance(true);
    setPerformanceResults(null);
    setTimeout(() => {
      setPerformanceResults({
        hitRate: (Math.random() * 0.8 + 0.1).toFixed(2) + "%",
        alertsPerDay: Math.floor(Math.random() * 40 + 10).toString(),
        truePositive: (Math.random() * 15 + 65).toFixed(1) + "%"
      });
      setIsTestingPerformance(false);
    }, 1500);
  };

  // Auto-populate logic when template or config (Edit Mode) changes
  useEffect(() => {
    setActiveStep(1); // Reset to first step when loading new config/template
    if (template) {
      setWorkspace(template.workspace);
      setTriggeringEntity(config?.targetEntity || template.workspace);
      setScenarioName(`${template.name}_INSTANCE_${Math.floor(Math.random() * 1000)}`);
      setDescription(template.description || "");
      setGroup("EFM");
      setRiskWeight(50);
      setBatchAlert(true);
      if (config?.alert) setMessage(config.alert);
      
      // Populate mock template conditions
      setConditions([
        { id: 'c1', field: 'TRANSACTION_AMOUNT', operator: 'GREATER_THAN', value: '5000', category: 'Amount', type: 'condition', valueType: 'Constant', nextLogic: 'AND' },
        { id: 'c2', field: 'TRANSACTION_COUNT_7D', operator: 'GREATER_THAN_EQUAL', value: '10', category: 'Velocity', type: 'condition', valueType: 'Constant', nextLogic: 'AND' },
        { id: 'c3', field: 'MERCHANT_RISK_SCORE', operator: 'GREATER_THAN', value: '75', category: 'Risk', type: 'condition', valueType: 'Constant', nextLogic: 'AND' }
      ]);

      setQueryConditions([
        { id: 'q1', field: 'residence_country', operator: 'IN', value: 'high_risk_list', category: 'Customer Variables', type: 'condition', valueType: 'Constant', nextLogic: 'AND' }
      ]);

      setTriggerConditions([
        { id: 't1', field: 'balance', operator: 'GREATER_THAN', value: '1000', category: 'Account Variables', type: 'condition', valueType: 'Constant', nextLogic: 'AND' }
      ]);

      // Populate mock template actions
      setActions([
        { id: 'a1', type: 'Generate Alert', priority: 'High', channel: 'Dashboard' },
        { id: 'a2', type: 'Email Notification', recipient: 'Compliance Team', frequency: 'Instant' }
      ]);
    } else if (config?.id) {
      // Edit Mode - Populate from existing scenario config
      setWorkspace(config.workspace || "");
      setTriggeringEntity(config.workspace || ""); // Usually match
      setScenarioName(config.name || "");
      setDescription(config.description || "");
      setGroup(config.group || "EFM");
      setRiskWeight(config.riskWeight || 0);
      setBatchAlert(true);
      setMessage(config.alertMessage || `Alert: ${config.name} triggered for {entity_id}`);
      
      // For editing, we usually have existing logic. If not in config, use mocks to look real.
      if (config.conditions) {
        setConditions(config.conditions);
      } else {
        setConditions([
          { id: 'ec1', field: 'TXN_AMOUNT', operator: 'GREATER_THAN', value: '10000', category: 'Amount', type: 'condition', valueType: 'Constant', nextLogic: 'AND' }
        ]);
      }
      
      if (config.queryConditions) {
        setQueryConditions(config.queryConditions);
      }
      
      if (config.triggerConditions) {
        setTriggerConditions(config.triggerConditions);
      } else {
        setTriggerConditions([
          { id: 'et1', field: 'account_status', operator: 'EQUALS', value: 'ACTIVE', category: 'Account Variables', type: 'condition', valueType: 'Constant', nextLogic: 'AND' }
        ]);
      }

      if (config.actions) {
        setActions(config.actions);
      } else {
        setActions([
          { id: 'ea1', type: 'Real-time Block', priority: 'Critical', channel: 'Decision Engine' },
          { id: 'ea2', type: 'Generate Alert', priority: 'High', channel: 'Dashboard' }
        ]);
      }
    } else {
      // Manual mode defaults
      setWorkspace("");
      setTriggeringEntity("");
      setScenarioName("");
      setDescription("");
      setGroup("");
      setRiskWeight(0);
      setBatchAlert(false);
      setMessage("");
      setConditions([
        {
          id: `cond-init-${Math.random().toString(36).substr(2, 9)}`,
          type: 'condition',
          field: '',
          fieldType: '',
          operator: '',
          value: '',
          valueType: 'Constant',
          category: '',
          nextLogic: 'AND'
        }
      ]);
      setQueryConditions([]);
      setTriggerConditions([
        {
          id: `trig-init-${Math.random().toString(36).substr(2, 9)}`,
          type: 'condition',
          field: '',
          fieldType: '',
          operator: '',
          value: '',
          valueType: 'Constant',
          category: '',
          nextLogic: 'AND'
        }
      ]);
      setActions([]);
    }
  }, [template, config]);

  const riskLabel = useMemo(() => {
    if (riskWeight === 0) return { label: "Not Set", color: "text-gray-400 bg-gray-50 border-gray-100" };
    if (riskWeight < 30) return { label: "Low Risk", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    if (riskWeight < 70) return { label: "Medium Risk", color: "text-amber-600 bg-amber-50 border-amber-100" };
    return { label: "High Risk", color: "text-rose-600 bg-rose-50 border-rose-100" };
  }, [riskWeight]);

  const getFieldType = (fieldName: string) => {
    for (const group of VARIABLES_DATA) {
      for (const sub of group.subgroups) {
        const item = sub.items.find(i => i.name === fieldName);
        if (item) return item.type;
      }
    }
    return "Str";
  };

  const handleAddCondition = (section: 'pre' | 'query' | 'trigger' = 'pre', field?: string, category?: string) => {
    const newCond = {
      id: `cond-${Math.random().toString(36).substr(2, 9)}`,
      type: 'condition',
      field: '',
      fieldType: '',
      operator: '',
      value: '',
      valueType: 'Constant',
      category: '',
      nextLogic: 'AND'
    };
    if (section === 'pre') setConditions(prev => [...prev, newCond]);
    else if (section === 'query') setQueryConditions(prev => [...prev, newCond]);
    else if (section === 'trigger') setTriggerConditions(prev => [...prev, newCond]);
    
    if (field) {
      setSelectedField("");
    }
  };

  const handleUpdateCondition = (section: 'pre' | 'query' | 'trigger' = 'pre', id: string, updates: any, parentId?: string) => {
    const applyUpdate = (items: any[]) => {
      return items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          // Reset downstream fields if upstream fields change
          if (updates.field) {
            const newType = getFieldType(updates.field);
            updatedItem.fieldType = newType;
            updatedItem.operator = OPERATORS_BY_TYPE[newType][0];
          }
          return updatedItem;
        }
        if (item.type === 'group' && item.items) {
          return { ...item, items: applyUpdate(item.items) };
        }
        return item;
      });
    };
    if (section === 'pre') setConditions(prev => applyUpdate(prev));
    else if (section === 'query') setQueryConditions(prev => applyUpdate(prev));
    else if (section === 'trigger') setTriggerConditions(prev => applyUpdate(prev));
  };

  const insertVariable = (section: 'pre' | 'query' | 'trigger' = 'pre', varName: string) => {
    if (section === 'pre') setExpressionValue(prev => prev + ` ${varName}`);
    else if (section === 'query') setQueryExpressionValue(prev => prev + ` ${varName}`);
    else if (section === 'trigger') setTriggerExpressionValue(prev => prev + ` ${varName}`);
  };

  const handleAddGroup = (section: 'pre' | 'query' | 'trigger' = 'pre') => {
    const newGroup = {
      id: `group-${Math.random().toString(36).substr(2, 9)}`,
      type: 'group',
      logic: 'AND',
      items: [
        {
          id: `cond-${Math.random().toString(36).substr(2, 9)}`,
          type: 'condition',
          field: '', // Start empty to force progressive disclosure
          fieldType: '',
          operator: '',
          value: '',
          valueType: 'Constant',
          category: '',
          nextLogic: 'AND'
        }
      ]
    };
    if (section === 'pre') setConditions(prev => [...prev, newGroup]);
    else if (section === 'query') setQueryConditions(prev => [...prev, newGroup]);
    else if (section === 'trigger') setTriggerConditions(prev => [...prev, newGroup]);
  };

  const handleAddGroupToGroup = (section: 'pre' | 'query' | 'trigger' = 'pre', groupId: string) => {
    const newGroup = {
      id: `group-${Math.random().toString(36).substr(2, 9)}`,
      type: 'group',
      logic: 'AND',
      items: []
    };
    
    const addToGroup = (items: any[]): any[] => {
      return items.map(item => {
        if (item.id === groupId && item.type === 'group') {
          return { ...item, items: [...item.items, newGroup] };
        }
        if (item.type === 'group' && item.items) {
          return { ...item, items: addToGroup(item.items) };
        }
        return item;
      });
    };
    
    if (section === 'pre') setConditions(prev => addToGroup(prev));
    else if (section === 'query') setQueryConditions(prev => addToGroup(prev));
    else if (section === 'trigger') setTriggerConditions(prev => addToGroup(prev));
  };

  const handleRemoveCondition = (section: 'pre' | 'query' | 'trigger' = 'pre', id: string, parentId?: string) => {
    const remover = (prev: any[]) => {
      if (!parentId) {
        return prev.filter(item => item.id !== id);
      } else {
        return prev.map(item => {
          if (item.id === parentId && item.type === 'group') {
            return { ...item, items: item.items.filter((sub: any) => sub.id !== id) };
          }
          return item;
        });
      }
    };
    if (section === 'pre') setConditions(prev => remover(prev));
    else if (section === 'query') setQueryConditions(prev => remover(prev));
    else if (section === 'trigger') setTriggerConditions(prev => remover(prev));
  };

  const handleAddConditionToGroup = (section: 'pre' | 'query' | 'trigger' = 'pre', groupId: string) => {
    const newCond = {
      id: `cond-${Math.random().toString(36).substr(2, 9)}`,
      type: 'condition',
      field: '',
      fieldType: '',
      operator: '',
      value: '',
      valueType: 'Constant',
      category: '',
      nextLogic: 'AND'
    };
    const adder = (prev: any[]) => prev.map(item => {
      if (item.id === groupId && item.type === 'group') {
        return { ...item, items: [...item.items, newCond] };
      }
      return item;
    });
    if (section === 'pre') setConditions(prev => adder(prev));
    else if (section === 'query') setQueryConditions(prev => adder(prev));
    else if (section === 'trigger') setTriggerConditions(prev => adder(prev));
  };

  const handleUpdateGroupLogic = (section: 'pre' | 'query' | 'trigger' = 'pre', groupId: string, logic: 'AND' | 'OR') => {
    const updater = (prev: any[]) => prev.map(item => {
      if (item.id === groupId && item.type === 'group') {
        return { ...item, logic };
      }
      return item;
    });
    if (section === 'pre') setConditions(prev => updater(prev));
    else if (section === 'query') setQueryConditions(prev => updater(prev));
    else if (section === 'trigger') setTriggerConditions(prev => updater(prev));
  };

  const getLogicString = (items: any[], logic: string = 'AND'): string => {
    if (items.length === 0) return "No conditions defined yet";
    
    const parts = items.map(item => {
      if (item.type === 'group') {
        const nested = getLogicString(item.items, item.logic || 'AND');
        return nested === "No conditions defined yet" ? "" : `(${nested})`;
      }
      
      if (!item.category || !item.field || !item.operator) return "";
      
      const valueStr = item.valueType === 'Field' ? `{${item.value}}` : `'${item.value}'`;
      return `${item.field} ${item.operator} ${valueStr}`;
    }).filter(p => p !== "");

    if (parts.length === 0) return "No conditions defined yet";
    return parts.join(` ${logic} `);
  };

  const logicPreview = useMemo(() => getLogicString(conditions), [conditions]);
  const queryLogicPreview = useMemo(() => getLogicString(queryConditions), [queryConditions]);
  const triggerLogicPreview = useMemo(() => getLogicString(triggerConditions), [triggerConditions]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isRdaModalOpen, setIsRdaModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [automatedActions, setAutomatedActions] = useState<any[]>([]);

  // Success states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);

  const handleSaveRdaResponse = (data: any) => {
    setAutomatedActions([...automatedActions, { type: 'RDA_RESPONSE', ...data }]);
  };

  const handleSaveApiCall = (data: any) => {
    setAutomatedActions([...automatedActions, { type: 'API_CALL', ...data }]);
  };

  const handleSaveTableInsert = (data: any) => {
    setAutomatedActions([...automatedActions, { type: 'TABLE_INSERT', ...data }]);
  };

  const [varSearch, setVarSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>(["Current Event"]);

  const toggleCategory = (name: string) => {
    setOpenCategories(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleInsertVar = (varName: string) => {
    setMessage(prev => prev + `{${varName}}`);
  };

  const handleAutoGenerateMessage = () => {
    if (selectedTemplate) {
      setMessage(selectedTemplate.content);
    }
  };

  const handleCopyLogic = () => {
    navigator.clipboard.writeText(logicPreview);
    // Could add a toast here
  };

  const handleSave = () => {
    setShowDraftModal(true);
  };

  const handleFinalSaveDraft = () => {
    setShowDraftModal(false);
    if (onCreate) {
      onCreate({
        id: config?.id,
        name: scenarioName,
        workspace,
        group,
        description,
        riskWeight,
        category: template?.category || "Draft",
        status: "Draft",
        artifactType: "scenario"
      });
    }
  };

  const handleCreate = () => {
    setShowSuccessModal(true);
  };

  const handleFinalSubmit = () => {
    setShowSuccessModal(false);
    if (onCreate) {
      onCreate({
        id: config?.id,
        name: scenarioName,
        workspace,
        group,
        description,
        riskWeight,
        category: template?.category || config?.category || "Custom",
        status: "Pending Approval", // Force status for verification
        artifactType: "scenario"
      });
    }
  };

  const handleNext = () => {
    setActiveStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7f9] overflow-hidden font-['Inter']">
      {/* HEADER */}
      <header className="flex-none bg-white border-b border-gray-200 h-[60px] px-[20px] flex items-center justify-between z-30 relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center rounded-[8px] overflow-hidden border border-gray-200">
            <button 
              onClick={() => {
                setMode("Quick Mode");
                setActiveStep(1);
              }}
              className={cn(
                "h-[40px] px-5 text-[13px] font-bold transition-all flex items-center justify-center min-w-[120px]",
                mode === "Quick Mode" 
                  ? "bg-[#2A53A0] text-white" 
                  : "bg-[#F0F0F0] text-[#525252] hover:bg-[#e0e0e0]"
              )}
            >
              Quick Mode
            </button>
            <button 
              onClick={() => {
                setMode("Advanced Mode");
                setActiveStep(1);
              }}
              className={cn(
                "h-[40px] px-5 text-[13px] font-bold transition-all flex items-center justify-center min-w-[120px]",
                mode === "Advanced Mode" 
                  ? "bg-[#2A53A0] text-white" 
                  : "bg-[#F0F0F0] text-[#525252] hover:bg-[#e0e0e0]"
              )}
            >
              Advanced Mode
            </button>
          </div>
          {workspace && triggeringEntity && workspace !== triggeringEntity && (
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-full animate-pulse">
               <AlertCircle size={14} className="text-rose-500" />
               <span className="text-[11px] font-bold text-rose-600 uppercase tracking-tighter">Validation Error: Workspace Mismatch</span>
            </div>
          )}
        </div>

        <h1 className="text-[16px] font-bold text-[#161616] absolute left-1/2 -translate-x-1/2">
          {isEditMode ? `Edit Scenario: ${config.id}` : "Create New Scenario"}
        </h1>

        <div className="flex items-center gap-4">
          {mode === "Quick Mode" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-[48px] border-gray-300 text-gray-500 font-semibold px-4 rounded-[8px] hover:bg-gray-50" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="outline" className="h-[48px] border-gray-300 text-gray-700 font-semibold gap-2 px-4 rounded-[8px]" onClick={handleSave}>
                <Save size={16} />
                Save Draft
              </Button>
              <Button 
                className={cn(
                  "h-[48px] font-semibold gap-2 px-4 rounded-[8px] transition-all",
                  isFormValid 
                    ? "bg-[#2A53A0] hover:bg-[#1e3c75] text-white cursor-pointer" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                )}
                disabled={!isFormValid}
                onClick={handleCreate}
              >
                <Send size={16} />
                {isEditMode ? "Update Scenario" : "Create Scenario"}
              </Button>
            </div>
          )}
        </div>
      </header>

      {mode === "Advanced Mode" && (
        <div className="flex items-center justify-center w-full py-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-6 w-full px-12">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              const isLast = idx === STEPS.length - 1;

              return (
                <div key={step.id} className="contents">
                  <div 
                    className="flex items-center gap-3 relative z-10 cursor-pointer group" 
                    onClick={() => setActiveStep(step.id)}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-[13px] font-bold transition-all shrink-0",
                      isActive 
                        ? "bg-[#2A53A0] border-[#2A53A0] text-white shadow-sm ring-4 ring-blue-50" 
                        : isCompleted 
                          ? "bg-green-500 border-green-500 text-white" 
                          : "bg-white border-gray-300 text-gray-400"
                    )}>
                      {isCompleted ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className={cn(
                        "text-[13px] font-semibold whitespace-nowrap transition-colors",
                        isActive ? "text-[#2A53A0]" : "text-[#525252] group-hover:text-gray-500"
                      )}>
                        {step.label}
                      </p>
                      {step.optional && (
                        <p className={cn(
                          "text-[9px] font-medium leading-none -mt-0.5",
                          isActive ? "text-[#2A53A0]/70" : "text-[#8C9BB0]/70"
                        )}>
                          (Optional)
                        </p>
                      )}
                    </div>
                  </div>
                  {!isLast && (
                    <div className={cn(
                      "flex-1 h-[2px] transition-colors",
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* MAIN FORM AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex-1 hover-scroll p-4 bg-[#f4f7f9]">
            <div className="space-y-4">
              {isEditMode && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-[12px] flex items-center justify-between shadow-sm animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#2A53A0]">
                      <Settings size={20} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-[#161616]">Scenario Revision Mode</h3>
                      <p className="text-[12px] text-[#525252]">You are currently modifying <strong>{config.name}</strong>. Logic updates will require re-authorization.</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-600 text-white border-0 font-bold px-3 py-1">VERSION 2.0-DRAFT</Badge>
                </div>
              )}
            
          {/* 1. DEFINITION */}
          {(mode === "Quick Mode" || activeStep === 1) && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAF2FF] flex items-center justify-center text-[#2A53A0] text-[14px] font-bold border border-[#d0e2ff]">1</div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#161616]">Definition <span className="text-red-500 ml-1 text-[11px] font-normal uppercase bg-red-50 px-1.5 py-0.5 rounded border border-red-100 tracking-tighter">Required</span></h2>
                    <p className="text-[12px] text-gray-500 font-normal">Name, entity, and description</p>
                  </div>
                </div>
                <ChevronDown size={20} className="text-gray-300" />
              </div>
              
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#525252] flex items-center gap-1.5 uppercase tracking-wider">
                      Workspace 
                      {(template || isEditMode) ? <Lock size={12} className="text-amber-500" /> : <Settings size={12} className="text-gray-400" />}
                    </label>
                    <Select value={workspace} onValueChange={setWorkspace} disabled={!!template || isEditMode}>
                      <SelectTrigger className={cn("!h-[46px] border-gray-200 rounded-[8px] bg-white")}>
                        <SelectValue placeholder="Select workspace" />
                      </SelectTrigger>
                      <SelectContent>
                        {ENTITY_LIST.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Triggering Entity <span className="text-red-500">*</span></label>
                    <Select value={triggeringEntity} onValueChange={setTriggeringEntity} disabled={!!template || isEditMode}>
                      <SelectTrigger className={cn("!h-[46px] border-gray-200 rounded-[8px] bg-white")}>
                        <SelectValue placeholder="Select entity" />
                      </SelectTrigger>
                      <SelectContent>
                        {ENTITY_LIST.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Scenario Name <span className="text-red-500">*</span></label>
                    <Input 
                      value={scenarioName} 
                      onChange={(e) => setScenarioName(e.target.value)}
                      placeholder="e.g., HIGH_VALUE_TXN"
                      className="!h-[46px] border-gray-200 rounded-[8px] focus:ring-[#2A53A0] bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Group <span className="text-red-500">*</span></label>
                    <Select value={group} onValueChange={setGroup}>
                      <SelectTrigger className="!h-[46px] border-gray-200 rounded-[8px] bg-white">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {GROUP_LIST.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Description</label>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description of scenario purpose..."
                    className="min-h-[46px] border-gray-200 rounded-[8px] focus:ring-[#2A53A0] resize-none p-3 text-[14px] bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 pt-1">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Risk Weight</label>
                      <div className="flex items-center gap-3">
                        <Badge className={cn("px-2.5 py-0.5 rounded text-[10px] font-bold border", riskLabel.color)}>
                          {riskLabel.label}
                        </Badge>
                        <span className="text-[13px] font-bold text-[#161616] bg-gray-50 px-2.5 py-1 rounded border border-gray-200 min-w-[40px] text-center">{riskWeight}</span>
                      </div>
                    </div>
                    <Slider 
                      value={[riskWeight]} 
                      onValueChange={(v) => setRiskWeight(v[0])} 
                      max={100} 
                      step={1}
                      className="py-1"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Batch Alert Generation</label>
                      <Switch checked={batchAlert} onCheckedChange={setBatchAlert} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Frequency</label>
                       <Select value={frequency} onValueChange={setFrequency} disabled={!batchAlert}>
                         <SelectTrigger className="!h-[46px] border-gray-200 rounded-[8px] bg-white">
                           <SelectValue placeholder="Select frequency" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Daily">Daily</SelectItem>
                           <SelectItem value="Weekly">Weekly</SelectItem>
                           <SelectItem value="Monthly">Monthly</SelectItem>
                           <SelectItem value="Hourly">Hourly</SelectItem>
                           <SelectItem value="Custom">Custom</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>

                    {/* Custom Date Fields - Show when Custom is selected */}
                    {frequency === "Custom" && batchAlert && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">From Date</label>
                          <Input
                            type="date"
                            value={customFromDate}
                            onChange={(e) => setCustomFromDate(e.target.value)}
                            className="!h-[46px] border-gray-200 rounded-[8px] bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">To Date</label>
                          <Input
                            type="date"
                            value={customToDate}
                            onChange={(e) => setCustomToDate(e.target.value)}
                            className="!h-[46px] border-gray-200 rounded-[8px] bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-[12px] transition-colors hover:border-blue-200">
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-bold text-[#161616]">Shadow Mode</p>
                      <p className="text-[11px] text-gray-500 font-normal leading-none">Run silently without triggering alerts</p>
                    </div>
                    <Switch checked={shadowMode} onCheckedChange={setShadowMode} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-[12px] transition-colors hover:border-blue-200">
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-bold text-[#161616]">RDA Mode</p>
                      <p className="text-[11px] text-gray-500 font-normal leading-none">Prevention mode enabled</p>
                    </div>
                    <Switch checked={rdaMode} onCheckedChange={setRdaMode} />
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* 2. PRECONDITION */}
          {(mode === "Quick Mode" || activeStep === 2) && (
            <motion.section 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden"
              >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAF2FF] flex items-center justify-center text-[#2A53A0] text-[14px] font-bold border border-[#d0e2ff]">2</div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#161616]">Precondition <span className="text-red-500 ml-1 text-[11px] font-normal uppercase bg-red-50 px-1.5 py-0.5 rounded border border-red-100 tracking-tighter">Required</span></h2>
                    <p className="text-[12px] text-gray-500 font-normal">Define basic eligibility conditions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tabs value={conditionType} onValueChange={setConditionType} className="bg-gray-100 p-0.5 rounded-md">
                    <TabsList className="bg-transparent h-7 gap-0.5">
                      <TabsTrigger value="Simple" className="h-6 text-[11px] px-3 rounded-sm data-[state=active]:bg-[#2A53A0] data-[state=active]:text-white transition-all">Simple</TabsTrigger>
                      <TabsTrigger value="Expression" className="h-6 text-[11px] px-3 rounded-sm data-[state=active]:bg-[#2A53A0] data-[state=active]:text-white transition-all">Expression</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <ChevronDown size={20} className="text-gray-300" />
                </div>
              </div>
              
              <div className="p-4">
                {conditionType === "Simple" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleAddCondition('pre')}
                          className="h-8 px-4 text-[11px] font-bold bg-[#2A53A0] hover:bg-[#1e3d7a] text-white rounded-[4px] shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <Plus size={14} strokeWidth={3} /> ADD CONDITION
                        </button>
                        <button 
                          onClick={() => handleAddGroup('pre')}
                          className="h-8 px-4 text-[11px] font-bold text-[#2A53A0] border border-[#2A53A0]/30 hover:bg-blue-50 bg-white rounded-[4px] flex items-center gap-1.5 transition-all"
                        >
                          <Layers size={14} /> ADD LOGIC GROUP
                        </button>
                      </div>
                    </div>

                    {conditions.length > 0 ? (
                      <div className="space-y-3">
                        {conditions.map((item, idx) => {
                          const renderConditionRow = (cond: any, indexLabel: string, parentId?: string) => {
                            const fieldType = cond.fieldType || (cond.field ? getFieldType(cond.field) : "Str");
                            const operators = OPERATORS_BY_TYPE[fieldType] || OPERATORS_BY_TYPE["Str"];
                            
                            let currentSubgroup: any = null;
                            if (cond.field) {
                              for (const g of VARIABLES_DATA) {
                                const s = g.subgroups.find(sub => sub.items.some(i => i.name === cond.field));
                                if (s) {
                                  currentSubgroup = s;
                                  break;
                                }
                              }
                            }
                            
                            if (!currentSubgroup && cond.category) {
                              for (const g of VARIABLES_DATA) {
                                const s = g.subgroups.find(sub => sub.name === cond.category);
                                if (s) {
                                  currentSubgroup = s;
                                  break;
                                }
                              }
                            }

                            const isCategorySelected = !!cond.category;
                            const isFieldSelected = !!cond.field;
                            const isOperatorSelected = !!cond.operator;

                            return (
                              <div key={cond.id} className="flex items-center gap-2 p-1.5 bg-[#F9F9F9] border border-gray-100 rounded-[4px] min-w-max group">
                                <Select 
                                  value={cond.category || ""} 
                                  onValueChange={(v) => {
                                    handleUpdateCondition('pre', cond.id, { category: v, field: '', operator: '', value: '' }, parentId);
                                  }}
                                >
                                  <SelectTrigger className="h-[36px] w-[140px] bg-white border-gray-200 rounded-[4px] text-[13px] text-[#161616] px-2 flex items-center gap-2 shadow-none focus:ring-0">
                                    <Database size={14} className="text-[#8A3FFC]" />
                                    <SelectValue placeholder="Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {VARIABLES_DATA.map(g => (
                                      <SelectGroup key={g.group}>
                                        <SelectLabel className="text-[10px] uppercase text-gray-400 px-2 py-1">{g.group}</SelectLabel>
                                        {g.subgroups.map(s => (
                                          <SelectItem key={s.name} value={s.name} className="text-[13px]">{s.name}</SelectItem>
                                        ))}
                                      </SelectGroup>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <Select 
                                  value={cond.field || ""} 
                                  disabled={!isCategorySelected}
                                  onValueChange={(v) => handleUpdateCondition('pre', cond.id, { field: v, operator: '', value: '' }, parentId)}
                                >
                                  <SelectTrigger className={cn(
                                    "h-[36px] w-[150px] bg-white border-gray-200 rounded-[4px] text-[13px] text-[#161616] px-2 shadow-none focus:ring-0",
                                    !isCategorySelected && "opacity-50 cursor-not-allowed bg-gray-50"
                                  )}>
                                    <SelectValue placeholder="Category Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {currentSubgroup?.items.map((i: any) => (
                                      <SelectItem key={i.name} value={i.name} className="text-[13px]">{i.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <Select 
                                  value={cond.operator || ""} 
                                  disabled={!isFieldSelected}
                                  onValueChange={(v) => handleUpdateCondition('pre', cond.id, { operator: v }, parentId)}
                                >
                                  <SelectTrigger className={cn(
                                    "h-[36px] w-[90px] bg-white border-gray-200 rounded-[4px] text-[13px] text-[#161616] px-2 shadow-none focus:ring-0",
                                    !isFieldSelected && "opacity-50 cursor-not-allowed bg-gray-50"
                                  )}>
                                    <SelectValue placeholder="Operator" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {operators.map(op => <SelectItem key={op} value={op} className="text-[13px]">{op === 'EQUAL' ? '=' : op}</SelectItem>)}
                                  </SelectContent>
                                </Select>

                                {isOperatorSelected && (
                                  <>
                                    <div className="flex items-center h-[36px] bg-white border border-gray-200 rounded-[4px] overflow-hidden">
                                      {[
                                        { label: "Constant", value: "Constant" },
                                        { label: "Field", value: "Field" },
                                        { label: "Expression", value: "Expression" }
                                      ].map((type) => (
                                        <button
                                          key={type.value}
                                          onClick={() => handleUpdateCondition('pre', cond.id, { valueType: type.value, value: '' }, parentId)}
                                          className={cn(
                                            "px-4 h-full text-[12px] font-medium transition-all border-r last:border-0 border-gray-100",
                                            cond.valueType === type.value 
                                              ? "bg-[#2A53A0] text-white" 
                                              : "text-gray-500 hover:bg-gray-50"
                                          )}
                                        >
                                          {type.label}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="w-[180px]">
                                      {cond.valueType === "Field" ? (
                                        <Select 
                                          value={cond.value} 
                                          onValueChange={(v) => handleUpdateCondition('pre', cond.id, { value: v }, parentId)}
                                        >
                                          <SelectTrigger className="h-[36px] w-full bg-white border border-gray-200 rounded-[4px] px-3 text-[13px] shadow-none focus:ring-0">
                                            <SelectValue placeholder="Enter field..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {VARIABLES_DATA.map(g => (
                                              <SelectGroup key={g.group}>
                                                <SelectLabel className="text-[10px] uppercase text-gray-400 px-2 py-1">{g.group}</SelectLabel>
                                                {g.subgroups.flatMap(s => s.items).map(i => (
                                                  <SelectItem key={i.name} value={i.name} className="text-[13px]">{i.name}</SelectItem>
                                                ))}
                                              </SelectGroup>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <Input 
                                          value={cond.value}
                                          onChange={(e) => handleUpdateCondition('pre', cond.id, { value: e.target.value }, parentId)}
                                          placeholder="Enter value..."
                                          className="h-[36px] w-full bg-white border border-gray-200 rounded-[4px] px-3 text-[13px] shadow-none focus-visible:ring-0"
                                        />
                                      )}
                                    </div>
                                    
                                    <Select 
                                      value={cond.nextLogic || "AND"} 
                                      onValueChange={(v) => handleUpdateCondition('pre', cond.id, { nextLogic: v }, parentId)}
                                    >
                                      <SelectTrigger className="h-[36px] w-[65px] bg-[#EAF2FF] border-[#2A53A0]/20 rounded-[4px] text-[11px] font-black text-[#2A53A0] px-1 focus:ring-0 shadow-none">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="AND" className="text-[11px] font-bold">AND</SelectItem>
                                        <SelectItem value="OR" className="text-[11px] font-bold">OR</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </>
                                )}

                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0 ml-1"
                                  onClick={() => handleRemoveCondition('pre', cond.id, parentId)}
                                >
                                  <X size={16} />
                                </Button>
                              </div>
                            );
                          };

                          if (item.type === 'group') {
                            const renderNestedItems = (nestedItem: any, pId: string) => {
                              if (nestedItem.type === 'group') {
                                return (
                                  <div key={nestedItem.id} className="mt-4 first:mt-0">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="text-[20px] font-normal text-gray-400 leading-none">(</div>
                                      <Select 
                                        value={nestedItem.logic || "AND"} 
                                        onValueChange={(v) => handleUpdateGroupLogic('pre', nestedItem.id, v as 'AND' | 'OR')}
                                      >
                                        <SelectTrigger className="h-6 w-12 bg-transparent border-0 shadow-none focus:ring-0 p-0 text-gray-400 hover:text-gray-600 transition-colors">
                                          <div className="flex items-center gap-1">
                                            <span className="text-[11px] font-bold">{nestedItem.logic || "AND"}</span>
                                            <ChevronDown size={12} />
                                          </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="AND">AND</SelectItem>
                                          <SelectItem value="OR">OR</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="pl-6 space-y-3">
                                      {nestedItem.items.map((sub: any) => renderNestedItems(sub, nestedItem.id))}
                                      <div className="flex items-center gap-6 pt-2 pb-1">
                                        <button 
                                          onClick={() => handleAddConditionToGroup('pre', nestedItem.id)}
                                          className="flex items-center gap-1.5 text-[#2A53A0] text-[13px] font-medium hover:underline transition-all"
                                        >
                                          <Plus size={14} strokeWidth={2.5} /> Add Condition
                                        </button>
                                        <button 
                                          onClick={() => handleAddGroupToGroup('pre', nestedItem.id)}
                                          className="flex items-center gap-1.5 text-[#2A53A0] text-[13px] font-medium hover:underline transition-all"
                                        >
                                          <Folder size={14} className="text-[#2A53A0]/70" /> Add Group
                                        </button>
                                      </div>
                                    </div>
                                    <div className="flex items-end justify-between mt-1">
                                      <div className="text-[20px] font-normal text-gray-400 leading-none">)</div>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                                        onClick={() => handleRemoveCondition('pre', nestedItem.id)}
                                      >
                                        <X size={16} />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              }
                              return renderConditionRow(nestedItem, "", pId);
                            };

                            return (
                              <div key={item.id} className="relative border border-blue-100 rounded-[8px] p-4 bg-[#F9FBFF]/50 shadow-sm mb-4">
                                {renderNestedItems(item, "")}
                              </div>
                            );
                          }

                          return renderConditionRow(item, `${idx + 1}`);
                        })}
                      </div>
                    ) : (
                      <div className="bg-[#f8f9fa] border border-dashed border-gray-200 rounded-[12px] p-10 flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-200 text-gray-300 shadow-sm">
                          <AlertCircle size={24} />
                        </div>
                        <p className="text-[13px] text-gray-400 font-medium">No conditions defined yet</p>
                        <button className="text-[12px] text-[#2A53A0] font-bold hover:underline mt-1">
                          Start by adding a condition or group
                        </button>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Logic Preview</label>
                      </div>
                      
                      <div className="relative group min-h-[50px] bg-[#EAF2FF]/50 border border-[#2A53A0]/20 rounded-[8px] flex items-center px-4 py-3 transition-all hover:border-[#2A53A0]/40">
                        <span className={cn(
                          "text-[13px] font-medium leading-relaxed",
                          logicPreview === "No conditions defined yet" ? "text-gray-400 italic" : "text-[#2A53A0]"
                        )}>
                          {logicPreview}
                        </span>
                        <button 
                          onClick={handleCopyLogic}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#2A53A0] transition-colors"
                          title="Copy logic"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 min-h-[400px]">
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                         <label className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Expression Editor</label>
                         <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border-emerald-100 uppercase tracking-tighter">Valid Syntax</Badge>
                         </div>
                      </div>
                      <div className="flex-1 relative border border-gray-200 rounded-[12px] bg-[#212121] p-4 group overflow-hidden">
                        <textarea 
                          value={expressionValue}
                          onChange={(e) => setExpressionValue(e.target.value)}
                          className="w-full h-full bg-transparent text-emerald-400 font-mono text-[14px] resize-none focus:outline-none leading-relaxed"
                          placeholder="Write your custom expression logic here..."
                        />
                        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10" onClick={handleCopyLogic}><Copy size={14} /></Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 p-3 rounded-[8px]">
                        <Info size={14} className="text-[#2A53A0]" />
                        <p className="text-[11px] text-gray-500">Use <span className="font-mono font-bold text-[#2A53A0]">AND</span>, <span className="font-mono font-bold text-[#2A53A0]">OR</span>, and <span className="font-mono font-bold text-[#2A53A0]">()</span> for complex logic. Click variables in the sidebar to insert.</p>
                      </div>
                    </div>
                    
                    <div className="w-[280px] flex flex-col border border-gray-100 rounded-[12px] bg-[#f9f9f9] overflow-hidden">
                      <div className="p-3 border-b border-gray-200 bg-white">
                        <Input 
                          placeholder="Search variables..." 
                          className="h-8 text-[12px] bg-gray-50 border-gray-200"
                          value={variableSearch}
                          onChange={(e) => setVariableSearch(e.target.value)}
                        />
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 space-y-3">
                        {filteredVariables.map((group) => (
                          <div key={group.group} className="space-y-1.5">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase px-2 tracking-widest">{group.group}</h4>
                            <div className="space-y-0.5">
                              {group.subgroups.flatMap(sg => sg.items).map((item) => (
                                <button
                                  key={item.name}
                                  onClick={() => insertVariable('pre', item.name)}
                                  className="w-full text-left px-2 py-1.5 rounded-[4px] hover:bg-[#EAF2FF] group flex items-center justify-between transition-colors"
                                >
                                  <span className="text-[12px] text-gray-600 font-medium group-hover:text-[#2A53A0] truncate">{item.name}</span>
                                  <Plus size={12} className="text-gray-300 group-hover:text-[#2A53A0]" />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* 3. QUERIES (Optional) */}
          {(mode === "Advanced Mode" && activeStep === 3) && (
            <motion.section 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden"
              >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAF2FF] flex items-center justify-center text-[#2A53A0] text-[14px] font-bold border border-[#d0e2ff]">3</div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#161616]">Queries <span className="text-gray-400 ml-1 text-[11px] font-normal uppercase bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 tracking-tighter">Optional</span></h2>
                    <p className="text-[12px] text-gray-500 font-normal">Define external data lookups or complex queries</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tabs value={queryConditionType} onValueChange={setQueryConditionType} className="bg-gray-100 p-0.5 rounded-md">
                    <TabsList className="bg-transparent h-7 gap-0.5">
                      <TabsTrigger value="Simple" className="h-6 text-[11px] px-3 rounded-sm data-[state=active]:bg-[#2A53A0] data-[state=active]:text-white transition-all">Simple</TabsTrigger>
                      <TabsTrigger value="Expression" className="h-6 text-[11px] px-3 rounded-sm data-[state=active]:bg-[#2A53A0] data-[state=active]:text-white transition-all">Expression</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <ChevronDown size={20} className="text-gray-300" />
                </div>
              </div>
              
              <div className="p-4">
                {queryConditionType === "Simple" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleAddCondition('query')}
                          className="h-8 px-4 text-[11px] font-bold bg-[#2A53A0] hover:bg-[#1e3d7a] text-white rounded-[4px] shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <Plus size={14} strokeWidth={3} /> ADD CONDITION
                        </button>
                        <button 
                          onClick={() => handleAddGroup('query')}
                          className="h-8 px-4 text-[11px] font-bold text-[#2A53A0] border border-[#2A53A0]/30 hover:bg-blue-50 bg-white rounded-[4px] flex items-center gap-1.5 transition-all"
                        >
                          <Layers size={14} /> ADD LOGIC GROUP
                        </button>
                      </div>
                    </div>

                    {queryConditions.length > 0 ? (
                      <div className="space-y-3">
                        {queryConditions.map((item, idx) => {
                          const renderConditionRow = (cond: any, indexLabel: string, parentId?: string) => {
                            const fieldType = cond.fieldType || (cond.field ? getFieldType(cond.field) : "Str");
                            const operators = OPERATORS_BY_TYPE[fieldType] || OPERATORS_BY_TYPE["Str"];
                            
                            let currentSubgroup: any = null;
                            if (cond.field) {
                              for (const g of VARIABLES_DATA) {
                                const s = g.subgroups.find(sub => sub.items.some(i => i.name === cond.field));
                                if (s) { currentSubgroup = s; break; }
                              }
                            } else if (cond.category) {
                              for (const g of VARIABLES_DATA) {
                                const s = g.subgroups.find(sub => sub.name === cond.category);
                                if (s) { currentSubgroup = s; break; }
                              }
                            }

                            const isCategorySelected = !!cond.category;
                            const isFieldSelected = !!cond.field;
                            const isOperatorSelected = !!cond.operator;

                            return (
                              <div key={cond.id} className="flex items-center gap-2 p-1.5 bg-[#F9F9F9] border border-gray-100 rounded-[4px] min-w-max group">
                                <Select value={cond.category || ""} onValueChange={(v) => handleUpdateCondition('query', cond.id, { category: v, field: '', operator: '', value: '' }, parentId)}>
                                  <SelectTrigger className="h-[36px] w-[140px] bg-white border-gray-200 rounded-[4px] text-[13px] text-[#161616] px-2 flex items-center gap-2 shadow-none focus:ring-0">
                                    <Database size={14} className="text-[#8A3FFC]" />
                                    <SelectValue placeholder="Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {VARIABLES_DATA.map(g => (
                                      <SelectGroup key={g.group}>
                                        <SelectLabel className="text-[10px] uppercase text-gray-400 px-2 py-1">{g.group}</SelectLabel>
                                        {g.subgroups.map(s => <SelectItem key={s.name} value={s.name} className="text-[13px]">{s.name}</SelectItem>)}
                                      </SelectGroup>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <Select value={cond.field || ""} disabled={!isCategorySelected} onValueChange={(v) => handleUpdateCondition('query', cond.id, { field: v, operator: '', value: '' }, parentId)}>
                                  <SelectTrigger className={cn("h-[36px] w-[150px] bg-white border-gray-200 rounded-[4px] text-[13px] text-[#161616] px-2 shadow-none focus:ring-0", !isCategorySelected && "opacity-50 cursor-not-allowed bg-gray-50")}><SelectValue placeholder="Category Type" /></SelectTrigger>
                                  <SelectContent>{currentSubgroup?.items.map((i: any) => <SelectItem key={i.name} value={i.name} className="text-[13px]">{i.name}</SelectItem>)}</SelectContent>
                                </Select>

                                <Select value={cond.operator || ""} disabled={!isFieldSelected} onValueChange={(v) => handleUpdateCondition('query', cond.id, { operator: v }, parentId)}>
                                  <SelectTrigger className={cn("h-[36px] w-[90px] bg-white border-gray-200 rounded-[4px] text-[13px] text-[#161616] px-2 shadow-none focus:ring-0", !isFieldSelected && "opacity-50 cursor-not-allowed bg-gray-50")}><SelectValue placeholder="Operator" /></SelectTrigger>
                                  <SelectContent>{operators.map(op => <SelectItem key={op} value={op} className="text-[13px]">{op === 'EQUAL' ? '=' : op}</SelectItem>)}</SelectContent>
                                </Select>

                                {isOperatorSelected && (
                                  <>
                                    <div className="flex items-center h-[36px] bg-white border border-gray-200 rounded-[4px] overflow-hidden">
                                      {["Constant", "Field", "Expression"].map((type) => (
                                        <button key={type} onClick={() => handleUpdateCondition('query', cond.id, { valueType: type, value: '' }, parentId)} className={cn("px-4 h-full text-[12px] font-medium transition-all border-r last:border-0 border-gray-100", cond.valueType === type ? "bg-[#2A53A0] text-white" : "text-gray-500 hover:bg-gray-50")}>{type}</button>
                                      ))}
                                    </div>
                                    <div className="w-[180px]">
                                      {cond.valueType === "Field" ? (
                                        <Select value={cond.value} onValueChange={(v) => handleUpdateCondition('query', cond.id, { value: v }, parentId)}>
                                          <SelectTrigger className="h-[36px] w-full bg-white border border-gray-200 rounded-[4px] px-3 text-[13px] shadow-none focus:ring-0"><SelectValue placeholder="Enter field..." /></SelectTrigger>
                                          <SelectContent>{VARIABLES_DATA.map(g => (<SelectGroup key={g.group}><SelectLabel className="text-[10px] uppercase text-gray-400 px-2 py-1">{g.group}</SelectLabel>{g.subgroups.flatMap(s => s.items).map(i => <SelectItem key={i.name} value={i.name} className="text-[13px]">{i.name}</SelectItem>)}</SelectGroup>))}</SelectContent>
                                        </Select>
                                      ) : (
                                        <Input value={cond.value} onChange={(e) => handleUpdateCondition('query', cond.id, { value: e.target.value }, parentId)} placeholder="Enter value..." className="h-[36px] w-full bg-white border border-gray-200 rounded-[4px] px-3 text-[13px] shadow-none focus-visible:ring-0" />
                                      )}
                                    </div>
                                    <Select value={cond.nextLogic || "AND"} onValueChange={(v) => handleUpdateCondition('query', cond.id, { nextLogic: v }, parentId)}>
                                      <SelectTrigger className="h-[36px] w-[65px] bg-[#EAF2FF] border-[#2A53A0]/20 rounded-[4px] text-[11px] font-black text-[#2A53A0] px-1 focus:ring-0 shadow-none"><SelectValue /></SelectTrigger>
                                      <SelectContent><SelectItem value="AND" className="text-[11px] font-bold">AND</SelectItem><SelectItem value="OR" className="text-[11px] font-bold">OR</SelectItem></SelectContent>
                                    </Select>
                                  </>
                                )}
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0 ml-1" onClick={() => handleRemoveCondition('query', cond.id, parentId)}><X size={16} /></Button>
                              </div>
                            );
                          };

                          if (item.type === 'group') {
                            const renderNestedItems = (nestedItem: any, pId: string) => {
                              if (nestedItem.type === 'group') {
                                return (
                                  <div key={nestedItem.id} className="mt-4 first:mt-0">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="text-[20px] font-normal text-gray-400 leading-none">(</div>
                                      <Select value={nestedItem.logic || "AND"} onValueChange={(v) => handleUpdateGroupLogic('query', nestedItem.id, v as 'AND' | 'OR')}>
                                        <SelectTrigger className="h-6 w-12 bg-transparent border-0 shadow-none focus:ring-0 p-0 text-gray-400 hover:text-gray-600 transition-colors"><div className="flex items-center gap-1"><span className="text-[11px] font-bold">{nestedItem.logic || "AND"}</span><ChevronDown size={12} /></div></SelectTrigger>
                                        <SelectContent><SelectItem value="AND">AND</SelectItem><SelectItem value="OR">OR</SelectItem></SelectContent>
                                      </Select>
                                    </div>
                                    <div className="pl-6 space-y-3">
                                      {nestedItem.items.map((sub: any) => renderNestedItems(sub, nestedItem.id))}
                                      <div className="flex items-center gap-6 pt-2 pb-1">
                                        <button onClick={() => handleAddConditionToGroup('query', nestedItem.id)} className="flex items-center gap-1.5 text-[#2A53A0] text-[13px] font-medium hover:underline transition-all"><Plus size={14} strokeWidth={2.5} /> Add Condition</button>
                                        <button onClick={() => handleAddGroupToGroup('query', nestedItem.id)} className="flex items-center gap-1.5 text-[#2A53A0] text-[13px] font-medium hover:underline transition-all"><Folder size={14} className="text-[#2A53A0]/70" /> Add Group</button>
                                      </div>
                                    </div>
                                    <div className="flex items-end justify-between mt-1"><div className="text-[20px] font-normal text-gray-400 leading-none">)</div><Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0" onClick={() => handleRemoveCondition('query', nestedItem.id)}><X size={16} /></Button></div>
                                  </div>
                                );
                              }
                              return renderConditionRow(nestedItem, "", pId);
                            };
                            return (<div key={item.id} className="relative border border-blue-100 rounded-[8px] p-4 bg-[#F9FBFF]/50 shadow-sm mb-4">{renderNestedItems(item, "")}</div>);
                          }
                          return renderConditionRow(item, `${idx + 1}`);
                        })}
                      </div>
                    ) : (
                      <div className="bg-[#f8f9fa] border border-dashed border-gray-200 rounded-[12px] p-10 flex flex-col items-center justify-center gap-3"><div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-200 text-gray-300 shadow-sm"><AlertCircle size={24} /></div><p className="text-[13px] text-gray-400 font-medium">No queries defined yet</p></div>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Logic Preview</label>
                      <div className="relative group min-h-[50px] bg-[#EAF2FF]/50 border border-[#2A53A0]/20 rounded-[8px] flex items-center px-4 py-3 transition-all hover:border-[#2A53A0]/40"><span className={cn("text-[13px] font-medium leading-relaxed", queryLogicPreview === "No conditions defined yet" ? "text-gray-400 italic" : "text-[#2A53A0]")}>{queryLogicPreview}</span><button onClick={() => handleCopyLogic(queryLogicPreview)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#2A53A0] transition-colors"><Copy size={16} /></button></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 min-h-[400px]">
                    <div className="flex-1 flex flex-col gap-3">
                      <label className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Expression Editor</label>
                      <div className="flex-1 relative border border-gray-200 rounded-[12px] bg-[#212121] p-4 group overflow-hidden">
                        <textarea value={queryExpressionValue} onChange={(e) => setQueryExpressionValue(e.target.value)} className="w-full h-full bg-transparent text-emerald-400 font-mono text-[14px] resize-none focus:outline-none leading-relaxed" placeholder="Write your custom expression logic here..." />
                      </div>
                    </div>
                    <div className="w-[280px] flex flex-col border border-gray-100 rounded-[12px] bg-[#f9f9f9] overflow-hidden">
                      <div className="p-3 border-b border-gray-200 bg-white"><Input placeholder="Search variables..." className="h-8 text-[12px] bg-gray-50 border-gray-200" value={variableSearch} onChange={(e) => setVariableSearch(e.target.value)} /></div>
                      <div className="flex-1 overflow-y-auto p-2 space-y-3">
                        {filteredVariables.map((group) => (
                          <div key={group.group} className="space-y-1.5">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase px-2 tracking-widest">{group.group}</h4>
                            <div className="space-y-0.5">{group.subgroups.flatMap(sg => sg.items).map((item) => (<button key={item.name} onClick={() => insertVariable('query', item.name)} className="w-full text-left px-2 py-1.5 rounded-[4px] hover:bg-[#EAF2FF] group flex items-center justify-between transition-colors"><span className="text-[12px] text-gray-600 font-medium group-hover:text-[#2A53A0] truncate">{item.name}</span><Plus size={12} className="text-gray-300 group-hover:text-[#2A53A0]" /></button>))}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* 4. TRIGGER */}
          {(mode === "Advanced Mode" && activeStep === 4) && (
            <motion.section 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden"
              >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAF2FF] flex items-center justify-center text-[#2A53A0] text-[14px] font-bold border border-[#d0e2ff]">4</div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#161616]">Trigger <span className="text-red-500 ml-1 text-[11px] font-normal uppercase bg-red-50 px-1.5 py-0.5 rounded border border-red-100 tracking-tighter">Required</span></h2>
                    <p className="text-[12px] text-gray-500 font-normal">Define the final trigger threshold or expression</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tabs value={triggerConditionType} onValueChange={setTriggerConditionType} className="bg-gray-100 p-0.5 rounded-md">
                    <TabsList className="bg-transparent h-7 gap-0.5">
                      <TabsTrigger value="Simple" className="h-6 text-[11px] px-3 rounded-sm data-[state=active]:bg-[#2A53A0] data-[state=active]:text-white transition-all">Simple</TabsTrigger>
                      <TabsTrigger value="Expression" className="h-6 text-[11px] px-3 rounded-sm data-[state=active]:bg-[#2A53A0] data-[state=active]:text-white transition-all">Expression</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <ChevronDown size={20} className="text-gray-300" />
                </div>
              </div>
              
              <div className="p-4">
                {triggerConditionType === "Simple" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleAddCondition('trigger')} className="h-8 px-4 text-[11px] font-bold bg-[#2A53A0] hover:bg-[#1e3d7a] text-white rounded-[4px] shadow-sm flex items-center gap-1.5 transition-all active:scale-95"><Plus size={14} strokeWidth={3} /> ADD CONDITION</button>
                        <button onClick={() => handleAddGroup('trigger')} className="h-8 px-4 text-[11px] font-bold text-[#2A53A0] border border-[#2A53A0]/30 hover:bg-blue-50 bg-white rounded-[4px] flex items-center gap-1.5 transition-all"><Layers size={14} /> ADD LOGIC GROUP</button>
                      </div>
                    </div>

                    {triggerConditions.length > 0 ? (
                      <div className="space-y-3">
                        {triggerConditions.map((item, idx) => {
                          const renderConditionRow = (cond: any, indexLabel: string, parentId?: string) => {
                            const fieldType = cond.fieldType || (cond.field ? getFieldType(cond.field) : "Str");
                            const operators = OPERATORS_BY_TYPE[fieldType] || OPERATORS_BY_TYPE["Str"];
                            let currentSubgroup: any = null;
                            if (cond.field) {
                              for (const g of VARIABLES_DATA) {
                                const s = g.subgroups.find(sub => sub.items.some(i => i.name === cond.field));
                                if (s) { currentSubgroup = s; break; }
                              }
                            } else if (cond.category) {
                              for (const g of VARIABLES_DATA) {
                                const s = g.subgroups.find(sub => sub.name === cond.category);
                                if (s) { currentSubgroup = s; break; }
                              }
                            }
                            const isCategorySelected = !!cond.category;
                            const isFieldSelected = !!cond.field;
                            const isOperatorSelected = !!cond.operator;

                            return (
                              <div key={cond.id} className="flex items-center gap-2 p-1.5 bg-[#F9F9F9] border border-gray-100 rounded-[4px] min-w-max group">
                                <Select value={cond.category || ""} onValueChange={(v) => handleUpdateCondition('trigger', cond.id, { category: v, field: '', operator: '', value: '' }, parentId)}>
                                  <SelectTrigger className="h-[36px] w-[140px] bg-white border-gray-200 rounded-[4px] text-[13px] text-[#161616] px-2 flex items-center gap-2 shadow-none focus:ring-0"><Database size={14} className="text-[#8A3FFC]" /><SelectValue placeholder="Category" /></SelectTrigger>
                                  <SelectContent>{VARIABLES_DATA.map(g => (<SelectGroup key={g.group}><SelectLabel className="text-[10px] uppercase text-gray-400 px-2 py-1">{g.group}</SelectLabel>{g.subgroups.map(s => <SelectItem key={s.name} value={s.name} className="text-[13px]">{s.name}</SelectItem>)}</SelectGroup>))}</SelectContent>
                                </Select>
                                <Select value={cond.field || ""} disabled={!isCategorySelected} onValueChange={(v) => handleUpdateCondition('trigger', cond.id, { field: v, operator: '', value: '' }, parentId)}><SelectTrigger className={cn("h-[36px] w-[150px] bg-white border-gray-200 rounded-[4px] text-[13px] text-[#161616] px-2 shadow-none focus:ring-0", !isCategorySelected && "opacity-50 cursor-not-allowed bg-gray-50")}><SelectValue placeholder="Category Type" /></SelectTrigger><SelectContent>{currentSubgroup?.items.map((i: any) => <SelectItem key={i.name} value={i.name} className="text-[13px]">{i.name}</SelectItem>)}</SelectContent></Select>
                                <Select value={cond.operator || ""} disabled={!isFieldSelected} onValueChange={(v) => handleUpdateCondition('trigger', cond.id, { operator: v }, parentId)}><SelectTrigger className={cn("h-[36px] w-[90px] bg-white border-gray-200 rounded-[4px] text-[13px] text-[#161616] px-2 shadow-none focus:ring-0", !isFieldSelected && "opacity-50 cursor-not-allowed bg-gray-50")}><SelectValue placeholder="Operator" /></SelectTrigger><SelectContent>{operators.map(op => <SelectItem key={op} value={op} className="text-[13px]">{op === 'EQUAL' ? '=' : op}</SelectItem>)}</SelectContent></Select>
                                {isOperatorSelected && (<><div className="flex items-center h-[36px] bg-white border border-gray-200 rounded-[4px] overflow-hidden">{["Constant", "Field", "Expression"].map((type) => (<button key={type} onClick={() => handleUpdateCondition('trigger', cond.id, { valueType: type, value: '' }, parentId)} className={cn("px-4 h-full text-[12px] font-medium transition-all border-r last:border-0 border-gray-100", cond.valueType === type ? "bg-[#2A53A0] text-white" : "text-gray-500 hover:bg-gray-50")}>{type}</button>))}</div><div className="w-[180px]">{cond.valueType === "Field" ? (<Select value={cond.value} onValueChange={(v) => handleUpdateCondition('trigger', cond.id, { value: v }, parentId)}><SelectTrigger className="h-[36px] w-full bg-white border border-gray-200 rounded-[4px] px-3 text-[13px] shadow-none focus:ring-0"><SelectValue placeholder="Enter field..." /></SelectTrigger><SelectContent>{VARIABLES_DATA.map(g => (<SelectGroup key={g.group}><SelectLabel className="text-[10px] uppercase text-gray-400 px-2 py-1">{g.group}</SelectLabel>{g.subgroups.flatMap(s => s.items).map(i => <SelectItem key={i.name} value={i.name} className="text-[13px]">{i.name}</SelectItem>)}</SelectGroup>))}</SelectContent></Select>) : (<Input value={cond.value} onChange={(e) => handleUpdateCondition('trigger', cond.id, { value: e.target.value }, parentId)} placeholder="Enter value..." className="h-[36px] w-full bg-white border border-gray-200 rounded-[4px] px-3 text-[13px] shadow-none focus-visible:ring-0" />)}</div><Select value={cond.nextLogic || "AND"} onValueChange={(v) => handleUpdateCondition('trigger', cond.id, { nextLogic: v }, parentId)}><SelectTrigger className="h-[36px] w-[65px] bg-[#EAF2FF] border-[#2A53A0]/20 rounded-[4px] text-[11px] font-black text-[#2A53A0] px-1 focus:ring-0 shadow-none"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="AND" className="text-[11px] font-bold">AND</SelectItem><SelectItem value="OR" className="text-[11px] font-bold">OR</SelectItem></SelectContent></Select></>)}
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0 ml-1" onClick={() => handleRemoveCondition('trigger', cond.id, parentId)}><X size={16} /></Button>
                              </div>
                            );
                          };
                          if (item.type === 'group') {
                            const renderNestedItems = (nestedItem: any, pId: string) => {
                              if (nestedItem.type === 'group') {
                                return (<div key={nestedItem.id} className="mt-4 first:mt-0"><div className="flex items-start justify-between mb-2"><div className="text-[20px] font-normal text-gray-400 leading-none">(</div><Select value={nestedItem.logic || "AND"} onValueChange={(v) => handleUpdateGroupLogic('trigger', nestedItem.id, v as 'AND' | 'OR')}><SelectTrigger className="h-6 w-12 bg-transparent border-0 shadow-none focus:ring-0 p-0 text-gray-400 hover:text-gray-600 transition-colors"><div className="flex items-center gap-1"><span className="text-[11px] font-bold">{nestedItem.logic || "AND"}</span><ChevronDown size={12} /></div></SelectTrigger><SelectContent><SelectItem value="AND">AND</SelectItem><SelectItem value="OR">OR</SelectItem></SelectContent></Select></div><div className="pl-6 space-y-3">{nestedItem.items.map((sub: any) => renderNestedItems(sub, nestedItem.id))}<div className="flex items-center gap-6 pt-2 pb-1"><button onClick={() => handleAddConditionToGroup('trigger', nestedItem.id)} className="flex items-center gap-1.5 text-[#2A53A0] text-[13px] font-medium hover:underline transition-all"><Plus size={14} strokeWidth={2.5} /> Add Condition</button><button onClick={() => handleAddGroupToGroup('trigger', nestedItem.id)} className="flex items-center gap-1.5 text-[#2A53A0] text-[13px] font-medium hover:underline transition-all"><Folder size={14} className="text-[#2A53A0]/70" /> Add Group</button></div></div><div className="flex items-end justify-between mt-1"><div className="text-[20px] font-normal text-gray-400 leading-none">)</div><Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0" onClick={() => handleRemoveCondition('trigger', nestedItem.id)}><X size={16} /></Button></div></div>);
                              }
                              return renderConditionRow(nestedItem, "", pId);
                            };
                            return (<div key={item.id} className="relative border border-blue-100 rounded-[8px] p-4 bg-[#F9FBFF]/50 shadow-sm mb-4">{renderNestedItems(item, "")}</div>);
                          }
                          return renderConditionRow(item, `${idx + 1}`);
                        })}
                      </div>
                    ) : (
                      <div className="bg-[#f8f9fa] border border-dashed border-gray-200 rounded-[12px] p-10 flex flex-col items-center justify-center gap-3"><div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-200 text-gray-300 shadow-sm"><AlertCircle size={24} /></div><p className="text-[13px] text-gray-400 font-medium">No conditions defined yet</p></div>
                    )}
                    <div className="mt-6 pt-4 border-t border-gray-100"><label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Logic Preview</label><div className="relative group min-h-[50px] bg-[#EAF2FF]/50 border border-[#2A53A0]/20 rounded-[8px] flex items-center px-4 py-3 transition-all hover:border-[#2A53A0]/40"><span className={cn("text-[13px] font-medium leading-relaxed", triggerLogicPreview === "No conditions defined yet" ? "text-gray-400 italic" : "text-[#2A53A0]")}>{triggerLogicPreview}</span><button onClick={() => handleCopyLogic(triggerLogicPreview)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#2A53A0] transition-colors"><Copy size={16} /></button></div></div>
                  </div>
                ) : (
                  <div className="flex gap-4 min-h-[400px]">
                    <div className="flex-1 flex flex-col gap-3">
                      <label className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Expression Editor</label>
                      <div className="flex-1 relative border border-gray-200 rounded-[12px] bg-[#212121] p-4 group overflow-hidden">
                        <textarea value={triggerExpressionValue} onChange={(e) => setTriggerExpressionValue(e.target.value)} className="w-full h-full bg-transparent text-emerald-400 font-mono text-[14px] resize-none focus:outline-none leading-relaxed" placeholder="Write your custom expression logic here..." />
                      </div>
                    </div>
                    <div className="w-[280px] flex flex-col border border-gray-100 rounded-[12px] bg-[#f9f9f9] overflow-hidden">
                      <div className="p-3 border-b border-gray-200 bg-white"><Input placeholder="Search variables..." className="h-8 text-[12px] bg-gray-50 border-gray-200" value={variableSearch} onChange={(e) => setVariableSearch(e.target.value)} /></div>
                      <div className="flex-1 overflow-y-auto p-2 space-y-3">
                        {filteredVariables.map((group) => (
                          <div key={group.group} className="space-y-1.5">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase px-2 tracking-widest">{group.group}</h4>
                            <div className="space-y-0.5">{group.subgroups.flatMap(sg => sg.items).map((item) => (<button key={item.name} onClick={() => insertVariable('trigger', item.name)} className="w-full text-left px-2 py-1.5 rounded-[4px] hover:bg-[#EAF2FF] group flex items-center justify-between transition-colors"><span className="text-[12px] text-gray-600 font-medium group-hover:text-[#2A53A0] truncate">{item.name}</span><Plus size={12} className="text-gray-300 group-hover:text-[#2A53A0]" /></button>))}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* 5. MESSAGE */}
          {(mode === "Quick Mode" || activeStep === 5) && (
            <motion.section 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden"
              >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAF2FF] flex items-center justify-center text-[#2A53A0] text-[14px] font-bold border border-[#d0e2ff]">5</div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#161616]">Message <span className="text-gray-400 ml-1 text-[11px] font-normal uppercase bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 tracking-tighter">Optional</span></h2>
                    <p className="text-[12px] text-gray-500 font-normal">Define the alert message content</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-8 text-[11px] font-bold gap-1.5 px-3 border-gray-200 rounded-[6px] text-gray-600">
                        <FileText size={14} className={cn("text-gray-400", selectedTemplate && "text-[#2A53A0]")} />
                        {selectedTemplate ? selectedTemplate.title : "Use Template"}
                        <ChevronDown size={12} className="text-gray-300 ml-0.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[340px] p-1 rounded-[8px] shadow-lg border-gray-100">
                      {MESSAGE_TEMPLATES.map((tmpl) => (
                        <DropdownMenuItem 
                          key={tmpl.title}
                          onClick={() => {
                            setSelectedTemplate(tmpl);
                          }}
                          className="flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-blue-50 focus:text-inherit rounded-[6px] transition-colors outline-none"
                        >
                          <span className="text-[13px] font-bold text-[#2A53A0]">{tmpl.title}</span>
                          <span className="text-[11px] text-gray-400 font-medium leading-relaxed">{tmpl.content}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="outline" 
                    onClick={handleAutoGenerateMessage}
                    disabled={!selectedTemplate}
                    className={cn(
                      "h-8 text-[11px] font-bold gap-1.5 px-3 border-[#d0e2ff] bg-blue-50 text-[#2A53A0] rounded-[6px] hover:bg-blue-100 transition-all",
                      !selectedTemplate && "opacity-50 cursor-not-allowed grayscale"
                    )}
                  >
                    <Zap size={14} className={cn("fill-[#2A53A0]", !selectedTemplate && "fill-gray-400")} />
                    Auto-Generate
                  </Button>
                  <ChevronDown size={20} className="text-gray-300 ml-1" />
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                      <label className="text-[12px] font-bold text-[#525252] uppercase tracking-wider">Message <span className="text-red-500">*</span></label>
                      <div className="flex items-center gap-1 border border-gray-200 rounded-md p-0.5 bg-gray-50/50">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:bg-white hover:text-[#2A53A0]"><Bold size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:bg-white hover:text-[#2A53A0]"><Italic size={14} /></Button>
                        <div className="w-px h-4 bg-gray-200 mx-1" />
                        
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="h-7 text-[10px] font-bold gap-1.5 px-2.5 border-gray-200 bg-white text-gray-600 hover:text-[#2A53A0] hover:border-[#2A53A0]/30 transition-all">
                              <Plus size={12} /> Insert Variable
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-[380px] p-0 rounded-[12px] shadow-2xl border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
                              <h3 className="text-[15px] font-bold text-[#1C2B4F]">Insert Variable</h3>
                              <X size={16} className="text-gray-400 cursor-pointer" />
                            </div>
                            
                            <div className="p-3 bg-white">
                              <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <Input 
                                  value={varSearch}
                                  onChange={(e) => setVarSearch(e.target.value)}
                                  placeholder="Search variables..." 
                                  className="h-10 pl-10 text-[14px] bg-[#F4F7F9] border-0 rounded-[8px] focus-visible:ring-1 focus-visible:ring-blue-100"
                                />
                              </div>
                            </div>

                            <div className="max-h-[350px] overflow-y-auto">
                              {VARIABLE_CATEGORIES.map((cat) => (
                                <div key={cat.name} className="border-b border-gray-50 last:border-0">
                                  <button 
                                    onClick={() => toggleCategory(cat.name)}
                                    className={cn(
                                      "w-full flex items-center justify-between px-4 py-3.5 transition-colors group",
                                      openCategories.includes(cat.name) ? "bg-[#EAF2FF]/50" : "hover:bg-gray-50"
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <cat.icon size={18} className={cn("text-blue-500", !openCategories.includes(cat.name) && "text-gray-400")} />
                                      <span className={cn("text-[14px] font-bold", openCategories.includes(cat.name) ? "text-[#1C2B4F]" : "text-gray-500")}>
                                        {cat.name}
                                      </span>
                                      <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                                        {cat.count}
                                      </span>
                                    </div>
                                    <ChevronDown 
                                      size={16} 
                                      className={cn(
                                        "text-gray-300 transition-transform duration-200",
                                        openCategories.includes(cat.name) ? "rotate-180 text-blue-400" : "rotate-0"
                                      )} 
                                    />
                                  </button>
                                  
                                  <AnimatePresence>
                                    {openCategories.includes(cat.name) && (
                                      <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-white"
                                      >
                                        <div className="py-1">
                                          {cat.items.map((item) => (
                                            <button 
                                              key={item.name}
                                              onClick={() => handleInsertVar(item.name)}
                                              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50/50 group/item transition-colors"
                                            >
                                              <div className="flex items-center gap-3">
                                                <Zap size={14} className="text-blue-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                                <span className="text-[13px] font-mono text-gray-600 group-hover/item:text-[#2A53A0]">
                                                  {item.name}
                                                </span>
                                              </div>
                                              <span className="text-[12px] text-gray-400 font-medium font-mono">
                                                {item.value}
                                              </span>
                                            </button>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                   </div>
                   <div className="relative group">
                     <Textarea 
                       value={message}
                       onChange={(e) => setMessage(e.target.value)}
                       placeholder="Enter the alert message content..."
                       className="min-h-[160px] border-gray-200 rounded-[12px] focus:ring-[#2A53A0] p-4 text-[14px] font-mono bg-white resize-none leading-relaxed transition-all group-hover:border-gray-300"
                     />
                     <div className="absolute bottom-4 right-4 text-[10px] text-gray-400 font-bold tracking-widest bg-white/80 px-2 py-0.5 rounded">
                       {message.length}/500
                     </div>
                   </div>
                </div>

                <div className="space-y-3 pt-2">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-[#525252] uppercase tracking-wider">
                        <Activity size={16} className="text-[#2A53A0]" />
                        Message Preview
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-[#2A53A0] transition-colors"><RefreshCw size={14} /></Button>
                   </div>
                   <div className="bg-[#fff9e6]/50 border border-[#ffe58f] rounded-[12px] p-4 shadow-inner">
                      <p className={cn("text-[14px] leading-relaxed italic", message ? "text-[#856404]" : "text-gray-400")}>
                        {message ? `"${message}"` : "Add a message above to see the preview here."}
                      </p>
                   </div>
                   <div className="flex items-center gap-2 text-[11px] text-gray-400 italic font-normal">
                      <Info size={14} className="text-[#2A53A0]" />
                      Preview shows sample values. Actual values will be populated at runtime.
                   </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* 6. ACTIONS */}
          {(mode === "Quick Mode" || activeStep === 6) && (
            <motion.section 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden pb-8"
              >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAF2FF] flex items-center justify-center text-[#2A53A0] text-[14px] font-bold border border-[#d0e2ff]">6</div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#161616]">Actions <span className="text-gray-400 ml-1 text-[11px] font-normal uppercase bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 tracking-tighter">Optional</span></h2>
                    <p className="text-[12px] text-gray-500 font-normal">Configure automated responses when scenario triggers</p>
                  </div>
                </div>
                <ChevronDown size={20} className="text-gray-300" />
              </div>
              
              {actions.length > 0 ? (
                <div className="p-4 grid grid-cols-2 gap-4">
                  {actions.map((action) => (
                    <div key={action.id} className="p-4 bg-white border border-gray-100 rounded-[12px] shadow-sm flex items-start gap-4 hover:border-blue-200 transition-all group">
                       <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2A53A0]">
                         {action.type.includes('Alert') ? <Activity size={20} /> : <MessageSquare size={20} />}
                       </div>
                       <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[14px] font-bold text-[#161616]">{action.type}</h3>
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px]">Active</Badge>
                          </div>
                          <div className="grid grid-cols-1 gap-1 mt-1">
                             {action.priority && (
                               <div className="text-[11px] text-gray-500 flex items-center gap-1"><span className="font-bold text-gray-400 uppercase">Priority:</span> {action.priority}</div>
                             )}
                             {action.channel && (
                               <div className="text-[11px] text-gray-500 flex items-center gap-1"><span className="font-bold text-gray-400 uppercase">Channel:</span> {action.channel}</div>
                             )}
                             {action.recipient && (
                               <div className="text-[11px] text-gray-500 flex items-center gap-1"><span className="font-bold text-gray-400 uppercase">To:</span> {action.recipient}</div>
                             )}
                          </div>
                       </div>
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500"><Trash2 size={14} /></Button>
                       </div>
                    </div>
                  ))}
                  <button className="border-2 border-dashed border-gray-100 rounded-[12px] p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-200 hover:text-[#2A53A0] transition-all bg-gray-50/30">
                     <Plus size={20} />
                     <span className="text-[12px] font-bold">Add Action</span>
                  </button>
                </div>
              ) : (
                <div className="p-16 flex flex-col items-center justify-center text-center space-y-5">
                   <div className="w-16 h-16 rounded-full bg-[#f8f9fa] flex items-center justify-center text-gray-300 border border-gray-200 shadow-sm group hover:border-blue-200 hover:text-blue-300 transition-all">
                     <Settings size={32} className="group-hover:rotate-45 transition-transform" />
                   </div>
                   <div className="space-y-1.5">
                     <p className="text-[16px] font-bold text-[#161616]">No actions configured</p>
                     <p className="text-[13px] text-gray-400 font-normal max-w-[360px] leading-relaxed italic">Alerts will be generated for review only. Add actions for automated responses.</p>
                   </div>
                </div>
              )}
              
              <div className="px-6">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="outline" className="h-[52px] w-full border-dashed border-gray-300 text-[#2A53A0] font-bold hover:bg-blue-50/50 hover:border-[#2A53A0] gap-2 rounded-[12px] transition-all group">
                          <Plus size={20} className="group-hover:scale-110 transition-transform" />
                          Add Automated Action
                          <ChevronDown size={16} className="text-gray-400" />
                       </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-[500px] p-2 rounded-[12px] shadow-xl border-gray-100">
                       <DropdownMenuItem 
                          onClick={() => setIsRdaModalOpen(true)}
                          className="flex items-center gap-4 p-4 cursor-pointer rounded-[8px] focus:bg-red-50 group"
                       >
                          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-focus:bg-white transition-colors">
                             <Zap size={20} fill="currentColor" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[15px] font-bold text-gray-800 group-focus:text-red-700">Add RDA Response</span>
                             <span className="text-[12px] text-gray-500">Configure real-time automated data responses</span>
                          </div>
                       </DropdownMenuItem>
                       
                       <DropdownMenuItem 
                          onClick={() => setIsApiModalOpen(true)}
                          className="flex items-center gap-4 p-4 cursor-pointer rounded-[8px] focus:bg-blue-50 group"
                       >
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-focus:bg-white transition-colors">
                             <Link size={20} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[15px] font-bold text-gray-800 group-focus:text-blue-700">Add API Call</span>
                             <span className="text-[12px] text-gray-500">Trigger external webhooks or REST API endpoints</span>
                          </div>
                       </DropdownMenuItem>

                       <DropdownMenuItem 
                          onClick={() => setIsTableModalOpen(true)}
                          className="flex items-center gap-4 p-4 cursor-pointer rounded-[8px] focus:bg-emerald-50 group"
                       >
                          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 group-focus:bg-white transition-colors">
                             <Database size={20} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[15px] font-bold text-gray-800 group-focus:text-emerald-700">Add Table Insert</span>
                             <span className="text-[12px] text-gray-500">Log data or results directly into a database table</span>
                          </div>
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
              </div>
            </motion.section>
          )}

          {/* 7. REVIEW (Advanced Mode Only) */}
            {mode === "Advanced Mode" && activeStep === 7 && (
              <motion.section 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden p-10"
              >
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Step 1: Definition</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                        <div><p className="text-gray-400 font-medium">Scenario Name</p><p className="font-bold text-[#161616]">{scenarioName || "N/A"}</p></div>
                        <div><p className="text-gray-400 font-medium">Workspace</p><p className="font-bold text-[#161616]">{workspace || "N/A"}</p></div>
                        <div><p className="text-gray-400 font-medium">Target Entity</p><p className="font-bold text-[#161616]">{triggeringEntity || "N/A"}</p></div>
                        <div><p className="text-gray-400 font-medium">Risk weight</p><p className="font-bold text-[#161616]">{riskWeight}</p></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Operational Controls</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                        <div><p className="text-gray-400 font-medium">Shadow Mode</p><p className={cn("font-bold", shadowMode ? "text-amber-600" : "text-[#161616]")}>{shadowMode ? "Enabled" : "Disabled"}</p></div>
                        <div><p className="text-gray-400 font-medium">RDA Mode</p><p className={cn("font-bold", rdaMode ? "text-red-600" : "text-[#161616]")}>{rdaMode ? "Enabled" : "Disabled"}</p></div>
                        <div><p className="text-gray-400 font-medium">Batch Alert</p><p className="font-bold text-[#161616]">{batchAlert ? frequency : "Off"}</p></div>
                        {frequency === "Custom" && batchAlert && (customFromDate || customToDate) && (
                          <div className="col-span-2"><p className="text-gray-400 font-medium">Custom Date Range</p><p className="font-bold text-[#161616]">{customFromDate || "N/A"} to {customToDate || "N/A"}</p></div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Logic Architecture</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-blue-600 uppercase">Preconditions</span><Badge variant="outline" className="text-[9px]">{conditionType}</Badge></div>
                        <p className="text-[13px] font-mono leading-relaxed text-gray-600 break-words">{conditionType === "Simple" ? logicPreview : expressionValue}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-purple-600 uppercase">Queries</span><Badge variant="outline" className="text-[9px]">{queryConditionType}</Badge></div>
                        <p className="text-[13px] font-mono leading-relaxed text-gray-600 break-words">{queryConditionType === "Simple" ? queryLogicPreview : queryExpressionValue || "None defined"}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-orange-600 uppercase">Trigger Threshold</span><Badge variant="outline" className="text-[9px]">{triggerConditionType}</Badge></div>
                        <p className="text-[13px] font-mono leading-relaxed text-gray-600 break-words">{triggerConditionType === "Simple" ? triggerLogicPreview : triggerExpressionValue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Alert Payload</h3>
                      <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg">
                        <p className="text-[13px] text-amber-800 italic leading-relaxed">"{message}"</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Response Orchestration</h3>
                      <div className="space-y-2">
                        {actions.length > 0 ? actions.map(a => (
                          <div key={a.id} className="flex items-center gap-3 p-2.5 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[#2A53A0]"><Zap size={12} /></div>
                            <span className="text-[12px] font-bold text-[#161616]">{a.type} <span className="text-[10px] text-gray-400 font-normal">({a.priority})</span></span>
                          </div>
                        )) : <p className="text-[12px] text-gray-400 italic">No automated actions configured.</p>}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center border-t border-gray-100">
                    <Button onClick={handleCreate} className="h-[52px] px-12 bg-[#2A53A0] hover:bg-[#1e3d7a] text-white font-bold rounded-[8px] shadow-lg flex items-center gap-2 transition-all active:scale-95"><Send size={20} /> Deploy Scenario</Button>
                  </div>
                </div>
              </motion.section>
            )}

            </div>
          </div>

          {/* FIXED FOOTER - Advanced Mode Only */}
          {mode === "Advanced Mode" && (
            <div className="h-[76px] bg-white border-t border-gray-200 px-8 flex items-center justify-between z-30 shadow-[0_-4px_15px_rgba(0,0,0,0.02)] shrink-0">
              <div className="flex items-center gap-2">
                 {activeStep > 1 && (
                   <Button 
                     variant="outline" 
                     className="h-[48px] px-6 border-gray-300 text-[#525252] hover:bg-gray-50 text-[14px] rounded-[8px] flex items-center gap-2 font-semibold"
                     onClick={handleBack}
                   >
                     <ArrowLeft size={18} strokeWidth={2.5} /> Back
                   </Button>
                 )}
                 <Button 
                   variant="outline" 
                   className="h-[48px] px-8 bg-white hover:bg-gray-50 text-[#525252] border border-gray-300 text-[14px] font-medium rounded-[8px] transition-colors"
                   onClick={onCancel}
                 >
                   Cancel
                 </Button>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  disabled={!isCurrentStepValid}
                  className={cn(
                    "h-[48px] px-6 text-[14px] rounded-[8px] font-bold transition-all",
                    !isCurrentStepValid 
                      ? "border-gray-200 text-gray-400 bg-gray-50/50 cursor-not-allowed" 
                      : "border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50/50"
                  )}
                  onClick={handleSave}
                >
                  Save as Draft
                </Button>
                <Button 
                  disabled={activeStep === STEPS.length ? !isFormValid : !isCurrentStepValid}
                  className={cn(
                    "h-[48px] px-8 font-bold shadow-sm transition-all text-[14px] rounded-[8px]",
                    (activeStep === STEPS.length ? !isFormValid : !isCurrentStepValid)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                      : "bg-[#2A53A0] hover:bg-[#1e3c75] text-white shadow-md active:scale-[0.98]"
                  )}
                  onClick={activeStep === STEPS.length ? handleCreate : handleNext}
                >
                  {activeStep === STEPS.length ? (isEditMode ? "Update Scenario" : "Create Scenario") : "Next Step"}
                </Button>
              </div>
            </div>
          )}
          </div>

        {/* RIGHT SIDEBAR SUMMARY */}
        <aside className="w-[360px] border-l border-gray-200 bg-white flex flex-col shadow-[-4px_0_20px_rgba(0,0,0,0.03)] z-20 sticky top-0 h-full">
          <div className="flex-1 hover-scroll p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4 w-full">
                <h3 className="text-[14px] font-bold text-[#161616] leading-snug truncate flex-1" title={scenarioName || "Untitled Scenario"}>
                  {scenarioName || "Untitled Scenario"}
                </h3>
                <button className="p-1 hover:bg-gray-100 rounded-md transition-all flex-none">
                  <Edit2 size={14} className="text-gray-400" />
                </button>
              </div>
              <Badge className="bg-[#FFF9E5] text-[#B28600] border-0 font-bold px-3 rounded-full text-[10px] uppercase h-[28px] flex items-center justify-center">Draft</Badge>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Context</label>
               <div className="space-y-1.5">
                 <p className="text-[12px] text-[#525252]">Monitoring <span className="font-bold text-[#161616]">{triggeringEntity || "N/A"}</span></p>
                 <div className="flex items-center gap-2 bg-blue-50/30 p-2 rounded-[8px] border border-blue-100/50">
                   <Activity size={14} className="text-[#2A53A0]" />
                   <span className="text-[11px] font-bold text-[#161616] truncate">{scenarioName || "New Scenario"}</span>
                 </div>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Conditions ({conditions.length})</label>
               {conditions.length > 0 ? (
                 <div className="space-y-1.5">
                   {conditions.filter(c => c.type !== 'group').slice(0, 3).map(cond => (
                     <div key={cond.id} className="bg-blue-50/20 border border-blue-100/50 p-2 rounded-[8px] flex items-center justify-between group">
                       <span className="text-[11px] font-medium text-[#161616] truncate flex-1">{cond.field} <span className="text-[#2A53A0]">{cond.operator?.includes('GREATER') ? '>' : (cond.operator || '=')}</span> {cond.value}</span>
                       <Badge className="bg-white text-blue-600 border-blue-100 text-[8px] px-1 h-3.5 leading-none">{cond.category}</Badge>
                     </div>
                   ))}
                   {conditions.length > 3 && (
                     <p className="text-[10px] text-gray-400 font-medium text-center italic">+ {conditions.length - 3} more conditions</p>
                   )}
                 </div>
               ) : (
                 <div className="bg-[#f8f9fa] border border-dashed border-gray-200 rounded-[8px] p-2 text-center">
                   <p className="text-[11px] text-gray-400 italic">None configured</p>
                 </div>
               )}
            </div>

            <div className="space-y-2 bg-gray-50/50 p-3 rounded-[12px] border border-gray-100">
               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Summary Metrics</label>
               <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                 <div className="space-y-0.5">
                   <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Risk Weight</span>
                   <p className="font-bold text-[12px] text-[#161616]">{riskWeight.toFixed(1)}</p>
                 </div>
                 <div className="space-y-0.5">
                   <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Lookback</span>
                   <p className="font-bold text-[12px] text-[#161616]">7 Days</p>
                 </div>
                 <div className="space-y-0.5">
                   <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Calendar</span>
                   <p className="font-bold text-[12px] text-[#161616]">Gregorian</p>
                 </div>
                 <div className="space-y-0.5">
                   <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Group</span>
                   <p className="font-bold text-[12px] text-[#161616] truncate">{group || "Not Set"}</p>
                 </div>
               </div>
            </div>

            <div className="pt-1">
               <div className="bg-white border border-gray-200 rounded-[12px] shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fa]/50">
                     <span className="text-[12px] font-bold text-[#161616]">Performance</span>
                     <button 
                       onClick={handleTestPerformance}
                       disabled={isTestingPerformance}
                       className={cn(
                         "p-1 text-gray-400 hover:text-[#2A53A0] hover:bg-white rounded-md transition-all",
                         isTestingPerformance && "animate-spin text-[#2A53A0]"
                       )}
                     >
                       <RefreshCw size={12} />
                     </button>
                  </div>
                  
                  {isTestingPerformance ? (
                    <div className="p-4 flex flex-col items-center justify-center gap-2 text-center">
                       <div className="flex gap-1 scale-75">
                         <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-blue-400" />
                         <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-blue-500" />
                         <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-blue-600" />
                       </div>
                    </div>
                  ) : performanceResults ? (
                    <div className="p-3 space-y-3">
                       <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-blue-50/50 rounded-[8px] border border-blue-100/50">
                             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Hit Rate</p>
                             <p className="text-[14px] font-bold text-[#2A53A0]">{performanceResults.hitRate}</p>
                          </div>
                          <div className="p-2 bg-emerald-50/50 rounded-[8px] border border-emerald-100/50">
                             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">True Pos.</p>
                             <p className="text-[14px] font-bold text-emerald-600">{performanceResults.truePositive}</p>
                          </div>
                       </div>
                       <button 
                         onClick={handleTestPerformance}
                         className="w-full text-[10px] font-bold text-[#2A53A0] hover:underline"
                       >
                         Re-run Analysis
                       </button>
                    </div>
                  ) : (
                    <div className="p-4 flex flex-col items-center justify-center gap-2 text-center">
                       <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-200 border border-blue-100">
                         <Zap size={16} className="fill-current opacity-20" />
                       </div>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         onClick={handleTestPerformance}
                         className="h-7 text-[10px] font-bold text-[#2A53A0] hover:bg-blue-50"
                       >
                         Test Performance
                       </Button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </aside>
      </div>

      <RdaResponseModal 
        isOpen={isRdaModalOpen} 
        onClose={() => setIsRdaModalOpen(false)} 
        onSave={handleSaveRdaResponse} 
      />
      <ApiCallModal 
        isOpen={isApiModalOpen} 
        onClose={() => setIsApiModalOpen(false)} 
        onSave={handleSaveApiCall} 
      />
      <TableInsertModal 
        isOpen={isTableModalOpen} 
        onClose={() => setIsTableModalOpen(false)} 
        onSave={handleSaveTableInsert} 
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[400px] overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-[#198038]">
                <CheckmarkFilled size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-[20px] font-bold text-[#161616]">Success!</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Your Scenario <strong>"{scenarioName}"</strong> has been created and sent for Approval.
                </p>
              </div>
              <div className="pt-2 w-full">
                <Button 
                  className="w-full h-[46px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
                  onClick={handleFinalSubmit}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Draft Success Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[400px] overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#2A53A0]">
                <Checkmark size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-[20px] font-bold text-[#161616]">Draft Saved</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Your progress on <strong>"{scenarioName || 'Untitled Scenario'}"</strong> has been saved. You can return to complete this configuration at any time.
                </p>
              </div>
              <div className="pt-2 w-full flex flex-col gap-2">
                <Button 
                  className="w-full h-[46px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
                  onClick={handleFinalSaveDraft}
                >
                  Go to My work
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-[46px] border-gray-300 text-gray-600 hover:bg-gray-50 font-bold rounded-[8px] text-[14px]"
                  onClick={() => setShowDraftModal(false)}
                >
                  Continue Editing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
