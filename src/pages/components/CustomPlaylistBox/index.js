import { IoAlertSharp, IoCheckmarkSharp, IoChevronDownSharp, IoCloseSharp, IoSyncSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import MusicCard from '../MusicCard';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { deletePlaylistApi, getListeningHistoryDataApi, getUserSongsDataApi, updatePlaylistApi } from '~/utils/api';
import { useInView } from 'react-intersection-observer';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '~/context/auth.context';
import noContentImage from '~/assets/images/no_content.jpg';
import { message } from 'antd';
import { EnvContext } from '~/context/env.context';

const LIMIT = 5;

function CustomPlaylistBox({
    playlistDetailData,
    setPlaylistDetailData,
    setIsOpenCustomBox,
    handleCheckIsSongAdded,
    handleAddMusic,
    handleRemoveAddMusic,
    addOrRemoveMusicProgress,
}) {
    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // State
    const [mySongsData, setMySongsData] = useState();
    const [tab, setTab] = useState(1);
    const [isDeleting, setIsDeleting] = useState({
        status: 'none',
        isLoading: false,
    }); // Đang thực hiện xóa playlist
    const [playlistImageFile, setPlaylistImageFile] = useState(); // File hình ảnh
    const [previewPlaylistImage, setPreviewPlaylistImage] = useState(
        playlistDetailData?.coverImage ? env?.backend_url + playlistDetailData?.coverImage : null,
    ); // Hình ảnh blob xem thử
    const [playlistName, setPlaylistName] = useState(playlistDetailData?.name); // Tên
    const [isPlaylistInfoChanged, setIsPlaylistInfoChanged] = useState(false); // Thông tin playlist đã có thay đổi
    const [updateProgressStatus, setUpdateProgressStatus] = useState();

    // Ref
    const myMusicListRef = useRef(null);
    const listenHistoryRef = useRef(null);
    const changeCoverImageInputRef = useRef(null);

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // React Query (Tanstack)
    const queryClient = useQueryClient();

    // Message (Ant Design)
    const [messageApi, contextHolder] = message.useMessage();

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
                const navigateTimeout = setTimeout(() => {
                    navigate(-1);
                }, 600);
                //
                return () => {
                    clearTimeout(navigateTimeout);
                };
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
    // Handle Change Playlist Info
    const handleChangePlaylistInfo = async () => {
        // Nếu đã có chỉnh sửa thông tin
        if (isPlaylistInfoChanged) {
            // Form Data
            const formData = new FormData();
            if (playlistName) formData.append('name', playlistName);
            if (playlistImageFile) formData.append('playlistCoverImage', playlistImageFile);
            if (!previewPlaylistImage) formData.append('removeImage', true);
            // Start Update
            try {
                // Set Update Progress Status
                setUpdateProgressStatus({
                    status: 'pending',
                    isLoading: true,
                });
                // Call API Update Playlist
                const res = await updatePlaylistApi(playlistDetailData.playlistId, formData);
                if (res?.status === 200 && res?.message === 'Chỉnh sửa danh sách phát thành công') {
                    // Nếu thành công
                    setUpdateProgressStatus({
                        status: 'success',
                        isLoading: true, // true để tránh trường hợp người dùng bấm thêm lần nữa trước khi navigate
                    });
                    message.success({
                        content: 'Đã sửa thông tin danh sách phát',
                        duration: 1.5,
                        style: {
                            color: 'white',
                            marginTop: '58.4px',
                        },
                    });

                    // Refetch data của query key "listPlaylist"
                    queryClient.invalidateQueries(['listPlaylist']);
                    // Set playlistDetailData
                    setPlaylistDetailData((prev) => ({
                        ...prev,
                        name: res?.data?.name,
                        coverImage: res?.data?.coverImage,
                    }));
                    setPreviewPlaylistImage(res?.data?.coverImage ? env?.backend_url + res?.data?.coverImage : null);
                    setPlaylistName(res?.data?.name);
                    // Set change count
                    // setChangedCount(res?.data?.changedCount);
                    // Close custom box
                    setIsOpenCustomBox(false);

                    // Navigate về trang cá nhân
                    // const navigateToProfileTimeout = setTimeout(() => {
                    //     navigate(`/profile/${auth?.user?.userName}/musics`);
                    // }, 600);
                    // return
                    return () => {
                        // clearTimeout(navigateToProfileTimeout);
                    };
                } else {
                    // Nếu không thành công
                    setUpdateProgressStatus({
                        status: 'fail',
                        isLoading: false,
                    });
                    message.error({
                        content: 'Chỉnh sửa không thành công, hãy thử tải lại trang',
                        duration: 1.5,
                        style: {
                            color: 'white',
                            marginTop: '58.4px',
                        },
                    });
                    // return
                    return;
                }
            } catch (error) {
                // Nếu có lỗi xảy ra
                setUpdateProgressStatus({
                    status: 'error',
                    isLoading: false,
                });
                message.error({
                    content: 'Có lỗi xảy ra, hãy thử tải lại trang',
                    duration: 1.5,
                    style: {
                        color: 'white',
                        marginTop: '58.4px',
                    },
                });
                // console.log(error);
            }
        }
    };
    // Handle Change Image
    const handleChangeCoverImage = (e) => {
        //
        document.getElementById('playlistImageDropAreaID').style.outline = 'rgba(135, 135, 135, 0.15) dotted 3px';
        // File không hợp lệ
        if (!e.target.files[0]?.type?.startsWith('image/')) {
            // setIsAudioFileNotValid(true);
            changeCoverImageInputRef.current.value = '';
            return;
        }
        // Set coverImageFile
        if (e.target.files[0] && e.target.files[0]?.type?.startsWith('image/')) {
            setPlaylistImageFile(e.target.files[0]);
            // Set Is Song Info Changed
            setIsPlaylistInfoChanged(true);
            // Set Preview
            const previewImageFileLink = URL.createObjectURL(e.target.files[0]);
            setPreviewPlaylistImage(previewImageFileLink);
            changeCoverImageInputRef.current.value = '';
            //
            return () => {
                URL.revokeObjectURL(previewImageFileLink);
            };
        }
    };
    // Handle Remove Image
    const handleRemoveCoverImage = () => {
        if (previewPlaylistImage) {
            setPlaylistImageFile();
            setPreviewPlaylistImage();
            // Set Is Song Info Changed
            setIsPlaylistInfoChanged(true);
            if (changeCoverImageInputRef.current) {
                changeCoverImageInputRef.current.value = '';
            }
            return;
        }
    };

    return (
        <Fragment>
            {/* Ant Design Message */}
            {contextHolder}
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
                            {/* Edit info button */}
                            <div className="btnContainer">
                                <button
                                    type="button"
                                    className="btnAddUndoAddMusic"
                                    style={{
                                        color: tab === 2 ? '#000' : '',
                                        backgroundColor: tab === 2 ? '#dfdfdf' : '',
                                    }}
                                    onClick={() => {
                                        setTab(2);
                                    }}
                                >
                                    <span>Chỉnh sửa thông tin</span>
                                </button>
                            </div>
                            {/* Setting */}
                            <div className="btnContainer">
                                <button
                                    type="button"
                                    className="btnOpenSetting"
                                    style={{
                                        color: tab === 3 ? '#000' : '',
                                        backgroundColor: tab === 3 ? '#dfdfdf' : '',
                                    }}
                                    onClick={() => {
                                        setTab(3);
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
                                                                        addOrRemoveMusicProgress={
                                                                            addOrRemoveMusicProgress
                                                                        }
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
                        {/* Chỉnh sửa thông tin */}
                        {tab === 2 && (
                            <>
                                {/* Chỉnh sửa thông tin bài nhạc */}
                                <div className="main" style={{ height: '424px', position: 'relative' }}>
                                    {/* Song Image */}
                                    <span
                                        className="title"
                                        style={{ justifyContent: 'center', padding: '0px', paddingTop: '10px' }}
                                    >
                                        Ảnh
                                    </span>
                                    <div className="songImageContainer">
                                        <div
                                            className="songImageDropArea"
                                            id="playlistImageDropAreaID"
                                            style={{
                                                backgroundImage: `url(${
                                                    previewPlaylistImage ? previewPlaylistImage : noContentImage
                                                })`,
                                            }}
                                            onDragOver={(e) => {
                                                if (e.currentTarget) {
                                                    e.currentTarget.style.outline = '#777777 dotted 3px';
                                                }
                                            }}
                                            onDragLeave={(e) => {
                                                if (e.currentTarget) {
                                                    e.currentTarget.style.outline =
                                                        'rgba(135, 135, 135, 0.15) dotted 3px';
                                                }
                                            }}
                                        >
                                            {/* Input Image File */}
                                            <input
                                                ref={changeCoverImageInputRef}
                                                className="inputSongImageFile"
                                                id="inputSongImageFileID"
                                                name="coverImage"
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                onChange={handleChangeCoverImage}
                                            />
                                        </div>
                                        <div className="btnRemoveContainer">
                                            <span className="note">Kéo ảnh vào ô trên để thay đổi ảnh</span>
                                        </div>
                                        <div className="btnRemoveContainer">
                                            <label className="btnRemove" htmlFor="inputSongImageFileID">
                                                Chọn ảnh
                                            </label>
                                            <button
                                                type="button"
                                                className="btnRemove"
                                                onClick={() => {
                                                    handleRemoveCoverImage();
                                                }}
                                                style={{
                                                    opacity: !previewPlaylistImage ? '0.5' : '1',
                                                    cursor: !previewPlaylistImage ? 'not-allowed' : 'pointer',
                                                }}
                                                disabled={!previewPlaylistImage ? true : false}
                                            >
                                                Gỡ ảnh
                                            </button>
                                        </div>
                                    </div>
                                    {/* Song Name */}
                                    <div className="songNameContainer">
                                        <span className="title">Tên</span>
                                        <input
                                            className="inputSongName"
                                            id="inputSongNameID"
                                            name="name"
                                            type="text"
                                            spellCheck="false"
                                            value={playlistName}
                                            placeholder={playlistName}
                                            onChange={(e) => {
                                                setPlaylistName(e.target.value);
                                                if (!!playlistName || playlistName !== '') {
                                                    setIsPlaylistInfoChanged(true);
                                                }
                                            }}
                                        />
                                    </div>
                                    {/* Button Submit Change */}
                                    <div className="btnChangeSongInfoContainer">
                                        <button
                                            type="button"
                                            className="btnChangeSongInfo"
                                            disabled={!isPlaylistInfoChanged}
                                            style={{
                                                opacity: !isPlaylistInfoChanged ? '0.5' : '',
                                                cursor: !isPlaylistInfoChanged ? 'not-allowed' : 'pointer',
                                                transform: !isPlaylistInfoChanged ? 'scale(1)' : '',
                                            }}
                                            onClick={() => {
                                                handleChangePlaylistInfo();
                                            }}
                                        >
                                            {/* Nếu chưa bấm */}
                                            {!updateProgressStatus && <>Xác nhận</>}
                                            {/* Đang xử lý */}
                                            {updateProgressStatus?.status === 'pending' && (
                                                <>
                                                    <IoSyncSharp
                                                        className="loadingAnimation"
                                                        style={{ color: '#1f1f1f', width: '15px', height: '15px' }}
                                                    />{' '}
                                                    Đang xử lý
                                                </>
                                            )}
                                            {/* Thành công */}
                                            {updateProgressStatus?.status === 'success' && (
                                                <>
                                                    <IoCheckmarkSharp /> Đã chỉnh sửa
                                                </>
                                            )}
                                            {/* Không thành công */}
                                            {updateProgressStatus?.status === 'fail' && (
                                                <>
                                                    <IoAlertSharp /> Chỉnh sửa không thành công
                                                </>
                                            )}
                                            {/* Lỗi */}
                                            {updateProgressStatus?.status === 'error' && (
                                                <>
                                                    <IoAlertSharp /> Có lỗi xảy ra
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Setting Tab */}
                        {tab === 3 && (
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
        </Fragment>
    );
}

export default CustomPlaylistBox;
