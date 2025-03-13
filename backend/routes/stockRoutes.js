import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Stock from '../models/Stock.js';


dotenv.config();

const router = express.Router();
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

router.get('/stocks/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`

    try {
        const response = await axios.get(url);
        const timeSeries = response.data["Time Series (Daily)"];

        if (!timeSeries) {
            return res.status(400).json({ error: "Invalid symbol or API limit reached" });
        }

        const latestDate = Object.keys(timeSeries) [0];
        const latestData = timeSeries[latestDate];

        const stockEntry = new Stock({
            symbol,
            date: new Date(latestDate),
            open: parseFloat(latestData["1. open"]),
            high: parseFloat(latestData["2. high"]),
            low: parseFloat(latestData["3. low"]),
            close: parseFloat(latestData["4. close"]),
            volumne: parseInt(latestData["5. volume"])
        });

        await stockEntry.save();
        res.json(stockEntry);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stock data", details: error.message });
    }
});

router.get("/stocks/history/:symbol", async (req, res) => {
    try {
        const { symbol } = req.params;
        const stockHistory = await Stock.find({ symbol }).sort({ date: -1 });
        res.json(stockHistory);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve stock history" });
    }
});

export default router;


