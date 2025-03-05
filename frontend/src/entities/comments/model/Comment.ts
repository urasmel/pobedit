import { Account } from "@/entities/account/model/Account";

export interface Comment {
    tlgId: number;
    postId: number;
    channelId: number;
    from: Account;
    message: string;
    date: Date;
    replyTo: number | null;
}
