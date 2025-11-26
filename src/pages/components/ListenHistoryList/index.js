import MusicCard from '../MusicCard';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { IoSyncSharp } from 'react-icons/io5';
import { useInView } from 'react-intersection-observer';
import { deleteListeningHistoryApi, getListeningHistoryDataApi } from '~/utils/api';

const LIMIT = 5;

function ListenHistoryList({ typeMyMusicList }) {
    // State

    // Context

    // React Query (Tanstack)
    const queryClient = useQueryClient();

    // --- HANDLE FUNCTION ---
    // Handle Get Listening History Data (useInfinityQuery)
    const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['listeningHistory'],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await getListeningHistoryDataApi(pageParam, LIMIT);
            return res;
        },
        getNextPageParam: (lastPage, pages) => {
            const currentPage = lastPage.pagination.page;
            const totalPages = lastPage.pagination.totalPages;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        // refetchOnWindowFocus: false,
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
    // Handle Delete One Listening History
    const handleDeleteListeningHistory = async (listeningHistoryId) => {
        try {
            // Call API Delete One Listen History
            const res = await deleteListeningHistoryApi(listeningHistoryId);
            // Kiểm tra
            if (res?.status === 200 && res?.message === 'Xóa lịch sử nghe thành công') {
                // Cập nhật data của query key "listeningHistory"
                queryClient.invalidateQueries(['listeningHistory']);
            } else {
                console.log('Xóa lịch sử nghe không thành công');
            }
        } catch (error) {
            console.log('Lỗi xóa lịch sử nghe: ', error);
        }
    };

    // First Load
    if (isLoading) {
        return (
            <div
                style={{
                    width: '100%',
                    height: '80%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <IoSyncSharp className="loadingAnimation" style={{ color: 'white', width: '16px', height: '16px' }} />
            </div>
        );
    }

    // Listen History List In LeftContainer
    if (typeMyMusicList === 'LeftContainer') {
        return (
            <>
                {/* List Listening History */}
                {data?.pages[0]?.data && data?.pages[0]?.data?.length > 0 ? (
                    <>
                        {data?.pages.map((page) =>
                            page.data.map((item) => (
                                <MusicCard
                                    key={`${item?.listeningHistoryId}listenHistory`}
                                    listeningHistoryData={item}
                                    songData={item.Song}
                                    typeMusicCard={'LeftContainerListenHistory'}
                                    handleDeleteListeningHistory={handleDeleteListeningHistory}
                                />
                            )),
                        )}
                        {/* Trigger load thêm */}
                        <button
                            ref={ref}
                            className="btnPlaylist"
                            type="button"
                            style={{ height: '0px', padding: '0', margin: '0' }}
                        ></button>
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
                                Lịch sử nghe trống
                            </span>
                        </button>
                    </>
                )}
            </>
        );
    }

    return <></>;
}

export default ListenHistoryList;
