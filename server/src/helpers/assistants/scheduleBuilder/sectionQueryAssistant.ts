import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import {
  SectionsFilterParams,
  Section,
  CourseTerm,
} from "@polylink/shared/types";
import { getSectionsByFilter } from "../../../db/models/section/sectionServices";
import * as summerSectionCollection from "../../../db/models/section/summerSectionCollection";
import * as sectionCollection from "../../../db/models/section/sectionCollection";
import * as fallSectionCollection from "../../../db/models/section/fallSectionCollection";

// Define the response type
export interface QueryResponse {
  query: Record<string, any> | null;
  explanation: string;
  results: Section[];
  totalPages: number;
  success: boolean;
}

// Initialize the LLM
const llm = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
});

// Create a structured output parser for SearchParams
const structuredLLM = llm.withStructuredOutput(
  z.object({
    // Add your SearchParams schema here
    // This should match your SectionsFilterParams type
    subject: z.string().optional(),
    courseIds: z.array(z.string()).optional(),
    status: z.string().optional(),
    days: z.string().optional(),
    timeRange: z.string().optional(),
    minInstructorRating: z.string().optional(),
    maxInstructorRating: z.string().optional(),
    minUnits: z.string().optional(),
    maxUnits: z.string().optional(),
    courseAttribute: z.array(z.string()).optional(),
    instructionMode: z.string().optional(),
    instructors: z.array(z.string()).optional(),
    isTechElective: z.boolean().optional(),
    techElectives: z
      .object({
        major: z.string(),
        concentration: z.string(),
      })
      .optional(),
    withNoConflicts: z.boolean().optional(),
    isCreditNoCredit: z.boolean().optional(),
    term: z.string(),
    moreInfoRequest: z.string().optional(),
  })
);

export async function sectionQueryAssistant(
  nlQuery: string
): Promise<QueryResponse> {
  try {
    const prompt = `
## System Instructions for "mongodb_query_builder"

### Description
Transforms natural language university course search requests into structured MongoDB queries conforming to the Section schema.

### Core Requirements
1. Strict Schema Adherence
   - Only use field names defined in the Section schema
   - No custom or undefined fields

2. Function Call Output
   - Always respond with a single function call named "filter_sections"
   - Must include query and explanation arguments
   - Query must contain at least one valid filter condition
   - Explanation must be concise (≤ 200 characters)

3. Valid Operators
   - Use $and, $or, $regex, $gte, $lte, $in, $elemMatch
   - Ensure proper JSON formatting

4. Time & Rating Handling
   - Convert times to 24-hour format (e.g., 3:00 PM → 15:10)
   - Map rating descriptions to numeric values (e.g., "good" → $gte 3.0)

5. Error Handling
   - Request clarification for ambiguous requests
   - Return empty query with error explanation for invalid requests

User request: '${nlQuery}'
`;

    const resp = await structuredLLM.invoke(nlQuery);

    if (resp.moreInfoRequest) {
      // LLM asked for more details
      return {
        query: null,
        explanation: resp.moreInfoRequest,
        results: [],
        totalPages: 0,
        success: false,
      };
    }

    // success path
    const { sections, total } = await getSectionsByFilter(
      resp as SectionsFilterParams,
      "",
      0,
      25
    );
    if (!sections) {
      return {
        query: null,
        explanation: resp.moreInfoRequest || "",
        results: [],
        totalPages: 0,
        success: false,
      };
    }

    return {
      query: resp,
      explanation: "",
      results: sections,
      totalPages: Math.ceil(total / 25),
      success: true,
    };
  } catch (e) {
    return {
      query: null,
      explanation: `LLM error: ${e}`,
      results: [],
      totalPages: 0,
      success: false,
    };
  }
}

export async function findSectionsByFilter(
  query: Record<string, any>,
  term: CourseTerm = "fall2025"
): Promise<{ sections: Section[]; total: number }> {
  try {
    let result;

    // Use the appropriate collection based on term
    if (term === "summer2025") {
      result = await summerSectionCollection.findSectionsByFilter(query, 0, 25);
    } else if (term === "spring2025") {
      result = await sectionCollection.findSectionsByFilter(query, 0, 25);
    } else {
      // fall2025 by default
      result = await fallSectionCollection.findSectionsByFilter(query, 0, 25);
    }

    return {
      sections: result.sections,
      total: result.total,
    };
  } catch (e) {
    console.error("MongoDB error:", e);
    return { sections: [], total: 0 };
  }
}
