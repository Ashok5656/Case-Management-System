import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { cn } from "./utils"

interface ResponsiveAttributesProps {
  items: { id: string; content: React.ReactNode }[]
  className?: string
}

export function ResponsiveAttributes({ items, className }: ResponsiveAttributesProps) {
  const [visibleCount, setVisibleCount] = React.useState(items.length)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const measureRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const calculateVisibility = () => {
      if (!containerRef.current || !measureRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const measureChildren = Array.from(measureRef.current.children)
      
      // Constants for spacing calculation
      // Gap is gap-x-1 (0.25rem = 4px)
      // The visual separator `|` is roughly 4-5px wide.
      // Gap is 4px on each side.
      // Total separator overhead = 4 + 5 + 4 = 13px. 
      // Using 12px to be aggressive
      const separatorOverhead = 12
      
      // More button structure: (gap) [|] (gap) [MoreBtn]
      // MoreBtn width: p-1 (4px*2) + size-4 (16px) = 24px.
      // Inner structure: Separator (12) + Btn (24) = 36px
      const moreButtonOverhead = 36

      let currentWidth = 0
      let count = 0

      for (let i = 0; i < measureChildren.length; i++) {
        const childWidth = (measureChildren[i] as HTMLElement).offsetWidth
        // Add separator if not first
        const itemWidth = childWidth + (i > 0 ? separatorOverhead : 0)

        // Determine if we can fit this item.
        // If this is the LAST item, we just need to fit the item itself (no "More" button needed).
        // If this is NOT the last item, we need to ensure that AFTER adding this item, 
        // we still have space for the "More" button in case the NEXT item doesn't fit.
        
        const spaceNeeded = currentWidth + itemWidth
        const spaceAvailable = containerWidth
        
        // Check fit
        if (i === items.length - 1) {
            // Last item: just needs to fit
            if (spaceNeeded <= spaceAvailable) {
                count++
                currentWidth += itemWidth
            } else {
                break
            }
        } else {
            // Not last item: needs to fit AND leave room for "More" button if we stopped here?
            // Actually, logic is: Can we add this item?
            // If we add this item, and it's the last one we can add, do we have space for the "More" button?
            // Wait, if we add this item, and we still have items remaining (i < items.length - 1), 
            // then effectively we occupy (currentWidth + itemWidth).
            // But if the NEXT item overflows, we will need to show "More". 
            // So we must ensure that (currentWidth + itemWidth + moreButtonOverhead) <= containerWidth 
            // IS NOT THE CONDITION for adding *this* item.
            // The condition is: 
            // 1. Does *this* item fit?
            // 2. If *this* item fits, but the *next* one doesn't, can we fit the "More" button?
            // If we can't fit the "More" button alongside this item, then we shouldn't add this item, 
            // because we'll need to show "More" for the *remaining* items (including this one).
            
            // So: spaceNeeded + moreButtonOverhead <= spaceAvailable?
            if (spaceNeeded + moreButtonOverhead <= spaceAvailable) {
               count++
               currentWidth += itemWidth
            } else {
               // Special case: What if this item fits, but adding "More" makes it overflow?
               // Then we have to stop at the PREVIOUS item to show "More".
               // So we don't increment count.
               break
            }
        }
      }

      setVisibleCount(count)
    }

    calculateVisibility()
    
    const observer = new ResizeObserver(calculateVisibility)
    observer.observe(containerRef.current)
    
    return () => observer.disconnect()
  }, [items])

  return (
    <div className={cn("relative w-full min-w-0", className)}>
      {/* Hidden Measurement Container - Renders all items to measure natural width */}
      <div 
        ref={measureRef} 
        className="absolute top-0 left-0 flex items-center gap-x-1 invisible pointer-events-none w-max text-sm"
        aria-hidden="true"
      >
        {items.map((item) => (
          <div key={item.id} className="whitespace-nowrap flex items-center">{item.content}</div>
        ))}
      </div>

      {/* Visible Container */}
      <div ref={containerRef} className="flex items-center gap-x-1 w-full overflow-hidden whitespace-nowrap text-sm">
        {items.slice(0, visibleCount).map((item, index) => (
          <div key={item.id} className="contents">
            {index > 0 && <span className="text-gray-300 shrink-0">|</span>}
            <div className="flex items-center truncate max-w-full">
                {item.content}
            </div>
          </div>
        ))}
        
        {visibleCount < items.length && (
          <div className="flex items-center gap-x-1 shrink-0">
              <span className="text-gray-300">|</span>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
                      <MoreHorizontal className="size-4 text-gray-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="end" className="flex flex-col gap-2 p-3 bg-white text-gray-900 border border-gray-200 shadow-xl rounded-lg max-h-[300px] overflow-y-auto min-w-[200px] z-50">
                    {items.slice(visibleCount).map((item) => (
                      <div key={item.id} className="flex flex-col gap-1 pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                        {item.content}
                      </div>
                    ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  )
}
