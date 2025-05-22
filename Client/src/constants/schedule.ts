import { CourseTerm } from "@polylink/shared/types";

const termMap = {
  spring2025: "Spring 2025",
  summer2025: "Summer 2025",
  fall2025: "Fall 2025",
};

export const getTermName = (term: CourseTerm) => {
  return termMap[term];
};
