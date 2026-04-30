import { 
  ChevronLeft, 
  CheckmarkFilled, 
  WarningAlt, 
  Information,
  View,
  Table,
  Document,
  ChartNetwork,
  Tag,
  Code
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import { TemplateItem } from "./templates-page";

interface TemplateDetailsProps {
  template: TemplateItem;
  onBack: () => void;
  onBreadcrumbNavigate: (path: string) => void;
  breadcrumbs: { label: string; path?: string; isActive?: boolean }[];
}

export function TemplateDetailsPage({ template, onBack, onBreadcrumbNavigate, breadcrumbs }: TemplateDetailsProps) {
  if (!template) return null;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#e0e0e0] flex-none px-4 h-[48px] flex items-center justify-between relative">
        <div className="flex items-center z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 px-2 h-[32px] hover:bg-[#f4f4f4] rounded-[8px] text-[#525252] transition-colors text-[13px] font-medium"
            title="Go Back"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
            <span>Back</span>
          </button>
        </div>

        {/* Center: Title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <h1 className="text-[16px] font-semibold text-[#161616]">Template Details</h1>
            <Badge className="bg-[#EAF2FF] text-[#2A53A0] border-0 text-[11px] h-5 rounded-[4px] font-medium uppercase tracking-wider">{template.version}</Badge>
          </div>
        </div>

        {/* Right side: Breadcrumbs */}
        <div className="flex items-center z-10">
          <BreadcrumbNav items={breadcrumbs} onNavigate={onBreadcrumbNavigate} />
        </div>
      </div>

      {/* Sub-Header / Action Bar */}
      <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center justify-between h-[64px] flex-none">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 whitespace-nowrap pr-4 border-r border-gray-200 h-4 self-center flex-none">
              <span className="text-[12px] font-normal text-[#525252]">Category:</span>
              <span className="text-[13px] font-semibold text-[#161616]">{template.category}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-gray-200 h-4 self-center flex-none">
              <span className="text-[12px] font-normal text-[#525252]">Type:</span>
              <Badge className="bg-[#f0f4f9] text-[#2A53A0] border border-[#d0e2ff] font-medium rounded-full px-2.5 h-6 text-[11px]">Detection Template</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-[48px] text-[14px] border-gray-300 rounded-[8px] px-4 font-medium text-[#525252]">Export Schema</Button>
          <Button className="h-[48px] text-[14px] bg-[#2A53A0] hover:bg-[#1e3c75] text-white rounded-[8px] px-6 font-bold">Use Template</Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="p-6 space-y-8 max-w-[1200px] mx-auto w-full">
        
          {/* 1. Overview Section */}
          <section className="bg-white border border-[#e0e0e0] rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center gap-2 bg-[#f4f4f4]">
              <Document size={18} className="text-[#525252]" />
              <h2 className="text-[14px] font-semibold text-[#161616]">Overview</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#525252] uppercase mb-1 block">Full Description</label>
                <div className="p-3 bg-[#f4f4f4] border border-[#e0e0e0] rounded-sm text-[14px] text-[#161616]">
                  {template.description}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-bold text-[#525252] uppercase mb-1 block">Primary Category</label>
                  <div className="p-3 bg-[#f4f4f4] border border-[#e0e0e0] rounded-sm text-[14px] text-[#161616]">
                    {template.category}
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#525252] uppercase mb-1 block">Trigger Event(s)</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {template.events.map((evt, i) => (
                      <Badge key={i} className="bg-[#EAF2FF] text-[#2A53A0] border border-[#D0E2FF] rounded-sm font-normal px-2 py-0.5 text-[12px]">
                        {evt}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#525252] uppercase mb-1 block">Tags</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {template.tags.map((tag, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-[#f4f4f4] border border-[#e0e0e0] rounded-full text-[12px] text-[#525252]">
                      <Tag size={12} />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Configurable Parameters Section */}
          <section className="bg-white border border-[#e0e0e0] rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center gap-2 bg-[#f4f4f4]">
              <ChartNetwork size={18} className="text-[#525252]" />
              <h2 className="text-[14px] font-semibold text-[#161616]">Configurable Parameters</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4f4f4] border-b border-[#e0e0e0]">
                    <th className="px-4 py-2 text-[12px] font-bold text-[#525252] uppercase">Parameter Name</th>
                    <th className="px-4 py-2 text-[12px] font-bold text-[#525252] uppercase">Default Value</th>
                    <th className="px-4 py-2 text-[12px] font-bold text-[#525252] uppercase">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {template.parameters.map((param, i) => (
                    <tr key={i} className="border-b border-[#e0e0e0] hover:bg-[#fcfcfc]">
                      <td className="px-4 py-3 text-[13px] font-mono text-[#161616]">{param.name}</td>
                      <td className="px-4 py-3 text-[13px] font-mono text-[#2A53A0]">{param.defaultValue}</td>
                      <td className="px-4 py-3 text-[13px] text-[#525252]">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Detection Logic Section */}
          <section className="bg-white border border-[#e0e0e0] rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center gap-2 bg-[#f4f4f4]">
              <Code size={18} className="text-[#525252]" />
              <h2 className="text-[14px] font-semibold text-[#161616]">Detection Logic</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#525252] uppercase mb-1 block">Plain English Explanation</label>
                <div className="p-3 bg-[#f4f4f4] border border-[#e0e0e0] rounded-sm text-[14px] text-[#161616]">
                  {template.description}
                </div>
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#525252] uppercase mb-1 block">DSL Preview (Read-Only)</label>
                <div className="bg-[#161616] rounded-md p-4 mt-1">
                  <pre className="text-[13px] font-mono text-[#f4f4f4] leading-relaxed whitespace-pre-wrap">
                    {template.dsl}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Data Requirements Section */}
          <section className="bg-white border border-[#e0e0e0] rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center gap-2 bg-[#f4f4f4]">
              <Table size={18} className="text-[#525252]" />
              <h2 className="text-[14px] font-semibold text-[#161616]">Data Requirements</h2>
            </div>
            <div className="p-4 space-y-6">
              {/* Required Events */}
              <div>
                <h3 className="text-[12px] font-bold text-[#161616] mb-3">Required Events</h3>
                <div className="space-y-2">
                  {template.events.map((evt, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-[#e0e0e0] rounded-sm">
                      <span className="text-[13px] font-mono text-[#525252]">{evt}</span>
                      <div className="flex items-center gap-1.5 text-[#198038] text-[12px] font-medium">
                        <CheckmarkFilled size={16} /> Available
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required IPVs */}
              <div>
                <h3 className="text-[12px] font-bold text-[#161616] mb-3">Required IPVs (Instance Property Values)</h3>
                <div className="space-y-2">
                  {template.requiredIpvs.map((ipv, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-[#e0e0e0] rounded-sm">
                      <span className="text-[13px] font-mono text-[#525252]">{ipv}</span>
                      <div className="flex items-center gap-1.5 text-[#198038] text-[12px] font-medium">
                        <CheckmarkFilled size={16} /> Available
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Views */}
              <div>
                <h3 className="text-[12px] font-bold text-[#161616] mb-3">Required Views</h3>
                <div className="space-y-2">
                  {template.requiredViews.map((view, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-[#e0e0e0] rounded-sm">
                      <span className="text-[13px] font-mono text-[#525252]">{view}</span>
                      <div className="flex items-center gap-1.5 text-[#198038] text-[12px] font-medium">
                        <CheckmarkFilled size={16} /> Available
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 5. Sample Alert Message Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <WarningAlt size={18} className="text-[#2A53A0]" />
              <h2 className="text-[14px] font-semibold text-[#161616]">Sample Alert Message</h2>
            </div>
            <div className="bg-[#FFF9E6] border-l-4 border-l-[#F1C21B] border border-[#e0e0e0] p-4 rounded-sm">
              <p className="text-[14px] text-[#161616] leading-relaxed">
                High-risk transaction detected after password change | Customer: CUST-892456 | Device: DEV-XYZ789 | Time: 28 Jan 2026, 7:39 pm
              </p>
            </div>
            <p className="text-[11px] text-[#525252] italic">* This is a sample alert message with mock data. Actual alerts will contain real transaction details.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
