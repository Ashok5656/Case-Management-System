import React, { useState } from "react";
import { 
  ChevronLeft, 
  Close, 
  Settings, 
  Flash, 
  Help, 
  Information,
  Checkmark,
  CheckmarkFilled,
  WarningFilled,
  Layers,
  SettingsAdjust,
  Catalog,
  Search,
  ChevronRight,
  Code
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import PageHeader from "./page-header";

interface CreateUDVPageProps {
  onBack: () => void;
  onSave: (data: any) => void;
  onSaveDraft: (data: any) => void;
  breadcrumbs: any[];
  onBreadcrumbNavigate: (path: string) => void;
  title?: string;
  initialData?: any;
}

const ENTITIES = ["Account", "Card", "Customer", "Merchant", "Transaction", "System"];
const EVENTS = ["Card Transaction", "ATM Withdrawal", "POS Purchase", "Mobile Login", "Fund Transfer", "Account Opening"];

const CATEGORIES = ["All", "Aggregation", "Counting", "Statistical", "Velocity"];

const METHODS = [
  { id: "count", name: "Count", description: "Number of occurrences over a time window", icon: Catalog, category: "Counting", type: "Decimal" },
  { id: "sum", name: "Sum", description: "Total numeric sum of a field over a time window", icon: Flash, category: "Aggregation", type: "Decimal" },
  { id: "avg", name: "Average", description: "Mean value of a numeric field over a time window", icon: SettingsAdjust, category: "Statistical", type: "Decimal" },
  { id: "max", name: "Maximum", description: "Highest value observed in a time window", icon: Code, category: "Aggregation", type: "Decimal" },
  { id: "min", name: "Minimum", description: "Lowest value observed in a time window", icon: Code, category: "Aggregation", type: "Decimal" },
  { id: "distinct", name: "Distinct Count", description: "Number of unique values for a specific field", icon: Layers, category: "Counting", type: "Decimal" },
];

export function CreateUDVPage({ 
  onBack, 
  onSave, 
  onSaveDraft, 
  breadcrumbs, 
  onBreadcrumbNavigate,
  title = "Create Custom UDV",
  initialData
}: CreateUDVPageProps) {
  const [variableName, setVariableName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [entity, setEntity] = useState<string>(initialData?.entity || "");
  const [event, setEvent] = useState<string>(initialData?.mappedToEvent || "");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(initialData?.config?.method || null);
  const [searchMethod, setSearchMethod] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Success states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);

  // Parameter states
  const [paramAmount, setParamAmount] = useState(initialData?.config?.amount || "");
  const [paramChannel, setParamChannel] = useState(initialData?.config?.channel || "ALL");
  const [paramTimePeriod, setParamTimePeriod] = useState(initialData?.config?.timePeriod || "");
  const [paramTargetField, setParamTargetField] = useState(initialData?.config?.targetField || "");
  const [piiClassification, setPiiClassification] = useState(initialData?.piiClassification || "None");

  const filteredMethods = METHODS.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchMethod.toLowerCase()) ||
                         m.description.toLowerCase().includes(searchMethod.toLowerCase());
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const canShowMethods = variableName.trim() !== "" && entity && event;

  // Parameters are already initialized from initialData in the useState hooks above.
  // We remove the auto-reset useEffect to prevent wiping data when editing drafts.

  const handleCreate = () => {
    setShowSuccessModal(true);
  };

  const handleFinalSubmit = () => {
    setShowSuccessModal(false);
    if (!variableName || !entity || !event || !selectedMethod) return;
    onSave({
      id: initialData?.id,
      name: variableName,
      description,
      entity,
      mappedToEvent: event,
      type: "Decimal",
      status: "Pending",
      usedInScenarioCount: 0,
      piiClassification,
      config: {
        method: selectedMethod,
        amount: paramAmount,
        channel: paramChannel,
        timePeriod: paramTimePeriod,
        targetField: paramTargetField
      },
      artifactType: "udv"
    });
  };

  const handleSaveDraft = () => {
    setShowDraftModal(true);
  };

  const handleFinalSaveDraft = () => {
    setShowDraftModal(false);
    if (!variableName) return;
    onSaveDraft({
      id: initialData?.id,
      name: variableName,
      description,
      entity,
      mappedToEvent: event,
      type: "Decimal",
      status: "Draft",
      usedInScenarioCount: 0,
      config: {
        method: selectedMethod,
        amount: paramAmount,
        channel: paramChannel,
        timePeriod: paramTimePeriod,
        targetField: paramTargetField
      },
      artifactType: "udv"
    });
  };

  const renderParameters = () => {
    if (!selectedMethod) return null;

    const methodData = METHODS.find(m => m.id === selectedMethod);
    const needsTargetField = ["sum", "avg", "max", "min", "distinct"].includes(selectedMethod);

    return (
      <div className="space-y-6">
        {/* Target Field (Conditional) */}
        {needsTargetField && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#161616]">
                Target Field <span className="text-[#DA1E28]">*</span>
              </label>
              <Badge variant="outline" className="bg-[#F4F4F4] text-[#878D96] border-[#E0E0E0] px-1.5 py-0 rounded-sm text-[10px] font-normal lowercase">
                attribute
              </Badge>
            </div>
            <Select value={paramTargetField} onValueChange={setParamTargetField}>
              <SelectTrigger className="!h-[46px] border-[#C6C6C6] rounded-[8px] font-normal text-[13px] bg-white">
                <SelectValue placeholder="Select attribute..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRANSACTION_AMOUNT">TRANSACTION_AMOUNT</SelectItem>
                <SelectItem value="TRANSACTION_ID">TRANSACTION_ID</SelectItem>
                <SelectItem value="MERCHANT_ID">MERCHANT_ID</SelectItem>
                <SelectItem value="DEVICE_ID">DEVICE_ID</SelectItem>
                <SelectItem value="IP_ADDRESS">IP_ADDRESS</SelectItem>
              </SelectContent>
            </Select>
            <div className="p-3 bg-[#EDF5FF] border border-[#D0E2FF] rounded-sm flex items-center gap-2 text-[#0043CE]">
              <Information size={16} />
              <span className="text-[12px] font-normal">Select the event attribute to {methodData?.name.toLowerCase()}.</span>
            </div>
          </div>
        )}

        {/* Amount Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#161616]">
              Amount <span className="text-[#DA1E28]">*</span>
            </label>
            <Badge variant="outline" className="bg-[#F4F4F4] text-[#878D96] border-[#E0E0E0] px-1.5 py-0 rounded-sm text-[10px] font-normal lowercase">
              string
            </Badge>
          </div>
          <Input 
            placeholder="e.g., >500" 
            value={paramAmount}
            onChange={(e) => setParamAmount(e.target.value)}
            className="!h-[46px] border-[#C6C6C6] rounded-[8px] font-normal text-[13px] bg-white w-full" 
          />
          <div className="p-4 bg-[#EDF5FF] border border-[#D0E2FF] rounded-sm space-y-2">
            <div className="flex items-center gap-2 text-[#0043CE]">
              <Information size={16} />
              <span className="text-[12px] font-semibold font-normal">Enter operator followed by value:</span>
            </div>
            <ul className="text-[12px] text-[#0043CE] space-y-1 ml-6 list-disc font-normal opacity-90">
              <li>&gt;1000 (Transactions above 1,000)</li>
              <li>&gt;=500 (Transactions 500 and above)</li>
              <li>&lt;100 (Transactions below 100)</li>
              <li>BETWEEN 1000 AND 5000</li>
              <li>ALL (No filter)</li>
            </ul>
          </div>
        </div>

        {/* Channel Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#161616]">
              Channel <span className="text-[#DA1E28]">*</span>
            </label>
            <Badge variant="outline" className="bg-[#F4F4F4] text-[#878D96] border-[#E0E0E0] px-1.5 py-0 rounded-sm text-[10px] font-normal lowercase">
              select
            </Badge>
          </div>
          <Select value={paramChannel} onValueChange={setParamChannel}>
            <SelectTrigger className="!h-[46px] border-[#C6C6C6] rounded-[8px] font-normal text-[13px] bg-white">
              <SelectValue placeholder="Select option..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ATM">ATM</SelectItem>
              <SelectItem value="POS">POS</SelectItem>
              <SelectItem value="ONLINE">ONLINE</SelectItem>
              <SelectItem value="MOBILE">MOBILE</SelectItem>
              <SelectItem value="BRANCH">BRANCH</SelectItem>
              <SelectItem value="PHONE">PHONE</SelectItem>
              <SelectItem value="ALL">ALL</SelectItem>
            </SelectContent>
          </Select>
          <div className="p-3 bg-[#EDF5FF] border border-[#D0E2FF] rounded-sm flex items-center gap-2 text-[#0043CE]">
            <Information size={16} />
            <span className="text-[12px] font-normal">Select the transaction channel to filter.</span>
          </div>
        </div>

        {/* Time Period Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#161616]">
              Time Period <span className="text-[#DA1E28]">*</span>
            </label>
            <Badge variant="outline" className="bg-[#F4F4F4] text-[#878D96] border-[#E0E0E0] px-1.5 py-0 rounded-sm text-[10px] font-normal lowercase">
              select
            </Badge>
          </div>
          <Select value={paramTimePeriod} onValueChange={setParamTimePeriod}>
            <SelectTrigger className={cn(
              "!h-[46px] border-[#C6C6C6] rounded-[8px] font-normal text-[13px] bg-white",
              !paramTimePeriod && "border-[#DA1E28]"
            )}>
              <SelectValue placeholder="Select option..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1H</SelectItem>
              <SelectItem value="6h">6H</SelectItem>
              <SelectItem value="12h">12H</SelectItem>
              <SelectItem value="24h">24H</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
              <SelectItem value="90d">90D</SelectItem>
              <SelectItem value="365d">365D</SelectItem>
            </SelectContent>
          </Select>
          {!paramTimePeriod && (
            <div className="flex items-center gap-1.5 text-[#DA1E28]">
              <WarningFilled size={14} />
              <span className="text-[12px] font-semibold font-normal">Required</span>
            </div>
          )}
          <div className="p-3 bg-[#EDF5FF] border border-[#D0E2FF] rounded-sm flex items-center gap-2 text-[#0043CE]">
            <Information size={16} />
            <span className="text-[12px] font-normal">Select the lookback period for data aggregation.</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F4F4] overflow-hidden">
      {/* Carbon Standard Header */}
      <PageHeader 
        title="Create Custom UDV"
        breadcrumbs={breadcrumbs}
        onBack={onBack}
        onBreadcrumbNavigate={onBreadcrumbNavigate}
      />

      {/* Primary Configuration Section */}
      <div className="flex-none bg-white border-b border-gray-200 p-4 z-10">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="space-y-1.5 col-span-3">
            <label className="text-[13px] font-semibold text-[#161616] flex items-center gap-1">
              Variable Name <span className="text-[#DA1E28]">*</span>
            </label>
            <Input 
              placeholder="e.g., CARD_HIGH_VALUE_30D" 
              value={variableName}
              onChange={(e) => setVariableName(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
              className="!h-[46px] border-[#C6C6C6] focus:ring-1 focus:ring-[#2A53A0] rounded-[8px] text-[13px] font-normal bg-white w-full"
            />
          </div>
          <div className="space-y-1.5 col-span-2">
            <label className="text-[13px] font-semibold text-[#161616] flex items-center gap-1">
              Entity <span className="text-[#DA1E28]">*</span>
            </label>
            <Select value={entity} onValueChange={setEntity}>
              <SelectTrigger className="!h-[46px] border-[#C6C6C6] rounded-[8px] text-[13px] font-normal bg-white">
                <SelectValue placeholder="Select entity..." />
              </SelectTrigger>
              <SelectContent>
                {ENTITIES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 col-span-2">
            <label className="text-[13px] font-semibold text-[#161616] flex items-center gap-1">
              Event <span className="text-[#DA1E28]">*</span>
            </label>
            <Select value={event} onValueChange={setEvent}>
              <SelectTrigger className="!h-[46px] border-[#C6C6C6] rounded-[8px] text-[13px] font-normal bg-white">
                <SelectValue placeholder="Select event..." />
              </SelectTrigger>
              <SelectContent>
                {EVENTS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 col-span-5">
            <label className="text-[13px] font-semibold text-[#161616]">Description</label>
            <Input 
              placeholder="Brief description..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="!h-[46px] border-[#C6C6C6] focus:ring-1 focus:ring-[#2A53A0] rounded-[8px] text-[13px] font-normal bg-white w-full"
            />
          </div>
        </div>
      </div>

      {/* Selection & Detail Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Method Library */}
        <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col">
          {!canShowMethods ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 bg-[#FBFBFB]">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-300 shadow-sm">
                <Layers size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-[14px] font-semibold text-[#161616] font-normal">Method Library Locked</h4>
                <p className="text-[12px] text-[#525252] max-w-[240px] leading-relaxed font-normal">
                  Please complete the <strong>Variable Name</strong>, <strong>Entity</strong>, and <strong>Event</strong> fields to unlock aggregation methods.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 text-[#2A53A0]"><Layers size={20} /></div>
                    <h3 className="text-[14px] font-bold text-[#161616]">Method Library</h3>
                  </div>
                  <span className="text-[12px] text-[#525252] font-normal">{METHODS.length} methods</span>
                </div>
                
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search methods..." 
                    value={searchMethod}
                    onChange={(e) => setSearchMethod(e.target.value)}
                    className="pl-10 h-[38px] bg-[#F4F4F4] border-transparent focus:bg-white focus:border-[#2A53A0] rounded-lg text-[13px] font-normal"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[12px] font-normal transition-colors border",
                        selectedCategory === cat
                          ? "bg-[#2A53A0] text-white border-[#2A53A0]"
                          : "bg-white text-[#525252] border-[#E0E0E0] hover:bg-gray-50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <ScrollArea className="flex-1 overflow-y-auto border-t border-gray-100">
                <div className="p-4 flex flex-col gap-4">
                  {filteredMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(prev => prev === method.id ? null : method.id)}
                      className={cn(
                        "w-full flex items-start gap-3 p-4 text-left transition-all rounded-sm group border-l-4",
                        selectedMethod === method.id 
                          ? "bg-[#EAF2FF] border-[#2A53A0]" 
                          : "bg-white border-transparent hover:border-gray-200"
                      )}
                    >
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className={cn("text-[13px] font-semibold truncate font-normal", selectedMethod === method.id ? "text-[#2A53A0]" : "text-[#161616]")}>
                            {(event || "Event")} {method.name}
                          </h4>
                          <span className="text-[11px] font-medium text-[#2A53A0] bg-[#EAF2FF] px-1.5 py-0.5 rounded-sm tracking-tight">
                            {method.type}
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-[#525252] line-clamp-2 leading-snug font-normal">
                          Calculates the total {method.name.toLowerCase()} of {(event || "event").toLowerCase()} based on specified filters.
                        </p>

                        <div className="bg-[#F8F9FA] px-2 py-1.5 rounded-sm border border-[#E0E0E0] font-mono text-[10px] text-[#525252] flex items-center gap-2 overflow-hidden">
                          <span className="text-[8px] font-bold text-[#878D96] shrink-0">LOGIC:</span>
                          <span className="truncate">
                            {method.id.toUpperCase()}({(entity || "entity").toLowerCase()}.{(event || "event").toLowerCase().replace(/\s+/g, '_')})
                          </span>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <span className="text-[10px] bg-white border border-[#E0E0E0] px-1.5 py-0.5 rounded-sm text-[#525252] font-normal">
                            {method.category}
                          </span>
                          <span className="text-[10px] text-[#878D96] font-mono uppercase truncate">
                            {variableName || "UDV_NAME"}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        {/* Right Column: Configuration Area */}
        <div className="flex-1 bg-[#FBFBFB] flex flex-col p-4 overflow-y-auto relative">
          {!selectedMethod ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-200 mx-auto shadow-sm">
                <SettingsAdjust size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-semibold text-[#161616] font-normal">Configuration Parameter</h3>
                <p className="text-[13px] text-[#525252] max-w-[300px] leading-relaxed font-normal mx-auto">
                  Pick a calculation method from the library to set its specific thresholds and windows.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Method Detail Header from Reference */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[24px] font-semibold text-[#2A53A0] font-normal">
                    {event} {METHODS.find(m => m.id === selectedMethod)?.name}
                  </h2>
                  <Badge className="bg-[#EAF2FF] text-[#2A53A0] border-none px-3 py-1 rounded-sm text-[11px] font-medium tracking-wider">
                    Decimal
                  </Badge>
                </div>
                
                <p className="text-[14px] text-[#525252] font-normal leading-relaxed">
                  Calculates the total {METHODS.find(m => m.id === selectedMethod)?.name.toLowerCase()} of {event.toLowerCase()} {entity.toLowerCase()} based on specified filters.
                </p>

                <div className="bg-[#FBFBFB] border border-[#E0E0E0] rounded-sm p-3 font-mono text-[13px] flex items-center gap-3">
                  <span className="text-[#878D96] font-semibold uppercase tracking-tighter">Logic:</span>
                  <span className="text-[#161616] font-normal">
                    {selectedMethod?.toUpperCase()}({entity.toLowerCase()}.{event.toLowerCase().replace(/\s+/g, '_')}{paramTargetField ? `.${paramTargetField}` : ""})
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-[#F4F4F4] text-[#525252] border-[#E0E0E0] px-2 py-0.5 rounded-sm text-[12px] font-normal">
                    {METHODS.find(m => m.id === selectedMethod)?.category}
                  </Badge>
                  <span className="text-[12px] text-[#878D96] font-mono uppercase">
                    {variableName || "VARIABLE_NAME_PLACEHOLDER"}
                  </span>
                </div>
              </div>

              {/* PII Classification */}
              <div className="bg-white border border-[#E0E0E0] rounded-[8px] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Security size={20} className="text-[#2A53A0]" />
                    <h3 className="text-[16px] font-bold text-[#161616]">PII Classification</h3>
                  </div>
                  <Badge className={cn(
                    "border-0 px-3 h-6 text-[11px] font-bold uppercase rounded-md",
                    piiClassification === "None" ? "bg-gray-100 text-gray-600" : piiClassification === "PII" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                  )}>
                    {piiClassification}
                  </Badge>
                </div>
                <p className="text-[13px] text-gray-500">Classify the data privacy level for the output of this UDV.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "None", label: "Non-PII", desc: "Public or internal non-sensitive data" },
                    { value: "PII", label: "PII", desc: "Contains identifiable user information" },
                    { value: "Sensitive", label: "Sensitive", desc: "Highly sensitive or financial data" }
                  ].map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setPiiClassification(level.value)}
                      className={cn(
                        "flex flex-col gap-1 p-3 text-left border rounded-lg transition-all",
                        piiClassification === level.value 
                          ? "bg-[#edf5ff] border-[#2A53A0] ring-1 ring-[#2A53A0]/20" 
                          : "bg-white border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <span className={cn("text-[12px] font-bold uppercase", piiClassification === level.value ? "text-[#2A53A0]" : "text-[#161616]")}>
                        {level.label}
                      </span>
                      <span className="text-[10px] text-gray-500 leading-tight">{level.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Method Parameter Configuration */}
              {renderParameters()}

              <div className="p-4 bg-[#EAF2FF] border-l-4 border-[#2A53A0] flex gap-3 rounded-r-sm mt-8">
                <Information size={18} className="text-[#2A53A0] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[13px] font-semibold text-[#2A53A0] font-normal">Logic Summary</p>
                  <p className="text-[12px] text-[#2A53A0] leading-relaxed font-normal opacity-90">
                    The engine will iterate through <strong>{event}</strong> records tied to the <strong>{entity}</strong> and apply a <strong>{METHODS.find(m => m.id === selectedMethod)?.name}</strong> operation{paramTargetField ? <> on <strong>{paramTargetField}</strong></> : ""}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions - Matching Create Event style */}
      <div className="flex-none bg-white border-t border-gray-200 flex items-center shadow-md z-20 p-4">
        <div className="w-full flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="h-[48px] px-6 border-[#C6C6C6] text-[#525252] hover:bg-gray-50 rounded-[8px] font-medium font-normal text-[13px]"
          >
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="h-[48px] px-6 border-[#C6C6C6] text-[#525252] hover:bg-gray-50 rounded-[8px] font-medium font-normal text-[13px]"
              onClick={handleSaveDraft}
              disabled={!variableName}
            >
              Save as Draft
            </Button>
            <Button 
              disabled={!variableName || !entity || !event || !selectedMethod}
              onClick={handleCreate}
              className="h-[48px] px-8 bg-[#2A53A0] hover:bg-[#1E3C75] text-white rounded-[8px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-normal text-[13px]"
            >
              Submit for Verification
            </Button>
          </div>
        </div>
      </div>

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
                  Your Custom UDV <strong>"{variableName}"</strong> has been created and sent for Approval.
                </p>
              </div>
              <div className="pt-2 w-full">
                <Button 
                  className="w-full h-[48px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
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
                  Your progress on <strong>"{variableName || 'Untitled UDV'}"</strong> has been saved. You can return to complete this configuration at any time.
                </p>
              </div>
              <div className="pt-2 w-full flex flex-col gap-2">
                <Button 
                  className="w-full h-[48px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white font-bold rounded-[8px] text-[14px]"
                  onClick={handleFinalSaveDraft}
                >
                  Go to My work
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-[48px] border-gray-300 text-gray-600 hover:bg-gray-50 font-bold rounded-[8px] text-[14px]"
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
