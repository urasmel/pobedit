import styles from "./styles.module.css";
import { Users } from "@/components/features/Users";
import Channels from "@/components/features/Channels";
import { MainState, useMainStore } from "@/store/MainStore";

export const Main = () => {

    const setSelectedUser = useMainStore(
        (state: MainState) => state.setSelectedUser
    );

    const selectedUser = useMainStore((state: MainState) => state.selectedUser);

    return (
        <div className={styles.info}>
            <Users setSelectedUser={setSelectedUser} />

            <Channels userName={selectedUser} />
        </div>
    );
};
