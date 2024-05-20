import { v4 as uuidv4 } from "uuid";

export default function createNewChatLogId() {
  return uuidv4(); // Creates a universally unique identifier
}
