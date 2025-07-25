import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPlaylistDataApi } from '~/utils/api';

function PlaylistDetail() {
    // State
    const [playlistDetailData, setPlaylistDetailData] = useState();

    // Context

    // Ref

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // playlistId
        const playlistId = location.pathname.split('/')[2];
        // Call API Get Playlist
        const getPlaylistData = async (playlistId) => {
            const res = await getPlaylistDataApi(playlistId);
            // Set state playlistDetailData
            setPlaylistDetailData(res?.data);
        };
        getPlaylistData(playlistId);
    }, [location.pathname.split('/')[2]]);

    return (
        <>
            <h1 style={{ color: 'whitesmoke' }}>Playlist Detail</h1>
            <h1 style={{ color: 'whitesmoke' }}>{playlistDetailData?.name ? playlistDetailData?.name : 'Name'}</h1>
        </>
    );
}

export default PlaylistDetail;
