import { Account, ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";
import { mapAccount } from "./mapper/map-account";
import { AccountDto } from "./dto/account.dto";


export const getAccount = async (accountId: string | undefined): Promise<Account | null> => {
    if (accountId == undefined) {
        return Promise.resolve(null);
    }

    const result = await apiClient.get<ServiceResponse<AccountDto>>(`accounts/${accountId}`);

    return (mapAccount(result.data));
};

export const getAccounts = async (offset: number, limit: number, is_tracking: boolean, login: string): Promise<Account[]> => {

    const result = await apiClient.get<ServiceResponse<AccountDto[]>>(`accounts?offset=${offset}&limit=${limit}&is_tracking=${is_tracking}&login=${login}`);

    return (result.data.map(acc => mapAccount(acc)));
};

export const getAccountsCount = async (is_tracking: boolean, login: string): Promise<number> => {

    const result = await apiClient.get<ServiceResponse<number>>(`accounts/count?is_tracking=${is_tracking}&login=${login}`);

    return (result.data);
};

export const updateAccountInfo = async (accountId: string | undefined): Promise<Account | null> => {
    if (accountId == undefined) {
        return Promise.resolve(null);
    }

    const result = await apiClient.get<ServiceResponse<AccountDto>>(`accounts/${accountId}/update`);

    return (mapAccount(result.data));
};
