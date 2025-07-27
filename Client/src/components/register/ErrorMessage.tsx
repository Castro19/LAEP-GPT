/**
 * @component ErrorMessage
 * @description Error alert component for displaying error messages with consistent styling.
 * Uses destructive variant with red background and white text.
 *
 * @props
 * @prop {string} text - Error message text to display
 *
 * @dependencies
 * - Alert: UI alert component
 * - AlertTitle, AlertDescription: Alert sub-components
 * - Lucide Icons: AlertCircle icon
 *
 * @features
 * - Destructive styling (red background)
 * - White text for contrast
 * - Alert icon display
 * - Consistent error message format
 * - Accessible alert structure
 *
 * @example
 * ```tsx
 * <ErrorMessage text="Invalid email address" />
 * ```
 */

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
