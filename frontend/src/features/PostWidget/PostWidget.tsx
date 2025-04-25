import { Post } from "@/entities";
import { channelApi } from "@/entities/channels";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import plural from 'plural-ru';
import { NavLink } from "react-router-dom";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


export const PostWidget = ({ post }: { post: Post; }) => {

    const { data: channelInfo,
        isError: channelInfoIsError,
        error: channelInfoError,
        isFetched: infoIsFetched }
        = useQuery(channelApi.channelQueries.details(post.peerId.toString()));

    return (
        <Card key={post.tlgId} sx={{ width: "100%", padding: 1, boxSizing: "border-box" }}>
            <CardContent
                sx={{
                    padding: 1,
                    color: "rgb(52, 71, 103);",
                    "&:last-child": {
                        paddingBottom: 1, // Adjust the padding bottom for the last child
                    },
                }}
            >
                <Typography variant="body1">
                    <strong>Канал:</strong> {channelInfo?.title || post.peerId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {new Date(post.date).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Id: {post.tlgId}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1, lineHeight: 2 }}>
                    {post.message}
                </Typography>
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

                    <NavLink
                        style={{ textDecoration: "none" }}
                        to={`/channels/${post.peerId}/posts/${post.tlgId}/comments`}
                    >
                        {post.commentsCount > 0 && <ChevronRightIcon
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }} />}
                    </NavLink>
                </Typography>
            </CardContent>
        </Card>);
};
