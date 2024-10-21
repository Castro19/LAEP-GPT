import { useToast } from "../ui/use-toast";

export default function useCompleteProfileToast() {
  const { toast } = useToast();

  const showCompleteProfileToast = () => {
    toast({
      title: "Complete your profile",
      description: "Do not show again [Implement Option]",
    });
  };

  return showCompleteProfileToast;
}
