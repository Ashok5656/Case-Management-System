import React, { useState } from "react";
import { 
  Flash, 
  Search, 
  Filter, 
  View, 
  Checkmark, 
  Close,
  ChevronRight,
  Time,
  User,
  Information,
  CheckmarkFilled,
  ChevronDown
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "./ui/utils";

interface PendingEventsPageProps {
  breadcrumbs: any[];
  onBreadcrumbNavigate: (path: string) => void;
}

export function PendingEventsPage({ breadcrumbs, onBreadcrumbNavigate }: PendingEventsPageProps) {
  const [activeTab, setActiveTab] = useState("pending");

  const pendingEvents = [
    {
      id: "EVT-CUST-9021",
      name: "High_Value_Wire_Transfer",
      type: "Financial",
      requestedBy: "Rajesh Kumar",
      requestedDate: "Jan 28, 2026",
      status: "Pending Approval",
      priority: "High"
    },
    {
      id: "EVT-CUST-9020",
      name: "Swift_Message_Modified",
      type: "Financial",
      requestedBy: "Priya Sharma",
      requestedDate: "Jan 27, 2026",
      status: "Under Review",
      priority: "Medium"
    },
    {
      id: "EVT-CUST-9019",
      name: "Login_Location_Anomaly",
      type: "Non-Financial",
      requestedBy: "Amit Patel",
      requestedDate: "Jan 27, 2026",
      status: "Pending Approval",
      priority: "Low"
    },
    {
      id: "EVT-CUST-9018",
      name: "Card_Not_Present_International",
      type: "Financial",
      requestedBy: "Rajesh Kumar",
      requestedDate: "Jan 26, 2026",
      status: "Pending Approval",
      priority: "High"
    }
  ];

  const renderTable = (data: any[]) => (
    <div className="bg-white border border-gray-200 rounded-[8px] overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search by event name or ID..." 
              className="pl-10 h-[46px] border-gray-300 rounded-[8px] focus:ring-[#2A53A0] text-[14px]" 
            />
          </div>
          <div className="relative h-[46px] flex items-center">
             <select className="bg-white border border-gray-300 rounded-[8px] h-full px-4 pr-10 text-[14px] text-[#161616] focus:ring-1 focus:ring-[#2A53A0] focus:border-[#2A53A0] focus:outline-none appearance-none cursor-pointer min-w-[160px]">
                 <option value="all">All Types</option>
                 <option value="financial">Financial</option>
                 <option value="non-financial">Non-Financial</option>
             </select>
             <div className="absolute right-3 pointer-events-none text-gray-500">
                <ChevronDown size={16} />
             </div>
          </div>
        </div>
      </div>

      <table className="w-full text-left table-fixed">
        <thead className="bg-[#f4f4f4] h-[48px] sticky top-0 z-10 shadow-[0_1px_0_0_#e0e0e0]">
          <tr>
            <th className="px-6 w-[25%] text-[14px] font-semibold text-[#2A53A0] uppercase tracking-wider">Event Details</th>
            <th className="px-6 w-[15%] text-[14px] font-semibold text-[#2A53A0] uppercase tracking-wider">Type</th>
            <th className="px-6 w-[20%] text-[14px] font-semibold text-[#2A53A0] uppercase tracking-wider">Requested By</th>
            <th className="px-6 w-[15%] text-[14px] font-semibold text-[#2A53A0] uppercase tracking-wider">Requested Date</th>
            <th className="px-6 w-[15%] text-[14px] font-semibold text-[#2A53A0] uppercase tracking-wider">Status</th>
            <th className="px-6 w-[10%] text-[14px] font-semibold text-[#2A53A0] uppercase tracking-wider text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((event) => (
            <tr key={event.id} className="h-[46px] hover:bg-gray-50 transition-colors group">
              <td className="px-6">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-[14px] font-normal text-[#161616] truncate block">{event.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">{event.id}</span>
                </div>
              </td>
              <td className="px-6">
                <Badge variant="outline" className="bg-[#d0e2ff] text-[#0043ce] border-0 rounded-full font-medium text-[11px] px-2 h-[22px] flex items-center justify-center w-fit">
                  {event.type}
                </Badge>
              </td>
              <td className="px-6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[9px] font-bold text-[#2A53A0] border border-gray-200 shrink-0">
                    {event.requestedBy.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-[14px] text-[#161616] font-normal truncate">{event.requestedBy}</span>
                </div>
              </td>
              <td className="px-6 text-[14px] text-[#161616] font-normal font-mono">{event.requestedDate}</td>
              <td className="px-6">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    event.status === "Under Review" ? "bg-blue-500 animate-pulse" : "bg-orange-400"
                  )} />
                  <span className="text-[11px] font-medium text-[#161616] whitespace-nowrap">{event.status}</span>
                </div>
              </td>
              <td className="px-6">
                <div className="flex items-center justify-center gap-2">
                  <button 
                    className="w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#E6F6F4] hover:bg-[#D1EBE7] rounded-[8px] transition-colors text-[#005D5D]" 
                    title="Approve"
                  >
                    <Checkmark size={16} />
                  </button>
                  <button 
                    className="w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#FFF1F1] hover:bg-[#FFD7D9] rounded-[8px] transition-colors text-[#DA1E28]" 
                    title="Reject"
                  >
                    <Close size={16} />
                  </button>
                  <button 
                    className="w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F2F0FF] hover:bg-[#E1DBFF] rounded-[8px] transition-colors text-[#6929C4]" 
                    title="View Details"
                  >
                    <View size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="flex-none h-[48px] bg-[#f4f4f4] border-t border-[#D0D0D0] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[12px] text-[#525252]">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#161616]">{data.length}</span> events found
          </div>
        </div>
        <div className="text-[12px] text-gray-400">
          Last updated: 28/01/2026
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header with Breadcrumbs */}
      <div className="flex-none border-b border-gray-100 bg-white">
        <div className="px-12 py-4">
          <BreadcrumbNav 
            items={breadcrumbs} 
            onNavigate={onBreadcrumbNavigate} 
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="flex-none bg-white border-b border-gray-100 px-12">
          <TabsList className="bg-transparent p-0 h-[48px] w-full justify-start border-b border-[#e0e0e0] rounded-none">
            <TabsTrigger 
              value="pending"
              className={cn(
                "relative h-full rounded-none bg-transparent px-6 text-[14px] font-medium text-[#525252] shadow-none outline-none ring-0",
                "border-0 border-b-[2px] border-transparent transition-all",
                "hover:bg-[#f4f4f4] hover:text-[#161616]",
                "data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              )}
            >
              <div className="flex items-center gap-2">
                <span>Pending Events</span>
                <Badge className="bg-gray-100 text-[#525252] border-0 px-2 py-0 h-5 min-w-[24px] flex items-center justify-center font-bold text-[11px] rounded-full">
                  12
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="verified"
              className={cn(
                "relative h-full rounded-none bg-transparent px-6 text-[14px] font-medium text-[#525252] shadow-none outline-none ring-0",
                "border-0 border-b-[2px] border-transparent transition-all",
                "hover:bg-[#f4f4f4] hover:text-[#161616]",
                "data-[state=active]:border-b-[#2A53A0] data-[state=active]:text-[#2A53A0] data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              )}
            >
              <div className="flex items-center gap-2">
                <span>Verified Today</span>
                <Badge className="bg-gray-100 text-[#525252] border-0 px-2 py-0 h-5 min-w-[24px] flex items-center justify-center font-bold text-[11px] rounded-full">
                  8
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-12 space-y-8 bg-white">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-[#2A53A0] shadow-sm bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#2A53A0]">
                  <Time size={24} />
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-bold uppercase tracking-wider">Total Pending</p>
                  <p className="text-[24px] font-bold text-[#161616]">12</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-orange-400 shadow-sm bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                  <Time size={24} />
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-bold uppercase tracking-wider">SLA Critical</p>
                  <p className="text-[24px] font-bold text-[#161616]">4</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-green-500 shadow-sm bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                  <CheckmarkFilled size={24} />
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-bold uppercase tracking-wider">Verified</p>
                  <p className="text-[24px] font-bold text-[#161616]">8</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-purple-500 shadow-sm bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-bold uppercase tracking-wider">Reviewers</p>
                  <p className="text-[24px] font-bold text-[#161616]">3</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <TabsContent value="pending" className="m-0 border-0 outline-none ring-0">
            {renderTable(pendingEvents)}
          </TabsContent>

          <TabsContent value="verified" className="m-0 border-0 outline-none ring-0">
            {renderTable(pendingEvents.slice(0, 2).map(e => ({ ...e, status: "Verified" })))}
          </TabsContent>

          <div className="bg-blue-50 p-4 border-l-4 border-[#2A53A0] rounded-r-[8px] flex gap-3">
            <Information size={20} className="text-[#2A53A0] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
               <p className="text-[13px] font-bold text-[#2A53A0]">Information</p>
               <p className="text-[12px] text-blue-800 leading-relaxed">
                  Events in this section have been flagged for manual verification due to custom field complexity. 
                  Approving an event will make it immediately available for scenario building and reporting.
               </p>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
