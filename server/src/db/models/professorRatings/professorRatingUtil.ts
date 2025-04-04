import { ProfessRatingList } from "@polylink/shared/types";

export const sortAndLimitReviews = (
  reviews: ProfessRatingList[],
  courseIds: string[] | undefined,
  limit = 5
): ProfessRatingList[] => {
  return reviews
    .map((professor) => {
      if (courseIds) {
        const filteredReviews = Object.fromEntries(
          Object.entries(professor.reviews).filter(([courseId]) =>
            courseIds.includes(courseId)
          )
        );
        professor.reviews =
          Object.keys(filteredReviews).length > 0
            ? filteredReviews
            : professor.reviews;
      }

      // Sort and limit reviews to the top k (limit) most recent
      for (const courseId in professor.reviews) {
        professor.reviews[courseId] = professor.reviews[courseId]
          .sort((a, b) => {
            const aDate = Object.values(a)[0]?.postDate ?? "";
            const bDate = Object.values(b)[0]?.postDate ?? "";
            return bDate.localeCompare(aDate);
          })
          .slice(0, limit)
          .map((review) => {
            // All props I want to delete keep
            const keepProps = [
              "grade",
              "overallRating",
              "presentsMaterialClearly",
              "recognizesStudentDifficulties",
              "rating",
              // "tags", // Add if tags are not empty
            ];
            const filteredReview = keepProps.reduce(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (acc: any, prop: string) => {
                acc[prop] = review[prop];
                return acc;
              },
              {}
            );

            if (review.tags && Object.keys(review.tags).length > 0) {
              filteredReview.tags = review.tags;
            }
            return filteredReview;
          });
      }

      return professor;
    })
    .sort((a, b) => {
      // Calculate average rating across all courses for each professor
      const getAvgRating = (prof: ProfessRatingList): number => {
        const allReviews = Object.values(prof.reviews).flat();
        const sum = allReviews.reduce(
          (acc, review) => acc + Number(review.overallRating || 0),
          0
        );
        return allReviews.length ? sum / allReviews.length : 0;
      };

      return getAvgRating(b) - getAvgRating(a); // Sort in descending order
    })
    .slice(0, limit);
};
