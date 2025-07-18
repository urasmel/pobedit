import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

export const gatherStart = async (): Promise<boolean> => {
    try {
        const result = await apiClient.get<ServiceResponse<boolean>>(`gather/start`);

        return result.data;
    } catch (error) {
        throw new Error("error.fetchGatherState");
    }
};
