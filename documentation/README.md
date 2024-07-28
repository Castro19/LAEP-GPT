# LAEP Chatbot for Senior Projects

## Table of Contents

- [LAEP Chatbot for Senior Projects](#laep-chatbot-for-senior-projects)
  - [Table of Contents](#table-of-contents)
  - [Project Introduction](#project-introduction)
    - [Overview](#overview)
    - [Project Goals](#project-goals)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
      - [1. Git](#1-git)
      - [2. Node.js and npm](#2-nodejs-and-npm)
      - [3. Express.js](#3-expressjs)
      - [4. MongoDB](#4-mongodb)
      - [5. OpenAI API](#5-openai-api)
      - [6. React](#6-react)
      - [7. Redux](#7-redux)
      - [8. React Router](#8-react-router)
      - [9. Tailwind CSS](#9-tailwind-css)
      - [10. ShadCN UI](#10-shadcn-ui)
      - [11. Aceternity UI](#11-aceternity-ui)
      - [12. Visual Studio Code (Optional)](#12-visual-studio-code-optional)
    - [Project Structure](#project-structure)
    - [Explanation of Structure](#explanation-of-structure)
      - [Client (Front end)](#client-front-end)
      - [Server (Back-end)](#server-back-end)
  - [Frontend Documentation](#frontend-documentation)
    - [Routing](#routing)
      - [Setting up a new Route](#setting-up-a-new-route)
      - [Component Wrappers Explanation](#component-wrappers-explanation)
      - [ProtectedRoute Explanation](#protectedroute-explanation)
      - [Layout Explanation](#layout-explanation)
    - [Components](#components)
    - [Redux](#redux)
      - [1. Overview of Redux](#1-overview-of-redux)
      - [2. Store Configuration](#2-store-configuration)
      - [3. Slices](#3-slices)
      - [4. Initial State](#4-initial-state)
      - [5. Actions:](#5-actions)
      - [6. Reducers: Most important Redux Concept](#6-reducers-most-important-redux-concept)
      - [7. Extra Reducers and Async Thunks:](#7-extra-reducers-and-async-thunks)
      - [8. Connecting Redux to React](#8-connecting-redux-to-react)
      - [9. Selectors](#9-selectors)
      - [10. Dispatch](#10-dispatch)
      - [11. Best Practices:](#11-best-practices)
    - [Auth Slice](#auth-slice)
      - [Auth Selector to access the Auth State](#auth-selector-to-access-the-auth-state)
      - [Dispatching Auth Actions](#dispatching-auth-actions)
      - [Thunks for Authentication](#thunks-for-authentication)
      - [Auth Error Handling](#auth-error-handling)
    - [Gpt Slice (Assistants)](#gpt-slice-assistants)
      - [Gpt Selector to Access the Gpt State](#gpt-selector-to-access-the-gpt-state)
      - [Dispatching Gpt Actions](#dispatching-gpt-actions)
      - [Gpt Asynchronous Thunks](#gpt-asynchronous-thunks)
      - [Gpt Handling Errors](#gpt-handling-errors)
    - [Layout Slice](#layout-slice)
      - [Layout State Selectors](#layout-state-selectors)
      - [Layout Actions](#layout-actions)
      - [Reducers in Layout Slice](#reducers-in-layout-slice)
      - [Handling UI States](#handling-ui-states)
    - [Log Slice](#log-slice)
      - [Log Selector to Access the Log State](#log-selector-to-access-the-log-state)
      - [Dispatching Log Actions](#dispatching-log-actions)
      - [Chat Log Handling Reducers](#chat-log-handling-reducers)
      - [Chat Log Error Handling](#chat-log-error-handling)
    - [Message Slice](#message-slice)
      - [Message Selector to Access the Message State](#message-selector-to-access-the-message-state)
      - [Dispatching Message Actions](#dispatching-message-actions)
      - [Meassage Handling Reducers](#meassage-handling-reducers)
      - [Message Error Handling](#message-error-handling)
    - [Types](#types)
      - [Types in application](#types-in-application)
    - [UI Component Libraries](#ui-component-libraries)
    - [Styling](#styling)
      - [Instructions using CSS Modules](#instructions-using-css-modules)
      - [Pointers for CSS:](#pointers-for-css)
  - [Backend Documentation](#backend-documentation)
    - [Server Setup](#server-setup)
    - [Express Routes](#express-routes)
      - [API Endpoints](#api-endpoints)
    - [Integration with OpenAI API](#integration-with-openai-api)
      - [Assistants](#assistants)
      - [**How to create an Assistant**:](#how-to-create-an-assistant)
      - [Threads](#threads)
    - [Integration with MongoDB](#integration-with-mongodb)
      - [Benefits of This Approach](#benefits-of-this-approach)
      - [Instructions](#instructions)
  - [Database Documentation](#database-documentation)
    - [Database Used](#database-used)
    - [Collections](#collections)
      - [chatLogs](#chatlogs)
      - [gpts](#gpts)
      - [threads](#threads-1)
      - [users](#users)
    - [Schema Definitions](#schema-definitions)
      - [chatLogs Schema](#chatlogs-schema)
      - [gpts Schema](#gpts-schema)
      - [threads Schema](#threads-schema)
      - [users Schema](#users-schema)
  - [Contribution Guidelines](#contribution-guidelines)
    - [Coding Standards](#coding-standards)
      - [**Prettier Configuration:** Prettier is used to format our code.](#prettier-configuration-prettier-is-used-to-format-our-code)
      - [ESLint Configuration: Client](#eslint-configuration-client)
      - [ESLint Configuration: Server](#eslint-configuration-server)
    - [How to Contribute](#how-to-contribute)
      - [Contribution Important Note](#contribution-important-note)
  - [Additional Resources](#additional-resources)
    - [Github Desktop or Tower (Optional but strongly recommended)](#github-desktop-or-tower-optional-but-strongly-recommended)
    - [MongoDB Compass](#mongodb-compass)
    - [Browser: Firefox Developer Edition](#browser-firefox-developer-edition)
      - [Firefox Chrome Extensions (Very helpful)](#firefox-chrome-extensions-very-helpful)
    - [VSCode Extensions](#vscode-extensions)
      - [Installation Instructions](#installation-instructions)
    - [Contact](#contact)
  - [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
    - [Common Issues and Solutions](#common-issues-and-solutions)

## Project Introduction

### Overview

- Directed under the supervision of Prof. Franz J. Kurfess, this project is part of the Computer Science department at California Polytechnic State University, San Luis Obispo.
- It is an open-source repository intended to aid students with their senior projects.
- By leveraging advanced AI capabilities, this project aims to streamline the process of assisting students with their senior project proposals, matching them with advisors, and enhancing the overall senior project experience.

### Project Goals

1. **Develop a responsive and intuitive chatbot**:

   - **Description:** Assist students and advisors by leveraging the OpenAI API for advanced conversational capabilities.
   - **Chat Context**: Using the `Assistant API`, every chat log is associated with a `thread Id`, allowing users to continue their conversation with the context from their previous messages.
   - **Streaming** Messages are continuously streamed out to the user, and responses are styled in Markdown format, which is converted into HTML.
   - **Styling Libraries:**
     - **MarkdownIt:** A Markdown parser that converts Markdown text into HTML. It supports a variety of Markdown features and can be extended with plugins for additional functionality.
     - **DOMPurify:** A library that sanitizes HTML and prevents XSS (Cross-Site Scripting) attacks by cleaning up the HTML generated from MarkdownIt, ensuring that only safe and allowed HTML elements and attributes are rendered.
   - **Progress:** Finished

2. **Design an easy-to-navigate interface**:

   - Ensure the interface is accessible to all students at Cal Poly.
   - Enhance usability to support efficient navigation and interaction.
   - **Progress**: In progress.
     - Most features are currently working. However, new features need to be integrated seamlessly to maintain accessibility.

3. **User Authentication**:

   - Users will need to sign-in and view their specific chat history and continue a chat where they left off.
     - After user is logs on, they are presented with a list of all their chat logs that were fetched from the MongoDB database.
   - **Firebase** is currently being used to authenticate users by E-mail and password and by Google sign on.
   - **Change approach to**: Only Allow only Cal Poly students to register for the application using their school Outlook email.
     - Verify student status through email domain checks and integrate with university authentication systems if possible.
     - Ensure secure storage and handling of user credentials.
   - **Progress**: In progress.
     - Basic authentication setup is in place, but further integration with Cal Poly's email verification and authentication systems is needed.

4. **Access Control**:

   - Users will need to be assigned permissions based on their current role/entity.
   - Application will need to decide between `RBAC` and `EBAC` to assign permssions to users.
   - Users will be able to grant permissions to other users to read/write to their chat log
   - Only allow specific users the power to create assistants
   - **Progress**: Not yet started

5. **Create custom assistants for professors**:

   - Provide tailored responses based on the professor's expertise.
   - Enable students to ask questions and receive personalized assistance.
   - **Progress**: Finished
     - There is a page that easily allows creation of assistants through submitting a form.
     - Minor tweaks needed for scalability issues.

6. **Help match students and advisors**:

   - Analyze interests, availability, and previous projects to facilitate matches.
   - Streamline the process of finding advisors for senior projects.
   - **Progress**: In progress.
     - Need to store user information such as interests, availability, previous projects, etc.
     - Following this, create the action function in `Assistant API` to match students with advisors.

7. **Analyze senior project proposals**:

   - Identify any missing sections or readiness for submission.
   - Ensure students receive comprehensive feedback on their proposals.
   - Use action functions in `Assistant API` to run scripts analyzing senior project proposals.
   - **Progress**: Not started
     - Assistant API foundation is there, but the action function has yet to be started.

8. **Guide students on class registration**:

   - Provide information on how to register for classes requiring instructor consent, such as senior projects or CSC 400.
   - Assist students in navigating the registration process smoothly.
   - **Progress**: In progress.
     - The foundation is there to create an assistant specializing in helping students register for these classes. Work is ongoing on prompt engineering to provide clear and concise instructions, and continuously update the prompt with recent information.

9. **Create collaborative chat environments**:

   - Develop chat functionality where multiple users can participate in the same conversation.
   - Allow students and advisors to share chats and collaborate effectively.
   - **Progress**: Not started.
     - The foundation is there, with each chat log having a unique ID. This ID can be shared with other users and grant them permissions using Role-based Access Control for read/write access.

10. **Integrate the chatbot with Slack**:

    - Enable seamless communication within the Slack platform.
    - Facilitate interactions between students and professors through Slack notifications.
    - **Progress**: Not started.

11. **Implement a message flagging system**:

    - Allow students to flag chatbot responses for further review by a professor.
    - Ensure accurate and verified information is provided by involving professors in the review process.
    - **Progress**: Not started.

## Getting Started

### Prerequisites

Before you begin working on the Chatbot AI project, ensure you have the following prerequisites installed and set up. These tools and technologies are essential for developing, testing, and deploying the project.

#### 1. Git

Git is a version control system to manage and track code changes.

- [Download Git](https://git-scm.com/downloads)
- [Git Documentation](https://git-scm.com/doc)

#### 2. Node.js and npm

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. npm is the package manager for Node.js.

- [Download Node.js](https://nodejs.org/en/download/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [npm Documentation](https://docs.npmjs.com/)

#### 3. Express.js

Express.js is a web application framework for Node.js.

- [Express.js Documentation](https://expressjs.com/)

#### 4. MongoDB

MongoDB is a NoSQL database for storing the project data.

- [Download MongoDB](https://www.mongodb.com/try/download/community)
- [MongoDB Documentation](https://docs.mongodb.com/manual/)
- [MongoDB MERN Stack Example](https://github.com/mongodb-developer/mern-stack-example)

#### 5. OpenAI API

OpenAI provides the API for integrating AI capabilities into the project.

- [OpenAI API Documentation](https://beta.openai.com/docs/)

  - [OpenAI Assistants](https://platform.openai.com/docs/assistants/overview)
    - [OpenaAI Threads](https://platform.openai.com/docs/assistants/how-it-works/managing-threads-and-messages)

- [Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering/six-strategies-for-getting-better-results)

- [Function Calling](https://platform.openai.com/docs/guides/function-calling)

#### 6. React

React is a JavaScript library for building user interfaces.

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Repo of my React Tutorials](https://github.com/Castro19/Learning-Front-End-Tools)

#### 7. Redux

Redux is a state management library for JavaScript apps.

- [Redux Documentation](https://redux.js.org/introduction/getting-started)
- [Redux Tutorial](https://www.youtube.com/watch?v=5yEG6GhoJBs&t=910s&ab_channel=CosdenSolutions)
  - [Redux Tutorial Repo](https://github.com/Castro19/Learning-Front-End-Tools/tree/main/redux-tutorial)

#### 8. React Router

React Router is a standard library for routing in React.

- [React Router Documentation](https://reactrouter.com/)
- [React Router Tutorial](https://www.youtube.com/watch?v=oTIJunBa6MA&ab_channel=CosdenSolutions)
  - [React Router Tutorial Repo](https://github.com/Castro19/Learning-Front-End-Tools/tree/main/react-router-tutorial)

#### 9. Tailwind CSS

Tailwind CSS is a utility-first CSS framework.

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

#### 10. ShadCN UI

ShadCN UI is a 3rd party UI component library.

- [ShadCN UI Documentation](https://ui.shadcn.com/docs)

#### 11. Aceternity UI

Aceternity UI is another 3rd party UI component library.

- [Aceternity UI Documentation](https://ui.aceternity.com/components)

#### 12. Visual Studio Code (Optional)

Visual Studio Code is a source-code editor that includes support for development operations.

- [Download Visual Studio Code](https://code.visualstudio.com/)
- [Visual Studio Code Documentation](https://code.visualstudio.com/docs)

### Project Structure

```
/LAEP-GPT
  /Client:
    /src
      /components
        /chat
          /helper
            formatHelper.ts
          ChatContainer.tsx
          ChatInput.tsx
          ChatMessage.tsx
          index.tsx
          NewChat.tsx
        /chatLog
          ChatLog.tsx
          /deleteLog
            DeleteLog.tsx
            DeleteLog.module.css
        /customGPT
          CreateGptForm.tsx
          ModeDropDown.tsx
          /customGptCard
            CustomGptCard.tsx
            CustomGptCard.module.css
          /GPTContainer
            ...
          /GPTList
            ...
        /layout
          Header.tsx
          Footer.tsx
          /gpt
            GPTHeader.tsx
            GPTLayout.tsx
          /sidebar
            Sidebar.tsx
            Sidebar.module.css
        /register
          ErrorMessage.tsx
          TitleCard.tsx
          /registerSettings
            RegisterCheckbox.tsx
            RegisterSettingForm.tsx
        /security
          ProtectedRoute.tsx
        /ui
          ...
        /userProfile
          userMenu.tsx
          userAvatar.tsx
      /firebase
        auth.ts
      /pages
        /customGPT
        /ErrorPage
        /register
        ChatPage.tsx
      /redux
        /auth
          authSlice.ts
          crudAuth.ts
        /message
          crudMessage.ts
          messageSlice.ts
        /gpt
          crudGPT.ts
          gptSlice.ts
        /layout
          layoutSlice.ts
        /log
          crudLog.ts
          logSlice.ts
        index.ts
        store.ts
      /types
        /auth
        /gpt
        /layout
        /log
        /message
        index.ts
      main.tsx
  /server
    /db
      connection.js
      /models
        /chatLog
          chatLogCollection.js
          chatLogServices.js
        /gpt
          gptCollection.js
          gptServices.js
        /threads
          threadCollection.js
          threadServices.js
        /user
          userCollection.js
          userServices.js
    /helpers/openAI
      assistantFunctions.js
      threadFunctions.js
    /routes
      chatLog.js
      gpt.js
      llm.js
      user.js
    index.js
```

---

### Explanation of Structure

#### Client (Front end)

- **/Client/src/components**

  - **/chat**: Components related to chat interface.
    - **/helper/formatHelper.ts**: Helpers for formatting ChatInput.
    - **ChatContainer.tsx**: Container for chat components.
    - **ChatInput.tsx**: Handles user input and dispatches actions for OpenAI API.
    - **ChatMessage.tsx**: Displays individual chat messages.
    - **index.tsx**: Exports chat components.
    - **NewChat.tsx**: Initiates a new chat.
  - **/chatLog**: Components for chat logs.
    - **ChatLog.tsx**: Displays list of chat logs.
    - **/deleteLog**: Components for deleting chat logs.
      - **DeleteLog.tsx**: Button to delete a chat log.
      - **DeleteLog.module.css**: Styles for delete button.
  - **/customGPT**: Components for custom GPT assistants.
    - **CreateGptForm.tsx**: Form to create new assistants.
    - **ModeDropDown.tsx**: Dropdown to select assistants.
    - **/customGptCard**: Components for displaying assistant cards.
      - **CustomGptCard.tsx**: Displays individual assistant card.
      - **CustomGptCard.module.css**: Styles for assistant card.
    - **/GPTContainer**: Container for GPT components.
    - **/GPTList**: Lists all assistants.
  - **/layout**: Layout components.
    - **Header.tsx**: Header component.
    - **Footer.tsx**: Footer component.
    - **/gpt**: Layout for GPT-related components.
      - **GPTHeader.tsx**: Header for GPT sections.
      - **GPTLayout.tsx**: Layout for GPT sections.
    - **/sidebar**: Sidebar components.
      - **Sidebar.tsx**: Sidebar with user info and chat logs.
      - **Sidebar.module.css**: Styles for sidebar.
  - **/register**: Registration components.
    - **ErrorMessage.tsx**: Displays registration errors.
    - **TitleCard.tsx**: Title card for registration.
    - **/registerSettings**: Additional registration settings.
      - **RegisterCheckbox.tsx**: Checkbox for settings.
      - **RegisterSettingForm.tsx**: Form for additional settings.
  - **/security**: Security components.
    - **ProtectedRoute.tsx**: Redirects users based on registration status.
  - **/ui**: Third-party UI components.
  - **/userProfile**: User profile components.
    - **userMenu.tsx**: User menu.
    - **userAvatar.tsx**: User avatar.

- **/firebase**

  - **auth.ts**: Firebase authentication setup.

- **/pages**

  - **/customGPT**: Custom GPT pages.
  - **/ErrorPage**: Error page.
  - **/register**: Registration page.
  - **ChatPage.tsx**: Chat page.

- **/redux**

  - **/auth**: Authentication state management.
    - **authSlice.ts**: Auth reducers and actions.
    - **sendUser.ts**: Sends user info to backend.
  - **/chat**: Chat state management.
    - **handleMessage.ts**: Handles sending messages to OpenAI.
    - **messageSlice.ts**: Chat reducers and actions.
  - **/gpt**: GPT state management.
    - **crudGPT.ts**: CRUD operations for assistants.
    - **gptSlice.ts**: GPT reducers and actions.
  - **/layout**: Layout state management.
    - **layoutSlice.ts**: Layout reducers and actions.
  - **/log**: Log state management.
    - **crudLog.ts**: CRUD operations for logs.
    - **logSlice.ts**: Log reducers and actions.
  - **index.ts**: Custom hooks and action imports.
  - **store.ts**: Redux store configuration.

- **/types**

  - **/auth**: Auth types.
  - **/gpt**: GPT types.
  - **/layout**: Layout types.
  - **/log**: Log types.
  - **/message**: Message types.
  - **index.ts**: Index of types.

- **main.tsx**: Root of the client, sets up React Router.

#### Server (Back-end)

- **/server/db**

  - **connection.js**: Establishes connection to MongoDB.
  - **/models**: Contains collections and services for different data models.
    - **/chatLog**
      - **chatLogCollection.js**: Directly interacts with the chat log collection in MongoDB.
      - **chatLogServices.js**: Calls functions from chatLogCollection and is used by routes.
    - **/gpt**
      - **gptCollection.js**: Directly interacts with the GPT assistant collection in MongoDB.
      - **gptServices.js**: Calls functions from gptCollection and is used by routes.
    - **/threads**
      - **threadCollection.js**: Directly interacts with the thread collection in MongoDB.
      - **threadServices.js**: Calls functions from threadCollection and is used by routes.
    - **/user**
      - **userCollection.js**: Directly interacts with the user collection in MongoDB.
      - **userServices.js**: Calls functions from userCollection and is used by routes.

- **/server/helpers/openAI**

  - **assistantFunctions.js**: Helper functions for creating and deleting assistants.
  - **threadFunctions.js**: Helper functions for managing OpenAI threads.

- **/server/routes**

  - **chatLog.js**: Routes for CRUD operations on chat logs.
  - **gpt.js**: Routes for CRUD operations on assistants.
  - **llm.js**: Routes for interactions with OpenAI.
  - **user.js**: Routes for user signup and management.

- **index.js**: Main server file, sets up routes, middleware, and configures OpenAI.

## Frontend Documentation

### Routing

- **React Router**: This tool helps us create navigation between different parts of our application, like moving from one page to another, in a smooth and dynamic way.

  - [**Outlet**](https://reactrouter.com/en/main/components/outlet): The `Outlet` component is used to render the child routes inside a parent route. It acts as a placeholder where the nested routes will be displayed.

#### Setting up a new Route

- Follow these steps to set up a new route in react App using react router

  - This new route will represent a new page in our react application.

1. Locate `Client/main.tsx`

- In this file you will see the route being defined like this:

- This is where you will define your new route, we will hold off on this part for now

  ```typescript
    const router = createBrowserRouter([
    {
      path: "/",
      element: <Register />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Navigate to="signup" replace /> },
        { path: "signup", element: <SignupFormDemo /> },
        { path: "login", element: <LoginFormDemo /> },
        { path: "settingForm", element: <AddInfoForm /> },
      ],
    },
    ... # More routes here

    ])
  ```

2. Locate `Client/src/pages`

- In this folder, we will define our page component

  - This page component will be where our route is directed to

- Create a new Page component in this folder (e.g. `GPTPage.tsx`)

3. Create the page component in here

   ```typescript
   import { Outlet } from "react-router-dom";

   import GPTContainer from "../../components/customGPT/GPTContainer/GPTContainer";

   const GPTPage = () => {
     return (
       <div>
         <GPTContainer />
       </div>
     );
   };

   export default GPTPage;
   ```

- We imported a container component that will have the components we need

  - I usually set this up at the end once I know that my routing is working as expected.

    - You could replace `<GPTContainer />` with `<div>Page working</div>` to begin

4. Set up the route in `main.tsx`

- 4a. Import the page component at the top of the file:

  ```typescript
  import GPTPage from "./pages/customGPT/GPTPage.js";
  ```

- 4b. Define the route in the list of routes we currently have.
  ```typescript
  ...
  ,{
    path: "/:userId/gpts",
    element: (
      <ProtectedRoute>
        <GPTLayout>
          <GPTPage />
        </GPTLayout>
      </ProtectedRoute>
    ),
  },
  ```
  - Notice how we have wrappers `ProtectedRoute` and `GPTLayout`.
    - [ProtectedRoute Explanation](#protectedroute-explanation)
    - [GPTLayout Explanation](gptlayout-explanation)

5. Setup the navigation to this component

- In other components, we setup navigation to our newly created route using `useNavigate`

- 5a. Import the library in the component file you want to have navigation in (e.g. `Client/src/components/customGPT/ModeDropDown.tsx`)

  ```typescript
  import { useNavigate } from "react-router-dom";
  ```

- 5b. Assign navigate
  ```typescript
  const navigate = useNavigate();
  ```
- 5c. Create an `onClick` function (or something similar that will navigate to our route when an event takes place e.g. A button is clicked)

  ```typescript
  const onViewGPTs = () => {
    navigate(`/${userId}/gpts`);
  };
  ```

- 5d. Assign the `onClick` function

  ```typescript
  <button onClick={onViewGPTs} className="">
    View more Assistants
  </button>
  ```

- When a user clicks on this button they will now be directed to our new Page we created in step 3

#### Component Wrappers Explanation

- Component wrappers are higher-order components `(HOCs)` that wrap other components to provide additional functionality or layout structure.

  - In the context of routing, they are used to enhance routes with specific behaviors or layouts.

#### ProtectedRoute Explanation

- The `ProtectedRoute` component ensures that only authenticated users can access certain routes. It checks the authentication status and redirects users to the login page if they are not logged in, or to the appropriate user-specific route if the user ID in the URL does not match the logged-in user.

  - If you find your new route automatically being directed back to the homepage, try modifying the file `Client/src/security/ProtectedRoute.tsx`

#### Layout Explanation

- The `GPTLayout` component is a layout wrapper that provides a consistent structure for pages, including headers, sidebars, and other common elements.

  - It allows the entire page to shift over when the sidebar is toggled

---

### Components

- **React JS**: A library that allows us to build the user interface of our application using reusable and self-contained pieces called components. Each component can manage its own state and behavior.

- When creating a new component that is not a Page component, make sure it is created in the `Client/src/components` folder.

  - In this folder, notice how there are subfolders that relate to different features of the application. Place your component in one of these folders or create a new folder if none of them relate to your component

- [Go To the Folder structure](#client-front-end)

---

### Redux

#### 1. Overview of Redux

- **Redux**: A state management tool that helps us keep track of the entire application's state in a predictable and centralized way. This makes it easier to manage and debug the state of our app.
- **Benefits**: Centralized state management, easier debugging, predictable state transitions, and improved testability.

#### 2. Store Configuration

- **Purpose**: The Redux store holds the complete state tree of the application.
- **Configuration**: The `store` is configured in the file: `Client/src/redux/store.ts`
- **Example**: Create a Redux store with configureStore, providing the messageReducer to handle the message slice of the state. This is how we will be able to access the state and reducers.

  ```typescript
  import { messageReducer } from "./chat/messageSlice";

  const store = configureStore({
    reducer: {
      message: messageReducer,
      // other reducers added here
    },
  });
  // Used for TypeScript Types
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  ```

#### 3. Slices

- **Purpose**: Define a slice of state relating to the Redux reducer logic and actions for a feature of the application.
- **Configuration**: Redux Toolkit `createSlice` function simplifies the process of writing redux logic by `combining actions and reducers in one place`.
- **Example**:

  ```typescript
  const logSlice = createSlice({
    name: "log",  // Name of the slice
    initialState, // Initial state for the slice
    reducers: {
     // Reducers go here
    },
    extraReducers: (builder) => {
    builder
    ...
    },
  })
  ```

- **Initial State:** The initialState object defines the default state for the slice. In this example, it has a logList array to hold log entries.

- **Reducers:** The reducers field in createSlice is an object where each key is a reducer function name and the value is the reducer function itself.

  - **addLogList:** This reducer adds a new log entry to the logList array. It takes a PayloadAction<LogData> which contains the new log data.

#### 4. Initial State

- **Definition**: The `initialState` object defines the default state for the slice. Here, logList is an array that will hold log entries of type LogData.
- **Example**:

  ```typescript
  type LogSliceType = {
    logList: LogData[];
  };
  const initialState: LogSliceType = {
    logList: [],
  };
  ```

#### 5. Actions:

- **Definition**: Actions are payloads of information that send data from your application to your Redux store. They describe what happened in your app.
- **Action Creators**: Actions in Redux Toolkit are defined within a slice using `createSlice`. The slice automatically generates action creators for each reducer function.
- **PayloadAction**: In Redux, using `typescript` we specify the type of data passed as the action like this: `PayloadAction<LogData>` where the `LogData` is a type we created.

#### 6. Reducers: Most important Redux Concept

- **Definition**: Reducers specify `how the application's state changes in response to actions sent to the store`.
  - They are [pure functions](https://www.tutorialspoint.com/redux/redux_pure_functions.htm) that take the previous state and an action as arguments and return a new state.
- **Usage in Redux Toolkit**: We are creating the reducers when we use `createSlice` in the `reducers` property.
  - Each reducer function handles a single action type, taking the current state and an action as arguments and returning a new state
- **Example**:

  ```typescript
      const logSlice = createSlice({
        name: "log",  // Name of the slice
        initialState, // Initial state for the slice
        reducers: {
          // Reducer to add a new log to the state (CREATE)
          addLogList: (state, action: PayloadAction<LogData>) => {
            const { id, title, content, timestamp, urlPhoto } = action.payload;
            const newLog = {
              id: id,
              content: [...content], // Use the content passed in the action
              title: title,
              timestamp: timestamp, // Use the timestamp passed in the action
              urlPhoto,
            };

            state.logList.push(newLog);
          },
        },
        extraReducers: (builder) => {
        builder
        ...
        },
      })
  ```

#### 7. Extra Reducers and Async Thunks:

**_Async Thunks_**

- **Definition**: Async Thunks are a middleware for Redux that allow you to perform asynchronous operations (e.g., API calls)

  - In these functions, you can dispatch actions based on the results of those async operations. They help in handling side effects in Redux applications.

- **Usage**: Async Thunks are created using the `createAsyncThunk` function from Redux Toolkit. This function takes a string action type and a payload creator callback that performs the async logic and returns a promise.
- **Example**: Fetch the chatLogs from the databse

  ```typescript
  // Read (Fetch Logs by UserID)
  export const fetchLogs = createAsyncThunk(
    "log/fetchLogs",
    async (userId: string, { rejectWithValue }) => {
      try {
        return await fetchAllLogs(userId);
      } catch (error) {
        console.error("Failed to fetch logs: ", error);
        return rejectWithValue(logErrorMessages[LogErrorCodes.READ_FAILED]);
      }
    }
  );
  ```

  - `fetchAllLogs` is a helper function that will make the client-side request and fetch the associated chat logs from our mongo db database

**_Extra Redcuers_**:

- **Definition:** Extra reducers allow a slice to handle actions defined outside of the slice itself, such as actions generated by async thunks. They are defined using the `extraReducers` field in the `createSlice` function.
- **Usage:** Extra reducers are specified using a builder callback function, which provides methods to handle different action types (`pending`, `fulfilled`, `rejected`) generated by async thunks.
- **Example**:

  ```typescript
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.logList = action.payload;
      })
      .addCase(fetchLogs.rejected, (_state, action) => {
        console.error('Failed to load logs:', action.payload);
      });
    // More builders assigned here
    builder
      .addCase(...)
  },
  ```

#### 8. Connecting Redux to React

- In the file: `Client/src/redux/index.ts`:

  a. Our reducers and actions are defined for `modular access`

  ```typescript
  // Export all reducers for modular access
  export { messageReducer } from "./chat/messageSlice";
  // More reducers here

  // Export all actions for easy dispatching in components
  export * as messageActions from "./chat/messageSlice";
  // More actions defined here
  ```

  b. Defined Custom Hooks `useAppSelector` and `useAppDispatch` to get type safety and autocompletion with typescript

  - **Best Practices**: For this application, make sure to export reducers and actions for modular access when creating a new Redux slice.

#### 9. Selectors

- **Definition**: Selectors allow you to `read` data from the global redux store.
- **Purpose**: They encapsulate the state structure & provide easy access to specific parts of the state.
- **Usage in Redux Toolkit**: In this application, we can use the custom hook created `useAppSelector` to access the data in the store
  - This also allows us to have auto-completion!
- **Example**:
  ```typescript
    import { useAppSelector, useAppDispatch } from "@/redux";
    ...
    const Sidebar = () => {
      const logList = useAppSelector((state) => state.log.logList);
      ...
    }
  ```

#### 10. Dispatch

- **Definition**: In redux, we `dispatch` actions and assign `payloads` (input) in our components.
  - This causes the UI to update based on the action we dispatch and the payload data we assign to it.
- **Purpose**: Update the UI in a predictable way, where UI changes when an action is `dispatched`.
- **Usage in Redux Toolkit**: Use the custom hook `useAppDispatch` in our components and assing the action we want to dispatch & its payload value
- **Example**: Dispatch the action that will fetch the logs

  ```typescript
    import { useAppSelector, useAppDispatch, logActions } from "@/redux";
    ...
    const Sidebar = () => {
      useEffect(() => {
        // Only fetch logs if userId is not null (user is signed in)
        console.log("USERID: ", userId);
        if (userId) {
          dispatch(logActions.fetchLogs(userId));
        }
      }, [dispatch, userId]);
        ...
    }
  ```

  - In this example, we are using the actions from `logActions` to fetch the logs by `userId`.
  - The `userId` is the payload value and the `fetchLogs` is the action being dispatched

#### 11. Best Practices:

- **File Organization**: For every slice, it should be stored in its own separate sub folder in the path `Client/src/redux/`.
  - In this subfolder, we will have the `${feature}Slice`.ts file and an optional helper file that will have functions that do the majority of the logic (e.g. `Crud operations that make the client-side requests`)
- **Maintainability**:
  - Try to keep the logic in the helper files and the actual reducer functions should be kept as short as possible.
  - When possible, seperate logic by their CRUD Operations.
    - The file for `logSlice.ts` is a perfect example of how we can do this.

---

### Auth Slice

#### Auth Selector to access the Auth State

- **currentUser**: An object that contains the information for our current User

  - **Example**:

    ```json
    {
      "providerId": "google.com",
      "uid": "106582989982319233", // Ignore this
      "displayName": "Cristian Castro",
      "email": "Cristian@example.com",
      "phoneNumber": null,
      "photoURL": "https:/fake-profile-photo.com"
    }
    ```

  - **Access with Selector**:

    ```typescript
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    ```

- **userId**: The firebase user id associated with the logged in user

  - **Access with Selector**:

    ```typescript
    const userId = useAppSelector((state) => state.auth.userId);
    ```

- **userLoggedIn**: A boolean value on whether the user is currently logged in or not

  - **Access with Selector**:

    ```typescript
    const userLoggedIn = useAppSelector((state) => state.auth.userLoggedIn);
    ```

- **isEmailUser**: A boolean value on if the user signed up with email and password. If it is false, then they are a google user or they are not currently logged in.

  - **Access with Selector**:

    ```typescript
    const isEmailUser = useAppSelector((state) => state.auth.isEmailUser);
    ```

- **loading**: A boolean value for when a user is registering (login/signup). The short period of time after user enters credentials and before they are granted access to their account

- **registerError**: A string, that displays the error message when registering such as invalid credentials.

- **Access multiple store values from `auth`**:

  ```typescript
  const { userLoggedIn, registerError, loading, userId } = useAppSelector(
    (state) => state.auth
  );
  ```

#### Dispatching Auth Actions

1. **setAuthState**

   Dispatch this action to update the user's authentication status and details after a successful login.

   ```typescript
   dispatch(
     setAuthState({
       currentUser: user.providerData[0],
       userId: user.uid,
       userLoggedIn: true,
       isEmailUser: isEmailUserDeterminedFromProviderData,
     })
   );
   ```

- **currentUser**: UserInfo object representing the user.
- **userId**: User's unique identifier from Firebase.
- **userLoggedIn**: Boolean indicating the user is now logged in.
- **isEmailUser**: Boolean indicating if the user logged in using email and password.

2. **clearAuthState**: Use this action to clear the authentication state, for example, during `signout`.

   ```typescript
   dispatch(clearAuthState());
   ```

3. **setLoading**: This action can be dispatched to control the visibility of loading indicators during async operations like signing in or signing up.

   ```typescript
   dispatch(setLoading(true)); // Set loading to true at the start of an operation
   dispatch(setLoading(false)); // Set loading to false once operation completes
   ```

4. **setSignInError**:

   ```typescript
   dispatch(
     setSignInError(
       "Failed to sign in. Please check your credentials and try again."
     )
   );
   ```

5. **setSignUpError**:

   ```typescript
   dispatch(setSignUpError("Failed to register. Email already in use."));
   ```

#### Thunks for Authentication

1. **listenToAuthChanges**

- Listens for authentication state changes (e.g., user logs in or out) and updates the Redux store accordingly.
- It ensures the UI components stay in sync with the current authentication state.

- **Usage**:
  ```typescript
  dispatch(listenToAuthChanges());
  ```

2. **signUpWithEmail**

- Handles the user registration process using email and password.
- It also initializes user profiles and logs any registration-specific data into the database.

- Parameters:

- **email**: User's email address.
- **password**: User's chosen password.
- **firstName**: User's first name.
- **lastName**: User's last name.

- **Usage**:

  ```typescript
  dispatch(signUpWithEmail({ email, password, firstName, lastName, userType }));
  ```

3. **signInWithEmail**:

- Manages user sign-in using email and password.
- It updates the Redux store with user details upon successful login.

- **Parameters**:

  - **email**: User's email address.
  - **password**: User's password.

- **Usage**:

  ```typescript
  dispatch(signInWithEmail({ email, password }));
  ```

4. **signInWithGoogle**:

- Facilitates user sign-in using Google as an authentication provider.

  ```typescript
  dispatch(signInWithGoogle());
  ```

#### Auth Error Handling

- Errors are captured and handled gracefully, updating the Redux state with appropriate error messages which can then be displayed to the user.
- Each thunk has `try...catch` blocks to handle exceptions and reject with a value when an error occurs.

  - This value updates the error state in the Redux store.

  ```typescript
    } catch (error) {
        if (error instanceof Error) {
          dispatch(setSignUpError(error.message));
        }
      }
  ```

### Gpt Slice (Assistants)

- This slice handles operations related to GPT models including creating, viewing, and deleting GPTs.

- Below are details on how to access and manipulate the GPT state using selectors and dispatching actions.

#### Gpt Selector to Access the Gpt State

- **currentModel**: The currently active GPT model.

  - **Access with Selector**:
    ```typescript
    const currentModel = useAppSelector((state) => state.gpt.currentModel);
    ```

- **gptList**: Array of all Assistants created and accessible to the user.

  - **Access with Selector**:
    ```typescript
    const gptList = useAppSelector((state) => state.gpt.gptList);
    ```

- **isLoading**: Boolean indicating if the current Assistant is being created.

  - **Access with Selector**:
    ```typescript
    const isLoading = useAppSelector((state) => state.gpt.isLoading);
    ```

- **error**: Error message from an assistant being created
  - **Access with Selector**:
    ```typescript
    const error = useAppSelector((state) => state.gpt.error);
    ```

#### Dispatching Gpt Actions

1. **addGpt**: Adds a new GPT model to the list.

   - **Dispatch Example**:
     ```typescript
     dispatch(
       addGpt({
         userId: "user123",
         title: "New GPT",
         urlPhoto: "https://example.com/newphoto.jpg",
         desc: "Description of the new GPT",
         instructions: "Instructions for using the new GPT",
       })
     );
     ```

2. **viewGpts**: Retrieves all GPT models.

   - **Dispatch Example**:
     ```typescript
     dispatch(viewGpts({ gptList }));
     ```

3. **deleteGpt**: Deletes a GPT model by ID.

   - **Dispatch Example**:
     ```typescript
     dispatch(deleteGpt({ id: "gpt123" }));
     ```

4. **initGptList**: Initializes the list of GPT models.

   - **Dispatch Example**:
     ```typescript
     dispatch(initGptList(gptList));
     ```

5. **setCurrentGpt**: Sets the currently active GPT model by ID.
   - **Dispatch Example**:
     ```typescript
     dispatch(setCurrentGpt("gpt123"));
     ```

#### Gpt Asynchronous Thunks

- This slice uses asynchronous thunks to handle database operations like creating and deleting GPTs.
- Thunks handle the asynchronous request and then dispatch actions based on the success or failure of the operation.

#### Gpt Handling Errors

- Errors during operations are handled by the slice and stored in the `error` state.
- Each action has error handling that updates this part of the state if an operation fails.

- **Error Handling in Thunks**: When a thunk fails, it dispatches an error action which updates the state with an error message.
  - **Example**:
    ```typescript
    if (error) {
      return rejectWithValue("Failed to perform operation");
    }
    ```

### Layout Slice

This slice manages UI layout states such as the visibility of sidebars and dropdowns. It provides a straightforward way to toggle UI components from anywhere within the application using Redux.

#### Layout State Selectors

- **isSidebarVisible**: Boolean indicating whether the sidebar is visible.

  - **Access with Selector**:
    ```typescript
    const isSidebarVisible = useAppSelector(
      (state) => state.layout.isSidebarVisible
    );
    ```

- **isDropdownVisible**: Boolean indicating whether any dropdowns are visible.
  - **Access with Selector**:
    ```typescript
    const isDropdownVisible = useAppSelector(
      (state) => state.layout.isDropdownVisible
    );
    ```

#### Layout Actions

- The following actions are available to control the state of UI components like sidebars and dropdowns.
- They are dispatched using the Redux toolkit's `dispatch` function.

1. **toggleSidebar**: Toggles the visibility of the sidebar based on a boolean value.

   - **Usage**:

     ```typescript
     // To open the sidebar
     dispatch(toggleSidebar(true));

     // To close the sidebar
     dispatch(toggleSidebar(false));
     ```

2. **toggleDropdown**: Toggles the visibility of dropdowns based on a boolean value.

   - **Usage**:

     ```typescript
     // To show a dropdown
     dispatch(toggleDropdown(true));

     // To hide a dropdown
     dispatch(toggleDropdown(false));
     ```

#### Reducers in Layout Slice

The layout slice includes reducers to manage the visibility of various UI components:

- **toggleSidebar**: This reducer updates the `isSidebarVisible` state to show or hide the sidebar.
- **toggleDropdown**: This reducer updates the `isDropdownVisible` state to show or hide dropdown components.

#### Handling UI States

- The use of boolean toggles in this slice provides a flexible and straightforward way to control the visibility of layout components, ensuring a responsive and interactive user interface.

### Log Slice

- This slice manages operations related to logs, such as adding, updating, fetching, and deleting logs.
  Below are details on how to access and manipulate the log state using selectors and dispatching actions.

#### Log Selector to Access the Log State

- **logList**: Array of all logs stored in the state.
- **Access with Selector**:
  ```typescript
  const logList = useAppSelector((state) => state.log.logList);
  ```

#### Dispatching Log Actions

1. **addLog**: Adds a new log entry.

   - **Dispatch Example**:
     ```typescript
     dispatch(
       addLog({
         msg: "User action performed",
         modelType: "ethical",
         id: "log123",
         firebaseUserId: "user123",
       })
     );
     ```

2. **fetchLogs**: Fetches all logs for a specific user.

   - **Dispatch Example**:
     ```typescript
     dispatch(fetchLogs("user123"));
     ```

3. **updateLog**: Updates a specific log entry.

   - **Dispatch Example**:
     ```typescript
     dispatch(
       updateLog({
         logId: "log123",
         firebaseUserId: "user123",
         content: content,
         timestamp: new Date().toISOString(),
       })
     );
     ```

4. **deleteLog**: Deletes a specific log entry.
   - **Dispatch Example**:
     ```typescript
     dispatch(
       deleteLog({
         logId: "log123",
         userId: "user123",
       })
     );
     ```

#### Chat Log Handling Reducers

- **addLogList**: Adds a new log to the log list in the state.

  - **Usage**:
    ```typescript
    dispatch(
      addLogList({
        id: "log123",
        title: "Log Title",
        content: content,
        timestamp: new Date().toISOString(),
      })
    );
    ```
  - The content is the `msgList`, structured like this:

    ```typescript
    msgList = [{ id: chatId, sender: "user", text: "Log content" }, ...]
    ```

- **updateCurrentChat**: Updates an existing log in the log list.

  - **Usage**:
    ```typescript
    dispatch(
      updateCurrentChat({
        id: "log123",
        content: [{ message: "Updated log content" }],
        timestamp: new Date().toISOString(),
      })
    );
    ```

- **deleteLogListItem**: Removes a log from the log list based on its ID.
  - **Usage**:
    ```typescript
    dispatch(deleteLogListItem({ logId: "log123" }));
    ```

#### Chat Log Error Handling

- Errors during operations are handled by the slice and updated in the `error` state part of each action.
- Each thunk has error handling that captures failures and updates the state with an error message, using `rejectWithValue`.

- **Example**:
  ```typescript
  if (error) {
    return rejectWithValue("Failed to perform operation");
  }
  ```

### Message Slice

- This slice handles operations related to messaging, such as fetching responses from a bot, managing message lists, and handling state related to chat interactions.
- Below are details on how to access and manipulate the message state using selectors and dispatching actions.

#### Message Selector to Access the Message State

- **msgList**: Array of all messages stored in the chat log.

  - **Access with Selector**:
    ```typescript
    const msgList = useAppSelector((state) => state.message.msgList);
    ```

- **currentChatId**: Identifier for the current chat log session.

  - **Access with Selector**:
    ```typescript
    const currentChatId = useAppSelector(
      (state) => state.message.currentChatId
    );
    ```

- **isNewChat**: Boolean indicating if the current chat session is new.

  - **Access with Selector**:
    ```typescript
    const isNewChat = useAppSelector((state) => state.message.isNewChat);
    ```

- **isLoading**: Boolean indicating if there is an ongoing operation. (e.g. The message is being streamed out)

  - **Access with Selector**:
    ```typescript
    const isLoading = useAppSelector((state) => state.message.isLoading);
    ```

- **error**: Error message from the latest operation if any.
  - **Access with Selector**:
    ```typescript
    const error = useAppSelector((state) => state.message.error);
    ```

#### Dispatching Message Actions

1. **fetchBotResponse**: Fetches a response from the bot based on the user message.

   - **Dispatch Example**:
     ```typescript
     dispatch(
       fetchBotResponse({
         currentModel: selectedModel,
         msg: "Hello, how can I help?",
         currentChatId: "chat123",
       })
     );
     ```

2. **setMsgList**: Sets the entire message list (typically used when a user selects a new chat).

   - **Dispatch Example**:
     ```typescript
     dispatch(
       setMsgList([
         {
           id: 1,
           model: "Normal",
           sender: "user",
           text: "Welcome to the chat!",
         },
       ])
     );
     ```

3. **resetMsgList**: Clears the message list. Occurs when a user clicks for a new chat.

   - **Dispatch Example**:

     ```typescript
     dispatch(resetMsgList());
     ```

4. **addUserMessage**: Adds a new message to the message list.

   - **Dispatch Example**:
     ```typescript
     dispatch(
       addUserMessage({
         id: 3,
         model: "Ethical",
         sender: "user",
         text: "User's new message",
       })
     );
     ```

5. **updateBotMessage**: Updates an existing bot message in the message list.

   - **Dispatch Example**:
     ```typescript
     dispatch(
       updateBotMessage({
         id: 4,
         urlPhoto: "https://example-photo.jpg",
         sender: "bot",
         text: "Updated bot response",
       })
     );
     ```

6. **clearError**: Clears any errors currently displayed on the chat container

   - **Dispatch Example**:
     ```typescript
     dispatch(clearError());
     ```

7. **setCurrentChatId**: Sets the current chat ID. This represents the logID of the chat log

   - **Dispatch Example**:
     ```typescript
     dispatch(setCurrentChatId("chat456"));
     ```

8. **toggleNewChat**: Toggles the state to indicate whether the chat is new or existing.
   - **Dispatch Example**:
     ```typescript
     dispatch(toggleNewChat(true));
     ```

#### Meassage Handling Reducers

- This slice contains several reducers to manage the state of messages in the application.
- The reducers handle creation, updates, and deletion of messages as well as managing metadata like chat IDs and loading states.

#### Message Error Handling

- Errors during operations are handled by the slice and updated in the `error` state part of each action.
- Each thunk has error handling that captures failures and updates the state with an error message, using `rejectWithValue`.

- **Error Example**:
  ```typescript
  if (error) {
    return rejectWithValue({ message: "Failed to perform operation" });
  }
  ```

### Types

- **TypeScript**: An enhanced version of JavaScript that introduces strong typing.

  - **Pros**: Type-safety, auto-completion, works well in teams

#### Types in application

- Types are declared in the `Client/src/types` directory

  - In this directory, we have subfolders that contain the files where we are creating the types.

  - The folder naming convention will match the `Redux` folder structure identically.

- **Auth State**:

  ```typescript
  export type AuthState = {
    currentUser: UserInfo | null; // displayName, email, photoURL, etc. (others you won't need to use)
    userId: string | null; // Unique user Id
    userLoggedIn: boolean; // Whether or not user is logged in
    isEmailUser: boolean; // Whether or not they are an E-mail user or google Use r
    loading: boolean; // State for registering
    registerError: string | null; // Error while log in or sign up
  };
  ```

- **GPT Type**:

```typescript
export type GptType = {
  userId?: string; // The user who made the assistant
  id?: string; // The unique id of the assistant
  title: string; // the title of the assistant
  desc: string; // the displayed description of the assistant
  urlPhoto?: string; // The avatar image of the assistant
  instructions?: string; // The instructions stored on db for assistant
};

export type GptSliceType = {
  gptList: GptType[]; // The list of assistants fetched from DB
  currentModel: ModelType; // The current assistant Model selected
  isLoading: boolean; // Is being created
  error: string | null; // Error when submitting form to create assistant
  lastCreatedGpt?: string; // The assistant that was created last (used to undo the creatinon)
};
```

- **Layout Type**:

```typescript
export type LayoutSliceType = {
  isSidebarVisible: boolean; // Is the sidebar visible  ?
  isDropdownVisible: boolean; // Is the mode dropdown visible (appears on header)
};
```

- **Log Type**:

```typescript
export type LogData = {
  id: string; // The unique id associated with the chat log
  firebaseUserId?: string; // The userId from the user who made the chat log
  title?: string; // The title of the log
  content: MessageObjType[]; // The message content from the log
  timestamp: string; // The timee the last message was sent on that chatLog
};

export type LogSliceType = {
  logList: LogData[]; // The list of logs associated with the current User
};
```

- **Message Type**:

```typescript
export type ModelType = {
  id?: string; // The unique id for the assistant
  title: string; // The title of the assistant
  desc: string; // The description for the assistant
  urlPhoto?: string; // The optional photo url for the assistant
  instructions?: string; // The instructions stored in db for assistant
};

export type MessageObjType = {
  id: number; // the unique id for the single message
  sender: string; // Either `bot` or `user`
  text: string; // The text associated with the message
  model?: string; // User only (The assistant title they chose)
  urlPhoto?: string; // Bot only (The url photo corresponding to the message)
};

// Important:
export interface MessageSliceType {
  currentChatId: string | null; // The log Id associated with the chat
  isNewChat: boolean; // If its a new chat or not
  msgList: MessageObjType[]; // The entire list of messages associated with a chat log
  isLoading: boolean; // If the message is currently being streamed out
  error: string | null; // The error for the chat message
}
```

### UI Component Libraries

- **ShadCn UI**: A collection of pre-built, reusable UI components that we can use to speed up development and ensure a consistent look and feel throughout our application.
- **Aceternity UI**: Another library of ready-made UI components that are customizable and designed to integrate smoothly with our React application.

---

### Styling

- **Tailwind CSS**: A utility-first CSS framework that allows us to style our application quickly using pre-defined classes directly in our HTML. This makes it easy to build custom user interfaces without writing a lot of custom CSS.

- **CSS Modules**: A way to write CSS that is scoped locally to each component, preventing conflicts and ensuring that styles are applied only to the intended components.

  - I recommend using `CSS Modules` to allow the `tsx` to look a lot cleaner. It is also easier for new users to work on the code if they don't know tailwind.

#### Instructions using CSS Modules

1. Create a new folder and place your `.tsx` file in the folder along with a new file with the extension `.module.css`

- Example: In the path `Client/src/components/chatLog` I have the folder `deleteLog`.
  - In this folder, I have two files:
    1. DeleteLog.tsx
    2. DeleteLog.module.css
  - Make sure they have the same name but different prefixes and are in the same folder for readability.

2. Create the Css styles in your css module file

   ```css
   .deleteButton {
     background-color: transparent;
     border: none;
     cursor: pointer;
     color: white; /* Set the icon color to white */
     margin: auto 0; /* Centers the button vertically within the flex container */
     margin-top: 15px;
   }

   .deleteButton:hover {
     color: rgb(244, 65, 65); /* Change icon color on hover */
   }

   /* Ensure MdDelete inherits the color from the button */
   .deleteButton svg {
     fill: currentColor;
   }
   ```

3. In the `.tsx` file, import the styles like this:

   ```typescript
   import styles from "./DeleteLog.module.css";
   ```

4. In the `.tsx` file, assign the styles to the HTML elements:

- Use `styles.` to access the CSS Classnames

  ```typescript
  return (
    <div>
      <button className={styles.deleteButton} onClick={() => onDelete(logId)}>
        <MdDelete />
      </button>
    </div>
  );
  ```

#### Pointers for CSS:

- Make using CSS easy by learning the following:

1. **Learn the Box Model**:

- [Box Model Cheat Sheet](https://www.codecademy.com/learn/learn-css/modules/learn-css-box-model/cheatsheet)

2. **Learn Positions**:

- [Positions Cheat Sheet](https://flexiple.com/css/css-position-properties-cheat-sheet)

3. **Learn FlexBox**:

- [Flexbox Cheat Sheet](https://flexbox.malven.co/)

4. **Learn Grid**:

- [Grid Cheat Sheet](https://grid.malven.co/)

## Backend Documentation

### Server Setup

- In the file `server/index.js`, I have setup the middleware, express routes, and openAI configuration

### Express Routes

- In the folder, `server/routes`, I have modularized my routes.

#### API Endpoints

- Express Routing is handled at these endpoints from the following steps:

1. **Define Routes in `index.js`** :

- 1a. Import Route definition:

  ```javascript
  import chatLogs from "./routes/chatLog.js";
  ```

- 1b. Setup routes:

  ```javascript
  app.use("/chatLogs", chatLogs);
  ```

2. In the file `server/routes/chatLog.js`, setup the routrer:

   ```javascript
   import express from "express";
   const router = express.Router();
   ```

3. In the file `server/routes/chatLog.js`, **Setup the endpoint**:

   ```javascript
   // Test: Access here `http://localhost:4000/chatLogs`
   router.get("/", async (req, res) => {
     res.send("ChatLog Backend Working");
   });
   ```

- This endpoint can now be reached at `http://localhost:4000/chatLogs`

### Integration with OpenAI API

#### Assistants

- The application uses [Assistants overview](https://platform.openai.com/docs/assistants/overview) to manage chats.

  - **Definition**: An Assistant has instructions and can leverage models, tools, and files to respond to user queries.
  - Use the [Assistant API docs](https://platform.openai.com/docs/api-reference/assistants) to research more on how the assistants API works

#### **How to create an Assistant**:

1. In the file `server/helpers/openAI`, there is a helper function that builds an openAI Assistant:

   ```javascript
   export async function createAssistant(title, description, instructions) {
     const gptInstructions =
       "You are a helpful assistant. When you provide explanations or answers, format them using Markdown syntax. For example, use ** for bold text where emphasis is needed. Make sure this format is in every message! Make sure this format is in every message! Please give responses in a structured way with sections for each instruction response given below:\n" +
       instructions;
     const assistant = await openai.beta.assistants.create({
       name: title,
       description: description,
       instructions: gptInstructions,
       model: "gpt-4o",
     });
     return assistant;
   }
   ```

- This function will return an [assistant object](https://platform.openai.com/docs/api-reference/assistants/object), which will have a unique id.
  .

  - **Problem**: If two users try to use the same assistant, at the same time, it will only work for the user that submits the message first.

  - **Solution**: Every user must have a list of their own assistants created at sign-up.

  - **Example**: If we have three total assistants in our application (`Normal`, `Matching`, `Ethical`) and five total users, then we will have 15 total assistants created.

    - Each user has three assistants created for them when they sign up.

    - If a new user creates an assistant, then we will create 5 more assistants and store the assistant ids in our database.

  - When a new user logs in, we need to create new assistants for them

#### Threads

- **Definition**: A [thread](https://platform.openai.com/docs/api-reference/threads/object) is a list of messages created by an `assistant` object where it contains the context of the chat log.

  - In our application, every `chatlog` has a unique `id` that is matched with its `threadId` in the `threads` collection

  - In the file `server/helpers/openAI/threadFunctions.js`, I have created helper functions to create a new thread, add a message to a thread, delete a thread, and more.

### Integration with MongoDB

- This section explains how MongoDB is integrated with the Express application.

- In our express routes, we are accessing our MongoDB collections to perform CRUD operations in the folder `server/db`

- The integration follows a structured approach where Express routes call service functions, which in turn interact with the MongoDB collections.

- This layered architecture promotes separation of concerns and enhances code maintainability.

#### Benefits of This Approach

1. **Separation of Concerns**: Each layer in the architecture has a specific responsibility. Routes handle HTTP requests, services contain business logic, and collections manage database interactions.
2. **Maintainability**: Changes in one layer (e.g., database schema changes) can be managed without affecting other layers. This makes the code easier to maintain and extend.
3. **Reusability**: Service functions can be reused across different routes, reducing code duplication.
4. **Testability**: Each layer can be tested independently, improving the overall test coverage and reliability of the application.

#### Instructions

1. **Express Route Calls a Function in a Service File**:

- In the Express route, a service function is called to **handle the logic of fetching data from the database**.

- Example: file located at `server/routes/chatLog.js`

  ````javascript
  import { getLogsByUser } from "../db/models/chatlog/chatLogServices.js";
  // Get the entire LogList: (Read)
  router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const logs = await getLogsByUser(userId);
      res.status(200).json(logs);
    } catch (error) {
      console.error("Failed to fetch logs: ", error);
      res.status(500).send("Failed to fetch logs: " + error.message);
    }
  });
  ```
  ````

2. **Service Function Calls a Function from the Collections File**

- The service file acts as a middleman between the Express route and the MongoDB collection, ensuring that the business logic is separated from database operations.

- **Example**: file located at `server/db/models/chatLog/chatLogServices.js`

  ```javascript
  // Read (Fetch ALL logs by userId)
  export const getLogsByUser = async (userId) => {
    try {
      const logs = await ChatLogModel.fetchLogsByUserId(userId);
      return logs.map((log) => ({
        id: log._id,
        content: log.content,
        title: log.title,
        timestamp: log.timestamp,
        urlPhoto: log.urlPhoto,
      }));
    } catch (error) {
      throw new Error("Service error: " + error.message);
    }
  };
  ```

3. **Collections File Performs the Database Query**

- The collections file contains functions that directly interact with the MongoDB database. It performs the necessary queries and returns the results.

- Example (File: `server/db/models/chatLog/chatLogCollection.js`):

  ```javascript
  // Read
  export const fetchLogsByUserId = async (userId) => {
    try {
      const logs = await chatLogCollection.find({ userId: userId }).toArray();
      return logs;
    } catch (error) {
      throw new Error("Error fetching logs: " + error.message);
    }
  };
  ```

## Database Documentation

### Database Used

- MongoDB is a NoSQL database that provides flexibility and scalability for handling large amounts of unstructured data.
- It stores data in flexible, JSON-like documents, meaning fields can vary from document to document and data structure can change over time.
- For this project, MongoDB is used to store various collections related to the chatbot application.

### Collections

- **Note**: The sensitive information below, such as the `_id` property values are all made up and are not the actual values stored in our `mongodb` database.

#### chatLogs

- The `chatLogs` collection stores the logs of conversations between users and the chatbot. Each document represents a single conversation with its metadata and messages.

- **ChatLogs Example Document**:

  ```json
  {
    "_id": "a5cf3424-e726-47e4-a7de-b7394353601cd8",
    "userId": "user123",
    "title": "Hello there",
    "timestamp": "2024-05-24T15:46:37.387Z",
    "content": [
      {
        "id": 1716565593851,
        "sender": "user",
        "text": "Hi",
        "model": "Testing Assistant"
      },
      {
        "id": 1716565595993,
        "sender": "bot",
        "text": "**Orange**\n\nHello! How can I assist you today?",
        "urlPhoto": ""
      }
    ]
  }
  ```

#### gpts

- The `gpts` collection stores information about different GPT (Generative Pre-trained Transformer) assistants available in the application. Each document includes details about an assistant, such as its identifier, description, and associated user.

- **Gpts Example Document**:

  ```json
  {
    "_id": {
      "$oid": "664ca5sdafas43sdf423f09f24"
    },
    "assistantId": "asst_exampleId",
    "userId": "user123",
    "title": "Ethical",
    "desc": "An ethical assistant to provide insightful concerns.",
    "urlPhoto": "https://example.com/photo.jpg"
  }
  ```

#### threads

- The `threads` collection stores information about conversation threads. Each document includes a unique thread identifier.

- **Threads Example Document**:

  ```json
  {
    "_id": "85a23e246f-69fa-4201-b9a0-430wer237a075",
    "threadId": "thread_exampleId"
  }
  ```

#### users

- The `users` collection stores user profile information. Each document includes details about a user, such as their first and last name.

- **Users Example Document**:

  ```json
  {
    "_id": "user123",
    "firstName": "Cristian",
    "lastName": "Castro"
  }
  ```

- Once the feature for `settingForm` is finished, this users collection will contain information on `interests`, `availability`, etc.

  - This information can then be used to match advisors with students and enhance the effectiveness of their personal assistants.

### Schema Definitions

#### chatLogs Schema

- The `chatLogs` schema defines the structure of the chat log documents. Key fields include:

  - `_id`: Unique identifier for the chat log (UUID).
  - `userId`: Identifier for the user (string).
  - `title`: Title of the chat session (string).
  - `timestamp`: Timestamp of when the chat occurred (ISO date).
  - `content`: Array of message objects, each containing:
    - `id`: Unique identifier for the message (number).
    - `sender`: Sender of the message (string, e.g., "user" or "bot").
    - `text`: Text content of the message (string).
    - `model`: Model used for generating the bot's response (string).
    - `urlPhoto`: URL of the photo associated with the message, if any (string).

#### gpts Schema

- The `gpts` schema defines the structure of the GPT assistant documents. Key fields include:

  - `_id`: Unique identifier for the assistant (ObjectId).
  - `assistantId`: Identifier for the assistant (string).
  - `userId`: Identifier for the user associated with the assistant (string).
  - `title`: Title of the assistant (string).
  - `desc`: Description of the assistant (string).
  - `urlPhoto`: URL of the photo associated with the assistant (string).

#### threads Schema

- The `threads` schema defines the structure of the thread documents. Key fields include:

  - `_id`: Unique identifier for the thread (UUID).
  - `threadId`: Identifier for the thread (string).

#### users Schema

- The `users` schema defines the structure of the user documents. Key fields include:

  - `_id`: Unique identifier for the user (string).
  - `firstName`: First name of the user (string).
  - `lastName`: Last name of the user (string).

## Contribution Guidelines

### Coding Standards

- Our current MERN application has the following coding standards

#### **Prettier Configuration:** Prettier is used to format our code.

- The configuration is defined in the [`.prettierrc`](../.prettierrc) at the root of the project:

  ```json
  {
    "singleQuote": false,
    "trailingComma": "es5",
    "printWidth": 80,
    "tabWidth": 2,
    "semi": true,
    "jsxSingleQuote": false
  }
  ```

- Always make sure to submit your commits using this format.

1. **Format the Client**:

   ```bash
   cd Client && npm run format
   ```

2. **Format the Server**

   ```bash
   cd server && npm run format
   ```

#### ESLint Configuration: Client

- The ESLint configuration for the **client-side** code is defined in the file [`client/.eslintrc.cjs`](../Client/.eslintrc.cjs)

- **Run Lint on Client**:

  ```bash
  cd Client && npm run lint
  ```

#### ESLint Configuration: Server

- The ESLint configuartion for the **server-side** code is defined in the file [`server/eslint.config.js`](../server/eslint.config.js)

- **Run Lint on server**:

  ```bash
  cd server && npm run lint
  ```

### How to Contribute

- Contributing to this project involves a series of steps to ensure that changes are implemented smoothly and consistently.
- Follow these guidelines to contribute effectively:

1. **Fetch and Pull the Latest Changes**

   - Before starting, make sure you have the latest changes from the main branch.
   - Run the following commands:
     ```bash
     git fetch origin
     git pull origin main
     ```

2. **Create a New Branch Off Main**

   - Create a new branch to work on your feature or bug fix. Use a descriptive name for your branch.
   - Example:
     ```bash
     git checkout -b feature/your-feature-name
     ```

3. **Make the changes**:

   - On this branch, make your changes to the code.
   - Make the changes small and add comments explain what the code does when necessary.
   - These changes will be reviewed by a teammate in the pull request on step 9.

4. **Ensure Code Quality with ESLint and Prettier**:

   - Run ESLint and Prettier to check and format your code according to the project's coding standards.
   - Make sure there are no `errors` from ESLint.

   - **Example for the client-side code**:

     ```bash
     npm run lint:client
     npm run format:client
     ```

   - **Example for the server-side code**:

     ```bash
     npm run lint:server
     npm run format:server
     ```

   - **Or to run both in one go**:

     ```bash
      npm run lint:all
      npm run format:all
     ```

5. **Commit Your Changes**

   - Commit your changes with a clear and concise commit message.
   - Example:
     ```bash
     git add .
     git commit -m "Add feature to enhance user authentication"
     ```

6. **Push Your Changes to Your Branch**

   - Push your committed changes to the remote repository.
   - Example:
     ```bash
     git push origin feature/your-feature-name
     ```

7. **Sync Changes from the Main Branch**

   - Ensure your branch is up to date with the latest changes from the main branch by merging the main branch into your branch.
   - Example:
     ```bash
     git checkout main
     git pull origin main
     git checkout feature/your-feature-name
     git merge main
     ```

8. **Create the Pull Request and Assign Reviewers**

   - Create a pull request (PR) from your branch to the main branch.
   - Provide a detailed description of your changes and assign reviewers.
   - Example:

     ```markdown
     ## Description

     Detailed explanation of what the new feature or fix does.

     ## Changes

     - List of changes made
     ```

9. **Wait for Your Pull Request to Be Reviewed**

   - Wait for your PR to be reviewed by the assigned reviewers.
   - If changes are requested, make the necessary adjustments and commit them to your branch. Repeat steps 3,4, and 5 as needed.

10. **Squash and Merge into Main**

    - Once your PR is approved, use the `squash and merge` option to merge it into the main branch.
    - Provide a detailed description of the new feature in the merge commit.
    - Example:

      ```markdown
      ## New Feature: Enhanced User Authentication

      - Detailed description of the new feature.
      ```

11. **Update GitHub Projects**

    - Use GitHub Projects to check off the task associated with your feature and log the hours it took to complete.
    - Example:
      ```markdown
      - [x] Enhanced user authentication (3 hours)
      ```

12. **Document Your Changes**
    - Update the `documentation/README.md` file with any relevant changes or new features.
    - Ensure your documentation is clear and provides sufficient detail for other team members to understand the changes.

#### Contribution Important Note

- Please try and keep the `main` branch `commit history` clean.
  - Each pull request merged should make sure that it passes the `CI/CD` tests and should pass any future tests implemented before approving and merging.
  - Also do `squash and merge` to make the commits from one branch a single commit when being merged into main.

By following these steps, you can contribute effectively to the project and maintain a smooth workflow within the team.

## Additional Resources

### Github Desktop or Tower (Optional but strongly recommended)

- Using a GUI tool for managing your commits can simplify the process and provide a visual interface for handling your repository.

- Here are two recommended options:

- **Github Desktop**:

  - [Github Desktop Download Link](https://desktop.github.com/)

- **Git Tower**:
  - A free version is available for students if you register with your school E-mail.
  - [Git Tower Download Link](https://www.git-tower.com/students)

### MongoDB Compass

- Download MongoDB Compass for a GUI to manage your collections

- [Download Link](https://www.mongodb.com/products/tools/compass)

### Browser: Firefox Developer Edition

- I recommend avoiding using Chrome when working on Front-end development and instead using a broswer like Firefox Developer
- [Firefox Developer Edition Download Link](https://www.mozilla.org/en-US/firefox/developer/)
- **Reason**: The developer tools such as `inspector` or `console` to view the console logs are much better in Firefox
-

#### Firefox Chrome Extensions (Very helpful)

- **React Developer Tools**: Inspect the React tree including the component hierarchy, props, state, etc.
- [React Dev Tools Download Link for Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

- **Redux DevTools**: Allows you to view the `actions history` undo and replay.
  - A super cool and useful tool for debugging in our application.
  - Only available because we are using Redux as our global state manager.
- [Redux Dev Tools Download Link for Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools)

- **Debug CSS**: A tool that outlines all elements on the page with a box
  - Realizing that Web pages are built by HTML elements stored in boxes, managing the layout of these elements can be debugged using this extension by viewing every element on the page as a box.
- [Debug CSS Download Link for Firefox](https://addons.mozilla.org/en-US/firefox/addon/pranay-joshi/)

### VSCode Extensions

- Video on how to setup your VSCode for React: [video](https://www.youtube.com/watch?v=NngvFclfdgI)

- To enhance your development experience and improve productivity, we recommend the following Visual Studio Code (VSCode) extensions. These extensions are tailored to work well with the technologies and tools used in this project.

1. **ESLint**

   - Ensures consistent code quality and style by identifying and fixing linting issues.
   - [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

2. **Prettier - Code Formatter**

   - Automatically formats your code according to a set of defined style rules, ensuring a consistent codebase.
   - [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

3. **Tailwind CSS IntelliSense**

   - Provides autocompletion, syntax highlighting, and linting for Tailwind CSS, making it easier to work with utility-first CSS.
   - [Tailwind CSS IntelliSense Extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

4. **MongoDB for VS Code** (Optional if you have MongoDB Compass)

   - Connects to your MongoDB database, allowing you to browse, query, and manage your collections directly from VSCode.
   - [MongoDB Extension](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode)

5. **React Extension Pack**

   - A collection of essential extensions for React development, including React and Redux snippets, and more.
   - [React Extension Pack](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippetsk)

6. **JavaScript (ES6) Code Snippets**

   - Provides a comprehensive collection of JavaScript and ES6 code snippets to speed up your development process.
   - [JavaScript (ES6) Code Snippets Extension](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets)

7. **Pretty Typescript Errors**

   - Provides easy-to-read Typescript error messages
   - [Pretty Typescript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)

8. **Path Intellisense**

   - Autocompletes filenames and paths in your projects, saving time when importing files.
   - [Path Intellisense Extension](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)

9. **Markdown All in One** (Optional)
   - Provides a comprehensive set of tools for working with Markdown files, including shortcuts, preview, and TOC generation.
   - [Markdown All in One Extension](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)

#### Installation Instructions

To install these extensions, follow these steps:

1. Open VSCode.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3. Search for each extension by name and click the "Install" button.

### Contact

- [Personal E-mail](mailto:cmcastro559@gmail.com)
- [School E-mail](mailto:ccastroo@calpoly.edu)

## Frequently Asked Questions (FAQ)

### Common Issues and Solutions

- List common issues faced by new developers and their solutions.
