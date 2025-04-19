import { LabelProps } from "@radix-ui/react-label";

const LabelSection: React.FC<LabelProps> = ({ children, className }) => {
  return <h4 className={`text-sm font-medium ${className}`}>{children}</h4>;
};

export default LabelSection;
