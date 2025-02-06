export type SelectedSection = {
  courseId: string;
  classNumber: number;
  component: string;
  enrollmentStatus: "O" | "C";
  meetings: Array<{
    days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su">;
    start_time: string | null;
    end_time: string | null;
  }>;
  classPair: number[];
};

export type SelectedSectionDocument = SelectedSection & {
  _id: {
    $oid: string;
  };
  userId: string;
  selectedSections: SelectedSection[];
};
