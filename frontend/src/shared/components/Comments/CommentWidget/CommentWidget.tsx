import { Comment } from '@/entities/comments/model/Comment';
import { CommentAva } from '../CommentAva';
import { CommentInfo } from '../CommentInfo';
import { Box } from '@mui/material';

export const CommentWidget = (comment: Comment) => {

    return (
        <Box sx={{
            display: "flex",
            columnGap: 2,
            fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
        }}>
            <CommentAva comment={comment} />

            <CommentInfo comment={comment} />
        </Box >
    );
};
