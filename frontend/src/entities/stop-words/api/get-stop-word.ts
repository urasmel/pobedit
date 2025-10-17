import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { StopWord } from "../model/StopWord";
import { StopWordDto } from "./dto";
import { mapToStopWord } from "./mapper/mapStopWord";

export const getStopWords = async (): Promise<StopWord[]> => {
    try {
        const result = await apiClient.get<ServiceResponse<StopWordDto[]>>('stopwords');

        return result.data.map((stopWordDto: StopWordDto) => mapToStopWord(stopWordDto));
    } catch (error) {
        throw new Error("error.fetchStopWords");
    }
};

export const getStopWord = async (id: number): Promise<StopWord> => {
    try {
        const result = await apiClient.get<ServiceResponse<StopWordDto>>(`stopwords/${id}`);

        return mapToStopWord(result.data);
    } catch (error) {
        throw new Error("error.fetchStopWord");
    }
};
