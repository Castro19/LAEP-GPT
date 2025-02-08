import { FormItem } from "@/components/ui/form";
import CollapsibleContentWrapper from "./reusable/CollapsibleContentWrapper";
import { RiRobot3Line } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux";
import TitleLabel from "./reusable/TitleLabel";
import {
  queryAIAsync,
  setIsInitialState,
  setPage,
} from "@/redux/section/sectionSlice";
import { AlertTriangle, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const QueryAI = () => {
  const dispatch = useAppDispatch();
  const { loading, AIQuery, queryError } = useAppSelector(
    (state) => state.section
  );
  const [query, setQuery] = useState("");

  const handleQuerySearch = async () => {
    if (query.trim() === "") {
      return;
    }

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
      <FormItem>
        <div className="flex items-start justify-between flex-col gap-4">
          {queryError && (
            <>
              {/* Warning Icon */}
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <p className="text-red-500">{queryError}</p>
              </div>
            </>
          )}
          <TitleLabel title="Search Courses Your Way" />
          <div className="flex flex-col gap-4 w-full">
            <ScrollArea className="h-36">
              <Textarea
                className="h-32 max-h-36"
                placeholder={
                  `Examples:\n` +
                  `• "Find CSC 300-500 courses with good reviews, available Mon-Thu"\n` +
                  `• "Show me morning USCP courses with open seats"\n` +
                  `• "I need MATH classes before 2pm with excellent professors"\n` +
                  `\nSearch naturally - we'll handle the details!`
                }
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleQuerySearch();
                  }
                }}
                maxLength={200}
              />
            </ScrollArea>
            <Button
              type="button"
              onClick={handleQuerySearch}
              className="w-full"
              disabled={loading || query.length === 0}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </div>
              ) : (
                "Find My Courses"
              )}
            </Button>
          </div>
        </div>
      </FormItem>
      {AIQuery?.explanation !== null && (
        <>
          <TitleLabel title="Explanation" />
          {AIQuery?.explanation !== null && <p>{AIQuery?.explanation}</p>}
        </>
      )}
    </CollapsibleContentWrapper>
  );
};

export default QueryAI;

/*
import { Switch } from "@/components/ui/switch";
<div className="flex flex-col gap-4">
<div className="flex justify-between gap-2">
  <TitleLabel title="Include other filters?" />
  <Switch
    className="self-start"
    checked={includeOtherFilters}
    onCheckedChange={(checked) => {
      setIncludeOtherFilters(checked);
    }}
  />
</div>
</div>
  const [includeOtherFilters, setIncludeOtherFilters] = useState(false);
*/
