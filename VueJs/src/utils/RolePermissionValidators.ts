import { z } from "zod";

export class RolePermissionValidator {
    private static schema = z.object({
        role_id: z.number().int().positive("El ID del rol debe ser válido.").optional(),
        permission_id: z.number().int().positive("El ID del permiso debe ser válido.").optional(),
    });

    static validateField<K extends keyof z.infer<typeof this.schema>>(field: K, value: any) {
        const fieldSchema = this.schema.pick({ [field]: true } as any);
        return fieldSchema.safeParse({ [field]: value });
    }
}