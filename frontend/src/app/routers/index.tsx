import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "@/pages/not-found";
import { Loading } from "@/shared/components/loading/loading-widget";
import { PostPage } from "@/pages/post";
import { HomePage } from "@/pages/home";
import { PostsPage } from "@/pages/posts";
import { AccountPage } from "@/pages/account";
import { AccountCommentsPage } from "@/pages/account-comments";
import { SearchPage } from "@/pages/search";
import { SearchResultPage } from "@/pages/search-result";
import { ErrorBoundary } from "@/shared/components/errors/error-boundary";
import { ChannelPage } from "@/pages/channel";
import { SettingsPage } from "@/pages/settings";
import { ControlPage } from "@/pages/control";

// const Home = lazy(() => import("@/pages/Home"));
// const Posts = lazy(() => import("@/pages/Posts"));

export const AppRouter = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <HomePage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/channels/:channelId"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <ChannelPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/channels/:channelId/posts/:postId"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <PostPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/channels/:channelId/posts"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <PostsPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/accounts/:accountId"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <AccountPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/accounts/:accountId/comments"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <AccountCommentsPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/search"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <SearchPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/settings"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <SettingsPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/control"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <ControlPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/result"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <SearchResultPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            < Route path='*' element={< NotFoundPage />} />
        </Routes >
    );
};
