import { ObjectId } from "mongodb";

export type ProfessorRatingType = {
  id: string;
  department: string;
  firstName: string;
  lastName: string;
  numEvals: number;
  overallRating: number;
  materialClear: number;
  studentDifficulties: number;
  courses: string[];
  tags: Tags;
  reviews: Reviews;
};

export type Reviews = Record<string, reviewObject[]>;

type Tags = Record<string, number>;
export type reviewObject = Record<
  string,
  {
    grade: string;
    gradeLevel: string;
    courseType: string;
    overallRating: number;
    presentsMaterialClearly: number;
    recognizesStudentDifficulties: number;
    rating: string;
    id: string;
    professor: string;
    postDate: string;
    tags: Tags;
  }
>;

export type ProfessorRatingDB = ProfessorRatingType & {
  _id: ObjectId;
};

export type ProfessRatingList = Omit<ProfessorRatingType, "department">;
