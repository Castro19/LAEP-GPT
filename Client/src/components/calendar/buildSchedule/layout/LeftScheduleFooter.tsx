import { Button } from "@/components/ui/button";

const LeftSectionFooter = ({
  formText,
  onFormSubmit,
  buttonText,
  onClick,
}: {
  formText: string;
  onFormSubmit: () => void;
  buttonText: string;
  onClick: () => void;
}) => {
  return (
    <>
      {/* Divider above */}
      <div className="border-t border-gray-200" />

      <div
        className="
        sticky
        bottom-0
        mx-4
        bg-background/95
        backdrop-blur
        flex
        gap-2
        shadow-lg
        p-4
        safe-bottom-inset
      "
      >
        <Button
          type="submit"
          className="w-full shadow-lg dark:bg-gray-100 dark:bg-opacity-90 dark:hover:bg-gray-300 dark:hover:bg-opacity-90"
          onClick={onFormSubmit}
        >
          {formText}
        </Button>

        <Button
          onClick={onClick}
          variant="secondary"
          className="w-full shadow-lg dark:bg-slate-500 dark:bg-opacity-50 dark:hover:bg-slate-700 dark:hover:bg-opacity-70"
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
};

export default LeftSectionFooter;
