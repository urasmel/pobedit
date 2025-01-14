export interface ChannelDto {
    id: number;
    userId: number;
    isChannel: boolean;
    isGroup: boolean;
    mainUsername: string;
    about: string;
    participantsCount: number;
    image: string;
    title: string;
}
