import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { StopWord } from "../model/StopWord";
import { StopWordDto } from "./dto";
import { mapToCreateStopWord as mapToCreateStopWordDto, mapToStopWord } from "./mapper/mapStopWord";

export const createStopWord = async (stopWord: string): Promise<StopWord> => {
    try {
        const createStopWordDto = mapToCreateStopWordDto(stopWord);
        const result = await apiClient.post<ServiceResponse<StopWordDto>>(`stopwords`, { body: createStopWordDto });

        return mapToStopWord(result.data);
    } catch (error) {
        throw new Error("error.createStopWord");
    }
};
