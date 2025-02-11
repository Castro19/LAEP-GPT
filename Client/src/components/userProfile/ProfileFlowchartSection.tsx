import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux";
import FlowChart from "@/components/flowchart/FlowChart";
import ProfileEmptyFlowchart from "@/components/flowchart/ProfileEmptyFlowchart";
import SpecialButton from "@/components/ui/specialButton";

export const ProfileFlowchartSection = () => {
    const { userData } = useAppSelector((state) => state.user);
    const { flowchartData } = useAppSelector((state) => state.flowchart);
    
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full gap-4 mb-2">
      {flowchartData ? (
        <>
          <FlowChart flowchartData={flowchartData} />
          <SpecialButton
            text="Modify Flowcharts"
            onClick={() => navigate(`/flowchart/${userData.flowchartInformation.flowchartId}`)}
          />
        </>
      ) : (
        <>
          <ProfileEmptyFlowchart />
          <SpecialButton text="Go to Flowchart" onClick={() => navigate("/flowchart")} />
        </>
      )}
    </div>
  );
};
