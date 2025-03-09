import { z } from "zod";

export const TaskFormSchema = z.object({
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
    color: z
        .string()
        .min(7, "Color must be a valid hex code")
        .max(7),
    start_date: z // datetime-local
        .string()
        .min(16, "Start date is required")
        .max(16),
    end_date: z // datetime-local
        .string()
        .min(16, "End date is required")
        .max(16),
    assignee: z
        .array(z.object({
            user_id: z.string(),
            user_full_name: z.string(),
            user_email: z.string(),
            user_color: z.string(),
            user_role: z.string(),
        }))
        .length(1, "Assignee is required")
});

export type TaskFormState = {
    errors?: {
        name?: string[];
        description?: string[];
        color?: string[];
        start_date?: string[];
        end_date?: string[];
        assignee?: string[];
    };
    message?: string;
    success?: boolean;
} | undefined;