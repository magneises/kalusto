import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    stocks: [
        {
            symbol: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            note: { type: String, default: "" } 
        }
    ]
});

export default mongoose.model("Watchlist", WatchlistSchema);
