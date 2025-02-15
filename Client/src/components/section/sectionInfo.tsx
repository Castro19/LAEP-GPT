import { Meeting, SectionDetail } from "@polylink/shared/types";
import {
  useAppDispatch,
  useAppSelector,
  sectionSelectionActions,
} from "@/redux";
import { useState } from "react";
import BadgeSection from "./helpers/BadgeSection";
import LabelSection from "./helpers/LabelSection";
import { convertTo12HourFormat } from "./helpers/timeFormatter";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { transformToSectionDetail } from "@/helpers/transformSection";
import { environment } from "@/helpers/getEnvironmentVars";
import { toast } from "../ui/use-toast";

// -----------------------------------------------------------------------------
// SectionHeader: Renders a badge for the component type, meeting days, and enrollment status.
// -----------------------------------------------------------------------------
type SectionHeaderProps = {
  section: SectionDetail;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({ section }) => {
  const dispatch = useAppDispatch();
  const [displayAddPairModal, setDisplayAddPairModal] = useState(false);
  const { sections } = useAppSelector((state) => state.section);

  const handleAddPair = async (section: SectionDetail) => {
    handleAdd(section);
    // Get the paired section from its class number
    const pairedSection = sections.find(
      (s) => s.classNumber === section.pairedSections[0]
    );
    // Convert to sectionDetail
    if (pairedSection) {
      const pairedSectionDetail = transformToSectionDetail(pairedSection);
      handleAdd(pairedSectionDetail);
    }
  };

  // Handler for the Add button
  const handleAdd = async (section: SectionDetail) => {
    // Implement your add functionality here
    if (environment === "dev") {
      console.log("Add button clicked for meeting:", section);
    }
    const { payload } = await dispatch(
      sectionSelectionActions.createOrUpdateSelectedSectionAsync(section)
    );
    const { message } = payload as { message: string };
    if (
      message ===
      `Try adding a different section for course ${section.courseId}`
    ) {
      toast({
        title: `Section ${section.classNumber} Already Exists in schedule`,
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: `${section.courseId} Added`,
        description: message,
      });
    }
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <BadgeSection variant="default" className="text-xs">
          {section.classNumber}
        </BadgeSection>
        <BadgeSection variant="secondary" className="text-xs">
          {section.component}
        </BadgeSection>
        <BadgeSection
          variant={section.enrollmentStatus === "O" ? "default" : "destructive"}
          className="text-xs"
        >
          {section.enrollmentStatus === "O" ? "Open" : "Closed"}
        </BadgeSection>
      </div>
      {section.pairedSections && section.pairedSections.length > 0 ? (
        <Popover
          open={displayAddPairModal}
          onOpenChange={setDisplayAddPairModal}
        >
          <PopoverTrigger asChild className="flex justify-end">
            <Button
              variant="secondary"
              className="text-xs "
              onClick={() => setDisplayAddPairModal(true)}
            >
              Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="grid gap-2">
              {/* Display the class Pair & disclaimer that it is recommend to pair sections. Give option of adding class pair or just adding this single section. */}
              <div className="flex flex-row gap-2">
                <Button
                  variant="secondary"
                  className="text-xs py-0"
                  onClick={() => handleAddPair(section)}
                >
                  Add Class Pair
                </Button>
                <Button
                  variant="secondary"
                  className="text-xs py-0"
                  onClick={() => handleAdd(section)}
                >
                  Add Single Section
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Button
          variant="secondary"
          className="text-xs py-0"
          onClick={() => handleAdd(section)}
        >
          Add
        </Button>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// SectionEnrollment: Renders enrollment status and enrollment info.
// -----------------------------------------------------------------------------
type SectionEnrollmentProps = {
  section: SectionDetail;
};

/**
 * Instruction modes:
 * - PA (Synchronous)
 * - SM (Sync/Async Hybrid)
 * - P (In Person/Async Hybrid)
 * - PS (In Person)
 * - AM (In Person/Sync Hybrid)
 * - SA (Asynchronous)
 */

export const SectionEnrollment: React.FC<SectionEnrollmentProps> = ({
  section,
}) => {
  const modes = section.instructionMode.split(";");

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="flex flex-row gap-2 items-center align-items-center">
        <LabelSection>Instruction Mode</LabelSection>
        <span>
          <div className="flex flex-row gap-2">
            {modes.map((mode, index) => (
              <BadgeSection key={index} variant="content">
                {mode}
              </BadgeSection>
            ))}
          </div>
        </span>
      </div>
      <div className="flex flex-row gap-6">
        <div className="flex flex-row gap-2 items-center align-items-center">
          <LabelSection>Seats Available</LabelSection>
          <span>
            <BadgeSection variant="content">
              {section.enrollment.enrollmentAvailable} /{" "}
              {section.enrollment.enrollmentTotal}
            </BadgeSection>
          </span>
        </div>

        {/* Waitlist Information */}
        <div className="flex flex-row gap-2 items-center align-items-center">
          <LabelSection>Waitlist</LabelSection>
          <span>
            <BadgeSection variant="content">
              {section.enrollment.waitTotal} / {section.enrollment.waitCap}
            </BadgeSection>
          </span>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// SectionSchedule: Renders meeting times and locations.
// -----------------------------------------------------------------------------
type SectionScheduleProps = {
  meetings: Meeting[];
  hideLocation?: boolean;
};

export const SectionSchedule: React.FC<SectionScheduleProps> = ({
  meetings,
  hideLocation = false,
}) => {
  const getDayName = (dayCode: string): string => {
    switch (dayCode) {
      case "Mo":
        return "Mon";
      case "Tu":
        return "Tue";
      case "We":
        return "Wed";
      case "Th":
        return "Thu";
      case "Fr":
        return "Fri";
      default:
        return "N/A";
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-3">
      {meetings.map((meeting, index) => (
        <div key={index} className="flex flex-col gap-3">
          {!hideLocation && (
            <div className="flex flex-row gap-2 items-center">
              <LabelSection>Location</LabelSection>
              <span className="text-sm text-gray-800 dark:text-gray-300">
                {meeting.location || "N/A"}
              </span>
            </div>
          )}
          <div className="flex flex-row gap-2 items-center">
            <LabelSection>Days</LabelSection>
            <div className="flex flex-row gap-2">
              {meeting.days.length > 0 ? (
                meeting.days.map((day: string) => (
                  <BadgeSection key={day} variant="content">
                    {getDayName(day)}
                  </BadgeSection>
                ))
              ) : (
                <BadgeSection variant="content">N/A</BadgeSection>
              )}
            </div>
          </div>
          {/* Stack on top of each other if hideLocation is true */}
          <div
            className={`flex flex-row gap-4  ${
              hideLocation ? "flex-col justify-start" : "items-center"
            }`}
          >
            <div className="flex flex-row gap-2 items-center">
              <LabelSection>Start Time</LabelSection>
              <BadgeSection variant="content">
                {meeting.start_time
                  ? convertTo12HourFormat(meeting.start_time)
                  : "N/A"}
              </BadgeSection>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <LabelSection>End Time</LabelSection>
              <BadgeSection variant="content">
                {meeting.end_time
                  ? convertTo12HourFormat(meeting.end_time)
                  : "N/A"}
              </BadgeSection>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
