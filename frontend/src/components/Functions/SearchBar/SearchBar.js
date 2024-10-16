import React, { useState } from 'react';
import './SearchBar.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchBar = ({ onSearch, placeholder }) => {
    const [query, setQuery] = useState('');
    const [placeholderText, setPlaceholderText] = useState(placeholder);

    const handleChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        if (onSearch) {
            onSearch(newQuery);
        }
    };

    const handleFocus = () => {
        setPlaceholderText('');  
    };

    const handleBlur = () => {
        if (query === '') {
            // Resets the placeholder if input is empty
            setPlaceholderText(placeholder);  
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder={placeholderText}
                value={query}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="search-input"
            />
            <button type="button" className="search-button">
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </div>
    );
};

export default SearchBar;
