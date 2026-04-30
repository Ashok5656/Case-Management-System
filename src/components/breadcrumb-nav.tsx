interface BreadcrumbItem {
  label: string;
  href?: string;
  path?: string;
  isActive?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

export function BreadcrumbNav({ items, onNavigate }: BreadcrumbNavProps) {
  const handleClick = (item: BreadcrumbItem) => {
    const target = item.path || item.href;
    if (target && onNavigate && !item.isActive) {
      onNavigate(target);
    }
  };

  return (
    <nav className="flex items-center gap-2">
      {items?.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
          <button
            onClick={() => handleClick(item)}
            disabled={item.isActive}
            className={`text-sm font-normal transition-colors ${
              item.isActive
                ? "text-[#161616] dark:text-gray-400 pointer-events-none"
                : "text-[#2A53A0] dark:text-[#6b93e6] hover:text-[#1e3a70] dark:hover:text-[#8cb0ff]"
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {item.label}
          </button>
        </div>
      ))}
    </nav>
  );
}
