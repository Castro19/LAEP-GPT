export const SUGGESTED_SECTIONS_PER_COURSE = 1;
export const POTENTIAL_SECTIONS_PER_COURSE = 12;

export const TERM_MAP = {
  "-1": "Skip",
  1: "Fall",
  2: "Winter",
  3: "Spring",
  5: "Fall",
  6: "Winter",
  7: "Spring",
  9: "Fall",
  10: "Winter",
  11: "Spring",
  13: "Fall",
  14: "Winter",
  15: "Spring",
  17: "Fall",
  18: "Winter",
  19: "Spring",
  21: "Fall",
  22: "Winter",
  23: "Spring",
  25: "Fall",
  26: "Winter",
  27: "Spring",
  29: "Fall",
  30: "Winter",
  31: "Spring",
};

export const getCatalogYear = (shortCatalogYear?: string): string => {
  const catalogYear = shortCatalogYear?.split(".")[0];
  if (!catalogYear) {
    return "2022-2026"; // Default catalog year
  }

  switch (catalogYear) {
    case "19-20":
      return "2019-2020";
    case "20-21":
      return "2020-2021";
    case "21-22":
      return "2021-2022";
    case "22-26":
      return "2022-2026";
    default:
      return "2022-2026"; // Default catalog year
  }
};
