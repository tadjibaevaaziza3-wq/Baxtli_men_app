import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change"
);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Allow public assets and API health checks
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/auth") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // 2. Get token from cookies
    const token = req.cookies.get("auth_token")?.value;

    // 3. Handle TMA routes
    if (pathname.startsWith("/tma") || pathname === "/") {
        // TMA usually handles its own auth via initData on first load
        // but we can check for a session here if needed
        return NextResponse.next();
    }

    // 4. Protect Admin routes
    if (pathname.startsWith("/admin")) {
        const response = NextResponse.next();
        response.headers.set("X-Robots-Tag", "noindex, nofollow");

        if (!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            if (payload.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", req.url));
            }
            return response;
        } catch (e) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Add noindex for API
    if (pathname.startsWith("/api")) {
        const response = NextResponse.next();
        response.headers.set("X-Robots-Tag", "noindex");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (hook routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
