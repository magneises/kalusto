import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import NewsPage from "./pages/NewsPage";
import "./App.css";

const App = () => {
    return (
        <Router>
            <div className="container">
                <nav>
                    <Link to="/">Search</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/history">History</Link>
                    <Link to="/news">News</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<SearchPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/news" element={<NewsPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
