import { lazy } from 'react';
import { SignInSignUpLayout } from '~/components/Layout';
// Import Component
import HomePage from '~/pages/HomePage';
import ProfilePage from '~/pages/ProfilePage';
import PublicPage from '~/pages/PublicPage';
// hết import Component

// Public Routes
const publicRoutes = [
    {
        path: '',
        component: PublicPage,
        children: [
            { path: '', component: HomePage },
            { path: 'feed', component: ProfilePage },
        ],
    },
    // { path: 'profile', component: ProfilePage },
];

// Private Routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
