import { lazy, Suspense } from "react";
import { Route, Routes, useRouteError } from "react-router-dom";
import { NotFound } from "@/pages/NotFound";
import Loading from "@/shared/components/Loading";
import { Comments } from "@/pages/Comments";
import { Home } from "@/pages/Home";
import { Posts } from "@/pages/Posts";
import { AccountPage } from "@/pages/AccountPage";

// const Home = lazy(() => import("@/pages/Home"));
// const Posts = lazy(() => import("@/pages/Posts"));

export const AppRouter = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Suspense fallback={<Loading />}>
                        <Home />
                    </Suspense>
                }
                errorElement={<ErrorBoundary />}
            />
            <Route
                path="/channels/:channelId/posts/:postId/comments"
                element={
                    <Suspense fallback={<Loading />}>
                        <Comments />
                    </Suspense>
                }
                errorElement={<ErrorBoundary />}
            />
            <Route
                path="/channels/:channelId/posts"
                element={
                    <Suspense fallback={<Loading />}>
                        <Posts />
                    </Suspense>
                }
                errorElement={< ErrorBoundary />}
            />
            <Route
                path="/accounts/:accountId"
                element={
                    <Suspense fallback={<Loading />}>
                        <AccountPage />
                    </Suspense>
                }
                errorElement={< ErrorBoundary />}
            />            <Route
                path="/accounts/:accountId/comments"
                element={
                    <Suspense fallback={<Loading />}>
                        <AccountPage />
                    </Suspense>
                }
                errorElement={< ErrorBoundary />}
            />
            < Route path='*' element={< NotFound />} />
        </Routes >
    );
};

function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);
    // Uncaught ReferenceError: path is not defined
    return <div>Dang!</div>;
}
