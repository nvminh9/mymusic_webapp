import { useInfiniteQuery } from '@tanstack/react-query';
import { IoCloseOutline, IoSyncSharp, IoTimeOutline } from 'react-icons/io5';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'react-router-dom';
import { getSearchHistoryDataApi } from '~/utils/api';

const LIMIT = 10;

function SearchHistory() {
    // State

    // Context

    // Ref

    // Navigation
    const [searchParams, setSearchParams] = useSearchParams();

    // --- HANDLE FUNCTION ---
    // Handle Get Search History Data (useInfinityQuery)
    const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['searchHistory'],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await getSearchHistoryDataApi(pageParam, LIMIT);
            return res;
        },
        getNextPageParam: (lastPage, pages) => {
            const currentPage = lastPage.pagination.page;
            const totalPages = lastPage.pagination.totalPages;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
    });
    // Handle when fetchNextPage
    const { ref } = useInView({
        threshold: 0.5,
        onChange: (inView) => {
            if (inView && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
    });
    // Format thời gian tạo bài viết
    const timeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const seconds = Math.floor((now - past) / 1000);
        const intervals = [
            { label: 'năm', seconds: 31536000 },
            { label: 'tháng', seconds: 2592000 },
            { label: 'tuần', seconds: 604800 },
            { label: 'ngày', seconds: 86400 },
            { label: 'giờ', seconds: 3600 },
            { label: 'phút', seconds: 60 },
            { label: 'giây', seconds: 1 },
        ];
        // Nếu đã quá 18 giờ thì return chi tiết
        if (seconds >= intervals[4].seconds * 18) {
            return formatTimestamp(timestamp);
        }
        for (let i = 0; i < intervals.length; i++) {
            const interval = Math.floor(seconds / intervals[i].seconds);
            if (interval >= 1) {
                return `${interval} ${intervals[i].label} trước`;
            }
        }
        return 'vừa xong';
    };
    // Format thời gian tạo bài viết (timestamp) sang định dạng "dd/mm/yyyy HH:MM"
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day} Tháng ${month}, ${year} lúc ${hours}:${minutes}`;
    };

    return (
        <>
            {/* Lịch sử tìm kiếm */}
            <div className="searchHistoryContainer">
                <div className="title">
                    <span>Lịch sử tìm kiếm</span>
                </div>
                <div className="searchHistory">
                    <>
                        {/* List Search History */}
                        {data?.pages[0]?.data && data?.pages[0]?.data?.length > 0 ? (
                            <>
                                {data?.pages.map((page) =>
                                    page.data.map((item) => (
                                        <div
                                            key={item.searchHistoryId}
                                            className="searchHistoryItem"
                                            onClick={() => {
                                                // Set Search Params
                                                setSearchParams((prev) => ({ ...prev, q: item.keyword }));
                                            }}
                                        >
                                            <span>
                                                <IoTimeOutline /> {item.keyword}
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
                                                <span className="searchedAt">{timeAgo(item.searchedAt)}</span>
                                                <span className="searchedAt btnDeleteSearchHistory">
                                                    <IoCloseOutline />
                                                </span>
                                            </div>
                                        </div>
                                    )),
                                )}
                                {/* Trigger load thêm */}
                                <div
                                    ref={ref}
                                    className="searchHistoryItem"
                                    style={{
                                        height: '0',
                                        width: '0',
                                        padding: '0',
                                        margin: '0',
                                    }}
                                ></div>
                                {/* Load More Animation */}
                                {isFetchingNextPage && (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: 'max-content',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: '8px',
                                        }}
                                    >
                                        <IoSyncSharp
                                            className="loadingAnimation"
                                            style={{ color: 'white', width: '16px', height: '16px' }}
                                        />
                                    </div>
                                )}
                                {/* Hết dữ liệu */}
                                {/* {!hasNextPage && <p style={{ color: '#ffffff', textAlign: 'center' }}>Đã tải hết dữ liệu</p>} */}
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
                                        Không có lịch sử tìm kiếm
                                    </span>
                                </button>
                            </>
                        )}
                    </>
                </div>
            </div>
        </>
    );
}

export default SearchHistory;
