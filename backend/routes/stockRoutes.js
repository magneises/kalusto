import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Stock from "../models/Stock.js";

dotenv.config();

const router = express.Router();
const FMP_API_KEY = process.env.FMP_API_KEY;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

// Fetch stock price from Financial Modeling Prep
router.get("/stocks/:symbol", async (req, res) => {
    const { symbol } = req.params;

    try {
        const stockUrl = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`;
        const stockResponse = await axios.get(stockUrl);

        if (!stockResponse.data || stockResponse.data.length === 0) {
            return res.status(400).json({ error: `No stock data found for ${symbol}.` });
        }

        const stockData = stockResponse.data[0];

        // Identify missing fields
        let missingFields = [];
        if (!stockData.timestamp) missingFields.push("timestamp");
        if (!stockData.price && !stockData.previousClose) missingFields.push("close (price or previousClose)");
        if (!stockData.open) missingFields.push("open");
        if (!stockData.dayHigh) missingFields.push("dayHigh");
        if (!stockData.dayLow) missingFields.push("dayLow");
        if (!stockData.volume) missingFields.push("volume");

        if (missingFields.length > 0) {
            console.warn(`Warning: Missing fields for ${symbol}:`, missingFields);
        }

        // Ensure date exists by converting `timestamp` or using today's date
        const stockDate = stockData.timestamp
            ? new Date(stockData.timestamp * 1000).toISOString()
            : new Date().toISOString();

        // Ensure `close` is present by using `price` or `previousClose`
        const stockClose = stockData.price ?? stockData.previousClose ?? null;

        res.json({
            symbol,
            stockData: {
                date: stockDate,
                symbol: stockData.symbol,
                name: stockData.name,
                price: stockData.price,
                open: stockData.open ?? null,
                high: stockData.dayHigh ?? null,
                low: stockData.dayLow ?? null,
                close: stockClose,
                previousClose: stockData.previousClose ?? null,
                changesPercentage: stockData.changesPercentage ?? null,
                change: stockData.change ?? null,
                yearHigh: stockData.yearHigh ?? null,
                yearLow: stockData.yearLow ?? null,
                marketCap: stockData.marketCap ?? null,
                priceAvg50: stockData.priceAvg50 ?? null,
                priceAvg200: stockData.priceAvg200 ?? null,
                exchange: stockData.exchange ?? null,
                volume: stockData.volume ?? null,
                avgVolume: stockData.avgVolume ?? null,
                eps: stockData.eps ?? null,
                pe: stockData.pe ?? null,
                earningsAnnouncement: stockData.earningsAnnouncement ?? null,
                sharesOutstanding: stockData.sharesOutstanding ?? null,
            }
        });

    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        res.status(500).json({ error: "Failed to fetch stock data", details: error.message });
    }
});


// Stock History Selection
router.get("/stocks/history/:symbol", async (req, res) => {
    const { symbol } = req.params;
    const { range } = req.query; // Example: ?range=1W

    let days;
    switch (range) {
        case "1D": days = 1; break;
        case "1W": days = 7; break;
        case "1M": days = 30; break;
        case "3M": days = 90; break;
        case "YTD": days = 365; break;
        case "1Y": days = 365; break;
        case "4Y": days = 1460; break;
        case "ALL": days = 5000; break;
        default: days = 7; // Default to 1 week
    }

    try {
        const stockUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${FMP_API_KEY}`;
        const stockResponse = await axios.get(stockUrl);

        console.log("Full API Response from FMP:", JSON.stringify(stockResponse.data, null, 2)); // Debug Full API Response

        if (!stockResponse.data || !stockResponse.data.historical || stockResponse.data.historical.length === 0) {
            return res.status(400).json({ error: `No stock history found for ${symbol}.` });
        }

        // Extract the requested number of trading days
        const historicalData = stockResponse.data.historical.slice(0, days).reverse();

        console.log("Processed Historical Data:", JSON.stringify(historicalData, null, 2)); // Log Processed Data

        res.json({
            symbol,
            stockData: historicalData.map(day => ({
                date: day.date ?? null,
                open: day.open ?? null,
                high: day.high ?? null,
                low: day.low ?? null,
                close: day.close ?? null
            }))
        });

    } catch (error) {
        console.error(`Error fetching historical data for ${symbol}:`, error);
        res.status(500).json({ error: "Failed to fetch stock history", details: error.message });
    }
});


// Stock News Sentiment
router.get("/news/:symbol", async (req, res) => {
    const { symbol } = req.params;
    const url = `https://api.polygon.io/v2/reference/news?ticker=${symbol}&order=desc&limit=10&sort=published_utc&apiKey=${POLYGON_API_KEY}`;

    try {
        const response = await axios.get(url);
        const newsData = response.data.results;

        if (!newsData || newsData.length === 0) {
            return res.status(400).json({ error: `No news found for ${symbol}.` });
        }

        // Analyze sentiment if not included in response
        let analyzedNews = await Promise.all(newsData.map(async (article) => {
            let sentimentScore = null;
            let sentimentLabel = "neutral";

            // Perform sentiment analysis if Polygon doesn't provide it
            if (!article.insights || article.insights.length === 0) {
                const sentimentResponse = await axios.post(
                    "https://api-inference.huggingface.co/models/ProsusAI/finbert",
                    { inputs: article.title },
                    {
                        headers: {
                            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const scores = sentimentResponse.data[0];
                if (scores) {
                    sentimentLabel = scores.positive > scores.negative ? "positive" : "negative";
                    sentimentScore = scores;
                }
            }

            return {
                id: article.id,
                publisher: article.publisher?.name ?? "Unknown",
                title: article.title,
                author: article.author,
                published_utc: article.published_utc,
                article_url: article.article_url,
                tickers: article.tickers,
                description: article.description,
                image_url: article.image_url,
                sentiment: article.insights?.sentiment ?? sentimentLabel,
                sentiment_score: sentimentScore
            };
        }));

        res.json({ symbol, news: analyzedNews });

    } catch (error) {
        console.error(`Error fetching news for ${symbol}:`, error);
        res.status(500).json({ error: "Failed to fetch stock news", details: error.message });
    }
});

export default router;
