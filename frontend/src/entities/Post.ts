export interface Post {
    postId: number; // id from DB
    id: number;     // id from TG
    peerId: number;
    date: Date;
    message: string;
    commentsCount: number;
}
