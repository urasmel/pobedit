import { UserDto } from './user.dto';

export interface UserWithPaginationDto {
    posts: UserDto[];
    total: number;
    skip: number;
    limit: number;
};
