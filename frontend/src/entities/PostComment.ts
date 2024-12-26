import { Account } from "./Account";

export interface PostComment {
    commentId: number;
    channelId: number;
    author: Account;
    message: string;
    date: Date;
    replyTo: number;
}
