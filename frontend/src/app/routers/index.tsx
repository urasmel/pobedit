import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "@/shared/components/errors/error-boundary";
import { LoadingWidget } from "@/shared/components/loading/loading-widget";
const NotFoundPage = lazy(() => import("../../pages/not-found"));
const PostPage = lazy(() => import("../../pages/post"));
const HomePage = lazy(() => import("../../pages/home"));
const PostsPage = lazy(() => import("../../pages/posts"));
const AccountPage = lazy(() => import("../../pages/account"));
const AccountComments = lazy(() => import("../../pages/account-comments"));
const SearchPage = lazy(() => import("../../pages/search"));
const SearchResultPage = lazy(() => import("../../pages/search-result"));
const ChannelPage = lazy(() => import("../../pages/channel"));
const SettingsPage = lazy(() => import("../../pages/settings"));
const ControlPage = lazy(() => import("../../pages/control"));
const AccountsPage = lazy(() => import("../../pages/accounts"));

export const AppRouter = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingWidget />}>
                <Routes>
                    <Route
                        path="/"
                        element={<HomePage />}
                    />
                    <Route
                        path="/channels/:channelId"
                        element={<ChannelPage />}
                    />
                    <Route
                        path="/channels/:channelId/posts/:postId"
                        element={<PostPage />}
                    />
                    <Route
                        path="/channels/:channelId/posts"
                        element={<PostsPage />}
                    />
                    <Route
                        path="/accounts"
                        element={<AccountsPage />}
                    />
                    <Route
                        path="/accounts/:accountId"
                        element={<AccountPage />}
                    />
                    <Route
                        path="/accounts/:accountId/comments"
                        element={<AccountComments />}
                    />
                    <Route
                        path="/search"
                        element={<SearchPage />}
                    />
                    <Route
                        path="/settings"
                        element={<SettingsPage />}
                    />
                    <Route
                        path="/control"
                        element={<ControlPage />}
                    />
                    <Route
                        path="/result"
                        element={<SearchResultPage />}
                    />
                    < Route path='*' element={< NotFoundPage />} />
                </Routes >
            </Suspense>
        </ErrorBoundary >
    );
};
