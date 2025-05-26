import { UserDto } from "../dto/user.dto";
import { User } from "@/entities/users/model/user";

export const mapUser = (dto: UserDto): User => ({
    userId: dto.userId,
    username: dto.username,
    password: dto.password,
    phoneNumber: dto.phoneNumber,
});
