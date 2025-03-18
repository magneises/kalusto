import React, { useEffect, useState } from "react";
import axios from "axios";

function NewsPage() {
    const [symbol, setSymbol] = useState("AAPL");
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`http://localhost:3200/api/news/${symbol}`);
                console.log("News API Response:", response.data);
                setNews(response.data.news || []);
            } catch (error) {
                console.error("Failed to fetch news", error);
            }
        };

        fetchNews();
    }, [symbol]);

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <h1>{symbol} Stock News</h1>
            <input
                type="text"
                placeholder="Enter stock symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
            />

            {news.length > 0 ? (
                news.map((article) => (
                    <div key={article.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "15px" }}>
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        <p><strong>Publisher:</strong> {article.publisher}</p>
                        <p><strong>Sentiment:</strong> {article.sentiment}</p>
                        {article.image_url && <img src={article.image_url} alt="news" style={{ width: "100%", height: "auto", maxHeight: "200px", objectFit: "cover" }} />}
                        <br />
                        <a href={article.article_url} target="_blank" rel="noopener noreferrer">Read More</a>
                    </div>
                ))
            ) : (
                <p>No news available</p>
            )}
        </div>
    );
}

export default NewsPage;
