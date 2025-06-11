import { z } from "zod";
import { Address } from "../models/Address";

export class AddressValidator {
    private static schema = z.object({
        id: z.number().optional(),
        street: z.string().min(3, "La calle debe tener al menos 3 caracteres.").optional(),
        number: z.string().min(1, "El número es obligatorio.").optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        user_id: z.number({ required_error: 'El usuario es obligatorio.' }).optional(),
    });

    static validateField<K extends keyof Address>(field: K, value: any) {
        const fieldSchema = this.schema.pick({ [field]: true } as any);
        return fieldSchema.safeParse({ [field]: value });
    }
}
