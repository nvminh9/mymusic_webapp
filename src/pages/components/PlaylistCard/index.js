import { useLocation, useNavigate } from 'react-router-dom';
import noContentImage from '~/assets/images/no_content.jpg';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import { getSongDataApi } from '~/utils/api';

function PlaylistCard({ playlistData, typePlaylistCard }) {
    // State

    // Context
    // const { playlist, setPlaylist, setCurrentIndex, setIsPlaying } = useMusicPlayerContext();

    // Ref

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // --- HANDLE FUNCTION ---
    // Test handlePlay
    // const handlePlay = async (e) => {
    //     try {
    //         // Call API Get Song Data
    //         const res = await getSongDataApi(songData?.songId);
    //         // Set Music Player Context
    //         setPlaylist((prev) => {
    //             return prev?.length > 0 ? [...prev, { ...res?.data }] : [{ ...res?.data }];
    //         });
    //         setCurrentIndex(playlist?.length && playlist?.length > 0 ? playlist?.length : 0);
    //         setIsPlaying(true);
    //         // Local Storage (Bài cuối lúc trước nghe)
    //         localStorage.setItem('pl', JSON.stringify([{ ...res?.data }]));
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    if (typePlaylistCard === 'LeftContainer') {
        return (
            <div className="listenHistoryItem">
                {/* Each Item */}
                <button
                    className="btnPlaylist"
                    onClick={() => {
                        navigate(`playlist/${playlistData?.playlistId}`);
                    }}
                >
                    <div className="coverImage">
                        <img
                            src={
                                playlistData?.coverImage
                                    ? process.env.REACT_APP_BACKEND_URL + playlistData?.coverImage
                                    : noContentImage
                            }
                            draggable="false"
                            style={{
                                boxShadow:
                                    'rgb(50 50 50) -3px 0px 0px 0px, rgb(50 50 50 / 50%) -6px 0px, rgba(50, 50, 50, 0.2) -9px 0px',
                                marginLeft: '9px',
                            }}
                        />
                    </div>
                    <div className="info">
                        <span className="name">{playlistData?.name}</span>
                        <span className="quantity">{playlistData?.User?.userName}</span>
                    </div>
                </button>
                {/* Button For Info */}
                <div className="buttonBox" style={{ paddingLeft: '16px' }}>
                    <button
                        className="btnName"
                        onClick={() => {
                            navigate(`playlist/${playlistData?.playlistId}`);
                        }}
                    >
                        {playlistData?.name}
                    </button>
                    <button
                        className="btnQuantity"
                        onClick={() => {
                            navigate(`profile/${playlistData?.User?.userName}`);
                        }}
                    >
                        {playlistData?.User?.userName}
                    </button>
                </div>
            </div>
        );
    }

    return <></>;
}

export default PlaylistCard;
