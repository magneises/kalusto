import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";

const DashboardPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const symbol = queryParams.get("symbol") || "AAPL";
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3200/api/stocks/${symbol}`);
                const stock = response.data;
                setChartData({
                    labels: [stock.date],
                    datasets: [
                        {
                            label: "Stock Price",
                            data: [stock.close],
                            borderColor: "blue",
                        },
                        {
                            label: "Sentiment Score",
                            data: [stock.sentimentScore],
                            borderColor: "red",
                        },
                    ],
                });
            } catch (error) {
                console.error("Failed to fetch stock data", error);
            }
            setLoading(false);
        };

        fetchData();
    }, [symbol]);

    return (
        <div>
            <h1>{symbol} Dashboard</h1>
            {loading ? <p>Loading...</p> : <Line data={chartData} />}
        </div>
    );
};

export default DashboardPage;
