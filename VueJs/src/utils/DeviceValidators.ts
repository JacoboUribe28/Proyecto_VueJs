import { z } from "zod";

export class DeviceValidator {
    private static schema = z.object({
        name: z.string().min(1, "El nombre del dispositivo es requerido.").optional(),
        ip: z.string().ip("La dirección IP no es válida.").optional(),
        operating_system: z.string().min(1, "El sistema operativo es requerido.").optional(),
        user_id: z.number().int().positive("El ID de usuario debe ser válido.").optional(),
    });

    static validateField<K extends keyof z.infer<typeof this.schema>>(field: K, value: any) {
        const fieldSchema = this.schema.pick({ [field]: true } as any);
        return fieldSchema.safeParse({ [field]: value });
    }
}
