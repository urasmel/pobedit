import { Box } from "@mui/material";
import { CommentHeader } from "../comment-header";
import { CommentContent } from "../comment-content";
import { Comment } from '@/entities/comments/model/Comment';


export const CommentInfo = (
    { comment, showUsername = true, showChannel = true, showPostLink = false }: { comment: Comment; showUsername: boolean; showChannel: boolean; showPostLink: boolean; }) => {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                boxShadow: 5,
                fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
            }}>
            <CommentHeader
                comment={comment}
                showUsername={showUsername}
                showChannel={showChannel}
                showPostLink={showPostLink}
            />

            <CommentContent message={comment.message} />
        </Box>);
};

CommentInfo.displayName = 'CommentInfo';
