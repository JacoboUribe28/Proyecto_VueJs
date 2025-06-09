import { Session } from "@/models/Session";
import {z} from "zod";

export class SessionValidator {
    private static schema = z.object({
        id: z.string().optional(),
        token: z.string().optional(),
        expiration: z.date().optional(),
        FACode: z.string().optional(),
        state: z.string().min(1, "El estado es obligatorio."),
    });

    static validate(session: Session): boolean {
        const result = this.schema.safeParse(session);
        if (!result.success) {
            console.error("Session validation failed:", result.error);
            return false;
        }
        return true;
    }
}   