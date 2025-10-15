import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getUsers } from "./getUsers";

export const userQueries = {
    users: () => ["users"],

    list: () =>
        queryOptions({
            queryKey: [...userQueries.users()],
            queryFn: () => getUsers(),
            placeholderData: keepPreviousData,
        }),

    details: () => [...userQueries.users(), "detail"],
};
