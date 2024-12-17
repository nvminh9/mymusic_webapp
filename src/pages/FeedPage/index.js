// Import Component
import Article from '../components/Article';
// hết Import Component

function FeedPage() {
    return (
        <>
            <div className="feedPage">
                <div className="articleContainer">
                    <Article></Article>
                    <Article></Article>
                </div>
            </div>
        </>
    );
}

export default FeedPage;
