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
import { SnackbarProvider } from 'notistack';
import { StyledMaterialDesignContent } from '@/shared/styles';


const rootNode = document.getElementById('root') as Element;
const root = createRoot(rootNode);
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <SnackbarProvider
            maxSnack={3}
            Components={{
                success: StyledMaterialDesignContent,
                error: StyledMaterialDesignContent,
            }}
        >
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                minWidth: "720px",
                boxSizing: "border-box",
                padding: ".5rem"
            }}>

                <Header />

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr',
                        height: '100%',
                        overflow: 'visible',
                        gap: ".5rem",
                        flex: "1",
                        marginTop: "1rem",
                    }}
                >
                    <Box
                        sx={{
                            gridRowStart: 1,
                        }}
                    >
                        <Aside />
                    </Box>

                    <Box
                        sx={{
                            boxShadow: "var(--strong-shadow)",
                            borderRadius: "var(--radius-md)",
                            padding: 2
                        }}
                    >
                        <Providers client={queryClient} >
                            <AppRouter />
                        </Providers>
                    </Box>
                </Box>

                <Footer />
            </Box >
        </SnackbarProvider >
    </BrowserRouter >
    // </React.StrictMode>
);
