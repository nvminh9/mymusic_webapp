import Home from '~/pages/Home';
import Profile from '~/pages/Profile';
import { SignInSignUpLayout } from '~/components/Layout';

// Public Routes
const publicRoutes = [
    { path: '', component: Home },
    { path: 'profile', component: Profile },
];

// Private Routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
