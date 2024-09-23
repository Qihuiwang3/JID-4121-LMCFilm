import React, { useState } from 'react';
import './SearchBar.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (onSearch) {
      onSearch(newQuery); // Call onSearch as the user types
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by Name"
        value={query}
        onChange={handleChange} // Use onChange instead of onSubmit
        className="search-input"
      />
      <button type="button" className="search-button">
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
};

export default SearchBar;
