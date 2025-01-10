import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getPosts } from "./get-posts";

export const postsQueries = {
    all: () => ["posts"],

    lists: () => [...postsQueries.all(), "list"],

    list: (user: string | undefined, channelId: string | undefined) =>
        queryOptions({
            queryKey: [...postsQueries.lists(), user, channelId],
            queryFn: () => getPosts(user, channelId),
            placeholderData: keepPreviousData,
        }),

    details: () => [...postsQueries.all(), "detail"],
};
