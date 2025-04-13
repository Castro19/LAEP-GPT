# [PolyLink](https://polylink.dev)

## Description

This project is an AI-powered web app designed to help college students make the most out of their education.It is **built by students for students**.

We are using the **MERN (MongoDB, Express.js, React, Node.js) stack**, alongside **OpenAI's API** for natural language processing, and leveraing the **Qdrant vector database** for efficient semantic search and retrieval.

- Promo Video: https://youtu.be/DdeKuY-yxvk?si=Niz1s6W2Il6IfK6b
- Youtube Demo: https://www.youtube.com/watch?v=HlPKFzQB5l4&ab_channel=CristianCastroOliva

## Features

- **AI Assistant** – Provides real-time responses to academic and student-related inquiries.
- **Flowchart Creation** – Generates a multi-year academic plan based on major and concentration.
- **Course Search & Schedule Analysis** – Helps users find and organize classes based on availability, professor ratings, and personal preferences.
- **Student Matching** – Assists in forming study groups, research teams, and roommate connections.
- **Data-Driven Recommendations** – Uses AI to suggest relevant resources and optimize student experience.

## Demonstrations

### Professor Ratings AI

Using Polyratings, get instant AI summaries of professor ratings and find the best professors for your classes!

![Professor Ratings AI](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTV3NGd2NzR4bHphYWQ1MHM4emMyb3dsaHV2dTJ2bXN1cXIwanV2biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SFSTMMjn0Mx7NCuzWu/giphy.gif)

### Course AI Query

Search naturally for classes and we will create a MongoDB query that finds the sections that fit your query.

![Schedule Analysis AI](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDRveWdxZDg1anNheTJ5ejk3aWZpZzFscmIwZjY0ZnRnYWdsaGc3diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GevViQDkax5TKTgRUc/giphy.gif)

### Build Schedules

Add Spring 2025 sections and build all combinations of your weekly calendar the way you want it.

![Build Schedules](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWRvYmdjOGdpanF2cXE0NnMyOXB1OHZ0eXNmY3BkYXA4cTExMmRjbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PqUQ3Qbfeb6ZRjU4zn/giphy.gif)

### Schedule Analysis AI

Get instant AI insights on your current weekly calendar and ways to improve it by analyzing workload, professor ratings, time conflicts, and more.

![Schedule Analysis AI](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTFlOTY5ZTA3MmJsY29uaThocmVkdHV2NGZpNmxwYzNrZmw2cjl4eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1oDkNJu0oehVTAubbo/giphy.gif)

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

2. Run the setup script to install dependencies and configure your development environment:

   ```sh
   ./setup-dev.sh
   ```

   This script will:

   - Install recommended VSCode extensions
   - Install all project dependencies
   - Build the shared package
   - Run ESLint to verify the setup

   If the script fails to install some extensions automatically, you can install them manually:

   - Open VSCode
   - Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
   - Search for and install each of the recommended extensions listed in the Developer Setup section

3. Set up environment variables (e.g., API keys for OpenAI and Qdrant) in a `.env` file.

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

## Developer Setup

### VSCode Configuration

This project includes recommended VSCode settings and extensions to ensure a consistent development experience. When you open the project in VSCode, you'll be prompted to install the recommended extensions.

#### Essential Extensions

- **ESLint** (`dbaeumer.vscode-eslint`) - For linting and code quality
- **Prettier** (`esbenp.prettier-vscode`) - For code formatting
- **TypeScript Next** (`ms-vscode.vscode-typescript-next`) - For TypeScript support
- **GitLens** (`eamodio.gitlens`) - For enhanced Git integration and team collaboration
- **Docker** (`ms-azuretools.vscode-docker`) - For container management
- **Remote Containers** (`ms-vscode-remote.remote-containers`) - For development in containers

#### Manual Extension Installation

If the setup script fails to install some extensions automatically, you can install them manually:

1. Open VSCode
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for each extension by name or ID
4. Click "Install" for each extension

Alternatively, you can install extensions directly from the VSCode marketplace:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [TypeScript Next](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

#### ESLint and Prettier Setup

The project uses ESLint and Prettier for code formatting and linting. The configuration is already set up in the repository:

- ESLint configuration is in `server/eslint.config.js`
- VSCode settings are in `.vscode/settings.json`

To ensure ESLint warnings appear in VSCode:

1. Make sure you have the ESLint extension installed
2. Restart VSCode after cloning the repository
3. If warnings still don't appear, run the following command in the server directory:
   ```sh
   cd server
   npm run lint
   ```

## Acknowledgments

Special thanks to our advisor **Franz Kurfess** for guidance throughout the development process. Additionally, we appreciate the contributions and data from [Polyratings](https://polyratings.dev/) and [PolyFlowBuilder](https://polyflowbuilder.io/), which helped enhance our implementation.

For any inquiries or contributions, please E-mail me at `help@polylink.dev`

Also refer to our contribution guidelines here [CONTRIBUTING.md](CONTRIBUTING.md)
