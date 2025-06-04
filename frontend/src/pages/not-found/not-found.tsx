import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {

    const navigate = useNavigate();
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Roboto', sans-serif",
            fontSize: "2rem",
            fontWeight: "700",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "1rem",
            color: "#333"
        }}>
            Страница не найдена
            <Button
                onClick={() => { navigate('/'); }}
                variant="contained"
                color="primary">
                На главную
            </Button>
        </Box>
    );
};
