import { NextResponse } from "next/server"

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

    // 1. LOGIQUE D'AUTHENTIFICATION (existante)
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

    // 2. NOUVELLE LOGIQUE DE DÉTECTION DES CHERCHEURS
    // Seulement pour les routes publiques (pas dashboard, login, register, api)
    const isPublicSiteRoute =
        !pathname.startsWith("/dashboard") &&
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/register") &&
        !pathname.startsWith("/api") &&
        !pathname.startsWith("/_next")

    if (isPublicSiteRoute) {
        let researcherId = null
        let isPremium = false

        if (hostname && hostname.includes("researchsite.com")) {
            // Version basique : johndoe.researchsite.com
            const subdomain = hostname.split(".")[0]
            if (subdomain && subdomain !== "www" && subdomain !== "researchsite") {
                researcherId = subdomain
                isPremium = false
            }
        } else if (hostname && !hostname.includes("localhost") && !hostname.includes("vercel.app")) {
            // Version premium : domaine personnalisé (johndoe.fr)
            // TODO: Ici vous devrez faire une requête à votre base de données
            // pour trouver quel chercheur utilise ce domaine personnalisé
            // const researcher = await getResearcherByCustomDomain(hostname)
            // researcherId = researcher?.id
            isPremium = true

            // Pour l'instant, on peut simuler ou laisser null
            // researcherId sera déterminé dans les pages via une requête DB
        }

        // Ajouter les headers personnalisés pour les pages
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

    // Pour toutes les autres routes, continuer normalement
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
