import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./Home/Home"));
const Posts = lazy(() => import("./Posts/Posts"));

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path="/posts/:user/channels/:channelId"
                element={<Posts />}
            />
        </Routes>
    );
};

export default AppRouter;
