import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getGatherState } from "./getGatherState";

export const gatherStateQueries = {

    gather_state_key: () => ["gather_state"],

    // gather_state: () =>
    //     queryOptions({
    //         queryKey: [gather_state_key],
    //         queryFn: () => getGatherState(),
    //         placeholderData: keepPreviousData,
    //     }),

    gather_state: function () {
        return queryOptions({
            queryKey: [...this.gather_state_key()],
            queryFn: () => getGatherState(),
            placeholderData: keepPreviousData,
        });
    }
};
