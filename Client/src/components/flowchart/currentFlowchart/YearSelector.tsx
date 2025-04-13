import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const YearSelector = ({
  totalYears,
  selectedYear,
  scrollToYear,
  isNarrowScreen,
}: {
  totalYears: number;
  selectedYear: number;
  // eslint-disable-next-line no-unused-vars
  scrollToYear: (year: number) => void;
  isNarrowScreen: boolean;
}) => {
  const handleChange = (value: string) => {
    const yearIndex = parseInt(value);
    scrollToYear(yearIndex);
  };

  return (
    <Tabs value={selectedYear.toString()} onValueChange={handleChange}>
      <TabsList className="w-full flex justify-between border-b border-slate-700/50 bg-slate-900/50 p-0 dark:bg-gray-900/50">
        {[...Array(totalYears)].map((_, index) => (
          <TabsTrigger
            key={index}
            value={index.toString()}
            className={`flex-1 rounded-none border-x border-slate-700/30 py-1.5 text-white/80 
              ${isNarrowScreen ? "text-xs px-2" : "text-sm"}
              data-[state=active]:bg-slate-800/50 data-[state=active]:text-white
              dark:data-[state=active]:bg-slate-700/50 dark:data-[state=active]:text-white
              hover:bg-slate-800/30 transition-colors duration-200
            `}
          >
            Year {index + 1}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default YearSelector;
