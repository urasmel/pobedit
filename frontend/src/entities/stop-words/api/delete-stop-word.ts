import { apiClient } from "@/shared/api/base";
import { ServiceResponse } from "@/entities/ServiceResponse";

export const deleteStopWord = async (id: number): Promise<boolean> => {
    try {
        const result = await apiClient.delete<ServiceResponse<boolean>>(`stopwords/${id}`);

        return result.data;
    } catch (error) {
        throw new Error("error.deleteStopWord");
    }
};
