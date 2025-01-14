export interface Post {
    id: number;
    postId: number;     // id from TG
    peerId: number;
    date: Date;
    message: string;
    commentsCount: number;
}
