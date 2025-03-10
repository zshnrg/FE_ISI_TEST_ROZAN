'use server';

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SessionPayload } from "@/lib/definitions/session";

const secretKey = process.env.JWT_SECRET || 'secret'
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('ban-kanban')
        .setAudience('ban-kanban')
        .setExpirationTime('7d')
        .sign(encodedKey)

    return jwt
}

export async function decrypt(session: string | undefined = '') {
    if (!session) {
        return null
    }

    try {
        const { payload } = await jwtVerify(session, encodedKey, { issuer: 'ban-kanban', audience: 'ban-kanban' })
        return payload as SessionPayload
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime(); // Convert to number
    const session = await encrypt({ user_id: userId, expires_at: expiresAt })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function verifySession() {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session) {
        redirect('/auth')
    }

    return session
}

export async function destroySession() {
    (await cookies()).delete('session')
    redirect('/auth')
}