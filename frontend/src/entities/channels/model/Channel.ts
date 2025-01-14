export interface Channel {
    id: number;
    userId: number;
    isChannel: boolean | undefined;
    isGroup: boolean | undefined;
    mainUsername: string | undefined;
    about: string;
    participantsCount: number;
    image: string;
    title: string;
}
