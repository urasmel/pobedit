import { Aside } from '../widgets/Aside';
import { Footer } from "../widgets/Footer/Footer";
import { Header } from "../widgets/Header/Header";
import { AppRouter } from "./routers";
import { queryClient } from "@/shared/api/query-client";
import { Providers } from './providers';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './styles/index.scss';
import { theme, ThemeContext } from './theme';
import { Box } from '@mui/material';


const rootNode = document.getElementById('root') as Element;
const root = createRoot(rootNode);
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            boxSizing: "border-box",
            padding: ".5rem"
        }}>

            <Header />

            <Box sx={{
                display: "flex",
                gap: "1rem",
                flex: "3 1 1vw",
                marginTop: "1rem"
            }}>

                <Aside />

                <Box sx={{
                    flex: "6 6 85vw",
                    boxShadow: "var(--shadow)",
                    borderRadius: ".3rem"
                }}>
                    <ThemeContext.Provider value={theme}>
                        <Providers client={queryClient} >
                            <AppRouter />
                        </Providers>
                    </ThemeContext.Provider>
                </Box>

            </Box>

            <Footer />
        </Box>
    </BrowserRouter >
    // </React.StrictMode>
);
