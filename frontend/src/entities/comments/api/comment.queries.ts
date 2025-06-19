import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getComment, getComments, getPostCommentsCount, getAllAccountComments, getAllAccountCommentsCount } from "./get-comments";
import { commentsKeys } from "./comments.keys";

export const commentsQueries = {
    // all: () => ["comments"],

    // account: () => ["account"],

    // lists: () => [...commentsQueries.all(), "list"],

    count: (channelId: string | undefined, postId: string | undefined) =>
        queryOptions({
            queryKey: [...commentsKeys.count, channelId, postId],
            queryFn: () => getPostCommentsCount(channelId, postId),
            placeholderData: keepPreviousData,
        }),

    list: (channelId: string | undefined, postId: string | undefined, offset: number, limit: number) =>
        queryOptions({
            queryKey: [...commentsKeys.list, channelId, postId, offset, limit],
            queryFn: () => getComments(channelId, postId, offset, limit),
            placeholderData: keepPreviousData,
        }),

    details: (channelId: string | undefined, postId: string | undefined, commentId: string | undefined) =>
        queryOptions({
            queryKey: [...commentsKeys.details, channelId, postId, commentId],
            queryFn: () => getComment(channelId, postId, commentId),
            placeholderData: keepPreviousData,
        }),

    allAccountComments: (accountId: string | undefined, offset: number, limit: number) =>
        queryOptions({
            queryKey: [...commentsKeys.allAccountComments, accountId, offset, limit],
            queryFn: () => getAllAccountComments(accountId, offset, limit),
            placeholderData: keepPreviousData,
        }),

    allAccountCommentsCount: (accountId: string | undefined) =>
        queryOptions({
            queryKey: [...commentsKeys.allAccountCommentsCount, accountId],
            queryFn: () => getAllAccountCommentsCount(accountId),
            placeholderData: keepPreviousData,
        }),
};
