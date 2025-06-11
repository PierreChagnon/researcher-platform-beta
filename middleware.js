import { NextResponse } from "next/server"

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "researcher-platform-beta.vercel.app"

export function middleware(request) {
    const { pathname } = request.nextUrl
    const hostname = request.headers.get("host")

    // Vérifier si l'utilisateur a un token d'authentification
    const authToken = request.cookies.get("auth-token")?.value

    // Routes qui nécessitent une authentification
    const protectedRoutes = ["/dashboard"]
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // Routes d'authentification (login, register)
    const authRoutes = ["/login", "/register"]
    const isAuthRoute = authRoutes.includes(pathname)

    // 1. LOGIQUE D'AUTHENTIFICATION (prioritaire)
    if (isProtectedRoute && !authToken) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
    }

    if (isAuthRoute && authToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // 2. DÉTECTION SIMPLE DES CHERCHEURS (pas de validation ici)
    let researcherId = null
    let isPremium = false

    if (hostname && hostname.includes(DOMAIN)) {
        const subdomain = hostname.split(".")[0]
        const baseDomain = DOMAIN.split(".")[0] // researcher-platform-beta
        if (subdomain && subdomain !== "www" && subdomain !== baseDomain) {
            researcherId = subdomain
            isPremium = false

            // Si nous sommes sur le domaine principal avec un sous-domaine de chercheur,
            // et que nous ne sommes pas déjà dans /sites/*, rediriger vers /sites/
            if (!pathname.startsWith("/sites/") && !pathname.startsWith("/api/")) {
                return NextResponse.rewrite(new URL("/sites" + pathname, request.url))
            }
        }
    } else if (hostname && !hostname.includes("localhost") && !hostname.includes("vercel.app")) {
        // Domaine personnalisé (pour plus tard)
        isPremium = true

        // Si nous sommes sur un domaine personnalisé et pas déjà dans /sites/*,
        // rediriger vers /sites/
        if (!pathname.startsWith("/sites/") && !pathname.startsWith("/api/")) {
            return NextResponse.rewrite(new URL("/sites" + pathname, request.url))
        }
    }

    // 3. PASSER LES INFORMATIONS VIA HEADERS
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-researcher-id", researcherId || "")
    requestHeaders.set("x-is-premium", isPremium.toString())
    requestHeaders.set("x-hostname", hostname || "")

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
