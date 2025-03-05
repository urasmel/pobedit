import styles from "./styles.module.css";
import { Users } from "@/features/Users";
import Channels from "@/features/Channels";

export const Main = () => {

    return (
        <div className={styles.info}>
            <Users />

            <Channels />
        </div>
    );
};
