import { Account } from "@/entities/account/model/account";

export interface CommentDto {
    tlgId: number;
    peerId: number;
    postId: number;
    postTlgId: number;
    from: Account;
    message: string;
    date: Date;
    replyTo: number;
}
