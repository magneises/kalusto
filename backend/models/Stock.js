import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    date: { type: Date, default: Date.now },
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    sentimentScore: Number
});

export default mongoose.model("Stock", StockSchema);
