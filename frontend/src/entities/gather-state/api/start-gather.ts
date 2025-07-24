import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

export const gatherStart = async (): Promise<boolean> => {
    try {
        const result = await apiClient.get<ServiceResponse<boolean>>(`gather/start`);
        console.log(result);

        console.log(result.data);
        return result.data;
    } catch (error) {

        console.log("mu ex" + error);
        throw new Error("error.fetchGatherState");
    }
};
