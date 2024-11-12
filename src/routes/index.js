import { lazy } from 'react';
import { SignInSignUpLayout } from '~/components/Layout';
import HomePage from '~/pages/HomePage';
import ProfilePage from '~/pages/ProfilePage';

// Public Routes
const publicRoutes = [
    { path: '', component: HomePage },
    { path: 'profile', component: ProfilePage, layout: null },
];

// Private Routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
