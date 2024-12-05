import { lazy } from 'react';
import { SignInSignUpLayout } from '~/components/Layout';
// Import Component
import HomePage from '~/pages/HomePage';
import ProfilePage from '~/pages/ProfilePage';
import PublicPage from '~/pages/PublicPage';
import FeedPage from '~/pages/FeedPage';
// hết import Component

// Public Routes
const publicRoutes = [
    {
        path: '',
        component: PublicPage,
        children: [
            { path: '', component: HomePage },
            { path: 'feeds', component: FeedPage },
        ],
    },
];

// Private Routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
