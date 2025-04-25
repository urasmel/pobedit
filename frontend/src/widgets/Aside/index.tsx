import styles from './styles.module.css';
import Badge from '@/shared/components/Badge';

export const Aside = () => {
    return (
        <aside className={styles.aside}>
            <Badge title='Поиск' active={true} link='/search'></Badge>
            <Badge title='Управление' active={false} link='/admin'></Badge>
        </aside>
    );
};
