export type TeamDocument = {
  _id: string;
  name: string;
  role: string;
  desc: string;
  funFact: string;
  image: string;
  type:
    | "Contributor"
    | "Previous Contributor"
    | "Founder"
    | "Product / Marketing"
    | "Design"
    | "Engineering";
  linkedin: string;
  github?: string;
};
