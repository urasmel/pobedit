import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getAccount, getAccounts, getAccountsCount, updateAccountInfo } from "./get-accounts";

export const accountsQueries = {
    all_accounts_key: () => ["accounts"],

    all: (offset: number = 0, limit: number = 20, is_tracking: boolean = false, login: string) =>
        queryOptions({
            queryKey: [...accountsQueries.all_accounts_key(), offset, limit, is_tracking, login],
            queryFn: () => getAccounts(offset, limit, is_tracking, login),
            placeholderData: keepPreviousData,
        }),

    one: (accountId: string | undefined) =>
        queryOptions({
            queryKey: [...accountsQueries.all_accounts_key(), accountId],
            queryFn: () => getAccount(accountId),
            placeholderData: keepPreviousData,
        }),

    count: (is_tracking: boolean = false, login: string = "") =>
        queryOptions({
            queryKey: [...accountsQueries.all_accounts_key(), 'count', is_tracking, login],
            queryFn: () => getAccountsCount(is_tracking, login),
            placeholderData: keepPreviousData,
        }),

    update: (accountId: string | undefined) =>
        queryOptions({
            queryKey: [...accountsQueries.all_accounts_key(), accountId, "update"],
            queryFn: () => updateAccountInfo(accountId),
            placeholderData: keepPreviousData,
        }),
};
