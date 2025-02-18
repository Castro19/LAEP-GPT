# Project Name

## Description

This project is an AI-powered web application designed to assist users with academic and student life-related queries. It provides an intelligent assistant that can answer questions about courses, professors, clubs, and other student resources. Additionally, it features tools for academic planning, schedule building, and personalized recommendations using AI and machine learning.

The system utilizes a **MERN (MongoDB, Express.js, React, Node.js) stack**, integrates **OpenAI's API** for natural language processing, and leverages the **Qdrant vector database** for efficient semantic search and retrieval.

## Features

- **AI Assistant** – Provides real-time responses to academic and student-related inquiries.
- **Flowchart Creation** – Generates a multi-year academic plan based on major and concentration.
- **Course Search & Schedule Builder** – Helps users find and organize classes based on availability, professor ratings, and personal preferences.
- **Student Matching** – Assists in forming study groups, research teams, and roommate connections.
- **Data-Driven Recommendations** – Uses AI to suggest relevant resources and optimize student experience.

## Demonstrations

### Professor Ratings AI

Using Polyratings, get instant AI summaries of professor ratings and find the best professors for your classes!

![Professor Ratings AI](https://giphy.com/embed/SFSTMMjn0Mx7NCuzWu)

### Course AI Query

Search naturally for classes and we will create a MongoDB query that finds the sections that fit your query.

![Course AI Query](https://giphy.com/embed/GevViQDkax5TKTgRUc)

### Build Schedules

Add Spring 2025 sections and build all combinations of your weekly calendar the way you want it.

![Build Schedules](https://giphy.com/embed/PqUQ3Qbfeb6ZRjU4zn)

### Schedule Builder AI

Get instant AI insights on your current weekly calendar and ways to improve it by analyzing workload, professor ratings, time conflicts, and more.

![Schedule Builder AI](https://giphy.com/embed/1oDkNJu0oehVTAubbo)

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI Integration:** OpenAI API, Qdrant for vector search
- **Hosting & Deployment:** TBD (Vercel, AWS, or other services)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Castro19/LAEP-GPT.git
   cd LAEP-GPT
   ```

2. Install Client and Server dependencies:
   ```sh
   npm run install:all
   ```
3. Install Root dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables (e.g., API keys for OpenAI and Qdrant) in a `.env` file.

   - Will release with an instruction list of how to do this seperately. However, if you are onboading, please message me for the .env file and you will be sent your own personal API keys.

## Development

1. Start the development server:

```sh
npm run dev
```

**Notes**: If the types are not working, build the shared folder

```sh
cd shared
npm run build
```

## Acknowledgments

Special thanks to our advisor **Franz Kurfess** for guidance throughout the development process. Additionally, we appreciate the contributions and data from [Polyratings](https://polyratings.dev/) and [PolyFlowBuilder](https://polyflowbuilder.io/), which helped enhance our implementation.

For any inquiries or contributions, please E-mail me at please refer to the [CONTRIBUTING.md] file or open an issue on GitHub.
