import LeftContainer from '~/components/LeftContainer';
import MiddleContainer from '~/components/MiddleContainer';
import RightContainer from '~/components/RightContainer';

function DefaultLayout({ children }) {
    return (
        <>
            <div className="grid wide wrapper">
                <div className="row container">
                    {/* LeftContainer */}
                    <LeftContainer></LeftContainer>
                    {/* MiddleContainer */}
                    <MiddleContainer>{children}</MiddleContainer>
                    {/* RightContainer */}
                    <RightContainer></RightContainer>
                </div>
            </div>
        </>
    );
}

export default DefaultLayout;
