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
import { compile } from 'sass';
// hết import Component

// Public Routes
const publicRoutes = [
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

// Private Routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
