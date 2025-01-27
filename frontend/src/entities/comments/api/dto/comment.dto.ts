import { Account } from "@/entities/account/model/Account";

export interface CommentDto {
    tlgId: number;
    channelId: number;
    postId: number;
    author: Account;
    message: string;
    date: Date;
    replyTo: number;
}
