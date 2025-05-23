// Import necessary libraries

import { QdrantClient } from "@qdrant/js-client-rest";
import { client, qdrant } from "../../index";

// Helper function to get embeddings from OpenAI
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    input: text,
    model: "text-embedding-3-large",
    dimensions: 1024,
  });
  const embedding = response.data[0].embedding;
  return embedding;
}

// Main function to search courses
export async function searchCourses(
  query_text: string,
  subject = null,
  top_k = 5
): Promise<string[]> {
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
  // const results = searchResult.map((hit) => ({
  //   id: hit.id,
  //   score: hit.score,
  //   courseId: hit.payload?.courseId,
  //   subject: hit.payload?.subject,
  //   displayName: hit.payload?.displayName,
  //   description: hit.payload?.description,
  // }));
  const courseIds = searchResult.map((result) => result.payload?.courseId);
  return courseIds as string[];
}

export async function searchProfessors(
  query_text: string,
  top_k = 1
): Promise<string> {
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
  // const results = searchResult.map((result) => ({
  //   id: result.id,
  //   score: result.score,
  //   courses: result.payload?.courses,
  //   name: result.payload?.name,
  //   professorId: result.payload?.id,
  // }));

  return searchResult[0]?.payload?.id as string;
}
