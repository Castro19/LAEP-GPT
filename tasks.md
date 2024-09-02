# Tasks for the Project

## Front-End

## Back-end

### API Routes

### MongoDB Functions

### Working with the OpenAI API

## Ideas or Tasks

### Task 1: LLM Models

- Work with creating assistants, threads, and managing scalability.
    - Teacher-account based assistants made
    - Ethics assessor and social justice assessor assistants to be made
    - Matching assistant created + given information on teachers in order to match

- Test what happens when two users send a message at the same time

- [Docs](https://platform.openai.com/docs/assistants/overview)

### Task 2: Mongo DB Functions

- When a user signs up, create a new assistant id for each model we currently have.
  - Currently creates a new teacher assistant based on that teacher on teacher account creation

### Task 3: Setting Form

- Once a user signs up, present a form that allows them to insert information like availability, interest, and etc.
  - Seperated teacher vs student accounts, added custom field to teacher called about which is also added to the database and accessable
  - Availability also added to both database and forms

- Send the information to the back-end to be inserted into the database. 
  - DONE for what is currently implemented

### Task 4: Role-based Access Control

- Assigning users to different roles to have different permissions.
  - Users now have teacher and student roles, but those currently don't effect permissions. What perms can/should be granted?

- Give permissions based on student or teacher to create custom Assistants

- Give permissions based on who can access the custom assistant created
  - Maybe the user wants to select which users can have access to this assistant.

## Task 5: Data Scraping

- Scrape data about teachers to feed into the database about each teacher in order for the AI to get a better grasp on the teacher and pair them with students more accurately

## Task 6: Human Testing Permission and Papers

- Write a proposal in order to gain permission for human test trials
  - IRB accounts made and to be connected

- Look into journals for potential publishing

## Task 7: Ongoing

  - Make chats clear when the selected assistant is changed, and when you log in (currently displays last chat if you log out and log back in on a different account on the same computer, unknown how it behaives outside of that)

## Task 8: Poster Board
  - Continue working on Poster board, due around Sept 29th if past year's due date holds