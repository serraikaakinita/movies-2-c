import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import Button from "../../Button";
import logo from "../../../assets/movies2c-logo.png";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = (props) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  ////
  const user = props.user;
  const onLogout = props.onLogout;
  ////
  const displayName = user?.userName || user?.username || user?.email || "";

  const avatarLetter =
    user?.username?.[0]?.toUpperCase() ??
    displayName?.[0]?.toUpperCase() ??
    "U";

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  const handleLogoutClick = () => {
    onLogout?.();
    closeMenu();
  };

  // SEARCH
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    navigate(`/?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchMouseEnter = () => setIsSearchOpen(true);

  const handleSearchMouseLeave = () => {
    if (!isSearchFocused && !searchTerm) setIsSearchOpen(false);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setIsSearchOpen(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    if (!searchTerm) setIsSearchOpen(false);
  };

  const isSearchActuallyOpen = isSearchOpen || !!searchTerm;

  return (
    <header className="nav-wrapper">
      <nav className={"navbar" + (isScrolled ? " navbar--scrolled" : "")}>
        {/* Logo */}
        <div className="nav-left">
          <NavLink to="/" className="nav-logo" onClick={closeMenu}>
            <img src={logo} alt="Movies2C logo" className="nav-logo-img" />
            <span className="nav-logo-text">MOVIES2C</span>
          </NavLink>
        </div>

        {/* links */}
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link--active" : "")
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/movies"
              end
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link--active" : "")
              }
            >
              Movies
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/tv-series"
              end
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link--active" : "")
              }
            >
              TV Series
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/quizzes"
              end
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link--active" : "")
              }
            >
              Quizzes
            </NavLink>
          </li>
        </ul>

        <div className="nav-right">
          <SearchBar query={props.query} setQuery={props.setQuery} />
          {/* search
          <form
            className={
              "nav-search-wrapper" +
              (isSearchActuallyOpen ? " nav-search-wrapper--open" : "")
            }
            onSubmit={handleSearchSubmit}
            onMouseEnter={handleSearchMouseEnter}
            onMouseLeave={handleSearchMouseLeave}
          >
            <input
              type="text"
              placeholder="Search movies..."
              className="nav-search-input"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />

            <button
              type="submit"
              className="nav-search-button"
              aria-label="Search"
            >
              <HiMiniMagnifyingGlass className="nav-search-icon" />
            </button>
          </form> */}

          {user ? (
            <div className="nav-user dropdown">
              <button className="nav-profile" type="button">
                <span className="nav-avatar">{avatarLetter}</span>
                <span className="nav-username">{displayName}</span>
              </button>

              <div className="dropdown-menu">
                <NavLink
                  to="/profile"
                  className="dropdown-item"
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>

                <NavLink
                  to="/feed"
                  className="dropdown-item"
                  onClick={closeMenu}
                >
                  feed
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="dropdown-item dropdown-item--danger"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              end
              onClick={closeMenu}
              className="nav-mobile-link nav-mobile-link--accent"
            >
              Sign In
            </NavLink>
          )}

          {/* BURGER (mobile) */}
          <button
            className={"nav-burger" + (open ? " nav-burger--open" : "")}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={"nav-mobile-menu" + (open ? " nav-mobile-menu--open" : "")}
      >
        <NavLink
          to="/"
          end
          onClick={closeMenu}
          className={({ isActive }) =>
            "nav-mobile-link" + (isActive ? " nav-mobile-link--active" : "")
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/movies"
          end
          onClick={closeMenu}
          className={({ isActive }) =>
            "nav-mobile-link" + (isActive ? " nav-mobile-link--active" : "")
          }
        >
          Movies
        </NavLink>

        <NavLink
          to="/tv-series"
          end
          onClick={closeMenu}
          className={({ isActive }) =>
            "nav-mobile-link" + (isActive ? " nav-mobile-link--active" : "")
          }
        >
          TV Series
        </NavLink>

        <NavLink
          to="/quizzes"
          end
          onClick={closeMenu}
          className={({ isActive }) =>
            "nav-mobile-link" + (isActive ? " nav-mobile-link--active" : "")
          }
        >
          Quizzes
        </NavLink>

        {user ? (
          <>
            <NavLink
              to="/profile"
              onClick={closeMenu}
              className="nav-mobile-link"
            >
              Profile
            </NavLink>
            <NavLink to="/feed" onClick={closeMenu} className="nav-mobile-link">
              feed
            </NavLink>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="nav-mobile-link nav-logout"
            >
              Log out
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            end
            onClick={closeMenu}
            className="nav-mobile-link nav-mobile-link--accent"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
