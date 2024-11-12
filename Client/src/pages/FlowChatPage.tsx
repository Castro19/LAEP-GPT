import FlowChart from "@/components/flowchart/FlowChart";
import FlowChartHeader from "@/components/flowchart/flowchartHeader/FlowChartHeader";
const FlowChatPage = () => {
  return (
    <div className="flex flex-col h-screen dark:bg-gray-900">
      <FlowChartHeader />
      <div className="flex-grow overflow-auto">
        <FlowChart />
      </div>
    </div>
  );
};

export default FlowChatPage;
