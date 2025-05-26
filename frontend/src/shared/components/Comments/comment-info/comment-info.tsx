import { Box } from "@mui/material";
import { CommentHeader } from "../comment-header";
import { CommentMessage } from "../comment-message";
import { Comment } from '@/entities/comments/model/comment';


export const CommentInfo = ({ comment, showUsername = true, showChannel = true }: { comment: Comment; showUsername: boolean; showChannel: boolean; }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 5,
                fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
            }}>
            <CommentHeader comment={comment} showUsername={showUsername} showChannel={showChannel} />

            <CommentMessage message={comment.message} />
        </Box>);
};
