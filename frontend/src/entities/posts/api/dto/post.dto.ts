export interface PostDto {
    id: number;     // id from TG
    peerId: number;
    date: Date;
    message: string;
    commentsCount: number;
}
