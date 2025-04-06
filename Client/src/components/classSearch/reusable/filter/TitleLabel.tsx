import { FormLabel } from "@/components/ui/form";

const TitleLabel = ({
  title,
  size = "md",
}: {
  title: string;
  size?: "lg" | "md" | "sm";
}) => {
  return (
    <FormLabel className={`text-${size} font-sans dark:text-gray-300`}>
      {title}
    </FormLabel>
  );
};

export default TitleLabel;
