import { Post } from "@/entities";
import { channelsApi } from "@/entities/channels";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import plural from 'plural-ru';
import { NavLink, useNavigate } from "react-router-dom";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useContext } from "react";
import { ThemeContext } from "@/app/theme";


export const PostWidget = ({ post, showPostLink = true, showTitle = true }: { post: Post; showPostLink: boolean; showTitle: boolean; }) => {

    const navigate = useNavigate();
    const { data: channelInfo,
        isError: channelInfoIsError,
        error: channelInfoError,
        isFetched: infoIsFetched }
        = useQuery(channelsApi.channelQueries.details(post.peerId.toString()));

    const theme = useContext(ThemeContext);

    return (
        <Card
            key={post.tlgId}
            sx={{
                width: "100%",
                padding: 1,
                boxSizing: "border-box"
            }}
        >
            <CardContent
                sx={{
                    padding: 1,
                    color: "rgb(52, 71, 103);",
                    "&:last-child": {
                        paddingBottom: 1,
                    },
                }}
            >
                {
                    showTitle &&
                    <Typography variant="body1">
                        Канал:&nbsp;
                        <NavLink
                            style={({ isActive }) =>
                                isActive
                                    ? {
                                        color: theme.palette.primary.dark,
                                        textDecoration: 'none'
                                    }
                                    : {
                                        color: '#fff',
                                        textDecoration: 'none'
                                    }
                            }
                            to={`/channels/${post.peerId}/posts`}>
                            <strong>{channelInfo?.title || post.peerId}</strong>
                        </NavLink>
                    </Typography>
                }

                <Typography variant="body2" color="text.secondary">
                    {new Date(post.date).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    id: {post.tlgId}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1, lineHeight: 2 }}>
                    {post.message}
                </Typography>

                {
                    showPostLink &&
                    <>
                        <Divider sx={{ marginTop: 2, width: "100%" }} />
                        <Typography variant="body1"
                            sx={{
                                display: "flex",
                                justifyContent: "start",
                                alignItems: "center",
                                marginTop: 1
                            }}>
                            {
                                (post.commentsCount ? post.commentsCount : 0) +
                                plural((post.commentsCount ? post.commentsCount : 0),
                                    ' комментарий', ' комментария', ' комментариев')
                            }

                            <ChevronRightIcon
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                                onClick={() => { navigate(`/channels/${post.peerId}/posts/${post.tlgId}`); }}
                            />
                        </Typography>
                    </>
                }
            </CardContent>
        </Card>);
};
