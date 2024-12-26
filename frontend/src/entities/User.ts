export interface User {
    userId: number;
    username: string;
    password: string;
    phoneNumber: string;
}

export interface AddUserDto {
    username: string;
    password: string;
    phoneNumber: string;
}

export interface LoginUserDto {
    username: string;
    password: string;
    phoneNumber: string;
}
