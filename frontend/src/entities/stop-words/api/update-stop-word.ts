import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { StopWord } from "../model/StopWord";
import { StopWordDto } from "./dto";
import { mapToStopWord, mapToStopWordDto } from "./mapper/mapStopWord";

export const updateStopWord = async (stopWord: StopWord): Promise<StopWord> => {
    try {
        const stopWordDto = mapToStopWordDto(stopWord);
        const result = await apiClient.put<ServiceResponse<StopWordDto>>(`stopwords`, { body: stopWordDto });

        return mapToStopWord(result.data);
    } catch (error) {
        throw new Error("error.updateStopWord");
    }
};
