import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import { useAppSelector } from "@/redux";
import { useEffect, useState } from "react";

export const TotalUnits = () => {
  const { flowchartData } = useAppSelector((state) => state.flowchart);
  const isNarrowScreen = useIsNarrowScreen();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculateTotal = (): number => {
      if (!flowchartData?.termData) return 0;

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

          acc += units;
        });

        return acc;
      }, 0);
    };
    setTotal(calculateTotal());
  }, [flowchartData]);

  return (
    <>
      <span className={`font-semibold ${isNarrowScreen && "ml-2"}`}>{`Total Units: ${total.toFixed(1)}`}</span>
    </>
);
};
