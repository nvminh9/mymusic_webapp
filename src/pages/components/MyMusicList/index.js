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
                            <MusicCard songData={song} typeMusicCard={'LeftContainer'} />
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
                                    color: 'white',
                                    fontFamily: 'system-ui',
                                    fontSize: '14px',
                                    fontWeight: '400',
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
