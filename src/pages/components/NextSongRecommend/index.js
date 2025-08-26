import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import MusicCard from '../MusicCard';
import { useContext, useEffect, useState } from 'react';
import { getNextSongRecommendApi } from '~/utils/api';
import { AuthContext } from '~/context/auth.context';
import { useMusicPlayer } from '~/hooks/useMusicPlayer';

function NextSongRecommend({ type }) {
    // State
    const [nextSongRecommendData, setNextSongRecommendData] = useState();

    // Context
    const { auth } = useContext(AuthContext);
    const { playlist, setPlaylist, currentIndex } = useMusicPlayerContext();
    const { currentSong } = useMusicPlayer();

    // Ref

    // Navigation

    // --- HANDLE FUNCTION ---
    // Handle Get Next Song Recommend
    useEffect(() => {
        const getNextSongRecommend = async (songId, userId) => {
            try {
                if (currentIndex < playlist?.length - 1) {
                    // Set State nextSongRecommendData
                    setNextSongRecommendData(playlist[currentIndex + 1]);
                    return;
                } else {
                    // Call API Get Next Song Recommend
                    const res = await getNextSongRecommendApi(songId, userId);
                    // Kiểm tra
                    if (res?.status === 200 && res?.message === 'Đề xuất bài nhạc tiếp theo') {
                        // Set State nextSongRecommendData
                        setNextSongRecommendData(res?.data?.nextSongRecommend?.[0]);
                        // Push vào playlist của Music Player
                        setPlaylist((prev) => [...prev, ...res?.data?.nextSongRecommend]);
                    } else {
                        console.log('Error Get Next Song Recommend');
                    }
                    //
                    return;
                }
            } catch (error) {
                console.log('Error Get Next Song Recommend: ', error);
                return;
            }
        };
        getNextSongRecommend(currentSong?.songId, auth?.user?.userId);
    }, [currentIndex]);

    // type === 'default' or null
    return (
        <>
            <div className="nextSongRecommendContainer">
                <div className="nextSongRecommend">
                    {/* Title */}
                    <span className="title">Tiếp theo</span>
                    {/* Next Song */}
                    {nextSongRecommendData && (
                        <MusicCard songData={nextSongRecommendData} typeMusicCard={'atNextSongRecommend'} />
                    )}
                </div>
            </div>
            {/* {currentIndex < playlist?.length - 1 ? (
                <span style={{ color: '#ffffff' }}>Next Song In Playlist</span>
            ) : (
                <span style={{ color: '#ffffff' }}>Next Song Recommend</span>
            )} */}
        </>
    );
}

export default NextSongRecommend;
