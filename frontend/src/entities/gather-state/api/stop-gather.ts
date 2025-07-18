import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

export const gatherStop = async (): Promise<boolean> => {
    try {
        const result = await apiClient.get<ServiceResponse<boolean>>(`gather/stop`);

        return (result.data);
    } catch (error) {
        throw new Error("error.fetchGatherState");
    }
};
