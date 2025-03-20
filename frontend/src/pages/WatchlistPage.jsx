import React, { useEffect, useState } from "react";

const WatchlistPage = () => {
    const [stocks, setStocks] = useState([]);
    const [notes, setNotes] = useState({}); // Local state for notes
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name"); // Default sorting by name
    const [currentPage, setCurrentPage] = useState(1);
    const stocksPerPage = 5; // Number of stocks to display per page
    const userId = "user123";

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const response = await fetch(`http://localhost:3200/api/watchlist/${userId}`);
                const data = await response.json();
                setStocks(data.stocks || []);

                // Initialize local notes state
                const initialNotes = {};
                data.stocks.forEach(stock => {
                    initialNotes[stock.symbol] = stock.note || "";
                });
                setNotes(initialNotes);
            } catch (error) {
                console.error("Error fetching watchlist:", error);
            }
        };
        fetchWatchlist();
    }, []);

    const handleRemoveStock = async (symbol) => {
        await fetch(`http://localhost:3200/api/watchlist/${userId}/${symbol}`, {
            method: "DELETE",
        });
        setStocks(stocks.filter(stock => stock.symbol !== symbol));
    };

    let debounceTimer;
    const handleNoteChange = (symbol, newNote) => {
        setNotes(prevNotes => ({
            ...prevNotes,
            [symbol]: newNote
        }));

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            await fetch(`http://localhost:3200/api/watchlist/${userId}/${symbol}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ note: newNote }),
            });

            setStocks(stocks.map(stock =>
                stock.symbol === symbol ? { ...stock, note: newNote } : stock
            ));
        }, 15000); // 15 second delay before saving
    };

    // Filter stocks
    const filteredStocks = stocks
        .filter(stock => 
            stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "priceHighToLow") return b.price - a.price;
            if (sortBy === "priceLowToHigh") return a.price - b.price;
            if (sortBy === "recentlyAdded") return new Date(b.dateAdded) - new Date(a.dateAdded); // ✅ Sort by most recent
            return 0;
        });

    // Pagination logic
    const indexOfLastStock = currentPage * stocksPerPage;
    const indexOfFirstStock = indexOfLastStock - stocksPerPage;
    const currentStocks = filteredStocks.slice(indexOfFirstStock, indexOfLastStock);

    return (
        <div>
            <h1>Your Watchlist</h1>

            {/* Search and Sorting Options */}
            <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
    <option value="name">Sort by Name</option>
    <option value="priceHighToLow">Price: High-Low</option>
    <option value="priceLowToHigh">Price: Low-High</option>
    <option value="recentlyAdded">Most Recently Added</option>
</select>

            {currentStocks.length > 0 ? (
                <ul>
                    {currentStocks.map(stock => (
                        <li key={stock.symbol}>
                            <div>
                                <strong>{stock.name} ({stock.symbol})</strong> - ${stock.price.toFixed(2)}
                            </div>
                            
                            <textarea
                                value={notes[stock.symbol] || ""}
                                placeholder="Add a note..."
                                onChange={(e) => handleNoteChange(stock.symbol, e.target.value)}
                            />

                            <button onClick={() => handleRemoveStock(stock.symbol)}>Remove</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No stocks in watchlist</p>
            )}

            {/* Pagination Controls */}
            <div>
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </button>
                <span> Page {currentPage} of {Math.ceil(filteredStocks.length / stocksPerPage)} </span>
                <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={indexOfLastStock >= filteredStocks.length}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default WatchlistPage;
