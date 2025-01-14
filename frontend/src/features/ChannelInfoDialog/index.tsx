import { Channel } from "@/entities";
import styles from "./styles.module.css";

export const ChannelInfoDialog = (props: { channel: Channel; }) => {

    return (
        <div className={styles.info}>
            <div className={styles.info__title}>
                <div className={styles.info__photo}>
                    {
                        props.channel.image
                            ?
                            <img
                                src={`data:image/jpeg;base64,${props.channel.image}`}
                            />
                            :
                            <img src="./images/no_image.svg" alt="No image" />
                    }
                </div>
                <div className={styles.info__about}>
                    {props.channel.about}
                </div>
            </div>

            <div className={styles.info__desc}>
                Подписчиков: {props.channel.participantsCount}
            </div>
        </div>
    );
};
