// Import necessary libraries

import { QdrantClient } from "@qdrant/js-client-rest";
import { openai, qdrant } from "../../index.js";

// Helper function to get embeddings from OpenAI
async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    input: text,
    model: "text-embedding-3-large",
    dimensions: 1024,
  });
  const embedding = response.data[0].embedding;
  return embedding;
}

// Main function to search courses
export async function searchCourses(query_text, subject = null, top_k = 5) {
  // Load API keys from environment variables

  // Initialize Qdrant client
  const qdrantClient = new QdrantClient({
    url: qdrant.qdrantUrl,
    apiKey: qdrant.qdrantApiKey,
  });

  const collectionName = "courses";

  // Generate the query vector
  const query_vector = await getEmbedding(query_text);

  // Build the filter if subject is specified
  let query_filter = null;
  if (subject) {
    query_filter = {
      must: [
        {
          key: "subject",
          match: { value: subject },
        },
      ],
    };
  }

  // Perform the search
  const searchResult = await qdrantClient.search(collectionName, {
    vector: query_vector,
    filter: query_filter,
    limit: top_k,
    with_payload: true,
  });

  // Process and return the results
  const results = searchResult.map((hit) => ({
    id: hit.id,
    score: hit.score,
    courseId: hit.payload.courseId,
    subject: hit.payload.subject,
    displayName: hit.payload.displayName,
    description: hit.payload.description,
  }));
  const courseIds = searchResult.map((result) => result.payload.courseId);
  console.log("results: ", results);
  console.log("courseIds: ", courseIds);
  return courseIds;
}

export async function searchProfessors(query_text, top_k = 1) {
  const query_vector = await getEmbedding(query_text);

  // Initialize Qdrant client
  const qdrantClient = new QdrantClient({
    url: qdrant.qdrantUrl,
    apiKey: qdrant.qdrantApiKey,
  });

  const collectionName = "professors";

  const searchResult = await qdrantClient.search(collectionName, {
    vector: query_vector,
    limit: top_k,
    with_payload: true,
  });
  console.log("searchResult: ", searchResult);
  const results = searchResult.map((result) => ({
    id: result.id,
    score: result.score,
    courses: result.payload.courses,
    name: result.payload.name,
    professorId: result.payload.id,
  }));
  console.log("results: ", results);
  return searchResult[0].payload.id;
}
