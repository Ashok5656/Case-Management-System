import { useState, useEffect, RefObject } from "react";
import { Button } from "./ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "./ui/utils";

interface ScrollToTopButtonProps {
  scrollRef: RefObject<HTMLElement>;
  className?: string;
  threshold?: number; // distance from bottom to trigger switch
}

export function ScrollToTopButton({ scrollRef, className, threshold = 50 }: ScrollToTopButtonProps) {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  // Add state to track if we should show the button at all (e.g. if content is scrollable)
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      
      // Check if content is actually scrollable
      setIsScrollable(scrollHeight > clientHeight);
      
      // Check if we are near the bottom
      const isBottom = scrollTop + clientHeight >= scrollHeight - threshold;
      setShowScrollToTop(isBottom);
    };

    element.addEventListener("scroll", handleScroll);
    // Trigger once to set initial state
    // We might need a small delay or ResizeObserver to detect when content loads/changes size
    // For now, call it immediately.
    handleScroll();

    // Also listen for window resize as it affects clientHeight
    window.addEventListener("resize", handleScroll);
    
    // Optional: MutationObserver to detect content changes? 
    // For simplicity, we'll rely on scroll events and initial check.
    
    return () => {
      element.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [scrollRef, threshold]);

  const scrollToBottom = () => {
     if (scrollRef.current) {
        scrollRef.current.scrollTo({
           top: scrollRef.current.scrollHeight,
           behavior: "smooth"
        });
     }
  };

  const scrollToTop = () => {
      if (scrollRef.current) {
         scrollRef.current.scrollTo({
            top: 0,
            behavior: "smooth"
         });
      }
  };

  if (!isScrollable) return null;

  return (
    <Button
       variant="secondary"
       size="icon"
       className={cn(
         "fixed bottom-6 right-6 z-50 rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 text-gray-600 bg-white",
         className
       )}
       onClick={showScrollToTop ? scrollToTop : scrollToBottom}
    >
       {showScrollToTop ? <ArrowUp className="size-5" /> : <ArrowDown className="size-5" />}
    </Button>
  );
}
