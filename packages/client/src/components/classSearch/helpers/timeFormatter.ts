export const convertTo12HourFormat = (time: string): string => {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${period}`;
};
