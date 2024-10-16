import React, { useState } from 'react';
import './DamageSearch.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DamageSearch = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [placeholder, setPlaceholder] = useState('Search by ID');

    const handleChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        if (onSearch) {
            onSearch(newQuery);
        }
    };

    const handleFocus = () => {
        setPlaceholder('');
    };

    const handleBlur = () => {
        if (query === '') {
            setPlaceholder('Search by ID');
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder={placeholder}
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

export default DamageSearch;
