import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(...registerables);

const DashboardPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const symbol = queryParams.get("symbol") || "AAPL";
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState("1W"); // Default view to 1 Week

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`http://localhost:3200/api/stocks/history/${symbol}?range=${view}`);
                
                console.log("API Response:", response.data);

                if (!response.data || !response.data.stockData || response.data.stockData.length === 0) {
                    throw new Error("Invalid or empty stock data received");
                }

                const stockData = response.data.stockData;

                // Extract stock prices over the selected range
                const dates = stockData.map(day => new Date(day.date).toLocaleDateString());
                const closingPrices = stockData.map(day => day.close);

                setChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: `Stock Price (${view})`,
                            data: closingPrices,
                            borderColor: "blue",
                            backgroundColor: "rgba(0, 0, 255, 0.1)",
                        },
                    ],
                });
            } catch (error) {
                console.error("Failed to fetch stock data", error);
                setError(error.message);
            }

            setLoading(false);
        };

        fetchData();
    }, [symbol, view]);

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h1>{symbol} Dashboard</h1>
            
            {/* View Selector Dropdown */}
            <select value={view} onChange={(e) => setView(e.target.value)}>
                <option value="LIVE">Live</option>
                <option value="1D">1 Day</option>
                <option value="1W">1 Week</option>
                <option value="1M">1 Month</option>
                <option value="3M">3 Months</option>
                <option value="YTD">Year to Date</option>
                <option value="1Y">1 Year</option>
                <option value="4Y">4 Years</option>
                <option value="ALL">All Years</option>
            </select>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {chartData && !loading && !error ? (
                <div style={{ width: "100%", height: "400px" }}>
                    <Line 
                        data={chartData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    title: { display: true, text: "Stock Price ($)" }
                                },
                                x: {
                                    title: { display: true, text: "Date" }
                                }
                            }
                        }} 
                    />
                </div>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
};

export default DashboardPage;
