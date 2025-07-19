import MusicCard from '../MusicCard';

function ListenHistoryList({ listenHistoryData, typeMyMusicList }) {
    // State

    // Context

    // --- HANDLE FUNCTION ---

    if (typeMyMusicList === 'LeftContainer') {
        return (
            <>
                {/* List listen history */}
                {listenHistoryData && listenHistoryData?.length > 0 ? (
                    <>
                        {listenHistoryData?.map((song) => (
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
                                    color: 'rgba(119, 119, 119, 0.6666666667)',
                                    fontFamily: 'system-ui',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                }}
                            >
                                Lịch sử nghe trống
                            </span>
                        </button>
                    </>
                )}
            </>
        );
    }

    return <></>;
}

export default ListenHistoryList;
