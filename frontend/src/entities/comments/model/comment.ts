import { Account } from "@/entities/account/model/account";

export interface Comment {
    tlgId: number;
    postId: number;
    postTlgId: number;
    peerId: number;
    from: Account;
    message: string;
    date: Date;
    replyTo: number | null;
}
