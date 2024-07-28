import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect();
const db = client.db("myDatabase");
const usersCollection = db.collection("users");

export const createUser = async (userData) => {
  const result = await usersCollection.insertOne(userData);
  return result;
};
