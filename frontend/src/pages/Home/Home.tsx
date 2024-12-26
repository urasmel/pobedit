import styles from "./Home.module.scss";
import { Main } from "@/widgets/Main";

export const Home = () => {
    return (
        <div className={styles.main_container}>
            <Main />
        </div>
    );
};
