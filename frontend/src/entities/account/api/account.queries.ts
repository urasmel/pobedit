import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getAccount, updateAccountInfo } from "./get-accounts";

export const accountsQueries = {
    all: () => ["accounts"],

    one: (accountId: string | undefined) =>
        queryOptions({
            queryKey: [...accountsQueries.all(), accountId],
            queryFn: () => getAccount(accountId),
            placeholderData: keepPreviousData,
        }),

    update: (accountId: string | undefined) =>
        queryOptions({
            queryKey: [...accountsQueries.all(), accountId, "update"],
            queryFn: () => updateAccountInfo(accountId),
            placeholderData: keepPreviousData,
        }),
};
