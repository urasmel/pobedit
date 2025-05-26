import { Box, Typography, Button } from "@mui/material";

export const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void; }) => {
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
                {error.message}
            </Typography>
            <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
                Попробуйте повторить
            </Button>
        </Box>
    );
};
