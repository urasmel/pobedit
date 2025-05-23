import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getComment, getComments, getPostCommentsCount, getAllAccountComments, getAllAccountCommentsCount } from "./get-comments";

export const commentsQueries = {
    all: () => ["comments"],

    account: () => ["account"],

    lists: () => [...commentsQueries.all(), "list"],

    count: (channelId: string | undefined, postId: string | undefined) =>
        queryOptions({
            queryKey: [...commentsQueries.all(), channelId, postId, 'count'],
            queryFn: () => getPostCommentsCount(channelId, postId),
            placeholderData: keepPreviousData,
        }),

    list: (channelId: string | undefined, postId: string | undefined, offset: number, limit: number) =>
        queryOptions({
            queryKey: [...commentsQueries.lists(), channelId, postId, offset, limit],
            queryFn: () => getComments(channelId, postId, offset, limit),
            placeholderData: keepPreviousData,
        }),

    details: (channelId: string | undefined, postId: string | undefined, commentId: string | undefined) =>
        queryOptions({
            queryKey: [...commentsQueries.all(), channelId, postId, commentId, "detail"],
            queryFn: () => getComment(channelId, postId, commentId),
            placeholderData: keepPreviousData,
        }),

    allAccountComments: (accountId: string | undefined, offset: number, limit: number) =>
        queryOptions({
            queryKey: [...commentsQueries.all(), ...commentsQueries.account(), accountId, offset, limit],
            queryFn: () => getAllAccountComments(accountId, offset, limit),
            placeholderData: keepPreviousData,
        }),

    allAccountCommentsCount: (accountId: string | undefined) =>
        queryOptions({
            queryKey: [...commentsQueries.account(), accountId, "count"],
            queryFn: () => getAllAccountCommentsCount(accountId),
            placeholderData: keepPreviousData,
        }),
};
