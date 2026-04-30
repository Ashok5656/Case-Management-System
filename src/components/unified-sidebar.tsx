import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { cn } from "./ui/utils";
import {
  ChevronDown,
  ChevronRight,
  Add,
  Subtract,
  Settings,
} from "@carbon/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";
import clari5Logo from "figma:asset/6dfdb4c1a68d250267231b32de1f1a07e05b6acf.png";
import clari5Favicon from "figma:asset/4695cc06ada82390ec617ae2b76764d7dd803fe5.png";
import React from "react";

// Clean button wrapper that filters out Figma inspector props
const CleanButton = React.forwardRef<HTMLButtonElement, any>((allProps, ref) => {
  // Filter out all props that start with _fg (Figma inspector props)
  const { children, ...restProps } = allProps;
  const cleanProps: any = {};
  
  Object.keys(restProps).forEach((key) => {
    if (!key.startsWith('_fg') && !key.startsWith('data-fg')) {
      cleanProps[key] = restProps[key];
    }
  });
  
  return <button ref={ref} {...cleanProps}>{children}</button>;
});
CleanButton.displayName = "CleanButton";

type CarbonIcon = React.ComponentType<any>;

interface SubMenuItem {
  id: string;
  label: string;
  icon?: CarbonIcon;
}

interface SubMenuCategory {
  id: string;
  label: string;
  icon?: CarbonIcon;
  items: SubMenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  icon: CarbonIcon;
  gradient: string;
  subItems?: SubMenuItem[];
  categories?: SubMenuCategory[];
  alertCount?: number;
  noPrefix?: boolean;
}

interface UnifiedSidebarProps {
  menuItems: MenuItem[];
  activeItem: string;
  onSelect: (itemId: string) => void;
  onItemSelect?: (itemId: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function UnifiedSidebar({
  menuItems,
  activeItem,
  onSelect,
  onItemSelect,
  isCollapsed,
  onToggle,
}: UnifiedSidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const handleSelection = (itemId: string) => {
    if (typeof onSelect === 'function') {
      onSelect(itemId);
    }
    if (typeof onItemSelect === 'function') {
      onItemSelect(itemId);
    }
  };

  const toggleMenu = (menuId: string) => {
    if (isCollapsed) {
      onToggle();
      setExpandedMenus({ [menuId]: true });
      return;
    }
    setExpandedMenus(prev => ({ [menuId]: !prev[menuId] }));
    setExpandedCategories({});
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({ [categoryId]: !prev[categoryId] }));
  };

  const handleSubItemClick = (parentId: string, subItemId: string) => {
    const parent = menuItems.find(m => m.id === parentId);
    if (parent?.noPrefix) {
      handleSelection(subItemId);
    } else {
      handleSelection(`${parentId}-${subItemId}`);
    }
  };

  const isSubItemActive = (parentId: string, subItemId: string) => {
    const parent = menuItems.find(m => m.id === parentId);
    const fullId = parent?.noPrefix ? subItemId : `${parentId}-${subItemId}`;

    // Check for exact match or child pages
    if (activeItem === fullId || activeItem?.startsWith(`${fullId}-`) || activeItem?.startsWith(`${fullId}:`)) {
      return true;
    }

    // Special handling for workspace management child pages (Key Configuration, Settings)
    if (fullId === 'system-configuration-workspace-management') {
      if (activeItem === 'system-configuration-workspace-key-config' ||
          activeItem === 'system-configuration-workspace-settings') {
        return true;
      }
    }

    // Keep Cases sub-item active when on case detail or alert detail pages
    if (fullId === 'home-cases') {
      if (activeItem?.startsWith('case-detail-') || activeItem?.startsWith('alert-detail-')) {
        return true;
      }
    }

    return false;
  };

  const isMenuAnyChildActive = (menu: MenuItem) => {
    if (menu.subItems?.some(item => isSubItemActive(menu.id, item.id))) return true;
    if (menu.categories?.some(cat => cat.items.some(item => isSubItemActive(menu.id, item.id)))) return true;
    return false;
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isCollapsed);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showBottomFade, setShowBottomFade] = useState(false);

