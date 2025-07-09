export interface GatherStateDto {
    state: "stopped" | "running" | "paused";
    toPollingChannelsSecs: number;
    toPollingCommentsSecs: number;
}
