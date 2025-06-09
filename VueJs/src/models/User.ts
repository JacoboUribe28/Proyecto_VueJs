export interface User {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    age?: number | null;
    city?: string;
    phone?: string;
    is_active?: boolean;
    token?: string;
}