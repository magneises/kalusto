import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="NavbarContainer">
        <h2>This is the Navbar component</h2>
        <nav>
          <div className="logo">Kalusto Demo</div>
          <Link to="/">Search</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/history">History</Link>
          <Link to="/news">News</Link>
        </nav>
    </div>
  );
}

export default Navbar;
