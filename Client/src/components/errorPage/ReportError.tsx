import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppDispatch } from "@/redux";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the Zod schema for error reporting
const ERROR_REPORT_SCHEMA = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  type: z.enum(["bug", "feature-request", "improvement", "other"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  stepsToReproduce: z.string().optional(),
  expectedBehavior: z.string().optional(),
  actualBehavior: z.string().optional(),
  environment: z
    .object({
      browser: z.string().optional(),
      operatingSystem: z.string().optional(),
      device: z.string().optional(),
    })
    .optional(),
});

type ErrorReportForm = z.infer<typeof ERROR_REPORT_SCHEMA>;

const ReportError = () => {
  const dispatch = useAppDispatch();

  // Initialize the form with default values
  const form = useForm<ErrorReportForm>({
    resolver: zodResolver(ERROR_REPORT_SCHEMA),
    defaultValues: {
      title: "",
      description: "",
      type: "bug",
      severity: "medium",
      stepsToReproduce: "",
      expectedBehavior: "",
      actualBehavior: "",
      environment: {
        browser: "",
        operatingSystem: "",
        device: "",
      },
    },
  });

  const onSubmit = async (data: ErrorReportForm) => {
    try {
      // TODO: Dispatch action to create error report
      console.log("Form submitted:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Report an Issue</CardTitle>
          <CardDescription>
            Help us improve by reporting any issues you encounter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input {...form.register("title")} placeholder="Issue title" />
                {form.formState.errors.title && (
                  <p className="mt-1 text-xs text-red-500">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  {...form.register("description")}
                  placeholder="Describe the issue in detail"
                  rows={4}
                />
                {form.formState.errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <Select
                    onValueChange={(v) => form.setValue("type", v as any)}
                    defaultValue={form.getValues("type")}
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-slate-600">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature-request">Feature</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Severity
                  </label>
                  <Select
                    onValueChange={(v) => form.setValue("severity", v as any)}
                    defaultValue={form.getValues("severity")}
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-slate-600">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Steps to Reproduce
                </label>
                <Textarea
                  {...form.register("stepsToReproduce")}
                  placeholder="Optional"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expected Behavior
                  </label>
                  <Textarea
                    {...form.register("expectedBehavior")}
                    placeholder="Optional"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Actual Behavior
                  </label>
                  <Textarea
                    {...form.register("actualBehavior")}
                    placeholder="Optional"
                    rows={2}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  Environment Details (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Browser</label>
                    <Input
                      {...form.register("environment.browser")}
                      placeholder="e.g. Chrome 90"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Operating System
                    </label>
                    <Input
                      {...form.register("environment.operatingSystem")}
                      placeholder="e.g. Windows 10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Device</label>
                    <Input
                      {...form.register("environment.device")}
                      placeholder="e.g. Desktop"
                    />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Button type="submit" variant="default" className="py-2 px-6">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportError;
