import PlaylistCard from '../PlaylistCard';

function PlaylistList({ playlistsData, typePlaylistList }) {
    // State

    // Context

    // --- HANDLE FUNCTION ---

    if (typePlaylistList === 'LeftContainer') {
        return (
            <>
                {/* List my music */}
                {playlistsData && playlistsData?.length > 0 ? (
                    <>
                        {playlistsData?.map((playlist) => (
                            <PlaylistCard playlistData={playlist} typePlaylistCard={'LeftContainer'} />
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
                                Chưa có danh sách phát
                            </span>
                        </button>
                    </>
                )}
            </>
        );
    }

    return <></>;
}

export default PlaylistList;
