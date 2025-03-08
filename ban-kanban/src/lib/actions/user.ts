'use server';

import { cache } from "react";

import { query } from "../services/db";
import { verifySession } from "./session";

import { User } from "../types/auth";

export const getSelf = cache( async () => {
    const session = await verifySession();

    const { rows } = await query(
        `SELECT user_id, user_full_name, user_email, user_code
         FROM public.users
         WHERE user_id = $1`,
        [session.user_id]
    );

    return rows[0] as User;
})