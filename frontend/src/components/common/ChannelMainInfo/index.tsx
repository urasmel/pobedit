import { ChannelMainInfoProps } from 'types/Props';
import styles from './styles.module.css';

export const ChannelMainInfo = (props: ChannelMainInfoProps) => {
    return (
        <div className={styles.widget}>
            <div className={styles.widget__message}>
                Канал: {props.title}
            </div>
            <div className={styles.widget__message}>
                Иденификатор канала: {props.id}
            </div>
        </div>
    );
};
