import { Box } from "@mui/material";
import { Comment } from '@/entities/comments/model/comment';
import { useContext } from "react";
import { ThemeContext } from "@/app/theme";
import { useQuery } from "@tanstack/react-query";
import { channelsApi } from "@/entities/channels";
import { NavLink } from "react-router-dom";

export const CommentHeader = ({ comment, showUsername = true, showChannel = true, showPostLink = false }: { comment: Comment; showUsername: boolean; showChannel: boolean; showPostLink: boolean; }) => {

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
                <>
                    <NavLink to={`/channels/${comment.peerId}/posts`}
                        style={({ isActive }) => {
                            return {
                                color: theme.palette.primary.dark,
                                fontWeight: isActive ? 'bold' : 'normal'
                            };
                        }}
                    >
                        {data?.title}
                    </NavLink>
                    &nbsp;|&nbsp;
                </>
            }


            {
                showPostLink &&
                <>
                    <NavLink to={`/channels/${comment.peerId}/posts/${comment.postTlgId}`}
                        style={({ isActive }) => {
                            return {
                                color: theme.palette.primary.dark,
                                fontWeight: isActive ? 'bold' : 'normal'
                            };
                        }}
                    >
                        пост: {comment.postTlgId}
                    </NavLink>
                    &nbsp;|&nbsp;
                </>
            }


            {showUsername && comment.from.first_name}
            &nbsp;|&nbsp;
            id: {comment.tlgId}
            &nbsp;|&nbsp;
            {new Date(comment.date).toLocaleString("ru-RU")}
        </Box>
    );
};

CommentHeader.displayName = 'CommentHeader';
