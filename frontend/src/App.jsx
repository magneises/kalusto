import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import Navbar from "./components/navbar/Navbar";
import AppRoutes from "./components/navbar/AppRoutes";
import StockTicker from "./components/StockTicker/StockTicker";


function App() {
    return (
        <Router>
            <StockTicker /> 
            <Navbar />
            <AppRoutes />

        </Router>
    );
};

export default App;
