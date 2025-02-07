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

const QueryAI = () => {
  const dispatch = useAppDispatch();
  const { loading, queryExplanation, queryError } = useAppSelector(
    (state) => state.section
  );
  const [query, setQuery] = useState("");

  const handleQuerySearch = async () => {
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
        <div className="flex items-start justify-between  flex-col gap-4">
          <TitleLabel title="Enter your filters" />
          <div className="flex flex-col gap-4 w-full">
            <Textarea
              className="h-24"
              placeholder="EX: Find me classes in the morning on Monday"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleQuerySearch();
                }
              }}
            />

            <Button
              type="button"
              onClick={handleQuerySearch}
              className="w-full"
              disabled={loading}
            >
              Search
            </Button>
          </div>
        </div>
      </FormItem>
      <TitleLabel title="Explanation" />
      {queryError && <p className="text-red-500">{queryError}</p>}
      {queryExplanation && <p>{queryExplanation}</p>}
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
