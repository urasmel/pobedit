import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getStopWord, getStopWords } from "./get-stop-word";

export const stopWordQueries = {
    all: () => ["stopWords"],

    lists: () =>
        queryOptions({
            queryKey: [...stopWordQueries.all(), "list"],
            queryFn: () => getStopWords(),
            placeholderData: keepPreviousData,
        }),

    one: (id: number) =>
        queryOptions({
            queryKey: [...stopWordQueries.all(), 'one', id],
            queryFn: () => getStopWord(id),
            placeholderData: keepPreviousData,
        }),
};
