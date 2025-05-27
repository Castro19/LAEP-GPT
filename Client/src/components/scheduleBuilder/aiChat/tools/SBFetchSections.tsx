import React, { useEffect, useMemo, useState } from "react";
// Redux:
import {
  useAppDispatch,
  useAppSelector,
  scheduleBuilderLogActions,
} from "@/redux";
// Types
import { CourseTerm, SelectedSection } from "@polylink/shared/types";
// helpers
import {
  FetchSectionsMessage,
  type FetchSectionsArgs,
} from "@/components/scheduleBuilder/aiChat/helpers/FormattingStrs";
// My components:
import SectionsChosen from "@/components/scheduleBuilder/buildSchedule/selectedSections/SectionsChosen";

interface FetchSectionsProps {
  args: FetchSectionsArgs;
  message: string;
}

const SBFetchSections: React.FC<FetchSectionsProps> = ({ args, message }) => {
  const dispatch = useAppDispatch();
  const { currentScheduleTerm } = useAppSelector((state) => state.schedule);
  const [localSelectedSections, setLocalSelectedSections] = useState<
    SelectedSection[]
  >([]);

  // Extract the sections array from the message using useMemo to prevent recreation on every render
  const sections = useMemo(() => {
    try {
      const parsedContent = JSON.parse(message);
      if (parsedContent.type === "sections_data") {
        return {
          potentialSections: parsedContent.potentialSections || [],
          suggestedSections: parsedContent.suggestedSections || [],
        };
      }
      return {
        potentialSections: [],
        suggestedSections: [],
      };
    } catch (e) {
      // Fallback to old format for backward compatibility
      const sectionsMatch = message.match(/Fetched sections: (\[.*\])/);
      return {
        potentialSections: [],
        suggestedSections: sectionsMatch ? JSON.parse(sectionsMatch[1]) : [],
      };
    }
  }, [message]);

  // Fetch selected sections when potential sections change
  useEffect(() => {
    if (sections.potentialSections.length > 0) {
      const classNumbers = sections.potentialSections;
      dispatch(
        scheduleBuilderLogActions.fetchSelectedSectionsByClassNumbers({
          term: currentScheduleTerm as CourseTerm,
          classNumbers,
        })
      ).then((result) => {
        if (result.payload) {
          setLocalSelectedSections(result.payload as SelectedSection[]);
        }
      });
    }
  }, [sections.potentialSections, currentScheduleTerm, dispatch]);

  return (
    <div className="space-y-3">
      {/* Tool Arguments */}
      <div className="bg-slate-800/50 p-2 rounded">
        <FetchSectionsMessage {...args} />
      </div>

      {/* Sections List */}
      <SectionsChosen
        selectedSections={
          localSelectedSections && localSelectedSections.length > 0
            ? localSelectedSections
            : []
        }
        inChat={true}
      />
    </div>
  );
};

export default SBFetchSections;
