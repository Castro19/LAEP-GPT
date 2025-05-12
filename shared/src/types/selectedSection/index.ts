export type SelectedSection = {
  courseId: string;
  courseName: string;
  classNumber: number;
  component: string;
  units: string;
  professors: {
    name: string;
    id: string | null;
  }[];
  enrollmentStatus: "O" | "C" | "W";
  meetings: Array<{
    days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr">;
    start_time: string | null;
    end_time: string | null;
  }>;
  classPair: number | null;
  rating: number;
  color: string;
  // Generated on frontend
  isVisible?: boolean;
  isLocked?: boolean;
};

export type CourseTerm = "spring2025" | "summer2025" | "fall2025";

export type SelectedSectionItem = {
  sectionId: number;
  term: CourseTerm;
};

export type SelectedSectionDocument = {
  _id: {
    $oid: string;
  };
  userId: string;
  selectedSections: {
    [K in CourseTerm]: {
      [classNumber: number]: {
        color: string;
      };
    };
  };
};
