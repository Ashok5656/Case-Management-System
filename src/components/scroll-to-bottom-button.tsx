import { useState, useEffect, RefObject } from "react";
import { Button } from "./ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "./ui/utils";

interface ScrollToBottomButtonProps {
  scrollRef: RefObject<HTMLElement>;
  className?: string;
  threshold?: number; 
}

export function ScrollToBottomButton({ scrollRef, className, threshold = 100 }: ScrollToBottomButtonProps) {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      
      // Determine if we are essentially at the bottom
      const nearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
      setIsAtBottom(nearBottom);
      
      // Check if content is actually scrollable
      setCanScroll(scrollHeight > clientHeight + 20);
    };

    element.addEventListener("scroll", handleScroll);
    handleScroll();
    
    const timer = setTimeout(handleScroll, 500);
    window.addEventListener("resize", handleScroll);

    return () => {
      element.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [scrollRef, threshold]);

  const handleScrollAction = () => {
    if (!scrollRef.current) return;
    
    if (isAtBottom) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  if (!canScroll) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        // Reduced size (40px) and moved closer to the bottom right corner above the footer
        "fixed bottom-[54px] right-4 z-50 rounded-full shadow-lg border border-gray-100 bg-white text-[#334155] hover:bg-gray-50 transition-all duration-300 w-10 h-10 group flex items-center justify-center",
        className
      )}
      onClick={handleScrollAction}
      title={isAtBottom ? "Scroll to Top" : "Scroll to Bottom"}
    >
      <div className="relative flex items-center justify-center">
        {isAtBottom ? (
          <ArrowUp className="size-5 text-[#334155] transition-all duration-300 group-hover:-translate-y-0.5" />
        ) : (
          <ArrowDown className="size-5 text-[#334155] transition-all duration-300 group-hover:translate-y-0.5" />
        )}
      </div>
    </Button>
  );
}
