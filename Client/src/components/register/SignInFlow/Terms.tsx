import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUserData } from "@/hooks/useUserData";
import { useAppSelector } from "@/redux";
import terms from "@/calpolyData/terms";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import useIsMobile from "@/hooks/use-mobile";

const md = new MarkdownIt();

export default function Terms() {
  const { handleChange } = useUserData();
  const userData = useAppSelector((state) => state.user.userData);
  const isMobile = useIsMobile();

  const onCheckedChange = (checked: boolean) => {
    handleChange("canShareData", checked);
  };

  const messageHtml = md.render(terms);
  const safeHtml = DOMPurify.sanitize(messageHtml);

  return (
    <LabelInputContainer>
      <div className={`flex-1 overflow-y-auto ${isMobile ? "pb-24" : "pb-20"}`}>
        <div
          className="prose prose-invert"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>
      <div className="sticky bottom-0 border-t p-4 dark:bg-zinc-800 mt-auto">
        <div className="flex items-center justify-center space-x-2">
          <Checkbox
            id="terms"
            checked={userData?.canShareData}
            onCheckedChange={onCheckedChange}
          />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </div>
    </LabelInputContainer>
  );
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <div
      className={`flex flex-col relative ${isMobile ? "h-[60vh]" : "h-full"}`}
    >
      {children}
    </div>
  );
};
