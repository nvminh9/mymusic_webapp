import { IoChevronDownSharp, IoCloseSharp, IoSyncSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import MusicCard from '../MusicCard';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { deletePlaylistApi, getListeningHistoryDataApi, getUserSongsDataApi } from '~/utils/api';
import { useInView } from 'react-intersection-observer';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '~/context/auth.context';

const LIMIT = 5;

function CustomPlaylistBox({
    playlistDetailData,
    setIsOpenCustomBox,
    handleCheckIsSongAdded,
    handleAddMusic,
    handleRemoveAddMusic,
    addOrRemoveMusicProgress,
}) {
    // State
    const [mySongsData, setMySongsData] = useState();
    const [tab, setTab] = useState(1);
    const [isDeleting, setIsDeleting] = useState({
        status: 'none',
        isLoading: false,
    }); // Đang thực hiện xóa playlist

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const myMusicListRef = useRef(null);
    const listenHistoryRef = useRef(null);

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

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
    // Get My Songs Data
    useEffect(() => {
        // Call API Get User Songs (Auth User)
        const getUserSongsData = async (userId) => {
            //
            const res = await getUserSongsDataApi(userId);
            // Set state mySongsData
            setMySongsData(res?.data);
        };
        getUserSongsData(auth?.user?.userId);
    }, []);
    // Reset tab to 1 when navigate playlist
    useEffect(() => {
        setTab(1);
    }, [playlistDetailData]);
    // Handle Button Delete Playlist
    const handleBtnDeletePlaylist = async () => {
        //
        setIsDeleting({
            status: 'pending',
            isLoading: true,
        });
        try {
            // Call API Delete Playlist
            const res = await deletePlaylistApi(playlistDetailData.playlistId);
            // Kiểm tra
            if (res?.status === 200 && res?.message === 'Xóa danh sách phát thành công') {
                setIsDeleting({
                    status: 'none',
                    isLoading: false,
                });
                setIsOpenCustomBox(false);
                // Refetch data của query key "listPlaylist"
                queryClient.invalidateQueries(['listPlaylist']);
                // Navigate back
                navigate(-1);
            }
            if (
                res?.status === 500 ||
                res?.status === 404 ||
                res?.status === 403 ||
                res?.message === 'Xóa danh sách phát không thành công'
            ) {
                setIsDeleting({
                    status: 'error',
                    isLoading: false,
                });
            }
        } catch (error) {
            setIsDeleting({
                status: 'error',
                isLoading: false,
            });
            console.log('Lỗi xóa danh sách phát', error);
        }
    };

    return (
        <div className="addMusicBoxContainer">
            <div className="addMusicBox">
                {/* Header */}
                <div className="title">
                    <span>{`${playlistDetailData?.name}`}</span>
                    <button
                        type="button"
                        className="btnCloseAddMusicBox"
                        onClick={() => {
                            setIsOpenCustomBox(false);
                        }}
                    >
                        <IoCloseSharp />
                    </button>
                </div>
                {/* Main */}
                <div className="mainContainer">
                    <div className="navigateBar">
                        {/* Add / undo add music button */}
                        <div className="btnContainer">
                            <button
                                type="button"
                                className="btnAddUndoAddMusic"
                                style={{
                                    color: tab === 1 ? '#000' : '',
                                    backgroundColor: tab === 1 ? '#dfdfdf' : '',
                                }}
                                onClick={() => {
                                    setTab(1);
                                }}
                            >
                                <span>Thêm/xóa bài nhạc</span>
                            </button>
                        </div>
                        {/* Setting */}
                        <div className="btnContainer">
                            <button
                                type="button"
                                className="btnOpenSetting"
                                style={{
                                    color: tab === 2 ? '#000' : '',
                                    backgroundColor: tab === 2 ? '#dfdfdf' : '',
                                }}
                                onClick={() => {
                                    setTab(2);
                                }}
                            >
                                <span>Cài đặt</span>
                            </button>
                        </div>
                    </div>
                    {/* Add / undo add music Tab */}
                    {tab === 1 && (
                        <>
                            {/* Input search music */}
                            <input
                                type="search"
                                className="inputSearchMusic"
                                id="inputSearchMusicID"
                                placeholder="Hãy thử nhập tên bài hát..."
                            />
                            <div className="main">
                                {/* My Musics */}
                                <div className="listenHistory myMusicList" ref={myMusicListRef}>
                                    <span className="title">Âm nhạc của bạn</span>
                                    {/* My Musics List */}
                                    {!mySongsData ? (
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '80%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <IoSyncSharp
                                                className="loadingAnimation"
                                                style={{ color: 'white', width: '16px', height: '16px' }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            {/* List My Musics */}
                                            {mySongsData?.length > 0 ? (
                                                <>
                                                    {mySongsData.map((item) => (
                                                        <div className="listenHistoryItem">
                                                            <MusicCard
                                                                songData={item}
                                                                typeMusicCard={'atAddMusicSearch'}
                                                                handleCheckIsSongAdded={handleCheckIsSongAdded}
                                                                handleAddMusic={handleAddMusic}
                                                                handleRemoveAddMusic={handleRemoveAddMusic}
                                                                addOrRemoveMusicProgress={addOrRemoveMusicProgress}
                                                            />
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    {/* Không có bài nào */}
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
                                                            Không có bài nào
                                                        </span>
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                                {/* Button More */}
                                {mySongsData?.length > 0 && (
                                    <div className="btnMoreContainer">
                                        <button
                                            className="btnMore"
                                            onClick={(e) => {
                                                myMusicListRef.current.style.height = 'fit-content';
                                                myMusicListRef.current.style.overflow = 'unset';
                                                e.target.style.display = 'none';
                                            }}
                                        >
                                            <IoChevronDownSharp /> Xem thêm
                                        </button>
                                    </div>
                                )}
                                {/* Lịch sử */}
                                <div className="listenHistory">
                                    <span className="title">Lịch sử nghe</span>
                                    {/* Listen History */}
                                    {isLoading ? (
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '80%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <IoSyncSharp
                                                className="loadingAnimation"
                                                style={{ color: 'white', width: '16px', height: '16px' }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            {/* List Listening History */}
                                            {data.pages[0]?.data && data.pages[0]?.data?.length > 0 ? (
                                                <>
                                                    {data.pages.map((page) =>
                                                        page.data.map((item) => (
                                                            <div className="listenHistoryItem">
                                                                <MusicCard
                                                                    songData={item.Song}
                                                                    typeMusicCard={'atAddMusicSearch'}
                                                                    handleCheckIsSongAdded={handleCheckIsSongAdded}
                                                                    handleAddMusic={handleAddMusic}
                                                                    handleRemoveAddMusic={handleRemoveAddMusic}
                                                                    addOrRemoveMusicProgress={addOrRemoveMusicProgress}
                                                                />
                                                            </div>
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
                                                                style={{
                                                                    color: 'white',
                                                                    width: '16px',
                                                                    height: '16px',
                                                                }}
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
                                                            Không có lịch sử nghe
                                                        </span>
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    {/* Setting Tab */}
                    {tab === 2 && (
                        <>
                            <div className="main" style={{ height: '424px' }}>
                                <div className="settingItemContainer">
                                    <div className="settingItem" style={{ borderBottom: 'none' }}>
                                        <span>Xóa danh sách phát</span>
                                        <button
                                            type="button"
                                            className="btnDeletePlaylist"
                                            onClick={handleBtnDeletePlaylist}
                                            disabled={isDeleting.isLoading}
                                            style={{
                                                cursor: isDeleting.isLoading ? 'not-allowed' : 'pointer',
                                                opacity: isDeleting.isLoading ? '0.5' : '1',
                                            }}
                                        >
                                            {isDeleting.isLoading && (
                                                <IoSyncSharp
                                                    className="loadingAnimation"
                                                    style={{ color: '#ffffff', width: '15px', height: '15px' }}
                                                />
                                            )}{' '}
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomPlaylistBox;
