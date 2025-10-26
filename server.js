import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://niros:Niros1234!@fullstack.hfvgjny.mongodb.net/cst3144?retryWrites=true&w=majority&appName=fullstack";

const client = new MongoClient(uri);
let lessonsCollection;

async function startServer() {
  try {
    await client.connect();
    const db = client.db("cst3144");
    lessonsCollection = db.collection("lessons");
    console.log("✅ Connected to MongoDB Atlas");

    // ✅ Start server ONLY AFTER DB connects
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

startServer();

// API route: Get all lessons
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await lessonsCollection.find().toArray();
    console.log("Fetched lessons:", lessons);
    res.status(200).json(lessons);
  } catch (err) {
    console.error("Error fetching lessons:", err);
    res.status(500).json({ message: "Error retrieving lessons", error: err });
  }
});

app.get("/", (req, res) => res.send("Backend working with MongoDB Atlas"));

