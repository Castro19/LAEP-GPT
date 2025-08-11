import { ObjectId } from "bson";

// Error Report Schema
export type ErrorDocument = {
  _id: ObjectId; // MongoDB's unique identifier
  userId: string; // ID of the user reporting the error
  title: string; // Short description of the error (required)
  description: string; // Detailed description of the error (required)
  type: "bug" | "feature-request" | "improvement" | "other"; // Type of report (required)
  severity: "low" | "medium" | "high" | "critical"; // Error severity level (required)
  status: "open" | "in-progress" | "resolved" | "closed"; // Current status (default: "open")

  // Optional fields that users can fill if they want to provide more context
  stepsToReproduce?: string; // Steps to reproduce the error
  expectedBehavior?: string; // What should have happened
  actualBehavior?: string; // What actually happened
  environment?: {
    // Environment details (optional)
    browser?: string; // Browser name and version
    operatingSystem?: string; // OS name and version
    device?: string; // Device type (mobile, desktop, etc.)
  };
  attachments?: {
    // Optional attachments
    screenshots?: string[]; // URLs to screenshots
  };
  createdAt: Date; // When the report was created (auto-generated)
  updatedAt: Date; // When the report was last updated (auto-generated)

  // Fields managed by developers/admin
  assignedTo?: string; // ID of the developer assigned to fix
  resolution?: {
    // Resolution details
    resolvedAt?: Date; // When the error was resolved
    resolutionNotes?: string; // Notes about how it was fixed
  };
};
