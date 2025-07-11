/**
 * @component FlowChartOptions
 * @description Selection interface for flowchart creation options. Provides dropdowns for
 * starting year, catalog, major, and concentration with dynamic loading.
 *
 * @props
 * @prop {'flowchart' | 'signup'} type - Component type for different contexts
 *
 * @dependencies
 * - Redux: flowSelectionActions, user state
 * - useUserData: User data management
 * - ReusableDropdown: Dropdown UI components
 * - Framer Motion: Entrance animations
 * - React Icons: RiBookLine, RiCalendarLine, RiGraduationCapLine, RiStackLine
 *
 * @features
 * - Starting year selection (2019-2024)
 * - Catalog dropdown with dynamic loading
 * - Major dropdown based on catalog
 * - Concentration dropdown based on major
 * - Automatic concentration reset on major change
 * - User data integration for signup flow
 * - Hover animations and responsive design
 * - Icon-based labels for each option
 *
 * @example
 * ```tsx
 * <FlowChartOptions type="flowchart" />
 * <FlowChartOptions type="signup" />
 * ```
 */

import { useEffect } from "react";
import { flowSelectionActions, useAppDispatch, useAppSelector } from "@/redux";
import { useUserData } from "@/hooks/useUserData";
import { ConcentrationInfo } from "@polylink/shared/types";
import { motion } from "framer-motion";
import ReusableDropdown from "@/components/ui/reusable-dropdown";
import {
  RiBookLine,
  RiCalendarLine,
  RiGraduationCapLine,
  RiStackLine,
} from "react-icons/ri";
import { Label } from "@/components/ui/label";

const YEAR_OPTIONS = ["2019", "2020", "2021", "2022", "2023", "2024"];

const FlowchartOptions = ({
  type = "flowchart",
}: {
  type: "flowchart" | "signup";
}) => {
  const dispatch = useAppDispatch();
  const { selections, catalogOptions, majorOptions, concentrationOptions } =
    useAppSelector((state) => state.flowSelection);
  const { userData } = useAppSelector((state) => state.user);

  const { handleChangeFlowchartInformation } = useUserData();

  useEffect(() => {
    if (type === "signup" && selections.catalog) {
      dispatch(flowSelectionActions.fetchMajorOptions(selections.catalog));
    }
  }, [selections.catalog, dispatch, type]);

  useEffect(() => {
    if (selections.major && selections.catalog) {
      dispatch(
        flowSelectionActions.fetchConcentrationOptions({
          catalog: selections.catalog,
          major: selections.major,
        })
      );
    } else {
      dispatch(flowSelectionActions.resetConcentrationOptions());
    }
  }, [selections.major, selections.catalog, dispatch]);

  const handleChangeOption = (key: string, value: string) => {
    if (type === "signup") {
      if (key === "startingYear") {
        handleChangeFlowchartInformation("startingYear", value);
      } else if (key === "catalog") {
        handleChangeFlowchartInformation("catalog", value);
      } else if (key === "major") {
        handleChangeFlowchartInformation("major", value);
      }
    }
    // Reset concentration if major is changed
    if (key === "major" && selections.concentration) {
      dispatch(
        flowSelectionActions.setSelection({ key: "concentration", value: "" })
      ); // Reset concentration
    }

    dispatch(
      flowSelectionActions.setSelection({
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
      handleChangeFlowchartInformation(
        "concentration",
        concentration?.code || ""
      );
    }
    dispatch(
      flowSelectionActions.setSelection({
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl"
    >
      {/* Dropdowns in a Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Starting Year Selection */}

        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <RiCalendarLine className="w-5 h-5 text-blue-500" />
            <Label className="text-lg font-medium">Starting Year</Label>
          </div>
          <ReusableDropdown
            name="startingYear"
            dropdownItems={YEAR_OPTIONS}
            handleChangeItem={(_, value) =>
              handleChangeOption("startingYear", value)
            }
            selectedItem={
              selections.startingYear ||
              userData.flowchartInformation.startingYear ||
              ""
            }
            className="w-full border rounded-lg hover:border-blue-300 transition-colors"
          />
        </div>

        {/* Catalog Dropdown */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 mb-2">
            <RiBookLine className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-white">Catalog</h3>
          </div>
          <motion.div whileHover={{ scale: 1.01 }}>
            <ReusableDropdown
              name="Catalog"
              dropdownItems={catalogOptions}
              handleChangeItem={(_, value) =>
                handleChangeOption("catalog", value)
              }
              selectedItem={selections.catalog || ""}
              className="w-full border rounded-lg hover:border-blue-300 transition-colors"
            />
          </motion.div>
        </div>

        {/* Major Dropdown */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 mb-2">
            <RiGraduationCapLine className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-white">Major</h3>
          </div>
          <motion.div whileHover={{ scale: 1.01 }}>
            <ReusableDropdown
              name="Major"
              dropdownItems={majorOptions}
              handleChangeItem={(_, value) =>
                handleChangeOption("major", value)
              }
              selectedItem={selections.major || ""}
              className="w-full border rounded-lg hover:border-blue-300 transition-colors"
            />
          </motion.div>
        </div>

        {/* Concentration Dropdown */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 mb-2">
            <RiStackLine className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-white">Concentration</h3>
          </div>
          <motion.div whileHover={{ scale: 1.01 }}>
            <ReusableDropdown
              name="Concentration"
              dropdownItems={concentrationOptions.map((item) => item.concName)}
              handleChangeItem={(_, value) => handleChangeConcentration(value)}
              selectedItem={selections.concentration?.concName || ""}
              className="w-full border rounded-lg hover:border-blue-300 transition-colors"
            />
          </motion.div>
        </div>
      </div>

      {/* Info Note */}
      <p className="text-sm text-gray-400 text-center mt-4">
        These details will be used to generate your personalized flowchart
      </p>
    </motion.div>
  );
};

export default FlowchartOptions;
