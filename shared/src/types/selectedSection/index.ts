export type SelectedSection = {
  courseId: string;
  courseName: string;
  classNumber: number;
  component: string;
  professors: {
    name: string;
    id: string | null;
  }[];
  enrollmentStatus: "O" | "C";
  meetings: Array<{
    days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr">;
    start_time: string | null;
    end_time: string | null;
  }>;
  classPair: number[];
  rating: number;
};

export type SelectedSectionDocument = SelectedSection & {
  _id: {
    $oid: string;
  };
  userId: string;
  selectedSections: SelectedSection[];
};
