
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function NewsFavoritesPage() {
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !(user.id || user._id)) {
        console.warn("User or user._id is missing:", user);
        return;
      }

        const fetchFavorites = async () => {
            setLoading(true);
            try {
              const response = await axios.get(`${import.meta.env.VITE_API}/api/news-favorites/${user.id}`);
                setFavorites(response.data.newsArticles || []);
            } catch (err) {
                console.error("Failed to fetch favorites", err);
                setError("Failed to load favorite news articles.");
            }
            setLoading(false);
        };

        fetchFavorites();
    }, [user]);

    if (!user) return <p>Please log in to view your favorite news articles.</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <h1>My Saved News Articles</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && favorites.length === 0 && <p>No favorites saved yet.</p>}

            {favorites.map((article, index) => (
                <div key={index} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "15px" }}>
                    <h3>{article.articleTitle}</h3>
                    <p><strong>Publisher:</strong> {article.articlePublisher}</p>
                    <p><strong>Sentiment:</strong> {article.articleSentiment || "N/A"}</p>
                    <a href={article.articleUrl} target="_blank" rel="noopener noreferrer">Read Full Article</a>
                    
                    <p style={{ fontSize: "0.9em", color: "gray" }}>Saved on: {new Date(article.dateAdded).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}

export default NewsFavoritesPage;
