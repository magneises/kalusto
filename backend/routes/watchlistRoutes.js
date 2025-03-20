import express from "express";
import Watchlist from "../models/Watchlist.js";

const router = express.Router();

// GET /api/watchlist/:userId - Fetch user's watchlist
router.get("/:userId", async (req, res) => {
    try {
        const watchlist = await Watchlist.findOne({ userId: req.params.userId });
        if (!watchlist) return res.json({ stocks: [] }); 
        res.json(watchlist);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch watchlist" });
    }
});



// POST /api/watchlist/:userId - Add a stock to the watchlist
router.post("/:userId", async (req, res) => {
    const { symbol, name, price, note = "" } = req.body;
    try {
        let watchlist = await Watchlist.findOne({ userId: req.params.userId });

        if (!watchlist) {
            watchlist = new Watchlist({ userId: req.params.userId, stocks: [] });
        }

        // Prevent duplicates
        if (watchlist.stocks.some(stock => stock.symbol === symbol)) {
            return res.status(400).json({ error: "Stock already in watchlist" });
        }

        watchlist.stocks.push({ symbol, name, price, note });
        await watchlist.save();
        res.json({ message: `Stock ${symbol} added to watchlist.`, watchlist });
    } catch (error) {
        res.status(500).json({ error: "Failed to add stock to watchlist" });
    }
});



// PUT /api/watchlist/:userId/:symbol - Update stock in watchlist (price)
router.put("/:userId/:symbol", async (req, res) => {
    const { note } = req.body;
    try {
        let watchlist = await Watchlist.findOne({ userId: req.params.userId });

        if (!watchlist) {
            return res.status(404).json({ error: "Watchlist not found" });
        }

        const stock = watchlist.stocks.find(stock => stock.symbol === req.params.symbol);
        if (!stock) {
            return res.status(404).json({ error: "Stock not found in watchlist" });
        }

        stock.note = note;  // Updating the note
        await watchlist.save();
        res.json({ message: `Note updated for ${req.params.symbol}`, watchlist });
    } catch (error) {
        res.status(500).json({ error: "Failed to update note" });
    }
});



// DELETE /api/watchlist/:userId/:symbol - Remove stock from watchlist
router.delete("/:userId/:symbol", async (req, res) => {
    try {
        let watchlist = await Watchlist.findOne({ userId: req.params.userId });

        if (!watchlist) {
            return res.status(404).json({ error: "Watchlist not found" });
        }

        watchlist.stocks = watchlist.stocks.filter(stock => stock.symbol !== req.params.symbol);
        await watchlist.save();
        res.json({ message: `Stock ${req.params.symbol} removed`, watchlist });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove stock from watchlist" });
    }
});

export default router;
