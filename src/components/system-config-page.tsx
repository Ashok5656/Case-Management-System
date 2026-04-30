import { useState } from "react";
import { 
  Search, 
  Settings, 
  Group, 
  Add, 
  Edit, 
  TrashCan, 
  Information,
  CheckmarkFilled,
  User,
  UserAdmin,
  View,
  SettingsAdjust,
  CheckmarkOutline
} from "@carbon/icons-react";
import PageHeader from "./page-header";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";

interface ScenarioGroup {
  id: string;
  name: string;
  isDefault: boolean;
  description: string;
  scenarioCount: number;
  permissionsSummary: string;
}

interface PermissionRow {
  id: string;
  userName: string;
  role: string;
  permissions: {
    [groupId: string]: {
      view: boolean;
      edit: boolean;
      admin: boolean;
    };
  };
}

const SCENARIO_GROUPS: ScenarioGroup[] = [
  {
    id: "g1",
    name: "EFM",
    isDefault: true,
    description: "Enterprise Fraud Management - Default scenario group",
    scenarioCount: 127,
    permissionsSummary: "All users can view"
  },
  {
    id: "g2",
    name: "AML Compliance",
    isDefault: false,
    description: "Anti-Money Laundering and regulatory compliance scenarios",
    scenarioCount: 45,
    permissionsSummary: "All users can view"
  },
  {
    id: "g3",
    name: "Credit Card Fraud",
    isDefault: false,
    description: "Card-specific fraud detection patterns",
    scenarioCount: 0,
    permissionsSummary: "1 view, 1 edit, 1 admin"
  },
  {
    id: "g4",
    name: "KYC Verification",
    isDefault: false,
    description: "Know Your Customer compliance and verification",
    scenarioCount: 32,
    permissionsSummary: "5 users"
  },
  {
    id: "g5",
    name: "Transaction Monitoring",
    isDefault: false,
    description: "Real-time transaction monitoring and alerts",
    scenarioCount: 78,
    permissionsSummary: "8 users"
  },
  {
    id: "g6",
    name: "Sanctions Screening",
    isDefault: false,
    description: "Sanctions and watchlist screening",
    scenarioCount: 21,
    permissionsSummary: "4 users"
  },
  {
    id: "g7",
    name: "Risk Assessment",
    isDefault: false,
    description: "Customer and transaction risk scoring",
    scenarioCount: 56,
    permissionsSummary: "6 users"
  },
  {
    id: "g8",
    name: "Internal Fraud",
    isDefault: false,
    description: "Employee and insider threat detection",
    scenarioCount: 19,
    permissionsSummary: "3 users"
  },
  {
    id: "g9",
    name: "Customer Due Diligence",
    isDefault: false,
    description: "Enhanced due diligence and customer profiling",
    scenarioCount: 41,
    permissionsSummary: "7 users"
  },
  {
    id: "g10",
    name: "Compliance Reporting",
    isDefault: false,
    description: "Regulatory reporting and audit trails",
    scenarioCount: 28,
    permissionsSummary: "5 users"
  }
];

const INITIAL_PERMISSION_DATA: PermissionRow[] = [
  {
    id: "u1",
    userName: "John Smith",
    role: "Admin",
    permissions: {
      g1: { view: true, edit: false, admin: false },
      g2: { view: false, edit: false, admin: false },
      g3: { view: true, edit: false, admin: false }
    }
  },
  {
    id: "u2",
    userName: "Sarah Johnson",
    role: "Senior Analyst",
    permissions: {
      g1: { view: false, edit: true, admin: true },
      g2: { view: false, edit: true, admin: false },
      g3: { view: false, edit: false, admin: false }
    }
  },
  {
    id: "u3",
    userName: "Mike Chen",
    role: "Analyst",
    permissions: {
      g1: { view: false, edit: false, admin: false },
      g2: { view: true, edit: false, admin: true },
      g3: { view: false, edit: true, admin: false }
    }
  },
  {
    id: "u4",
    userName: "Emma Davis",
    role: "AML Manager",
    permissions: {
      g1: { view: false, edit: false, admin: false },
      g2: { view: false, edit: true, admin: false },
      g3: { view: false, edit: true, admin: true }
    }
  },
  {
    id: "u5",
    userName: "David Wilson",
    role: "Card Team Lead",
    permissions: {
      g1: { view: true, edit: false, admin: false },
      g2: { view: false, edit: false, admin: false },
      g3: { view: false, edit: false, admin: false }
    }
  }
];

