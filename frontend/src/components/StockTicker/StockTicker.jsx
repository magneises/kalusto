import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./StockTicker.module.css";

const StockTicker = () => {
    const [tickers, setTickers] = useState([]);

    useEffect(() => {
        const fetchTickerData = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API+"/api/ticker");
                setTickers(response.data.tickers || []);
            } catch (error) {
                console.error("Failed to fetch stock ticker data", error);
            }
        };

        fetchTickerData();
        const interval = setInterval(fetchTickerData, 3600000); // Refresh every 5 seconds

        return () => clearInterval(interval); 
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
