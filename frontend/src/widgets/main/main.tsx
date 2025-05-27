import { Users } from "@/features/users";
import { Channels } from "@/features/channels";
import { Box } from "@mui/material";

export const Main = () => {

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "start",
                justifyContent: "space-between",
                gap: 1,
                height: "100%",
                width: "100%",
                minWidth: "850px",
                boxSizing: "border-box",
            }}
        >
            <Users />

            <Channels />

        </Box>
    );
};
