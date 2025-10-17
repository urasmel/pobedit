import { CreateStopWordDto, StopWordDto } from "../dto";
import { StopWord } from "../../model/StopWord";

export const mapToStopWord = (dto: StopWordDto): StopWord => ({
    id: dto.id,
    word: dto.word,
    createdAt: new Date(dto.createdAt),
});

export const mapToStopWordDto = (dto: StopWord): StopWordDto => ({
    id: dto.id,
    word: dto.word,
    createdAt: new Date(dto.createdAt),
});

export const mapToCreateStopWord = (word: string): CreateStopWordDto => ({
    word: word
});
