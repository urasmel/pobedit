import { Logo } from '@/components/common/Logo';
import styles from './styles.module.css';

export const Header = () => {
    return (
        <header className={styles.header}>
            <a className={styles.logo} href='/'>
                <Logo />
            </a>
        </header>
    );
};
