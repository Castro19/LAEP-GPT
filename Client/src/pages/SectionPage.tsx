import SectionPageLayout from "@/components/layout/SectionPage/SectionPageLayout";
import { SidebarProvider } from "@/components/ui/sidebar";

const SectionPage = () => {
  return (
    <SidebarProvider>
      <SectionPageLayout>
        <div>Section Page</div>
      </SectionPageLayout>
    </SidebarProvider>
  );
};

export default SectionPage;
