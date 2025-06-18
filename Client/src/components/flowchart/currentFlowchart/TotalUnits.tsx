import { useAppSelector } from "@/redux";
import { useEffect, useState } from "react";
import { UnitCounts } from "@polylink/shared/types";

export const TotalUnits = () => {
  const { flowchartData } = useAppSelector((state) => state.flowchart);
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
    <div className="flex justify-center items-center border-t pt-2 dark:border-gray-700">
      <span className="font-semibold">Total Units:</span>
      <span className="ml-2">{total.toFixed(1)}</span>
    </div>
  );
};
