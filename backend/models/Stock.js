import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    date: { type: Date, required: true },
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    sentimentScore: Number, // Stores sentiment score from Alpha Vantage
});

export default mongoose.model("Stock", StockSchema);
