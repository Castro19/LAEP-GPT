import { RunningStreamData } from "@polylink/shared/types";
import handleSingleAgentModel from "../singleAgent";
import { Response } from "express";
import handleMultiAgentModel from "../multiAgent";
import { environment } from "../../..";
interface ModelHandlerParams {
  model: { id: string; title: string };
  logId: string;
  message: string;
  res: Response;
  userId: string;
  runningStreams: RunningStreamData;
  sections?: string;
  streamId: string;
}
export const isSpecializedModel = (modelTitle: string): boolean => {
  return [
    "Professor Ratings",
    "Spring Planner Assistant",
    "Schedule Analysis",
  ].includes(modelTitle);
};

const handleError = (
  error: unknown,
  res: Response,
  modelType: string
): void => {
  if (environment === "dev") {
    console.error(`Error in ${modelType}:`, error);
  }
  if (!res.headersSent) {
    res.status(500).send("Failed to process request.");
  } else {
    res.end();
  }
};

export const handleHelpAssistant = async (
  params: ModelHandlerParams
): Promise<void> => {
  await handleSingleAgentModel({
    model: {
      id: "67b42fd0c4f92c0ed9ea73ab",
      title: "Help Assistant",
    },
    logId: params.logId,
    message: params.message,
    res: params.res,
    userId: params.userId,
    streamId: params.streamId,
    runningStreams: params.runningStreams,
  });
};

export const handleModelResponse = async (
  params: ModelHandlerParams
): Promise<void> => {
  const { model, message, sections } = params;

  try {
    if (isSpecializedModel(model.title)) {
      if (
        message ===
        "[CLICK ME TO START] How do I use the Schedule Analysis Assistant?"
      ) {
        await handleHelpAssistant(params);
      } else if (
        model.title === "Schedule Analysis" &&
        sections &&
        JSON.parse(sections).length === 0
      ) {
        await handleHelpAssistant({ ...params, message: "No Sections Found" });
      } else {
        if (environment === "dev") {
          console.log("MODEL: ", model);
        }
        await handleMultiAgentModel({
          ...params,
          streamId: params.streamId,
          sections: sections ? JSON.parse(sections as string) : [],
        });
      }
    } else {
      await handleSingleAgentModel(params);
    }
  } catch (error) {
    handleError(
      error,
      params.res,
      isSpecializedModel(model.title)
        ? "multi-agent model"
        : "single-agent model"
    );
  }
};
