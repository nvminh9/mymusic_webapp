import { IoPerson } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';

function UserCard({ userData, type }) {
    // State

    // Context

    // Ref

    // Navigation
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---

    // type === 'atSearchResult'
    if (type === 'atSearchResult') {
        return (
            <>
                <div className="col l-4 m-4 c-6 searchItemUser">
                    <div
                        className="userCardContainer"
                        onClick={() => {
                            navigate(`/profile/${userData.userName}`);
                        }}
                    >
                        {/* Icon User */}
                        <IoPerson
                            style={{
                                position: 'absolute',
                                top: '6px',
                                right: '6px',
                                color: '#ffffff',
                                fontSize: '18px',
                            }}
                        />
                        <div className="userCard">
                            {/* Avatar */}
                            <div className="userAvatarContainer">
                                <img
                                    className="userAvatar"
                                    src={
                                        userData?.userAvatar
                                            ? process.env.REACT_APP_BACKEND_URL + userData?.userAvatar
                                            : defaultAvatar
                                    }
                                    draggable="false"
                                />
                            </div>
                            {/* User Info */}
                            <div className="userInfo">
                                {/* User Name */}
                                <span className="userName">{userData?.userName}</span>
                            </div>
                            {userData?.description && (
                                <div
                                    className="userInfo"
                                    style={{
                                        paddingTop: '10px',
                                        borderTop: '0.5px solid #777777aa',
                                    }}
                                >
                                    {/* User Description */}
                                    <span className="userName">{userData?.description}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return <></>;
}

export default UserCard;
