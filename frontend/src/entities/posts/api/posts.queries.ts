import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getPosts } from "./get-posts";

export const postsQueries = {
    all: () => ["posts"],

    lists: () => [...postsQueries.all(), "list"],

    list: (channelId: string | undefined) =>
        queryOptions({
            queryKey: [...postsQueries.lists(), channelId],
            queryFn: () => getPosts(channelId),
            placeholderData: keepPreviousData,
        }),

    details: () => [...postsQueries.all(), "detail"],
};
