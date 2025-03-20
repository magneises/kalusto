import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import stockRoutes from "./routes/stockRoutes.js";
import tickerRoutes from "./routes/tickerRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3200;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB is Connected"))
    .catch((err) => console.error("MongoDB Connection Failed", err));

// Routes
app.use("/api", stockRoutes);
app.use("/api", tickerRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Base API
app.get("/", (req, res) => {
    res.send("Stock Market API is running...");
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});
