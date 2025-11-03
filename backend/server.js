import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://niros:nirosh22@fullstack.hfvgjny.mongodb.net/cst3144?retryWrites=true&w=majority&appName=fullstack";

const client = new MongoClient(uri);
let lessonsCollection, ordersCollection;

async function startServer() {
  try {
    await client.connect();
    const db = client.db("cst3144");
    lessonsCollection = db.collection("lessons");
    ordersCollection = db.collection("orders");

    console.log("✅ Connected to MongoDB Atlas & DB ready");

    app.listen(3000, () => console.log("🚀 Server running on port 3000"));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

startServer();

// 🟢 Get all lessons
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await lessonsCollection.find().toArray();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving lessons", error: err });
  }
});

// 🟡 Save a new order
app.post("/orders", async (req, res) => {
  try {
    const order = req.body;
    const result = await ordersCollection.insertOne(order);
    res.status(201).json({ message: "Order saved", orderId: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: "Error saving order", error: err });
  }
});

// 🔵 Update lesson spaces
app.put("/lessons/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { spaces } = req.body;
    const result = await lessonsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { spaces: spaces } }
    );
    res.json({ message: "Lesson updated", result });
  } catch (err) {
    res.status(500).json({ message: "Error updating lesson", error: err });
  }
});

app.get("/", (req, res) => res.send("Backend working with MongoDB Atlas"));



