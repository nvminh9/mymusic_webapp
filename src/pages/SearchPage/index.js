import { Fragment, useEffect } from 'react';
import { VscChevronLeft } from 'react-icons/vsc';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchInput from '../components/SearchInput';
import SearchHistory from '../components/SearchHistory';

function SearchPage() {
    // State

    // Context

    // Ref

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // Đổi title trang
        document.title = `Search | mymusic: Music from everyone`;
    }, []);
    // Handle Search
    const handleSearch = (query, suggestion = null) => {
        console.log('Search performed:', { query, suggestion });
        // Handle search logic here (Result)
    };

    return (
        <Fragment>
            <div className="searchPage">
                {/* Thanh chuyển tab */}
                <div className="tabSwitchProfile">
                    <div className="profileUserName">
                        {/* Search Input */}
                        <SearchInput key={`searchInputID`} placeholder="Bạn muốn tìm gì?" onSearch={handleSearch} />
                    </div>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div>
                {/* Main */}
                <div className="main">
                    {/* Lịch sử tìm kiếm */}
                    <SearchHistory />
                </div>
            </div>
        </Fragment>
    );
}

export default SearchPage;