  // Auto-expand parent menu when child is active
  useEffect(() => {
    menuItems.forEach(menu => {
      if (isMenuAnyChildActive(menu)) {
        setExpandedMenus(prev => ({ ...prev, [menu.id]: true }));
      }
    });
  }, [activeItem]);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setShowBottomFade(scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 5);
      }
    };

    checkScroll();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, [menuItems, expandedMenus, expandedCategories]);

  return (
    <div 
      style={{ width: isCollapsed ? 54 : 260 }}
      className="h-full flex flex-col bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-[width] duration-300 ease-in-out overflow-hidden relative"
    >
      <div className={cn(
        "h-[46px] flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center overflow-hidden",
        isCollapsed ? "justify-center px-0" : "px-[20px]"
      )}>
        {!isCollapsed ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex justify-center items-center"
          >
            <img src={clari5Logo} alt="Clari5" className="h-8 w-auto object-contain max-w-full" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex justify-center items-center"
          >
            <img src={clari5Favicon} alt="Clari5" className="h-7 w-auto object-contain" />
          </motion.div>
        )}
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col">
        <div 
          ref={scrollRef}
          className="flex-1 hover-scroll overflow-x-hidden"
        >
          <nav className="py-0 space-y-1">
          {isCollapsed ? (
            <div className="flex justify-center pt-2 pb-0">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 border border-gray-400/20" />
            </div>
          ) : (
            <div className="px-[20px] pt-1 pb-1">
              <span className="text-[11px] font-bold text-[#525252] uppercase tracking-wider">Main menu</span>
            </div>
          )}

          {menuItems.map((menu) => {
            const hasSubItems = (menu.subItems && menu.subItems.length > 0) || (menu.categories && menu.categories.length > 0);
            
            // Special handling for verification pages - always highlight Pending Verification menu
            const isVerificationPage = activeItem?.includes("-verify-");
            
            // Determine if this menu is active
            let isActive = false;
            if (isVerificationPage) {
              // On verification pages, only highlight Pending Verification menu
              isActive = menu.id === "pending-verification-main";
            } else {
              // Normal active state logic for non-verification pages
              isActive = activeItem === menu.id || 
                        activeItem?.startsWith(menu.id + "-") || 
                        activeItem?.startsWith(menu.id + ":") ||
                        (menu.noPrefix && isMenuAnyChildActive(menu));
            }
            
            const isOpen = expandedMenus[menu.id];
            
            return (
              <div key={menu.id}>
                <Tooltip open={isCollapsed ? undefined : false}>
                  <TooltipTrigger asChild>
                    <CleanButton
                      onClick={() => {
                        if (hasSubItems) {
                          toggleMenu(menu.id);
                        } else {
                          setExpandedMenus({});
                          handleSelection(menu.id);
                        }
                      }}
                      className={cn(
                        "w-full h-[46px] flex items-center transition-all group relative",
                        isCollapsed ? "justify-center px-0" : "px-[20px] py-4 gap-2",
                        isActive && !isOpen 
                          ? "bg-[#EAF2FF] dark:bg-[#2A53A0]/20 border-l-4 border-[#2A53A0]" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-800",
                        isActive ? "text-[#2A53A0]" : "text-[#161616] dark:text-gray-300",
                        !isCollapsed && isActive && !isOpen ? "pl-[16px]" : ""
                      )}
                    >
                      <menu.icon size={16} className={cn(isActive && "text-[#2A53A0]")} />
                      
                      {!isCollapsed && (
                        <>
                          <span className={cn(
                            "flex-1 text-left text-[15px] truncate",
                            isActive ? "font-medium" : "font-normal"
                          )}>{menu.title}</span>
                          
                          {menu.alertCount && menu.alertCount > 0 && (
                            <span className="bg-[#DA1E28] text-white text-[11px] font-medium px-1.5 py-0.5 rounded-full min-w-[20px] h-4 flex items-center justify-center">
                              {menu.alertCount}
                            </span>
                          )}

                          {hasSubItems && (
                            <div className="flex-shrink-0">
                              {isOpen ? <ChevronDown size={16} className="text-[#2A53A0]" /> : <ChevronRight size={16} className="text-gray-400" />}
                            </div>
                          )}
                        </>
                      )}

                      {isCollapsed && menu.alertCount && menu.alertCount > 0 && (
                        <span className="absolute top-2 right-3 w-2 h-2 bg-[#DA1E28] rounded-full border border-white" />
                      )}
                    </CleanButton>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="bg-[#161616] text-white border-0 z-[100]">
                      <p>{menu.title}</p>
                    </TooltipContent>
                  )}
                </Tooltip>

                {!isCollapsed && hasSubItems && isOpen && (
                  <div className="mt-1 space-y-1">
                    {menu.subItems?.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSubItemClick(menu.id, item.id)}
                        className={cn(
                          "w-full h-[42px] flex items-center gap-2 py-3 pr-4 text-left transition-all text-[14px]",
                          "pl-[44px]",
                          isSubItemActive(menu.id, item.id)
                            ? "bg-[#EAF2FF] dark:bg-[#2A53A0]/20 text-[#2A53A0] font-medium border-l-4 border-[#2A53A0] pl-[40px]"
                            : "text-[#525252] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-normal"
                        )}
                      >
                        {item.icon && <item.icon size={16} />}
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}

                    {menu.categories?.map((category) => {
                      const isCatActive = category.items.some(item => isSubItemActive(menu.id, item.id));
                      const isCatOpen = expandedCategories[`${menu.id}-${category.id}`];

                      return (
                        <div key={category.id} className="space-y-1">
                          <button
                            onClick={() => toggleCategory(`${menu.id}-${category.id}`)}
                            className={cn(
                              "w-full h-[42px] flex items-center gap-2 pl-[44px] pr-4 py-3 transition-all text-left",
                              isCatActive 
                                ? "text-[#2A53A0] font-medium" 
                                : "text-[#525252] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-normal"
                            )}
                          >
                            {category.icon && <category.icon size={16} />}
                            <span className="flex-1 truncate text-[15px]">{category.label}</span>
                            {isCatOpen ? <Subtract size={14} className="text-[#2A53A0]" /> : <Add size={14} className="text-gray-400" />}
                          </button>

                          {isCatOpen && (
                            <div className="space-y-1">
                              {category.items.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => handleSubItemClick(menu.id, item.id)}
                                  className={cn(
                                    "w-full h-[42px] flex items-center gap-2 py-3 pl-[64px] pr-4 text-left transition-all text-[14px]",
                                    isSubItemActive(menu.id, item.id)
                                      ? "bg-[#EAF2FF] dark:bg-[#2A53A0]/20 text-[#2A53A0] font-medium border-l-4 border-[#2A53A0] pl-[60px]"
                                      : "text-[#525252] hover:bg-gray-50 dark:hover:bg-gray-800 font-normal"
                                  )}
                                >
                                  {item.icon && <item.icon size={16} />}
                                  <span className="truncate">{item.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      
      {/* Bottom Fade/Overflow Indicator */}
      <motion.div 
        initial={false}
        animate={{ opacity: showBottomFade ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-10"
      />
    </div>

    </div>
  );
}