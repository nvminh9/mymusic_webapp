import noContentImage from '~/assets/images/no_content.jpg';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import { getSongDataApi } from '~/utils/api';

function MusicCard({ songData, typeMusicCard }) {
    // State

    // Context
    const { playlist, setPlaylist, setCurrentIndex, setIsPlaying } = useMusicPlayerContext();

    // --- HANDLE FUNCTION ---
    // Test handlePlay
    const handlePlay = async (e) => {
        try {
            // Call API Get Song Data
            const res = await getSongDataApi(songData?.songId);
            // Set Music Player Context
            setPlaylist((prev) => {
                return prev?.length > 0 ? [...prev, { ...res?.data }] : [{ ...res?.data }];
            });
            setCurrentIndex(playlist?.length && playlist?.length > 0 ? playlist?.length : 0);
            setIsPlaying(true);
            // Local Storage (Bài cuối lúc trước nghe)
            localStorage.setItem('pl', JSON.stringify([{ ...res?.data }]));
        } catch (error) {
            console.log(error);
        }
    };

    if (typeMusicCard === 'LeftContainer') {
        return (
            <>
                {/* Each Item */}
                <button
                    className="btnPlaylist"
                    onClick={() => {
                        handlePlay();
                    }}
                >
                    <div className="coverImage">
                        <img
                            src={
                                songData?.songImage
                                    ? process.env.REACT_APP_BACKEND_URL + songData?.songImage
                                    : noContentImage
                            }
                        />
                    </div>
                    <div className="info">
                        <span className="name">{songData?.name}</span>
                        <span className="quantity">{songData?.User?.userName}</span>
                    </div>
                </button>
            </>
        );
    }

    return <></>;
}

export default MusicCard;
