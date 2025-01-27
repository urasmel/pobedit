import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getPosts, getPostsCount } from "./get-posts";

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

    details: () => [...postsQueries.all(), "detail"],
};
