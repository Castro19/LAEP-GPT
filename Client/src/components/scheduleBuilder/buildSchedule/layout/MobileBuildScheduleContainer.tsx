import LeftSectionFooter from "./LeftScheduleFooter";

const MobileBuildScheduleContainer = ({
  children,
  onFormSubmit,
  onClick,
}: {
  children: React.ReactNode;
  onFormSubmit: () => void;
  onClick: () => void;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="px-6 space-y-4 mb-48">{children}</div>
      </div>
      <footer className="safe-bottom-inset fixed bottom-0 w-full">
        <LeftSectionFooter
          formText="Apply Filters"
          buttonText="Reset Filters"
          onFormSubmit={onFormSubmit}
          onClick={onClick}
        />
      </footer>
    </>
  );
};

export default MobileBuildScheduleContainer;
