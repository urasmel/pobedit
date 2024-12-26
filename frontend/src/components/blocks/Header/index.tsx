import { Logo } from '@/components/common/Logo';
import styles from './styles.module.css';
import { Link, useNavigate } from "react-router-dom";
import { Button } from '@mui/material';

export const Header = () => {

    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <div className={styles.logo} >
                <Link to="/">
                    <Logo />
                </Link>
            </div>
            <Button
                variant="contained"
                onClick={() => { navigate(-1); }}
            >
                Назад
            </Button>
        </header >
    );
};
