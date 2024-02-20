import { useEffect } from 'react';
import styles from './ChatInfo.module.css';
import { MainState, useMainStore } from '@/store/MainStore';

export const ChatInfo = () => {

    const chatFullInfo = useMainStore((state: MainState) => state.selectedChatFullInfo);

    useEffect(() => {
        console.log(chatFullInfo);
    }, []);

    if (!chatFullInfo) {
        return null;
    }

    return (
        <div className={styles.info}>

            <div className={styles.info__title}>
                <div className={styles.info__photo}>
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
