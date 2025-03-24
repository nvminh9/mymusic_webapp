import { Fragment, useEffect, useState } from 'react';
import { IoCloseSharp, IoSyncSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { getFollowersApi } from '~/utils/api';

function ListFollower() {
    // State
    const [listFollower, setListFollower] = useState();

    // Context

    // Ref

    // Chuyển Tab
    const location = useLocation();
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // Call API Lấy danh sách người theo dõi
        const getFollowers = async () => {
            // userName của profile
            const userName = location.pathname.split('/')[2];
            const res = await getFollowersApi(userName);
            // Kiểm tra
            if (res) {
                console.log('res?.data?.rows: ', res?.data?.rows);
                setListFollower(res?.data?.rows);
                return;
            }
            return;
        };
        getFollowers();
    }, []);

    return (
        <Fragment>
            <div
                className="settingMenuContainer"
                style={{
                    top: '0',
                    height: '100%',
                }}
            >
                <div className="settingMenu">
                    <span
                        className="title"
                        style={{
                            position: 'relative',
                        }}
                    >
                        <span>Người theo dõi</span>
                        <button
                            className=""
                            style={{
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '5px',
                                top: '0',
                                right: '0',
                            }}
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            <IoCloseSharp />
                        </button>
                    </span>
                    {/* Danh sách người theo dõi */}
                    {listFollower ? (
                        <>
                            {listFollower.map((follower, index) => (
                                <>
                                    <span key={index} style={{ color: 'white' }}>
                                        {follower.follower}
                                    </span>
                                </>
                            ))}
                        </>
                    ) : (
                        <>
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '50px',
                                }}
                            >
                                <IoSyncSharp className="loadingAnimation" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Fragment>
    );
}

export default ListFollower;
