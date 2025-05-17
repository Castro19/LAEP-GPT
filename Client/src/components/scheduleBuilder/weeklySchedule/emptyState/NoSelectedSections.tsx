import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FiInfo, FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const COPY = {
  title: "Your Schedule is Looking a Little Empty!",

  emptyState: {
    heading: "First, add some sections to your schedule!",
    descriptionList: [
      {
        startText: "You can add sections from our ",
        strongText: "Class Search",
        isButton: true,
        endText: ".",
      },
      {
        startText: "Once you've selected your ",
        strongText: "sections",
        endText: " come back here to build your schedule!",
      },
    ],
    cta: "Browse Available Spring 2025 Sections",
  },
};

const NoSelectedSections = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex justify-center items-center h-full p-4"
    >
      <Card className="w-full max-w-2xl p-8 space-y-8 bg-gray-800/50 border-gray-700">
        {/* Primary Empty State */}
        <div className="space-y-6 text-center">
          <div className="inline-flex p-4 bg-blue-500/20 rounded-full">
            <FiPlusCircle className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 leading-tight">
            {COPY.title}
          </h2>
        </div>
        <div className="space-y-4">
          <div className="p-5 bg-gray-700/30 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FiInfo className="w-4 h-4 text-gray-500" />
              {COPY.emptyState.heading}
            </h4>
            <ul className="space-y-2.5 text-gray-400 text-md">
              {COPY.emptyState.descriptionList.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▸</span>
                  <span className="flex-1">
                    {item.startText}
                    <strong
                      onClick={() => {
                        if (item.isButton) {
                          navigate("/class-search");
                        }
                      }}
                      className={`text-blue-300 ${
                        item.isButton ? "cursor-pointer" : ""
                      }`}
                    >
                      {item.strongText}
                    </strong>
                    {item.endText}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Button
          size="lg"
          onClick={() => navigate("/class-search")}
          className="gap-2 text-lg font-semibold bg-blue-500 hover:bg-blue-400 transition-colors w-full"
        >
          {COPY.emptyState.cta}
        </Button>
      </Card>
    </motion.div>
  );
};

export default NoSelectedSections;
