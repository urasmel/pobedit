import { Aside } from '../widgets/Aside';
import { Footer } from "../widgets/Footer";
import { Header } from "../widgets/Header";
import { AppRouter } from "./routers";
import styles from "./styles/index.module.css";
import { queryClient } from "@/shared/api/query-client";
import { Providers } from './providers';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './styles/index.scss';
import { theme, ThemeContext } from './theme';


const rootNode = document.getElementById('root') as Element;
const root = createRoot(rootNode);
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <div className={styles.app}>

            <Header />

            <div className={styles.main_block}>

                <Aside />

                <div className={styles.main_content}>
                    <ThemeContext.Provider value={theme}>
                        <Providers client={queryClient} >
                            <AppRouter />
                        </Providers>
                    </ThemeContext.Provider>
                </div>

            </div>

            <Footer />
        </div>
    </BrowserRouter >
    // </React.StrictMode>
);
