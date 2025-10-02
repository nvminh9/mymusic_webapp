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
import SharedArticleDetail from '~/pages/SharedArticleDetail';
import CreatePlaylistPage from '~/pages/CreatePlaylistPage';
import SearchPage from '~/pages/SearchPage';
import GenreDetailPage from '~/pages/GenreDetailPage';
import MessagePage from '~/pages/MessagePage';
import ChatWindowPage from '~/pages/ChatWindowPage';

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
                path: 'profile/:userName', // Trang cá nhân
                component: ProfilePage,
                children: [
                    { path: 'musics', component: ListMusicInProfile }, // Phần danh sách nhạc đã đăng
                    { path: 'followers', component: ListFollower }, // Phần danh sách người theo dõi
                    { path: 'following', component: ListFollowing }, // Phần danh sách đang theo dõi
                ],
            },
            {
                path: 'profile/:userName/edit', // Trang chỉnh sửa trang cá nhân
                component: ProfileEditPage,
            },
            {
                path: 'article/upload', // Trang đăng bài viết
                component: UploadArticlePage,
            },
            {
                path: 'article/:articleID', // Trang chi tiết bài viết
                component: ArticleDetail,
            },
            {
                path: 'article/shared/:sharedArticleID', // Trang chi tiết bài chia sẻ
                component: SharedArticleDetail,
            },
            {
                path: 'playlist/create', // Trang tạo danh sách phát
                component: CreatePlaylistPage,
            },
            {
                path: 'playlist/:playlistID', // Trang chi tiết danh sách phát
                component: PlaylistDetail,
            },
            {
                path: 'music/upload', // Trang đăng nhạc
                component: UploadMusicPage,
            },
            {
                path: 'song/:songID', // Trang chi tiết nhạc
                component: SongDetail,
            },
            {
                path: 'search', // Trang tìm kiếm
                component: SearchPage,
            },
            {
                path: 'genre/:genreId', // Trang chi tiết của thể loại nhạc
                component: GenreDetailPage,
            },
            {
                path: 'messages', // Trang danh sách các hội thoại
                component: MessagePage,
                children: [
                    { path: ':conversationId', component: ChatWindowPage }, // Cửa sổ chat
                ],
            },
        ],
    },
];

export { publicRoutes, privateRoutes };
