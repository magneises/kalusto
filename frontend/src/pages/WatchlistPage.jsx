import React, { useEffect, useState } from "react";

const WatchlistPage = () => {
    const [stocks, setStocks] = useState([]);
    const [notes, setNotes] = useState({}); // Local state for notes
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

    return (
        <div>
            <h1>Your Watchlist</h1>
            {stocks.length > 0 ? (
                <ul>
                    {stocks.map(stock => (
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
        </div>
    );
};

export default WatchlistPage;
