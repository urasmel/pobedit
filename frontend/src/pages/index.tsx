import { lazy, Suspense } from "react";
import { Route, Routes, useRouteError } from "react-router-dom";
import NotFound from "./NotFound";
import Loading from "@/components/common/Loading";

const Home = lazy(() => import("./Home"));
const Posts = lazy(() => import("./Posts"));

const AppRouter = () => {
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
                path="/posts/:user/channels/:channelId"
                element={
                    <Posts />
                }
                errorElement={<ErrorBoundary />}
            />
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
};

function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);
    // Uncaught ReferenceError: path is not defined
    return <div>Dang!</div>;
}

export default AppRouter;
