export interface Post {
    postId: number;
    peerId: number;
    date: Date;
    message: string;
    comments: Comment[];
}
