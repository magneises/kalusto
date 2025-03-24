
import mongoose from "mongoose";

const NewsPageFavoritesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  newsArticles: [
    {
      articleTitle: { type: String, required: true },
      articlePublisher: { type: String, required: true },
      articleSentiment: { type: String },
      articleUrl: { type: String, required: true },
      dateAdded: { type: Date, default: Date.now },
    }
  ]
});

export default mongoose.model("NewsPageFavorites", NewsPageFavoritesSchema);
