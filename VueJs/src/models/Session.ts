export interface Session {
    id?: string;
    token?: string;
    expiration?: Date;
    FACode?: string;
    state?: string;
    user_id?: number
}
