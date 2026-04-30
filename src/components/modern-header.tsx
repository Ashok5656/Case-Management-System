import { useState, useRef, useEffect } from "react";
import { 
  Notification as Bell, 
  Moon, 
  Sun, 
  User, 
  Logout as LogOut, 
  Settings, 
  UserAvatar as UserCircle, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Globe, 
  Checkmark as Check, 
  Security as ShieldCheck, 
  Security as ShieldOff, 
} from "@carbon/icons-react";
import { cn } from "./ui/utils";
import collapseLogo from "figma:asset/4695cc06ada82390ec617ae2b76764d7dd803fe5.png";

import { useTheme } from "./theme-provider";
import { motion, AnimatePresence } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { GlobalSearch, SearchResult } from "./global-search";
import { KeyboardShortcuts, useKeyboardShortcuts } from "./keyboard-shortcuts";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";

interface Module {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  gradient?: string;
}

interface ModernHeaderProps {
  onLogout: () => void;
  isSubmenuOpen?: boolean;
  onSubmenuToggle?: () => void;
  is2FAEnabled?: boolean;
  onToggle2FA?: (enabled: boolean) => void;
  username?: string;
  userRole?: string;
  isSidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  modules?: Module[];
  currentModule?: string;
  onModuleSelect?: (moduleId: string) => void;
  searchableItems?: SearchResult[];
  pageTitle?: string;
}

export function ModernHeader({ 
  onLogout, 
  is2FAEnabled,
  onToggle2FA,
  username,
  userRole,
  isSidebarCollapsed,
  onSidebarToggle,
  onModuleSelect,
  searchableItems = [],
}: ModernHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useKeyboardShortcuts(
    () => {
      inputRef.current?.focus();
      setIsSearchActive(true);
    },
    () => setIsShortcutsOpen(true)
  );

  const languages = [
    { code: "en", name: "English", label: "EN" },
    { code: "es", name: "Español", label: "ES" },
    { code: "fr", name: "Français", label: "FR" },
    { code: "de", name: "Deutsch", label: "DE" },
    { code: "zh", name: "中文", label: "ZH" },
    { code: "ja", name: "日本語", label: "JA" },
    { code: "ar", name: "العربية", label: "AR" },
    { code: "hi", name: "हिन्दी", label: "HI" },
  ];

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  const notifications = [
    { id: 1, title: "High-Risk Transaction Alert", description: "₹8.5L withdrawal detected - Rajesh Kumar", time: "2 min ago", type: "critical", unread: true },
    { id: 2, title: "Compliance Report Ready", description: "Monthly AML report has been generated", time: "15 min ago", type: "info", unread: true },
    { id: 3, title: "System Update Complete", description: "AI detection model updated successfully", time: "1 hour ago", type: "success", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="h-[46px] border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50">
        <div className="h-full px-[20px] flex items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4">
            {onSidebarToggle && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onSidebarToggle}
                      className="h-[28px] w-[28px] flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-[4px] transition-all text-gray-500 hover:text-[#2A53A0] dark:text-gray-400 dark:hover:text-[#6b93e6]"
                    >
                      {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-gray-900 text-white border-0">
                    <p>{isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div ref={searchContainerRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[320px] hidden md:block">
            <div className={cn(
                "flex items-center gap-3 px-4 h-[34px] transition-all border rounded-[8px]",
                isSearchActive 
                  ? "bg-white border-[#2A53A0] shadow-sm" 
                  : "bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 hover:bg-gray-100"
            )}>
              <Search size={18} className={isSearchActive ? 'text-[#2A53A0]' : 'text-gray-400'} />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchActive(true)}
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 h-full w-full"
                placeholder="Search Genie"
              />
            </div>
            
            <AnimatePresence>
              {isSearchActive && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] mt-2 z-50"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-[8px] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <GlobalSearch 
                      query={searchQuery}
                      items={searchableItems}
                      onSelect={(result) => {
                        setIsSearchActive(false);
                        setSearchQuery(result.title);
                        if (result.path && onModuleSelect) onModuleSelect(result.path);
                      }}
                      onClose={() => setIsSearchActive(false)}
                      className="border-0 shadow-none rounded-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-[28px] w-[28px] flex items-center justify-center rounded-[4px] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-[#2A53A0] dark:text-gray-400 transition-all">
                  <Globe size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Globe size={16} className="text-[#2A53A0]" />
                  <span>Select Language</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map(lang => (
                  <DropdownMenuItem key={lang.code} onClick={() => setSelectedLanguage(lang.code)} className="flex items-center gap-3 py-2 cursor-pointer">
                    <Badge variant="outline" className="w-8 justify-center">{lang.label}</Badge>
                    <span className="flex-1 font-medium">{lang.name}</span>
                    {lang.code === selectedLanguage && <Check size={16} className="text-[#2A53A0]" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={toggleTheme} className="h-[28px] w-[28px] flex items-center justify-center rounded-[4px] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-[#2A53A0] dark:text-gray-400 transition-all">
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-900 text-white border-0">
                  <p>Switch to {theme === "light" ? "dark" : "light"} mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <button className="relative h-[28px] w-[28px] flex items-center justify-center rounded-[4px] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-[#2A53A0] dark:text-gray-400 transition-all">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border-2 border-white dark:border-gray-950"></span>
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${n.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${n.type === 'critical' ? 'bg-red-500' : n.type === 'info' ? 'bg-blue-500' : 'bg-green-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{n.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{n.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-7 w-px bg-gray-200 dark:bg-gray-800 mx-0.5" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-0.5 rounded-[4px] h-[34px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-[#2A53A0] flex items-center justify-center text-white shadow-md border-2 border-white dark:border-gray-800">
                      <span className="font-bold text-[10px]">{username ? username.charAt(0).toUpperCase() : "U"}</span>
                    </div>
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-[11px] font-bold leading-none mb-0.5">{username || "User"}</span>
                    <span className="text-[8px] text-gray-500 font-medium uppercase tracking-wider">{userRole || "Admin"}</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-[#2A53A0] flex items-center justify-center text-white"><User size={20} /></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{username}</span>
                      <span className="text-xs text-gray-500">{userRole}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><UserCircle size={16} className="mr-3" /><span>Profile</span></DropdownMenuItem>
                <DropdownMenuItem><Settings size={16} className="mr-3" /><span>Settings</span></DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-3 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {is2FAEnabled ? <ShieldCheck size={16} className="text-green-600" /> : <ShieldOff size={16} className="text-gray-400" />}
                      <span className="text-sm font-medium">Two-Factor Auth</span>
                    </div>
                    <Switch checked={is2FAEnabled} onCheckedChange={onToggle2FA} />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsShortcutsOpen(true)} className="py-2.5">
                  <span className="mr-3 text-lg">⌨️</span>
                  <span>Keyboard Shortcuts</span>
                  <kbd className="ml-auto text-xs text-gray-400 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">?</kbd>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="py-2.5 text-red-600 dark:text-red-400">
                  <LogOut size={16} className="mr-3" /><span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <KeyboardShortcuts isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </>
  );
}
