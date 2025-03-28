import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import NewsFavoritesPage from "../../pages/NewsPageFavorites";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  console.log("Navbar user:", user);

  return (
    <div className={styles.NavbarContainer}>
      <div className={styles.logoContainer}>Kalusto Demo</div>

      <nav className={styles.navLinks}>
        {/* <Link to="/">Search</Link> */}
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/history">History</Link>
        <Link to="/news">News</Link>
        <Link to="/watchlist">Watchlist</Link>
        <Link to="/newsPageFavorites">Favorite News</Link>
        {user && <Link to="/profile">Profile</Link>}
      </nav>

      <div className={styles.userInformation}>
        {user ? (
          <>
            <Link to="/profile">
              <button>Profile</button>
            </Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className={styles.btn1}>Login</button>
            </Link>
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
