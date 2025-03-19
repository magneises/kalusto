import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const FMP_API_KEY = process.env.FMP_API_KEY;

// Top 20 Stocks Commonly Held by Hedge Funds & Banks
const symbols = [
    "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA",  // Big Tech
    "JPM", "GS", "MS", "BRK.B",  // Finance
    "XOM", "CVX", "CAT",  // Energy & Industrials
    "KO", "PEP", "JNJ", "UNH", "PG", "HD"  // Consumer & Healthcare
];

// Fetch live stock ticker data using Financial Modeling Prep (FMP)
router.get("/ticker", async (req, res) => {
    try {
        const url = `https://financialmodelingprep.com/api/v3/quote/${symbols.join(",")}?apikey=${FMP_API_KEY}`;
        const response = await axios.get(url);

        if (!response.data || response.data.length === 0) {
            return res.status(400).json({ error: "No ticker data available." });
        }

        // Extract relevant stock data
        const tickers = response.data.map(stock => ({
            symbol: stock.symbol,
            price: parseFloat(stock.price),
            change: parseFloat(stock.changesPercentage) || 0,
        }));

        res.json({ tickers });

    } catch (error) {
        console.error("Error fetching stock ticker data:", error);
        res.status(500).json({ error: "Failed to fetch ticker data" });
    }
});

export default router;
