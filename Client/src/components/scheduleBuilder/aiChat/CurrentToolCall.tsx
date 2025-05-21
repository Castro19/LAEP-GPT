import { useLayoutEffect, useRef, useCallback } from "react";
import { useAppSelector } from "@/redux";
import renderToolName from "./helpers/formattingStr";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import FormattedChatMessage from "./FormattedChatMessage";

const BOTTOM_THRESHOLD = 40;
const SCROLL_AREA_ID = "assistant-tooltip-scroll";
const VIEWPORT_ID = `${SCROLL_AREA_ID}-viewport`;

const findScrollAreaViewport = (
  container: HTMLElement | null
): HTMLElement | null => {
  if (!container) return null;
  const byId = document.getElementById(VIEWPORT_ID);
  if (byId) return byId;
  return container.closest(
    "[data-radix-scroll-area-viewport]"
  ) as HTMLElement | null;
};

const CurrentToolCall = ({ currentWidth }: { currentWidth: number }) => {
  const { currentAssistantMsg, currentToolCalls } = useAppSelector(
    (state) => state.scheduleBuilderLog
  );
  const currentToolCall = currentToolCalls?.[currentToolCalls.length - 1];
  const toolName = currentToolCall ? renderToolName(currentToolCall) : null;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLElement | null>(null);
  const scrollHandlerRef = useRef<() => void>();
  const isAtBottomRef = useRef(true);
  const isFirstRenderRef = useRef(true);

  const handleScrollAreaMount = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const vp = findScrollAreaViewport(node);
      if (vp && !vp.id) {
        vp.id = VIEWPORT_ID;
      }
    }
  }, []);

  const onTooltipOpenChange = useCallback((open: boolean) => {
    const vp = findScrollAreaViewport(scrollContainerRef.current);
    if (open && vp) {
      viewportRef.current = vp;

      scrollHandlerRef.current = () => {
        const { scrollTop, scrollHeight, clientHeight } = vp;
        const distanceFromBottom = Math.abs(
          scrollHeight - clientHeight - scrollTop
        );
        isAtBottomRef.current = distanceFromBottom < BOTTOM_THRESHOLD;
      };

      vp.addEventListener("scroll", scrollHandlerRef.current);
      vp.scrollTop = vp.scrollHeight;
      isFirstRenderRef.current = false;
    } else if (viewportRef.current && scrollHandlerRef.current) {
      viewportRef.current.removeEventListener(
        "scroll",
        scrollHandlerRef.current
      );
      viewportRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    const vp = findScrollAreaViewport(scrollContainerRef.current);
    if (!vp || !currentAssistantMsg?.msg) return;

    if (isAtBottomRef.current || isFirstRenderRef.current) {
      vp.scrollTop = vp.scrollHeight;
      isFirstRenderRef.current = false;
    }
  }, [currentAssistantMsg?.msg]);

  return (
    <div className="flex items-center space-x-4">
      <motion.div
        animate={{ color: toolName ? "#22d3ee" : "#94a3b8" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-center"
      >
        <TooltipProvider>
          <Tooltip onOpenChange={onTooltipOpenChange}>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5" />
              </div>
            </TooltipTrigger>

            <TooltipContent
              className="p-0 mb-2 opacity-75"
              side="top"
              align="start"
              alignOffset={-10}
            >
              {currentAssistantMsg?.msg && (
                <div
                  style={{
                    maxWidth: `${currentWidth}px`,
                    height: "400px",
                  }}
                >
                  <ScrollArea
                    id={SCROLL_AREA_ID}
                    className="h-full"
                    ref={handleScrollAreaMount}
                  >
                    <div className="p-2 h-full" ref={scrollContainerRef}>
                      <FormattedChatMessage msg={currentAssistantMsg.msg} />
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>

      <div className="relative flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={toolName || "default"}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            {toolName && (
              <motion.div
                className="h-2 w-2 rounded-full bg-cyan-400"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
            <motion.span
              className="text-sm font-medium text-slate-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {toolName || "Schedule Builder"}
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CurrentToolCall;
