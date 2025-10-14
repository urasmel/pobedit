import { Box, Typography } from "@mui/material";

export const EmptyState = () => (
    <Box sx={emptyStateStyles}>
        <Typography variant="body1" color="text.secondary">
            Комментарии не найдены
        </Typography>
    </Box>
);

EmptyState.displayName = 'EmptyState';

const emptyStateStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: 4,
    width: "100%"
};
