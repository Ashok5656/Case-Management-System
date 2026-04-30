import { motion } from "motion/react";
import { ArrowRight } from "@carbon/icons-react";
import { Badge } from "./ui/badge";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { Separator } from "./ui/separator";
import PageHeader from "./page-header";

// Define a generic Icon type for Carbon icons
type CarbonIcon = React.ComponentType<any>;

interface ModuleItem {
  label: string;
  count?: number;
  badge?: string;
  icon?: CarbonIcon;
  description?: string;
}

interface ModuleContentProps {
  title: string;
  icon: CarbonIcon;
  gradient: string;
  items: ModuleItem[];
  description?: string;
  breadcrumbs?: { label: string; path?: string; isActive?: boolean }[];
  onBreadcrumbNavigate?: (path: string) => void;
  version?: string;
}

export function ModuleContent({
  title,
  icon: Icon,
  gradient,
  items,
  description,
  breadcrumbs,
  onBreadcrumbNavigate,
  version,
}: ModuleContentProps) {
  return (
    <div className="flex flex-col h-full bg-white font-['Inter'] overflow-hidden">
      {breadcrumbs && onBreadcrumbNavigate && (
        <PageHeader 
          title={title} 
          breadcrumbs={breadcrumbs} 
          onBreadcrumbNavigate={onBreadcrumbNavigate} 
        />
      )}
      <motion.div
        key={title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 overflow-y-auto p-6"
      >
        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

        {items.map((item, index) => {
          const ItemIcon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group/card"
            >
              <div className="relative h-full rounded-[8px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer overflow-hidden">
                {/* Gradient accent on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                  initial={false}
                />

                {/* Glass morphism effect on hover */}
                <div className="absolute inset-0 bg-white/5 dark:bg-white/5 backdrop-blur-sm opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>

                <div className="relative">
                  {/* Icon and Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {ItemIcon && (
                        <motion.div
                          className="w-10 h-10 rounded-[8px] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center"
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ItemIcon className="size-5 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {item.count !== undefined && (
                        <Badge variant="secondary" className="text-[11px] font-medium">
                          {item.count}
                        </Badge>
                      )}
                      {item.badge && (
                        <Badge className="text-[11px] font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Label */}
                  <h4 className="text-sm text-gray-900 dark:text-white mb-2 min-h-[40px] group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors line-clamp-2">
                    {item.label}
                  </h4>

                  {/* Description if available */}
                  {item.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 min-h-[32px]">
                      {item.description}
                    </p>
                  )}

                  {/* Arrow indicator */}
                  <div className="flex items-center justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
                    <motion.div
                      className="flex items-center gap-1 text-xs text-gray-400 group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400"
                      whileHover={{ x: 4 }}
                    >
                      <span>Open</span>
                      <ArrowRight className="size-3.5" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Icon className="size-10 text-gray-400" />
          </div>
          <h3 className="text-gray-900 dark:text-white mb-2">No items available</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            There are no items configured for this module yet.
          </p>
        </motion.div>
      )}
      </motion.div>
    </div>
  );
}

// Add cn utility function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
