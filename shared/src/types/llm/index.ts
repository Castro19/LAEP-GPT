export type RespondRequestBody = {
  message: string;
  chatId?: string;
  userId?: string;
  userMessageId: string;
  currentModel: string;
};

export type CancelRequestBody = {
  userMessageId: string;
};

export type TitleRequestBody = {
  message: string;
};

export type RunningStreamData = Record<
  string,
  {
    canceled: boolean;
    runId: string | null;
    threadId: string | null;
  }
>;

export type ScheduleBuilderObject = {
  queryType: "schedule" | "both";
  fetchSections: {
    required: boolean; // Always true
    classNumbers: number[]; // List of class numbers to fetch
    fields: (
      | "courseId" // Course ID (e.g. "CSC357")
      | "courseName" // Course Name (e.g. "Software Engineering")
      | "description" // Course Description (e.g. "This course is about software engineering")
      | "units" // Course Units (e.g. "3")
      | "enrollmentStatus" // Course Enrollment Status (e.g. "Open")
      | "courseAttributes" // Course Attributes (e.g. ["GE A", "GE B"])
      | "meetings" // Course Meetings (e.g. "MW 10:00-11:15am")
      | "instructors" // Course Instructors (e.g. ["John Doe", "Jane Smith"])
      | "instructorWithRatings" // Course Instructors with Ratings (e.g. [{name: "John Doe", rating: 4.5}])
    )[];
  };
  fetchProfessors: {
    required: boolean;
    sectionInfo: ScheduleBuilderSection[];
    fields: (
      | "overallRating" // Professor Overall Rating (e.g. 3.5)
      | "materialClear" // Professor Material Clear (e.g. 3.5)
      | "numEvals" // Number of Evaluations (e.g. 12)
      | "tags" // Professor Tags (e.g. ["Fast Response Time", "Easy Grading"])
      | "reviews" // Professor Reviews (e.g. ["This professor is great", "This professor is bad"])
    )[];
  };
};

export type ScheduleBuilderSection = {
  courseId: string;
  classNumber: number;
  professor: {
    id: string;
    name: string;
  }[];
};
