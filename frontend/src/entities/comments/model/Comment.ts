export interface Comment {
    tlgId: number;
    postId: number;
    channelId: number;
    fromId: number;
    message: string;
    date: Date;
    replyTo: number | null;
}
