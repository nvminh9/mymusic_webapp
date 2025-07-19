import noContentImage from '~/assets/images/no_content.jpg';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import { getSongDataApi } from '~/utils/api';

function PlaylistCard({ playlistData, typePlaylistCard }) {
    // State

    // Context
    // const { playlist, setPlaylist, setCurrentIndex, setIsPlaying } = useMusicPlayerContext();

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
            <>
                {/* Each Item */}
                <button
                    className="btnPlaylist"
                    // onClick={() => {
                    //     handlePlay();
                    // }}
                >
                    <div className="coverImage">
                        <img
                            src={
                                playlistData?.songImage
                                    ? process.env.REACT_APP_BACKEND_URL + playlistData?.songImage
                                    : noContentImage
                            }
                            draggable="false"
                        />
                    </div>
                    <div className="info">
                        <span className="name">{playlistData?.name}</span>
                        <span className="quantity">{playlistData?.User?.userName}</span>
                    </div>
                </button>
            </>
        );
    }

    return <></>;
}

export default PlaylistCard;
