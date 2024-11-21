import LeftContainer from '~/components/LeftContainer';
import RightContainer from '~/components/RightContainer';

function DefaultLayout({ children }) {
    return (
        <>
            <div className="grid wide wrapper">
                <div className="row container">
                    {/* LeftContainer */}
                    <LeftContainer></LeftContainer>
                    {/* MiddleContainer */}
                    <div className="col l-3 m-0 c-0"></div>
                    <div className="col l-6 m-12 c-12 middleContainer" style={{ padding: '0px' }}>
                        {children}
                    </div>
                    <div className="col l-3 m-0 c-0"></div>
                    {/* RightContainer */}
                    <RightContainer></RightContainer>
                </div>
            </div>
        </>
    );
}

export default DefaultLayout;
