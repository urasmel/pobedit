import { Account } from "@/entities/account/model/Account";

export interface CommentDto {
    tlgId: number;
    channelId: number;
    postId: number;
    from: Account;
    message: string;
    date: Date;
    replyTo: number;
}
