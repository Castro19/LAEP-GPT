import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux";
import { FlowchartData } from "@/types";

const FlowChartFooter = () => {
  const { flowchartData } = useAppSelector((state) => state.flowchart) as {
    flowchartData: FlowchartData | null;
  };

  const handleSave = () => {
    console.log("Save");
  };
  return (
    <footer className="flex justify-end p-4">
      <Button onClick={handleSave}>Save</Button>
    </footer>
  );
};

export default FlowChartFooter;
