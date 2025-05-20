import { lazy, Suspense } from "react";
import { Route, Routes, useRouteError } from "react-router-dom";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { Loading } from "@/shared/components/Loading";
import { PostPage } from "@/pages/PostPage";
import { HomePage } from "@/pages/HomePage";
import { PostsPage } from "@/pages/PostsPage";
import { AccountPage } from "@/pages/AccountPage";
import { AccountCommentsPage } from "@/pages/AccountCommentsPage";
import { SearchPage } from "@/pages/SearchPage";
import { SearchResultPage } from "@/pages/SearchResultPage";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary/ErrorBoundary";
import { ChannelPage } from "@/pages/ChannelPage";

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
