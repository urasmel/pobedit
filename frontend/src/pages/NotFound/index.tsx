import { Button } from '@mui/material';
import styles from './styles.module.css';
import { NavLink } from 'react-router-dom';

const NotFound = () => {

    return (
        <div className={styles.not_found}>
            Страница не найдена
            <Button component={NavLink} to="/" variant="contained" color="primary">
                На главную
            </Button>
        </div>
    );
};

export default NotFound;
