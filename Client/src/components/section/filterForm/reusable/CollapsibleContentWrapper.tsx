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
};

const CollapsibleContentWrapper = ({
  children,
  title,
  icon: Icon,
}: CollapsibleContentWrapperProps) => {
  const [open, setOpen] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Collapsible open={open} onOpenChange={setOpen} defaultOpen={true}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between items-center p-2 dark:bg-transparent dark:text-white rounded-lg shadow-lg dark:bg-slate-950"
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
