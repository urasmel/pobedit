import styles from "./styles.module.css";
import { Users } from "@/components/features/Users";
import Channels from "@/components/features/Channels";

export const Main = () => {

    return (
        <div className={styles.info}>
            <Users />

            <Channels />
        </div>
    );
};
