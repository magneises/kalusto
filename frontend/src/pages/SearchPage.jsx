import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
    const [symbol, setSymbol] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (symbol.length > 0) {
            navigate(`/dashboard?symbol=${symbol.toUpperCase()}`);
        }
    };

    return (
        <div>
            <h1>Stock Market Search</h1>
            <input
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchPage;
