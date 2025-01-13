import { Account } from "@/entities/account/model/Account";

export interface Comment {
    commentId: number;
    channelId: number;
    author: Account;
    message: string;
    date: Date;
    replyTo: number | null;
}
