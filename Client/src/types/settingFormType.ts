export type CheckBoxItem = {
  id: string;
  label: string;
};
// interests: z.array(z.string()),
export type CheckBoxType = {
  form: any;
  boxTitle: string;
  boxDesc: string;
  items: CheckBoxItem[];
};
