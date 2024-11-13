import FlowChart from "@/components/flowchart/FlowChart";
import FlowChartHeader from "@/components/flowchart/flowchartHeader/FlowChartHeader";
import FlowChartFooter from "@/components/flowchart/flowchartFooter/FlowChartFooter";

const FlowChatPage = () => {
  return (
    <div className="flex flex-col h-screen dark:bg-gray-900">
      <FlowChartHeader />
      <div className="flex-grow overflow-auto">
        <FlowChart />
      </div>
      <FlowChartFooter />
    </div>
  );
};

export default FlowChatPage;
