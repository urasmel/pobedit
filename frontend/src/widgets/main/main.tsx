import { Users } from "@/features/users";
import { Channels } from "@/features/channels";
import { Box } from "@mui/material";

export const Main = () => {

    return (
        <Box
            sx={{
                padding: 4,
                display: "flex",
                alignItems: "start",
                gap: 2,
                height: "100%",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <Users />

            <Channels />

        </Box>
    );
};
