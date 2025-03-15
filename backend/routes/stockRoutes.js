import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Stock from "../models/Stock.js";

dotenv.config();

const router = express.Router();
const FMP_API_KEY = process.env.FMP_API_KEY;

// Fetch stock price from Financial Modeling Prep
router.get("/stocks/:symbol", async (req, res) => {
    const { symbol } = req.params;

    try {
        // Fetch stock data from Financial Modeling Prep
        const stockUrl = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`;
        const stockResponse = await axios.get(stockUrl);

        console.log(`Stock API Response for ${symbol}:`, JSON.stringify(stockResponse.data, null, 2));

        if (!stockResponse.data || stockResponse.data.length === 0) {
            return res.status(400).json({ error: `No stock data found for ${symbol}.` });
        }

        const stockData = stockResponse.data[0];

        // Convert timestamp to Date object
        const stockDate = new Date(stockData.timestamp * 1000); 

        // Check if stock already exists for the latest date
        const existingStock = await Stock.findOne({ symbol, date: stockDate });

        if (!existingStock) {
            const stockEntry = new Stock({
                symbol,
                name: stockData.name,
                date: stockDate,
                open: stockData.open,
                high: stockData.dayHigh,
                low: stockData.dayLow,
                close: stockData.price,
                previousClose: stockData.previousClose,
                changesPercentage: stockData.changesPercentage,
                change: stockData.change,
                yearHigh: stockData.yearHigh,
                yearLow: stockData.yearLow,
                marketCap: stockData.marketCap,
                priceAvg50: stockData.priceAvg50,
                priceAvg200: stockData.priceAvg200,
                exchange: stockData.exchange,
                volume: stockData.volume,
                avgVolume: stockData.avgVolume,
                eps: stockData.eps,
                pe: stockData.pe,
                earningsAnnouncement: stockData.earningsAnnouncement,
                sharesOutstanding: stockData.sharesOutstanding,
            });

            await stockEntry.save();
            console.log(`Saved full stock data for ${symbol}`);
        } else {
            console.log(`Stock data for ${symbol} already exists. Skipping save.`);
        }

        res.json({ symbol, stockData });

    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        res.status(500).json({ error: "Failed to fetch stock data", details: error.message });
    }
});

export default router;
