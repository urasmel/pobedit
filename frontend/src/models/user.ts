export interface User {
    id: number;
    userName: string;
    password: string;
    phoneNumber: string;
}

export interface AddUserDto {
    userName: string;
    password: string;
    phoneNumber: string;
}

export interface LoginUserDto {
    Username: string;
    Password: string;
    PhoneNumber: string;
}
