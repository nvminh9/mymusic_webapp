import { useEffect, useState } from 'react';
import MusicPlayer from '~/pages/components/MusicPlayer';
import { getSongDataApi } from '~/utils/api';

function RightContainer() {
    // State
    // const [songData, setSongData] = useState();
    const [isInteracted, setIsInteracted] = useState(false);

    // --- HANDLE FUNCTION ---
    // Call API Get Song Data
    useEffect(() => {
        //
    }, []);

    return (
        <div
            id="rightContainerID"
            className="col l-3 m-0 c-0 rightContainer"
            onClick={() => {
                setIsInteracted(true);
            }}
        >
            {/* Trình Phát Nhạc */}
            <MusicPlayer isInteracted={isInteracted} />
        </div>
    );
}

export default RightContainer;
