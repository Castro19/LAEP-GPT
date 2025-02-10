import { SelectedSection } from "../selectedSection";

export type Calendar = {
  id: number;
  name: string;
  sections: SelectedSection[];
  createdAt: Date;
  updatedAt: Date;
};
