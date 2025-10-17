import { Box, List, ListItem, Typography } from "@mui/material";
import { CommentInfo } from '@/shared/components/Comments/comment-info';
import { Comment } from '@/entities/comments/model/Comment';

export interface CommentsListProps {
    comments: Comment[];
    isLoading: boolean;
    isEmpty: boolean;
}

export const CommentsList = ({ comments, isLoading, isEmpty }: CommentsListProps) => {
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Загрузка комментариев...</Typography>
            </Box>
        );
    }

    if (isEmpty) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography color="text.secondary">
                    Комментарии не найдены
                </Typography>
            </Box>
        );
    }

    return (
        <List sx={{ flexGrow: 1 }}>
            {comments.map((comment) => (
                <ListItem key={comment.tlgId} sx={commentItemStyles}>
                    <CommentInfo
                        comment={comment}
                        showUsername={false}
                        showChannel={true}
                        showPostLink={true}
                    />
                </ListItem>
            ))}
        </List>
    );
};

const commentItemStyles = {
    marginBottom: 2,
    padding: 0
};

CommentsList.displayName = 'CommentsList';
