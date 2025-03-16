import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import Navbar from "./components/navbar/Navbar";
import AppRoutes from "./components/navbar/AppRoutes";


function App() {
    return (
        <Router>
            <Navbar />
            <AppRoutes />
        </Router>
    );
};

export default App;
