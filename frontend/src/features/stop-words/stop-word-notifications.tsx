import React from 'react';
import {
    Alert,
    AlertTitle,
    Box,
    Chip,
    List,
    ListItem,
    ListItemText,
    Typography,
    IconButton,
    Collapse,
} from '@mui/material';
import {
    Warning as WarningIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Post } from '@/entities';
import { PostComment } from '@/entities';
// import { Post, Comment } from '../types';

interface StopWordNotificationsProps {
    posts: Post[];
    comments: PostComment[];
}

export const StopWordNotifications: React.FC<StopWordNotificationsProps> = ({
    posts,
    comments,
}) => {
    const [expanded, setExpanded] = React.useState(true);

    const postsWithStopWords = posts.filter(post => post.hasStopWord);
    const commentsWithStopWords = comments.filter(comment => comment.hasStopWord);

    const hasStopWords = postsWithStopWords.length > 0 || commentsWithStopWords.length > 0;

    if (!hasStopWords) {
        return null;
    }

    return (
        <Alert
            severity="warning"
            sx={{ mb: 2 }}
            action={
                <IconButton
                    aria-label="expand"
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            }
        >
            <AlertTitle>
                Обнаружены стоп-слова
                <Chip
                    label={`${postsWithStopWords.length + commentsWithStopWords.length}`}
                    size="small"
                    color="warning"
                    sx={{ ml: 1 }}
                />
            </AlertTitle>

            <Collapse in={expanded}>
                <Box sx={{ mt: 1 }}>
                    {postsWithStopWords.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Посты со стоп-словами:
                            </Typography>
                            <List dense>
                                {postsWithStopWords.map(post => (
                                    <ListItem key={post.tlgId}>
                                        <ListItemText
                                            primary={post.date.toDateString()}
                                            // secondary={`Автор: ${post.author}`}
                                            secondary={`Автор: ${post.tlgId}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    {commentsWithStopWords.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Комментарии со стоп-словами:
                            </Typography>
                            <List dense>
                                {commentsWithStopWords.map(comment => (
                                    <ListItem key={comment.tlgId}>
                                        <ListItemText
                                            primary={comment.message.substring(0, 100) + '...'}
                                            secondary={`Автор: ${comment.from.main_username}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </Alert>
    );
};

StopWordNotifications.displayName = 'StopWordNotifications';
