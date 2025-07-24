import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

export const changeTracking = async (accountId: string | undefined, is_tracking: boolean): Promise<boolean> => {
    if (accountId == undefined) {
        return Promise.resolve(false);
    }

    const result = await apiClient.post<ServiceResponse<boolean>>(`accounts/${accountId}/change_tracking`, { body: { is_tracking: is_tracking } });

    return result.data;
};
