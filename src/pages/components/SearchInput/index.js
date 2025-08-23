import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { getSearchAutocompleteApi } from '~/utils/api';
import { IoSearch, IoSyncSharp } from 'react-icons/io5';

function SearchInput({ placeholder = 'Tìm kiếm...', onSearch = () => {} }) {
    // State
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [loading, setLoading] = useState(false);

    // Context

    // Ref
    const inputRef = useRef(null);
    const suggestionRefs = useRef([]);
    const containerRef = useRef(null);

    // --- HANDLE FUNCTION ---
    // Handle Search Autocomplete (Debounce)
    const debouncedSearch = useCallback(
        debounce(async (searchQuery) => {
            // Kiểm tra người dùng đã nhập keyword chưa
            if (!searchQuery.trim()) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            //
            setLoading(true);
            try {
                // Call API Search Autocomplete
                const res = await getSearchAutocompleteApi(encodeURIComponent(searchQuery), 8);

                if (res?.status === 200 && res?.data?.suggestions) {
                    setSuggestions(res.data.suggestions);
                    setShowSuggestions(true);
                    setSelectedIndex(-1);
                }
            } catch (error) {
                console.error('Search autocomplete error:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300),
        [],
    );
    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };
    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) {
            if (e.key === 'Enter') {
                handleSearch();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => {
                    const newIndex = prev < suggestions.length - 1 ? prev + 1 : 0;
                    setQuery(suggestions[newIndex]?.title || query);
                    return newIndex;
                });
                break;

            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => {
                    const newIndex = prev > 0 ? prev - 1 : suggestions.length - 1;
                    setQuery(suggestions[newIndex]?.title || query);
                    return newIndex;
                });
                break;

            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    selectSuggestion(suggestions[selectedIndex]);
                } else {
                    handleSearch();
                }
                break;

            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };
    // Handle suggestion selection
    const selectSuggestion = (suggestion) => {
        setQuery(suggestion.title);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        onSearch(suggestion.title, suggestion);
    };
    // Handle button search
    const handleSearch = () => {
        if (query.trim()) {
            setShowSuggestions(false);
            setSelectedIndex(-1);
            onSearch(query.trim());
        }
    };
    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
            suggestionRefs.current[selectedIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [selectedIndex]);
    // Cleanup debounced function
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    return (
        <Fragment>
            <div ref={containerRef} className="searchFormContainer">
                {/* Search Form */}
                <div className="searchForm" method="POST" noValidate>
                    {/* Input Search */}
                    <div className="searchInputContainer">
                        <input
                            ref={inputRef}
                            className="searchInput"
                            type="text"
                            id="searchQueryID"
                            name="searchQuery"
                            value={query}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (suggestions.length > 0) {
                                    setShowSuggestions(true);
                                }
                            }}
                            placeholder={placeholder}
                            autoComplete="off"
                            spellCheck="false"
                        />
                    </div>
                    {/* Button Submit */}
                    <div className="btnSearchContainer">
                        <button type="button" className="btnSearch" onClick={handleSearch}>
                            Tìm kiếm
                        </button>
                    </div>

                    {/* Loading Indicator */}
                    {loading && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                backgroundColor: '#1f1f1f',
                                bottom: '-40px',
                                left: '0',
                                right: '0',
                                borderRadius: '20px',
                                padding: '10px 5px',
                            }}
                        >
                            <IoSyncSharp className="loadingAnimation" style={{ color: 'white', fontSize: '15px' }} />
                        </div>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div
                        className="searchAutocompleteContainer"
                        style={{
                            height: suggestions.length <= 12 ? 'auto' : '',
                        }}
                    >
                        {suggestions.map((suggestion, index) => (
                            <div
                                className="searchAutocompleteItem"
                                key={suggestion.id || index}
                                ref={(el) => (suggestionRefs.current[index] = el)}
                                onClick={() => selectSuggestion(suggestion)}
                                style={{
                                    backgroundColor: index === selectedIndex ? '#2e2e2e' : '',
                                }}
                            >
                                <div>
                                    {/* Suggestion Text */}
                                    <div>
                                        <span className="searchAutocompleteKeyword">
                                            <IoSearch /> {suggestion.title}
                                        </span>
                                        {/* {suggestion.type && (
                                            <p className="text-xs text-gray-500 capitalize mt-1">{suggestion.type}</p>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results For Autocomplete */}
                {/* {showSuggestions && !loading && suggestions.length === 0 && query.trim() && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <div className="px-4 py-3 text-gray-500 text-sm">Không tìm thấy kết quả cho "{query}"</div>
                    </div>
                )} */}
            </div>
        </Fragment>
    );
}

export default SearchInput;
