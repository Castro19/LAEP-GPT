import { Button } from "@/components/ui/button";
import { Redo, Undo } from "lucide-react";
import useFlowchartHistory from "@/hooks/useFlowchartHistory";

const FlowchartActions = () => {
  const { undo, redo, canRedo, canUndo } = useFlowchartHistory();

  return (
    <div className="flex gap-3 items-center">
      <Button size="icon" variant="ghost" onClick={undo} disabled={!canUndo}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" onClick={redo} disabled={!canRedo}>
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FlowchartActions;
