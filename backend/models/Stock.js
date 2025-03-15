import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
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
    priveAvg50: Number,
    priceAvg200: Number,
    exchange: String,
    volumd: Number,
    avgVolume: Number,
    eps: Number,
    pe: Number,
    earningsAnnouncement: String,
    sharesOutstanding: Number,
});

export default mongoose.model("Stock", StockSchema);











