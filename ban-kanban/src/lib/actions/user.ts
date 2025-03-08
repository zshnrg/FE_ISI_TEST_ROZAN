'use server';

import { cache } from "react";

import { query } from "../services/db";
import { verifySession } from "./session";

import { User } from "../types/auth";

export const getSelf = cache( async () => {
    const session = await verifySession();

    const { rows } = await query(
        `SELECT user_id, user_full_name, user_email, user_code, user_color
         FROM users
         WHERE user_id = $1`,
        [session.user_id]
    );

    return rows[0] as User;
})

export const getUser = cache( async (user_id: string) => {
    const { rows } = await query(
        `SELECT user_id, user_full_name, user_email, user_color
         FROM users
         WHERE user_id = $1`,
        [user_id]
    );

    return rows[0] as User;
})

export const getUserByCode = cache( async (user_code: string) => {
    const { rows } = await query(
        `SELECT user_id, user_full_name, user_email, user_color
         FROM users
         WHERE user_code = $1`,
        [user_code]
    );

    return rows[0] as User;
})