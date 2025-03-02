import SectionPageLayout from "@/components/layout/SectionPage/SectionPageLayout";
import SectionContainer from "@/components/section/layout/SectionContainer";
import SectionForm from "@/components/section/courseFilters/SectionForm";
import SectionPageMobile from "./MobileSectionPage";
import useMobile from "@/hooks/use-mobile";

const SectionPage = () => {
  const isMobile = useMobile();
  return (
    <>
      {isMobile ? (
        <SectionPageMobile />
      ) : (
        <SectionPageLayout>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-1 gap-4">
              <div className="col-span-1">
                <SectionForm onSwitchTab={() => {}} />
              </div>
              <div className="col-span-2">
                <SectionContainer />
              </div>
            </div>
          </div>
        </SectionPageLayout>
      )}
    </>
  );
};

export default SectionPage;
