import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getComment, getComments, getCommentsCount } from "./get-comments";

export const commentsQueries = {
    all: () => ["comments"],

    lists: () => [...commentsQueries.all(), "list"],

    count: (channelId: string | undefined, postId: string | undefined) =>
        queryOptions({
            queryKey: [...commentsQueries.all(), channelId, postId, 'count'],
            queryFn: () => getCommentsCount(channelId, postId),
            placeholderData: keepPreviousData,
        }),

    list: (channelId: string | undefined, postId: string | undefined, offset: number, limit: number) =>
        queryOptions({
            queryKey: [...commentsQueries.lists(), channelId, postId],
            queryFn: () => getComments(channelId, postId, offset, limit),
            placeholderData: keepPreviousData,
        }),

    details: (channelId: string | undefined, postId: string | undefined, commentId: string | undefined) =>
        queryOptions({
            queryKey: [...commentsQueries.all(), channelId, postId, commentId, "detail"],
            queryFn: () => getComment(channelId, postId, commentId),
            placeholderData: keepPreviousData,
        }),
};
