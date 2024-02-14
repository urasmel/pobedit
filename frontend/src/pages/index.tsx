import { lazy } from "react";
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import("./Home"));


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
};

export default AppRouter;
