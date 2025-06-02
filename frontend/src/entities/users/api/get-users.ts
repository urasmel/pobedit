import { ServiceResponse, User } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapUser } from "./mapper/map-user";
import { UserDto } from "./dto/user.dto";

export const getUsers = async (): Promise<{ users: User[]; }> => {
    try {
        const result = await apiClient.get<ServiceResponse<UserDto[]>>('users');

        return ({
            users: result.data.map((user: UserDto) => mapUser(user))
        });
    } catch (error) {
        throw new Error("fetchUsersError");
    }
};
