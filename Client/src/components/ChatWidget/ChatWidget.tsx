import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { MessageSquare, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScheduleBuilderAIChat } from "../scheduleBuilder";
import ScheduleBuilderAIChatHeader from "../scheduleBuilder/aiChat/ScheduleBuilderAIChatHeader";
import CurrentToolCall from "../scheduleBuilder/aiChat/CurrentToolCall";
import ScheduleBuilderChatInput from "../scheduleBuilder/aiChat/ScheduleBuilderChatInput";

type ChatWidgetProps = { initialOpen?: boolean };

export function ChatWidget({ initialOpen = false }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isPulsing, setIsPulsing] = useState(false);
  /* refs for ChatInput – still stubs */
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  // dimensions and refs
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(isOpen ? 400 : 56);
  const [height, setHeight] = useState<number>(
    isOpen && !isMinimized ? 600 : 56
  );
  const startX = useRef(0);
  const startY = useRef(0);
  const startW = useRef(width);
  const startH = useRef(height);

  // motion values and springs
  const motionW = useMotionValue(isOpen ? 400 : 56);
  const motionH = useMotionValue(isOpen && !isMinimized ? 600 : 56);

  // gentle springs
  const springW = useSpring(motionW, { stiffness: 300, damping: 30 });
  const springH = useSpring(motionH, { stiffness: 300, damping: 30 });

  // sync motion values with state
  useEffect(() => {
    motionW.set(width);
  }, [width]);
  useEffect(() => {
    motionH.set(isMinimized ? 56 : height);
  }, [height, isMinimized]);

  // entry pulse/animation
  useEffect(() => {
    if (shouldAnimate) {
      const t = setTimeout(() => setShouldAnimate(false), 300);
      return () => clearTimeout(t);
    }
  }, [shouldAnimate]);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;
    if (!isOpen && !isMinimized) {
      interval = setInterval(() => {
        setIsPulsing(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => setIsPulsing(false), 1000);
      }, 10000);
    }
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      setIsPulsing(false);
    };
  }, [isOpen, isMinimized]);

  // sync on toggle
  useEffect(() => {
    setWidth(isOpen ? 400 : 56);
    setHeight(isOpen && !isMinimized ? 600 : 56);
  }, [isOpen, isMinimized]);

  // horizontal drag
  const doDrag = useCallback((e: MouseEvent) => {
    const dx = e.clientX - startX.current;
    const newW = startW.current - dx;
    setWidth(Math.max(200, Math.min(600, newW)));
  }, []);

  const stopDrag = useCallback(() => {
    document.removeEventListener("mousemove", doDrag);
    document.removeEventListener("mouseup", stopDrag);
  }, [doDrag]);

  const initDrag = useCallback(
    (e: React.MouseEvent) => {
      startX.current = e.clientX;
      startW.current = containerRef.current?.offsetWidth ?? width;
      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
      e.preventDefault();
    },
    [doDrag, stopDrag, width]
  );

  // corner drag
  const doCorner = useCallback((e: MouseEvent) => {
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    setWidth(Math.max(200, Math.min(600, startW.current - dx)));
    setHeight(
      Math.max(100, Math.min(window.innerHeight - 8, startH.current - dy))
    );
  }, []);

  const stopCorner = useCallback(() => {
    document.removeEventListener("mousemove", doCorner);
    document.removeEventListener("mouseup", stopCorner);
  }, [doCorner]);

  const initCorner = useCallback(
    (e: React.MouseEvent) => {
      startX.current = e.clientX;
      startY.current = e.clientY;
      startW.current = containerRef.current?.offsetWidth ?? width;
      startH.current = containerRef.current?.offsetHeight ?? height;
      document.addEventListener("mousemove", doCorner);
      document.addEventListener("mouseup", stopCorner);
      e.preventDefault();
    },
    [doCorner, stopCorner, width, height]
  );

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("mousemove", doCorner);
      document.removeEventListener("mouseup", stopCorner);
    };
  }, [doDrag, stopDrag, doCorner, stopCorner]);

  const toggleOpen = () => {
    setIsOpen((o) => !o);
    setIsMinimized(false);
  };

  return (
    <AnimatePresence>
      {!isOpen && !isMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            className={cn(
              "rounded-full h-14 w-14 shadow-lg transition-all duration-300",
              shouldAnimate ? "animate-fade-in-up" : "",
              isPulsing ? "animate-pulse" : ""
            )}
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      )}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <motion.div
            ref={containerRef}
            style={{
              width: springW,
              height: springH,
              minWidth: 56,
              maxWidth: 600,
              minHeight: 140,
              maxHeight: window.innerHeight - 8,
            }}
            initial={false}
            exit={{ width: 56, height: 150, opacity: 0 }}
            className={cn(
              "shadow-lg rounded-lg overflow-hidden relative origin-bottom-right border backdrop-blur-sm",
              isMinimized
                ? "bg-gray-900/95 border-gray-700/50"
                : "bg-slate-900/95 border-slate-600/50",
              isOpen && !isMinimized ? "animate-slide-in" : "animate-slide-out"
            )}
          >
            {/* left drag */}
            <div
              className="absolute left-0 top-0 h-full w-2 cursor-w-resize z-10"
              onMouseDown={initDrag}
            />
            {/* top-left corner */}
            <div
              className="absolute left-0 top-0 w-4 h-4 cursor-nw-resize z-10"
              onMouseDown={initCorner}
            />

            <div className="flex flex-col h-full">
              {/* header */}
              {!isMinimized ? (
                <div className="flex items-center justify-between p-3 border-b">
                  <ScheduleBuilderAIChatHeader />
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setIsMinimized((m) => !m)}
                    >
                      {isMinimized ? (
                        <Maximize2 className="h-4 w-4" />
                      ) : (
                        <Minimize2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={toggleOpen}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between p-3">
                    <CurrentToolCall
                      currentWidth={width}
                      minimized={isMinimized}
                    />
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setIsMinimized((m) => !m)}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={toggleOpen}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <ScheduleBuilderChatInput
                    messagesContainerRef={messagesContainerRef}
                    textAreaRef={textareaRef}
                    sendButtonRef={sendButtonRef}
                  />
                </div>
              )}
              {/* body */}
              {!isMinimized && (
                <div className="flex-1">
                  <ScheduleBuilderAIChat
                    currentHeight={height}
                    sendButtonRef={sendButtonRef}
                    messagesContainerRef={messagesContainerRef}
                    textareaRef={textareaRef}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
