import { motion } from "framer-motion";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

// Redux
import { useAppSelector } from "@/redux";

// Hooks
import { useUserData } from "@/hooks/useUserData";

// Environment variables
import terms from "@/constants/terms";

// UI Components
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useDeviceType from "@/hooks/useDeviceType";
const md = new MarkdownIt();

export default function Terms() {
  const { handleChange } = useUserData();
  const device = useDeviceType();

  const userData = useAppSelector((state) => state.user.userData);

  const onCheckedChange = (checked: boolean) => {
    handleChange("canShareData", checked);
  };

  const messageHtml = md.render(terms);
  const safeHtml = DOMPurify.sanitize(messageHtml);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <Card className={`${device === "mobile" ? "p-2" : "p-3 sm:p-4 md:p-6"}`}>
        {/* Terms Content */}
        <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 md:mb-8">
          <div className="overflow-y-auto p-3 sm:p-4 md:p-6 max-h-[350px] sm:max-h-[400px] md:max-h-[450px] lg:max-h-[500px]">
            <div
              className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </div>

          {/* Gradient Overlay (smaller so it doesn’t add too much “fade” space) */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 sm:h-8 md:h-10 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
        </div>

        {/* Sticky Checkbox Section */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-2 sm:pt-3 md:pt-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-white dark:bg-gray-900"
          >
            <Checkbox
              id="terms"
              checked={userData?.canShareData}
              onCheckedChange={onCheckedChange}
              className="text-blue-500 h-4 w-4 sm:h-5 sm:w-5"
            />
            <Label
              htmlFor="terms"
              className="font-medium cursor-pointer select-none text-sm sm:text-base"
            >
              I accept the terms and conditions
            </Label>
          </motion.div>

          {/* Info Note */}
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center mt-2 sm:mt-3 md:mt-4">
            By accepting, you agree to our terms of service and data sharing
            policies
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
