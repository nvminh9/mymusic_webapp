import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import { DefaultLayout } from './components/Layout';
import { Fragment } from 'react';
import Favicon from 'react-favicon';
import favicon from '~/assets/images/FaviconBlack.png';

function App() {
    return (
        <BrowserRouter>
            <Favicon url={favicon} />
            <Routes>
                {publicRoutes.map((route, index) => {
                    {
                        /* 
                            Cơ chế tải Layout
                            1.route.layout = null -> không xài layout
                            2.route.layout = <layout> -> thì xài layout đó
                            3.route.layout Không được truyền thì xài layout mặc định 
                        */
                    }
                    let Layout = DefaultLayout;
                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }
                    const Page = route.component;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
