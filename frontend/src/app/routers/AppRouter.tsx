import { lazy, Suspense } from "react";
import { Route, Routes, useRouteError } from "react-router-dom";
import { NotFound } from "@/pages/NotFound";
import Loading from "@/shared/components/Loading";
import { PostComments } from "@/pages/PostComments";
import { Home } from "@/pages/Home";
import { PostsPage } from "@/pages/PostsPage";
import { AccountPage } from "@/pages/AccountPage";
import { AccountComments } from "@/pages/AccountComments";
import { SearchPage } from "@/pages/SearchPage";
import { SearchResultPage } from "@/pages/SearchResultPage";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary/ErrorBoundary";

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
                            <Home />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="/channels/:channelId/posts/:postId/comments"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <PostComments />
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
                            <AccountComments />
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
            < Route path='*' element={< NotFound />} />
        </Routes >
    );
};
