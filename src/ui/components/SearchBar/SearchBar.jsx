import { useEffect, useState } from "react";
import "./Searchbar.css";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

function SearchBar({initialQuery ="", onSearch}) {
  const [value, setValue] = useState(initialQuery);

  useEffect(()=> {
    setValue(initialQuery);    
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onSearch) return;

    const trimmed = value.trim();
    onSearch(trimmed);
  };

  return (
    <form className="searchBox" onSubmit={handleSubmit}>
      <input className="SearchInput" 
        type="text" 
        placeholder="Search"  
        value={value} onChange={(e) => setValue(e.target.value)} 
      />
      <button type="submit" className="searchIconButton" aria-label="Search">
        <HiMiniMagnifyingGlass />
      </button>
    </form>
  );
}

export default SearchBar;
