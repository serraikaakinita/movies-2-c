import { useEffect, useState } from "react";
import "./Searchbar.css";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

function SearchBar(props) {
  return (
    <div className="searchBox">
      <input
        className="searchInput"
        type="text"
        name=""
        placeholder="Search"
        value={props.query}
        onChange={(e) => props.setQuery(e.target.value)}
      ></input>
      <button type="submit" className="searchIconButton" aria-label="Search">
        <HiMiniMagnifyingGlass />
      </button>
    </div>
  );
}

export default SearchBar;
