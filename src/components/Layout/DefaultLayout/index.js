import { useContext, useEffect } from 'react';
import LeftContainer from '~/components/LeftContainer';
import MiddleContainer from '~/components/MiddleContainer';
import RightContainer from '~/components/RightContainer';
import { AuthContext } from '~/context/auth.context';
import { getAuthUserInfoApi } from '~/utils/api';
import logo from '~/assets/images/logoWhiteTransparent.png';
import { IoBowlingBallOutline, IoSyncSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';

function DefaultLayout({ children }) {
    // State (useState)

    // Context (useContext)
    const { auth, setAuth, isFirstLoading, setIsFirstLoading } = useContext(AuthContext);
    const { setIsInteracted } = useMusicPlayerContext();

    // Navigation
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // FIRST APP LOADING (Or Reload)
        // Handle Get Auth User (Tạm thời comment Call API để tối ưu, do bên ProtectedRoute và SignIn đã Call API tương tự
        // và set data auth.user)
        const getAuthUserInfo = async () => {
            setIsFirstLoading(true);
            // Call API /auth
            // const res = await getAuthUserInfoApi();
            setTimeout(() => {
                setIsFirstLoading(false);
            }, 1000);
        };
        getAuthUserInfo();
    }, []);

    return (
        <>
            <div
                className="grid wide wrapper"
                onClick={() => {
                    setIsInteracted(true);
                }}
            >
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
                                        <IoSyncSharp className="loadingAnimation" />
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
