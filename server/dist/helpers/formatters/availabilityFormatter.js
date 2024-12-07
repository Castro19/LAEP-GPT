"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var availabilityFormatter_exports = {};
__export(availabilityFormatter_exports, {
  formatAvailability: () => formatAvailability
});
module.exports = __toCommonJS(availabilityFormatter_exports);
function formatAvailability(availability) {
  const formattedOutput = [];
  function formatTime(hour) {
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${adjustedHour}${period}`;
  }
  for (const day in availability) {
    const intervals = availability[day];
    if (intervals.length > 0) {
      const formattedIntervals = intervals.map(([start, end]) => {
        return `${formatTime(start)} - ${formatTime(end)}`;
      });
      formattedOutput.push(`${day}: ${formattedIntervals.join(" & ")}`);
    }
  }
  return `{
  ${formattedOutput.join(",\n  ")}
}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatAvailability
});
