import { LabelProps } from "@radix-ui/react-label";

const LabelSection: React.FC<LabelProps> = ({ children }) => {
  return (
    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-400">
      {children}
    </h4>
  );
};

export default LabelSection;
