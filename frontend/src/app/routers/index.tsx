import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "@/pages/not-found";
import { LoadingWidget } from "@/shared/components/loading/loading-widget";
import { PostPage } from "@/pages/post";
import { HomePage } from "@/pages/home";
import { PostsPage } from "@/pages/posts";
import { AccountPage } from "@/pages/account";
import { AccountComments } from "@/pages/account-comments";
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
                        <Suspense fallback={<LoadingWidget />}>
                            <HomePage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/channels/:channelId"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingWidget />}>
                            <ChannelPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/channels/:channelId/posts/:postId"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingWidget />}>
                            <PostPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/channels/:channelId/posts"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingWidget />}>
                            <PostsPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/accounts/:accountId"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingWidget />}>
                            <AccountPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/accounts/:accountId/comments"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingWidget />}>
                            <AccountComments />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/search"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingWidget />}>
                            <SearchPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/settings"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingWidget />}>
                            <SettingsPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/control"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingWidget />}>
                            <ControlPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/result"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingWidget />}>
                            <SearchResultPage />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            < Route path='*' element={< NotFoundPage />} />
        </Routes >
    );
};
