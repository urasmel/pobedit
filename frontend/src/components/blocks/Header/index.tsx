import { Logo } from '@/components/common/Logo';
import styles from './styles.module.css';
import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo} >
                <Link to="/">
                    <Logo />
                </Link>
            </div>
        </header >
    );
};
