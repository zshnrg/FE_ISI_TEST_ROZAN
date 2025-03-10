'use server';

import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/project"];
const publicRoutes = ["/auth/login", "/auth/register"];

export default async function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;

    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    const isRegisterSuccess = pathname === "/auth/register" && searchParams.has("type") && searchParams.get("type") === "success";
    const isPublic = publicRoutes.includes(pathname) && !isRegisterSuccess;
    const isProtected = pathname === "/" || protectedRoutes.includes(pathname) || isRegisterSuccess;

    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }

    if (isPublic && session) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
