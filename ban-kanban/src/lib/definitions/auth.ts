import { z } from 'zod';

export const RegisterFormSchema = z.object({
    full_name: z
        .string()
        .min(3)
        .max(50)
        .regex(/^[a-zA-Z ]+$/, "Full name must only contain letters and spaces")
        .trim(),
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .trim(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "At least one lowercase letter")
        .regex(/[A-Z]/, "At least one uppercase letter")
        .regex(/[0-9]/, "At least one number")
        .trim(),
    confirm_password: z
        .string()
        .trim()
}).superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ['confirm_password']
        });
    }
});

export const LoginFormSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .trim(),
    password: z
        .string()
        .min(1, "Password must not be empty")
        .trim()
});

export type RegisterFormState =
    | {
        errors?: {
            full_name?: string[];
            email?: string[];
            password?: string[];
            confirm_password?: string[];
        };
        message?: string;
    } | undefined

export type LoginFormState =
    | {
        errors?: {
            email?: string[];
            password?: string[];
        };
        message?: string;
    } | undefined