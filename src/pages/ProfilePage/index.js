import { useEffect } from 'react';

function ProfilePage() {
    // Đổi title trang
    useEffect(() => {
        document.title = 'Profile | mymusic';
    }, []);

    return (
        <>
            <h1>Profile</h1>
        </>
    );
}

export default ProfilePage;
