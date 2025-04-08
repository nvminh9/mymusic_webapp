// Import Component
import HomePage from '~/pages/HomePage';
import ProfilePage from '~/pages/ProfilePage';
import PublicPage from '~/pages/PublicPage';
import FeedPage from '~/pages/FeedPage';
// import ListArticle from '~/pages/components/ListArticle';
import ListMusicInProfile from '~/pages/components/ListMusicInProfile';
import ArticleDetail from '~/pages/ArticleDetail';
import PlaylistDetail from '~/pages/PlaylistDetail';
import SongDetail from '~/pages/SongDetail';
import SignInPage from '~/pages/SignInPage';
import { SignInSignUpLayout } from '~/components/Layout';
import SignUpPage from '~/pages/SignUpPage';
import ProfileEditPage from '~/pages/ProfileEditPage';
import ListFollower from '~/pages/components/ListFollower';
import ListFollowing from '~/pages/components/ListFollowing';
import UploadArticlePage from '~/pages/UploadArticlePage';
import UploadMusicPage from '~/pages/UploadMusicPage';

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
                path: 'profile/:userName',
                component: ProfilePage,
                children: [
                    { path: 'musics', component: ListMusicInProfile },
                    { path: 'followers', component: ListFollower },
                    { path: 'following', component: ListFollowing },
                ],
            },
            {
                path: 'profile/:userName/edit',
                component: ProfileEditPage,
            },
            {
                path: 'article/upload',
                component: UploadArticlePage,
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
                path: 'music/upload',
                component: UploadMusicPage,
            },
            {
                path: 'song/:songID',
                component: SongDetail,
            },
        ],
    },
];

export { publicRoutes, privateRoutes };
