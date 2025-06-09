import { z } from "zod";

export class AnswerValidator {
    private static schema = z.object({
        content: z.string().min(1, "El contenido no puede estar vacío.").optional(),
        user_id: z.number().int().positive("El ID de usuario debe ser válido.").optional(),
        security_question_id: z.number().int().positive("El ID de la pregunta debe ser válido.").optional(),
    });

    static validateField<K extends keyof z.infer<typeof this.schema>>(field: K, value: any) {
        const fieldSchema = this.schema.pick({ [field]: true } as any);
        return fieldSchema.safeParse({ [field]: value });
    }
}
