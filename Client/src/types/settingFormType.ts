export type CheckBoxItem = {
  id: string;
  label: string;
};
// interests: z.array(z.string()),
export type CheckBoxType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  boxTitle: string;
  boxDesc: string;
  items: CheckBoxItem[];
};
