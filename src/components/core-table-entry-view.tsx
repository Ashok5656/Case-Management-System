import React from "react";
import { 
  Building, 
  User, 
  Wallet, 
  Purchase, 
  ArrowLeft,
  Information,
  Calendar,
  Location,
  Phone,
  Email,
  Badge as BadgeIcon,
  Tag,
  Enterprise
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import PageHeader from "./page-header";

interface FieldGroupProps {
  title: string;
  fields: { label: string; value: string | React.ReactNode; icon?: any }[];
}

function FieldGroup({ title, fields }: FieldGroupProps) {
  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50/30 overflow-hidden mb-4 last:mb-0">
      {/* Section Header */}
      <div className="px-4 py-2 border-b border-gray-100 bg-white">
        <h3 className="text-[12px] font-bold text-[#2A53A0] uppercase tracking-wider">{title}</h3>
      </div>
      
      {/* Property Grid - Flat integrated layout without heading */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12">
          {fields.map((field, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between min-h-[36px] border-b border-gray-50 group hover:bg-gray-50/50 transition-colors px-1"
            >
              {/* Minimalist Label */}
              <span className="text-[12px] text-gray-500 font-medium shrink-0">
                {field.label}
              </span>
              
              {/* Value Area */}
              <div className="flex items-center gap-2 min-w-0 ml-4">
                {field.icon && <field.icon size={13} className="text-[#2A53A0] opacity-40 shrink-0" />}
                <div className="text-[13px] text-[#161616] font-semibold truncate text-right">
                  {field.value || <span className="text-gray-300 font-normal italic">null</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface CoreTableEntryViewProps {
  type: "branch" | "customer" | "account" | "card";
  entryId: string;
  onBack: () => void;
  onBreadcrumbNavigate: (path: string) => void;
  breadcrumbs: any[];
}

export function CoreTableEntryView({ 
  type, 
  entryId, 
  onBack,
  onBreadcrumbNavigate,
  breadcrumbs
}: CoreTableEntryViewProps) {
  // Mock data fetching based on ID and Type
  const getDetails = () => {
    switch (type) {
      case "branch":
        return {
          title: "Branch Details",
          icon: Building,
          subtitle: `Entity ID: ${entryId} | Main Branch Operations`,
          sections: [
            {
              title: "General Information",
              fields: [
                { label: "Branch Name", value: "Main HQ Branch", icon: Building },
                { label: "Branch Code", value: "BR-001" },
                { label: "Branch Type", value: <Badge className="bg-[#D0E2FF] text-[#002D9C] border-0">Primary</Badge> },
                { label: "Status", value: <Badge className="bg-[#DEFBE6] text-[#198038] border-0">Active</Badge> },
                { label: "Opening Date", value: "12/05/1998", icon: Calendar },
                { label: "Reporting Unit", value: "Region North" },
              ]
            },
            {
              title: "Location & Contact",
              fields: [
                { label: "Address", value: "123 Financial Plaza, Wall St", icon: Location },
                { label: "City", value: "New York" },
                { label: "State", value: "NY" },
                { label: "Country", value: "USA" },
                { label: "Phone Number", value: "+1 212-555-0198", icon: Phone },
                { label: "SWIFT Code", value: "CLRIUS33XXX" },
              ]
            }
          ]
        };
      case "customer":
        return {
          title: "Customer Profile",
          icon: User,
          subtitle: `Customer Ref: ${entryId} | Individual Account`,
          sections: [
            {
              title: "Personal Information",
              fields: [
                { label: "Full Name", value: "Johnathan Doe", icon: User },
                { label: "Customer ID", value: entryId },
                { label: "Date of Birth", value: "15/08/1985", icon: Calendar },
                { label: "Nationality", value: "American" },
                { label: "Marital Status", value: "Married" },
                { label: "Occupation", value: "Software Architect" },
              ]
            },
            {
              title: "Contact Details",
              fields: [
                { label: "Email Address", value: "j.doe@example.com", icon: Email },
                { label: "Primary Phone", value: "+1 555-0101", icon: Phone },
                { label: "Residential Address", value: "789 Oak Avenue, Apt 4B", icon: Location },
                { label: "City", value: "New York" },
                { label: "Zip Code", value: "10001" },
                { label: "Communication Pref", value: "Email & SMS" },
              ]
            },
            {
              title: "Segmentation & Risk",
              fields: [
                { label: "Segment", value: <Badge className="bg-[#E8DAFF] text-[#491D8B] border-0">Premium</Badge>, icon: Tag },
                { label: "Risk Rating", value: <Badge className="bg-[#FFF1F1] text-[#DA1E28] border-0">Low</Badge>, icon: Information },
                { label: "Onboarding Date", value: "22/01/2020" },
                { label: "KYC Status", value: <Badge className="bg-[#DEFBE6] text-[#198038] border-0">Verified</Badge> },
              ]
            }
          ]
        };
      case "account":
        return {
          title: "Account Overview",
          icon: Wallet,
          subtitle: `Account Number: ${entryId} | Savings Gold`,
          sections: [
            {
              title: "Account Details",
              fields: [
                { label: "Account Type", value: "Savings Gold", icon: Wallet },
                { label: "Account Number", value: entryId },
                { label: "Currency", value: "USD ($)" },
                { label: "Balance", value: "$45,230.50" },
                { label: "Status", value: <Badge className="bg-[#DEFBE6] text-[#198038] border-0">Active</Badge> },
                { label: "Open Date", value: "10/11/2021", icon: Calendar },
              ]
            },
            {
              title: "Relationship & Limits",
              fields: [
                { label: "Primary Holder", value: "Johnathan Doe", icon: User },
                { label: "Holding Branch", value: "Main Branch", icon: Building },
                { label: "Daily Limit", value: "$5,000.00" },
                { label: "Transfer Limit", value: "$25,000.00" },
                { label: "Overdraft Limit", value: "$0.00" },
                { label: "Alert Frequency", value: "Real-time" },
              ]
            }
          ]
        };
      case "card":
        return {
          title: "Card Information",
          icon: Purchase,
          subtitle: `Card ID: ${entryId} | Visa Infinite`,
          sections: [
            {
              title: "Card Specifications",
              fields: [
                { label: "Card Provider", value: "Visa Infinite", icon: Purchase },
                { label: "Card Number", value: "**** **** **** 8821" },
                { label: "Expiry Date", value: "09/28", icon: Calendar },
                { label: "Card Type", value: "Credit Card" },
                { label: "Issue Date", value: "15/09/2023" },
                { label: "Status", value: <Badge className="bg-[#DEFBE6] text-[#198038] border-0">Active</Badge> },
              ]
            },
            {
              title: "Usage & Security",
              fields: [
                { label: "Credit Limit", value: "$15,000.00" },
                { label: "Available Credit", value: "$12,450.00" },
                { label: "Contactless", value: "Enabled" },
                { label: "E-Commerce", value: "Enabled" },
                { label: "International", value: "Disabled" },
                { label: "Security Code", value: "KYC Protected" },
              ]
            }
          ]
        };
      default:
        return { title: "", icon: Building, subtitle: "", sections: [] };
    }
  };

  const data = getDetails();
  const Icon = data.icon;

  return (
    <div className="flex flex-col h-full w-full bg-white font-['Inter'] overflow-hidden">
      {/* Top Navigation matches Edit Entity system */}
      <div className="flex-none">
        <PageHeader 
          title={data.title}
          breadcrumbs={breadcrumbs}
          onBack={onBack}
          onBreadcrumbNavigate={onBreadcrumbNavigate}
        />

        {/* Unified Metadata Bar - Updated for consistency */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center h-[52px] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 whitespace-nowrap pr-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-bold text-[#525252] tracking-wider">Entity ID:</span>
            <span className="text-[13px] font-semibold text-[#161616]">{entryId}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-bold text-[#525252] tracking-wider">Entity Type:</span>
            <Badge className="bg-[#f4f4f4] text-[#161616] border-0 px-3 h-[28px] text-[11px] font-medium rounded-md flex items-center gap-1.5 capitalize">
              <Icon size={14} className="text-[#2A53A0]" />
              {type}
            </Badge>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
            <span className="text-[12px] font-bold text-[#525252] tracking-wider">Status:</span>
            <Badge className="bg-[#DEFBE6] text-[#198038] border-0 px-3 h-[28px] text-[11px] font-medium rounded-full flex items-center gap-1.5 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-[#198038]" />
              Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 gap-4">
            {data.sections.map((section, idx) => (
              <FieldGroup key={idx} title={section.title} fields={section.fields} />
            ))}
          </div>

          {/* Bottom Audit Info */}
          <div className="pt-4 border-t border-[#F0F0F0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
               <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 font-bold uppercase">Created By</span>
                  <span className="text-[13px] text-[#161616] font-medium">System Migration Agent</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 font-bold uppercase">Created Date</span>
                  <span className="text-[13px] text-[#161616] font-medium">15/01/2024 10:30 AM</span>
               </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400 italic text-[12px]">
               <Information size={14} />
               <span>This record is part of the core infrastructure and is locked for manual editing.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
