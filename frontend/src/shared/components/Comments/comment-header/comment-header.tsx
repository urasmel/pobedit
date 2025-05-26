import { Box } from "@mui/material";
import { Comment } from '@/entities/comments/model/comment';
import { useContext } from "react";
import { ThemeContext } from "@/app/theme";
import { useQuery } from "@tanstack/react-query";
import { channelsApi } from "@/entities/channels";
import { NavLink } from "react-router-dom";

export const CommentHeader = ({ comment, showUsername = true, showChannel = true }: { comment: Comment; showUsername: boolean; showChannel: boolean; }) => {

    const theme = useContext(ThemeContext);
    const {
        data,
        isFetching,
        isLoading,
        isError,
        error
    } = useQuery(channelsApi.channelQueries.details(comment.peerId.toString()));

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                width: "100%",
                backgroundColor: theme.palette.primary.light,
                color: "#333",
            }}
        >
            {
                showChannel &&
                <NavLink to={`/channels/${comment.peerId}/posts`}
                    style={({ isActive }) =>
                        isActive
                            ? {
                                color: '#fff',
                                textDecoration: 'none'
                            }
                            : {
                                color: '#fff',
                                textDecoration: 'none'
                            }
                    }
                >
                    {data?.title}&nbsp;
                </NavLink>
            }
            {showUsername && comment.from.username}&nbsp;
            Ид.: {comment.tlgId}, {" "}
            {new Date(comment.date).toLocaleString("ru-RU")}
        </Box>
    );
};
