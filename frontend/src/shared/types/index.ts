// types/index.ts
export interface StopWord {
    id: string;
    word: string;
    createdAt: Date;
}

export interface SentimentAnalysis {
    score: number;
    magnitude: number;
    label: 'positive' | 'negative' | 'neutral';
}

export interface UserSentiment {
    userId: string;
    averageSentiment: number;
    commentCount: number;
}

export interface ChartDataPoint {
    date: string;
    postSentiment: number;
    commentSentiment: number;
    postCount: number;
    commentCount: number;
}

export type SortOrder = 'asc' | 'desc';

export type DateRange = 'all' | 'today' | 'week' | 'month' | 'custom';
