import { useEffect } from "react";
import styles from "./ChannelInfo.module.css";
import { MainState, useMainStore } from "@/store/MainStore";

export const ChannelInfo = () => {
    const channelFullInfo = useMainStore(
        (state: MainState) => state.selectedChannelFullInfo
    );

    useEffect(() => {}, []);

    if (!channelFullInfo) {
        return null;
    }

    return (
        <div className={styles.info}>
            <div className={styles.info__title}>
                <div className={styles.info__photo}>
                    <img
                        src={`data:image/jpeg;base64,${channelFullInfo.image}`}
                    />
                </div>
                <div className={styles.info__about}>
                    {channelFullInfo.about}
                </div>
            </div>

            <div className={styles.info__desc}>
                Participants count: {channelFullInfo.participantsCount}
            </div>
        </div>
    );
};
