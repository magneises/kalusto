// backend/routes/newsFavoritesRoutes.js
import express from "express";
import NewsPageFavorites from "../models/NewsPageFavorites.js";

const router = express.Router();

// POST: Add article to user's favorites
router.post("/:userId", async (req, res) => {
  const { articleTitle, articlePublisher, articleSentiment, articleUrl } = req.body;
  const userId = req.params.userId;

  try {
    let favorites = await NewsPageFavorites.findOne({ userId });

    if (!favorites) {
      favorites = new NewsPageFavorites({ userId, newsArticles: [] });
    }

    favorites.newsArticles.push({ articleTitle, articlePublisher, articleSentiment, articleUrl });
    await favorites.save();

    res.json({ message: "Article added to favorites", favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding article to favorites", error: err.message });
  }
});

export default router;


// GET: Retrieve saved news articles for a user
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const favorites = await NewsPageFavorites.findOne({ userId });
        if (!favorites) {
            return res.status(404).json({ message: "No favorites found for this user." });
        } 
    
        res.json(favorites.newsArticles);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to retrieve favorites", error: err.message });
    }

});