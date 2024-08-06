import { Box, Typography } from "@mui/material";

export default function DataGridTitle(title: string) {
    return (
        <Box
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography variant="h5">{title}</Typography>
        </Box>
    );
}
