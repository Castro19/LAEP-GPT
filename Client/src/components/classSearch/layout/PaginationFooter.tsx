/**
 * @component PaginationFooter
 * @description Pagination controls for class search results. Handles page navigation with
 * previous/next buttons and displays current page information.
 *
 * @props
 * None - Component reads from Redux state
 *
 * @dependencies
 * - Redux: classSearch state (page, totalPages, loading, isQueryAI)
 * - Redux actions: setPage, fetchSectionsAsync, queryAIPagination
 * - Button: UI button components
 *
 * @features
 * - Previous/next page navigation
 * - Current page display (Page X of Y)
 * - Loading state handling
 * - AI query pagination support
 * - Disabled state for edge pages
 * - Sticky bottom positioning
 * - Responsive design
 *
 * @example
 * ```tsx
 * <PaginationFooter />
 * ```
 */

import { useAppDispatch, useAppSelector } from "@/redux";
import {
  setPage,
  fetchSectionsAsync,
  queryAIPagination,
} from "@/redux/classSearch/classSearchSlice";
import { Button } from "@/components/ui/button";

export const PaginationFooter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { page, totalPages, loading, isQueryAI } = useAppSelector(
    (state) => state.classSearch
  );

  const handlePrev = () => {
    if (page > 1) {
      dispatch(setPage(page - 1));

      if (isQueryAI) {
        dispatch(queryAIPagination());
      } else {
        dispatch(fetchSectionsAsync());
      }
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      dispatch(setPage(page + 1));

      if (isQueryAI) {
        dispatch(queryAIPagination());
      } else {
        dispatch(fetchSectionsAsync());
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-3 shadow-lg w-full sticky bottom-0 border-t border-gray-700">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Button
            onClick={handlePrev}
            disabled={page === 1 || loading}
            className={`w-full flex items-center justify-center px-4 py-2 rounded transition-colors duration-300 ${
              page === 1 || loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Previous
          </Button>

          <div className="text-center text-lg font-medium">
            Page <span className="font-bold">{page}</span> of{" "}
            <span className="font-bold">{totalPages}</span>
          </div>

          <Button
            onClick={handleNext}
            disabled={page === totalPages || loading}
            className={`w-full flex items-center justify-center px-4 py-2 rounded transition-colors duration-300 ${
              page === totalPages || loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    </footer>
  );
};
