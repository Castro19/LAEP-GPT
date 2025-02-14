import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { setPage, setCurrentCalendar } from "@/redux/calendar/calendarSlice";

export const PaginationFooter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { page, totalPages, loading, calendars } = useAppSelector(
    (state) => state.calendar
  );

  const handlePrev = () => {
    if (page > 1) {
      const newIndex = page - 2;
      if (newIndex >= 0 && newIndex < calendars.length) {
        dispatch(setPage(newIndex + 1));
        dispatch(setCurrentCalendar(calendars[newIndex]));
      }
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newIndex = page;
      if (newIndex >= 0 && newIndex < calendars.length) {
        dispatch(setPage(newIndex + 1));
        dispatch(setCurrentCalendar(calendars[newIndex]));
      }
    }
  };

  return (
    <footer className="sticky bottom-0 pb-20 w-full bg-gray-900 text-white py-3 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4">
        <button
          onClick={handlePrev}
          disabled={page === 1 || loading}
          className={`px-4 py-2 rounded 
            ${page === 1 || loading ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} 
            transition-colors duration-300
          `}
        >
          Previous
        </button>

        <div className="text-center">
          Page <span className="font-bold">{page}</span> of{" "}
          <span className="font-bold">{totalPages}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={page === totalPages || loading}
          className={`px-4 py-2 rounded 
            ${page === totalPages || loading ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} 
            transition-colors duration-300
          `}
        >
          Next
        </button>
      </div>
    </footer>
  );
};
