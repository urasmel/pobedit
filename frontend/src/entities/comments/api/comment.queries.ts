import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getComment, getComments } from "./get-comments";

export const commentQueries = {
    all: () => ["comments"],

    lists: () => [...commentQueries.all(), "list"],

    list: (user: string | undefined, channelId: string | undefined, postId: string | undefined) =>
        queryOptions({
            queryKey: [...commentQueries.lists(), user, channelId, postId],
            queryFn: () => getComments(user, channelId, postId),
            placeholderData: keepPreviousData,
        }),

    details: (user: string | undefined, channelId: string | undefined, postId: string | undefined, commentId: string | undefined) =>
        queryOptions({
            queryKey: [...commentQueries.all(), user, channelId, postId, commentId, "detail"],
            queryFn: () => getComment(user, channelId, postId, commentId),
            placeholderData: keepPreviousData,
        }),
};
