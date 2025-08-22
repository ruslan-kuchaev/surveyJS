import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";

const credentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});

type AppJWT = JWT & { role?: "COORDINATOR" | "RESPONDENT" };

type MaybeRole = { role?: "COORDINATOR" | "RESPONDENT" };

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET })] : []),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(raw) {
                const parsed = credentialsSchema.safeParse(raw);
                if (!parsed.success) return null;
                const { email, password } = parsed.data;
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user || !user.passwordHash) return null;
                const ok = await bcrypt.compare(password, user.passwordHash);
                if (!ok) return null;
                return { id: user.id, name: user.name ?? undefined, email: user.email ?? undefined, image: user.image ?? undefined, role: user.role };
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub;
                session.user.role = (token as AppJWT).role;
            }
            return session;
        },
        async jwt({ token, user }) {
            const u = user as unknown as MaybeRole | undefined;
            if (u?.role) {
                (token as AppJWT).role = u.role;
            }
            return token;
        },
    },
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: "/login",
    },
    theme: {
        colorScheme: 'auto'
    }
};
