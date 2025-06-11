# Implementing a Full End-to-End Feature

This guide outlines the step-by-step process for implementing a new full-stack feature in PolyLink. The feature will be tracked as a full-stack ticket and includes both backend and frontend development.

## Steps to Implement an End-to-End Feature

### 1. Create a Database Schema

- Define the schema for the new feature in our database.
- Ensure the schema follows best practices and aligns with existing structures.

### 2. Introduce New Types in the Shared Folder

- Navigate to `shared/src/types`.
- Create or update type definitions that will be shared across the application.

### 3. Create the Express Route & Test Functionality

- Implement a new API endpoint in `server/src/routes`.
- Define the new route in `server/src/index.ts` so that Express can recognize it.
- Test the route using a REST client like [Thunder Client (VSCode Extension)](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client).

### 4. Implement the Service Function and Database Collection Modifications

- Navigate to `server/src/db/models`.
- Create a **new subfolder** using camelCase (e.g., `feedback`).
- Inside the subfolder, create the following files:
  - **Service function** (`feedbackServices.ts`): Acts as a middleman between the Express route and MongoDB.
  - **Collection function** (`feedbackCollection.ts`): Modifies the MongoDB collection.
- Implement the necessary functions in these files to handle CRUD operations.

### 5. Test Backend Functionality

- Use Thunder Client or another REST client to verify that the server is fully functional.

### 6. Create CRUD Function on the Client to Make API Requests

- Navigate to `Client/src/redux`.
- Create a **new subfolder** with the same name as before (e.g., `feedback`).
- Inside this subfolder, create two files:
  1. **Slice file** (e.g., `feedbackSlice.ts`): Defines the Redux slice using Redux Toolkit.
  2. **CRUD file** (e.g., `crudFeedback.ts`): Handles API requests to the Express endpoint.

### 7. Create Redux Async Thunk

- Implement a Redux async thunk that will be dispatched and call the CRUD function.

### 8. Update Redux Slice with ExtraReducers

- Add `extraReducers` in the Redux slice to handle pending, success, and error states for the async thunk.

### 9. Update Store and Reducers

Add the error reducer and actions to the Redux store:

1. In `Client/src/redux/index.ts`:

   ```typescript
   export { errorReducer } from "./error/errorSlice.ts";
   export * as errorActions from "./error/errorSlice.ts";
   ```

2. In `Client/src/redux/store.ts`:

   ```typescript
   import { errorReducer } from "./error/errorSlice";

   const store = configureStore({
     reducer: {
       // ... other reducers
       error: errorReducer,
     },
   });
   ```

This enables:

- Using `errorActions` throughout the app (e.g., `errorActions.submitErrorReport`)
- Type-safe dispatch with `useAppDispatch`
- Accessing error state with `useAppSelector`

### 10. Create the Frontend Component

- Develop a basic frontend component that dispatches the Redux action.
- Verify that the action is dispatched correctly and updates the Redux store.
- If the feature is entirely new, create a **new subfolder** in `Client/src/components/feedback` and place the component inside.

### 11. Improve the Component Design

- Enhance the component's UI using a component library like **ShadCN/UI**.
- Add animations using **Framer Motion** for a smooth user experience.
- Ensure the component aligns with the overall design system.

## Summary

Following these structured steps ensures that the feature is implemented efficiently and follows best practices. Always test each step thoroughly before moving to the next stage to maintain code quality and prevent regressions.
