import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const requiresCoordinator = pathname.startsWith("/admin") || pathname === "/surveys/new" || /\/surveys\/[^/]+\/edit$/.test(pathname);
	if (!requiresCoordinator) return NextResponse.next();

	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const role = (token as { role?: string } | null)?.role;
	if (!role || role !== "COORDINATOR") {
		const url = req.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("callbackUrl", req.nextUrl.pathname);
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/surveys/new", "/surveys/:path*"],
};
