import { NextResponse } from "next/server"

export function middleware(request) {
    // Vérifier si l'utilisateur a un token d'authentification
    const authToken = request.cookies.get("auth-token")?.value

    const { pathname } = request.nextUrl

    // Routes qui nécessitent une authentification
    const protectedRoutes = ["/dashboard"]
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // Routes d'authentification (login, register)
    const authRoutes = ["/login", "/register"]
    const isAuthRoute = authRoutes.includes(pathname)

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
    if (isProtectedRoute && !authToken) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Si l'utilisateur est connecté et essaie d'accéder aux pages de connexion
    if (isAuthRoute && authToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
}
