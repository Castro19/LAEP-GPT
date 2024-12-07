import { MongoClient, ServerApiVersion, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const URI = process.env.ATLAS_URI || "";
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: false,
  },
});

let db: Db;

async function connectToDb(): Promise<Db> {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    db = client.db("laep");
    return db;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw new Error("Failed to connect to MongoDB");
  }
}

function getDb(): Db {
  if (!db) {
    throw new Error("Database not connected. Please connect first.");
  }
  return db;
}

export { connectToDb, getDb };
