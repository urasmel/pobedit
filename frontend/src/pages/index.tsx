import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./Home"));
const Posts = lazy(() => import("./Posts"));

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
        </Routes>
    );
};

export default AppRouter;
