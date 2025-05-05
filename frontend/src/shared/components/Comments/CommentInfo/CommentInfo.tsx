import { Box } from "@mui/material";
import { CommentHeader } from "../CommentHeader";
import { CommentMessage } from "../CommentMessage"; import { Comment } from '@/entities/comments/model/Comment';


export const CommentInfo = ({ comment, showUsername = true }: { comment: Comment; showUsername: boolean; }) => {
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
            <CommentHeader comment={comment} showUsername={showUsername} />

            <CommentMessage message={comment.message} />
        </Box>);
};
