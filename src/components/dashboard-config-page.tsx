import React, { useState, useEffect } from "react";
import { 
  Document, 
  ChartLine, 
  Trophy, 
  Activity, 
  CheckmarkFilled, 
  User, 
  WarningAlt,
  Information,
  ArrowsVertical
} from "@carbon/icons-react";
import { cn } from "./ui/utils";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { motion as Motion, AnimatePresence } from "motion/react";
import PageHeader from "./page-header";

interface DashletConfig {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
  color: string;
}

const DASHLET_TEMPLATES: DashletConfig[] = [
  { id: "recent-scenarios", title: "Recent Scenarios", description: "View and manage recently modified scenarios", icon: Document, enabled: true, color: "#EAF2FF" },
  { id: "performance-trends", title: "Performance Trends", description: "Track scenario performance over time", icon: ChartLine, enabled: true, color: "#EAF2FF" },
  { id: "top-performers", title: "Top Performers", description: "Scenarios with highest detection rates", icon: Trophy, enabled: true, color: "#EAF2FF" },
  { id: "recent-activity", title: "Recent Activity", description: "Latest changes and updates", icon: Activity, enabled: false, color: "#F4F4F4" },
  { id: "pending-approvals", title: "Pending Approvals", description: "Scenarios awaiting review", icon: CheckmarkFilled, enabled: false, color: "#F4F4F4" },
  { id: "my-scenarios", title: "My Scenarios", description: "Your created and assigned scenarios", icon: User, enabled: true, color: "#EAF2FF" },
  { id: "alerts-summary", title: "Alerts Summary", description: "Overview of triggered alerts", icon: WarningAlt, enabled: true, color: "#EAF2FF" }
];

const ROLE_DATA: Record<string, string[]> = {
  analyst: ["recent-scenarios", "performance-trends", "top-performers", "my-scenarios", "alerts-summary"],
  author: ["recent-scenarios", "my-scenarios", "pending-approvals"],
  admin: ["recent-scenarios", "performance-trends", "top-performers", "recent-activity", "pending-approvals", "my-scenarios", "alerts-summary"]
};

const ROLES = [
  { id: "analyst", label: "Analyst" },
  { id: "author", label: "Author" },
  { id: "admin", label: "Admin" }
];

const THRESHOLDS = [
  { id: "7", label: "7 days", subtext: "More aggressive - identifies issues quickly", isDefault: false },
  { id: "10", label: "10 days", subtext: "Balanced approach for most use cases", isDefault: true },
  { id: "30", label: "30 days", subtext: "Conservative - allows more time for patterns", isDefault: false },
  { id: "60", label: "60 days", subtext: "Very lenient - for low-frequency scenarios", isDefault: false }
];

