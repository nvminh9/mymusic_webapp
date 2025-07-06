import { useEffect, useState } from 'react';
import MusicPlayer from '~/pages/components/MusicPlayer';

function RightContainer() {
    // State
    // const [songData, setSongData] = useState();
    // const [isInteracted, setIsInteracted] = useState(false);

    // --- HANDLE FUNCTION ---
    // Define item "pl" in local storage
    // useEffect(() => {
    //     //
    //     const plLocalStorage = localStorage.getItem('pl');
    //     if (!plLocalStorage) {
    //         localStorage.setItem(
    //             'pl',
    //             JSON.stringify({
    //                 songs: [
    //                     //   {
    //                     //       songId: '29751284-2d72-4be5-8b11-a568d7db663d',
    //                     //       userId: '3e88f514-7e87-424b-a9be-b1a04a5d3c5e',
    //                     //       name: 'Test Name',
    //                     //       genreId: null,
    //                     //       songImage: '/image/mediaFiles-1744891557372-703309926avatar2.png',
    //                     //       songVideo: null,
    //                     //       songLink:
    //                     //           '/audio/hls/29751284-2d72-4be5-8b11-a568d7db663d/audioFile-1751338647405-387179682y2mate.com - Obito  CL5 Interlude_320kbps.mp3.hls.m3u8',
    //                     //       createdAt: '2025-07-01T02:57:27.446Z',
    //                     //       updatedAt: '2025-07-01T02:57:28.666Z',
    //                     //       User: {
    //                     //           userId: '3e88f514-7e87-424b-a9be-b1a04a5d3c5e',
    //                     //           name: 'Thanh Nguyen',
    //                     //           userName: 'thanhnguyen',
    //                     //           gender: 'male',
    //                     //           birth: '2004-11-11',
    //                     //           userAvatar: '/image/userAvatar-1744049562031-705794721.png',
    //                     //           email: 'thanhnguyen@gmail.com',
    //                     //           userCoverImage: null,
    //                     //           description: '</>',
    //                     //           createdAt: '2025-03-29T22:02:37.463Z',
    //                     //           updatedAt: '2025-04-07T18:12:42.034Z',
    //                     //       },
    //                     //   },
    //                 ],
    //                 currentIndex: 0,
    //                 isShuffle: false,
    //                 isRepeatOne: false,
    //                 isRepeatAll: true,
    //             }),
    //         );
    //     }
    // }, []);

    return (
        <div id="rightContainerID" className="col l-3 m-0 c-0 rightContainer">
            {/* Trình Phát Nhạc */}
            <MusicPlayer />
        </div>
    );
}

export default RightContainer;
