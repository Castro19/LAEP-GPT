import { Button } from "@/components/ui/button";
import { Redo, Undo } from "lucide-react";
import { useAppDispatch } from "@/redux";

const FlowchartActions = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-3 items-center">
      <Button size="icon" variant="ghost">
        Reset
      </Button>
      <Button size="icon" variant="ghost">
        <Undo className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FlowchartActions;
