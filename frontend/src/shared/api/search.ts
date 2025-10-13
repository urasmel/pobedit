import { SearchQuery } from '@/entities/search/model/search-query';
import { SearchResult } from '@/entities/search/model/search-result';
import { API_URL } from "@/shared/config";
import axios from 'axios';

export async function search<T>(query: SearchQuery): Promise<SearchResult<T>> {
    try {
        const response = await axios.post<SearchResult<T>>(`${API_URL}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: query,
        });
        return response.data;
    } catch (error) {
        console.error('Search API error:', error);
        throw error;
    }
}
