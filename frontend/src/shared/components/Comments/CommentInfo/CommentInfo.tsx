import { Box } from "@mui/material";
import { CommentHeader } from "../CommentHeader";
import { CommentMessage } from "../CommentMessage"; import { Comment } from '@/entities/comments/model/Comment';


export const CommentInfo = (props: { comment: Comment; }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 5,
            }}>
            <CommentHeader comment={props.comment} />

            <CommentMessage message={props.comment.message} />
        </Box>);
};
