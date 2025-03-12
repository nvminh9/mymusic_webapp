import { createContext, useState } from 'react';

// Auth Context
export const AuthContext = createContext({
    isAuthenticated: false,
    user: {},
});

export const AuthWrapper = (props) => {
    // Auth
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {},
    });

    // First Load
    const [isFirstLoading, setIsFirstLoading] = useState(true);

    return (
        <AuthContext.Provider value={{ auth, setAuth, isFirstLoading, setIsFirstLoading }}>
            {props.children}
        </AuthContext.Provider>
    );
};
