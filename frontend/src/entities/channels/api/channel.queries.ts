import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getChannel, getChannels } from "./get-channels";

export const channelQueries = {
    all: () => ["channels"],

    lists: () => [...channelQueries.all(), "list"],

    list: (user: string | undefined) =>
        queryOptions({
            queryKey: [...channelQueries.lists(), user],
            queryFn: () => getChannels(user),
            placeholderData: keepPreviousData,
        }),

    details: (user: string | undefined, channelId: string | undefined) =>
        queryOptions({
            queryKey: [...channelQueries.all(), user, channelId, "detail"],
            queryFn: () => getChannel(user, channelId),
            placeholderData: keepPreviousData,
        }),
};
