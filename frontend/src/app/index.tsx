import { Aside } from "@/components/blocks/Aside";
import { Footer } from "@/components/blocks/Footer";
import { Header } from "@/components/blocks/Header";
import AppRouter from "pages/index";
import "./index.scss";
import styles from "./styles.module.css";

function App() {
    return <div className={styles["app"]}>

        <div className={styles["aside"]}>
            <Aside />
        </div>

        <div className={styles["main_block"]}>

            <div className={styles["header"]}>
                <Header />
            </div>


            <div className={styles["main_content"]}>
                <AppRouter />
            </div>

            <div className={styles["footer"]}>
                <Footer />
            </div>
        </div>
    </div>;
}

export default App;
