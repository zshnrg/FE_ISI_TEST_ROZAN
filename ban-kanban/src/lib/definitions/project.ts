import { z } from "zod";

export const ProjectFormSchema = z.object({
    name: z
        .string({
            required_error: "Name is required"
        })
        .min(3, "Name must be at least 3 characters long")
        .max(128)
        .trim(),
    description: z
        .string()
        .optional(),
    members: z
        .array(z.object({
            user_id: z.string(),
            user_full_name: z.string(),
            user_email: z.string(), 
            user_color: z.string(),
            user_role: z.string(),
        }))
});

export type ProjectFormState = {
    errors?: {
        name?: string[];
        description?: string[];
        members?: string[];
    };
    message?: string;
    success?: boolean;
} | undefined;