import { Meeting, SectionDetail } from "@polylink/shared/types";
import {
  useAppDispatch,
  useAppSelector,
  sectionSelectionActions,
} from "@/redux";
import BadgeSection from "@/components/classSearch/reusable/sectionInfo/BadgeSection";
import LabelSection from "@/components/classSearch/reusable/sectionInfo/LabelSection";
import { convertTo12HourFormat } from "@/components/classSearch/helpers/timeFormatter";
import { Button } from "@/components/ui/button";
import { transformToSectionDetail } from "@/helpers/transformSection";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";

// -----------------------------------------------------------------------------
// SectionHeader: Renders a badge for the component type, meeting days, and enrollment status.
// -----------------------------------------------------------------------------
type SectionHeaderProps = {
  section: SectionDetail;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({ section }) => {
  // Handler for the Add button
  return (
    <div className="flex items-center justify-between">
      {/* Left Side - Component Type (Lab/Lec) + Enrollment Status */}
      <div className="flex items-center gap-2">
        <BadgeSection variant="outlined">{section.component}</BadgeSection>
        <BadgeSection
          variant={
            section.enrollmentStatus === "O"
              ? "open"
              : section.enrollmentStatus === "W"
                ? "waitlist"
                : "closed"
          }
        >
          {section.enrollmentStatus === "O"
            ? "Open"
            : section.enrollmentStatus === "W"
              ? "Waitlist"
              : "Closed"}
        </BadgeSection>
      </div>

      {/* Right Side - Section Number */}
      <div>
        <BadgeSection variant="classNumber">{section.classNumber}</BadgeSection>
      </div>
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
              {section.enrollment.enrollmentTotal +
                section.enrollment.enrollmentAvailable}
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
  section?: SectionDetail; // New prop to access section info
};

export const SectionSchedule: React.FC<SectionScheduleProps> = ({
  meetings,
  hideLocation = false,
  section,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.classSearch);

  // Function to handle adding a section
  const handleAdd = async (section: SectionDetail) => {
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
        action: (
          <ToastAction
            altText="schedule builder"
            onClick={() => navigate("/schedule-builder")}
          >
            Go to Schedule Builder
          </ToastAction>
        ),
      });
    }
  };

  // Function to handle adding a class pair
  const handleAddPair = async (section: SectionDetail) => {
    handleAdd(section);
    // Get the paired section
    const pairedSection = sections.find(
      (s) => s.classNumber === section.pairedSections[0]
    );
    if (pairedSection) {
      const pairedSectionDetail = transformToSectionDetail(pairedSection);
      handleAdd(pairedSectionDetail);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-3 w-full">
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
                    {day}
                  </BadgeSection>
                ))
              ) : (
                <BadgeSection variant="content">N/A</BadgeSection>
              )}
            </div>
          </div>

          {/* Start Time & End Time */}
          <div
            className={`flex flex-row gap-4 ${hideLocation ? "flex-col justify-start" : "items-center"}`}
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

      {/* Add Section Button (Placed at the Bottom Right) */}
      <div className="flex justify-end mt-4">
        {section &&
          (section.pairedSections && section.pairedSections.length > 0 ? (
            <div className="flex flex-row gap-2">
              <Button
                className="bg-white text-slate-900 hover:bg-gray-300 text-xs dark:bg-gray-100 dark:bg-opacity-90 dark:hover:bg-gray-300 dark:hover:bg-opacity-90"
                onClick={() => handleAddPair(section)}
              >
                Add Class Pair
              </Button>
              <Button
                className="inline-flex items-center justify-center rounded-md text-xs font-medium 
    transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 
    disabled:opacity-50 bg-white text-slate-900 hover:bg-gray-100 
    h-10 px-4 py-2 w-full shadow-lg dark:bg-slate-500/50 dark:hover:bg-slate-700/70 hover:bg-slate-100/80 dark:text-slate-50"
                onClick={() => handleAdd(section)}
              >
                Add Single Section
              </Button>
            </div>
          ) : (
            <Button
              className="bg-white text-slate-900 hover:bg-gray-300 text-xs dark:bg-gray-100 dark:bg-opacity-90 dark:hover:bg-gray-300 dark:hover:bg-opacity-90"
              onClick={() => handleAdd(section)}
            >
              Add Single Section
            </Button>
          ))}
      </div>
    </div>
  );
};
