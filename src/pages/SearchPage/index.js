import { Fragment, useContext, useEffect, useState } from 'react';
import { VscChevronLeft } from 'react-icons/vsc';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SearchInput from '../components/SearchInput';
import SearchHistory from '../components/SearchHistory';
import SearchResult from '../components/SearchResult';
import { getSearchResultDataApi } from '~/utils/api';
import { AuthContext } from '~/context/auth.context';
import { IoMusicalNote, IoPerson, IoReader } from 'react-icons/io5';
import { GoDotFill } from 'react-icons/go';

function SearchPage() {
    // State
    const [youMayLikeData, setYouMayLikeData] = useState();

    // Context
    const { auth } = useContext(AuthContext);

    // Ref

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // Đổi title trang
        document.title = `Search | mymusic: Music from everyone`;
    }, []);
    // Get Data For You May Like
    useEffect(() => {
        // Call API Get Search Result (Để lấy dữ liệu gợi ý bạn có thể thích)
        const getYouMayLikeData = async () => {
            try {
                //
                if (!searchParams.get('q')) {
                    const res = await getSearchResultDataApi('', `article,song,user`, 12, auth?.user?.userId);
                    // Kiểm tra
                    if (res?.status === 200 && res?.message === 'Kết quả tìm kiếm') {
                        // Set You May Like Data
                        setYouMayLikeData(res?.data?.youMayLike);
                    } else {
                        console.log('API Search Result Error');
                    }
                }
            } catch (error) {
                console.log('Get You May Like Data Error: ', error);
                return;
            }
        };
        getYouMayLikeData();
    }, [searchParams.get('q')]);
    // Handle Search
    const handleSearch = async (query, suggestion = null) => {
        // console.log('Search performed:', { query, suggestion });
        setSearchParams((prev) => ({ ...prev, q: query }));
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
                    {/* Bạn có thể thích */}
                    {!searchParams.get('q') && (
                        <div className="searchHistoryContainer">
                            <div className="title">
                                <span>Bạn có thể thích</span>
                            </div>
                            <div className="searchHistory">
                                <>
                                    {/* List Search History */}
                                    {youMayLikeData?.length > 0 ? (
                                        <>
                                            {youMayLikeData?.map((item) => (
                                                <div
                                                    key={item.searchHistoryId}
                                                    className="searchHistoryItem"
                                                    onClick={() => {
                                                        // Set Search Params
                                                        setSearchParams((prev) => ({
                                                            ...prev,
                                                            q: item?.songId && item.name,
                                                        }));
                                                    }}
                                                >
                                                    <span style={{ color: '#dfdfdf' }}>
                                                        <GoDotFill style={{ color: '#ffffff' }} />
                                                        {/* Song */}
                                                        {item?.songId && item.name}
                                                        {item?.songId && <IoMusicalNote />}
                                                        {/* Article */}
                                                        {item?.articleId && item.textContent}
                                                        {item?.articleId && <IoReader />}
                                                        {/* User */}
                                                        {item?.userName && item.userName}
                                                        {item?.userName && <IoPerson />}
                                                    </span>
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            right: '5px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '5px',
                                                        }}
                                                    >
                                                        {/* <span className="searchedAt">{timeAgo(item.searchedAt)}</span> */}
                                                        {/* <span className="searchedAt btnDeleteSearchHistory">
                                                        <IoCloseOutline />
                                                    </span> */}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {/* Không có lịch sử nghe */}
                                            <button
                                                className=""
                                                style={{
                                                    height: '80%',
                                                    width: '100%',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    padding: '8px',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        display: 'block',
                                                        width: '100%',
                                                        color: 'rgba(119, 119, 119, 0.6666666667)',
                                                        fontFamily: 'system-ui',
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Không có dữ liệu
                                                </span>
                                            </button>
                                        </>
                                    )}
                                </>
                            </div>
                        </div>
                    )}
                    {/* Lịch sử tìm kiếm */}
                    {!searchParams.get('q') && <SearchHistory key={`searchHistoryID${auth?.user?.userId}`} />}
                    {/* Kết quả tìm kiếm */}
                    {searchParams.get('q') && <SearchResult key={`searchResultID${auth?.user?.userId}`} />}
                </div>
            </div>
        </Fragment>
    );
}

export default SearchPage;
