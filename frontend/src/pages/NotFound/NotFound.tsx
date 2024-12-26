import { Button } from '@mui/material';
import styles from './NotFound.module.css';
import { NavLink } from 'react-router-dom';

export const NotFound = () => {

    return (
        <div className={styles.not_found}>
            Страница не найдена
            <Button component={NavLink} to="/" variant="contained" color="primary">
                На главную
            </Button>
        </div>
    );
};
