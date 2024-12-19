import { useRef, useEffect } from 'react';
import axios from 'axios';

const ImageAmbilight = ({ imageSrc }) => {
    // config ImageKit.io
    const IMAGEKIT_URL_ENDPOINT = `https://ik.imagekit.io/d7q5hnktr`;

    const imageRef = useRef(null);
    const canvasRef = useRef(null);
    let intervalId;

    useEffect(() => {
        const canvasElement = canvasRef.current;
        const context = canvasElement.getContext('2d');

        const imageElement = imageRef.current;

        function repaintAmbilight() {
            context.drawImage(imageElement, 0, 0, imageElement.videoWidth, imageElement.videoHeight);
        }

        function startAmbilightRepaint() {
            intervalId = window.setInterval(repaintAmbilight, 1000 / 30);
        }

        function stopAmbilightRepaint() {
            clearInterval(intervalId);
        }

        return () => {};
    }, []);

    // for cross-origin issues
    // useEffect(() => {
    //     // Proxy the video request through Next.js server to avoid cross-origin issues
    //     const fetchVideo = async () => {
    //         try {
    //             const response = await axios.get(imageSrc, { responseType: 'blob' });
    //             const imageBlob = response.data;
    //             const imageUrl = URL.createObjectURL(imageBlob);
    //             if (imageRef.current) {
    //                 imageRef.current.src = imageUrl;
    //             }
    //         } catch (error) {
    //             console.error('Failed to fetch video:', error);
    //         }
    //     };

    //     fetchVideo();

    //     return () => {
    //         // Revoke the video URL when component is unmounted
    //         if (imageRef.current && imageRef.current.src) {
    //             URL.revokeObjectURL(imageRef.current.src);
    //         }
    //     };
    // }, [imageSrc]);

    return (
        <div className="imageWrapper">
            <div className="ambilightWrapper">
                <div className="aspectRatio">
                    <img id="image" ref={imageRef} src={`${IMAGEKIT_URL_ENDPOINT}/${imageSrc}`} />
                    <img id="imageAmbilight" src={`${IMAGEKIT_URL_ENDPOINT}/${imageSrc}`} />
                </div>
                <canvas id="ambilight" ref={canvasRef} />
            </div>
        </div>
    );
};

export default ImageAmbilight;
