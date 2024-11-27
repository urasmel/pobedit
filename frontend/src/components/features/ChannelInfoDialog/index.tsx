import styles from "./styles.module.css";
import { MainState, useMainStore } from "@/store/MainStore";

export const ChannelInfoDialog = () => {
    const channelFullInfo = useMainStore(
        (state: MainState) => state.selectedChannelInfo
    );

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
