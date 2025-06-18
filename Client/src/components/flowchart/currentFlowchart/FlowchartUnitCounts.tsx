import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux";
import { UnitCounts } from "@polylink/shared/types";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const FlowchartUnitCounts = () => {
  const isNarrowScreen = useIsNarrowScreen();

  const { flowchartData } = useAppSelector((state) => state.flowchart);
  const [units, setUnits] = useState<UnitCounts>({
    total: 0,
    major: 0,
    support: 0,
    ge: 0,
    other: 0,
  });

  useEffect(() => {
    const calculateTotalUnits = (): UnitCounts => {
      const initialCounts: UnitCounts = {
        total: 0,
        major: 0,
        support: 0,
        ge: 0,
        other: 0,
      };

      if (!flowchartData?.termData) return initialCounts;

      return flowchartData.termData.reduce((acc, term) => {
        term.courses.forEach((course) => {
          const unitValue = course.customUnits || course.units;
          if (!unitValue) return;

          let units: number;
          if (unitValue.includes("-")) {
            const [min, max] = unitValue.split("-").map(Number);
            units = (min + max) / 2;
          } else {
            units = parseFloat(unitValue);
            if (isNaN(units)) return;
          }

          // Add to total
          acc.total += units;

          // Add to specific category based on color
          switch (course.color) {
            case "#FEFD9A":
              acc.major += units;
              break;
            case "#FCD09E":
              acc.support += units;
              break;
            case "#DCFDD2":
              acc.ge += units;
              break;
            case "#F5F5DC":
              acc.other += units;
              break;
          }
        });

        return acc || 0;
      }, initialCounts);
    };
    setUnits(calculateTotalUnits());
  }, [flowchartData]);

  return (
    <div
      className="dark:bg-gray-900 sticky bottom-0"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="space-y-4 ml-4 mr-4 text-lg">
        <div className={`${isNarrowScreen ? "flex-col space-y-2" : "flex justify-between items-center px-4"}`}>
          <div className={`flex ${isNarrowScreen ? "flex-col space-y-2" : "items-center mt-4 gap-4"}`}>
            {/* Major Units */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#FEFD9A]"></div>
              {!isNarrowScreen && <span>Major:</span>}
              <span>{units.major.toFixed(1)}</span>
            </div>
            {/* Support Units */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#FCD09E]"></div>
              {!isNarrowScreen && <span>Support:</span>}
              <span>{units.support.toFixed(1)}</span>
            </div>
            {/* GE Units */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#DCFDD2]"></div>
              {!isNarrowScreen && <span>GE:</span>}
              <span>{units.ge.toFixed(1)}</span>
            </div>
            {/* Other Units */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#F5F5DC]"></div>
              {!isNarrowScreen && <span>Other:</span>}
              <span>{units.other.toFixed(1)}</span>
            </div>
          </div>
        </div>
        {/* Total Units */}
        <div className="flex justify-start items-center border-t ml-4 pt-2 dark:border-gray-700">
          <span className="font-semibold">Total Units:</span>
          <span className="ml-2">{units.total.toFixed(1)}</span>
        </div>
      </div>
      {/* Disclaimer */}
      <div className="flex justify-center text-sm text-gray-500 p-2">
        Consult an advisor for accurate academic progress.
      </div>
    </div>
  );
};

export default FlowchartUnitCounts;
