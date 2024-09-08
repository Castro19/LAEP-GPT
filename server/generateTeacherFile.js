import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath
import { getAllUsers } from "../server/db/models/user/userServices.js";

// Define the function to fetch teachers data
const fetchTeachersData = async () => {
  try {
    const users = await getAllUsers(); // Use the service function
    return users;
  } catch (error) {
    console.error("Error fetching teachers data:", error);
    throw error;
  }
};

// Generate the teacher file
export const generateTeacherFile = async () => {
  try {
    const teachers = await fetchTeachersData();

    let fileContent = "This is information on every teacher in the database.\n";

    teachers.forEach((teacher) => {
      if (teacher.userType === "teacher") {
        fileContent += `name: ${teacher.firstName} ${teacher.lastName}\n`;
        fileContent += `availability: ${teacher.availability}\n`;
        fileContent += `about: ${teacher.about}\n\n`;
      }
    });

    // Get the current directory
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Define the file path
    const filePath = path.join(__dirname, "teachersInfo.txt");

    // Write the file
    fs.writeFileSync(filePath, fileContent, "utf8");
    console.log("Teacher file written to:", filePath);
  } catch (error) {
    console.error("Error generating teacher file:", error);
    throw error; // Rethrow to be caught by the route handler
  }
};
