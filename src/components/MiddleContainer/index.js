import { useState } from 'react';
import { VscChevronLeft } from 'react-icons/vsc';

function MiddleContainer({ children }) {
    const [tab, setTab] = useState(1); // tạm thời giá trị khởi tạo là 1 (trang chủ), có thể tương lai bằng tab lưu trong localstorage

    // Chuyển Tab
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
                    <button
                        id="1"
                        className={['btnHomePage', tab === 1 ? 'actived' : ''].join(' ')}
                        onClick={handleSwitchTab}
                    >
                        <span>Trang chủ</span>
                    </button>
                    <button
                        id="2"
                        className={['btnFeedPage', tab === 2 ? 'actived' : ''].join(' ')}
                        onClick={handleSwitchTab}
                    >
                        <span>Bài đăng</span>
                    </button>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip">
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
