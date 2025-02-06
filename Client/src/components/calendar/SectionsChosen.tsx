import {
  useAppDispatch,
  useAppSelector,
  sectionSelectionActions,
} from "@/redux";
import { SelectedSection } from "@polylink/shared/types";
import { useEffect } from "react";
import { Card } from "../ui/card";

const SectionsChosen = () => {
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(sectionSelectionActions.fetchSelectedSectionsAsync());
  }, [dispatch]);

  console.log("MAPPING FROM SELECTED SECTIONS", selectedSections);
  return (
    <div className="flex flex-col gap-4">
      {selectedSections &&
        selectedSections.map((section: SelectedSection) => (
          <Card
            className="flex flex-col border-0 shadow-lg"
            key={section.sectionId}
          >
            <div>
              <div>{section.courseId}</div>
              <div>{section.classNumber}</div>
              <div>{section.component}</div>
              <div>{section.enrollmentStatus}</div>
              <div>
                {section.meetings.map((meeting) => meeting.days.join(", "))}
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default SectionsChosen;
