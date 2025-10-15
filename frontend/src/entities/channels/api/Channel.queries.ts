import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getChannel, getChannels } from "./getChannels";

export const channelQueries = {
    channels: () => ["channels"],

    // Аргумент user остается для дальнейшего разбиения запросов по микросервисам.
    list: () =>
        queryOptions({
            queryKey: [...channelQueries.channels(), "list"],
            queryFn: () => getChannels(),
            placeholderData: keepPreviousData,
        }),

    details: (channelId: string | undefined) =>
        queryOptions({
            queryKey: [...channelQueries.channels(), channelId, "detail"],
            queryFn: () => getChannel(channelId),
            placeholderData: keepPreviousData,
        }),
};
