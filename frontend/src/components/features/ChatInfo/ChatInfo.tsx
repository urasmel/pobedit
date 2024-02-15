import styles from './ChatInfo.module.css';
import { ChatFullInfo } from 'types/ChatFullInfo';

export const ChatInfo = (chatFullInfo: ChatFullInfo) => {
    return (
        <div className={styles.info}>

            <div className={styles.info__title}>
                <div className="info__photo">
                    <img src={`data:image/jpeg;base64,${chatFullInfo.chatPhoto}`} />
                </div>
                <div className={styles.info__about}>
                    {chatFullInfo.about}
                </div>
            </div>

            <div className={styles.info__desc}>
                Participants count: {chatFullInfo.participantsCount}
            </div>

        </div>
    );
};
