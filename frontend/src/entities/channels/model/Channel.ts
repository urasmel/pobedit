export interface Channel {
    id: number;
    tlgId: number;
    mainUsername: string | undefined;
    title: string;
    image: string;
    about: string;
    participantsCount: number;
    ownerId: number;
}
