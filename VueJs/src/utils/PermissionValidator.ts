import { Permission } from "@/models/Permission";
import{z} from "zod";

export class PermissionValidator {
    private static schema = z.object({
        id: z.number().optional(),
        nurl: z.string().optional(),
        method: z.string().optional(),
    });

    static validate(permission: Permission): boolean {
        const result = this.schema.safeParse(permission);
        if (!result.success) {
            console.error("Permission validation failed:", result.error);
            return false;
        }
        return true;
    }
}