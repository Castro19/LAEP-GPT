import CollapsibleContentWrapper from "../section/filterForm/reusable/CollapsibleContentWrapper";

import SectionsChosen from "./SectionsChosen";
import { FaBook } from "react-icons/fa";
const SelectedSectionContainer = () => {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold text-center mb-4">
        Build Your Schedule
      </h1>
      <div className="flex flex-col gap-4">
        <CollapsibleContentWrapper title="Selected Sections" icon={FaBook}>
          <SectionsChosen />
        </CollapsibleContentWrapper>
      </div>
    </div>
  );
};

export default SelectedSectionContainer;
