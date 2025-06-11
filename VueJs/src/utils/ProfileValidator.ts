import { Profile } from "../models/Profile";
import { z } from "zod";

export class ProfileValidator {
    static schema = z.object({
        id: z.number().optional(),
        phone: z.string().optional(),
        photo: z.string().optional(),
    });

    static validate(profile: Profile): boolean {
        const result = this.schema.safeParse(profile);
        if (!result.success) {
            console.error("Profile validation failed:", result.error);
            return false;
        }
        return true;
    }
}

