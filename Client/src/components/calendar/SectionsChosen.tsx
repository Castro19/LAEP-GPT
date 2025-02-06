import {
  useAppDispatch,
  useAppSelector,
  sectionSelectionActions,
} from "@/redux";
import { SelectedSection } from "@polylink/shared/types";
import { useEffect } from "react";

const SectionsChosen = () => {
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(sectionSelectionActions.fetchSelectedSectionsAsync());
  }, [dispatch]);

  return (
    <div>
      {selectedSections &&
        selectedSections.map((section: SelectedSection) => (
          <div key={section.sectionId}>
            <div>{section.classNumber}</div>
            <div>{section.component}</div>
            <div>{section.enrollmentStatus}</div>
            <div>
              {section.meetings.map((meeting) => meeting.days.join(", "))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default SectionsChosen;
