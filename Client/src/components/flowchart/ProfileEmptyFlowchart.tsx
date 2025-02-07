import { HiOutlineAcademicCap } from "react-icons/hi2";

const ProfileEmptyFlowchart = () => {
  return (
    <div className="h-full flex items-center justify-center p-6 dark:bg-transparent rounded-lg">
      <div className="max-w-md text-center space-y-6">
        {/* Icon/Illustration */}
        <div className="flex justify-center">
          <div className="w-32 h-32 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <HiOutlineAcademicCap className="text-slate-300" size={48} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h3 className="text-4xl font-semibold text-gray-400">
            No Flowchart Found
          </h3>
          <p className="text-gray-200 text-lg">
            Create your academic plan to visualize your path to graduation and
            track your progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileEmptyFlowchart;
