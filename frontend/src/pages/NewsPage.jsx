import React, { useEffect, useState } from "react";
import axios from "axios";

function NewsPage() {
    const [symbol, setSymbol] = useState("AAPL");
    const [inputValue, setInputValue] = useState("AAPL"); // Separate input field
    const [news, setNews] = useState([]);

    const fetchNews = async (searchSymbol) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/api/news/${searchSymbol}`);
            console.log("News API Response:", response.data);
            setNews(response.data.news || []);
        } catch (error) {
            console.error("Failed to fetch news", error);
            setNews([]); // Handle empty response
        }
    };

    useEffect(() => {
        fetchNews(symbol);
    }, [symbol]); // Fetch news when symbol changes

    // Handle search on button click
    const handleSearch = () => {
        if (inputValue.trim()) {
            setSymbol(inputValue.trim().toUpperCase()); // Update symbol to trigger useEffect
        }
    };

    // Handle search on Enter key press
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <h1>{symbol} Stock News</h1>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Enter stock symbol"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress} // Trigger search on Enter
                    style={{ flex: "1", padding: "8px" }}
                />
                <button onClick={handleSearch} style={{ padding: "8px 15px", cursor: "pointer" }}>
                    Search
                </button>
            </div>

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
