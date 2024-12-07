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
var costFunction_exports = {};
__export(costFunction_exports, {
  calculateCost: () => calculateCost
});
module.exports = __toCommonJS(costFunction_exports);
function calculateCost(usage, modelType) {
  const PROMPT_TOKEN_RATE = modelType === "gpt-4o-mini" ? 15e-5 : 0.01;
  const COMPLETION_TOKEN_RATE = modelType === "gpt-4o-mini" ? 6e-4 : 3e-5;
  const promptCost = usage.prompt_tokens / 1e3 * PROMPT_TOKEN_RATE;
  const completionCost = usage.completion_tokens / 1e3 * COMPLETION_TOKEN_RATE;
  return {
    promptCost: promptCost.toFixed(6),
    completionCost: completionCost.toFixed(6),
    totalCost: (promptCost + completionCost).toFixed(6)
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  calculateCost
});
