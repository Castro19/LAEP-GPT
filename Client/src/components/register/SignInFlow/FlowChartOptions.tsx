import { useEffect } from "react";
import ReusableDropdown from "../../ui/reusable-dropdown";
import { flowSelectionActions, useAppDispatch, useAppSelector } from "@/redux";
import { setSelection } from "@/redux/flowSelection/flowSelectionSlice";
import { useUserData } from "@/hooks/useUserData";
import { ConcentrationInfo } from "@polylink/shared/types";

// Move configuration to a separate constant
const YEAR_OPTIONS = ["2019", "2020", "2021", "2022", "2023", "2024"];

const FlowChartOptions = ({
  type = "profile",
}: {
  type: "profile" | "flowchart" | "signup";
}) => {
  const dispatch = useAppDispatch();
  const { catalogOptions, majorOptions, concentrationOptions, selections } =
    useAppSelector((state) => state.flowSelection);

  const { handleChange, userData } = useUserData();

  useEffect(() => {
    if ((type === "profile" || type === "signup") && selections.catalog) {
      dispatch(flowSelectionActions.fetchMajorOptions(selections.catalog));
    } else if (type === "flowchart" && userData.catalog) {
      dispatch(flowSelectionActions.fetchMajorOptions(userData.catalog));
    }
  }, [selections.catalog, dispatch, userData.catalog, type]);

  useEffect(() => {
    if (
      (type === "profile" || type === "signup") &&
      selections.major &&
      selections.catalog
    ) {
      dispatch(
        flowSelectionActions.fetchConcentrationOptions({
          catalog: selections.catalog || "",
          major: selections.major || "",
        })
      );
    } else if (type === "flowchart" && userData?.catalog) {
      dispatch(
        flowSelectionActions.fetchConcentrationOptions({
          catalog: userData.catalog || "",
          major: userData.major || "",
        })
      );
    }
  }, [
    selections.major,
    selections.catalog,
    dispatch,
    userData.catalog,
    type,
    userData.major,
  ]);

  const handleChangeOption = (key: string, value: string) => {
    if (type !== "flowchart") {
      if (key === "startingYear") {
        handleChange("startingYear", value);
      } else if (key === "catalog") {
        handleChange("catalog", value);
      } else if (key === "major") {
        handleChange("major", value);
      }
    }
    dispatch(
      setSelection({
        key: key as "startingYear" | "catalog" | "major" | "concentration",
        value,
      })
    );
  };

  const handleChangeConcentration = (value: string) => {
    const concentration = concentrationOptions.find(
      (item) => item.concName === value
    );

    if (type !== "flowchart") {
      handleChange("concentration", concentration?.code || "");
    }
    dispatch(
      setSelection({
        key: "concentration",
        value:
          concentration ||
          ({
            code: "",
            concName: "",
            majorName: "",
          } as ConcentrationInfo),
      })
    );
  };

  return (
    <div className="space-y-4">
      {type !== "flowchart" && (
        <>
          <ReusableDropdown
            name="Starting Year"
            dropdownItems={YEAR_OPTIONS}
            handleChangeItem={(_, value) =>
              handleChangeOption("startingYear", value)
            }
            selectedItem={selections.startingYear || ""}
          />
          <ReusableDropdown
            name="Catalog"
            dropdownItems={catalogOptions}
            handleChangeItem={(_, value) =>
              handleChangeOption("catalog", value)
            }
            selectedItem={selections.catalog || ""}
          />
          <ReusableDropdown
            name="Major"
            dropdownItems={majorOptions}
            handleChangeItem={(_, value) => handleChangeOption("major", value)}
            selectedItem={selections.major || ""}
          />
        </>
      )}
      {type !== "profile" && (
        <ReusableDropdown
          name="Concentration"
          dropdownItems={concentrationOptions.map((item) => item.concName)}
          handleChangeItem={(_, value) => handleChangeConcentration(value)}
          selectedItem={selections.concentration?.concName || ""}
        />
      )}
    </div>
  );
};

export default FlowChartOptions;
