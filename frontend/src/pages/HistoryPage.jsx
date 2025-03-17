import React, { useEffect, useState } from "react";
import axios from "axios";

function HistoryPage() {
    const [symbol, setSymbol] = useState("AAPL");
    const [history, setHistory] = useState([]);

    useEffect(() => {
const fetchHistory = async () => {
    try {
        const response = await axios.get(`http://localhost:3200/api/stocks/history/${symbol}`);
        console.log("API Response in Frontend:", response.data);

        if (Array.isArray(response.data.stockData)) {
            response.data.stockData.forEach(entry => console.log("History Entry:", entry));
            setHistory(response.data.stockData);
        } else {
            console.warn("Unexpected API response structure:", response.data);
            setHistory([]); // Prevents crashing if response is unexpected
        }
    } catch (error) {
        console.error("Failed to fetch stock history", error);
        setHistory([]); 
    }
};

    
        fetchHistory();
    }, [symbol]);

    return (
        <div>
            <h1>{symbol} Stock History</h1>
            <input
                type="text"
                placeholder="Enter stock symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(history) && history.length > 0 ? (
                        history.map((entry, index) => {
                            console.log("History Entry:", entry);
                            return (
                                <tr key={index}>
                                    <td>{entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}</td>
                                    <td>{entry.open ?? "N/A"}</td>
                                    <td>{entry.high ?? "N/A"}</td>
                                    <td>{entry.low ?? "N/A"}</td>
                                    <td>{entry.close ?? "N/A"}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5">No historical data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default HistoryPage;
