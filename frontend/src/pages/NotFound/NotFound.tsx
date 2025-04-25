import { Button } from '@mui/material';
import styles from './NotFound.module.css';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {

    const navigate = useNavigate();
    return (
        <div className={styles.not_found}>
            Страница не найдена
            <Button
                onClick={() => { navigate('/'); }}
                variant="contained"
                color="primary">
                На главную
            </Button>
        </div>
    );
};
