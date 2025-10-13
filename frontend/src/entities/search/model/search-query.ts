export enum SearchType { posts = 'posts', comments = 'comments' };

export interface SearchQuery {
    query: string;
    searchType: SearchType;
    startDate: Date | null;
    endDate: Date | null;
    limit: number;
    offset: number;
    // sortBy: 'relevance' | 'date';
    // sortOrder: 'asc' | 'desc';
}
