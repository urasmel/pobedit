export interface Account {
    id: number;
    userName: string;
    password: string;
    phoneNumber: string;
}

export interface AddAccountDto {
    userName: string;
    password: string;
    phoneNumber: string;
}

export interface LoginAccountDto {
    Username: string;
    Password: string;
    PhoneNumber: string;
}
