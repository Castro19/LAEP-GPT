# [LAEP LLM](https://www.youtube.com/watch?v=Dd83CYNRw4k&ab_channel=CristianCastroOliva)

## Description

This project is a part of California Polytechnic State University (Cal Poly) in San Luis Obispo under the supervision of Prof. Franz J. Kurfess. It is an open-source repository intended to aid students.

The motivation behind this project is to allow students to easily be matched with a senior project advisor based on their interests, availability, and other insights.

This type of idea can be easily applied to other matching assistants such as

1. **Student → Advisor:** Student will be matched with a CS faculty member based on their interests and availability
2. **Student → Classes:** Students will be matched with a list of classes to take and what order based on their prerequisites.
3. **Student → Clubs:** Students will be matched to clubs and events that are upcoming.
4. **Student → Student:** Once we have multiple users on the app, we can start matching students with other students looking for a mentor, study partner, etc.

![](https://live.staticflickr.com/65535/54131410331_69502daa67_c.jpg)

## Table of Contents

- [LAEP LLM](#laep-llm)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)

## Requirements

- Node JS
- npm
- [Create Open AI account](https://platform.openai.com/signup/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- [Firebase Account](https://firebase.google.com/)

## Installation

1. **Clone the repository**

   ```
   git clone https://github.com/Castro19/LAEP-GPT.git
   ```

2. **Install client & server dependencies**
   In the root directory `LAEP-GPT` enter the following:

   ```
   npm run install:all
   ```

3. **Install Dependencies for root directory**
   In the root directory `LAEP-GPT` enter the following:

   ```
   npm install
   ```

4. **Configure Firebase:**

- Go to your [firebase console](https://console.firebase.google.com/u/0/)

  - Click `add project`
  - Follow their guidelines

- Once you create your project, a config file should be ready for you.

- **Client Firebase Setup:**

  - In your newly created Firebase project, click on the left sidebar for the option of `Project Settings`.
  - Scroll down until you are at the `Your Apps section` where you will `Add app`
  - Select the web with </> symbols. Click
  - Here you should get the `SDK setup and configuration`
  - Copy your firebaseConfig options.

- Now that you have your firebase configuration file, go into the `client/sample.env` and update the changes here.

- Finally rename `sample.env` to be `.env`

- **Server Firebase Setup:**

  - In project settings, click on the `Service Accounts` tab.
  - Click `Generate new private key`
  - A JSON file will be downloaded.
  - Move this JSON file into the path `server/helpers/firebase`
  - Rename the file to be `laep-firebase.json`

5. **Get your Open AI API key from [Open AI API Key](https://platform.openai.com/account/api-keys)**:

   - Go into the `server/sample.env` file and set the variable `OPENAI_API_KEY` to the OpenAI key.

6. **Configure MongoDB Compass:**

- Setup MongoDB on MongoDB Atlas

- Go into the `server/sample.env` file and set the variable `ATLAS_URI` to the URI for your MongoDB database.

- Finally rename `sample.env` to be `.env`

## Usage

1. **Start the client and server concurrently**

   ```
   npm start
   ```

## License

To be updated.
