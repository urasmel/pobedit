import { Account, ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";
import { mapAccount } from "./mapper/map-account";
import { AccountDto } from "./dto/account.dto";


export const getAccount = async (accountId: string | undefined): Promise<{ account: Account | null; }> => {
    if (accountId == undefined) {
        return Promise.resolve({ account: null });
    }

    const result = await apiClient.get<ServiceResponse<AccountDto>>(`api/v1/info/accounts/${accountId}`);

    return ({
        account: mapAccount(result.data)
    });
};
