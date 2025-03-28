# AI Assistant Workflow Documentation (Cal Poly Web App)

## Overview

This document outlines the current architecture and implementation details of our AI assistants designed to help students at Cal Poly SLO. The system utilizes the OpenAI Assistants API, Qdrant for vector similarity search, MongoDB for structured storage, and a Node.js/Express backend to orchestrate requests and maintain seamless integration.

## Goals

- Provide contextually relevant responses to student queries.
- Use user metadata to personalize interactions.
- Ensure persistence and context-tracking via OpenAI's threads and run management.
- Set a foundation for future improvements in assistant intelligence, robustness, and response efficiency.

---

## System Components

### 1. **OpenAI Assistants API**

- Core API for managing AI conversations.
- Each assistant operates via an OpenAI "Assistant" object with unique behavior/purpose.
- Utilizes **threads** to persist conversation context.
- Uses **runs** to stream responses and allow cancelation mid-response using `run_id`.

### 2. **Node.js/Express Backend**

- Interfaces between frontend and OpenAI/Qdrant/MongoDB services.
- Manages:
  - Thread creation and persistence.
  - User metadata processing.
  - API calls to OpenAI for assistant interactions.
  - Request/response flow with club data and embeddings.

### 3. **Qdrant (Vector Database)**

- Used when embedding search is required (for assistants leveraging semantic search).
- Stores vector representations of professors and courses
- Returns similarity-matched results for enhanced context generation.

### 4. **MongoDB**

- Stores structured user data and session metadata.
- May include logs, user profile information (e.g., major, interests, etc.), and assistant thread links.

---

## Assistants Implemented

### 1. **General Cal Poly SLO Assistant**

- **Type**: Prompt-engineered general assistant.
- **Model**: Uses latest OpenAI GPT model.
- **Features**:
  - Answers general Cal Poly-related queries.
  - Minimal backend processing.
  - Uses thread and run features for context continuity and streaming.

### 2. **Cal Poly Clubs Assistant**

- **Type**: Context-enriched assistant using JSON club data.
- **Model**: OpenAI GPT with assistant-specific prompt.
- **Special Logic**:
  - Uses a curated JSON dataset of Cal Poly clubs (club name, interests, category, etc.).
  - Backend injects user-specific info (interests, major, ethnicity) dynamically into each prompt.
  - This information guides the assistant to recommend clubs that match user preferences.

### 3. **Professor Ratings Assistant**

- **Type**: Multi-agent assistant with dynamic query handling and response generation.
- **Technologies**:
  - OpenAI API (chat completion + assistants API)
  - Qdrant (for fuzzy name matching)
  - MongoDB (for review storage and querying)
- **Workflow**:
  1. **User Query**: Student asks something like "What are the reviews for Nico CSC357?"
  2. **Parser Assistant (Chat Completion)**:
     - An assistant analyzes the user input and returns a JSON matching the schema used to identify what data needs to be fetched.
     - Code for this is located in `server/src/helpers/assistants/professorRatings/professorRatingsHelperAssistant.ts`
  3. **Backend Processing**:
     - Queries MongoDB and Qdrant depending on `type` to get professor or course-related reviews.
  4. **Responder Assistant (Assistants API)**:
     - Takes MongoDB results and original user message to generate the final streamed response.

### 4. **Schedule Analysis Assistant**

- **Type**: Multi-agent assistant focused on reviewing and optimizing student class schedules.
- **Technologies**:
  - OpenAI API (chat completion + assistants API)
  - MongoDB (used exclusively, no vector DB needed)
- **Workflow**:
  1. **Initial Query**: A student's question (e.g., "Is my current schedule balanced?") is parsed by a chat-completion assistant.
  2. **Structured Schema**: The assistant returns a JSON object conforming to a strict schema (`ScheduleAnalysisSchema`) that defines what information (sections, professors, alternatives) should be fetched.
  3. **Backend Processing**:
     - Based on `queryType`, the backend uses utility functions (`fetchSections`, `fetchProfessors`, `fetchAlternativeSections`) to query MongoDB.
     - The goal is to fetch only the necessary fields and records to reduce payload size while ensuring the responder assistant has all it needs to provide an accurate reply.
     - Types supported include:
       - `schedule_review`
       - `professor_insights`
       - `schedule_analysis`
       - `section_optimization`
     - Logic branches for each type assemble relevant data from MongoDB into a refined message.
  4. **Responder Assistant (Assistants API)**:
     - Receives the curated message and the original user query.
     - Streams back a thoughtful response using contextual continuity via threads and runs.

---

## Notes for Future Improvement

- Explore use of **functions/tool calls** via OpenAI API to expand assistant capabilities.
- Use **retrieval-augmented generation (RAG)** with Qdrant for document-heavy assistants.
- Implement multi-agent architecture for specialized task routing.
