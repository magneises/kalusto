import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./StockTicker.module.css"; // Correct CSS Module Import

const StockTicker = () => {
    const [tickers, setTickers] = useState([]);

    useEffect(() => {
        const fetchTickerData = async () => {
            try {
                const response = await axios.get("http://localhost:3200/api/ticker"); // Update with your API route
                setTickers(response.data.tickers || []);
            } catch (error) {
                console.error("Failed to fetch stock ticker data", error);
            }
        };

        fetchTickerData();
        const interval = setInterval(fetchTickerData, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <div className={styles.tickerContainer}>
            <div className={styles.tickerWrapper}>
                <div className={styles.tickerContent}>
                    {tickers.length > 0 ? (
                        tickers.map((stock, index) => (
                            <span key={index} className={styles.tickerItem}>
                                <strong>{stock.symbol}</strong>: ${stock.price.toFixed(2)} 
                                <span className={stock.change >= 0 ? styles.green : styles.red}>
                                    {stock.change >= 0 ? ` ▲${stock.change.toFixed(2)}%` : ` ▼${Math.abs(stock.change).toFixed(2)}%`}
                                </span>
                            </span>
                        ))
                    ) : (
                        <span>Loading stock ticker...</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockTicker;
