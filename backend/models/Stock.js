import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true }, // Unique stock identifier
    name: String,
    date: { type: Date, required: true },
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    previousClose: Number,
    changesPercentage: Number,
    change: Number,
    yearHigh: Number, 
    yearLow: Number,
    marketCap: Number,
    priceAvg50: Number,
    priceAvg200: Number,
    exchange: String,
    volume: Number,
    avgVolume: Number,
    eps: Number,
    pe: Number,
    earningsAnnouncement: String,
    sharesOutstanding: Number,

    // Watchlist Feature: Tracks users who added this stock to watchlist
    watchlistUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("Stock", StockSchema);
