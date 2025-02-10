import { SectionDetail } from "../section";

export type Calendar = {
  id: number;
  name: string;
  sections: SectionDetail[];
  createdAt: Date;
  updatedAt: Date;
};
