import { StopWordsManager } from "@/features/stop-words";
import { GatherStateWidget } from "@/widgets/gather-widget";
import { Box } from "@mui/material";

const boxStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: 2,
    height: "100%",
    boxSizing: "border-box",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "16px"
};

export const ControlPage = () => {

    return (
        <Box sx={boxStyles}>
            {/* <StopWordNotifications posts={posts} comments={comments} /> */}
            <GatherStateWidget />

            <StopWordsManager />
        </Box>
    );
};

ControlPage.displayName = 'ControlPage';
