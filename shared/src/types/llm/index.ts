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

export type ScheduleBuilderFields =
  | "classNumber" // Unique section number (e.g. 1001)
  | "courseId" // Unique course identifier (e.g. "CSC357")
  | "subject" // Subject abbreviation (e.g. "CSC")
  | "catalogNumber" // Course number (e.g. "357")
  | "component" // Component of the course (e.g. "LEC" | "LAB" | "IND")
  | "courseName" // Name of the course (e.g. "Introduction to Computer Systems")
  | "description" // Description of the course (e.g. "This course introduces students to the principles of computer organization and design.")
  | "prerequisites" // Prerequisites for the course (e.g. ["CSC108", "CSC110"])
  | "units" // Units of the course (e.g. "3", "1-4", "0", "1-6")
  | "enrollmentStatus" // Enrollment status of the course (e.g. "Open" | "Closed")
  | "enrollment" // Enrollment information of the course (e.g. {waitTotal: 100, waitCap: 100, classCapacity: 100, enrollmentTotal: 100, enrollmentAvailable: 100, enrollmentStatusDescription: "Open"})
  | "instructionMode" // Instruction mode of the course (e.g. "PA" | "SM" | "P" | "PS" | "AM" | "SA")
  | "courseAttributes" // Course attributes of the course (e.g. ["GE D", "USCP"])
  | "meetings" // Meetings of the course (e.g. [{days: ["Mo", "Tu", "We", "Th", "Fr"], start_time: "10:00 AM", end_time: "11:00 AM", location: "TBA"}])
  | "instructors" // Instructors of the course (e.g. [{name: "John Doe", email: "john.doe@illinois.edu"}])
  | "instructorsWithRatings" // Instructors with ratings of the course (e.g. [{name: "John Doe", id: "1234567890", courseId: "CSC357", overallRating: 4.5, numEvals: 100, courseRating: 4.5, studentDifficulties: 3.5}])
  | "techElectives" // Tech Electives of the course (e.g. {major: "CSC", concentration: "AI"})
  | "classPair" // Class pair of the course (e.g. 1002)
  | "meetings" // Course Meetings (e.g. "MW 10:00-11:15am")
  | "instructors" // Course Instructors (e.g. ["John Doe", "Jane Smith"])
  | "instructorWithRatings"; // Course Instructors with Ratings (e.g. [{name: "John Doe", rating: 4.5}])

export type ProfessorRatingFields =
  | "overallRating" // Professor Overall Rating (e.g. 4.5)
  | "numEvals" // Number of Evaluations (e.g. 12)
  | "courseRating" // Professor Course Rating (e.g. 4.5)
  | "studentDifficulties" // Professor Student Difficulties (e.g. 3.5)
  | "tags" // Professor Tags (e.g. ["Fast Response Time", "Easy Grading"])
  | "reviews"; // Professor Reviews (e.g. ["This professor is great", "This professor is bad"])
export type ScheduleBuilderObject = {
  queryType:
    | "schedule_review"
    | "professor_insights"
    | "schedule_analysis"
    | "section_optimization";
  fetchScheduleSections: {
    required?: boolean; // Always true
    sections: ScheduleBuilderSection[]; // List of class numbers to fetch
    fields?: ScheduleBuilderFields[];
  };
  fetchProfessors: {
    required?: boolean;
    sections: ScheduleBuilderSection[];
    fields?: ProfessorRatingFields[];
  };
  fetchAlternativeSections: {
    required?: boolean;
    sections: ScheduleBuilderSection[];
    fields?: ScheduleBuilderFields[];
  };
};

export type ScheduleBuilderSection = {
  courseId: string;
  classNumber: number;
  professors: {
    id: string | null;
    name: string;
  }[];
};
