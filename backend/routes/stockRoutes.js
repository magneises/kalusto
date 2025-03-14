import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Stock from "../models/Stock.js";

dotenv.config();

const router = express.Router();
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Fetch stock price & sentiment from Alpha Vantage
router.get("/stocks/:symbol", async (req, res) => {
    const { symbol } = req.params;

    try {
        // Fetch stock price
        const stockUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const stockResponse = await axios.get(stockUrl);
        const timeSeries = stockResponse.data["Time Series (Daily)"];

        if (!timeSeries) {
            return res.status(400).json({ error: `No stock data found for ${symbol}.` });
        }

        const latestDate = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestDate];

        // Fetch sentiment from Alpha Vantage
        const sentimentUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const sentimentResponse = await axios.get(sentimentUrl);
        const articles = sentimentResponse.data.feed?.slice(0, 5) || [];

        let sentimentScore = 0; // Default to neutral sentiment
        if (articles.length > 0) {
            const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };

            articles.forEach(article => {
                if (article.overall_sentiment_label === "positive") sentimentCounts.positive++;
                if (article.overall_sentiment_label === "neutral") sentimentCounts.neutral++;
                if (article.overall_sentiment_label === "negative") sentimentCounts.negative++;
            });

            // Determine dominant sentiment
            const dominantSentiment = Object.keys(sentimentCounts).reduce((a, b) =>
                sentimentCounts[a] > sentimentCounts[b] ? a : b
            );

            // Convert sentiment to numeric value
            const sentimentMap = { negative: -1, neutral: 0, positive: 1 };
            sentimentScore = sentimentMap[dominantSentiment] || 0;
        }

        // Check if stock already exists for the latest date
        const existingStock = await Stock.findOne({ symbol, date: new Date(latestDate) });

        if (!existingStock) {
            const stockEntry = new Stock({
                symbol,
                date: new Date(latestDate),
                open: parseFloat(latestData["1. open"]),
                high: parseFloat(latestData["2. high"]),
                low: parseFloat(latestData["3. low"]),
                close: parseFloat(latestData["4. close"]),
                volume: parseInt(latestData["5. volume"]),
                sentimentScore,
            });

            await stockEntry.save();
            console.log(`Saved stock & sentiment data for ${symbol}`);
        } else {
            console.log(`Stock data for ${symbol} already exists. Skipping save.`);
        }

        res.json({ symbol, sentimentScore, stockData: latestData });

    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        res.status(500).json({ error: "Failed to fetch stock & sentiment data", details: error.message });
    }
});

// Fetch stock history
router.get("/stocks/history/:symbol", async (req, res) => {
    try {
        const { symbol } = req.params;
        const stockHistory = await Stock.find({ symbol }).sort({ date: -1 });

        if (!stockHistory.length) {
            return res.status(404).json({ error: `No historical data found for ${symbol}.` });
        }

        res.json(stockHistory);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve stock history", details: error.message });
    }
});

// Fetch market news
router.get("/news/:symbol", async (req, res) => {
    const { symbol } = req.params;
    const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    try {
        const response = await axios.get(url);
        const articles = response.data.feed?.slice(0, 5) || [];

        if (!articles.length) {
            return res.status(404).json({ error: `No news found for ${symbol}.` });
        }

        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch news data", details: error.message });
    }
});

export default router;
