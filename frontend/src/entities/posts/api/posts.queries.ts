import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getPost, getPosts, getPostsCount } from "./get-posts";

export const postsQueries = {
    posts: () => ["posts"],

    count: (channelId: string | undefined) =>
        queryOptions({
            queryKey: [...postsQueries.posts(), channelId, 'count'],
            queryFn: () => getPostsCount(channelId),
            placeholderData: keepPreviousData,
        }),

    list: (channelId: string | undefined, offset: number, limit: number) =>
        queryOptions({
            queryKey: [...postsQueries.posts(), channelId, offset, limit],
            queryFn: () => getPosts(channelId, offset, limit),
            placeholderData: keepPreviousData,
        }),

    one: (channelId: number | undefined, postId: number | undefined) =>
        queryOptions({
            queryKey: [...postsQueries.posts(), "post", channelId, postId],
            queryFn: () => getPost(channelId, postId),
            placeholderData: keepPreviousData,
        }),

    details: () => [...postsQueries.posts(), "detail"],
};
