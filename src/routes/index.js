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
import { SignInSignUpLayout } from '~/components/Layout';
import SignUpPage from '~/pages/SignUpPage';

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

export { publicRoutes, privateRoutes };
