import { useEffect, useState } from "react";
import { Search, FileText, AlertTriangle, Users, TrendingUp, Clock, Settings, Shield, BarChart3, LayoutDashboard } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "./ui/utils";

export interface SearchResult {
  id: string;
  title: string;
  module: string;
  type: string;
  description: string;
  timestamp?: string;
  severity?: "high" | "medium" | "low";
  path?: string; // Add path for navigation
}

interface GlobalSearchProps {
  query?: string;
  items?: SearchResult[];
  onSelect: (result: SearchResult) => void;
  onClose: () => void;
  className?: string;
}

export function GlobalSearch({ query = "", items = [], onSelect, onClose, className }: GlobalSearchProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "High-risk transactions",
    "Pending investigations",
    "Customer #12345",
  ]);

  // Mock search results (System data)
  const mockResults: SearchResult[] = [
    {
      id: "alert-001",
      title: "Suspicious Transaction - $50,000",
      module: "AML",
      type: "Alert",
      description: "Large cash deposit flagged for review",
      timestamp: "2 hours ago",
      severity: "high",
    },
    {
      id: "case-042",
      title: "Investigation Case #042",
      module: "Investigation",
      type: "Case",
      description: "Money laundering investigation",
      timestamp: "1 day ago",
      severity: "high",
    },
    {
      id: "report-123",
      title: "Weekly AML Compliance Report",
      module: "Reports",
      type: "Report",
      description: "Summary of flagged transactions",
      timestamp: "3 days ago",
      severity: "medium",
    },
    {
      id: "customer-456",
      title: "Customer Profile - John Doe",
      module: "AML",
      type: "Profile",
      description: "Risk score: 78/100",
      timestamp: "5 hours ago",
      severity: "medium",
    },
    {
      id: "audit-789",
      title: "Audit Trail - User Actions",
      module: "Audit",
      type: "Audit",
      description: "System access logs",
      timestamp: "1 week ago",
      severity: "low",
    },
  ];

  useEffect(() => {
    if (query && query.length > 0) {
      const lowerQuery = query.toLowerCase();
      
      // Filter mock results
      const filteredMock = mockResults.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.module.toLowerCase().includes(lowerQuery)
      );

      // Filter passed navigation items
      const filteredItems = items ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.module.toLowerCase().includes(lowerQuery)
      ) : [];

      // Combine results (Navigation items first, then mock data)
      setResults([...filteredItems, ...filteredMock]);
    } else {
      setResults([]);
    }
  }, [query, items]);

  const getModuleIcon = (module: string) => {
    switch (module.toLowerCase()) {
      case "aml":
        return Shield;
      case "investigation":
        return Search;
      case "reports":
        return BarChart3;
      case "audit":
        return FileText;
      case "config":
        return Settings;
      case "dashboard":
        return LayoutDashboard;
      default:
        return FileText;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400";
      case "medium":
        return "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400";
      case "low":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className={cn("bg-white dark:bg-gray-900 rounded-[8px] shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col", className)}>
      <ScrollArea className="max-h-[400px]">
        <div className="p-2">
          {(!query || query.length === 0) ? (
            <div className="space-y-4 p-2">
              {/* Recent Searches */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                  <Clock className="size-3" />
                  Recent Searches
                </p>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => onSelect({ id: search, title: search, module: "Recent", type: "Search", description: "" } as any)}
                      className="w-full text-left px-3 py-2 rounded-[8px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Quick Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 rounded-[8px] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-left">
                    <AlertTriangle className="size-4 mb-1 text-[#2A53A0]" />
                    <p className="text-gray-700 dark:text-gray-300">View Alerts</p>
                  </button>
                  <button className="px-3 py-2 rounded-[8px] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-left">
                    <Users className="size-4 mb-1 text-[#2A53A0]" />
                    <p className="text-gray-700 dark:text-gray-300">Investigations</p>
                  </button>
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result) => {
                const Icon = getModuleIcon(result.module);
                return (
                  <button
                    key={result.id}
                    onClick={() => onSelect(result)}
                    className="w-full text-left px-3 py-3 rounded-[8px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-[8px] bg-[#2A53A0]/10 dark:bg-[#2A53A0]/20">
                        <Icon className="size-4 text-[#2A53A0]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm text-gray-900 dark:text-white truncate font-medium">
                            {result.title}
                          </p>
                          {result.severity && (
                            <Badge
                              variant="secondary"
                              className={`${getSeverityColor(result.severity)} text-xs px-2 py-0`}
                            >
                              {result.severity}
                            </Badge>
                          )}
                          {result.type === "Navigation" && (
                             <Badge variant="outline" className="text-xs px-2 py-0 bg-gray-50 dark:bg-gray-800">
                               Jump to
                             </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            {result.module}
                          </Badge>
                          {result.timestamp && (
                            <span className="text-xs text-gray-400">
                              {result.timestamp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Search className="size-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Press <kbd className="px-1 py-0.5 rounded bg-white dark:bg-gray-800 border">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
