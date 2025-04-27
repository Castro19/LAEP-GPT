import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { MdEdit } from "react-icons/md";

interface ModalContextType {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export function Modal({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTriggerButton = ({
  text,
}: {
  className?: string;
  text: string;
}) => {
  const { setOpen } = useModal();
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-indigo-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 dark:hover:bg-indigo-700"
      >
        <div className="flex items-center justify-center gap-2">
          {text}
          <MdEdit />
        </div>
      </button>
    </>
  );
};

export const CustomModalTriggerButton = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: ReactNode;
    color?: string;
    onClick?: () => void;
  }
>(({ className, children, color, onClick }, ref) => {
  const { setOpen } = useModal();
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const HOLD_DURATION = 500; // 500ms hold duration

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    // Start a timer when touch begins
    const timer = setTimeout(() => {
      setOpen(true);
      onClick?.();
    }, HOLD_DURATION);
    setHoldTimer(timer);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    // Clear the timer if touch ends before the hold duration
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    e.stopPropagation();
    // Clear the timer if touch is cancelled
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ backgroundColor: color }}
      onClick={() => {
        setOpen(true);
        onClick?.();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {children}
    </div>
  );
});

CustomModalTriggerButton.displayName = "CustomModalTriggerButton";

export const ModalBody = ({
  children,
  className,
  excludeRefs = [],
  disableOutsideClick = false,
}: {
  children: ReactNode;
  className?: string;
  excludeRefs?: React.RefObject<HTMLElement>[];
  disableOutsideClick?: boolean;
}) => {
  const { open } = useModal();

  const modalRef = useRef(null);
  const { setOpen } = useModal();

  useOutsideClick(modalRef, () => {
    if (!disableOutsideClick) {
      setOpen(false);
    }
  }, [modalRef, ...excludeRefs]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(10px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50"
        >
          <Overlay />

          <motion.div
            ref={modalRef}
            className={cn(
              "min-h-[50%] max-h-[90%] md:max-w-[60%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-hidden",
              className
            )}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateX: 40,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: 10,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
            }}
          >
            <CloseIcon />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col flex-1 p-8 md:p-10 overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const ModalSaveButton = ({ onSave }: { onSave: () => void }) => {
  const { setOpen } = useModal();

  return (
    <Button
      onClick={() => {
        onSave();
        setOpen(false);
      }}
    >
      Save
    </Button>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex justify-end p-4 bg-gray-100 dark:bg-neutral-900",
        className
      )}
    >
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        backdropFilter: "blur(10px)",
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 ${className}`}
    ></motion.div>
  );
};

const CloseIcon = () => {
  const { setOpen } = useModal();
  return (
    <button
      onClick={() => setOpen(false)}
      className="absolute top-4 right-4 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};

export const CustomModalBody = ({
  children,
  className,
  excludeRefs = [],
  disableOutsideClick = false,
}: {
  children: ReactNode;
  className?: string;
  excludeRefs?: React.RefObject<HTMLElement>[];
  disableOutsideClick?: boolean;
}) => {
  const { open, setOpen } = useModal();
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, () => {
    if (!disableOutsideClick) {
      setOpen(false);
    }
  }, [modalRef, ...excludeRefs]);

  // Get the dedicated modal root inside the WeeklySchedule container
  const modalRoot = document.getElementById("calendar-modal-root");

  if (!open || !modalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-start justify-center absolute inset-0 z-[999] backdrop-blur-md pt-24" // z-index high enough and adds blur effect
        >
          {/* Custom overlay: darker semi-transparent instead of black */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/70" // darker semi-transparent overlay
          />

          <motion.div
            ref={modalRef}
            className={cn(
              "min-h-[50%] max-h-[90%] md:max-w-[60%] bg-slate-900 dark:bg-neutral-950 border dark:border-neutral-800 md:rounded-2xl relative z-[1000] flex flex-col overflow-hidden",
              className
            )}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateX: 40,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: 10,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
            }}
          >
            <CloseIcon />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

export const NarrowScreenModal = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    excludeRefs?: React.RefObject<HTMLElement>[];
    disableOutsideClick?: boolean;
  }
>(
  (
    { children, className, excludeRefs = [], disableOutsideClick = false },
    ref
  ) => {
    const { open, setOpen } = useModal();

    // Create a ref for the modal content
    const modalContentRef = useRef<HTMLDivElement>(null);

    // Use the provided ref or the local one
    const modalRef = ref || modalContentRef;

    useOutsideClick(
      modalRef as React.RefObject<HTMLDivElement>,
      () => {
        if (!disableOutsideClick) {
          setOpen(false);
        }
      },
      [modalRef as React.RefObject<HTMLDivElement>, ...excludeRefs]
    );

    // Get the dedicated modal root
    const modalRoot = document.getElementById("calendar-modal-root");

    // If not open, don't render anything
    if (!open) return null;

    // If no modal root, create a fallback portal to body
    const portalTarget = modalRoot || document.body;

    return createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              backdropFilter: "blur(10px)",
            }}
            exit={{
              opacity: 0,
              backdropFilter: "blur(0px)",
            }}
            className="fixed inset-0 h-full w-full flex items-center justify-center z-[9999]"
          >
            <Overlay />

            <motion.div
              ref={modalRef}
              className={cn(
                "h-full w-full bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 relative z-[10000] flex flex-col overflow-hidden",
                className
              )}
              initial={{
                opacity: 0,
                y: 100,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 100,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 15,
              }}
            >
              <CloseIcon />
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      portalTarget
    );
  }
);

NarrowScreenModal.displayName = "NarrowScreenModal";
