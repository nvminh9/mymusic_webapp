import MusicCard from '../MusicCard';

function MyMusicList({ mySongsData, typeMyMusicList }) {
    // State

    // Context

    // --- HANDLE FUNCTION ---

    if (typeMyMusicList === 'LeftContainer') {
        return (
            <>
                {/* List my music */}
                {mySongsData && mySongsData?.length > 0 ? (
                    <>
                        {mySongsData?.map((song) => (
                            <MusicCard key={song.songId} songData={song} typeMusicCard={'LeftContainerMyMusic'} />
                        ))}
                    </>
                ) : (
                    <>
                        {/* Each Item */}
                        <button className="btnPlaylist">
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
                                Chưa có bài nhạc
                            </span>
                        </button>
                    </>
                )}
            </>
        );
    }

    return <></>;
}

export default MyMusicList;
