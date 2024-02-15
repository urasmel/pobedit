import styles from './Aside.module.css';
import Badge from '../../common/Badge/Badge';

export const Aside = () => {
    return (
        <aside className={styles.aside}>
            <Badge title='Accounts' active={true} ></Badge>
            <Badge title='Tables' active={false} ></Badge>
        </aside>
    );
};
