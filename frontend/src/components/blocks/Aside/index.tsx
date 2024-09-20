import styles from './styles.module.css';
import Badge from '@/components/common/Badge';

export const Aside = () => {
    return (
        <aside className={styles.aside}>
            <Badge title='Users' active={true} ></Badge>
            <Badge title='Tables' active={false} ></Badge>
        </aside>
    );
};
