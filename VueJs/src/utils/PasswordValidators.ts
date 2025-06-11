import { Password } from "@/models/Password";
import { z } from "zod";

export class PasswordValidator {
    private static schema = z.object({
        id: z.number().optional(),
        hash: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.").optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
    });

    static validateField<K extends keyof Password>(field: K, value: any) {
        const fieldSchema = this.schema.pick({ [field]: true } as any);
        return fieldSchema.safeParse({ [field]: value });
    }
}
