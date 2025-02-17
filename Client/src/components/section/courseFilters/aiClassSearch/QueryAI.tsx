import { FormItem } from "@/components/ui/form";
import CollapsibleContentWrapper from "@/components/section/reusable/wrappers/CollapsibleContentWrapper";
import { RiRobot3Line } from "react-icons/ri";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import TitleLabel from "@/components/section/reusable/filter/TitleLabel";
import {
  queryAIAsync,
  setIsInitialState,
  setPage,
} from "@/redux/section/sectionSlice";
import { AlertTriangle } from "lucide-react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const placeholders = [
  "Find CSC 300-500 courses available Mon-Thu",
  "Show me morning USCP courses with open seats",
  "I need MATH classes before 2pm with excellent professors",
  "Open labs after 3pm on Tuesdays",
  "4-unit GWR courses",
  "In-person CSC classes with no waitlist",
  "Async GE courses with high-rated professors",
  "Friday-only classes with seats available",
];

const QueryAI = () => {
  const dispatch = useAppDispatch();
  const { loading, AIQuery, queryError } = useAppSelector(
    (state) => state.section
  );
  const [query, setQuery] = useState("");

  const handleQuerySearch = async () => {
    if (query.trim() === "") return;
    dispatch(setIsInitialState(false));
    dispatch(setPage(1));
    dispatch(queryAIAsync(query));
  };

  return (
    <CollapsibleContentWrapper
      title="AI Class Search"
      icon={RiRobot3Line}
      defaultOpen={false}
    >
      {/* This could be <form> if you have a bigger form going on */}
      <FormItem>
        <div className="flex flex-col gap-4">
          {queryError && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <p className="text-red-500">{queryError}</p>
            </div>
          )}
          <TitleLabel title="Search Courses Your Way" />
          <p className="text-sm text-gray-500">
            Search naturally - we&apos;ll handle the details!
          </p>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setQuery(e.target.value)}
            // Called after vanish animation triggers
            onSubmit={handleQuerySearch}
            maxLength={200}
            interval={10000}
            loading={loading}
          />
        </div>
      </FormItem>

      {AIQuery?.explanation && (
        <>
          <TitleLabel title="Explanation" />
          <p>{AIQuery.explanation}</p>
        </>
      )}
    </CollapsibleContentWrapper>
  );
};

export default QueryAI;
