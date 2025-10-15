import { GatherStateDto } from "../dto/gatherState.dto";
import { GatherState } from "@/entities/gather-state/model/GatherState";

export const mapGatherState = (dto: GatherStateDto): GatherState => ({
    state: dto.state,
    toPollingChannelsSecs: dto.toPollingChannelsSecs,
    toPollingCommentsSecs: dto.toPollingCommentsSecs
});
