import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const URI = process.env.ATLAS_URI || "";
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectToDb() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    db = client.db("laep");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw new Error("Failed to connect to MongoDB");
  }
}

function getDb() {
  if (!db) {
    throw new Error("Database not connected. Please connect first.");
  }
  return db;
}

// Ensure the connection is established when the module is imported
await connectToDb().catch(console.error);

export { connectToDb, getDb };
export default getDb();
