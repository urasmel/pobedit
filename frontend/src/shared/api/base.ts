import { API_URL } from "@/shared/config";

export class ApiClient {

    private baseUrl: string;

    constructor(url: string) {
        this.baseUrl = url;
    }

    async handleResponse<TResult>(response: Response): Promise<TResult> {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        try {
            const result = await response.json() as Promise<TResult>;
            return result;
        } catch (error) {
            throw new Error('Error parsing JSON response');
        }
    }

    public async get<TResult = unknown>(endpoint: string, queryParams?: Record<string, string | number>): Promise<TResult> {
        const url = new URL(endpoint, this.baseUrl);

        if (queryParams) {
            Object.entries(queryParams).forEach(([key, value]) => {
                url.searchParams.append(key, value.toString());
            });
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return this.handleResponse<TResult>(response);
    }

    public async post<
        TResult = unknown,
        TData extends { body: unknown; } = { body: unknown; }
    >
        (endpoint: string, data: TData): Promise<TResult> {

        const url = new URL(endpoint, this.baseUrl); // Ensure the URL is constructed properly

        try {
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data['body']),
            });

            return this.handleResponse<TResult>(response);
        } catch (error) {
            throw new Error(`Failed to post: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async put<
        TResult = unknown,
        TData extends { body: unknown; } = { body: unknown; }
    >
        (endpoint: string, data: TData): Promise<TResult> {

        const url = new URL(endpoint, this.baseUrl); // Ensure the URL is constructed properly

        try {
            const response = await fetch(url.toString(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data['body']),
            });

            return this.handleResponse<TResult>(response);
        } catch (error) {
            throw new Error(`Failed to put: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async delete<TResult = unknown>(endpoint: string, queryParams?: Record<string, string | number>): Promise<TResult> {
        const url = new URL(endpoint, this.baseUrl);

        if (queryParams) {
            Object.entries(queryParams).forEach(([key, value]) => {
                url.searchParams.append(key, value.toString());
            });
        }

        const response = await fetch(url.toString(), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return this.handleResponse<TResult>(response);
    }
}

export const apiClient = new ApiClient(API_URL);
