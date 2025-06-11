import { UserRole } from "@/models/UsrRole";
import { z } from "zod";

export class UserRoleValidator {
    private static schema = z.object({
        id: z.number().optional(),
        startAt: z.string().min(1, "La fecha de inicio es obligatoria.").optional(),
        endAt: z.string().optional(),
    });

    static validateField<K extends keyof UserRole>(field: K, value: any) {
        const fieldSchema = this.schema.pick({ [field]: true } as any);
        return fieldSchema.safeParse({ [field]: value });
    }
}
