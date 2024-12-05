import { useRef, useEffect } from 'react';
import axios from 'axios';

const VideoAmbilight = ({ videoSrc }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    let intervalId;

    useEffect(() => {
        const canvasElement = canvasRef.current;
        const context = canvasElement.getContext('2d');

        const videoElement = videoRef.current;

        function repaintAmbilight() {
            context.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
        }

        function startAmbilightRepaint() {
            intervalId = window.setInterval(repaintAmbilight, 1000 / 30);
        }

        function stopAmbilightRepaint() {
            clearInterval(intervalId);
        }

        videoElement.addEventListener('play', startAmbilightRepaint);
        videoElement.addEventListener('pause', stopAmbilightRepaint);
        videoElement.addEventListener('ended', stopAmbilightRepaint);
        videoElement.addEventListener('seeked', repaintAmbilight);
        videoElement.addEventListener('loadeddata', repaintAmbilight);

        return () => {
            stopAmbilightRepaint();
            videoElement.removeEventListener('play', startAmbilightRepaint);
            videoElement.removeEventListener('pause', stopAmbilightRepaint);
            videoElement.removeEventListener('ended', stopAmbilightRepaint);
            videoElement.removeEventListener('seeked', repaintAmbilight);
            videoElement.removeEventListener('loadeddata', repaintAmbilight);
        };
    }, []);

    useEffect(() => {
        // Proxy the video request through Next.js server to avoid cross-origin issues
        const fetchVideo = async () => {
            try {
                const response = await axios.get(videoSrc, { responseType: 'blob' });
                const videoBlob = response.data;
                const videoUrl = URL.createObjectURL(videoBlob);
                if (videoRef.current) {
                    videoRef.current.src = videoUrl;
                }
            } catch (error) {
                console.error('Failed to fetch video:', error);
            }
        };

        fetchVideo();

        return () => {
            // Revoke the video URL when component is unmounted
            if (videoRef.current && videoRef.current.src) {
                URL.revokeObjectURL(videoRef.current.src);
            }
        };
    }, [videoSrc]);

    return (
        <div className="videoWrapper">
            <div className="ambilightWrapper">
                <div className="aspectRatio">
                    <video id="video" ref={videoRef} autoPlay loop controls>
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                    {/* <img id="video" ref={videoRef} src={videoSrc} /> */}
                </div>
                <canvas id="ambilight" ref={canvasRef} />
            </div>
        </div>
    );
};

export default VideoAmbilight;
