import { Aside } from '../widgets/aside';
import { Footer } from "../widgets/footer";
import { Header } from "../widgets/header/header";
import { AppRouter } from "./routers";
import { queryClient } from "@/shared/api/query-client";
import { Providers } from './providers';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './styles/index.scss';
import { Box } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


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


            <Box
                sx={{
                    display: 'flex',
                    height: '100%',
                    overflow: 'visible',
                    gap: "1rem",
                    flex: "1",
                    marginTop: "1rem",
                }}
            >
                <Box
                    sx={{
                        width: `15%`,
                    }}
                >
                    <Aside />
                </Box>
                <Box
                    sx={{
                        width: `85%`,
                        overflow: 'auto',
                        boxShadow: "var(--shadow)",
                        borderRadius: ".3rem",
                        padding: 2
                    }}
                >
                    <Providers client={queryClient} >
                        <AppRouter />
                    </Providers>
                </Box>
            </Box>







            {/* <Box sx={{
                display: "flex",
                gap: "1rem",
                flex: "3 1 1vw",
                marginTop: "1rem"
            }}>


                <Box sx={{
                    flex: "6 6 85vw",
                    boxShadow: "var(--shadow)",
                    borderRadius: ".3rem"
                }}>
                    <Providers client={queryClient} >
                        <AppRouter />
                    </Providers>
                </Box>
            </Box> */}



            <Footer />
        </Box >
    </BrowserRouter >
    // </React.StrictMode>
);
