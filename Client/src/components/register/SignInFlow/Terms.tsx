import { motion } from "framer-motion";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

// Redux
import { useAppSelector } from "@/redux";

// Hooks
import { useUserData } from "@/hooks/useUserData";

// Environment variables
import terms from "@/calpolyData/terms";

// UI Components
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RiFileTextLine } from "react-icons/ri";

const md = new MarkdownIt();

export default function Terms() {
  const { handleChange } = useUserData();
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
      className="w-full"
    >
      <Card className="p-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <RiFileTextLine className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-semibold">Terms & Conditions</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Please review our terms and conditions
          </p>
        </div>

        {/* Terms Content */}
        <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 mb-24">
          <div className="max-h-[60vh] overflow-y-auto p-6">
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
        </div>

        {/* Sticky Checkbox Section */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-white dark:bg-gray-900"
          >
            <Checkbox
              id="terms"
              checked={userData?.canShareData}
              onCheckedChange={onCheckedChange}
              className="text-blue-500"
            />
            <Label
              htmlFor="terms"
              className="font-medium cursor-pointer select-none"
            >
              I accept the terms and conditions
            </Label>
          </motion.div>

          {/* Info Note */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            By accepting, you agree to our terms of service and data sharing
            policies
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
