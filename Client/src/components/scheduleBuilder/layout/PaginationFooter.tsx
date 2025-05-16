import { useAppDispatch, useAppSelector, scheduleActions } from "@/redux";
import { Button } from "@/components/ui/button";

const PaginationFooter = () => {
  const dispatch = useAppDispatch();
  const { page, totalPages, schedules } = useAppSelector(
    (state) => state.schedule
  );

  const handlePrev = () => {
    if (page > 1) {
      const newIndex = page - 2;
      if (newIndex >= 0 && newIndex < schedules.length) {
        dispatch(scheduleActions.setPage(newIndex + 1));
        dispatch(scheduleActions.setCurrentSchedule(schedules[newIndex]));
      }
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newIndex = page;
      if (newIndex >= 0 && newIndex < schedules.length) {
        dispatch(scheduleActions.setPage(newIndex + 1));
        dispatch(scheduleActions.setCurrentSchedule(schedules[newIndex]));
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-3 shadow-lg w-full sticky bottom-0 border-t border-gray-700">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          <Button
            onClick={handlePrev}
            disabled={page === 1}
            className={`w-full flex items-center justify-center px-4 py-2 rounded transition-colors duration-300 ${
              page === 1
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
            disabled={page === totalPages}
            className={`w-full flex items-center justify-center px-4 py-2 rounded transition-colors duration-300 ${
              page === totalPages
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

export default PaginationFooter;
