import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getAccount } from "./get-accounts";

export const accountsQueries = {
    all: () => ["accounts"],

    one: (accountId: string | undefined) =>
        queryOptions({
            queryKey: [...accountsQueries.all(), accountId],
            queryFn: () => getAccount(accountId),
            placeholderData: keepPreviousData,
        }),
};
