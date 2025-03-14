// Import Component
import HomePage from '~/pages/HomePage';
import ProfilePage from '~/pages/ProfilePage';
import PublicPage from '~/pages/PublicPage';
import FeedPage from '~/pages/FeedPage';
import ListArticle from '~/pages/components/ListArticle';
import ListMusicInProfile from '~/pages/components/ListMusicInProfile';
import ArticleDetail from '~/pages/ArticleDetail';
import PlaylistDetail from '~/pages/PlaylistDetail';
import SongDetail from '~/pages/SongDetail';
import SignInPage from '~/pages/SignInPage';
import { Navigate, Outlet } from 'react-router-dom';
import { SignInSignUpLayout } from '~/components/Layout';
import { compile } from 'sass';
import SignUpPage from '~/pages/SignUpPage';
import { useContext } from 'react';
import { AuthContext } from '~/context/auth.context';

// Public Routes (Chưa đăng nhập vẫn truy cập được)
const publicRoutes = [
    {
        path: 'signup',
        component: SignUpPage,
        layout: SignInSignUpLayout,
    },
    {
        path: 'signin',
        component: SignInPage,
        layout: SignInSignUpLayout,
    },
];

// Private Routes (Yêu cầu đăng nhập)
const privateRoutes = [
    {
        path: '',
        component: PublicPage,
        children: [
            { path: '', component: HomePage },
            { path: 'feeds', component: FeedPage },
            {
                path: 'profile/:user',
                component: ProfilePage,
                children: [
                    { path: '', component: ListArticle },
                    { path: 'musics', component: ListMusicInProfile },
                ],
            },
            {
                path: 'article/:articleID',
                component: ArticleDetail,
            },
            {
                path: 'playlist/:playlistID',
                component: PlaylistDetail,
            },
            {
                path: 'song/:songID',
                component: SongDetail,
            },
        ],
    },
];

// Component Protected Route
const ProtectedRoute = () => {
    const { auth } = useContext(AuthContext);
    const token = localStorage.getItem('actk');

    // Nếu client vẫn còn lưu token thì sẽ được truy cập vào route (có thể sẽ thêm gọi api check xem token còn valid ko)
    // Ngược lại sẽ chuyển hướng về Sign In
    return token ? <Outlet /> : <Navigate to={`/signin`} />;
};

export { publicRoutes, privateRoutes, ProtectedRoute };
