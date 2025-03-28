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
  
      res.json(favorites);
    } catch (error) {
      console.error("Failed to get news favorites:", error);
      res.status(500).json({ message: "Server error" });
    }
  });


// DELETE: Remove a specific article by _id, articleTitle, or articleUrl
router.delete("/:userId", async (req, res) => {
    const { userId } = req.params;
    const { articleId, articleTitle, articleUrl } = req.body;
  
    if (!articleId && !articleTitle && !articleUrl) {
      return res.status(400).json({ message: "Please provide articleId, articleTitle, or articleUrl to delete." });
    }
  
    try {
      const favorites = await NewsPageFavorites.findOne({ userId });
  
      if (!favorites) {
        return res.status(404).json({ message: "No favorites found for this user." });
      }
  
      const originalLength = favorites.newsArticles.length;
  
      // Filter articles based on which field is provided (articleId, articleTitle, articleUrl)
      favorites.newsArticles = favorites.newsArticles.filter(article => {
        if (articleId) {
          return article._id.toString() !== articleId;
        }
        if (articleTitle) {
          return article.articleTitle !== articleTitle;
        }
        if (articleUrl) {
          return article.articleUrl !== articleUrl;
        }
        return true;
      });
  
      if (favorites.newsArticles.length === originalLength) {
        return res.status(404).json({ message: "No matching article found to delete." });
      }
  
      await favorites.save();
      res.json({ message: "Article removed successfully", updatedFavorites: favorites.newsArticles });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete article", error: err.message });
    }
  });
  
  

  