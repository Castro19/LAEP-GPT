# [PolyLink](https://polylink.dev)

## Description

This project is an AI-powered web app designed to help college students make the most out of their education.It is **built by students for students**.

We are using the **MERN (MongoDB, Express.js, React, Node.js) stack**, alongside **OpenAI's API** for natural language processing, and leveraing the **Qdrant vector database** for efficient semantic search and retrieval.

- Promo Video: https://youtu.be/DdeKuY-yxvk?si=Niz1s6W2Il6IfK6b
- Youtube Demo: https://www.youtube.com/watch?v=HlPKFzQB5l4&ab_channel=CristianCastroOliva

## Features

- **AI Assistant** – Provides real-time responses to academic and student-related inquiries.
- **Flowchart Creation** – Generates a multi-year academic plan based on major and concentration.
- **Course Search & Schedule Builder** – Helps users find and organize classes based on availability, professor ratings, and personal preferences.
- **Student Matching** – Assists in forming study groups, research teams, and roommate connections.
- **Data-Driven Recommendations** – Uses AI to suggest relevant resources and optimize student experience.

## Demonstrations

### Professor Ratings AI

Using Polyratings, get instant AI summaries of professor ratings and find the best professors for your classes!

![Professor Ratings AI](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTV3NGd2NzR4bHphYWQ1MHM4emMyb3dsaHV2dTJ2bXN1cXIwanV2biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SFSTMMjn0Mx7NCuzWu/giphy.gif)

### Course AI Query

Search naturally for classes and we will create a MongoDB query that finds the sections that fit your query.

![Schedule Builder AI](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDRveWdxZDg1anNheTJ5ejk3aWZpZzFscmIwZjY0ZnRnYWdsaGc3diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GevViQDkax5TKTgRUc/giphy.gif)

### Build Schedules

Add Spring 2025 sections and build all combinations of your weekly calendar the way you want it.

![Build Schedules](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWRvYmdjOGdpanF2cXE0NnMyOXB1OHZ0eXNmY3BkYXA4cTExMmRjbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PqUQ3Qbfeb6ZRjU4zn/giphy.gif)

### Schedule Builder AI

Get instant AI insights on your current weekly calendar and ways to improve it by analyzing workload, professor ratings, time conflicts, and more.

![Schedule Builder AI](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTFlOTY5ZTA3MmJsY29uaThocmVkdHV2NGZpNmxwYzNrZmw2cjl4eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1oDkNJu0oehVTAubbo/giphy.gif)

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

For any inquiries or contributions, please E-mail me at `help@polylink.dev`
I will be writing a [CONTRIBUTING.md](CONTRIBUTING.md) file soon.
