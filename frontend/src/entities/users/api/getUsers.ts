import { ServiceResponse, User } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapUser } from "./mapper/mapUser";
import { UserDto } from "./dto/User.dto";

export const getUsers = async (): Promise<{ users: User[]; }> => {
    try {
        const result = await apiClient.get<ServiceResponse<UserDto[]>>('users');

        return ({
            users: result.data.map((user: UserDto) => mapUser(user))
        });
    } catch (error) {
        throw new Error("error.fetchUsers");
    }
};
