import { channelApi } from "@/entities/channels";
import { PostDto } from "@/entities/posts/api/dto/post.dto";
import { Card, CardContent, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export const PostSearchWidget = (props: { index: number, post: PostDto; }) => {

    const { data: channelInfo,
        isError: channelInfoIsError,
        error: channelInfoError,
        isFetched: infoIsFetched }
        = useQuery(channelApi.channelQueries.details(props.post.peerId.toString()));

    return (<Card key={props.index} sx={{ width: "100%" }}>
        <CardContent>
            <Typography variant="body1">
                <strong>Канал:</strong> {channelInfo?.title || props.post.peerId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {new Date(props.post.date).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: 1 }}>
                {props.post.message}
            </Typography>
        </CardContent>
    </Card>);
};
