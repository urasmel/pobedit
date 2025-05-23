import { Box } from '@mui/material';

export const Footer = () => {
    return (
        <Box sx={{
            marginTop: "1rem",
            fontFamily: "Roboto",
            height: "1rem",
            boxShadow: "var(--shadow)",
            position: "sticky",
            color: "#555",
            borderRadius: ".5rem",
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
