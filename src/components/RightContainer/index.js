// import component
import SongPlayer from '~/pages/components/SongPlayer';
// hết import component

function RightContainer() {
    return (
        <div id="rightContainerID" className="col l-3 m-0 c-0 rightContainer">
            {/* Trình Phát Nhạc */}
            <SongPlayer></SongPlayer>
        </div>
    );
}

export default RightContainer;
