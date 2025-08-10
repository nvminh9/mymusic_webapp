import { IoChevronDownSharp, IoCloseSharp, IoSyncSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import MusicCard from '../MusicCard';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { deleteMusicApi, deletePlaylistApi, getListeningHistoryDataApi, getUserSongsDataApi } from '~/utils/api';
import { useInView } from 'react-intersection-observer';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '~/context/auth.context';
import noContentImage from '~/assets/images/no_content.jpg';
import { constant } from 'lodash';

const LIMIT = 5;

function CustomSongBox({ songDetailData, setIsOpenCustomBox }) {
    // State
    const [tab, setTab] = useState(1);
    const [isDeleting, setIsDeleting] = useState({
        status: 'none',
        isLoading: false,
    }); // Đang thực hiện xóa bài nhạc
    const [songImageFile, setSongImageFile] = useState();
    const [previewSongImage, setPreviewSongImage] = useState(
        process.env.REACT_APP_BACKEND_URL + songDetailData?.songImage,
    );
    const [songName, setSongName] = useState(songDetailData?.name);
    const [isSongInfoChanged, setIsSongInfoChanged] = useState(false);

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const changeSongImageInputRef = useRef(null);

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // React Query (Tanstack)
    const queryClient = useQueryClient();

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
    const handleChangeSongInfo = () => {};
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
    // Handle Change Song Name

    return (
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
                                                e.currentTarget.style.outline = 'rgba(135, 135, 135, 0.15) dotted 3px';
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
                                    >
                                        Xác nhận
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
    );
}

export default CustomSongBox;
