/* Converts a short catalog year format to the full catalog year format
 * @param shortCatalogYear Short catalog year format (e.g., "19-20")
 * @returns Full catalog year format (e.g., "2019-2020")
 */
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
