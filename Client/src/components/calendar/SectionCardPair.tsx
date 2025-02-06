import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Example import
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TrashIcon } from "lucide-react";
import { SelectedSection } from "@polylink/shared/types";

const SectionCardPair = ({
  classPairSections,
  pairArray,
}: {
  classPairSections: SelectedSection[];
  pairArray: number[];
}) => {
  const handleDelete = () => {
    console.log("Delete clicked!");
  };

  const handleClick = (section: SelectedSection) => {
    console.log("Section clicked: ", section);
  };

  return (
    <>
      {/* For each classPair grouping */}
      <div className="mb-4">
        {/* ClassPair Header */}
        <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Class Pair: {pairArray.join(", ")}
        </h3>
        <div className="flex flex-wrap gap-4">
          {classPairSections.map((section) => {
            return (
              <ContextMenu key={section.classNumber}>
                <ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      inset
                      onClick={handleDelete}
                      className="hover:bg-red-500 w-auto"
                    >
                      <div className="flex items-center gap-2 dark:hover:text-red-500">
                        Remove
                        <TrashIcon className="w-4 h-4" />
                      </div>
                    </ContextMenuItem>
                  </ContextMenuContent>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card
                          onClick={() => handleClick(section)}
                          className={`w-64 h-20 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg 
                                ${
                                  section.enrollmentStatus === "O"
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                                    : "bg-gray-800 text-gray-300"
                                }`}
                        >
                          <div className="flex flex-col h-full">
                            <CardHeader className="p-3">
                              <CardTitle className="text-lg font-semibold truncate">
                                {section.component} - #{section.classNumber}
                              </CardTitle>
                              <CardDescription className="text-sm opacity-90">
                                {section.enrollmentStatus === "O"
                                  ? "Open"
                                  : "Closed"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto p-3">
                              {section.meetings.map((meet, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs text-gray-100"
                                >
                                  {meet.days.join(", ")}{" "}
                                  {meet.start_time && meet.end_time
                                    ? `| ${meet.start_time} - ${meet.end_time}`
                                    : ""}
                                </div>
                              ))}
                            </CardContent>
                          </div>
                        </Card>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </ContextMenuTrigger>
              </ContextMenu>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SectionCardPair;
