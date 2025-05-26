import {
  useState,
  useCallback,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";
// Redux:
import { useAppSelector } from "@/redux";
import { motion, AnimatePresence } from "framer-motion";

// My components:
import { renderToolName } from "@/components/scheduleBuilder/aiChat/helpers/FormattingStrs";
import { FormattedChatMessage } from "@/components/scheduleBuilder/aiChat";
// UI components:
import { MessageSquare } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipPortal,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const CurrentToolCall = ({
  currentWidth,
  minimized,
}: {
  currentWidth: number;
  minimized: boolean;
}) => {
  const { currentAssistantMsg, currentToolCalls, assistantMsgBeingStreamed } =
    useAppSelector((state) => state.scheduleBuilderLog);
  const currentToolCall = currentToolCalls?.[currentToolCalls.length - 1];
  const toolName = currentToolCall ? renderToolName(currentToolCall) : null;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const isFirstRenderRef = useRef(true);
  const prevMessageIdRef = useRef<string | null>(null);

  /**
   * Tooltip state management
   * - `open`: controls the Radix Tooltip visibility
   * - `pinned`: when true, the tooltip stays open until the icon is clicked again
   * - `forceMount`: ensures Radix keeps the portal mounted while open/pinned
   */
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [forceMount, setForceMount] = useState(false);

  // Close whenever the widget is minimised
  useEffect(() => {
    if (minimized) {
      setOpen(false);
      setPinned(false);
      setForceMount(false);
    }
  }, [minimized]);

  // Reset tooltip when a brand‑new assistant message completes
  useEffect(() => {
    if (!currentAssistantMsg?.msg_id) return;

    if (prevMessageIdRef.current !== currentAssistantMsg.msg_id) {
      setForceMount(true);
      setOpen(true);
      setPinned(false);
      prevMessageIdRef.current = currentAssistantMsg.msg_id;
    }
  }, [currentAssistantMsg?.msg_id]);

  const handleScrollAreaMount = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const vp = findScrollAreaViewport(node);
      if (vp && !vp.id) vp.id = VIEWPORT_ID;
    }
  }, []);

  /**
   * Close on outside click ONLY when not pinned.
   * We attach a one‑shot listener each time the tooltip opens.
   */
  useLayoutEffect(() => {
    if (!open || pinned) return;

    const handleClickAway = () => {
      setOpen(false);
      setForceMount(false);
    };

    window.addEventListener("pointerdown", handleClickAway, { once: true });
    return () => window.removeEventListener("pointerdown", handleClickAway);
  }, [open, pinned]);

  /**
   * Auto‑scroll to the bottom while we are streaming content.
   */
  useLayoutEffect(() => {
    const vp = findScrollAreaViewport(scrollContainerRef.current);
    if (!vp || !currentAssistantMsg?.msg) return;

    if (isAtBottomRef.current || isFirstRenderRef.current) {
      vp.scrollTop = vp.scrollHeight;
      isFirstRenderRef.current = false;
    }
  }, [currentAssistantMsg?.msg]);

  /**
   * Icon click toggles the pinned/open states
   */
  const handleIconClick = () => {
    if (pinned) {
      setPinned(false);
      setOpen(false);
      setForceMount(false);
    } else {
      setPinned(true);
      setOpen(true);
      setForceMount(true);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <motion.div
        animate={{ color: toolName ? "#22d3ee" : "#94a3b8" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-center"
      >
        <TooltipProvider>
          <Tooltip
            open={open}
            onOpenChange={(next) => {
              // Ignore hover‑driven close events while pinned
              if (!pinned) {
                setOpen(next);
                if (!next) setForceMount(false);
              }
            }}
          >
            <TooltipTrigger asChild>
              <div
                className="flex items-center cursor-pointer"
                onClick={handleIconClick}
              >
                <motion.div
                  animate={{
                    scale:
                      currentAssistantMsg && assistantMsgBeingStreamed
                        ? [1, 1.1, 1]
                        : 1,
                    color:
                      currentAssistantMsg && assistantMsgBeingStreamed
                        ? "#22d3ee"
                        : "#94a3b8",
                  }}
                  transition={{
                    scale: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    color: { duration: 0.3, ease: "easeOut" },
                  }}
                >
                  <MessageSquare className="h-5 w-5" />
                </motion.div>
              </div>
            </TooltipTrigger>

            <TooltipPortal>
              <TooltipContent
                forceMount={(forceMount && !minimized) as true}
                side="top"
                align="start"
                alignOffset={-10}
                className="p-0 mb-2 opacity-75 z-[9999]"
              >
                {currentAssistantMsg?.msg && (
                  <div
                    style={{ maxWidth: `${currentWidth}px`, height: "400px" }}
                  >
                    <ScrollArea
                      id={SCROLL_AREA_ID}
                      className="h-full"
                      ref={handleScrollAreaMount}
                    >
                      <div
                        className="p-2 h-full"
                        ref={scrollContainerRef}
                        onScroll={(e) => {
                          const el = e.target as HTMLElement;
                          const atBottom =
                            el.scrollHeight - el.scrollTop - el.clientHeight <
                            2;
                          isAtBottomRef.current = atBottom;
                        }}
                      >
                        <FormattedChatMessage msg={currentAssistantMsg.msg} />
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </TooltipContent>
            </TooltipPortal>
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
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
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
              {toolName}
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CurrentToolCall;
