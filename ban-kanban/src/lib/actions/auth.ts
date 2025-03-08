// /lib/data/auth.ts
'use server';

import { redirect } from "next/navigation";
import { hash, genSaltSync, compare } from "bcrypt";

import { query } from "@/lib/services/db";
import { createSession, destroySession } from "@/lib/actions/session";
import { LoginFormSchema, LoginFormState, RegisterFormSchema, RegisterFormState } from "@/lib/definitions/auth";

/**
 * Registers a new user.
 * 
 * @param full_name - The full name of the user.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @returns The registered user object.
 */

export async function register (
    state: RegisterFormState,
    formData: FormData
) {

    const validationResult = RegisterFormSchema.safeParse({
        full_name: formData.get("full_name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    });

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        };
    }

    const { full_name, email, password } = validationResult.data;

    const salt = genSaltSync(parseInt(process.env.SALT_ROUNDS || "10"));
    const hashedPassword = await hash(password, salt);

    // return only user_id, full_name, email, and code
    const { rows } = await query(
        `INSERT INTO users (user_full_name, user_email, user_password)
         VALUES ($1, $2, $3)
            RETURNING user_id, user_full_name, user_email, user_code`,
        [full_name, email, hashedPassword]
    );

    const user = rows[0];
    await createSession(user.user_id);
    redirect("/auth/register?type=success");
}

/**
 * Logs in a user with the provided form data.
 * 
 * @param state - The current state of the login form.
 * @param formData - The form data containing the email and password.
 * @returns An object with errors if the form data is invalid, or redirects to the home page if login is successful.
 */
export async function login (
    state: LoginFormState,
    formData: FormData
) {
    
    const validationResult = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        };
    }

    const { email, password } = validationResult.data;
    
    const { rows } = await query(
        `SELECT user_id, user_full_name, user_email, user_password
         FROM users
         WHERE user_email = $1`,
        [email]
    );

    console.log(rows);

    if (rows.length === 0) {
        return {
            message: "Invalid email or password."
        };
    }

    const user = rows[0];
    const isValid = await compare(password, user.user_password);

    if (!isValid) {
        return {
            message: "Invalid email or password."
        };
    }

    await createSession(user.user_id);
    redirect("/");
}

/**
 * Logs out the current user.
 */
export async function logout () {
    await destroySession();
}