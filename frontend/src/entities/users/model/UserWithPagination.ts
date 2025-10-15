import { User } from "./User";

export interface UserWithPagination {
    users: User[];
    total: number;
    totalPages: number;
    skip: number;
    limit: number;
}
