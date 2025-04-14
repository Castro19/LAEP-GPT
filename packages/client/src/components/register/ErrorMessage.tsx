import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ErrorMessage({ text }: { text: string }) {
  return (
    <Alert className="bg-red-500 text-white" variant="destructive">
      <AlertCircle className="h-4 w-4 text-white" />
      <AlertTitle className="text-white">Error</AlertTitle>
      <AlertDescription className="text-white text-sm">{text}</AlertDescription>
    </Alert>
  );
}
