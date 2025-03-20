import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <div className={styles.NavbarContainer}>
        <div className={styles.logoContainer}>Kalusto Demo</div>
        <nav className={styles.navLinks}>
          <Link to="/">Search</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/history">History</Link>
          <Link to="/news">News</Link>
          <Link to="/watchlist">Watchlist</Link>
        </nav>
        <div className={styles.userInformation}>
          <button>Get Started</button>
        </div>
    </div>
  );
}

export default Navbar;
