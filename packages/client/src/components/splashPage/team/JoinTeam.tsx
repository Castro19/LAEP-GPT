import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { RiTeamLine, RiInformationLine } from "react-icons/ri";

const JOIN_LINK =
  "https://docs.google.com/forms/d/e/1FAIpQLSeae1hQhfhRUPFWtOpIHOwa2vlPUwz5f1OkY1uOY12hVTpHZg/viewform";

const JoinTeam = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-5/6 mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-80"
    >
      <Card className="p-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Join Our Team!</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Would you like to contribute to our project and make a difference?
          </p>
        </div>

        <div className="grid gap-4">
          <motion.a
            href={JOIN_LINK}
            target="_blank"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300"
          >
            <div className="flex items-start space-x-4">
              <RiTeamLine className="w-6 h-6 text-blue-500 mt-1" />
              <div className="flex-1 text-left">
                <h3 className="font-medium mb-1">Fill Out Application</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Take a few minutes to tell us about yourself and how
                  you&apos;d like to contribute to the team.
                </p>
              </div>
            </div>
          </motion.a>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <RiInformationLine className="inline-block w-4 h-4 mr-1" />
          We&apos;re always looking for passionate individuals to join our team!
        </div>
      </Card>
    </motion.div>
  );
};

export default JoinTeam;
