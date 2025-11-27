import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { IoChevronDownSharp, IoCloseSharp, IoPersonOutline, IoSyncSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { AuthContext } from '~/context/auth.context';
import { createFollowUserApi, getFollowersApi, unfollowUserApi } from '~/utils/api';
import { message } from 'antd';
import { EnvContext } from '~/context/env.context';

function ListFollower() {
    // State
    const [listFollower, setListFollower] = useState(); // Array Object
    const [isFollowed, setIsFollowed] = useState(); // For Loading Follow Animation

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // Ref
    const listFollowerRef = useRef(null);

    // Chuyển Tab
    const location = useLocation();
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---
    // Handle Follow User (Button Follow)
    const handleFollowUser = async (userName) => {
        try {
            // Loading Follow Handle
            // setIsFollowed('pending');
            setIsFollowed({
                status: 'pending',
                userName: userName,
                action: 'follow',
            });
            // Call API
            setTimeout(async () => {
                const res = await createFollowUserApi(userName);
                // Kiểm tra response
                if (res?.data !== null) {
                    // Đổi followStatus
                    setListFollower(
                        listFollower.map((follower) => {
                            if (follower?.follower === userName) {
                                return { ...follower, followStatus: true };
                            } else {
                                return { ...follower };
                            }
                        }),
                    );
                    // console.log('New List Follower: ', listFollower);
                    setIsFollowed('success');
                    return;
                } else {
                    setIsFollowed('fail');
                    message.error({
                        content: 'Theo dõi người dùng không thành công',
                        duration: 1.5,
                    });
                    return;
                }
            }, 1000);
        } catch (error) {
            console.log('>>> Error Sign Out: ', error);
            setIsFollowed('fail');
            message.error({
                content: 'Theo dõi người dùng không thành công',
                duration: 1.5,
            });
            return;
        }
    };
    // Handle Unfollow User (Button Unfollow)
    const handleUnfollowUser = async (userName) => {
        try {
            // Loading Follow Handle
            // setIsFollowed('pending');
            setIsFollowed({
                status: 'pending',
                userName: userName,
                action: 'unfollow',
            });
            // Call API Hủy theo dõi
            setTimeout(async () => {
                const res = await unfollowUserApi(userName);
                // Kiểm tra response
                if (res?.data === true) {
                    // Đổi followStatus
                    setListFollower(
                        listFollower.map((follower) => {
                            if (follower?.follower === userName) {
                                return { ...follower, followStatus: false };
                            } else {
                                return { ...follower };
                            }
                        }),
                    );
                    setIsFollowed('fail');
                    return;
                } else {
                    setIsFollowed('success');
                    message.error({
                        content: 'Hủy theo dõi người dùng không thành công',
                        duration: 1.5,
                    });
                    return;
                }
            }, 1000);
        } catch (error) {
            console.log('>>> Error Sign Out: ', error);
            setIsFollowed('success');
            message.error({
                content: 'Hủy theo dõi người dùng không thành công',
                duration: 1.5,
            });
            return;
        }
    };
    // Call API lấy danh sách người theo dõi
    useEffect(() => {
        // Call API Lấy danh sách người theo dõi
        const getFollowers = async () => {
            // userName của profile
            const userName = location.pathname.split('/')[2];
            const res = await getFollowersApi(userName);
            // Kiểm tra
            if (res) {
                // console.log('res?.data?.rows: ', res?.data?.rows);
                // setTimeout(() => {
                //     setListFollower(res?.data?.rows);
                // }, 1000);
                setListFollower(res?.data?.rows);
                return;
            }
            return;
        };
        getFollowers();
    }, []);
    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (listFollowerRef.current && !listFollowerRef.current.contains(event.target)) {
                // setIsOpenShareArticleBox(false);
                navigate(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
                <div
                    ref={listFollowerRef}
                    className="settingMenu"
                    style={{
                        width: '350px',
                    }}
                >
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
                    {/* <input
                        className="searchInput"
                        type="search"
                        placeholder="Tìm kiếm..."
                        name="search"
                        id="search"
                        autoComplete="off"
                        spellCheck="false"
                    /> */}
                    {/* Danh sách người theo dõi */}
                    <div
                        className="listFollowerContainer"
                        style={{
                            height: listFollower?.length > 6 ? '450px' : '100%',
                        }}
                    >
                        {/* Render danh sách người theo dõi */}
                        {listFollower?.length === 0 ? (
                            <>
                                <div className="follower">
                                    <span
                                        style={{
                                            color: 'white',
                                            fontFamily: 'sans-serif',
                                            fontSize: '15px',
                                            fontWeight: '400',
                                            textAlign: 'center',
                                            padding: '20px 10px',
                                            width: '100%',
                                        }}
                                    >
                                        {/* <IoPersonOutline /> <br /> */}
                                        Chưa có người theo dõi
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                {listFollower ? (
                                    <>
                                        {listFollower?.map((follower, index) => (
                                            <div key={index} className="follower">
                                                <div className="left" style={{}}>
                                                    <img
                                                        className="userAvatar"
                                                        src={
                                                            follower?.followerUser?.userAvatar
                                                                ? env?.backend_url + follower?.followerUser?.userAvatar
                                                                : defaultAvatar
                                                        }
                                                        onClick={() => {
                                                            navigate(`/profile/${follower?.follower}`);
                                                        }}
                                                    />
                                                    <span
                                                        className="userName"
                                                        onClick={() => {
                                                            navigate(`/profile/${follower?.follower}`);
                                                        }}
                                                    >
                                                        {follower?.follower}
                                                    </span>
                                                </div>
                                                {/* <div className="right"></div> */}
                                                {/* Render nút theo dõi */}
                                                {auth?.user?.userName === follower?.follower ? (
                                                    <></>
                                                ) : (
                                                    <>
                                                        {isFollowed?.status === 'pending' &&
                                                            isFollowed?.userName === follower?.follower && (
                                                                <button
                                                                    className="btnFollow"
                                                                    style={{
                                                                        position: 'absolute',
                                                                        right: '0',
                                                                        padding: '6px 8px',
                                                                        fontWeight: '500',
                                                                        zIndex: '10',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        gap: '5px',
                                                                    }}
                                                                    disabled
                                                                >
                                                                    {isFollowed?.action === 'follow'
                                                                        ? 'Theo dõi'
                                                                        : 'Hủy theo dõi'}
                                                                    <IoSyncSharp
                                                                        className="loadingAnimation"
                                                                        style={{ color: '#000', fontSize: '14px' }}
                                                                    />
                                                                </button>
                                                            )}
                                                        {follower?.followStatus === true && (
                                                            <button
                                                                className="btnFollowed"
                                                                onClick={() => {
                                                                    handleUnfollowUser(follower?.follower);
                                                                }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    right: '0',
                                                                    padding: '5px 8px',
                                                                    fontWeight: '500',
                                                                    opacity:
                                                                        isFollowed?.status === 'pending' ? '0.3' : '',
                                                                    backgroundColor:
                                                                        isFollowed?.status === 'pending'
                                                                            ? 'transparent'
                                                                            : '',
                                                                    cursor:
                                                                        isFollowed?.status === 'pending'
                                                                            ? 'not-allowed'
                                                                            : '',
                                                                }}
                                                                disabled={
                                                                    isFollowed?.status === 'pending' ? true : false
                                                                }
                                                            >
                                                                Hủy theo dõi
                                                            </button>
                                                        )}
                                                        {follower?.followStatus === false && (
                                                            <button
                                                                className="btnFollow"
                                                                onClick={() => {
                                                                    handleFollowUser(follower?.follower);
                                                                }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    right: '0',
                                                                    padding: '5px 8px',
                                                                    fontWeight: '500',
                                                                    opacity:
                                                                        isFollowed?.status === 'pending' ? '0.3' : '',
                                                                    backgroundColor:
                                                                        isFollowed?.status === 'pending' ? 'white' : '',
                                                                    cursor:
                                                                        isFollowed?.status === 'pending'
                                                                            ? 'not-allowed'
                                                                            : '',
                                                                }}
                                                                disabled={
                                                                    isFollowed?.status === 'pending' ? true : false
                                                                }
                                                            >
                                                                Theo dõi
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <div
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: '20px 0px',
                                            }}
                                        >
                                            <IoSyncSharp className="loadingAnimation" />
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default ListFollower;
