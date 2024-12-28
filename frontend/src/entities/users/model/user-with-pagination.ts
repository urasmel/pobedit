import { User } from "./user";

export interface UserWithPagination {
    users: User[];
    total: number;
    totalPages: number;
    skip: number;
    limit: number;
}
