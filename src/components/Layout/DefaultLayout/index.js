import { useContext, useEffect } from 'react';
import LeftContainer from '~/components/LeftContainer';
import MiddleContainer from '~/components/MiddleContainer';
import RightContainer from '~/components/RightContainer';
import { AuthContext } from '~/context/auth.context';
import { getAuthUserInfoApi } from '~/utils/api';
import logo from '~/assets/images/logoWhiteTransparent.png';
import { IoBowlingBallOutline } from 'react-icons/io5';

function DefaultLayout({ children }) {
    // State (useState)

    // Context (useContext)
    const { auth, setAuth, isFirstLoading, setIsFirstLoading } = useContext(AuthContext);

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // FIRST APP LOADING
        // Handle Get Auth User
        const getAuthUserInfo = async () => {
            setIsFirstLoading(true);
            // Call API /auth
            const res = await getAuthUserInfoApi();
            if (res) {
                console.log('>>> res.data', res.data);
                setAuth({
                    isAuthenticated: true,
                    user: res?.data ?? {},
                });
                setTimeout(() => {
                    setIsFirstLoading(false);
                }, 2000);
            }
        };
        getAuthUserInfo();
    }, []);

    return (
        <>
            <div className="grid wide wrapper">
                <div className="row container">
                    {/* Check If App First Loading */}
                    {isFirstLoading === true ? (
                        <>
                            <div
                                style={{
                                    display: 'grid',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    width: '100%',
                                }}
                            >
                                <div className="col l-12 m-12 c-12 appLoadingContainer">
                                    <img src={logo} style={{ width: '250px' }} />
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: '20px',
                                        }}
                                    >
                                        <IoBowlingBallOutline className="loadingAnimation" />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* LeftContainer */}
                            <LeftContainer></LeftContainer>
                            {/* MiddleContainer */}
                            <MiddleContainer>{children}</MiddleContainer>
                            {/* RightContainer */}
                            <RightContainer></RightContainer>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default DefaultLayout;
