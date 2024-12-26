import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getUsers } from "./get-users";

export const usersQueries = {
    all: () => ["users"],

    lists: () => [...usersQueries.all(), "list"],
    list: (page: number, limit: number) =>
        queryOptions({
            queryKey: [...usersQueries.lists(), page, limit],
            queryFn: () => getUsers(page, limit),
            placeholderData: keepPreviousData,
        }),

    details: () => [...usersQueries.all(), "detail"],
};
