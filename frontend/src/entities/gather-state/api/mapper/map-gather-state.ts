import { GatherStateDto } from "../dto/gather-state.dto";
import { GatherState } from "@/entities/gather-state/model/gather-state";

export const mapGatherState = (dto: GatherStateDto): GatherState => ({
    state: dto.state,
    toPollingChannels: dto.toPollingChannels,
    toPollingComments: dto.toPollingComments
});
