export interface GatherState {
    state: "stopped" | "running" | "paused";
    toPollingChannelsSecs: number;
    toPollingCommentsSecs: number;
}
