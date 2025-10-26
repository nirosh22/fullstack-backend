import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Same working connection string + DB name added
const uri =
  "mongodb+srv://niros:nirosh22@fullstack.hfvgjny.mongodb.net/cst3144?retryWrites=true&w=majority&appName=fullstack";

const client = new MongoClient(uri);
let lessonsCollection;

async function startServer() {
  try {
    await client.connect();
    const db = client.db("cst3144");       // ✅ select the DB
    lessonsCollection = db.collection("lessons"); // ✅ select the collection
    console.log("✅ Connected to MongoDB Atlas & DB ready");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

startServer();

// ✅ Now API route to fetch lessons
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await lessonsCollection.find().toArray();
    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving lessons", error: err });
  }
});

// Just test route
app.get("/", (req, res) => res.send("Backend working with MongoDB Atlas"));



