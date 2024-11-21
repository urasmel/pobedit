import styles from "./styles.module.scss";
import { Main } from "@/components/blocks/Main";

const Home = () => {
    return (
        <div className={styles.main_container}>
            <Main />
        </div>
    );
};

export default Home;
