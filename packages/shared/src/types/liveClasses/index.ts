export type LiveClassDocument = {
  _id: { $oid: string };
  course_id: string;
  course_name: string;
  campus: string;
  dates: TimeRange;
  units: string;
  notes: string[];
  pairs: CoursePair[];
};

type CoursePair = {
  lecture: ClassComponent | null;
  lab: ClassComponent | null;
  other: ClassComponent | null;
  combined_time: TimeRange;
  gap_minutes: { $numberInt: string };
};

type ClassComponent = {
  component: "LEC" | "LAB";
  class_nbr: { $numberInt: string };
  instructors: Instructor[];
  schedule: Schedule[];
  enrollment: Enrollment;
  waitlist: Waitlist;
  instruction_mode: string;
  grading_basis: string;
};

type Instructor = {
  instructor_id: string;
  name: string;
  email: string;
  rating: { $numberDouble: string };
};

type Schedule = {
  days: string[];
  time: TimeRange;
  facility: Facility;
};

type TimeRange = {
  start: string;
  end: string;
};

type Facility = {
  building: string;
  room: string;
};

type Enrollment = {
  status: string;
  capacity: { $numberInt: string };
  current: { $numberInt: string };
  available: { $numberInt: string };
};

type Waitlist = {
  total: { $numberInt: string };
  capacity: { $numberInt: string };
};
