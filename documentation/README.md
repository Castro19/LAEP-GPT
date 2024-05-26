# AI Chatbot for Senior Projects

## Table of Contents

1. [Project Introduction](#project-introduction)
   - [Overview](#overview)
   - [Project Goals](#project-goals)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Project Structure](#project-structure)
   - [Explanation of Structure](#explanation-of-structure)
3. [Frontend Documentation](#frontend-documentation)
   - [Technologies Used](#technologies-used-frontend)
   - [Routing](#routing)
   - [Components](#components)
   - [Redux](#redux)
   - [Types](#types)
   - [UI Component Libraries](#ui-component-libraries)
   - [Styling](#styling)
4. [Backend Documentation](#backend-documentation)
   - [Technologies Used](#technologies-used-backend)
   - [API Endpoints](#api-endpoints)
   - [Integration with OpenAI API](#integration-with-openai-api)
5. [Database Documentation](#database-documentation)
   - [Database Used](#database-used)
   - [Collections](#collections)
   - [Schema Definitions](#schema-definitions)
6. [Contribution Guidelines](#contribution-guidelines)
   - [How to Contribute](#how-to-contribute)
   - [Coding Standards](#coding-standards)
7. [Additional Resources](#additional-resources)
   - [Useful Links](#useful-links)
   - [Contacts](#contacts)
8. [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
   - [Common Issues and Solutions](#common-issues-and-solutions)

## Project Introduction

### Overview

- Briefly describe the project's purpose and objectives.
- Explain the significance of the project for students and advisors.
- Mention the technologies and tools used in the project.

### Project Goals

- List the primary goals of the project.

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

1.  **Overview of Redux**:

    - **Redux**: A state management tool that helps us keep track of the entire application's state in a predictable and centralized way. This makes it easier to manage and debug the state of our app.
    - **Benefits**: Centralized state management, easier debugging, predictable state transitions, and improved testability.

2.  **Store Configuration**:

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

3.  **Slices**:

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

4.  **Initial State**:

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

5.  **Actions**:

    - **Definition**: Actions are payloads of information that send data from your application to your Redux store. They describe what happened in your app.
    - **Action Creators**: Actions in Redux Toolkit are defined within a slice using `createSlice`. The slice automatically generates action creators for each reducer function.
    - **PayloadAction**: In Redux, using `typescript` we specify the type of data passed as the action like this: `PayloadAction<LogData>` where the `LogData` is a type we created.

6.  **Reducers**: Most important Redux Concept

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

7.  **Extra Reducers** and **Async Thunks**:

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

8.  **Connecting Redux to React**:

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

9. **Selectors**:

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

10. **Dispatch**

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

11. **Best Practices**:

- **File Organization**: For every slice, it should be stored in its own separate sub folder in the path `Client/src/redux/`.
  - In this subfolder, we will have the `${feature}Slice`.ts file and an optional helper file that will have functions that do the majority of the logic (e.g. `Crud operations that make the client-side requests`)
- **Maintainability**:
  - Try to keep the logic in the helper files and the actual reducer functions should be kept as short as possible.
  - When possible, seperate logic by their CRUD Operations.
    - The file for `logSlice.ts` is a perfect example of how we can do this.

---

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

#### Instructions using Tailwind

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

### Technologies Used (Backend)

- List and describe the backend technologies.

### API Endpoints

- Document the API endpoints with details like URL, method, and description.

### Integration with OpenAI API

- Explain how the OpenAI API is integrated.
- Provide examples of making requests to the OpenAI API.

## Database Documentation

### Database Used

- Describe MongoDB and its use in the project.

### Collections

- List and describe the collections used in MongoDB.

### Schema Definitions

- Provide schema definitions for each collection.

## Contribution Guidelines

### How to Contribute

- Explain the process for contributing to the project.
- Provide guidelines for submitting issues and pull requests.

### Coding Standards

- Describe the coding standards and best practices to be followed.

## Additional Resources

### Useful Links

- Provide links to related documentation, tutorials, and other resources.

### Contacts

- Provide contact information for project maintainers or supervisors.

## Frequently Asked Questions (FAQ)

### Common Issues and Solutions

- List common issues faced by new developers and their solutions.
