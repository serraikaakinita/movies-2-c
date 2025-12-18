import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Button from "../../Button";
import { CiUser } from "react-icons/ci";
import Row from "../../Row";

const Navbar = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  useEffect(() => {
    const loggedIn = localStorage.getItem("access_token");
    if (loggedIn) {
      setIsUserLoggedIn(true);
    }
  }, []);
  return (
    <nav className="navbar">
      <h1>Movies2c</h1>

      <div className="navbar_links">
        <Link to="/home">Home</Link>
        <Link to="/quizzes">Quizzes</Link> 

        {isUserLoggedIn ? (
          <Row gap="0.5rem">
            <Link to="/profile">
              <CiUser></CiUser>user
            </Link>
          </Row>
        ) : (
          <Link to="/signup" className="signup-button-wrapper">
            <Button>Signup</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
