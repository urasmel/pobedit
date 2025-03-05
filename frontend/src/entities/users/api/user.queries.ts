import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getUsers } from "./get-users";

export const userQueries = {
    all: () => ["users"],

    lists: () => [...userQueries.all(), "list"],

    list: () =>
        queryOptions({
            queryKey: [...userQueries.lists()],
            queryFn: () => getUsers(),
            placeholderData: keepPreviousData,
        }),

    details: () => [...userQueries.all(), "detail"],
};
