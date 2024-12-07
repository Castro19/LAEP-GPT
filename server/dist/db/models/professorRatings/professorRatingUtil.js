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
var professorRatingUtil_exports = {};
__export(professorRatingUtil_exports, {
  sortAndLimitReviews: () => sortAndLimitReviews
});
module.exports = __toCommonJS(professorRatingUtil_exports);
const sortAndLimitReviews = (reviews, courseIds, limit = 5) => {
  return reviews.map((professor) => {
    if (courseIds) {
      const filteredReviews = Object.fromEntries(
        Object.entries(professor.reviews).filter(
          ([courseId]) => courseIds.includes(courseId)
        )
      );
      professor.reviews = Object.keys(filteredReviews).length > 0 ? filteredReviews : professor.reviews;
    }
    for (const courseId in professor.reviews) {
      professor.reviews[courseId] = professor.reviews[courseId].sort((a, b) => {
        const aDate = Object.values(a)[0]?.postDate ?? "";
        const bDate = Object.values(b)[0]?.postDate ?? "";
        return bDate.localeCompare(aDate);
      }).slice(0, limit).map((review) => {
        const keepProps = [
          "grade",
          "overallRating",
          "presentsMaterialClearly",
          "recognizesStudentDifficulties",
          "rating"
          // "tags", // Add if tags are not empty
        ];
        const filteredReview = keepProps.reduce((acc, prop) => {
          acc[prop] = review[prop];
          return acc;
        }, {});
        if (review.tags && Object.keys(review.tags).length > 0) {
          filteredReview.tags = review.tags;
        }
        return filteredReview;
      });
    }
    return professor;
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sortAndLimitReviews
});
