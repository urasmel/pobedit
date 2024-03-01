import styles from './Aside.module.css';
import Badge from 'components/common/Badge/Badge';

export const Aside = () => {
    return (
        <aside className={styles.aside}>
            <Badge title='Users' active={true} ></Badge>
            <Badge title='Tables' active={false} ></Badge>
        </aside>
    );
};
