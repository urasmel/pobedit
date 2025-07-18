import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getGatherState } from "./get-gather-state";

export const gatherStateQueries = {
    all: () =>
        queryOptions({
            queryKey: ["gather-state"],
            queryFn: () => getGatherState(),
            placeholderData: keepPreviousData,
        }),

};
