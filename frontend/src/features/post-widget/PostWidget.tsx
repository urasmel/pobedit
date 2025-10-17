import { Post } from "@/entities";
import { channelsApi } from "@/entities/channels";
import { Card, CardContent, Divider, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import plural from 'plural-ru';
import { NavLink, useNavigate } from "react-router-dom";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useMemo } from "react";

interface PostWidgetProps {
    post: Post;
    showCommentsLink?: boolean;
    showTitle?: boolean;
}

export const PostWidget = ({
    post,
    showCommentsLink = true,
    showTitle = true }: PostWidgetProps) => {

    const navigate = useNavigate();
    const theme = useTheme();

    const {
        data: channelInfo,
        isLoading: isChannelInfoLoading,
        isError: isChannelInfoError
    } = useQuery(
        channelsApi.channelQueries.details(post.peerId.toString())
    );

    // const theme = useContext(ThemeContext);


    // Мемоизированные значения для оптимизации
    const formattedDate = useMemo(
        () => new Date(post.date).toLocaleString(),
        [post.date]
    );

    const commentsText = useMemo(
        () => {
            const count = post.commentsCount || 0;
            return `${count} ${plural(count, 'комментарий', 'комментария', 'комментариев')}`;
        },
        [post.commentsCount]
    );

    // Обработчик клика по комментариям
    const handleCommentsClick = () => {
        navigate(`/channels/${post.peerId}/posts/${post.tlgId}`);
    };

    // Обработчик клика по каналу
    const handleChannelClick = () => {
        navigate(`/channels/${post.peerId}/posts`);
    };

    // Стили для ссылок
    const linkStyle = {
        color: theme.palette.primary.dark,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    };

    const postLinkStyle = {
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
        fontSize: '0.875rem',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    };

    const iconStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
    };

    return (
        <Card
            key={post.tlgId}
            sx={{
                width: "100%",
                p: 1,
                boxSizing: "border-box",
                boxShadow: 1,
                borderRadius: 2
            }}
        >
            <CardContent
                sx={{
                    p: 1,
                    "&:last-child": {
                        pb: 1,
                    },
                }}
            >
                {showTitle && (
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Канал: {" "}
                        <NavLink
                            style={linkStyle}
                            to={`/channels/${post.peerId}/posts`}
                            onClick={handleChannelClick}
                        >
                            <strong>
                                {isChannelInfoLoading
                                    ? "Загрузка..."
                                    : channelInfo?.title || post.peerId
                                }
                            </strong>
                        </NavLink>
                    </Typography>
                )}

                {/* Дата публикации */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {formattedDate}
                </Typography>

                {/* Ссылка на пост */}
                <NavLink
                    style={postLinkStyle}
                    to={`/channels/${post.peerId}/posts/${post.tlgId}`}
                >
                    id: {post.tlgId}
                </NavLink>

                <Typography variant="body2" sx={{
                    mt: 1,
                    lineHeight: 2,
                    textAlign: 'justify',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                }}>
                    {post.message}
                </Typography>

                {
                    showCommentsLink && (
                        <>
                            <Divider sx={{ marginTop: 2 }} />
                            <Typography variant="body1"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: 2,
                                    cursor: "pointer",
                                }}>

                                {commentsText}

                                <ChevronRightIcon
                                    sx={iconStyle}
                                    onClick={() => { navigate(`/channels/${post.peerId}/posts/${post.tlgId}`); }}
                                />
                            </Typography>
                        </>
                    )}

            </CardContent>
        </Card>);
};

PostWidget.displayName = 'PostWidget';
