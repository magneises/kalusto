import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsPage = () => {
    const [symbol, setSymbol] = useState("AAPL");
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`http://localhost:3200/api/news/${symbol}`);
                setNews(response.data);
            } catch (error) {
                console.error("Failed to fetch news", error);
            }
        };

        fetchNews();
    }, [symbol]);

    return (
        <div>
            <h1>{symbol} Stock News</h1>
            <input
                type="text"
                placeholder="Enter stock symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
            <ul>
                {news.map((article, index) => (
                    <li key={index}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            {article.title} ({article.overall_sentiment_label})
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NewsPage;
