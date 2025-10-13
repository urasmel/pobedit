import { Account } from "@/entities/account/model/account";
import { SentimentAnalysis } from "@/shared/types";

export interface Comment {
    tlgId: number;
    postId: number;
    postTlgId: number;
    peerId: number;
    from: Account;
    message: string;
    date: Date;
    sentiment: SentimentAnalysis;
    replyTo: number | null;
    hasStopWord: boolean;
}
