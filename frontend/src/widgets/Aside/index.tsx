import styles from './styles.module.css';
import Badge from '@/shared/components/Badge';

export const Aside = () => {
    return (
        <aside className={styles.aside}>
            <Badge title='Search' active={true} ></Badge>
            <Badge title='Tables' active={false} ></Badge>
        </aside>
    );
};
