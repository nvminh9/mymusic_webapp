import { useEffect } from 'react';

function ProfilePage() {
    // Đổi title trang
    useEffect(() => {
        document.title = 'Profile | mymusic: Music from everyone';
    }, []);

    return (
        <div className="profilePage">
            <h1 style={{ color: 'whitesmoke', margin: '0px' }}>Profile</h1>
        </div>
    );
}

export default ProfilePage;
