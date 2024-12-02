import { useState } from 'react';
import { VscChevronLeft } from 'react-icons/vsc';
import { Outlet, Link, useNavigate } from 'react-router-dom';

function MiddleContainer({ children }) {
    const [tab, setTab] = useState(1); // tạm thời giá trị khởi tạo là 1 (trang chủ), có thể tương lai bằng tab lưu trong localstorage

    // Chuyển Tab
    const navigate = useNavigate();
    const handleSwitchTab = (e) => {
        e.preventDefault();
        // setTab với id của tab được bấm
        setTab(parseInt(e.target.id));
    };

    return (
        <>
            <div className="col l-3 m-0 c-0"></div>
            <div className="col l-6 m-12 c-12 middleContainer">
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
                            className={['btnHomePage', tab === 1 ? 'actived' : ''].join(' ')}
                            // onClick={handleSwitchTab}
                        >
                            <span>Trang chủ</span>
                        </button>
                    </Link>
                    <Link
                        to="/feed"
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
                            className={['btnFeedPage', tab === 2 ? 'actived' : ''].join(' ')}
                            // onClick={handleSwitchTab}
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
