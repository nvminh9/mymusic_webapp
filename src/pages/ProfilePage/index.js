import { useEffect } from 'react';

function ProfilePage() {
    // Đổi title trang
    useEffect(() => {
        document.title = 'Profile | mymusic';
    }, []);

    return <></>;
}

export default ProfilePage;
