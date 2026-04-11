import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { ticketsPath } from "@/constants/paths";

const DEMO_EMAIL = "visitor@welcome.com";
const DEMO_PASSWORD = "demo1234";

export async function GET(request: Request) {
    const base = new URL(request.url).origin;

    const user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });

    if (!user) {
        return NextResponse.redirect(new URL("/sign-in", base));
    }

    const valid = await verifyPassword(user.passwordHash, DEMO_PASSWORD);
    if (!valid) {
        return NextResponse.redirect(new URL("/sign-in", base));
    }

    const session = await createSession(user.id);

    const response = NextResponse.redirect(new URL(ticketsPath(), base));
    response.cookies.set("session", session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: session.expiresAt,
    });

    return response;
}