export function DashboardConfigPage({ 
  breadcrumbs,
  onBreadcrumbNavigate 
}: { 
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate: (path: string) => void;
}) {
  const [activeRole, setActiveRole] = useState("analyst");
  const [dashlets, setDashlets] = useState<DashletConfig[]>([]);
  const [selectedThreshold, setSelectedThreshold] = useState("10");
  const [isDirty, setIsDirty] = useState(false);

  // Initialize dashlets based on active role
  useEffect(() => {
    const enabledIds = ROLE_DATA[activeRole];
    setDashlets(DASHLET_TEMPLATES.map(d => ({
      ...d,
      enabled: enabledIds.includes(d.id)
    })));
  }, [activeRole]);

  const toggleDashlet = (id: string) => {
    setDashlets(prev => prev.map(d => d.id === id ? { ...d, enabled: !d.enabled } : d));
    setIsDirty(true);
  };

  const getEnabledCount = (roleId: string) => {
    if (roleId === activeRole) return dashlets.filter(d => d.enabled).length;
    return ROLE_DATA[roleId].length;
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden animate-in fade-in duration-500">
      <PageHeader 
        title="Dashboard Configuration" 
        breadcrumbs={breadcrumbs} 
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
      />

      {/* Main Page Background changed to White */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Main Configuration Card */}
        <div className="flex-1 p-4 flex flex-col overflow-hidden">
          <div className="flex-1 bg-white border border-[#E0E0E0] rounded-[8px] flex flex-col overflow-hidden shadow-sm">
            
            {/* STICKY HEADER SECTION: User Role Selection */}
            <div className="flex-none flex items-center justify-between p-5 border-b border-[#E0E0E0] bg-white z-10">
              <div className="space-y-1">
                <h3 className="text-[16px] text-[#161616] font-semibold">Select User Role</h3>
                <p className="text-[12px] text-[#525252]">Choose a profile to manage its default configuration</p>
              </div>
              
              {/* Role Switcher with Counts Inside */}
              <div className="flex bg-[#F4F4F4] p-1 rounded-[8px] h-[46px] min-w-[400px]">
                {ROLES.map((role) => {
                  const isActive = activeRole === role.id;
                  const count = getEnabledCount(role.id);
                  return (
                    <button 
                      key={role.id}
                      onClick={() => {
                        if (activeRole !== role.id) {
                          setActiveRole(role.id);
                          setIsDirty(false); // Reset dirty state on role switch for demo
                        }
                      }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 h-full text-[13px] font-medium rounded-[6px] transition-all cursor-pointer whitespace-nowrap px-4",
                        isActive 
                          ? "bg-[#2A53A0] text-white shadow-sm" 
                          : "text-[#525252] hover:bg-[#E5E5E5]"
                      )}
                    >
                      <span>{role.label}</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                        isActive ? "bg-white/20 text-white" : "bg-gray-200 text-[#525252]"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SCROLLABLE BODY SECTION */}
            <div className="p-5 flex-1 space-y-6 overflow-y-auto no-scrollbar">
              
              {/* Section 2: Dashlet Visibility Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-[16px] text-[#161616] font-semibold">Dashlet Visibility Configuration</h3>
                    <p className="text-[12px] text-[#525252]">Control which dashlets are visible for the {ROLES.find(r => r.id === activeRole)?.label} role</p>
                  </div>
                  {/* Summary badge removed as count is now inside the role switcher */}
                </div>

                <div className="border-t border-[#E0E0E0] -mx-5" />

                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {dashlets.map((dashlet) => (
                      <Motion.div 
                        key={dashlet.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-4 p-3 border border-gray-100 rounded-[8px] hover:bg-gray-50 transition-colors group"
                      >
                        <div className="cursor-grab text-gray-300 hover:text-gray-500">
                          <ArrowsVertical size={16} />
                        </div>
                        <div className={cn(
                          "w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 transition-colors",
                          dashlet.enabled ? "bg-[#EAF2FF] text-[#2A53A0]" : "bg-gray-100 text-gray-400"
                        )}>
                          <dashlet.icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-medium text-[#161616] truncate">{dashlet.title}</h4>
                          <p className="text-[12px] text-[#525252] truncate">{dashlet.description}</p>
                        </div>
                        <Switch 
                          checked={dashlet.enabled} 
                          onCheckedChange={() => toggleDashlet(dashlet.id)}
                          className="data-[state=checked]:bg-[#2A53A0]"
                        />
                      </Motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Section 3: Threshold Configuration */}
              <div className="space-y-4 pt-4">
                <div className="space-y-1">
                  <h3 className="text-[16px] text-[#161616] font-semibold">Non-Performing Scenario Threshold</h3>
                  <p className="text-[12px] text-[#525252]">Define when a scenario is considered non-performing for this profile</p>
                </div>
                
                <div className="border-t border-[#E0E0E0] -mx-5" />

                <div className="grid grid-cols-2 gap-3">
                  {THRESHOLDS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedThreshold(t.id);
                        setIsDirty(true);
                      }}
                      className={cn(
                        "flex items-center gap-4 p-4 border rounded-[8px] text-left transition-all",
                        selectedThreshold === t.id 
                          ? "border-[#2A53A0] bg-[#F0F5FF] shadow-[0_0_0_1px_#2A53A0]" 
                          : "border-gray-200 bg-white hover:border-[#2A53A0]"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        selectedThreshold === t.id ? "border-[#2A53A0]" : "border-gray-300"
                      )}>
                        {selectedThreshold === t.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#2A53A0]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-medium text-[#161616]">{t.label}</span>
                          {t.isDefault && (
                            <Badge className="bg-[#198038] text-white border-0 text-[10px] h-[18px] px-1.5 font-bold uppercase rounded-[4px]">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-[12px] text-[#525252] mt-0.5">{t.subtext}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Information Alert Block */}
              <div className="mt-6 bg-[#EAF2FF] border border-[#D0E2FF] rounded-[8px] p-4 flex gap-3">
                <Information size={20} className="text-[#0043CE] shrink-0" />
                <div className="space-y-1">
                  <h5 className="text-[14px] font-medium text-[#0043CE]">Configuration Rules</h5>
                  <p className="text-[12px] text-[#0043CE]/80 leading-relaxed">
                    Changes applied here will affect all users assigned to the <span className="font-bold">{ROLES.find(r => r.id === activeRole)?.label}</span> role across the organization. Personal dashboard customizations remain individual.
                  </p>
                </div>
              </div>
            </div>

            {/* FIXED FOOTER SECTION */}
            <div className="flex-none flex justify-end gap-3 p-4 border-t border-[#E0E0E0] bg-[#FBFBFB]">
              <Button 
                variant="ghost" 
                onClick={() => {
                  const enabledIds = ROLE_DATA[activeRole];
                  setDashlets(DASHLET_TEMPLATES.map(d => ({
                    ...d,
                    enabled: enabledIds.includes(d.id)
                  })));
                  setSelectedThreshold("10");
                  setIsDirty(false);
                }}
                disabled={!isDirty}
                className={cn(
                  "h-[48px] px-8 rounded-[8px] border border-[#C6C6C6] font-normal transition-colors",
                  !isDirty 
                    ? "bg-[#F4F4F4] text-[#A8A8A8] border-[#E0E0E0] cursor-not-allowed" 
                    : "bg-white text-[#525252] hover:bg-gray-100"
                )}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  alert("Dashboard configuration saved successfully.");
                  setIsDirty(false);
                }}
                disabled={!isDirty}
                className={cn(
                  "h-[48px] px-10 rounded-[8px] font-medium shadow-sm transition-all active:scale-95",
                  !isDirty 
                    ? "bg-[#E0E0E0] text-[#A8A8A8] cursor-not-allowed" 
                    : "bg-[#2A53A0] hover:bg-[#1A3A7A] text-white"
                )}
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
