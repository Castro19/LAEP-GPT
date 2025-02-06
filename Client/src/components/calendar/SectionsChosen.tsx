import {
  useAppDispatch,
  useAppSelector,
  sectionSelectionActions,
} from "@/redux";
import { useEffect } from "react";

const SectionsChosen = () => {
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(sectionSelectionActions.fetchSelectedSectionsAsync());
  }, [dispatch]);

  console.log("MAPPING FROM SELECTED SECTIONS", selectedSections);
  return <div className="flex flex-col gap-4"></div>;
};

export default SectionsChosen;
