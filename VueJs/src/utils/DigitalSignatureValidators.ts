import { z } from "zod";

export class DigitalSignatureValidator {
    private static schema = z.object({
        photo: z.string().url("La URL de la foto no es válida.").optional(),
        id_user: z.number().int().positive("El ID del usuario debe ser válido.").optional(),
    });

    static validateField<K extends keyof z.infer<typeof this.schema>>(field: K, value: any) {
        const fieldSchema = this.schema.pick({ [field]: true } as any);
        return fieldSchema.safeParse({ [field]: value });
    }
}
