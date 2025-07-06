import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import ProtectedRoute from './components/ProtectedRoute';
import { DefaultLayout } from './components/Layout';
import { Fragment } from 'react';
import Favicon from 'react-favicon';
import favicon from '~/assets/images/FaviconBlack.png';
import GlobalStyles from './components/GlobalStyles';
import GridSystem from './components/GridSystem';
import { AuthWrapper } from './context/auth.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MusicPlayerProvider } from './context/musicPlayer.context';

const queryClient = new QueryClient();

function App() {
    return (
        <GridSystem>
            <GlobalStyles>
                <AuthWrapper>
                    <QueryClientProvider client={queryClient}>
                        <MusicPlayerProvider>
                            <BrowserRouter>
                                <Favicon url={favicon} />
                                <Routes>
                                    {/* Public Routes */}
                                    {publicRoutes.map((publicRoute, index) => {
                                        {
                                            /*
                                                Cơ chế tải Layout
                                                1.route.layout = null -> không xài layout
                                                2.route.layout = <layout> -> thì xài layout đó
                                                3.route.layout Không được truyền thì xài layout mặc định
                                                4.nếu route.children có, thì sẽ trả về các child route tương ứng (chung Layout với route cha)
                                            */
                                        }
                                        let Layout = DefaultLayout;
                                        if (publicRoute.layout) {
                                            Layout = publicRoute.layout;
                                        } else if (publicRoute.layout === null) {
                                            Layout = Fragment;
                                        }
                                        const Page = publicRoute.component;
                                        return (
                                            <Route
                                                key={index}
                                                path={publicRoute.path}
                                                element={
                                                    <Layout>
                                                        <Page />
                                                    </Layout>
                                                }
                                            >
                                                {publicRoute.children &&
                                                    publicRoute.children.map((childRoute, index) => {
                                                        const ChildPage = childRoute.component;
                                                        return (
                                                            <Route
                                                                key={index}
                                                                path={childRoute.path}
                                                                element={<ChildPage />}
                                                            >
                                                                {childRoute.children &&
                                                                    childRoute.children.map(
                                                                        (childChildRoute, index) => {
                                                                            const ChildComponent =
                                                                                childChildRoute.component;
                                                                            return (
                                                                                <Route
                                                                                    key={index}
                                                                                    path={childChildRoute.path}
                                                                                    element={<ChildComponent />}
                                                                                ></Route>
                                                                            );
                                                                        },
                                                                    )}
                                                            </Route>
                                                        );
                                                    })}
                                            </Route>
                                        );
                                    })}
                                    {/* Private Routes (Bao bởi Protected Route Component, các route yêu cầu đăng nhập) */}
                                    {privateRoutes.map((route, index) => {
                                        {
                                            /*
                                                Cơ chế tải Layout
                                                1.route.layout = null -> không xài layout
                                                2.route.layout = <layout> -> thì xài layout đó
                                                3.route.layout Không được truyền thì xài layout mặc định
                                                4.nếu route.children có, thì sẽ trả về các child route tương ứng (chung Layout với route cha)
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
                                            <Route key={index} element={<ProtectedRoute />}>
                                                <Route
                                                    key={index}
                                                    path={route.path}
                                                    element={
                                                        <Layout>
                                                            <Page />
                                                        </Layout>
                                                    }
                                                >
                                                    {route.children &&
                                                        route.children.map((childRoute, index) => {
                                                            const ChildPage = childRoute.component;
                                                            return (
                                                                <Route
                                                                    key={index}
                                                                    path={childRoute.path}
                                                                    element={<ChildPage />}
                                                                >
                                                                    {childRoute.children &&
                                                                        childRoute.children.map(
                                                                            (childChildRoute, index) => {
                                                                                const ChildComponent =
                                                                                    childChildRoute.component;
                                                                                return (
                                                                                    <Route
                                                                                        key={index}
                                                                                        path={childChildRoute.path}
                                                                                        element={<ChildComponent />}
                                                                                    ></Route>
                                                                                );
                                                                            },
                                                                        )}
                                                                </Route>
                                                            );
                                                        })}
                                                </Route>
                                            </Route>
                                        );
                                    })}
                                </Routes>
                            </BrowserRouter>
                        </MusicPlayerProvider>
                    </QueryClientProvider>
                </AuthWrapper>
            </GlobalStyles>
        </GridSystem>
    );
}

export default App;
