import { Account } from "./Account";

export interface Comment {
    commentId: number;
    channelId: number;
    author: Account;
    message: string;
    date: Date;
    replyTo: number;
}
