export interface AccountCredentials {
    email: string;
    password: string;
}

export interface User {
    user_id: number;
    user_full_name: string;
    user_email: string;
    user_code: string;
}

export interface RegisterUser {
    full_name: string;
    email: string;
    password: string;
}