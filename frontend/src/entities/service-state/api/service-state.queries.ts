import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getServiceState } from "./get-service-state";

export const serviceStateQueries = {
    all: () =>
        queryOptions({
            queryKey: ["service-state"],
            queryFn: () => getServiceState(),
            placeholderData: keepPreviousData,
        }),
};
