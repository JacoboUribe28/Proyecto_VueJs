import { RolePermission } from "@/models/RolePermission";
import {z} from "zod";

export class RolePermissionValidator {
    private static schema = z.object({
        id: z.string().optional(),
        startAt: z.date().optional(),
        endAt: z.date().optional(),
        
    });

    static validate(rolePermission: RolePermission): boolean {
        const result = this.schema.safeParse(rolePermission);
        if (!result.success) {
            console.error("RolePermission validation failed:", result.error);
            return false;
        }
        return true;
    }
}