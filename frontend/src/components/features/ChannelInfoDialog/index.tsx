import styles from "./styles.module.css";
import { MainState, useMainStore } from "@/store/MainStore";
import NoImageSvg from "../../../assets/images/no_image.svg";

export const ChannelInfoDialog = () => {
    const channelFullInfo = useMainStore(
        (state: MainState) => state.selectedChannelInfo
    );

    return (
        <div className={styles.info}>
            <div className={styles.info__title}>
                <div className={styles.info__photo}>
                    {
                        channelFullInfo.image
                            ?
                            <img
                                src={`data:image/jpeg;base64,${channelFullInfo.image}`}
                            />
                            :
                            <img src={NoImageSvg} alt="No image" />
                    }
                </div>
                <div className={styles.info__about}>
                    {channelFullInfo.about}
                </div>
            </div>

            <div className={styles.info__desc}>
                Подписчиков: {channelFullInfo.participantsCount}
            </div>
        </div>
    );
};
