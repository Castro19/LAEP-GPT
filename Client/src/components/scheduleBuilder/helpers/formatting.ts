/**
 * Utility functions for formatting
 */

/**
 * Formats an array of professor objects into a comma-separated string
 * @param professors - Array of professor objects with name and id properties
 * @returns Formatted string of professor names
 */
export const formatProfessorNames = (
  professors: Array<{ name: string; id: string | null }> | undefined
): string => {
  if (!professors || professors.length === 0) return "";

  // Capitalize the first letter of each word in each name
  const formattedNames = professors.map((professor) =>
    professor.name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );

  return formattedNames.join(", ");
};
