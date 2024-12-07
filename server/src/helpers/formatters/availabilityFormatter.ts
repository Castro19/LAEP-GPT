import { Availability } from "@polylink/shared/types";

export function formatAvailability(availability: Availability) {
  const formattedOutput = [];

  // Helper function to convert hour integer to 12-hour format with AM/PM
  function formatTime(hour: number) {
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${adjustedHour}${period}`;
  }

  // Iterate over each day in the availability object
  for (const day in availability) {
    const intervals = availability[day];

    // Only process if there are time intervals for the day
    if (intervals.length > 0) {
      const formattedIntervals = intervals.map(([start, end]) => {
        return `${formatTime(start)} - ${formatTime(end)}`;
      });

      // Join intervals with ' & ' and format as key-value string
      formattedOutput.push(`${day}: ${formattedIntervals.join(" & ")}`);
    }
  }

  // Return formatted output as a string that resembles an object structure
  return `{\n  ${formattedOutput.join(",\n  ")}\n}`;
}
