import { IoChevronDownSharp, IoCloseSharp, IoSyncSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import MusicCard from '../MusicCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getListeningHistoryDataApi, getUserSongsDataApi } from '~/utils/api';
import { useInView } from 'react-intersection-observer';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '~/context/auth.context';

const LIMIT = 5;

function AddMusicBox({
    playlistDetailData,
    setIsOpenAddMusicBox,
    handleCheckIsSongAdded,
    handleAddMusic,
    handleRemoveAddMusic,
    addOrRemoveMusicProgress,
}) {
    // State
    const [mySongsData, setMySongsData] = useState();

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const myMusicListRef = useRef(null);
    const listenHistoryRef = useRef(null);

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

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

    return (
        <div className="addMusicBoxContainer">
            <div className="addMusicBox">
                {/* Header */}
                <div className="title">
                    <span>Thêm vào {`"${playlistDetailData?.name}"`}</span>
                    <button
                        type="button"
                        className="btnCloseAddMusicBox"
                        onClick={() => {
                            setIsOpenAddMusicBox(false);
                        }}
                    >
                        <IoCloseSharp />
                    </button>
                </div>
                {/* Main */}
                <div className="mainContainer">
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
                                                    Không có lịch sử nghe
                                                </span>
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddMusicBox;
