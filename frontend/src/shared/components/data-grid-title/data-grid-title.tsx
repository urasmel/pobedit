import { Box, Typography } from "@mui/material";

export function DataGridTitle(props: { title: string; }) {
    return (
        <Box
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography variant="h5">{props.title}</Typography>
        </Box>
    );
}
