import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryPage = () => {
    const [symbol, setSymbol] = useState("AAPL");
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:3200/api/stocks/history/${symbol}`);
                setHistory(response.data);
            } catch (error) {
                console.error("Failed to fetch stock history", error);
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
                    {history.map((entry) => (
                        <tr key={entry.date}>
                            <td>{entry.date}</td>
                            <td>{entry.open}</td>
                            <td>{entry.high}</td>
                            <td>{entry.low}</td>
                            <td>{entry.close}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryPage;
