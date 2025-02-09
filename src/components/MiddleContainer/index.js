import { useState } from 'react';
import { VscChevronLeft } from 'react-icons/vsc';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

function MiddleContainer({ children }) {
    // Chuyển Tab
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <>
            <div className="col l-3 m-0 c-0"></div>
            <div id="middleContainerID" className="col l-6 m-12 c-12 middleContainer">
                {/* Thanh chuyển tab */}
                <div className="tabSwitchBar">
                    <Link
                        to="/"
                        style={{
                            fontFamily: '"Funnel Sans", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'ease-out 0.2s',
                            width: '50%',
                            margin: '0px',
                            textDecoration: 'none',
                        }}
                    >
                        <button
                            id="1"
                            className={['btnHomePage', location.pathname === '/' ? 'actived' : ''].join(' ')}
                        >
                            <span>Trang chủ</span>
                        </button>
                    </Link>
                    <Link
                        to="/feeds"
                        style={{
                            fontFamily: '"Funnel Sans", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'ease-out 0.2s',
                            width: '50%',
                            margin: '0px',
                            textDecoration: 'none',
                        }}
                    >
                        <button
                            id="2"
                            className={['btnFeedPage', location.pathname === '/feeds' ? 'actived' : ''].join(' ')}
                        >
                            <span>Bài đăng</span>
                        </button>
                    </Link>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div>
                {children}
            </div>
            <div className="col l-3 m-0 c-0"></div>
        </>
    );
}

export default MiddleContainer;
