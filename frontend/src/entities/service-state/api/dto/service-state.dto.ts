export interface ServiceStateDto {
    state: "stopped" | "running";
    toPollingChannels: number;
    toPollingComments: number;
}
