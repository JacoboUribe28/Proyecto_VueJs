import { z } from "zod";
import { Role } from "../models/Role";

export class RoleValidator {
    private static schema = z.object({
        id: z.number().int().positive("El ID debe ser un número positivo.").optional(),
        name: z.string().min(3, "El nombre del rol debe tener al menos 3 caracteres."),
        description: z.string().min(5, "La descripción debe tener al menos 5 caracteres.").optional(),
    });

    static validateField<K extends keyof Role>(field: K, value: any) {
        const fieldSchema = this.schema.pick({ [field]: true } as any);
        return fieldSchema.safeParse({ [field]: value });
    }
}
