import { Permission } from "../models/Permission";
import{z} from "zod";

export class PermissionValidator {
    private static schema = z.object({
        id: z.number().optional(),
        url: z.string().min(1, "La URL es requerida"),
        method: z.string().min(1, "El método es requerido"),
    });

    static validate(permission: Permission): boolean {
        const result = this.schema.safeParse(permission);
        if (!result.success) {
            console.error("Permission validation failed:", result.error);
            return false;
        }
        return true;
    }

    static validateField(field: keyof Permission, value: any) {
        const fieldSchema = {
            url: this.schema.shape.url,
            method: this.schema.shape.method,
        };

        const schema = fieldSchema[field as keyof typeof fieldSchema];
        if (!schema) return { success: true };

        return schema.safeParse(value);
    }
}