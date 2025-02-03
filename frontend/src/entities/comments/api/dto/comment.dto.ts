export interface CommentDto {
    tlgId: number;
    channelId: number;
    postId: number;
    fromId: number;
    message: string;
    date: Date;
    replyTo: number;
}
