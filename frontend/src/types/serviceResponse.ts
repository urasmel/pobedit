export type ServiceResponse<T> = {
    data: T;
    message: string;
    success: boolean;
};