export function SystemConfigPage({ 
  onBreadcrumbNavigate,
  breadcrumbs
}: { 
  onBreadcrumbNavigate: (path: string) => void,
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[]
}) {
  const [groups, setGroups] = useState<ScenarioGroup[]>(SCENARIO_GROUPS);
  const [permissions, setPermissions] = useState<PermissionRow[]>(INITIAL_PERMISSION_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>(INITIAL_PERMISSION_DATA[0]?.id || "u1");

  const handleTogglePermission = (userId: string, groupId: string, type: 'view' | 'edit' | 'admin') => {
    setPermissions(prev => prev.map(row => {
      if (row.id === userId) {
        return {
          ...row,
          permissions: {
            ...row.permissions,
            [groupId]: {
              ...row.permissions[groupId],
              [type]: !row.permissions[groupId]?.[type]
            }
          }
        };
      }
      return row;
    }));
  };

  const selectedUser = permissions.find(p => p.id === selectedUserId);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden font-['Inter'] relative">
      <PageHeader 
        title="System Settings" 
        breadcrumbs={breadcrumbs} 
        onBreadcrumbNavigate={onBreadcrumbNavigate} 
      />
      <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-8">
        
        {/* Scenario Groups Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-[#161616]">Scenario Groups</h2>
              <Information size={16} className="text-[#525252] cursor-help" />
            </div>
            <Button 
              className="h-[48px] bg-[#2A53A0] hover:bg-[#1A3A7A] text-white px-6 rounded-[8px] flex items-center gap-2 text-[13px] font-medium transition-all"
              onClick={() => toast.info("Add Group dialog coming soon.")}
            >
              <Add size={18} />
              Add Group
            </Button>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-[8px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F4F4F4] h-[48px] border-b border-[#E0E0E0]">
                  <th className="px-4 text-[13px] font-semibold text-[#2A53A0] w-[20%]">GroupName</th>
                  <th className="px-4 text-[13px] font-semibold text-[#2A53A0] w-[40%]">Description</th>
                  <th className="px-4 text-[13px] font-semibold text-[#2A53A0] w-[15%]">ScenarioCount</th>
                  <th className="px-4 text-[13px] font-semibold text-[#2A53A0] w-[15%]">PermissionsSummary</th>
                  <th className="px-4 text-[13px] font-semibold text-[#2A53A0] w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id} className="h-[46px] border-b border-[#E0E0E0] hover:bg-[#F9F9F9] transition-colors">
                    <td className="px-4 align-middle">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-[#161616] font-normal">{group.name}</span>
                        {group.isDefault && (
                          <span className="bg-[#EDF5FF] text-[#0043CE] text-[10px] px-2 py-0.5 rounded-full font-medium">Default</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 align-middle">
                      <span className="text-[13px] text-[#161616] line-clamp-1">{group.description}</span>
                    </td>
                    <td className="px-4 align-middle">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-[#161616]">{group.scenarioCount}</span>
                        {group.scenarioCount > 0 && <CheckmarkFilled size={14} className="text-[#24A148]" />}
                      </div>
                    </td>
                    <td className="px-4 align-middle">
                      <span className="text-[13px] text-[#525252]">{group.permissionsSummary}</span>
                    </td>
                    <td className="px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <button className="w-[28px] h-[28px] flex items-center justify-center text-[#525252] hover:text-[#2A53A0] transition-colors"><Edit size={16} /></button>
                        <button className="w-[28px] h-[28px] flex items-center justify-center text-[#525252] hover:text-[#DA1E28] transition-colors" disabled={group.isDefault}><TrashCan size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Group Permissions Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-[#161616]">Group Permissions</h2>
              <Information size={16} className="text-[#525252] cursor-help" title="Configure user permissions for each scenario group" />
            </div>
          </div>

          {/* Improved Two-Panel Layout for Scalability */}
          <div className="grid grid-cols-[320px_1fr] gap-4 h-[600px]">
            {/* Left Panel - User List */}
            <div className="bg-white border border-[#E0E0E0] rounded-[8px] overflow-hidden flex flex-col">
              <div className="p-3 border-b border-[#E0E0E0] bg-[#F4F4F4]">
                <div className="relative h-[40px]">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525252]" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full h-full pl-10 pr-3 bg-white border border-[#C6C6C6] rounded-[6px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2A53A0]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {permissions.filter(p => p.userName.toLowerCase().includes(searchTerm.toLowerCase()) || p.role.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={cn(
                      "w-full px-4 py-3 border-b border-[#E0E0E0] text-left transition-colors hover:bg-[#F4F4F4]",
                      selectedUserId === user.id && "bg-[#EDF5FF] border-l-4 border-l-[#2A53A0]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-medium",
                        selectedUserId === user.id ? "bg-[#2A53A0]" : "bg-[#8D8D8D]"
                      )}>
                        {user.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#161616] truncate">{user.userName}</div>
                        <div className="text-[11px] text-[#525252] truncate">{user.role}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel - Group Permissions Table */}
            <div className="bg-white border border-[#E0E0E0] rounded-[8px] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[#E0E0E0] bg-[#F4F4F4]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#161616]">{selectedUser?.userName}</h3>
                    <p className="text-[12px] text-[#525252]">{selectedUser?.role}</p>
                  </div>
                  <div className="text-[11px] text-[#525252]">
                    {groups.length} Groups Available
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#FBFBFB] h-[44px] border-b border-[#E0E0E0]">
                      <th className="px-4 text-left text-[13px] font-semibold text-[#2A53A0] w-[35%]">Group Name</th>
                      <th className="px-4 text-left text-[13px] font-semibold text-[#2A53A0] w-[35%]">Description</th>
                      <th className="px-4 text-center text-[13px] font-semibold text-[#2A53A0] w-[10%]">View</th>
                      <th className="px-4 text-center text-[13px] font-semibold text-[#2A53A0] w-[10%]">Edit</th>
                      <th className="px-4 text-center text-[13px] font-semibold text-[#2A53A0] w-[10%]">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group, index) => {
                      const userPerms = selectedUser?.permissions[group.id] || { view: false, edit: false, admin: false };
                      return (
                        <tr 
                          key={group.id} 
                          className={cn(
                            "h-[52px] border-b border-[#E0E0E0] hover:bg-[#F9F9F9] transition-colors",
                            index === groups.length - 1 && "border-b-0"
                          )}
                        >
                          <td className="px-4 align-middle">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#2A53A0]" />
                              <span className="text-[13px] font-medium text-[#161616]">{group.name}</span>
                              {group.isDefault && (
                                <span className="bg-[#EDF5FF] text-[#0043CE] text-[10px] px-2 py-0.5 rounded-full font-medium">Default</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 align-middle">
                            <span className="text-[12px] text-[#525252] line-clamp-1">{group.description}</span>
                          </td>
                          <td className="px-4 align-middle text-center">
                            <div className="flex justify-center">
                              <PermissionCheckbox 
                                checked={userPerms.view} 
                                onChange={() => selectedUser && handleTogglePermission(selectedUser.id, group.id, 'view')} 
                              />
                            </div>
                          </td>
                          <td className="px-4 align-middle text-center">
                            <div className="flex justify-center">
                              <PermissionCheckbox 
                                checked={userPerms.edit} 
                                onChange={() => selectedUser && handleTogglePermission(selectedUser.id, group.id, 'edit')} 
                              />
                            </div>
                          </td>
                          <td className="px-4 align-middle text-center">
                            <div className="flex justify-center">
                              <PermissionCheckbox 
                                checked={userPerms.admin} 
                                onChange={() => selectedUser && handleTogglePermission(selectedUser.id, group.id, 'admin')} 
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Permission Legend */}
              <div className="p-3 border-t border-[#E0E0E0] bg-[#FBFBFB]">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#525252]">
                    <View size={14} className="text-[#525252]" />
                    <span>View scenarios</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#525252]">
                    <Edit size={14} className="text-[#525252]" />
                    <span>Modify scenarios</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#525252]">
                    <SettingsAdjust size={14} className="text-[#525252]" />
                    <span>Full control</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PermissionCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button 
      onClick={onChange}
      className={cn(
        "w-4 h-4 rounded-[3px] border transition-all flex items-center justify-center",
        checked 
          ? "bg-[#2A53A0] border-[#2A53A0] text-white" 
          : "bg-white border-[#E0E0E0] hover:border-[#2A53A0]"
      )}
    >
      {checked && <CheckmarkOutline size={12} strokeWidth={3} />}
    </button>
  );
}