import { ChannelMainInfo } from "@/shared/components/channel-main-info";
import { PostsUpdatingWidget } from "@/shared/components/posts-updating-widget";
import { ScrollToTopButton } from "@/shared/components/scroll-top-button";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { PostsPanel } from "@/features/posts-panel";

export const PostsPage = () => {

    const { channelId } = useParams();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 2,
                height: "100%",
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "start",
                    gap: 2,
                }}
            >
                <ChannelMainInfo channelId={channelId === undefined ? "0" : channelId} />

                <PostsUpdatingWidget
                    channelId={channelId ? channelId : undefined}
                />
            </Box>

            <PostsPanel channelId={channelId ? channelId : ""} />

            <ScrollToTopButton />

        </Box>
    );
};
