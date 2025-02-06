const CalendarPageHeader = () => {
  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 border-zinc-800 dark:border-slate-700 shadow-md">
      <div className="flex items-center justify-center">
        <div className="text-2xl font-bold leading-tight text-center">
          Weekly Calendar
        </div>
        <div className="flex items-center gap-2"></div>
      </div>
    </header>
  );
};

export default CalendarPageHeader;
