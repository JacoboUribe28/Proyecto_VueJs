export interface DigitalSignature {
    id?: number;
    photo?: string; // URL of the image stored in the backend
    user_id?: number; // Correct field according to backend response
}