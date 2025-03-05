import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getChannel, getChannels } from "./get-channels";

export const channelQueries = {
    all: () => ["channels"],

    lists: () => [...channelQueries.all(), "list"],

    // Аргумент user остается для дальнейшего разбиения запросов по микросервисам.
    list: () =>
        queryOptions({
            queryKey: [...channelQueries.lists()],
            queryFn: () => getChannels(),
            placeholderData: keepPreviousData,
        }),

    details: (channelId: string | undefined) =>
        queryOptions({
            queryKey: [...channelQueries.all(), channelId, "detail"],
            queryFn: () => getChannel(channelId),
            placeholderData: keepPreviousData,
        }),
};
