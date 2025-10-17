export interface PostDto {
    tlgId: number;     // id from TG
    peerId: number;
    date: Date;
    message: string;
    commentsCount: number;
}
