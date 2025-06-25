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

/**
 * SBFetchSections - Component for displaying fetched course sections in AI chat
 *
 * This component renders the results of section fetching operations in the AI chat
 * interface. It parses section data from tool messages and displays them using
 * the SectionsChosen component for consistent UI.
 *
 * @component
 * @param {Object} props - Component props
 * @param {FetchSectionsArgs} props.args - Arguments used for the fetch operation
 * @param {string} props.message - Tool message containing section data
 *
 * @example
 * ```tsx
 * <SBFetchSections
 *   args={{ fetch_type: "search", search_query: "CSC 101" }}
 *   message='{"type":"sections_data","potentialSections":[12345,67890]}'
 * />
 * ```
 *
 * @dependencies
 * - Redux store for schedule and schedule builder log state
 * - SectionsChosen for section display
 * - FetchSectionsMessage for argument formatting
 * - JSON parsing utilities
 *
 * @features
 * - Parses section data from tool messages
 * - Displays fetch operation arguments
 * - Shows fetched sections using SectionsChosen
 * - Automatic section fetching by class numbers
 * - Backward compatibility with old message formats
 * - Error handling for malformed JSON
 *
 * @dataParsing
 * - JSON parsing of tool messages
 * - Support for new sections_data format
 * - Fallback to regex parsing for old format
 * - Error handling for parsing failures
 * - Memoized parsing to prevent unnecessary re-renders
 *
 * @sectionFetching
 * - Automatic fetching of selected sections
 * - Class number-based section retrieval
 * - Term-aware section fetching
 * - Local state management for fetched sections
 * - Redux integration for section data
 *
 * @styling
 * - Dark theme with slate colors
 * - Proper spacing and layout
 * - Background styling for argument display
 * - Consistent with chat interface design
 *
 * @state
 * - Local state for selected sections
 * - Redux state for current term
 * - Memoized section parsing
 * - Effect-based section fetching
 *
 * @errorHandling
 * - JSON parsing error recovery
 * - Fallback to regex parsing
 * - Graceful handling of malformed data
 * - Empty state handling
 */
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
