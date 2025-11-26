import {
    IoAlertSharp,
    IoCaretBack,
    IoCaretForward,
    IoCheckmarkSharp,
    IoChevronDownSharp,
    IoCloseSharp,
    IoSyncSharp,
} from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import MusicCard from '../MusicCard';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
    deleteMusicApi,
    deletePlaylistApi,
    getListeningHistoryDataApi,
    getUserSongsDataApi,
    updateSongApi,
} from '~/utils/api';
import { useInView } from 'react-intersection-observer';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '~/context/auth.context';
import noContentImage from '~/assets/images/no_content.jpg';
import { constant } from 'lodash';
import { message } from 'antd';
import { EnvContext } from '~/context/env.context';

const LIMIT = 5;

function CustomSongBox({ songDetailData, setIsOpenCustomBox, setChangedCount }) {
    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // State
    const [tab, setTab] = useState(1);
    const [isDeleting, setIsDeleting] = useState({
        status: 'none',
        isLoading: false,
    }); // Đang thực hiện xóa bài nhạc
    const [songMediaFileTab, setSongMediaFileTab] = useState(1);
    const [songImageFile, setSongImageFile] = useState(); // File hình ảnh
    const [previewSongImage, setPreviewSongImage] = useState(
        songDetailData?.songImage ? env?.backend_url + songDetailData?.songImage : null,
    ); // Hình ảnh blob xem thử
    const [songVideoFile, setSongVideoFile] = useState(); // File video
    const [previewSongVideo, setPreviewSongVideo] = useState(
        songDetailData?.songVideo ? env?.backend_url + songDetailData?.songVideo : null,
    ); // Video blob xem thử
    const [songName, setSongName] = useState(songDetailData?.name); // Tên
    const [isSongInfoChanged, setIsSongInfoChanged] = useState(false); // Thông tin nhạc đã có thay đổi
    const [updateProgressStatus, setUpdateProgressStatus] = useState();

    // Ref
    const changeSongImageInputRef = useRef(null);
    const changeSongVideoInputRef = useRef(null);

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // React Query (Tanstack)
    const queryClient = useQueryClient();

    // Message (Ant Design)
    const [messageApi, contextHolder] = message.useMessage();

    // --- HANDLE FUNCTION ---
    // Reset tab to 1 when navigate song detail
    useEffect(() => {
        setTab(1);
    }, [songDetailData]);
    // Handle Button Delete Song
    const handleBtnDeleteSong = async () => {
        //
        setIsDeleting({
            status: 'pending',
            isLoading: true,
        });
        try {
            // Call API Delete Music
            const res = await deleteMusicApi(songDetailData.songId);
            // Kiểm tra
            if (res?.status === 200 && res?.message === 'Xóa bài nhạc thành công') {
                setIsDeleting({
                    status: 'none',
                    isLoading: false,
                });
                setIsOpenCustomBox(false);
                // Refetch data của query key "mySongs"
                queryClient.invalidateQueries(['mySongs']);
                // Navigate back
                navigate(-1);
            }
            if (
                res?.status === 500 ||
                res?.status === 404 ||
                res?.status === 403 ||
                res?.message === 'Xóa bài nhạc không thành công'
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
            console.log('Lỗi xóa bài nhạc', error);
        }
    };
    // Handle Change Song Info
    const handleChangeSongInfo = async () => {
        // Nếu đã có chỉnh sửa thông tin
        if (isSongInfoChanged) {
            // Form Data
            const formData = new FormData();
            if (songName) formData.append('name', songName);
            if (songImageFile) formData.append('audioAndMediaFiles', songImageFile);
            if (!previewSongImage) formData.append('removeImage', true);
            if (songVideoFile) formData.append('audioAndMediaFiles', songVideoFile);
            if (!previewSongVideo) formData.append('removeVideo', true);
            // Start Update
            try {
                // Set Update Progress Status
                setUpdateProgressStatus({
                    status: 'pending',
                    isLoading: true,
                });
                // Call API Update Music
                const res = await updateSongApi(songDetailData.songId, formData);
                if (res?.status === 200 && res?.message === 'Chỉnh sửa bài nhạc thành công') {
                    // Nếu thành công
                    setUpdateProgressStatus({
                        status: 'success',
                        isLoading: true, // true để tránh trường hợp người dùng bấm thêm lần nữa trước khi navigate
                    });
                    message.success({
                        content: 'Đã sửa thông tin bài nhạc',
                        duration: 1.5,
                        style: {
                            color: 'white',
                            marginTop: '58.4px',
                        },
                    });

                    // Refetch data của query key "mySongs"
                    queryClient.invalidateQueries(['mySongs']);
                    // Set change count
                    setChangedCount(res?.data?.changedCount);
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
                console.log(error);
            }
        }
    };
    // Handle Change Song Image
    const handleChangeSongImage = (e) => {
        //
        document.getElementById('songImageDropAreaID').style.outline = 'rgba(135, 135, 135, 0.15) dotted 3px';
        // File không hợp lệ
        if (!e.target.files[0]?.type?.startsWith('image/')) {
            // setIsAudioFileNotValid(true);
            changeSongImageInputRef.current.value = '';
            return;
        }
        // Set songImageFile
        if (e.target.files[0] && e.target.files[0]?.type?.startsWith('image/')) {
            setSongImageFile(e.target.files[0]);
            // Set Is Song Info Changed
            setIsSongInfoChanged(true);
            // Set Preview
            const previewImageFileLink = URL.createObjectURL(e.target.files[0]);
            setPreviewSongImage(previewImageFileLink);
            changeSongImageInputRef.current.value = '';
            //
            return () => {
                URL.revokeObjectURL(previewImageFileLink);
            };
        }
    };
    // Handle Remove Song Image
    const handleRemoveSongImage = () => {
        if (previewSongImage) {
            setSongImageFile();
            setPreviewSongImage();
            // Set Is Song Info Changed
            setIsSongInfoChanged(true);
            if (changeSongImageInputRef.current) {
                changeSongImageInputRef.current.value = '';
            }
            return;
        }
    };
    // Handle Change Song Video
    const handleChangeSongVideo = (e) => {
        // File không hợp lệ
        if (!e.target.files[0]?.type?.startsWith('video/')) {
            // setIsAudioFileNotValid(true);
            changeSongVideoInputRef.current.value = '';
            return;
        }
        // Set songVideoFile
        if (e.target.files[0] && e.target.files[0]?.type?.startsWith('video/')) {
            setSongVideoFile(e.target.files[0]);
            // Set Is Song Info Changed
            setIsSongInfoChanged(true);
            // Set Preview
            const previewVideoFileLink = URL.createObjectURL(e.target.files[0]);
            setPreviewSongVideo(previewVideoFileLink);
            changeSongVideoInputRef.current.value = '';
            //
            return () => {
                URL.revokeObjectURL(previewVideoFileLink);
            };
        }
    };
    // Handle Remove Song Video
    const handleRemoveSongVideo = () => {
        if (previewSongVideo) {
            setSongVideoFile();
            setPreviewSongVideo();
            // Set Is Song Info Changed
            setIsSongInfoChanged(true);
            if (changeSongVideoInputRef.current) {
                changeSongVideoInputRef.current.value = '';
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
                        <span>{`${songDetailData?.name}`}</span>
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
                            {/* Edit info button */}
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
                                    <span>Chỉnh sửa thông tin</span>
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
                        {/* Chỉnh sửa thông tin */}
                        {tab === 1 && (
                            <>
                                {/* Chỉnh sửa thông tin bài nhạc */}
                                <div className="main" style={{ height: '424px', position: 'relative' }}>
                                    {/* Song Image */}
                                    {songMediaFileTab === 1 && (
                                        <>
                                            <span
                                                className="title"
                                                style={{ justifyContent: 'center', padding: '0px', paddingTop: '10px' }}
                                            >
                                                Ảnh
                                            </span>
                                            <div className="songImageContainer">
                                                <div
                                                    className="songImageDropArea"
                                                    id="songImageDropAreaID"
                                                    style={{
                                                        backgroundImage: `url(${
                                                            previewSongImage ? previewSongImage : noContentImage
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
                                                        ref={changeSongImageInputRef}
                                                        className="inputSongImageFile"
                                                        id="inputSongImageFileID"
                                                        name="songImage"
                                                        type="file"
                                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                        onChange={handleChangeSongImage}
                                                    />
                                                    {/* Button change media file tab */}
                                                    {songMediaFileTab === 1 && (
                                                        <button
                                                            type="button"
                                                            className="btnChangeMediaTab"
                                                            onClick={() => {
                                                                setSongMediaFileTab(2);
                                                            }}
                                                        >
                                                            <IoCaretForward />
                                                        </button>
                                                    )}
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
                                                            handleRemoveSongImage();
                                                        }}
                                                        style={{
                                                            opacity: !previewSongImage ? '0.5' : '1',
                                                            cursor: !previewSongImage ? 'not-allowed' : 'pointer',
                                                        }}
                                                        disabled={!previewSongImage ? true : false}
                                                    >
                                                        Gỡ ảnh
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {/* Song Video */}
                                    {songMediaFileTab === 2 && (
                                        <>
                                            <span
                                                className="title"
                                                style={{ justifyContent: 'center', padding: '0px', paddingTop: '10px' }}
                                            >
                                                Video
                                            </span>
                                            <div className="songImageContainer">
                                                <div
                                                    className="songImageDropArea"
                                                    id="songImageDropAreaID"
                                                    style={{
                                                        outline: 'none',
                                                        width: '250px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {/* Video Preview */}
                                                    {previewSongVideo && (
                                                        <video
                                                            className="songVideoPreview"
                                                            // key={index + 'video'}
                                                            src={previewSongVideo}
                                                            playsInline
                                                            controls
                                                            controlsList="noplaybackrate nodownload"
                                                            muted
                                                            disablePictureInPicture
                                                            disableRemotePlayback
                                                            preload="false"
                                                        />
                                                    )}
                                                    {!previewSongVideo ? (
                                                        <span
                                                            style={{
                                                                fontFamily: 'system-ui',
                                                                fontSize: '14px',
                                                                fontWeight: '500',
                                                                opacity: '0.6',
                                                                userSelect: 'none',
                                                            }}
                                                        >
                                                            Không có video
                                                        </span>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {/* Input Image File */}
                                                    <input
                                                        ref={changeSongVideoInputRef}
                                                        className="inputSongImageFile"
                                                        id="inputSongImageFileID"
                                                        name="songImage"
                                                        type="file"
                                                        accept="video/mp4,video/mkv,video/webm,video/avi"
                                                        onChange={handleChangeSongVideo}
                                                        hidden
                                                    />
                                                    {/* Button change media file tab */}
                                                    <button
                                                        type="button"
                                                        className="btnChangeMediaTab"
                                                        onClick={() => {
                                                            setSongMediaFileTab(1);
                                                        }}
                                                        style={{
                                                            right: 'auto',
                                                            left: '-38.2px',
                                                        }}
                                                    >
                                                        <IoCaretBack />
                                                    </button>
                                                </div>
                                                <div className="btnRemoveContainer">
                                                    <label className="btnRemove" htmlFor="inputSongImageFileID">
                                                        Chọn video
                                                    </label>
                                                    <button
                                                        type="button"
                                                        className="btnRemove"
                                                        onClick={() => {
                                                            handleRemoveSongVideo();
                                                        }}
                                                        style={{
                                                            opacity: !previewSongVideo ? '0.5' : '1',
                                                            cursor: !previewSongVideo ? 'not-allowed' : 'pointer',
                                                        }}
                                                        disabled={!previewSongVideo ? true : false}
                                                    >
                                                        Gỡ video
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {/* Song Name */}
                                    <div className="songNameContainer">
                                        <span className="title">Tên</span>
                                        <input
                                            className="inputSongName"
                                            id="inputSongNameID"
                                            name="name"
                                            type="text"
                                            spellCheck="false"
                                            value={songName}
                                            placeholder={songName}
                                            onChange={(e) => {
                                                setSongName(e.target.value);
                                                if (!!songName || songName !== '') {
                                                    setIsSongInfoChanged(true);
                                                }
                                            }}
                                        />
                                    </div>
                                    {/* Button Submit Change */}
                                    <div className="btnChangeSongInfoContainer">
                                        <button
                                            type="button"
                                            className="btnChangeSongInfo"
                                            disabled={!isSongInfoChanged}
                                            style={{
                                                opacity: !isSongInfoChanged ? '0.5' : '',
                                                cursor: !isSongInfoChanged ? 'not-allowed' : 'pointer',
                                                transform: !isSongInfoChanged ? 'scale(1)' : '',
                                            }}
                                            onClick={() => {
                                                handleChangeSongInfo();
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
                        {tab === 2 && (
                            <>
                                <div className="main" style={{ height: '424px' }}>
                                    <div className="settingItemContainer">
                                        <div className="settingItem" style={{ borderBottom: 'none' }}>
                                            <span>Xóa bài nhạc</span>
                                            <button
                                                type="button"
                                                className="btnDeletePlaylist"
                                                onClick={handleBtnDeleteSong}
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

export default CustomSongBox;
