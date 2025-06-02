import { Logo } from '@/shared/components/logo';
import { Link, useNavigate } from "react-router-dom";
import { Box, Button } from '@mui/material';

export const Header = () => {

    const navigate = useNavigate();

    return (
        <Box sx={{
            fontFamily: "'Roboto', sans-serif",
            height: "3rem",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            position: "sticky",
            color: "rgba(0, 0, 0, 0.87)",
            borderRadius: "1rem",
            border: "0 solid rgba(0, 0, 0, 0.125)",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <Box sx={{ width: "2rem", height: "2rem" }} >
                <Link to="/">
                    <Logo />
                </Link>
            </Box>
            <Button
                variant="contained"
                onClick={() => { navigate(-1); }}
            >
                Назад
            </Button>
        </Box >
    );
};
