import { BaseMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { StateAnnotation, stateModifier } from "./state";
import {
  fetchSections,
  getAcademicPlanSummary,
  manageSchedule,
  suggestNextRequiredSections,
} from "./tools";

const agent = createReactAgent({
  llm: new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 }),
  tools: [
    fetchSections,
    manageSchedule,
    getAcademicPlanSummary,
    suggestNextRequiredSections,
  ],
  stateSchema: StateAnnotation,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateModifier: (s: any) => stateModifier(s) as unknown as BaseMessage[],
});

export async function* scheduleBuilderStream(
  initState: typeof StateAnnotation.State,
  threadId: string,
  userId: string
): AsyncGenerator<{
  chunk?: string;
  toolChunk?: string;
  toolCallChunk?: string;
  toolCalls?: {
    id: string;
    name: string;
    args: string;
    type: string;
  }[];
  lastState?: typeof StateAnnotation.State;
  tokenUsage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}> {
  // if (environment === "dev") {
  //   console.log("INIT STATE: ", initState);
  // }
  const eventStream = agent.streamEvents(initState, {
    configurable: { thread_id: threadId, user_id: userId },
    recursionLimit: 15,
    version: "v2",
  });

  let currentToolCall: {
    id?: string;
    name?: string;
    args: string;
    type: string;
  } | null = null;
  let lastState: typeof StateAnnotation.State | undefined;

  // Track LangChain's reported usage
  let promptTokens = 0;
  let completionTokens = 0;

  for await (const { event, data } of eventStream) {
    if (event === "on_chat_model_stream" && data.chunk) {
      // Handle tool call chunks
      if (
        data.chunk.tool_call_chunks &&
        data.chunk.tool_call_chunks.length > 0
      ) {
        for (const toolChunk of data.chunk.tool_call_chunks) {
          if (toolChunk.type === "tool_call_chunk") {
            // Start of a new tool call
            if (toolChunk.name && toolChunk.id) {
              if (
                currentToolCall &&
                currentToolCall.id &&
                currentToolCall.name
              ) {
                // Yield the completed tool call
                yield {
                  toolCalls: [
                    {
                      id: currentToolCall.id,
                      name: currentToolCall.name,
                      args: currentToolCall.args,
                      type: "tool_call",
                    },
                  ],
                };
              }
              currentToolCall = {
                id: toolChunk.id,
                name: toolChunk.name,
                args: toolChunk.args || "",
                type: "tool_call",
              };
            } else if (currentToolCall && toolChunk.args) {
              // Append to existing tool call args
              currentToolCall.args += toolChunk.args;
              try {
                // Try to parse the accumulated args as JSON
                const parsedArgs = JSON.parse(currentToolCall.args);
                yield {
                  toolCallChunk: JSON.stringify({
                    id: currentToolCall.id,
                    name: currentToolCall.name,
                    args: parsedArgs,
                    type: "tool_call",
                  }),
                };
              } catch (e) {
                // If not valid JSON yet, just stream the chunk
                yield { toolCallChunk: toolChunk.args };
              }
            }
          }
        }
      }
      // Haxndle regular text chunks
      else if (typeof data.chunk.content === "string" && data.chunk.content) {
        yield { chunk: data.chunk.content };
      }
    } else if (data.chunk && data.chunk.tools && data.chunk.tools.messages) {
      // Stream out each ToolMessage
      for (const message of data.chunk.tools.messages) {
        if (message.constructor.name === "ToolMessage") {
          yield { toolChunk: message.content };
        }
      }
    }

    // Capture token usage from LLM responses
    if (event === "on_llm_end") {
      const output = data.output as {
        response_metadata?: {
          tokenUsage?: { promptTokens?: number; completionTokens?: number };
        };
      };
      if (output?.response_metadata?.tokenUsage) {
        promptTokens += output.response_metadata.tokenUsage.promptTokens || 0;
        completionTokens +=
          output.response_metadata.tokenUsage.completionTokens || 0;
      }
    }

    // Update last state
    if (event === "on_chain_end" && data.output) {
      lastState = data.output;
    }
  }

  // Yield any remaining tool call
  if (currentToolCall && currentToolCall.id && currentToolCall.name) {
    yield {
      toolCalls: [
        {
          id: currentToolCall.id,
          name: currentToolCall.name,
          args: currentToolCall.args,
          type: "tool_call",
        },
      ],
    };
  }

  // Yield final state with token usage
  if (!lastState) {
    throw new Error("No state was generated during the stream");
  }
  yield {
    lastState,
    tokenUsage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens,
    },
  };
}
