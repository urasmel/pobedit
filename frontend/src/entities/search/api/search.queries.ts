import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { postSearch } from "./post-search";
import { SearchQuery } from "../model/SearchQuery";

export const searchQueries = {
    all: () => ["search"],

    search: (query: SearchQuery) =>
        queryOptions({
            queryKey: [...searchQueries.all(), query],
            queryFn: () => postSearch(query),
            placeholderData: keepPreviousData,
        }),
};
