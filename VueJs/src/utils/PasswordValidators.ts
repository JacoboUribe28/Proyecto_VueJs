import { z } from "zod";
import { Password } from "../models/Password";

export class PasswordValidator {
    private static schema = z.object({
        id: z.number().optional(),
        cont: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.").optional(),
        startAt: z.string().optional(),
        endAt: z.string().optional(),
        user_id: z.number({ required_error: 'El usuario es obligatorio.' }).optional(),
    });

    static validateField<K extends keyof Password>(field: K, value: any) {
        const fieldSchema = this.schema.pick({ [field]: true } as any);
        return fieldSchema.safeParse({ [field]: value });
    }
}
