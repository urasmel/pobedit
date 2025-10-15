import { Comment } from '@/entities/comments/model/Comment';
import { CommentAva } from '../comment-avatar';
import { CommentInfo } from '../comment-info';
import { Box } from '@mui/material';

export const CommentWidget = ({ comment, showUsername = true, showChannel = true, showPostLink = false }: { comment: Comment; showUsername: boolean; showChannel: boolean; showPostLink: boolean; }) => {

    return (
        <Box sx={{
            display: "flex",
            columnGap: 2,
        }}>
            <CommentAva comment={comment} />

            <CommentInfo
                comment={comment}
                showUsername={showUsername}
                showChannel={showChannel}
                showPostLink={showPostLink}
            />
        </Box >
    );
};

CommentWidget.displayName = 'CommentWidget';
