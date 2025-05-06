import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getPost, getPosts, getPostsCount } from "./get-posts";

export const postsQueries = {
    all: () => ["posts"],

    lists: () => [...postsQueries.all(), "list"],

    count: (channelId: string | undefined) =>
        queryOptions({
            queryKey: [...postsQueries.all(), channelId, 'count'],
            queryFn: () => getPostsCount(channelId),
            placeholderData: keepPreviousData,
        }),

    list: (channelId: string | undefined, offset: number, limit: number) =>
        queryOptions({
            queryKey: [...postsQueries.lists(), channelId, offset, limit],
            queryFn: () => getPosts(channelId, offset, limit),
            placeholderData: keepPreviousData,
        }),

    one: (channelId: number | undefined, postId: number | undefined) =>
        queryOptions({
            queryKey: [...postsQueries.all(), "post", channelId, postId],
            queryFn: () => getPost(channelId, postId),
            placeholderData: keepPreviousData,
        }),

    details: () => [...postsQueries.all(), "detail"],
};
