import { Aside } from '../widgets/Aside';
import { Footer } from "../widgets/Footer";
import { Header } from "../widgets/Header";
import { AppRouter } from "./routers";
import styles from "./App.module.css";

function App() {
    return (
        <div className={styles.app}>

            <div className={styles.header}>
                <Header />
            </div>

            <div className={styles.main_block}>

                <div className={styles.aside}>
                    <Aside />
                </div>

                <div className={styles.main_content}>
                    <AppRouter />
                </div>

            </div>
            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    );
}

export default App;
