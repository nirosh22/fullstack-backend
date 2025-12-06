import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use env var for Render, fall back to local hard-coded URI
const uri =
    process.env.MONGO_URI ||
    "mongodb+srv://niros:nirosh22@fullstack.hfvgjny.mongodb.net/cst3144?retryWrites=true&w=majority&appName=fullstack";

const client = new MongoClient(uri);
let db;

// ✅ Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        db = client.db("cst3144"); // database name
        console.log("✅ Connected to MongoDB Atlas & DB ready");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}
connectDB();

// ✅ Logger middleware (for marking)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ✅ Root route
app.get("/", (req, res) => {
    res.send("🏀 Sports Lessons API is running on MongoDB Atlas!");
});

// ✅ GET all lessons
app.get("/lessons", async (req, res) => {
    try {
        const lessons = await db.collection("lessons").find().toArray();
        res.json(lessons);
    } catch (err) {
        console.error("Error fetching lessons:", err);
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
});

// ✅ POST new order (with validation + updating lesson spaces)
app.post("/orders", async (req, res) => {
    try {
        const { name, phone, lessonIDs } = req.body;

        // Basic validation
        if (!name || !phone || !lessonIDs || lessonIDs.length === 0) {
            return res.status(400).json({ error: "Missing required order details" });
        }

        // Check lessons exist and update spaces
        const lessonsCollection = db.collection("lessons");
        for (let id of lessonIDs) {
            const lessonObjectId = new ObjectId(id);
            const lesson = await lessonsCollection.findOne({ _id: lessonObjectId });

            if (!lesson || lesson.spaces <= 0) {
                return res
                    .status(400)
                    .json({ error: `Lesson ${id} is full or not found` });
            }

            await lessonsCollection.updateOne(
                { _id: lessonObjectId },
                { $inc: { spaces: -1 } }
            );
        }

        // Save order
        const order = { name, phone, lessonIDs, date: new Date() };
        const result = await db.collection("orders").insertOne(order);

        res.status(201).json({
            message: "✅ Order created successfully",
            orderId: result.insertedId,
        });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

// ✅ GET all orders (optional for admin view or marking)
app.get("/orders", async (req, res) => {
    try {
        const orders = await db.collection("orders").find().toArray();
        res.json(orders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// ✅ PUT update lesson spaces (manual edit route)
app.put("/lessons/:id", async (req, res) => {
    try {
        const lessonId = new ObjectId(req.params.id);
        const updateData = req.body; // e.g. { spaces: 4 }

        const result = await db.collection("lessons").updateOne(
            { _id: lessonId },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        res.json({ message: "✅ Lesson updated successfully" });
    } catch (err) {
        console.error("Error updating lesson:", err);
        res.status(500).json({ error: "Failed to update lesson" });
    }
});

// ✅ Serve static files for lesson images (optional)
app.use("/images", express.static("images"));

// ✅ Start server with Render-compatible port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});


