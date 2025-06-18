import { getLocalizedString } from "@/shared/locales";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void; }) => {
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: 2,
                textAlign: "center",
            }}
        >
            <Typography variant="h5" color="error" gutterBottom>
                Что-то пошло не так
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                {getLocalizedString(error, t)}
            </Typography>
            <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
                Попробуйте повторить
            </Button>
        </Box>
    );
};
