import { Comment } from '@/entities/comments/model/Comment';
import { CommentAva } from '../CommentAva';
import { CommentInfo } from '../CommentInfo';
import { Box } from '@mui/material';

export const CommentWidget = ({ comment, showUsername = true, showChannel = true }: { comment: Comment; showUsername: boolean; showChannel: boolean; }) => {

    return (
        <Box sx={{
            display: "flex",
            columnGap: 2,
        }}>
            <CommentAva comment={comment} />

            <CommentInfo comment={comment} showUsername={showUsername} showChannel={showChannel} />
        </Box >
    );
};
