import { useEffect } from 'react';
import { useIsMobile } from '~/hooks/useIsMobile';
import MusicPlayer from '~/pages/components/MusicPlayer';

function RightContainer() {
    // State

    // Context

    // Custom Hooks
    const isMobile = useIsMobile(768); // breakpoint = 768px

    // --- HANDLE FUNCTION ---

    return (
        <div id="rightContainerID" className="col l-3 m-0 c-0 rightContainer">
            {/* Trình Phát Nhạc (on PC) */}
            {isMobile ? <></> : <MusicPlayer />}
        </div>
    );
}

export default RightContainer;
