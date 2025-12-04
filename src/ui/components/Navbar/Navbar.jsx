import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Movies2c</h1>

      <div className="navbar_links">
        <Link to="/">Movies</Link>
        <Link to="/">Actors</Link>
        <Link to="/">Directors</Link>

        <Link to="/login">
          <button className="login-btn">Login / Sign up</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
