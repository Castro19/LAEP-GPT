import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

type CollapsibleContentWrapperProps = {
  children: React.ReactNode;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultOpen?: boolean;
  triggerRef?: React.RefObject<HTMLButtonElement>;
  // eslint-disable-next-line no-unused-vars
  onOpenChange?: (open: boolean) => void;
};

const CollapsibleContentWrapper = ({
  children,
  title,
  icon: Icon,
  defaultOpen = true,
  triggerRef,
  onOpenChange,
}: CollapsibleContentWrapperProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Collapsible
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          onOpenChange?.(open);
        }}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between items-center p-2 dark:bg-transparent dark:text-white rounded-lg shadow-lg dark:bg-slate-950"
            ref={triggerRef}
          >
            <div className="flex items-center space-x-2">
              <Icon className="w-5 h-5" />
              <span className="font-semibold text-lg">{title}</span>
            </div>
            <IoIosArrowDown
              className={`w-4 h-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="p-4 border-gray-200 dark:border-r-gray-800  shadow-inner flex flex-col gap-5">
            {children}
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default CollapsibleContentWrapper;
