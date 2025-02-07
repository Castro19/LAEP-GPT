import { FormLabel } from "@/components/ui/form";

const TitleLabel = ({ title }: { title: string }) => {
  return (
    <FormLabel className="text-md font-bold dark:text-gray-300">
      {title}
    </FormLabel>
  );
};

export default TitleLabel;
