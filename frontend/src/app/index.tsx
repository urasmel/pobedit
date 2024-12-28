import { Aside } from '../widgets/Aside';
import { Footer } from "../widgets/Footer";
import { Header } from "../widgets/Header";
import { AppRouter } from "./routers";
import styles from "./styles/index.module.css";
import { queryClient } from "@/shared/api/query-client";
import { Providers } from './providers';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";


const rootNode = document.getElementById('root') as Element;
const root = createRoot(rootNode);
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <div className={styles.app}>

            <div className={styles.header}>
                <Header />
            </div>

            <div className={styles.main_block}>

                <div className={styles.aside}>
                    <Aside />
                </div>

                <div className={styles.main_content}>

                    <Providers client={queryClient} >
                        <AppRouter />
                    </Providers>
                </div>

            </div>
            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    </BrowserRouter >
    // </React.StrictMode>
);
