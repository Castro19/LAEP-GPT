"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var qdrantQuery_exports = {};
__export(qdrantQuery_exports, {
  searchCourses: () => searchCourses,
  searchProfessors: () => searchProfessors
});
module.exports = __toCommonJS(qdrantQuery_exports);
var import_js_client_rest = require("@qdrant/js-client-rest");
var import__ = require("../../index.js");
async function getEmbedding(text) {
  const response = await import__.openai.embeddings.create({
    input: text,
    model: "text-embedding-3-large",
    dimensions: 1024
  });
  const embedding = response.data[0].embedding;
  return embedding;
}
async function searchCourses(query_text, subject = null, top_k = 5) {
  const qdrantClient = new import_js_client_rest.QdrantClient({
    url: import__.qdrant.qdrantUrl,
    apiKey: import__.qdrant.qdrantApiKey
  });
  const collectionName = "courses";
  const query_vector = await getEmbedding(query_text);
  let query_filter = null;
  if (subject) {
    query_filter = {
      must: [
        {
          key: "subject",
          match: { value: subject }
        }
      ]
    };
  }
  const searchResult = await qdrantClient.search(collectionName, {
    vector: query_vector,
    filter: query_filter,
    limit: top_k,
    with_payload: true
  });
  const results = searchResult.map((hit) => ({
    id: hit.id,
    score: hit.score,
    courseId: hit.payload?.courseId,
    subject: hit.payload?.subject,
    displayName: hit.payload?.displayName,
    description: hit.payload?.description
  }));
  const courseIds = searchResult.map((result) => result.payload?.courseId);
  console.log("results: ", results);
  console.log("courseIds: ", courseIds);
  return courseIds;
}
async function searchProfessors(query_text, top_k = 1) {
  const query_vector = await getEmbedding(query_text);
  const qdrantClient = new import_js_client_rest.QdrantClient({
    url: import__.qdrant.qdrantUrl,
    apiKey: import__.qdrant.qdrantApiKey
  });
  const collectionName = "professors";
  const searchResult = await qdrantClient.search(collectionName, {
    vector: query_vector,
    limit: top_k,
    with_payload: true
  });
  console.log("searchResult: ", searchResult);
  const results = searchResult.map((result) => ({
    id: result.id,
    score: result.score,
    courses: result.payload?.courses,
    name: result.payload?.name,
    professorId: result.payload?.id
  }));
  console.log("results: ", results);
  return searchResult[0]?.payload?.id;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  searchCourses,
  searchProfessors
});
