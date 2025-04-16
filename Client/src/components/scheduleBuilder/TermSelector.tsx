import { useAppDispatch, useAppSelector } from "@/redux";
import { setCurrentScheduleTerm } from "@/redux/schedule/scheduleSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TermSelector = () => {
  const dispatch = useAppDispatch();
  const currentTerm = useAppSelector(
    (state) => state.schedule.currentScheduleTerm
  );

  const handleTermChange = (value: string) => {
    dispatch(setCurrentScheduleTerm(value as "spring2025" | "summer2025"));
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <Tabs
          value={currentTerm}
          onValueChange={handleTermChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spring2025">Spring 2025</TabsTrigger>
            <TabsTrigger value="summer2025">Summer 2025</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TermSelector;
