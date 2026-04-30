import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Layers, 
  RotateCcw, 
  ChevronDown, 
  Circle,
  Users
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { motion, AnimatePresence } from "motion/react";
import PageHeader from "./page-header";
import { Clari5Loader } from "./clari5-loader";
import { SuccessDialog } from "./success-dialog";
import { ChangesSummaryDialog } from "./changes-summary-dialog";
import { Checkmark } from "@carbon/icons-react";

interface RetentionPolicy {
  id: string;
  label: string;
  value: number;
  defaultValue: number;
}

interface ArtifactLimit {
  id: string;
  label: string;
  value: number;
  used: number;
}

interface GroupPermission {
  groupId: string;
  groupName: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canExecute: boolean;
}

interface Workspace {
  id: string;
  name: string;
  keyEntity: string;
}

export function SettingsTabView({
  breadcrumbs,
  onBreadcrumbNavigate,
  workspaces,
  approvedSettings,
  onSubmit
}: {
  breadcrumbs?: any[];
  onBreadcrumbNavigate?: (path: string) => void;
  workspaces?: Workspace[];
  approvedSettings?: Record<string, any>;
  onSubmit?: (data: any) => void;
}) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaces?.[0]?.id || "ws1");
  const [isRetentionOpen, setIsRetentionOpen] = useState(true);
  const [isArtifactsOpen, setIsArtifactsOpen] = useState(true);
  const [isGroupPermissionsOpen, setIsGroupPermissionsOpen] = useState(true);

  const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>([
    { id: "sec", label: "SEC Event Retention", value: 120, defaultValue: 90 },
  ]);

  const [artifactLimits, setArtifactLimits] = useState<ArtifactLimit[]>([
    { id: "scenarios", label: "Max Active Scenarios", value: 100, used: 45 },
    { id: "secs", label: "Max SECs", value: 500, used: 234 },
    { id: "views", label: "Max Views", value: 300, used: 156 },
    { id: "topx", label: "Max TopX", value: 100, used: 42 },
  ]);

  const [groupPermissions, setGroupPermissions] = useState<GroupPermission[]>([
    { groupId: "gp1", groupName: "EFM", canRead: true, canWrite: true, canDelete: true, canExecute: true },
    { groupId: "gp2", groupName: "AML", canRead: true, canWrite: true, canDelete: false, canExecute: true },
    { groupId: "gp3", groupName: "KYC", canRead: true, canWrite: true, canDelete: false, canExecute: false },
    { groupId: "gp4", groupName: "Card Fraud", canRead: true, canWrite: false, canDelete: false, canExecute: false },
    { groupId: "gp5", groupName: "Internal Fraud", canRead: true, canWrite: true, canDelete: true, canExecute: true },
    { groupId: "gp6", groupName: "Compliance", canRead: true, canWrite: false, canDelete: false, canExecute: false },
    { groupId: "gp7", groupName: "Risk Assessment", canRead: true, canWrite: true, canDelete: false, canExecute: true },
    { groupId: "gp8", groupName: "Transaction Monitoring", canRead: true, canWrite: true, canDelete: false, canExecute: true },
    { groupId: "gp9", groupName: "Sanctions Screening", canRead: true, canWrite: false, canDelete: false, canExecute: false },
    { groupId: "gp10", groupName: "Customer Due Diligence", canRead: true, canWrite: true, canDelete: false, canExecute: false },
  ]);

  // Dialog states
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Track original values for dirty checking
  const [originalRetentionPolicies, setOriginalRetentionPolicies] = useState<RetentionPolicy[]>([
    { id: "sec", label: "SEC Event Retention", value: 120, defaultValue: 90 },
  ]);
  const [originalArtifactLimits, setOriginalArtifactLimits] = useState<ArtifactLimit[]>([
    { id: "scenarios", label: "Max Active Scenarios", value: 100, used: 45 },
    { id: "secs", label: "Max SECs", value: 500, used: 234 },
    { id: "views", label: "Max Views", value: 300, used: 156 },
    { id: "topx", label: "Max TopX", value: 100, used: 42 },
  ]);
  const [originalGroupPermissions, setOriginalGroupPermissions] = useState<GroupPermission[]>([
    { groupId: "gp1", groupName: "EFM", canRead: true, canWrite: true, canDelete: true, canExecute: true },
    { groupId: "gp2", groupName: "AML", canRead: true, canWrite: true, canDelete: false, canExecute: true },
    { groupId: "gp3", groupName: "KYC", canRead: true, canWrite: true, canDelete: false, canExecute: false },
    { groupId: "gp4", groupName: "Card Fraud", canRead: true, canWrite: false, canDelete: false, canExecute: false },
    { groupId: "gp5", groupName: "Internal Fraud", canRead: true, canWrite: true, canDelete: true, canExecute: true },
    { groupId: "gp6", groupName: "Compliance", canRead: true, canWrite: false, canDelete: false, canExecute: false },
    { groupId: "gp7", groupName: "Risk Assessment", canRead: true, canWrite: true, canDelete: false, canExecute: true },
    { groupId: "gp8", groupName: "Transaction Monitoring", canRead: true, canWrite: true, canDelete: false, canExecute: true },
    { groupId: "gp9", groupName: "Sanctions Screening", canRead: true, canWrite: false, canDelete: false, canExecute: false },
    { groupId: "gp10", groupName: "Customer Due Diligence", canRead: true, canWrite: true, canDelete: false, canExecute: false },
  ]);
  const [isDirty, setIsDirty] = useState(false);

  const selectedWorkspace = workspaces?.find(w => w.id === selectedWorkspaceId) || 
    { id: selectedWorkspaceId, name: selectedWorkspaceId === "ws1" ? "Account" : selectedWorkspaceId === "ws2" ? "Customer" : "Non-Customer", keyEntity: "" };

  // Load approved settings when workspace is selected
  useEffect(() => {
    if (selectedWorkspace && approvedSettings?.[selectedWorkspace.name]) {
      const config = approvedSettings[selectedWorkspace.name];
      
      // Load retention policies if they exist in approved config
      if (config.retentionPolicies) {
        setRetentionPolicies(config.retentionPolicies);
        setOriginalRetentionPolicies(config.retentionPolicies);
      }
      
      // Load artifact limits if they exist in approved config
      if (config.artifactLimits) {
        setArtifactLimits(config.artifactLimits);
        setOriginalArtifactLimits(config.artifactLimits);
      }
      
      // Load group permissions if they exist in approved config
      if (config.groupPermissions) {
        setGroupPermissions(config.groupPermissions);
        setOriginalGroupPermissions(config.groupPermissions);
      }
      
      setIsDirty(false);
    } else {
      // Reset to default if no approved config
      const defaultPolicies = [
        { id: "sec", label: "SEC Event Retention", value: 120, defaultValue: 90 },
      ];
      const defaultArtifactLimits = [
        { id: "scenarios", label: "Max Active Scenarios", value: 100, used: 45 },
        { id: "secs", label: "Max SECs", value: 500, used: 234 },
        { id: "views", label: "Max Views", value: 300, used: 156 },
        { id: "topx", label: "Max TopX", value: 100, used: 42 },
      ];
      const defaultGroupPermissions = [
        { groupId: "gp1", groupName: "EFM", canRead: true, canWrite: true, canDelete: true, canExecute: true },
        { groupId: "gp2", groupName: "AML", canRead: true, canWrite: true, canDelete: false, canExecute: true },
        { groupId: "gp3", groupName: "KYC", canRead: true, canWrite: true, canDelete: false, canExecute: false },
        { groupId: "gp4", groupName: "Card Fraud", canRead: true, canWrite: false, canDelete: false, canExecute: false },
        { groupId: "gp5", groupName: "Internal Fraud", canRead: true, canWrite: true, canDelete: true, canExecute: true },
        { groupId: "gp6", groupName: "Compliance", canRead: true, canWrite: false, canDelete: false, canExecute: false },
        { groupId: "gp7", groupName: "Risk Assessment", canRead: true, canWrite: true, canDelete: false, canExecute: true },
        { groupId: "gp8", groupName: "Transaction Monitoring", canRead: true, canWrite: true, canDelete: false, canExecute: true },
        { groupId: "gp9", groupName: "Sanctions Screening", canRead: true, canWrite: false, canDelete: false, canExecute: false },
        { groupId: "gp10", groupName: "Customer Due Diligence", canRead: true, canWrite: true, canDelete: false, canExecute: false },
      ];
      setRetentionPolicies(defaultPolicies);
      setOriginalRetentionPolicies(defaultPolicies);
      setArtifactLimits(defaultArtifactLimits);
      setOriginalArtifactLimits(defaultArtifactLimits);
      setGroupPermissions(defaultGroupPermissions);
      setOriginalGroupPermissions(defaultGroupPermissions);
      setIsDirty(false);
    }
  }, [selectedWorkspaceId, selectedWorkspace, approvedSettings]);

  // Check if dirty
  useEffect(() => {
    const hasChanges = JSON.stringify(retentionPolicies) !== JSON.stringify(originalRetentionPolicies) ||
                       JSON.stringify(artifactLimits) !== JSON.stringify(originalArtifactLimits) ||
                       JSON.stringify(groupPermissions) !== JSON.stringify(originalGroupPermissions);
    setIsDirty(hasChanges);
  }, [retentionPolicies, originalRetentionPolicies, artifactLimits, originalArtifactLimits, groupPermissions, originalGroupPermissions]);

  const handleRetentionChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setRetentionPolicies(prev => prev.map(p => p.id === id ? { ...p, value: numValue } : p));
  };

  const handleResetRetention = (id: string) => {
    setRetentionPolicies(prev => prev.map(p => p.id === id ? { ...p, value: p.defaultValue } : p));
  };

  const handleArtifactChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setArtifactLimits(prev => prev.map(limit => limit.id === id ? { ...limit, value: numValue } : limit));
  };

  const handleResetAll = () => {
    setRetentionPolicies(prev => prev.map(p => ({ ...p, value: p.defaultValue })));
    setArtifactLimits([...originalArtifactLimits]);
    setGroupPermissions([...originalGroupPermissions]);
  };

  const handleCancel = () => {
    setRetentionPolicies([...originalRetentionPolicies]);
    setArtifactLimits([...originalArtifactLimits]);
    setGroupPermissions([...originalGroupPermissions]);
    setIsDirty(false);
  };

  const handleSubmitClick = () => {
    if (!isDirty) return;
    setShowSummaryDialog(true);
  };

  const handleContinueFromSummary = () => {
    setShowSummaryDialog(false);
    setShowLoader(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setShowLoader(false);
      setShowSuccessDialog(true);
      setIsDirty(false);
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    
    // Create submission data
    const changes = [];
    const actionItems = [];

    retentionPolicies.forEach((policy, index) => {
      const original = originalRetentionPolicies[index];
      if (original && policy.value !== original.value) {
        changes.push(`${policy.label}: ${original.value} days → ${policy.value} days`);
        actionItems.push({
          title: policy.label,
          description: `Changed from ${original.value} days to ${policy.value} days`,
          tag: "Modified"
        });
      }
    });

    artifactLimits.forEach((limit, index) => {
      const original = originalArtifactLimits[index];
      if (original && limit.value !== original.value) {
        changes.push(`${limit.label}: ${original.value} → ${limit.value}`);
        actionItems.push({
          title: limit.label,
          description: `Changed from ${original.value} to ${limit.value}`,
          tag: "Modified"
        });
      }
    });

    groupPermissions.forEach((permission, index) => {
      const original = originalGroupPermissions[index];
      if (original && 
          (permission.canRead !== original.canRead || 
           permission.canWrite !== original.canWrite || 
           permission.canDelete !== original.canDelete || 
           permission.canExecute !== original.canExecute)) {
        changes.push(`${permission.groupName}: Permissions changed`);
        actionItems.push({
          title: permission.groupName,
          description: `Permissions changed`,
          tag: "Modified"
        });
      }
    });

    const submissionData = {
      workspace: selectedWorkspace,
      retentionPolicies,
      artifactLimits,
      groupPermissions,
      changes,
      actionItems
    };

    // Update originals
    setOriginalRetentionPolicies([...retentionPolicies]);
    setOriginalArtifactLimits([...artifactLimits]);
    setOriginalGroupPermissions([...groupPermissions]);

    // Call the onSubmit callback
    if (onSubmit) {
      onSubmit(submissionData);
    }

    // Navigate to pending verification page
    if (onBreadcrumbNavigate) {
      onBreadcrumbNavigate('pending-verification-main:settings');
    }
  };

  // Generate changes for summary dialog
  const getChanges = () => {
    const changes = [];
    retentionPolicies.forEach((policy, index) => {
      const original = originalRetentionPolicies[index];
      if (original && policy.value !== original.value) {
        changes.push({
          field: policy.label,
          oldValue: `${original.value} days`,
          newValue: `${policy.value} days`,
          status: "Modified"
        });
      }
    });
    artifactLimits.forEach((limit, index) => {
      const original = originalArtifactLimits[index];
      if (original && limit.value !== original.value) {
        changes.push({
          field: limit.label,
          oldValue: `${original.value}`,
          newValue: `${limit.value}`,
          status: "Modified"
        });
      }
    });
    groupPermissions.forEach((permission, index) => {
      const original = originalGroupPermissions[index];
      if (original && 
          (permission.canRead !== original.canRead || 
           permission.canWrite !== original.canWrite || 
           permission.canDelete !== original.canDelete || 
           permission.canExecute !== original.canExecute)) {
        changes.push({
          field: permission.groupName,
          oldValue: `Permissions unchanged`,
          newValue: `Permissions changed`,
          status: "Modified"
        });
      }
    });
    return changes;
  };

  // Generate action items for the summary dialog
  const getActionItems = () => {
    const actionItems = [];
    retentionPolicies.forEach((policy, index) => {
      const original = originalRetentionPolicies[index];
      if (original && policy.value !== original.value) {
        actionItems.push({
          title: policy.label,
          description: `Changed from ${original.value} days to ${policy.value} days`,
          tag: "Modified"
        });
      }
    });
    artifactLimits.forEach((limit, index) => {
      const original = originalArtifactLimits[index];
      if (original && limit.value !== original.value) {
        actionItems.push({
          title: limit.label,
          description: `Changed from ${original.value} to ${limit.value}`,
          tag: "Modified"
        });
      }
    });
    groupPermissions.forEach((permission, index) => {
      const original = originalGroupPermissions[index];
      if (original && 
          (permission.canRead !== original.canRead || 
           permission.canWrite !== original.canWrite || 
           permission.canDelete !== original.canDelete || 
           permission.canExecute !== original.canExecute)) {
        actionItems.push({
          title: permission.groupName,
          description: `Permissions changed`,
          tag: "Modified"
        });
      }
    });
    return actionItems;
  };

  const changes = getChanges();
  const actionItems = getActionItems();

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <PageHeader 
        title="Settings" 
        breadcrumbs={breadcrumbs || []} 
        onBack={() => onBreadcrumbNavigate?.('system-configuration-workspace-management')}
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
      />
      
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col bg-[#FBFBFB]">
        {/* Workspace Selector */}
        <div className="p-4 border-b border-[#E0E0E0] bg-white sticky top-0 z-10">
          <div className="space-y-[10px] w-96">
            <label className="text-[14px] text-[#161616] font-medium block">Select Workspace</label>
            <div className="relative w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ 
                    backgroundColor: 
                      selectedWorkspaceId === "ws1" || selectedWorkspace.name === "Account" ? "#2A53A0" : 
                      selectedWorkspaceId === "ws2" || selectedWorkspace.name === "Customer" ? "#EE5396" : 
                      "#08BDBA" 
                  }} 
                />
              </div>
              <select 
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className="w-full h-[46px] pl-8 pr-10 bg-white border border-[#C6C6C6] rounded-[8px] text-[14px] appearance-none focus:border-[#2A53A0] outline-none cursor-pointer"
              >
                {workspaces && workspaces.length > 0 ? (
                  workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.name}</option>
                  ))
                ) : (
                  <>
                    <option value="ws1">Account</option>
                    <option value="ws2">Customer</option>
                    <option value="ws3">Non-Customer</option>
                  </>
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#525252]">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Retention Policies Section */}
          <div className={cn(
            "bg-white border border-gray-200 rounded-[8px] transition-all duration-200 overflow-hidden",
            isRetentionOpen && "shadow-sm"
          )}>
            <div 
              className={cn(
                "h-[54px] flex items-center px-4 cursor-pointer hover:bg-[#F4F4F4] transition-colors",
                isRetentionOpen && "bg-[#FBFBFB]"
              )}
              onClick={() => setIsRetentionOpen(!isRetentionOpen)}
            >
              <div className={cn(
                "mr-4 text-[#161616] transition-transform duration-200",
                isRetentionOpen ? "rotate-0" : "-rotate-90"
              )}>
                <ChevronDown size={16} />
              </div>

              <div className="flex items-center gap-3 flex-1">
                <Calendar size={18} className="text-[#2A53A0]" />
                <span className="text-[15px] font-semibold text-[#161616]">Retention Policies</span>
                <span className="text-[#D1D1D1] mx-2">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#525252]">Active Policies:</span>
                  <span className="text-[13px] font-medium text-[#161616]">{retentionPolicies.length}</span>
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isRetentionOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  <div className="p-6 space-y-6 bg-white">
                    {retentionPolicies.map((policy) => (
                      <div key={policy.id} className="grid grid-cols-[1fr_auto] items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-4 flex justify-center">
                            {policy.id === "sec" && <Circle size={8} fill="#2A53A0" className="text-[#2A53A0]" />}
                          </div>
                          <span className="text-[14px] text-[#161616] font-normal">{policy.label}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={policy.value}
                              onChange={(e) => handleRetentionChange(policy.id, e.target.value)}
                              className="w-[100px] h-[46px] px-3 bg-white border border-[#C6C6C6] rounded-[8px] text-center text-[14px] focus:border-[#2A53A0] outline-none"
                            />
                            <span className="text-[14px] text-[#8D8D8D] min-w-[40px]">days</span>
                          </div>
                          <span className="text-[12px] text-[#A8A8A8] min-w-[120px]">Default: {policy.defaultValue} days</span>
                          <div className="w-[60px] flex justify-end">
                            {policy.value !== policy.defaultValue && (
                              <button 
                                onClick={() => handleResetRetention(policy.id)}
                                className="text-[13px] text-[#2A53A0] hover:underline font-medium"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Artifact Limits Section */}
          <div className={cn(
            "bg-white border border-gray-200 rounded-[8px] transition-all duration-200 overflow-hidden",
            isArtifactsOpen && "shadow-sm"
          )}>
            <div 
              className={cn(
                "h-[54px] flex items-center px-4 cursor-pointer hover:bg-[#F4F4F4] transition-colors",
                isArtifactsOpen && "bg-[#FBFBFB]"
              )}
              onClick={() => setIsArtifactsOpen(!isArtifactsOpen)}
            >
              <div className={cn(
                "mr-4 text-[#161616] transition-transform duration-200",
                isArtifactsOpen ? "rotate-0" : "-rotate-90"
              )}>
                <ChevronDown size={16} />
              </div>

              <div className="flex items-center gap-3 flex-1">
                <Layers size={18} className="text-[#2A53A0]" />
                <span className="text-[15px] font-semibold text-[#161616]">Artifact Limits</span>
                <span className="text-[#D1D1D1] mx-2">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#525252]">Resource Groups:</span>
                  <span className="text-[13px] font-medium text-[#161616]">{artifactLimits.length}</span>
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isArtifactsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  <div className="p-6 space-y-6 bg-white">
                    {artifactLimits.map((limit) => (
                      <div key={limit.id} className="grid grid-cols-[1fr_auto_320px] items-center gap-8">
                        <span className="text-[14px] text-[#161616] font-normal">{limit.label}</span>
                        <input 
                          type="text" 
                          value={limit.value}
                          onChange={(e) => handleArtifactChange(limit.id, e.target.value)}
                          className="w-[100px] h-[46px] px-3 bg-white border border-[#C6C6C6] rounded-[8px] text-center text-[14px] focus:border-[#2A53A0] outline-none"
                        />
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-[12px]">
                            <span className="text-[#8D8D8D] font-medium">{limit.used} of {limit.value} used</span>
                          </div>
                          <div className="h-2 w-full bg-[#E0E0E0] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#24A148] rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${(limit.used / limit.value) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Group Permissions Section */}
          <div className={cn(
            "bg-white border border-gray-200 rounded-[8px] transition-all duration-200 overflow-hidden",
            isGroupPermissionsOpen && "shadow-sm"
          )}>
            <div 
              className={cn(
                "h-[54px] flex items-center px-4 cursor-pointer hover:bg-[#F4F4F4] transition-colors",
                isGroupPermissionsOpen && "bg-[#FBFBFB]"
              )}
              onClick={() => setIsGroupPermissionsOpen(!isGroupPermissionsOpen)}
            >
              <div className={cn(
                "mr-4 text-[#161616] transition-transform duration-200",
                isGroupPermissionsOpen ? "rotate-0" : "-rotate-90"
              )}>
                <ChevronDown size={16} />
              </div>

              <div className="flex items-center gap-3 flex-1">
                <Users size={18} className="text-[#2A53A0]" />
                <span className="text-[15px] font-semibold text-[#161616]">Group Permissions</span>
                <span className="text-[#D1D1D1] mx-2">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#525252]">Groups:</span>
                  <span className="text-[13px] font-medium text-[#161616]">{groupPermissions.length}</span>
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isGroupPermissionsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  <div className="p-4 bg-white">
                    {/* Table with sticky header for better scalability */}
                    <div className="border border-[#E0E0E0] rounded-[8px] overflow-hidden">
                      <div className="max-h-[400px] overflow-y-auto">
                        <table className="w-full border-collapse">
                          <thead className="sticky top-0 z-10">
                            <tr className="bg-[#F4F4F4] h-[48px] border-b border-[#E0E0E0]">
                              <th className="px-6 text-left text-[15px] font-medium text-[#2A53A0] w-[280px]">Group Name</th>
                              <th className="px-4 text-center text-[15px] font-medium text-[#2A53A0] w-[120px]">Read</th>
                              <th className="px-4 text-center text-[15px] font-medium text-[#2A53A0] w-[120px]">Write</th>
                              <th className="px-4 text-center text-[15px] font-medium text-[#2A53A0] w-[120px]">Delete</th>
                              <th className="px-4 text-center text-[15px] font-medium text-[#2A53A0] w-[120px]">Execute</th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupPermissions.map((permission, index) => (
                              <tr 
                                key={permission.groupId} 
                                className={cn(
                                  "h-[48px] border-b border-[#E0E0E0] hover:bg-[#F4F4F4] transition-colors",
                                  index === groupPermissions.length - 1 && "border-b-0"
                                )}
                              >
                                <td className="px-6 align-middle">
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#2A53A0]" />
                                    <span className="text-[14px] text-[#161616] font-medium">{permission.groupName}</span>
                                  </div>
                                </td>
                                <td className="px-4 align-middle text-center">
                                  <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        checked={permission.canRead}
                                        onChange={(e) => setGroupPermissions(prev => prev.map(p => p.groupId === permission.groupId ? { ...p, canRead: e.target.checked } : p))}
                                        className="sr-only peer"
                                      />
                                      <div className="w-[20px] h-[20px] border-2 border-[#C6C6C6] rounded-[4px] peer-checked:bg-[#2A53A0] peer-checked:border-[#2A53A0] transition-all flex items-center justify-center">
                                        {permission.canRead && (
                                          <Checkmark size={16} className="text-white" />
                                        )}
                                      </div>
                                    </label>
                                  </div>
                                </td>
                                <td className="px-4 align-middle text-center">
                                  <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        checked={permission.canWrite}
                                        onChange={(e) => setGroupPermissions(prev => prev.map(p => p.groupId === permission.groupId ? { ...p, canWrite: e.target.checked } : p))}
                                        className="sr-only peer"
                                      />
                                      <div className="w-[20px] h-[20px] border-2 border-[#C6C6C6] rounded-[4px] peer-checked:bg-[#2A53A0] peer-checked:border-[#2A53A0] transition-all flex items-center justify-center">
                                        {permission.canWrite && (
                                          <Checkmark size={16} className="text-white" />
                                        )}
                                      </div>
                                    </label>
                                  </div>
                                </td>
                                <td className="px-4 align-middle text-center">
                                  <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        checked={permission.canDelete}
                                        onChange={(e) => setGroupPermissions(prev => prev.map(p => p.groupId === permission.groupId ? { ...p, canDelete: e.target.checked } : p))}
                                        className="sr-only peer"
                                      />
                                      <div className="w-[20px] h-[20px] border-2 border-[#C6C6C6] rounded-[4px] peer-checked:bg-[#2A53A0] peer-checked:border-[#2A53A0] transition-all flex items-center justify-center">
                                        {permission.canDelete && (
                                          <Checkmark size={16} className="text-white" />
                                        )}
                                      </div>
                                    </label>
                                  </div>
                                </td>
                                <td className="px-4 align-middle text-center">
                                  <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        checked={permission.canExecute}
                                        onChange={(e) => setGroupPermissions(prev => prev.map(p => p.groupId === permission.groupId ? { ...p, canExecute: e.target.checked } : p))}
                                        className="sr-only peer"
                                      />
                                      <div className="w-[20px] h-[20px] border-2 border-[#C6C6C6] rounded-[4px] peer-checked:bg-[#2A53A0] peer-checked:border-[#2A53A0] transition-all flex items-center justify-center">
                                        {permission.canExecute && (
                                          <Checkmark size={16} className="text-white" />
                                        )}
                                      </div>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Helper text */}
                    <div className="mt-4 flex items-start gap-2 text-[12px] text-[#525252]">
                      <div className="w-4 h-4 rounded-full bg-[#EDF5FF] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] text-[#2A53A0] font-bold">i</span>
                      </div>
                      <p className="leading-relaxed">
                        Configure workspace access permissions for each group. Changes will be submitted for approval before taking effect.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#E0E0E0] bg-white flex items-center justify-between shrink-0">
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="h-[48px] px-8 border border-[#C6C6C6] text-[#525252] font-normal rounded-[8px] hover:bg-gray-100"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="ghost" 
            className="h-[48px] px-8 border border-[#2A53A0] text-[#2A53A0] hover:bg-blue-50 flex items-center gap-2 text-[14px] font-normal"
            onClick={handleResetAll}
          >
            <RotateCcw size={16} />
            Reset All to Defaults
          </Button>
          <Button 
            className={cn(
              "h-[48px] px-8 rounded-[8px] font-medium",
              isDirty 
                ? "bg-[#2A53A0] hover:bg-[#1A3A7A] text-white" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
            onClick={handleSubmitClick}
            disabled={!isDirty}
          >
            Submit changes
          </Button>
        </div>
      </div>

      {/* Loading Overlay */}
      {showLoader && <Clari5Loader />}

      {/* Changes Summary Dialog */}
      {showSummaryDialog && (
        <ChangesSummaryDialog
          isOpen={showSummaryDialog}
          onClose={() => setShowSummaryDialog(false)}
          onContinue={handleContinueFromSummary}
          actionItems={actionItems}
          totalActions={actionItems.length}
        />
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <SuccessDialog 
          onContinue={handleCloseSuccess}
          title="Configuration Submitted"
          message="Your settings changes have been submitted and are now pending approval."
        />
      )}
    </div>
  );
}