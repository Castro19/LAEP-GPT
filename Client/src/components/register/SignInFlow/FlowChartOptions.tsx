import { useEffect } from "react";
import ReusableDropdown from "../../ui/reusable-dropdown";
import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import { setSelection } from "@/redux/flowchart/flowchartSlice";

// Move configuration to a separate constant
const YEAR_OPTIONS = [
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
];

const FlowChartOptions = () => {
  const dispatch = useAppDispatch();
  const { catalogOptions, majorOptions, concentrationOptions, selections } =
    useAppSelector((state) => state.flowchart);

  useEffect(() => {
    if (selections.catalog) {
      dispatch(flowchartActions.fetchMajorOptions(selections.catalog));
    }
  }, [selections.catalog, dispatch]);

  useEffect(() => {
    if (selections.major) {
      dispatch(
        flowchartActions.fetchConcentrationOptions({
          catalog: selections.catalog,
          major: selections.major,
        })
      );
    }
  }, [selections.major, selections.catalog, dispatch]);

  const handleChange = (key: string, value: string) => {
    dispatch(setSelection({ key, value }));
  };

  return (
    <div className="space-y-4">
      <ReusableDropdown
        name="Starting Year"
        dropdownItems={YEAR_OPTIONS}
        handleChangeItem={(_, value) => handleChange("startingYear", value)}
        selectedItem={selections.startingYear || ""}
        dropdownRef={null}
      />
      <ReusableDropdown
        name="Catalog"
        dropdownItems={catalogOptions}
        handleChangeItem={(_, value) => handleChange("catalog", value)}
        selectedItem={selections.catalog || ""}
        dropdownRef={null}
      />
      <ReusableDropdown
        name="Major"
        dropdownItems={majorOptions}
        handleChangeItem={(_, value) => handleChange("major", value)}
        selectedItem={selections.major || ""}
        dropdownRef={null}
      />
      <ReusableDropdown
        name="Concentration"
        dropdownItems={concentrationOptions}
        handleChangeItem={(_, value) => handleChange("concentration", value)}
        selectedItem={selections.concentration || ""}
        dropdownRef={null}
      />
    </div>
  );
};

export default FlowChartOptions;
