/**
 * @component FlowchartInfo
 * @description Displays current flowchart information including catalog, major, concentration,
 * and link to official flowchart. Shows empty state when no flowchart is selected.
 *
 * @props
 * None - Component reads from Redux state
 *
 * @dependencies
 * - Redux: flowchart state for current flowchart
 * - Card: UI container for information display
 * - Button: External link button
 * - Framer Motion: Entrance animations
 * - Lucide Icons: ExternalLink icon
 *
 * @features
 * - Current flowchart information display
 * - Catalog, major, and concentration info
 * - External link to official flowchart
 * - Empty state handling
 * - Smooth entrance animations
 * - Hover effects and transitions
 * - Responsive design
 *
 * @example
 * ```tsx
 * <FlowchartInfo />
 * ```
 */

import { useAppSelector } from "@/redux";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const FlowchartInfo = () => {
  const { currentFlowchart } = useAppSelector((state) => state.flowchart);

  if (!currentFlowchart) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-2"
      >
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          No flowchart selected
        </p>
      </motion.div>
    );
  }

  const { flowInfo } = currentFlowchart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-2 w-full"
    >
      <Card className="w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-3 flex flex-col gap-2">
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="flex flex-col gap-0.5 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Catalog
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {flowInfo?.catalog}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Major
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {flowInfo?.majorName}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Concentration
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {flowInfo?.concName}
              </span>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="p-2 pt-0">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full group transition-all duration-300 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-800 text-xs py-1 h-8"
              onClick={() => window.open(flowInfo?.dataLink, "_blank")}
            >
              <ExternalLink className="mr-1 h-3 w-3 transition-transform group-hover:scale-110" />
              <span>View Official Flowchart</span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FlowchartInfo;
