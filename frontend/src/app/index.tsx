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
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
import { SnackbarProvider } from 'notistack';
import { StyledMaterialDesignContent } from '@/shared/styles';


const appStyles = {
    root: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: ".5rem",
        rowGap: "1rem",
        minWidth: "320px", // Добавьте разумный минимум
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: {
            xs: '1fr', // На мобильных - одна колонка
            lg: '180px 1fr' // На десктопе - две колонки
        },
        gridTemplateRows: {
            xs: '80px 1fr',
            lg: '1fr'
        },
        overflow: 'visible',
        gap: ".5rem",
        flex: "1",
        transition: 'grid-template-columns 0.3s ease-in-out', // Плавные переходы
    },
    aside: {
        gridRowStart: { xs: 1, lg: 1 },
        gridColumnStart: { xs: 1, lg: 1 },
    },
    content: {
        gridRowStart: { xs: 2, lg: 1 },
        gridColumnStart: { xs: 1, lg: 2 },
        boxShadow: "var(--strong-shadow)",
        width: "100%",
        borderRadius: "var(--radius-md)",
        padding: 1,
        minWidth: 0, // ⚠️ КРИТИЧЕСКИ ВАЖНО: разрешает сжатие
        overflow: 'hidden', // Предотвращает выход за границы
    }
};

const App = () => {

    return (
        <BrowserRouter>
            <SnackbarProvider
                maxSnack={3}
                Components={{
                    success: StyledMaterialDesignContent,
                    error: StyledMaterialDesignContent,
                }}
            >
                <Box sx={appStyles.root}>
                    <Header />

                    <Box sx={appStyles.mainGrid}>
                        <Box sx={appStyles.aside}>
                            <Aside />
                        </Box>

                        <Box sx={appStyles.content}>
                            <Providers client={queryClient}>
                                <AppRouter />
                            </Providers>
                        </Box>
                    </Box>

                    <Footer />
                </Box>
            </SnackbarProvider>
        </BrowserRouter>
    );
};

const rootNode = document.getElementById('root') as Element;
const root = createRoot(rootNode);
root.render(<App />
);
