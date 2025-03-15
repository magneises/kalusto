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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`http://localhost:3200/api/stocks/${symbol}`);
                
                console.log("API Response:", response.data); // Log the API response

                if (!response.data || !response.data.stockData) {
                    throw new Error("Invalid stock data received");
                }

                const stock = response.data.stockData;

                if (!stock.date || !stock.close) {
                    console.log("Stock data is missing fields:", stock); // Log what is missing
                    throw new Error("Stock data missing required fields.");
                }

                setChartData({
                    labels: [new Date(stock.date).toLocaleDateString()],
                    datasets: [
                        {
                            label: "Stock Price",
                            data: [stock.close],
                            borderColor: "blue",
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
    }, [symbol]);

    return (
        <div>
            <h1>{symbol} Dashboard</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {chartData && !loading && !error ? <Line data={chartData} /> : <p>No data available.</p>}
        </div>
    );
};

export default DashboardPage;
