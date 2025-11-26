import { createContext, useEffect, useState } from 'react';

// Env Context
export const EnvContext = createContext({
    backend_url: '',
});

export const EnvWrapper = (props) => {
    // Env
    const [env, setEnv] = useState({
        backend_url: '',
    });

    //
    useEffect(() => {
        if (window.location.hostname === 'localhost') {
            setEnv({
                backend_url: `http://localhost:3700`,
            });
        } else {
            setEnv({
                backend_url: `https://mymusic-api-1n5t.onrender.com`,
            });
        }
    }, []);

    return <EnvContext.Provider value={{ env, setEnv }}>{props.children}</EnvContext.Provider>;
};
