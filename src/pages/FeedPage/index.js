import videoTest from '~/assets/videos/pain.mp4';
// Import Component
import VideoAmbilight from '../components/VideoAmbilight';
// hết Import Component

function FeedPage() {
    return (
        <>
            <h1>Feed Page</h1>
            <VideoAmbilight videoSrc={videoTest}></VideoAmbilight>
        </>
    );
}

export default FeedPage;
