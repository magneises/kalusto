import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/navbar/Navbar";
import AppRoutes from "./components/navbar/AppRoutes";
import StockTicker from "./components/StockTicker/StockTicker";
import AnnouncementBar from "./components/AnnouncementBar/AnnouncementBar";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <StockTicker />
                <AppRoutes />
                <AnnouncementBar />
            </Router>
        </AuthProvider>
    );
}

export default App;
