import { Box } from '@mui/material';

export const Footer = () => {
    return (
        <Box sx={{
            fontFamily: "Roboto",
            height: "1rem",
            boxShadow: "var(--strong-shadow)",
            color: "#555",
            borderRadius: "var(--radius-md)",
            border: "0 solid rgba(0, 0, 0, 0.125)",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            Pobedit ©
        </Box>
    );
};
